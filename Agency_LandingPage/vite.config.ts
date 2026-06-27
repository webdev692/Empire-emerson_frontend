import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    target: 'esnext',
    cssMinify: true,
    // react-vendor is intentionally large; suppress false warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor';
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three-vendor';
          if (id.includes('node_modules/framer-motion')) return 'framer';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/lucide-react')) return 'icons';
        },
      },
    },
  },
})
