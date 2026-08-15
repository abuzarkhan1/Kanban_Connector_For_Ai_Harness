import React, { useMemo, useState } from 'react'
import type { BoardColumnDto, TaskDto } from '@ipc'
import { defaultStatusForColumn, type ColumnId, type InternalStatus } from '@domain/state-machine/status'
import type { Priority } from '@domain/value-objects/priority'
import { useBoardStore } from '../stores/useBoardStore'
import { useLocalStorage } from '../lib/useLocalStorage'
import { cx, IconButton, TextInput } from './ui'
import { TaskCard } from './TaskCard'
import {
  StatusTodoIcon,
  StatusInProgressIcon,
  StatusReviewIcon,
  StatusDoneIcon,
  SortIcon,
  ChevronLeftIcon,
  type IconProps
} from './icons'

const STATUS_ICONS: Record<ColumnId, React.ComponentType<IconProps>> = {
  TODO: StatusTodoIcon,
  IN_PROGRESS: StatusInProgressIcon,
  REVIEW: StatusReviewIcon,
  DONE: StatusDoneIcon
}

type SortMode = 'created' | 'updated' | 'priority'

const SORT_LABEL: Record<SortMode, string> = {
  created: 'created',
  updated: 'updated',
  priority: 'priority'
}

const SORT_ORDER: SortMode[] = ['created', 'updated', 'priority']

const PRIORITY_RANK: Record<Priority, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, URGENT: 3 }

function matchesQuery(task: TaskDto, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (task.title.toLowerCase().includes(q)) return true
  return task.labels.some((label) => label.toLowerCase().includes(q))
}

export function Column({ column, query }: { column: BoardColumnDto; query: string }) {
  const selectedProjectId = useBoardStore((s) => s.selectedProjectId)
  const board = useBoardStore((s) => s.board)
  const createTask = useBoardStore((s) => s.createTask)
  const moveTaskToColumn = useBoardStore((s) => s.moveTaskToColumn)
  const [title, setTitle] = useState('')
  const [isOver, setIsOver] = useState(false)
  const [collapsed, setCollapsed] = useLocalStorage(`ahpm:col:${selectedProjectId}:${column.id}`, false)
  const [sort, setSort] = useLocalStorage<SortMode>(`ahpm:sort:${selectedProjectId}:${column.id}`, 'created')

  const StatusIconComponent = STATUS_ICONS[column.id]

  // Map task id → current internal status so a drop on the same column is a no-op.
  const taskStatusById = useMemo(() => {
    const map = new Map<string, InternalStatus>()
    for (const c of board?.columns ?? []) {
      for (const t of c.tasks) map.set(t.id, t.status)
    }
    return map
  }, [board])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || !selectedProjectId) return
    void createTask({
      projectId: selectedProjectId,
      title: trimmed,
      status: defaultStatusForColumn(column.id)
    })
    setTitle('')
  }

  const cycleSort = () => {
    setSort(SORT_ORDER[(SORT_ORDER.indexOf(sort) + 1) % SORT_ORDER.length]!)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (!id || !taskStatusById.has(id)) return
    void moveTaskToColumn(id, column.id)
  }

  if (collapsed) {
    return (
      <section className="flex w-12 shrink-0 flex-col rounded-lg border border-hairline bg-surface">
        <button
          onClick={() => setCollapsed(false)}
          title={`Expand ${column.name}`}
          aria-label={`Expand ${column.name}`}
          className="focus-ring flex w-full flex-1 flex-col items-center gap-2.5 py-3"
        >
          <StatusIconComponent size="sm" className={column.id === 'DONE' ? 'text-ink' : 'text-mute'} />
          <span className="rounded-[5px] bg-surface-elevated px-1.5 py-px font-mono text-[10px] tabular-nums text-mute">
            {column.tasks.length}
          </span>
        </button>
      </section>
    )
  }

  const visibleTasks = column.tasks
    .filter((t) => matchesQuery(t, query))
    .sort((a, b) => {
      switch (sort) {
        case 'updated':
          return b.updatedAt - a.updatedAt
        case 'priority':
          return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
        default:
          return b.createdAt - a.createdAt
      }
    })

  return (
    <section
      onDragOver={(e) => {
        // Always arm the drop target
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (e.dataTransfer.types.includes('text/plain')) setIsOver(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false)
      }}
      onDrop={handleDrop}
      className={cx(
        'flex max-h-full w-[272px] shrink-0 flex-col rounded-lg border bg-surface transition-colors duration-150',
        isOver ? 'border-ink bg-surface-elevated' : 'border-hairline'
      )}
    >
      <header className="flex items-center justify-between border-b border-hairline px-3 py-2.5">
        <h2 className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-body">
          <StatusIconComponent size="xs" className={column.id === 'DONE' ? 'text-ink' : 'text-mute'} />
          <span className="truncate">{column.name}</span>
        </h2>
        <div className="flex shrink-0 items-center gap-0.5">
          <span className="rounded-[5px] bg-surface-elevated px-1.5 py-px font-mono text-[10px] tabular-nums text-mute">
            {visibleTasks.length}
          </span>
          <IconButton
            label={`Sort by ${SORT_LABEL[sort]} — click to change`}
            size="sm"
            onClick={cycleSort}
          >
            <SortIcon size="xs" />
          </IconButton>
          <IconButton label={`Collapse ${column.name}`} size="sm" onClick={() => setCollapsed(true)}>
            <ChevronLeftIcon size="xs" />
          </IconButton>
        </div>
      </header>

      <form onSubmit={handleCreate} className="px-2.5 pb-2.5 pt-2.5">
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="+ Add task"
          aria-label={`Add task to ${column.name}`}
          density="sm"
        />
      </form>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2.5 pb-2.5">
        {visibleTasks.length === 0 ? (
          <p className="px-1 py-2 text-[12px] leading-relaxed text-ash">
            {query.trim() ? 'No matches.' : 'No tasks here — add one above.'}
          </p>
        ) : (
          visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  )
}
