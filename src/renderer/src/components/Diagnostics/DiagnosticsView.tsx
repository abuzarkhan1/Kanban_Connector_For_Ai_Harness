import React, { useEffect } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { DiagnosticsIcon, RefreshIcon, LiveObserverBlip } from '../icons'
import { Button } from '../ui'

export const DiagnosticsView: React.FC = () => {
  const { diagnostics, loadDiagnostics } = useBoardStore()

  useEffect(() => {
    void loadDiagnostics()
  }, [loadDiagnostics])

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-md border border-hairline bg-surface text-ink">
            <DiagnosticsIcon size="md" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink">System Diagnostics &amp; Logs</h1>
            <p className="text-xs text-ash">
              Internal health metrics, observer engine status, database statistics, and structured logs
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void loadDiagnostics()}
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {diagnostics && (
        <>
          {/* Runtime Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
              <span className="label">Runtime &amp; Platform</span>
              <p className="mt-1 text-sm font-semibold text-ink">
                Electron {diagnostics.electronVersion} ({diagnostics.platform}/{diagnostics.arch})
              </p>
              <p className="font-mono text-[10px] text-ash">Node {diagnostics.nodeVersion}</p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
              <span className="label">Memory &amp; Uptime</span>
              <p className="mt-1 text-sm font-semibold text-ink">{diagnostics.memoryUsageMb} MB Heap</p>
              <p className="font-mono text-[10px] text-ash">Uptime: {diagnostics.uptimeSeconds}s</p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
              <span className="label">SQLite Database</span>
              <p className="mt-1 text-sm font-semibold text-ink">{diagnostics.dbSizeKb} KB (WAL Mode)</p>
              <p className="truncate font-mono text-[10px] text-ash" title={diagnostics.dbPath}>
                {diagnostics.dbPath}
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong">
              <span className="label">Entity Counts</span>
              <p className="mt-1 text-sm font-semibold text-ink">
                {diagnostics.counts.projects} Projects · {diagnostics.counts.tasks} Tasks
              </p>
              <p className="font-mono text-[10px] text-ash">
                {diagnostics.counts.repositories} Repos · {diagnostics.counts.events} Events
              </p>
            </div>
          </div>

          {/* Observer Status */}
          <div className="mt-6 rounded-lg border border-hairline bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Observer &amp; Engine Subsystem Status</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Git Intelligence</span>
                  <p className="mt-0.5 font-mono text-ink">{diagnostics.observers.git}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Filesystem Watcher</span>
                  <p className="mt-0.5 font-mono text-ink">{diagnostics.observers.filesystem}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Process Monitor</span>
                  <p className="mt-0.5 font-mono text-ink">{diagnostics.observers.process}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">MCP Protocol Bridge</span>
                  <p className="mt-0.5 font-mono text-ink">{diagnostics.observers.mcp}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
            </div>
          </div>

          {/* Structured Logs Stream */}
          <div className="mt-6 rounded-lg border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <h2 className="text-sm font-semibold text-ink">Recent Application Logs (Sanitized)</h2>
              <span className="font-mono text-[11px] text-ash">{diagnostics.recentLogs.length} entries</span>
            </div>
            <div className="mt-3 max-h-96 overflow-y-auto space-y-1.5 font-mono text-[11px]">
              {diagnostics.recentLogs.length === 0 ? (
                <div className="py-6 text-center text-ash">No log entries recorded.</div>
              ) : (
                diagnostics.recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded-md border border-hairline bg-surface-elevated p-2 text-ink"
                  >
                    <span className="shrink-0 text-ash">{String(log.ts).substring(11, 19)}</span>
                    <span
                      className={`shrink-0 font-bold ${
                        log.level === 'error'
                          ? 'text-status-danger'
                          : log.level === 'warn'
                          ? 'text-status-warning'
                          : 'text-status-info'
                      }`}
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="shrink-0 text-ash">[{log.component}]</span>
                    <span className="flex-1 break-all text-body">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
