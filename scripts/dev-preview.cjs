/**
 * Starts the browser-only UI preview dev server (see vite.preview.config.ts)
 * fully detached from this shell, so it keeps running after the command exits.
 *
 * Usage: node scripts/dev-preview.cjs
 * Then open http://localhost:5199/preview.html
 * Stop it with: lsof -ti tcp:5199 | xargs kill
 */
const { spawn } = require('node:child_process')
const { join } = require('node:path')

const root = join(__dirname, '..')
const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const child = spawn(npxBin, ['vite', '--config', 'vite.preview.config.ts'], {
  cwd: root,
  detached: true,
  stdio: 'ignore',
  env: { ...process.env }
})

child.unref()
console.log('UI preview server starting on http://localhost:5199/preview.html')
