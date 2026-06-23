import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const base = '/Empire-emerson_frontend/EPDG-Landing-Page/'

export default defineConfig({
  base,
  plugins: [tailwindcss(), react()],
})
