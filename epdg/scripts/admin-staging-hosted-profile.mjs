export const ADMIN_STAGING_HOSTED_OUTPUT = 'dist-admin-staging-hosted';

export function validateAdminStagingApiOrigin(value) {
  if (typeof value !== 'string' || value.length > 253) {
    throw new Error('EPDG_ADMIN_STAGING_API_ORIGIN must be the verified Railway HTTPS origin.');
  }
  let url;
  try { url = new URL(value); } catch {
    throw new Error('EPDG_ADMIN_STAGING_API_ORIGIN must be the verified Railway HTTPS origin.');
  }
  if (url.protocol !== 'https:' || url.origin !== value || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash || url.port
    || !url.hostname.endsWith('.up.railway.app') || url.hostname === 'up.railway.app') {
    throw new Error('EPDG_ADMIN_STAGING_API_ORIGIN must be one exact Railway HTTPS origin with no path.');
  }
  return url.origin;
}

export function adminStagingHostedRedirects(apiOrigin) {
  const origin = validateAdminStagingApiOrigin(apiOrigin);
  return `/api/* ${origin}/api/:splat 200!\n`;
}

export const adminStagingHostedHeaders = `/*
  Cache-Control: no-store
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  Permissions-Policy: camera=(), geolocation=(), microphone=()
  Referrer-Policy: no-referrer
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-EPDG-Environment: admin-staging-hosted
  X-Frame-Options: DENY
  X-Robots-Tag: noindex, nofollow
`;
