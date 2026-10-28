/* EPDG portal worker retirement v1. This is not an application cache worker. */
'use strict';

const portalPaths = new Set(['/', '/login', '/forgot-password', '/reset-password', '/account', '/change-password', '/dashboard']);
function isPortalPrecache(key, scope) {
  return /^workbox-precache-v[0-9]+-(.*)$/.exec(key)?.[1] === scope;
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const scope = new URL(self.registration.scope);
    if (scope.origin !== self.location.origin || scope.pathname !== '/' || scope.search || scope.hash) {
      throw new Error('Unexpected portal retirement scope.');
    }
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => isPortalPrecache(key, scope.href)).map(key => caches.delete(key)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.allSettled(windows.map(async client => {
      const url = new URL(client.url);
      if (url.origin !== scope.origin || !portalPaths.has(url.pathname)) return;
      client.postMessage({ type: 'epdg-portal-worker-retired', version: 1 });
      await client.navigate(url.href);
    }));
  })());
});
