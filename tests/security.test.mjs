import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { canAccessRoute, getSafeRedirectPath } = require('../src/lib/auth-access.ts');
const paymentValidation = require('../src/lib/payment-validation.ts');
const { orderItemsSchema } = require('../src/lib/order-validation.ts');
const owner = { user: { id: 'buyer', role: 'user' } };

// Load the actual server action with isolated auth, database and service adapters.
// No request can reach a real database, Cloudinary account or payment provider.
function loadAction(relativePath, session, database, extra = {}) {
  const filename = fileURLToPath(new URL('../src/' + relativePath, import.meta.url));
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const localRequire = createRequire(filename);
  const mocks = {
    '@/auth.config': { auth: async () => session },
    '@/lib/prisma': database,
    '@/lib/payment-validation': paymentValidation,
    '@/lib/order-validation': { orderItemsSchema },
    'next/cache': { revalidatePath: () => {} },
    ...extra,
  };
  const actionModule = { exports: {} };
  const mockedRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith('@/')) throw new Error('Unmocked application dependency: ' + id);
    return localRequire(id);
  };
  new Function('require', 'module', 'exports', source)(mockedRequire, actionModule, actionModule.exports);
  return actionModule.exports;
}

function forbiddenDatabase(calls) {
  return new Proxy({}, {
    get: (_, model) => new Proxy({}, {
      get: (_, method) => () => {
        calls.push(String(model) + '.' + String(method));
        throw new Error('Unexpected database call');
      },
    }),
  });
}

for (const [path, user, expected] of [
  ['/', null, true],
  ['/auth/login', null, true],
  ['/checkout', null, false],
  ['/checkout/address', null, false],
  ['/profile', null, false],
  ['/orders/order-id', null, false],
  ['/admin/products', null, false],
  ['/admin/products', { id: 'buyer', role: 'user' }, false],
  ['/orders/order-id', { id: 'buyer', role: 'user' }, true],
  ['/checkout', { id: 'admin', role: 'admin' }, true],
  ['/admin/users', { id: 'admin', role: 'admin' }, true],
  ['/admin', { role: 'admin' }, false],
  ['/orders', { id: 'buyer', role: 'unexpected' }, false],
  ['/administrator', null, true],
]) {
  test(`route policy ${path} for ${user?.role || 'anonymous'}`, () => {
    assert.equal(canAccessRoute(path, user), expected);
  });
}

const productId = '00000000-0000-4000-8000-000000000001';
for (const quantity of [0, -1, 1.5, NaN]) {
  test(`invalid order quantity ${quantity} is rejected`, () => {
    assert.equal(orderItemsSchema.safeParse([{ productId, quantity, size: 'M' }]).success, false);
  });
}
test('valid order items are preserved and empty orders are rejected', () => {
  const items = [{ productId, quantity: 2, size: 'M' }];
  assert.deepEqual(orderItemsSchema.parse(items), items);
  assert.equal(orderItemsSchema.safeParse([]).success, false);
});

const order = { id: 'test-order', total: 115, transactionId: 'PAYPAL-123' };
const completedPayment = () => ({
  id: order.transactionId,
  status: 'COMPLETED',
  purchase_units: [{
    invoice_id: order.id,
    amount: { currency_code: 'USD', value: '115.00' },
    payments: { captures: [{ status: 'COMPLETED', amount: { currency_code: 'USD', value: '115.00' } }] },
  }],
});
test('a completed payment for the exact order and amount is accepted', () => {
  assert.equal(paymentValidation.paymentMatchesOrder(completedPayment(), order), true);
});
for (const [name, mutate] of [
  ['wrong transaction', (p) => { p.id = 'OTHER'; }],
  ['wrong invoice', (p) => { p.purchase_units[0].invoice_id = 'other-order'; }],
  ['underpayment', (p) => { p.purchase_units[0].amount.value = '1.00'; }],
  ['wrong currency', (p) => { p.purchase_units[0].amount.currency_code = 'EUR'; }],
  ['incomplete order', (p) => { p.status = 'APPROVED'; }],
  ['pending capture', (p) => { p.purchase_units[0].payments.captures[0].status = 'PENDING'; }],
  ['partial capture', (p) => { p.purchase_units[0].payments.captures[0].amount.value = '1.00'; }],
  ['missing capture', (p) => { p.purchase_units[0].payments.captures = []; }],
]) {
  test(`payment verification rejects ${name}`, () => {
    const payment = completedPayment();
    mutate(payment);
    assert.equal(paymentValidation.paymentMatchesOrder(payment, order), false);
  });
}

