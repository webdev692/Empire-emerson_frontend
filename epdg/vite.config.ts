import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
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
      disable: mode === 'design-preview',
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
}))
