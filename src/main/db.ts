import { join } from 'node:path'
import { openDatabase, type DatabaseHandle } from '@persistence'
import type { AppConfig } from './config'
import type { Logger } from './logger'

export function initDatabase(userDataDir: string, config: AppConfig, logger: Logger): DatabaseHandle {
  const handle = openDatabase(join(userDataDir, config.dbFileName))
  logger.info('db', 'database ready', { path: join(userDataDir, config.dbFileName) })
  return handle
}
