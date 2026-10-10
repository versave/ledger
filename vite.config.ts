import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { createApiHandler } from './server'

// Mounts the backend (API + PGlite + WebStorm bridge) inside the Vite dev server,
// so `npm run dev` runs the whole stack.
function apiPlugin(): Plugin {
  return {
    name: 'ledger-api',
    async configureServer(server) {
      const handler = await createApiHandler()
      server.middlewares.use('/api', handler)
    },
  }
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
})
