export const SUPERADMIN_SUB = 'superadmin';
export const SUPERADMIN_ROLE = 'ADMIN';
export const SUPERADMIN_ACCESS_TTL = '8h';

export function getSuperadminCredentials() {
  const isDev = process.env.NODE_ENV !== 'production';
  const email = (
    process.env.SUPERADMIN_EMAIL || (isDev ? 'admin' : '')
  )
    .trim()
    .toLowerCase();
  const password =
    process.env.SUPERADMIN_PASSWORD || (isDev ? '1234' : '');
  return { email, password };
}
