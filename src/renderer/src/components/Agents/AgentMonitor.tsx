import React from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { AgentIcon, RefreshIcon, LiveObserverBlip } from '../icons'

export const AgentMonitor: React.FC = () => {
  const { agents, sessions, loadSessionsAndAgents } = useBoardStore()

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-snow">Agents & Harness Sessions</h1>
          <p className="text-xs text-ash">
            Real-time monitor tracking AI coding harnesses, active execution states, and task sessions
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSessionsAndAgents()}
          className="group flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Discovered Agents */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-snow">Detected Coding Harnesses</h2>
        {agents.length === 0 ? (
          <div className="rounded-lg border border-line bg-surface p-8 text-center text-xs text-ash">
            No agents or harness processes detected yet. Launch Antigravity CLI (`agy`), Claude Code (`claude`), or Cursor in your project directory.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-lg border border-line bg-surface p-4 shadow-sm transition-all hover:border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-9 place-items-center rounded-lg bg-surface-elevated border border-hairline text-ink">
                      <AgentIcon size="md" active={agent.status === 'active'} animate={agent.status === 'active' ? 'pulse-slow' : 'none'} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-snow">{agent.displayName}</h3>
                      <p className="font-mono text-[10px] text-ash">type: {agent.type}</p>
                    </div>
                  </div>
                  <LiveObserverBlip
                    status={agent.status === 'active' ? 'active' : 'idle'}
                    label={agent.status}
                  />
                </div>

                <div className="mt-4 space-y-1.5 border-t border-line/60 pt-3 text-[11px]">
                  <div className="flex justify-between text-ash">
                    <span>Integration Level</span>
                    <span className="font-semibold text-snow">Level {agent.adapterLevel}</span>
                  </div>
                  {agent.processId && (
                    <div className="flex justify-between text-ash">
                      <span>Process PID</span>
                      <span className="font-mono text-snow">{agent.processId}</span>
                    </div>
                  )}
                  {agent.command && (
                    <div className="mt-1">
                      <span className="text-ash">Command:</span>
                      <p className="truncate font-mono text-[10px] text-sky-300">{agent.command}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-snow">Live & Recent Development Sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-8 text-center text-xs text-ash">
            No active development sessions recorded. Sessions start automatically when an AI harness begins work on a task.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-line bg-surface p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-snow">{session.agentType} Session</span>
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      session.activityState === 'running_tests'
                        ? 'bg-purple-500/10 text-purple-300'
                        : session.activityState === 'modifying_files'
                        ? 'bg-amber-500/10 text-amber-300'
                        : session.activityState === 'awaiting_permission'
                        ? 'bg-rose-500/10 text-rose-300'
                        : 'bg-surface-elevated text-ash'
                    }`}>
                      state: {session.activityState}
                    </span>
                    {session.branch && (
                      <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[10px] text-sky-400">
                        branch: {session.branch}
                      </span>
                    )}
                  </div>
                  {session.lastPrompt && (
                    <p className="mt-1.5 text-xs text-ash italic line-clamp-1">"{session.lastPrompt}"</p>
                  )}
                </div>

                <div className="text-right text-[11px] text-ash">
                  <p>Started: {new Date(session.startedAt).toLocaleTimeString()}</p>
                  <p className="font-mono text-[10px]">
                    {session.endedAt ? 'Completed' : 'Active'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
