import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveDeploymentBase } from './deploymentBase'

export default defineConfig({
  base: resolveDeploymentBase(process.env.DEPLOY_BASE_PATH),
  plugins: [tailwindcss(), react()],
})
