import Database from 'better-sqlite3'
import { migrate } from './schema/migrations'

export interface DatabaseHandle {
  raw: Database.Database
  close(): void
}

/**
 * Open (or create) the application database, apply migrations, and configure
 * the connection. The path is supplied by the caller (the Electron main
 * process passes the userData directory); the persistence package itself never
 * touches Electron APIs.
 */
export function openDatabase(filePath: string): DatabaseHandle {
  const db = new Database(filePath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
  migrate(db)
  return {
    raw: db,
    close(): void {
      db.close()
    }
  }
}
