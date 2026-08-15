import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devCspPlugin } from './build/dev-csp'

const alias = {
  '@domain': resolve(__dirname, 'src/packages/domain'),
  '@application': resolve(__dirname, 'src/packages/application'),
  '@persistence': resolve(__dirname, 'src/packages/persistence'),
  '@ipc': resolve(__dirname, 'src/packages/ipc'),
  '@engine': resolve(__dirname, 'src/packages/engine'),
  '@mcp': resolve(__dirname, 'src/packages/mcp'),
  '@shared': resolve(__dirname, 'src/packages/shared')
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          'mcp-cli': resolve(__dirname, 'src/mcp-cli/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias }
  },
  renderer: {
    plugins: [react(), tailwindcss(), devCspPlugin()],
    resolve: { alias }
  }
})
