import { useState } from 'react'
import type { TaskDto } from '@ipc'
import type { Priority } from '@domain/value-objects/priority'
import { useBoardStore } from '../stores/useBoardStore'
import { formatRelative } from '../lib/format'
import { Badge, cx } from './ui'
import { RepositoryIcon } from './icons'

/**
 * Priority as a monochrome escalation ladder: outline → light fill → strong
 * fill → inverted. Readable at a glance without relying on hue.
 */
const PRIORITY_STYLE: Record<Priority, string> = {
  LOW: 'border-hairline text-ash',
  MEDIUM: 'border-transparent bg-surface-elevated text-body',
  HIGH: 'border-transparent bg-stone text-ink',
  URGENT: 'border-transparent bg-primary text-on-primary'
}

export function TaskCard({ task }: { task: TaskDto }) {
  const selectTask = useBoardStore((s) => s.selectTask)
  const selectedTaskId = useBoardStore((s) => s.selectedTaskId)
  const selected = selectedTaskId === task.id
  const [dragging, setDragging] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      title={task.title}
      onClick={() => selectTask(task.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          selectTask(task.id)
        }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id)
        e.dataTransfer.effectAllowed = 'move'
        setDragging(true)
      }}
      onDragEnd={() => setDragging(false)}
      aria-pressed={selected}
      className={cx(
        'cursor-grab select-none rounded-md border p-3 text-left transition-opacity duration-150 active:cursor-grabbing',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        dragging && 'opacity-40',
        selected ? 'border-ink bg-surface-elevated' : 'border-hairline bg-surface-card hover:border-ash/70'
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-[13px] font-medium leading-snug text-ink">{task.title}</p>
        {task.automationMode === 'AUTO' && (
          <span className="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
            AUTO
          </span>
        )}
      </div>

      {task.branch && (
        <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-sky-400">
          <RepositoryIcon size="xs" />
          <span className="truncate max-w-[160px]">{task.branch}</span>
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge className={PRIORITY_STYLE[task.priority]}>{task.priority}</Badge>
        {task.labels.slice(0, 2).map((label) => (
          <span
            key={label}
            title={label}
            className="max-w-[110px] truncate rounded-[5px] border border-hairline/70 bg-surface-elevated px-1.5 py-[2px] text-[10px] text-mute"
          >
            {label}
          </span>
        ))}
        {task.labels.length > 2 && (
          <span className="font-mono text-[10px] text-ash">+{task.labels.length - 2}</span>
        )}
        <span className="ml-auto font-mono text-[10px] tabular-nums text-ash">
          {formatRelative(task.createdAt)}
        </span>
      </div>
    </div>
  )
}