for (const [path, name, args] of [
  ['actions/product/create-update-product.ts', 'createUpdateProduct', [new FormData()]],
  ['actions/product/delete-product.ts', 'deleteProduct', [productId]],
  ['actions/product/delete-product-image.ts', 'deleteProductImage', [1, 'https://example.com/image.jpg']],
]) {
  for (const session of [null, owner]) {
    test(`${name} denies ${session ? 'normal users' : 'anonymous callers'} before side effects`, async () => {
      const calls = [];
      const action = loadAction(path, session, forbiddenDatabase(calls), {
        cloudinary: { v2: { config: () => {}, uploader: {
          upload: () => { calls.push('upload'); },
          destroy: () => { calls.push('destroy'); },
        } } },
      })[name];
      assert.equal((await action(...args)).ok, false);
      assert.deepEqual(calls, []);
    });
  }
}

for (const [path, name, args] of [
  ['actions/address/get-user-address.ts', 'getUserAddress', ['someone-else']],
  ['actions/address/set-user-address.ts', 'setUserAddress', [{}, 'someone-else']],
  ['actions/address/delete-user-address.ts', 'deleteUserAddress', ['someone-else']],
]) {
  test(`${name} denies access to another user's address before database calls`, async () => {
    const calls = [];
    const action = loadAction(path, owner, forbiddenDatabase(calls))[name];
    const result = await action(...args);
    assert.ok(result === null || result.ok === false);
    assert.deepEqual(calls, []);
  });
}

test('invalid item quantities are blocked by the real order action before database calls', async () => {
  const calls = [];
  const { placeOrder } = loadAction('actions/order/place-order.ts', owner, forbiddenDatabase(calls));
  const result = await placeOrder([{ productId, quantity: -5, size: 'M' }], {});
  assert.equal(result.ok, false);
  assert.deepEqual(calls, []);
});

test('saving a transaction is restricted to the current user and an unpaid order', async () => {
  let query;
  const { setTransactionId } = loadAction('actions/payment/set-transaction-id.ts', owner, {
    order: { updateMany: async (value) => { query = value; return { count: 0 }; } },
  });
  assert.equal((await setTransactionId('someone-elses-order', 'PAYPAL-123')).ok, false);
  assert.deepEqual(query.where, { id: 'someone-elses-order', userId: 'buyer', isPaid: false });
});

test('anonymous transaction changes are rejected before database calls', async () => {
  const calls = [];
  const { setTransactionId } = loadAction('actions/payment/set-transaction-id.ts', null, forbiddenDatabase(calls));
  assert.equal((await setTransactionId(order.id, order.transactionId)).ok, false);
  assert.deepEqual(calls, []);
});

