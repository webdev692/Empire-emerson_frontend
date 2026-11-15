export const PORTAL_RELEASE_OUTPUT = 'dist-portal-release';

function exactHttps(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('An exact reviewed HTTPS origin is required.'); }
  if (url.protocol !== 'https:' || url.origin !== value || url.port || url.username || url.password
    || url.hostname === 'localhost' || /^\d/.test(url.hostname)) throw new Error('An exact reviewed HTTPS origin is required.');
  return url.origin;
}

// A build is a review artifact, never release authorization. Nothing reads .env,
// changes provider access protection, or selects a target from a default value.
export function validatePortalReleaseProfile(env) {
  if (env.EPDG_PORTAL_RELEASE_BUILD !== 'reviewed-candidate') throw new Error('Portal release build is held. Explicit candidate review configuration is required.');
  const portalOrigin = exactHttps(env.EPDG_PORTAL_RELEASE_ORIGIN);
  const apiOrigin = exactHttps(env.EPDG_PORTAL_RELEASE_API_ORIGIN);
  if (!apiOrigin.endsWith('.up.railway.app')) throw new Error('The reviewed API must be an exact Railway HTTPS origin.');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,99}$/.test(env.EPDG_PORTAL_TARGET_REVIEW ?? '')) throw new Error('A non-secret target review reference is required.');
  return { environment: 'portal-release-candidate', portalOrigin, apiOrigin, targetReview: env.EPDG_PORTAL_TARGET_REVIEW, releaseAuthorized: false };
}

export function portalReleaseRedirects(profile) {
  return `/api/* ${exactHttps(profile.apiOrigin)}/api/:splat 200!\n/* /index.html 200\n`;
}
export const portalReleaseHeaders = `/*
  Cache-Control: no-store
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  Permissions-Policy: camera=(), geolocation=(), microphone=()
  Referrer-Policy: no-referrer
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-Robots-Tag: noindex, nofollow
  X-EPDG-Environment: portal-release-candidate
`;
