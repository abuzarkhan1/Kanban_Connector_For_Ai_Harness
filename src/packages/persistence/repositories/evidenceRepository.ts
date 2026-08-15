import type { Database } from 'better-sqlite3'
import type { Evidence, EvidenceItem } from '@domain/entities/Evidence'
import { NotFoundError } from '@domain/errors/domainError'

interface EvidenceRow {
  id: string
  transition_id: string
  task_id: string
  rule_id: string
  confidence: number
  summary: string
  items_json: string
  created_at: number
}

function toEvidence(row: EvidenceRow): Evidence {
  let items: EvidenceItem[]
  try {
    items = JSON.parse(row.items_json) as EvidenceItem[]
  } catch {
    items = []
  }
  return {
    id: row.id,
    transitionId: row.transition_id,
    taskId: row.task_id,
    ruleId: row.rule_id,
    confidence: row.confidence,
    summary: row.summary,
    items,
    createdAt: row.created_at
  }
}

const SELECT_COLS = 'id, transition_id, task_id, rule_id, confidence, summary, items_json, created_at'

export class EvidenceRepository {
  constructor(private readonly db: Database) {}

  get(id: string): Evidence {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM evidence WHERE id = ?`).get(id) as EvidenceRow | undefined
    if (!row) throw new NotFoundError('Evidence', id)
    return toEvidence(row)
  }

  getByTransition(transitionId: string): Evidence | null {
    const row = this.db.prepare(`SELECT ${SELECT_COLS} FROM evidence WHERE transition_id = ?`).get(transitionId) as EvidenceRow | undefined
    return row ? toEvidence(row) : null
  }

  listByTask(taskId: string): Evidence[] {
    const rows = this.db
      .prepare(`SELECT ${SELECT_COLS} FROM evidence WHERE task_id = ? ORDER BY created_at DESC`)
      .all(taskId) as EvidenceRow[]
    return rows.map(toEvidence)
  }

  insert(evidence: Evidence): void {
    this.db
      .prepare(
        'INSERT INTO evidence (id, transition_id, task_id, rule_id, confidence, summary, items_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        evidence.id,
        evidence.transitionId,
        evidence.taskId,
        evidence.ruleId,
        evidence.confidence,
        evidence.summary,
        JSON.stringify(evidence.items),
        evidence.createdAt
      )
  }
}
