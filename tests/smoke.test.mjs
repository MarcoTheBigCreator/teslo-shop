import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const request = (path) => fetch(new URL(path, baseUrl), {
  redirect: 'manual',
  signal: AbortSignal.timeout(15_000),
});

for (const [path, expected] of [
  ['/auth/login', 'Correo electrónico'],
  ['/auth/new-account', 'Nueva cuenta'],
  ['/cart', 'Carrito'],
  ['/empty', ''],
]) {
  test(`public page ${path} renders`, async () => {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(expected));
  });
}

for (const path of [
  '/checkout', '/checkout/address', '/checkout/address?step=1', '/profile', '/orders',
  '/orders/00000000-0000-4000-8000-000000000001',
  '/admin/products', '/admin/users',
]) {
  test(`anonymous access to ${path} redirects to login`, async () => {
    const response = await request(path);
    assert.equal(response.status, 307);
    const location = new URL(response.headers.get('location'), baseUrl);
    assert.equal(location.origin, new URL(baseUrl).origin);
    assert.equal(location.pathname, '/auth/login');
    assert.equal(location.searchParams.get('redirectTo'), path);
  });
}

test('anonymous NextAuth session is null', async () => {
  const response = await request('/api/auth/session');
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test('credentials provider and CSRF protection are available', async () => {
  const providers = await request('/api/auth/providers');
  assert.equal(providers.status, 200);
  assert.equal((await providers.json()).credentials.type, 'credentials');
  const csrf = await request('/api/auth/csrf');
  assert.equal(csrf.status, 200);
  assert.ok((await csrf.json()).csrfToken);
  assert.ok(csrf.headers.get('set-cookie'));
});

test('compiled JavaScript and CSS are served', async () => {
  const response = await request('/auth/login');
  const html = await response.text();
  const assets = [...html.matchAll(/(?:src|href)="([^" ]+\.(?:js|css)(?:\?[^" ]*)?)"/g)]
    .map((match) => match[1]).filter((path) => path.startsWith('/_next/'));
  for (const extension of ['.js', '.css']) {
    const path = assets.find((path) => path.includes(extension));
    assert.ok(path, `missing ${extension} asset`);
    const asset = await request(path);
    assert.equal(asset.status, 200);
    assert.ok((await asset.arrayBuffer()).byteLength > 0);
  }
});
