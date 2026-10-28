// Preserve ordinary access-hold and disconnected design-preview HTTP rules.
// Hosted practice emits its separately reviewed rules from its own build plugin.
export const staticPortalRedirects = '/* /index.html 200\n';
export const staticPortalHeaders = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), microphone=()
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*.js
  Cache-Control: public, max-age=31536000, immutable
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
`;
