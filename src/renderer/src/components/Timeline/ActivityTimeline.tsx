import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { RefreshIcon, TimelineIcon } from '../icons'

export const ActivityTimeline: React.FC = () => {
  const { events, loadEvents } = useBoardStore()
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', 'harness', 'filesystem', 'git', 'test', 'mcp', 'process']

  const filtered = filterCategory === 'all' ? events : events.filter((e) => e.category === filterCategory)

  const getBadgeColor = (category: string): string => {
    switch (category) {
      case 'harness':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'git':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'test':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'mcp':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'filesystem':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-surface-elevated text-ash border-line'
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-surface border border-hairline text-ink">
            <TimelineIcon size="md" animate="pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-snow">Activity Timeline</h1>
            <p className="text-xs text-ash">
              Live chronological stream of normalized development events and observer signals
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadEvents()}
          className="group flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-surface-elevated text-snow'
                : 'text-ash hover:bg-surface-card hover:text-snow'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-12 text-center text-xs text-ash">
            No events recorded for this category yet.
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-lg border border-line bg-surface p-4 text-xs transition-all hover:bg-surface/80"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${getBadgeColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-snow">{event.type}</span>
                    <span className="font-mono text-[10px] text-ash">via {event.source}</span>
                  </div>

                  {event.payload && Object.keys(event.payload).length > 0 && (
                    <div className="mt-1.5 max-h-24 overflow-auto rounded bg-canvas/60 p-2 font-mono text-[11px] text-ash">
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
