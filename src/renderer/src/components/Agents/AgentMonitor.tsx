import React from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { AgentIcon, RefreshIcon, LiveObserverBlip } from '../icons'
import { Button, Badge } from '../ui'

export const AgentMonitor: React.FC = () => {
  const { agents, sessions, loadSessionsAndAgents } = useBoardStore()

  const getSessionBadgeClass = (state: string): string => {
    switch (state) {
      case 'running_tests':
        return 'badge-info'
      case 'modifying_files':
      case 'executing_commands':
        return 'badge-warning'
      case 'awaiting_permission':
      case 'failed':
      case 'stuck':
        return 'badge-danger'
      case 'finished':
        return 'badge-success'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">Agents &amp; Harness Sessions</h1>
          <p className="text-xs text-ash">
            Real-time monitor tracking AI coding harnesses, active execution states, and task sessions
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void loadSessionsAndAgents()}
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* Discovered Agents */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-ink">Detected Coding Harnesses</h2>
        {agents.length === 0 ? (
          <div className="rounded-lg border border-hairline bg-surface p-8 text-center text-xs text-ash">
            No agents or harness processes detected yet. Launch Antigravity CLI (`agy`), Claude Code (`claude`), or Cursor in your project directory.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-9 place-items-center rounded-md border border-hairline bg-surface-elevated text-ink">
                      <AgentIcon size="md" active={agent.status === 'active'} animate={agent.status === 'active' ? 'pulse-slow' : 'none'} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-ink">{agent.displayName}</h3>
                      <p className="font-mono text-[10px] text-ash">type: {agent.type}</p>
                    </div>
                  </div>
                  <LiveObserverBlip
                    status={agent.status === 'active' ? 'active' : 'idle'}
                    label={agent.status}
                  />
                </div>

                <div className="mt-4 space-y-1.5 border-t border-hairline pt-3 text-[11px]">
                  <div className="flex justify-between text-ash">
                    <span>Integration Level</span>
                    <span className="font-semibold text-ink">Level {agent.adapterLevel}</span>
                  </div>
                  {agent.processId && (
                    <div className="flex justify-between text-ash">
                      <span>Process PID</span>
                      <span className="font-mono text-ink">{agent.processId}</span>
                    </div>
                  )}
                  {agent.command && (
                    <div className="mt-1">
                      <span className="text-ash">Command:</span>
                      <p className="truncate font-mono text-[10px] text-mute">{agent.command}</p>
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
        <h2 className="mb-3 text-sm font-semibold text-ink">Live &amp; Recent Development Sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline p-8 text-center text-xs text-ash">
            No active development sessions recorded. Sessions start automatically when an AI harness begins work on a task.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-hairline bg-surface p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink">{session.agentType} Session</span>
                    <Badge className={getSessionBadgeClass(session.activityState)}>
                      {session.activityState.replace('_', ' ')}
                    </Badge>
                    {session.branch && (
                      <span className="rounded-[5px] border border-hairline bg-surface-card px-2 py-0.5 font-mono text-[10px] text-mute">
                        branch: {session.branch}
                      </span>
                    )}
                  </div>
                  {session.lastPrompt && (
                    <p className="mt-1.5 text-xs text-ash italic line-clamp-1">&quot;{session.lastPrompt}&quot;</p>
                  )}
                </div>

                <div className="text-right text-[11px] text-ash">
                  <p>Started: {new Date(session.startedAt).toLocaleTimeString()}</p>
                  <p className="font-mono text-[10px] text-mute">
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
