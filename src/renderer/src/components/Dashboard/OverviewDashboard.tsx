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
  AgentIcon
} from '../icons'

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
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-snow">Project Overview & Metrics</h1>
          <p className="text-xs text-ash">Real-time control plane deriving state across coding harnesses</p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('kanban')}
          className="group flex items-center gap-1.5 rounded-md bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow ring-1 ring-white/10 hover:bg-surface-card"
        >
          <span>View Kanban Board</span>
          <ArrowRightIcon size="xs" animate="hover-nudge" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-lg border border-line bg-surface p-4 shadow-sm transition-all hover:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ash">Total Tasks</span>
            <ClipboardIcon size="lg" className="text-ash group-hover:text-snow" />
          </div>
          <p className="mt-2 text-2xl font-bold text-snow">{allTasks.length}</p>
          <p className="mt-1 text-[11px] text-ash">Across 4 lifecycle columns</p>
        </div>

        <div className="group rounded-lg border border-line bg-surface p-4 shadow-sm transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ash">In Progress</span>
            <ZapIcon
              size="lg"
              animate={activeSessions.length > 0 ? 'pulse' : 'none'}
              className="text-amber-400"
            />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{inProgress.length}</p>
          <p className="mt-1 text-[11px] text-ash">{activeSessions.length} active agent sessions</p>
        </div>

        <div className="group rounded-lg border border-line bg-surface p-4 shadow-sm transition-all hover:border-sky-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ash">Ready for Review</span>
            <SearchIcon size="lg" className="text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-sky-400">{inReview.length}</p>
          <p className="mt-1 text-[11px] text-ash">Tests passed & commits verified</p>
        </div>

        <div className="group rounded-lg border border-line bg-surface p-4 shadow-sm transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ash">Completed</span>
            <CheckCircleIcon size="lg" className="text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{completed.length}</p>
          <p className="mt-1 text-[11px] text-ash">
            {allTasks.length ? Math.round((completed.length / allTasks.length) * 100) : 0}% completion rate
          </p>
        </div>
      </div>

      {blocked.length > 0 && (
        <div className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertIcon size="md" animate="pulse-slow" />
            <span className="text-xs font-semibold">{blocked.length} Blocked Tasks Detected</span>
          </div>
          <div className="mt-2 space-y-1">
            {blocked.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-xs text-rose-200">
                <span>{t.title}</span>
                <span className="font-mono text-[10px] text-rose-400">Awaiting user permission or test fix</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subsystem Health Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <RepositoryIcon size="sm" className="text-ash" />
              <h2 className="text-sm font-semibold text-snow">Connected Repositories</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('repositories')}
              className="group flex items-center gap-1 text-xs text-ash hover:text-snow"
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
                <div key={repo.id} className="flex items-center justify-between rounded bg-surface-elevated p-3">
                  <div>
                    <p className="text-xs font-medium text-snow">{repo.name}</p>
                    <p className="font-mono text-[11px] text-ash truncate max-w-xs">{repo.path}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[10px] text-sky-300">
                      branch: {repo.currentBranch}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <AgentIcon size="sm" className="text-ash" />
              <h2 className="text-sm font-semibold text-snow">Active Agents & Harnesses</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('agents')}
              className="group flex items-center gap-1 text-xs text-ash hover:text-snow"
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
                <div key={agent.id} className="flex items-center justify-between rounded bg-surface-elevated p-3">
                  <div>
                    <p className="text-xs font-medium text-snow">{agent.displayName}</p>
                    <p className="font-mono text-[11px] text-ash">
                      {agent.type} (Level {agent.adapterLevel})
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
