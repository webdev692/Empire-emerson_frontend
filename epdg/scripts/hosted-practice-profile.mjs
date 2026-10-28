import { isIP } from 'node:net';

export const HOSTED_PRACTICE_MODE = 'hosted-practice';
export const HOSTED_PRACTICE_OUTPUT = 'dist-hosted-practice';
const fields = ['version', 'environment', 'portalOrigins', 'backendOrigin'];
const check = (condition, message) => { if (!condition) throw new Error(message); };
function httpsOrigin(value) {
  check(typeof value === 'string', 'Hosted practice requires pinned HTTPS origins.');
  let url;
  try { url = new URL(value); } catch { throw new Error('Hosted practice requires pinned HTTPS origins.'); }
  check(url.protocol === 'https:' && url.origin === value && !url.username && !url.password && !url.port
    && !isIP(url.hostname) && url.hostname.includes('.')
    && !/(?:^|\.)(?:localhost|local|internal|invalid|test|example)$/.test(url.hostname),
  'Hosted practice requires pinned public HTTPS origins.');
  return value;
}
export function validateHostedPracticeProfile(value, env = process.env) {
  check(env.EPDG_HOSTED_PRACTICE_ENABLED === '1', 'Hosted practice is disabled; explicit build opt-in is required.');
  check(value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === fields.length && fields.every(field => Object.hasOwn(value, field))
    && value.version === 1 && value.environment === 'synthetic-hosted', 'Invalid hosted practice profile.');
  check(Array.isArray(value.portalOrigins) && value.portalOrigins.length >= 1 && value.portalOrigins.length <= 4,
    'Hosted practice requires a reviewed portal origin allowlist.');
  const portalOrigins = value.portalOrigins.map(httpsOrigin);
  check(new Set(portalOrigins).size === portalOrigins.length, 'Hosted practice portal origins must be unique.');
  const backendOrigin = httpsOrigin(value.backendOrigin);
  check(!portalOrigins.includes(backendOrigin), 'Hosted practice requires a separate isolated backend.');
  return Object.freeze({ version: 1, environment: 'synthetic-hosted', portalOrigins: Object.freeze(portalOrigins), backendOrigin });
}
export function hostedPracticeRedirects(profile) {
  return `/api/* ${profile.backendOrigin}/api/:splat 200!\n/* /index.html 200\n`;
}
export const hostedPracticeHeaders = `/*
  Cache-Control: no-store
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-Robots-Tag: noindex, nofollow
  X-EPDG-Environment: synthetic-hosted
  Permissions-Policy: camera=(), geolocation=(), microphone=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
`;
