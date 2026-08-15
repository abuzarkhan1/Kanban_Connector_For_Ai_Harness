import React, { useEffect } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { DiagnosticsIcon, RefreshIcon, LiveObserverBlip } from '../icons'

export const DiagnosticsView: React.FC = () => {
  const { diagnostics, loadDiagnostics } = useBoardStore()

  useEffect(() => {
    void loadDiagnostics()
  }, [loadDiagnostics])

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-surface border border-hairline text-ink">
            <DiagnosticsIcon size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-snow">System Diagnostics & Logs</h1>
            <p className="text-xs text-ash">
              Internal health metrics, observer engine status, database statistics, and structured logs
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadDiagnostics()}
          className="group flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {diagnostics && (
        <>
          {/* Runtime Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20">
              <span className="text-xs font-medium text-ash">Runtime & Platform</span>
              <p className="mt-1 text-sm font-semibold text-snow">
                Electron {diagnostics.electronVersion} ({diagnostics.platform}/{diagnostics.arch})
              </p>
              <p className="font-mono text-[10px] text-ash">Node {diagnostics.nodeVersion}</p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20">
              <span className="text-xs font-medium text-ash">Memory & Uptime</span>
              <p className="mt-1 text-sm font-semibold text-snow">{diagnostics.memoryUsageMb} MB Heap</p>
              <p className="font-mono text-[10px] text-ash">Uptime: {diagnostics.uptimeSeconds}s</p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20">
              <span className="text-xs font-medium text-ash">SQLite Database</span>
              <p className="mt-1 text-sm font-semibold text-snow">{diagnostics.dbSizeKb} KB (WAL Mode)</p>
              <p className="truncate font-mono text-[10px] text-ash" title={diagnostics.dbPath}>
                {diagnostics.dbPath}
              </p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20">
              <span className="text-xs font-medium text-ash">Entity Counts</span>
              <p className="mt-1 text-sm font-semibold text-snow">
                {diagnostics.counts.projects} Projects · {diagnostics.counts.tasks} Tasks
              </p>
              <p className="font-mono text-[10px] text-ash">
                {diagnostics.counts.repositories} Repos · {diagnostics.counts.events} Events
              </p>
            </div>
          </div>

          {/* Observer Status */}
          <div className="mt-6 rounded-lg border border-line bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-snow">Observer & Engine Subsystem Status</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="flex items-center justify-between rounded bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Git Intelligence</span>
                  <p className="mt-0.5 font-mono text-emerald-400">{diagnostics.observers.git}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Filesystem Watcher</span>
                  <p className="mt-0.5 font-mono text-emerald-400">{diagnostics.observers.filesystem}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">Process Monitor</span>
                  <p className="mt-0.5 font-mono text-emerald-400">{diagnostics.observers.process}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
              <div className="flex items-center justify-between rounded bg-surface-elevated p-3">
                <div>
                  <span className="text-ash font-medium">MCP Protocol Bridge</span>
                  <p className="mt-0.5 font-mono text-emerald-400">{diagnostics.observers.mcp}</p>
                </div>
                <LiveObserverBlip status="active" />
              </div>
            </div>
          </div>

          {/* Structured Logs Stream */}
          <div className="mt-6 rounded-lg border border-line bg-surface p-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="text-sm font-semibold text-snow">Recent Application Logs (Sanitized)</h2>
              <span className="font-mono text-[11px] text-ash">{diagnostics.recentLogs.length} entries</span>
            </div>
            <div className="mt-3 max-h-96 overflow-y-auto space-y-1.5 font-mono text-[11px]">
              {diagnostics.recentLogs.length === 0 ? (
                <div className="py-6 text-center text-ash">No log entries recorded.</div>
              ) : (
                diagnostics.recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded bg-surface-elevated p-2 text-snow"
                  >
                    <span className="shrink-0 text-ash">{String(log.ts).substring(11, 19)}</span>
                    <span
                      className={`shrink-0 font-bold ${
                        log.level === 'error'
                          ? 'text-red-400'
                          : log.level === 'warn'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="shrink-0 text-ash">[{log.component}]</span>
                    <span className="flex-1 break-all text-slate-200">{log.message}</span>
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
