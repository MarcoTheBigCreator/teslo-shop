export interface AccessUser {
  id?: string;
  role?: string;
}

const protectedRoutes = ['/checkout', '/profile', '/orders', '/admin'];
const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(route + '/');

export function canAccessRoute(pathname: string, user?: AccessUser | null) {
  if (!protectedRoutes.some((route) => matchesRoute(pathname, route))) return true;
  if (typeof user?.id !== 'string' || !user.id || !['user', 'admin'].includes(user.role ?? '')) return false;
  return !matchesRoute(pathname, '/admin') || user.role === 'admin';
}

export function getSafeRedirectPath(value: string | null, origin: string) {
  try {
    const target = new URL(value || '/', origin);
    return target.origin === new URL(origin).origin
      ? target.pathname + target.search + target.hash
      : '/';
  } catch {
    return '/';
  }
}
