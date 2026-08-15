#!/usr/bin/env node
const { resolve } = require('node:path')

try {
  require(resolve(__dirname, '../out/main/mcp-cli.js'))
} catch (err) {
  console.error('Error starting kanban-mcp server:', err)
  process.exit(1)
}
