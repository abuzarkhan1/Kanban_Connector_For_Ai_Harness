import React, { useEffect, useRef, useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import { useToastStore } from '../../stores/useToastStore'
import { api, unwrap } from '../../api/client'
import { DiagnosticsIcon, RefreshIcon, LiveObserverBlip, DownloadIcon, UploadIcon } from '../icons'
import { Button } from '../ui'

export const DiagnosticsView: React.FC = () => {
  const { diagnostics, loadDiagnostics, loadProjects } = useBoardStore()
  const addToast = useToastStore((s) => s.addToast)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    void loadDiagnostics()
  }, [loadDiagnostics])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = unwrap(await api.diagnostics.exportData())
      const jsonStr = JSON.stringify(res, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kanban-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addToast('success', 'Database backup exported successfully')
    } catch (err) {
      addToast('error', `Export failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setExporting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const res = unwrap(await api.diagnostics.importData({ jsonContent: text }))
      addToast('success', res.message || 'Backup imported successfully')
      await loadDiagnostics()
      await loadProjects()
    } catch (err) {
      addToast('error', `Import failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
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
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <DownloadIcon size="sm" />
            <span>{exporting ? 'Exporting…' : 'Export Backup'}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            <UploadIcon size="sm" />
            <span>{importing ? 'Importing…' : 'Restore Backup'}</span>
          </Button>
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
      </div>
      
      {!diagnostics ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-surface-elevated" />
          ))}
        </div>
      ) : (
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
