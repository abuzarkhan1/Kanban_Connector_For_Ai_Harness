import type { Database } from 'better-sqlite3'

export class SettingsRepository {
  constructor(private readonly db: Database) {}

  get<T>(key: string, defaultValue: T): T {
    const row = this.db.prepare('SELECT value_json FROM app_settings WHERE key = ?').get(key) as { value_json: string } | undefined
    if (!row) return defaultValue
    try {
      return JSON.parse(row.value_json) as T
    } catch {
      return defaultValue
    }
  }

  set<T>(key: string, value: T): void {
    this.db
      .prepare(
        `INSERT INTO app_settings (key, value_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET
           value_json = excluded.value_json,
           updated_at = excluded.updated_at`
      )
      .run(key, JSON.stringify(value), Date.now())
  }
}
