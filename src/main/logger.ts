import { appendFileSync, mkdirSync, existsSync, statSync, unlinkSync } from 'node:fs'
import { dirname } from 'node:path'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogFields {
  [key: string]: unknown
}

export interface LogEntry {
  ts: string
  level: LogLevel
  component: string
  message: string
  [key: string]: unknown
}

export interface Logger {
  debug(component: string, message: string, fields?: LogFields): void
  info(component: string, message: string, fields?: LogFields): void
  warn(component: string, message: string, fields?: LogFields): void
  error(component: string, message: string, fields?: LogFields): void
  getRecentLogs(): LogEntry[]
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }
const MAX_LOG_SIZE_BYTES = 5 * 1024 * 1024 // 5MB rotation
const MAX_MEMORY_LOGS = 100

function redactSensitiveData(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return obj
      .replace(/(bearer\s+)[A-Za-z0-9_.-]{10,}/gi, '$1[REDACTED]')
      .replace(/(key[=:]\s*)[A-Za-z0-9_.-]{10,}/gi, '$1[REDACTED]')
      .replace(/(token[=:]\s*)[A-Za-z0-9_.-]{10,}/gi, '$1[REDACTED]')
  }
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) return obj.map(redactSensitiveData)
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (/password|secret|token|apiKey|auth/i.test(k) && typeof v === 'string') {
        sanitized[k] = '[REDACTED]'
      } else {
        sanitized[k] = redactSensitiveData(v)
      }
    }
    return sanitized
  }
  return obj
}

export function createLogger(options: { level: LogLevel; filePath: string }): Logger {
  const minOrder = LEVEL_ORDER[options.level]
  const recentLogs: LogEntry[] = []

  function write(level: LogLevel, component: string, message: string, fields?: LogFields): void {
    if (LEVEL_ORDER[level] < minOrder) return
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      component,
      message,
      ...(redactSensitiveData(fields) as Record<string, unknown>)
    }

    recentLogs.push(entry)
    if (recentLogs.length > MAX_MEMORY_LOGS) recentLogs.shift()

    const line = JSON.stringify(entry)
    console.log(line)

    try {
      mkdirSync(dirname(options.filePath), { recursive: true })

      // Check log size for rotation
      if (existsSync(options.filePath)) {
        const stats = statSync(options.filePath)
        if (stats.size > MAX_LOG_SIZE_BYTES) {
          unlinkSync(options.filePath)
        }
      }

      appendFileSync(options.filePath, line + '\n', 'utf8')
    } catch {
      // Logging must never take the application down.
    }
  }

  return {
    debug: (component, message, fields) => write('debug', component, message, fields),
    info: (component, message, fields) => write('info', component, message, fields),
    warn: (component, message, fields) => write('warn', component, message, fields),
    error: (component, message, fields) => write('error', component, message, fields),
    getRecentLogs: () => [...recentLogs]
  }
}
