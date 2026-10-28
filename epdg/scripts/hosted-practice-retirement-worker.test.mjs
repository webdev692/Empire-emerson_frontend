import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./hosted-practice-retirement-worker.js', import.meta.url), 'utf8');
function harness({ scope = 'https://portal.example.com/', navigationFails = false } = {}) {
  const events = [], handlers = new Map();
  const origin = 'https://portal.example.com';
  const cacheNames = [`workbox-precache-v2-${origin}/`, `workbox-precache-v3-${origin}/`,
    `workbox-precache-v2-${origin}/other/`, 'workbox-precache-v2-https://other.example.com/', 'google-fonts-cache', 'other-app-cache'];
  const urls = [`${origin}/dashboard`, `${origin}/login?next=dashboard#private-fragment`, `${origin}/change-password`, `${origin}/other/`, 'https://other.example.com/dashboard'];
  const clients = urls.map((url, index) => ({ url,
    postMessage(message) { events.push(['message', index, JSON.parse(JSON.stringify(message))]); },
    async navigate(target) { events.push(['navigate', index, target]); if (navigationFails && index === 0) throw new Error('Window closed'); },
  }));
  runInNewContext(source, { URL, Set, Promise,
    caches: { async keys() { events.push(['cache-keys']); return cacheNames; }, async delete(key) { events.push(['delete-cache', key]); return true; } },
    self: { location: { origin }, registration: { scope, async unregister() { events.push(['unregister']); return true; } },
      async skipWaiting() { events.push(['skipWaiting']); },
      clients: { async matchAll(options) { events.push(['matchAll', JSON.parse(JSON.stringify(options))]); return clients; } },
      addEventListener(name, handler) { handlers.set(name, handler); },
    },
  });
  const run = async name => { const waits = []; handlers.get(name)({ waitUntil(promise) { waits.push(promise); } }); await Promise.all(waits); };
  return { events, handlers, run, origin };
}

test('retirement worker replaces the installed worker without installing a fetch or cache handler', async () => {
  const h = harness();
  assert.deepEqual([...h.handlers.keys()], ['install', 'activate']);
  await h.run('install'); assert.deepEqual(h.events, [['skipWaiting']]);
  assert.doesNotMatch(source, /\bfetch\s*\(|importScripts|addEventListener\(['"]fetch|\bcaches\.(?:open|match|put)\s*\(/);
});
test('activation deletes only portal scope-named precaches then unregisters and refreshes portal windows', async () => {
  const h = harness(); await h.run('activate');
  assert.deepEqual(h.events.filter(e => e[0] === 'delete-cache').map(e => e[1]), [`workbox-precache-v2-${h.origin}/`, `workbox-precache-v3-${h.origin}/`]);
  assert.deepEqual(h.events.filter(e => e[0] === 'navigate').map(e => e[1]), [0, 1, 2]);
  assert.ok(h.events.findIndex(e => e[0] === 'unregister') < h.events.findIndex(e => e[0] === 'navigate'));
  assert.deepEqual(h.events.filter(e => e[0] === 'message').map(e => e[2]), Array.from({ length: 3 }, () => ({ type: 'epdg-portal-worker-retired', version: 1 })));
  assert.deepEqual(h.events.find(e => e[0] === 'matchAll')[1], { type: 'window', includeUncontrolled: true });
});
test('retirement refuses unexpected scope before touching registrations caches or clients', async () => {
  for (const scope of ['https://other.example.com/', 'https://portal.example.com/other/', 'https://portal.example.com/?unexpected=1']) {
    const h = harness({ scope }); await assert.rejects(h.run('activate'), /Unexpected/); assert.deepEqual(h.events, []);
  }
});
test('a closed portal window does not prevent another portal window refreshing', async () => {
  const h = harness({ navigationFails: true }); await h.run('activate');
  assert.deepEqual(h.events.filter(e => e[0] === 'navigate').map(e => e[1]), [0, 1, 2]);
});
