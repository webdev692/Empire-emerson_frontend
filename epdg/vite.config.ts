import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';
import { validateHostedPracticeProfile, hostedPracticeRedirects, hostedPracticeHeaders, HOSTED_PRACTICE_OUTPUT } from './scripts/hosted-practice-profile.mjs';

const syntheticOrigin = 'http://127.0.0.1:58080';
const syntheticRoot = fileURLToPath(new URL('.', import.meta.url));
const syntheticPolicy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' http://127.0.0.1:58000 ws://127.0.0.1:58080; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";

function syntheticLoginAlias() {
  const file = fileURLToPath(new URL('../../THE-EMERSON-EMPIRE_Backend/.local-synthetic/frontend-login-alias.json', import.meta.url));
  if (!existsSync(file)) return null;
  let value;
  try { value = JSON.parse(readFileSync(file, 'utf8')); } catch { throw new Error('Invalid private synthetic login alias'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).some(key => !['loginEmail', 'fixtureEmail'].includes(key))
    || typeof value.loginEmail !== 'string' || value.loginEmail.length > 150
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.loginEmail)
    || value.loginEmail !== value.loginEmail.trim().toLowerCase()
    || value.fixtureEmail !== 'learner-a@epdg.invalid') throw new Error('Invalid private synthetic login alias');
  return { loginEmail: value.loginEmail, fixtureEmail: value.fixtureEmail };
}

function syntheticIsolation(): Plugin {
  return {
    name: 'local-synthetic-isolation',
    configResolved(config) {
      const server = config.server;
      if (config.command !== 'serve'
        || server.host !== '127.0.0.1' || server.port !== 58080 || !server.strictPort
        || server.origin !== syntheticOrigin || server.https || server.proxy
        || server.middlewareMode || server.hmr === false
        || (typeof server.hmr === 'object' && Object.keys(server.hmr).length > 0)
        || config.base !== '/' || !Array.isArray(config.envPrefix) || config.envPrefix.length !== 0
        || !server.fs.strict || server.fs.allow.length !== 1 || server.fs.allow[0].replaceAll('\\', '/').replace(/\/$/, '').toLowerCase() !== syntheticRoot.replaceAll('\\', '/').replace(/\/$/, '').toLowerCase()
        || server.headers?.['Content-Security-Policy'] !== syntheticPolicy) {
        throw new Error('Synthetic portal requires the fixed loopback development server.');
      }
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.headers.host !== '127.0.0.1:58080'
          || (request.headers.origin && request.headers.origin !== syntheticOrigin)) {
          response.statusCode = 403;
          response.end('Synthetic portal is available only on its authorized loopback origin.');
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler() {
        // An independent document avoids production canonical tags, external fonts and PWA metadata.
        return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>EPDG Portal — Local synthetic environment</title></head>
<body><div id="root"></div><script type="module" src="/src/synthetic/main.tsx"></script></body></html>`;
      },
    },
  };
}

export default defineConfig(({ mode, command, isPreview }) => {
  const synthetic = mode === 'synthetic-local';
  const hosted = mode === 'hosted-practice';
  if (synthetic && (command !== 'serve' || isPreview)) {
    throw new Error('Synthetic portal is development-only; build and preview are prohibited.');
  }
  if (hosted && (command !== 'build' || isPreview)) throw new Error('Hosted practice requires an explicit reviewed build.');
  const hostedProfile = hosted ? validateHostedPracticeProfile(JSON.parse(readFileSync(new URL('./hosted-practice.config.json', import.meta.url), 'utf8'))) : null;
  return {
  ...(hostedProfile ? {
    envPrefix: [],
    define: { __EPDG_HOSTED_PRACTICE_PROFILE__: JSON.stringify({ environment: hostedProfile.environment, portalOrigins: hostedProfile.portalOrigins }) },
    build: { outDir: HOSTED_PRACTICE_OUTPUT, sourcemap: false, emptyOutDir: true },
  } : {}),
  ...(synthetic ? {
    // Non-secret login preference only. Passwords and runtime.json are never read.
    // Build/preview rejection above prevents this private alias from being published.
    define: { __EPDG_SYNTHETIC_LOGIN_ALIAS__: JSON.stringify(syntheticLoginAlias()) },
    // Custom VITE_ variables, including inherited production API settings, are never exposed here.
    envPrefix: [],
    server: {
      host: '127.0.0.1',
      port: 58080,
      strictPort: true,
      origin: syntheticOrigin,
      allowedHosts: ['127.0.0.1'],
      cors: { origin: syntheticOrigin },
      fs: { strict: true, allow: [syntheticRoot] },
      headers: {
        'X-EPDG-Environment': 'synthetic-local',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': syntheticPolicy,
      },
    },
  } : {}),
  plugins: [
    ...(synthetic ? [syntheticIsolation()] : []),
    ...(hostedProfile ? [{
      name: 'hosted-practice-isolation',
      configResolved(config) {
        if (config.base !== '/' || config.command !== 'build' || !Array.isArray(config.envPrefix) || config.envPrefix.length !== 0
          || config.build.outDir !== HOSTED_PRACTICE_OUTPUT || config.build.sourcemap) throw new Error('Hosted practice build profile cannot be broadened.');
      },
      transformIndexHtml: { order: 'pre' as const, handler() {
        return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /><title>EPDG Portal — Hosted synthetic practice</title></head>
<body><div id="root"></div><script type="module" src="/src/synthetic/hosted-main.tsx"></script></body></html>`;
      } },
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: '_redirects', source: hostedPracticeRedirects(hostedProfile) });
        this.emitFile({ type: 'asset', fileName: '_headers', source: hostedPracticeHeaders });
        this.emitFile({ type: 'asset', fileName: 'hosted-practice.json', source: JSON.stringify(hostedProfile, null, 2) + '\n' });
        // Existing installed workers check their exact prior script URL. A new
        // document alone cannot retire a worker still serving the old document.
        this.emitFile({ type: 'asset', fileName: 'sw.js', source: readFileSync(new URL('./scripts/hosted-practice-retirement-worker.js', import.meta.url), 'utf8') });
      },
    } satisfies Plugin] : []),
    {
      name: 'isolated-portal-design-preview',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return mode === 'design-preview'
            ? html.replace('/src/main.tsx', '/src/design-preview/main.tsx')
            : html;
        },
      },
    },
    tailwindcss(),
    react(),
    VitePWA({
      disable: mode === 'design-preview' || mode === 'synthetic-local' || hosted,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'EPDG Learning & Program Portal',
        short_name: 'EPDG Portal',
        description: 'Individual access to the EPDG Learning & Program Portal.',
        theme_color: '#12022A',
        background_color: '#12022A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        // Replace favicon.svg entries with proper pwa-192.png / pwa-512.png once icons are added to public/icons/
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api(?:\/|$)/],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /^\/api(?:\/|$)/.test(url.pathname),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  };
})
