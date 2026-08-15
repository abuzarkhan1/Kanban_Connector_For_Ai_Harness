import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Standalone dev server for the browser-only UI preview (src/renderer/preview.html).
 *
 * Not used by the Electron app (electron.vite.config.ts is). The preview installs
 * a mock `window.api` so the full UI can be iterated on in a plain browser tab.
 *
 * Run: npx vite --config vite.preview.config.ts  →  http://localhost:5199/preview.html
 */
export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@domain': resolve(__dirname, 'src/packages/domain'),
      '@application': resolve(__dirname, 'src/packages/application'),
      '@persistence': resolve(__dirname, 'src/packages/persistence'),
      '@ipc': resolve(__dirname, 'src/packages/ipc'),
      '@shared': resolve(__dirname, 'src/packages/shared')
    }
  },
  server: {
    port: 5199,
    strictPort: true
  }
})
