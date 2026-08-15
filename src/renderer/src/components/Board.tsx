import { useState } from 'react'
import { useBoardStore } from '../stores/useBoardStore'
import { Column } from './Column'
import { SearchIcon, CloseIcon } from './icons'

function BoardSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex w-[272px] shrink-0 flex-col rounded-lg border border-hairline bg-surface">
          <div className="h-9 border-b border-hairline" />
          <div className="space-y-2 p-2.5">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-[76px] animate-pulse rounded-md bg-surface-elevated" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Board() {
  const board = useBoardStore((s) => s.board)
  const [query, setQuery] = useState('')

  if (!board) {
    return <BoardSkeleton />
  }

  const totalTasks = board.columns.reduce((n, c) => n + c.tasks.length, 0)
  const openTasks = board.columns
    .filter((c) => c.id !== 'DONE')
    .reduce((n, c) => n + c.tasks.length, 0)
  const filtering = query.trim().length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-hairline px-5">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <h2 className="truncate text-[15px] font-medium tracking-tight text-ink">{board.projectName}</h2>
          <span className="hidden shrink-0 font-mono text-[10px] text-ash md:block">
            {board.projectId.slice(0, 8)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ash" aria-hidden>
              <SearchIcon size="xs" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setQuery('')
              }}
              placeholder="Filter tasks…"
              aria-label="Filter tasks"
              className="control h-8 w-52 pl-8 pr-7 text-[12px]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear filter"
                className="focus-ring absolute right-1.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded text-[11px] text-ash transition-colors hover:text-ink"
              >
                <CloseIcon size="xs" />
              </button>
            )}
          </div>
          <p className="font-mono text-[11px] tabular-nums text-mute">
            {totalTasks} tasks · {openTasks} open
          </p>
        </div>
      </header>

      {totalTasks === 0 && !filtering && (
        <div className="border-b border-hairline bg-surface px-5 py-2.5 text-[12px] leading-relaxed text-mute">
          This project has no tasks yet — use the “+ Add task” field at the top of any column to get started.
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-4">
        {board.columns.map((column) => (
          <Column key={column.id} column={column} query={query} />
        ))}
      </div>
    </div>
  )
}
