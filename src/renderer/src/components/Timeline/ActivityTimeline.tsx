import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { RefreshIcon, TimelineIcon } from '../icons'
import { Button, Badge } from '../ui'

export const ActivityTimeline: React.FC = () => {
  const { events, loadEvents } = useBoardStore()
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', 'harness', 'filesystem', 'git', 'test', 'mcp', 'process']

  const filtered = filterCategory === 'all' ? events : events.filter((e) => e.category === filterCategory)

  const getBadgeClass = (category: string): string => {
    switch (category) {
      case 'harness':
        return 'badge-success'
      case 'git':
      case 'filesystem':
        return 'badge-info'
      case 'test':
        return 'badge-warning'
      case 'mcp':
        return 'badge-neutral'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-md border border-hairline bg-surface text-ink">
            <TimelineIcon size="md" animate="pulse-slow" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink">Activity Timeline</h1>
            <p className="text-xs text-ash">
              Live chronological stream of normalized development events and observer signals
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void loadEvents()}
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Stream</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-hairline pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors focus-ring ${
              filterCategory === cat
                ? 'border border-hairline bg-surface-elevated text-ink'
                : 'border border-transparent text-mute hover:bg-surface-elevated hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline p-12 text-center text-xs text-ash">
            No events recorded for this category yet.
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-lg border border-hairline bg-surface p-4 text-xs transition-colors hover:border-hairline-strong"
            >
              <div className="flex items-start gap-3">
                <Badge className={getBadgeClass(event.category)}>
                  {event.category}
                </Badge>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{event.type}</span>
                    <span className="font-mono text-[10px] text-ash">via {event.source}</span>
                  </div>

                  {event.payload && Object.keys(event.payload).length > 0 && (
                    <div className="mt-1.5 max-h-24 overflow-auto rounded-md border border-hairline bg-canvas p-2 font-mono text-[11px] text-ash">
                      {JSON.stringify(event.payload)}
                    </div>
                  )}
                </div>
              </div>

              <span className="shrink-0 font-mono text-[10px] text-ash">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