for (const [name, valid] of [['correct payment', true], ['underpayment', false]]) {
  test(`real payment action handles ${name} with a simulated provider`, async (t) => {
    const previousOauth = process.env.PAYPAL_OAUTH_URL;
    const previousOrders = process.env.PAYPAL_ORDERS_URL;
    process.env.PAYPAL_OAUTH_URL = 'https://paypal.test/oauth';
    process.env.PAYPAL_ORDERS_URL = 'https://paypal.test/orders';
    t.after(() => {
      if (previousOauth === undefined) delete process.env.PAYPAL_OAUTH_URL;
      else process.env.PAYPAL_OAUTH_URL = previousOauth;
      if (previousOrders === undefined) delete process.env.PAYPAL_ORDERS_URL;
      else process.env.PAYPAL_ORDERS_URL = previousOrders;
    });
    const payment = completedPayment();
    if (!valid) payment.purchase_units[0].amount.value = '1.00';
    t.mock.method(globalThis, 'fetch', async (url) => {
      if (url === process.env.PAYPAL_OAUTH_URL) return Response.json({ access_token: 'fake-token' });
      assert.equal(url, 'https://paypal.test/orders/PAYPAL-123');
      return Response.json(payment);
    });
    const writes = [];
    const { paypalCheckPayment } = loadAction('actions/payment/paypal-check-payment.ts', owner, {
      order: {
        findFirst: async (query) => {
          assert.deepEqual(query.where, { transactionId: order.transactionId, userId: 'buyer' });
          return { ...order, isPaid: false };
        },
        updateMany: async (query) => { writes.push(query); return { count: 1 }; },
      },
    });
    assert.equal((await paypalCheckPayment(order.transactionId)).ok, valid);
    assert.equal(writes.length, valid ? 1 : 0);
    if (valid) {
      assert.equal(writes[0].where.userId, 'buyer');
      assert.equal(writes[0].where.isPaid, false);
    }
  });
}

test('anonymous payment verification never contacts the provider or database', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async () => { calls.push('fetch'); throw new Error('Unexpected network'); });
  const { paypalCheckPayment } = loadAction('actions/payment/paypal-check-payment.ts', null, forbiddenDatabase(calls));
  assert.equal((await paypalCheckPayment(order.transactionId)).ok, false);
  assert.deepEqual(calls, []);
});

for (const [target, expected] of [
  ['/checkout/address?step=1#form', '/checkout/address?step=1#form'],
  ['https://shop.test/orders', '/orders'],
  ['https://other.test/orders', '/'],
  ['//other.test/orders', '/'],
  ['javascript:alert(1)', '/'],
]) {
  test(`post-login redirect ${target} stays on the shop origin`, () => {
    assert.equal(getSafeRedirectPath(target, 'https://shop.test'), expected);
  });
}

test('patched Swiper renders with React 19 on the server', async () => {
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { Swiper, SwiperSlide } = await import('swiper/react');
  const html = renderToString(createElement(Swiper, null,
    createElement(SwiperSlide, null, 'Product image')
  ));
  assert.ok(html.includes('swiper-wrapper'));
  assert.ok(html.includes('swiper-slide'));
});

test('admin user listing selects only the fields displayed by the table', async () => {
  const account = { id: 'buyer', name: 'Test user', email: 'buyer@example.test', role: 'user', password: 'private-hash' };
  const { getPaginatedUsersAdmin } = loadAction('actions/user/get-paginated-users-admin.ts',
    { user: { id: 'admin', role: 'admin' } }, {
      user: {
        findMany: async (query) => {
          assert.deepEqual(query.select, { id: true, name: true, email: true, role: true });
          return [Object.fromEntries(Object.keys(query.select).map((key) => [key, account[key]]))];
        },
        count: async () => 1,
      },
    });
  const result = await getPaginatedUsersAdmin({});
  assert.equal(result.ok, true);
  assert.equal(result.users[0].id, 'buyer');
  assert.equal(Object.hasOwn(result.users[0], 'password'), false);
});

test('owners can attach a transaction to their own unpaid order', async () => {
  const { setTransactionId } = loadAction('actions/payment/set-transaction-id.ts', owner, {
    order: { updateMany: async (query) => {
      assert.deepEqual(query.where, { id: order.id, userId: 'buyer', isPaid: false });
      return { count: 1 };
    } },
  });
  assert.equal((await setTransactionId(order.id, order.transactionId)).ok, true);
});
