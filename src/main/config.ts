import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LogLevel } from './logger'

export interface AppConfig {
  logLevel: LogLevel
  dbFileName: string
  logFileName: string
}

export const DEFAULT_CONFIG: AppConfig = {
  logLevel: 'info',
  dbFileName: 'ai-harness-pm.db',
  logFileName: 'main.log'
}

export function loadConfig(userDataDir: string): AppConfig {
  const file = join(userDataDir, 'config.json')
  if (!existsSync(file)) return DEFAULT_CONFIG
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as Partial<AppConfig>
    return { ...DEFAULT_CONFIG, ...parsed }
  } catch {
    // A corrupt config must not prevent startup; fall back to defaults.
    return DEFAULT_CONFIG
  }
}
