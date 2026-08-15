import type { Database } from 'better-sqlite3'
import type { Transition } from '@domain/entities/Transition'

interface TransitionRow {
  id: string
  task_id: string
  from_status: string
  to_status: string
  actor: string
  confidence: number | null
  rule_id: string | null
  created_at: number
}

function toTransition(row: TransitionRow): Transition {
  return {
    id: row.id,
    taskId: row.task_id,
    fromStatus: row.from_status as Transition['fromStatus'],
    toStatus: row.to_status as Transition['toStatus'],
    actor: row.actor as Transition['actor'],
    confidence: row.confidence,
    ruleId: row.rule_id,
    createdAt: row.created_at
  }
}

export class TransitionRepository {
  constructor(private readonly db: Database) {}

  insert(transition: Transition): void {
    this.db
      .prepare(
        'INSERT INTO transitions (id, task_id, from_status, to_status, actor, confidence, rule_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        transition.id,
        transition.taskId,
        transition.fromStatus,
        transition.toStatus,
        transition.actor,
        transition.confidence,
        transition.ruleId,
        transition.createdAt
      )
  }

  listByTask(taskId: string): Transition[] {
    const rows = this.db
      .prepare('SELECT id, task_id, from_status, to_status, actor, confidence, rule_id, created_at FROM transitions WHERE task_id = ? ORDER BY created_at')
      .all(taskId) as TransitionRow[]
    return rows.map(toTransition)
  }
}
