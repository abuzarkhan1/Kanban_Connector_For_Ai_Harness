import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

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
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'build/**/*.test.ts', 'tests/**/*.test.ts']
  }
})
