import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { resolveConfig } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://127.0.0.1:58080';
const inline = { root, mode: 'synthetic-local', logLevel: 'silent' };
const resolveSynthetic = (overrides = {}, command = 'serve', preview = false) =>
  resolveConfig({ ...inline, ...overrides }, command, 'development', 'development', preview);

test('synthetic mode is development-only and cannot produce a publishable artifact', async () => {
  await assert.rejects(resolveSynthetic({}, 'build'), /development-only/);
  await assert.rejects(resolveSynthetic({}, 'serve', true), /development-only/);
});

test('synthetic mode ignores inherited production API settings and emits an isolated document', async () => {
  const previous = process.env.VITE_API_URL;
  process.env.VITE_API_URL = 'https://production-endpoint.invalid/api';
  try {
    const config = await resolveSynthetic();
    assert.equal(config.env.VITE_API_URL, undefined);
    assert.deepEqual(config.envPrefix, []);
    assert.equal(config.server.host, '127.0.0.1');
    assert.equal(config.server.port, 58080);
    assert.equal(config.server.strictPort, true);
    assert.equal(config.server.proxy, undefined);
    assert.equal(config.server.headers['Cache-Control'], 'no-store');
    const plugin = config.plugins.find(item => item.name === 'local-synthetic-isolation');
    const html = plugin.transformIndexHtml.handler('original production document');
    assert.match(html, /src="\/src\/synthetic\/main\.tsx"/);
    assert.match(html, /name="referrer" content="no-referrer"/);
    assert.doesNotMatch(html, /https:\/\/|canonical|og:url|fonts\.googleapis|manifest|serviceWorker|\/src\/main\.tsx/);
    assert.ok(!config.plugins.some(item => item.name === 'vite-plugin-pwa:build'));
    const csp = config.server.headers['Content-Security-Policy'];
    assert.match(csp, /connect-src 'self' http:\/\/127\.0\.0\.1:58000 ws:\/\/127\.0\.0\.1:58080;/);
    assert.match(csp, /font-src 'self';/);
  } finally {
    if (previous === undefined) delete process.env.VITE_API_URL;
    else process.env.VITE_API_URL = previous;
  }
});

test('CLI and inline options cannot broaden the synthetic listener or inject a proxy', async () => {
  for (const server of [
    { host: true }, { host: '0.0.0.0' }, { host: 'localhost' },
    { port: 5173 }, { strictPort: false },
    { origin: 'https://review.invalid' }, { https: {} },
    { proxy: { '/api': 'https://production-endpoint.invalid' } },
    { middlewareMode: true }, { hmr: false }, { hmr: { host: 'review.invalid' } },
    { fs: { strict: false } }, { fs: { allow: ['C:/'] } },
    { headers: { 'Content-Security-Policy': "default-src *" } },
  ]) {
    await assert.rejects(resolveSynthetic({ server }), /fixed loopback/, JSON.stringify(server));
  }
  await assert.rejects(resolveSynthetic({ base: '/portal/' }), /fixed loopback/);
  await assert.rejects(resolveSynthetic({ envPrefix: ['VITE_'] }), /fixed loopback/);
});

test('synthetic HTTP boundary rejects host substitution and cross-origin module requests', async () => {
  const config = await resolveSynthetic();
  const plugin = config.plugins.find(item => item.name === 'local-synthetic-isolation');
  let middleware;
  plugin.configureServer({ middlewares: { use(handler) { middleware = handler; } } });
  for (const headers of [
    { host: 'review.invalid:58080' },
    { host: 'localhost:58080' },
    { host: '127.0.0.1:58080', origin: 'https://review.invalid' },
  ]) {
    let passed = false;
    let ended = false;
    const response = { statusCode: 200, end() { ended = true; } };
    middleware({ headers }, response, () => { passed = true; });
    assert.equal(response.statusCode, 403);
    assert.equal(ended, true);
    assert.equal(passed, false);
  }
  for (const headers of [{ host: '127.0.0.1:58080' }, { host: '127.0.0.1:58080', origin }]) {
    let passed = false;
    middleware({ headers }, { end() { assert.fail('Authorized request was denied'); } }, () => { passed = true; });
    assert.equal(passed, true);
  }
});

test('normal and disconnected design modes keep their original HTML entries', async () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const mode of ['production', 'design-preview']) {
    const config = await resolveConfig({ root, mode, logLevel: 'silent' }, 'build');
    assert.ok(!config.plugins.some(item => item.name === 'local-synthetic-isolation'));
    assert.equal(Object.hasOwn(config.define ?? {}, '__EPDG_SYNTHETIC_LOGIN_ALIAS__'), false, 'Private login preference must never be defined for publishable modes');
    const plugin = config.plugins.find(item => item.name === 'isolated-portal-design-preview');
    const document = plugin.transformIndexHtml.handler(html);
    assert.doesNotMatch(document, /\/src\/synthetic\//);
    assert.ok(document.includes(mode === 'production' ? '/src/main.tsx' : '/src/design-preview/main.tsx'));
  }
});
