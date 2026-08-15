import React from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import {
  ClipboardIcon,
  ZapIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertIcon,
  ArrowRightIcon,
  RepositoryIcon,
  AgentIcon,
  LiveObserverBlip
} from '../icons'
import { Button } from '../ui'

export const OverviewDashboard: React.FC = () => {
  const { board, repositories, agents, sessions, setCurrentView } = useBoardStore()

  const allTasks = board?.columns.flatMap((c) => c.tasks) || []
  const inProgress = allTasks.filter(
    (t) => t.status === 'IMPLEMENTING' || t.status === 'AGENT_STARTED' || t.status === 'TESTING'
  )
  const inReview = allTasks.filter(
    (t) => t.status === 'READY_FOR_REVIEW' || t.status === 'CHANGES_REQUESTED' || t.status === 'APPROVED'
  )
  const completed = allTasks.filter((t) => t.status === 'DONE' || t.status === 'MERGED')
  const blocked = allTasks.filter((t) => t.status === 'BLOCKED')

  const activeSessions = sessions.filter((s) => !s.endedAt)

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">Project Overview &amp; Metrics</h1>
          <p className="text-xs text-ash">Real-time control plane deriving state across coding harnesses</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentView('kanban')}
          className="group"
        >
          <span>View Kanban Board</span>
          <ArrowRightIcon size="xs" animate="hover-nudge" />
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
          <div className="flex items-center justify-between">
            <span className="label">Total Tasks</span>
            <ClipboardIcon size="lg" className="text-ash group-hover:text-ink" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{allTasks.length}</p>
          <p className="mt-1 font-mono text-[11px] text-ash">Across 4 lifecycle columns</p>
        </div>

        <div className="group rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
          <div className="flex items-center justify-between">
            <span className="label">In Progress</span>
            <ZapIcon
              size="lg"
              animate={activeSessions.length > 0 ? 'pulse' : 'none'}
              className="text-ash group-hover:text-ink"
            />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{inProgress.length}</p>
          <p className="mt-1 font-mono text-[11px] text-ash">{activeSessions.length} active agent sessions</p>
        </div>

        <div className="group rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
          <div className="flex items-center justify-between">
            <span className="label">Ready for Review</span>
            <SearchIcon size="lg" className="text-ash group-hover:text-ink" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{inReview.length}</p>
          <p className="mt-1 font-mono text-[11px] text-ash">Tests passed &amp; commits verified</p>
        </div>

        <div className="group rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
          <div className="flex items-center justify-between">
            <span className="label">Completed</span>
            <CheckCircleIcon size="lg" className="text-ash group-hover:text-ink" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{completed.length}</p>
          <p className="mt-1 font-mono text-[11px] text-ash">
            {allTasks.length ? Math.round((completed.length / allTasks.length) * 100) : 0}% completion rate
          </p>
        </div>
      </div>

      {blocked.length > 0 && (
        <div className="mt-6 rounded-lg border border-status-danger-border bg-status-danger-bg p-4">
          <div className="flex items-center gap-2 text-status-danger">
            <AlertIcon size="md" animate="pulse-slow" />
            <span className="text-xs font-semibold">{blocked.length} Blocked Tasks Detected</span>
          </div>
          <div className="mt-2 space-y-1">
            {blocked.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-xs text-body">
                <span>{t.title}</span>
                <span className="font-mono text-[10px] text-mute">Awaiting user permission or test fix</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subsystem Health Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <RepositoryIcon size="sm" className="text-mute" />
              <h2 className="text-sm font-semibold text-ink">Connected Repositories</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('repositories')}
              className="group flex items-center gap-1 text-xs text-mute hover:text-ink focus-ring rounded"
            >
              <span>Manage ({repositories.length})</span>
              <ArrowRightIcon size="xs" animate="hover-nudge" />
            </button>
          </div>
          {repositories.length === 0 ? (
            <div className="py-8 text-center text-xs text-ash">
              No repositories linked yet. Register a local Git repository to start automated observation.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {repositories.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                  <div>
                    <p className="text-xs font-medium text-ink">{repo.name}</p>
                    <p className="font-mono text-[11px] text-ash truncate max-w-xs">{repo.path}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-[5px] border border-hairline bg-surface-card px-2 py-0.5 font-mono text-[10px] text-mute">
                      branch: {repo.currentBranch}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <AgentIcon size="sm" className="text-mute" />
              <h2 className="text-sm font-semibold text-ink">Active Agents &amp; Harnesses</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('agents')}
              className="group flex items-center gap-1 text-xs text-mute hover:text-ink focus-ring rounded"
            >
              <span>View All ({agents.length})</span>
              <ArrowRightIcon size="xs" animate="hover-nudge" />
            </button>
          </div>
          {agents.length === 0 ? (
            <div className="py-8 text-center text-xs text-ash">
              No AI coding agents actively detected. Start Antigravity CLI, Claude Code, or Codex in your terminal.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                  <div>
                    <p className="text-xs font-medium text-ink">{agent.displayName}</p>
                    <p className="font-mono text-[11px] text-ash">
                      {agent.type} (Level {agent.adapterLevel})
                    </p>
                  </div>
                  <LiveObserverBlip status={agent.status === 'active' ? 'active' : 'idle'} label={agent.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
