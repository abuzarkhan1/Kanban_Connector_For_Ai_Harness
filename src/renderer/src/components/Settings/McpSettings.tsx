import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import type { McpHarnessStatusDto } from '@ipc'
import {
  McpPlugIcon,
  RefreshIcon,
  CheckIcon,
  AlertIcon,
  SpinnerIcon,
  CopyIcon,
  CloseIcon,
  LiveObserverBlip,
  TerminalIcon
} from '../icons'

export const McpSettings: React.FC = () => {
  const {
    mcpStatus,
    mcpVerifications,
    verifyingHarness,
    configureHarness,
    unconfigureHarness,
    verifyHarness,
    verifyAllHarnesses,
    addCustomHarness,
    removeCustomHarness,
    loadMcpStatus
  } = useBoardStore()

  const [configuring, setConfiguring] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ harness: string; msg: string; success: boolean } | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedDiagnosticHarness, setSelectedDiagnosticHarness] = useState<McpHarnessStatusDto | null>(null)
  const [showAddCustomModal, setShowAddCustomModal] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customPath, setCustomPath] = useState('')

  const handleConnect = async (h: McpHarnessStatusDto): Promise<void> => {
    setConfiguring(h.id)
    setFeedback(null)
    try {
      const res = await configureHarness(h.id, h.configPath)
      setFeedback({ harness: h.id, msg: res.message, success: res.success })
      if (res.success) {
        // Auto-run connection verification probe
        void verifyHarness(h.id)
      }
    } finally {
      setConfiguring(null)
    }
  }

  const handleDisconnect = async (h: McpHarnessStatusDto): Promise<void> => {
    setConfiguring(h.id)
    setFeedback(null)
    try {
      const res = await unconfigureHarness(h.id)
      setFeedback({ harness: h.id, msg: res.message, success: res.success })
    } finally {
      setConfiguring(null)
    }
  }

  const handleTestConnection = async (h: McpHarnessStatusDto): Promise<void> => {
    const result = await verifyHarness(h.id)
    if (!result.success) {
      setSelectedDiagnosticHarness(h)
    }
  }

  const handleAddCustom = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!customName.trim() || !customPath.trim()) return
    const res = await addCustomHarness(customName.trim(), customPath.trim())
    if (res.success) {
      setShowAddCustomModal(false)
      setCustomName('')
      setCustomPath('')
    }
    setFeedback({ harness: 'custom', msg: res.message, success: res.success })
  }

  const sampleJsonSnippet = JSON.stringify(
    {
      mcpServers: {
        kanban: {
          command: 'node',
          args: ['/path/to/ai-harness-project-manager/bin/kanban-mcp.js']
        }
      }
    },
    null,
    2
  )

  const copyConfigSnippet = (): void => {
    void navigator.clipboard.writeText(sampleJsonSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const harnesses = mcpStatus?.harnesses || []
  const antigravityHarnesses = harnesses.filter((h) => h.category === 'antigravity')
  const editorHarnesses = harnesses.filter((h) => h.category === 'claude' || h.category === 'editor')
  const customHarnesses = harnesses.filter((h) => h.isCustom)
  const connectedCount = harnesses.filter((h) => h.configured).length

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-snow">Model Context Protocol (MCP) & Agent Integrations</h1>
          <p className="text-xs text-ash">
            Seamlessly connect Google Antigravity (CLI, Desktop, IDE), Claude Code, Cursor, and custom agent harnesses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void verifyAllHarnesses()}
            disabled={verifyingHarness === 'all' || connectedCount === 0}
            className="flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card disabled:opacity-40"
          >
            {verifyingHarness === 'all' ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
            <span>{verifyingHarness === 'all' ? 'Verifying All…' : 'Verify All Connections'}</span>
          </button>
          <button
            type="button"
            onClick={() => void loadMcpStatus()}
            className="group flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
          >
            <RefreshIcon size="sm" animate="hover-rotate" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Live MCP Server Status Banner */}
      <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <McpPlugIcon size="md" animate="pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Kanban MCP Server Online</h2>
                <LiveObserverBlip />
              </div>
              <p className="mt-0.5 text-[11px] text-emerald-400/90">
                Direct Stdio JSON-RPC Bridge · {connectedCount} connected harness{connectedCount === 1 ? '' : 'es'} · 8 exposed agent tools
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-300">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px]">
              stdio: kanban-mcp.js
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 flex items-center justify-between rounded-md p-3 text-xs ${
            feedback.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
          }`}
        >
          <span>{feedback.msg}</span>
          <button type="button" onClick={() => setFeedback(null)} className="text-ash hover:text-snow">
            <CloseIcon size="xs" />
          </button>
        </div>
      )}

      {/* 1. Google Antigravity Ecosystem Section */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-snow">Google Antigravity Ecosystem</h2>
            <p className="text-xs text-ash">
              Configure and verify connections for all Antigravity variants (CLI, Desktop App, IDE).
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {antigravityHarnesses.map((h) => {
            const verification = mcpVerifications[h.id]
            const isVerifying = verifyingHarness === h.id || verifyingHarness === 'all'
            const isConfiguring = configuring === h.id

            return (
              <div
                key={h.id}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-semibold text-snow">{h.name}</h3>
                    {h.configured ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckIcon size="xs" />
                        <span>Connected</span>
                      </span>
                    ) : h.detected ? (
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        Detected
                      </span>
                    ) : (
                      <span className="rounded bg-surface-card px-2 py-0.5 text-[10px] text-ash">
                        Path Not Found
                      </span>
                    )}

                    {/* Verification Badge */}
                    {verification && (
                      <button
                        type="button"
                        onClick={() => setSelectedDiagnosticHarness(h)}
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          verification.success
                            ? 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                        <span>
                          {verification.success
                            ? `Verified (${verification.latencyMs ?? 0}ms · ${verification.toolsDiscovered ?? 8} tools)`
                            : 'Verification Failed'}
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-ash" title={h.configPath}>
                    {h.configPath}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {h.configured && (
                    <button
                      type="button"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                      className="flex items-center gap-1 rounded-md border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-snow hover:bg-surface-card disabled:opacity-40"
                    >
                      {isVerifying ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
                      <span>{isVerifying ? 'Testing…' : 'Test Connection'}</span>
                    </button>
                  )}

                  {verification && (
                    <button
                      type="button"
                      onClick={() => setSelectedDiagnosticHarness(h)}
                      className="rounded-md border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-ash hover:text-snow hover:bg-surface-card"
                    >
                      Diagnostics
                    </button>
                  )}

                  {h.configured ? (
                    <button
                      type="button"
                      onClick={() => void handleDisconnect(h)}
                      disabled={isConfiguring}
                      className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-40"
                    >
                      {isConfiguring ? 'Disconnecting…' : 'Disconnect'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleConnect(h)}
                      disabled={isConfiguring}
                      className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-snow hover:bg-surface-card disabled:opacity-40"
                    >
                      {isConfiguring ? 'Connecting…' : '1-Click Connect'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Claude, Cursor & AI IDEs Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-snow">Claude, Cursor & AI Code Editors</h2>
        <div className="space-y-3">
          {editorHarnesses.map((h) => {
            const verification = mcpVerifications[h.id]
            const isVerifying = verifyingHarness === h.id || verifyingHarness === 'all'
            const isConfiguring = configuring === h.id

            return (
              <div
                key={h.id}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-semibold text-snow">{h.name}</h3>
                    {h.configured ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckIcon size="xs" />
                        <span>Connected</span>
                      </span>
                    ) : h.detected ? (
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        Detected
                      </span>
                    ) : (
                      <span className="rounded bg-surface-card px-2 py-0.5 text-[10px] text-ash">
                        Not installed
                      </span>
                    )}

                    {verification && (
                      <button
                        type="button"
                        onClick={() => setSelectedDiagnosticHarness(h)}
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          verification.success
                            ? 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                        <span>
                          {verification.success
                            ? `Verified (${verification.latencyMs ?? 0}ms · ${verification.toolsDiscovered ?? 8} tools)`
                            : 'Verification Failed'}
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-ash" title={h.configPath}>
                    {h.configPath}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {h.configured && (
                    <button
                      type="button"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                      className="flex items-center gap-1 rounded-md border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-snow hover:bg-surface-card disabled:opacity-40"
                    >
                      {isVerifying ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
                      <span>{isVerifying ? 'Testing…' : 'Test Connection'}</span>
                    </button>
                  )}

                  {verification && (
                    <button
                      type="button"
                      onClick={() => setSelectedDiagnosticHarness(h)}
                      className="rounded-md border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-ash hover:text-snow hover:bg-surface-card"
                    >
                      Diagnostics
                    </button>
                  )}

                  {h.configured ? (
                    <button
                      type="button"
                      onClick={() => void handleDisconnect(h)}
                      disabled={isConfiguring}
                      className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-40"
                    >
                      {isConfiguring ? 'Disconnecting…' : 'Disconnect'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleConnect(h)}
                      disabled={isConfiguring}
                      className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-snow hover:bg-surface-card disabled:opacity-40"
                    >
                      {isConfiguring ? 'Connecting…' : '1-Click Connect'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Custom Harness & Path Section */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-snow">Custom Agent Harnesses & Configurations</h2>
            <p className="text-xs text-ash">
              Register any custom MCP config file path for proprietary agents or experimental tools.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCustomModal(true)}
            className="flex items-center gap-1 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
          >
            <span>+ Add Custom Path</span>
          </button>
        </div>

        {customHarnesses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-4 text-center text-xs text-ash">
            No custom agent harnesses registered yet. Click &quot;+ Add Custom Path&quot; to configure a custom config location.
          </div>
        ) : (
          <div className="space-y-3">
            {customHarnesses.map((h) => {
              const verification = mcpVerifications[h.id]
              const isVerifying = verifyingHarness === h.id

              return (
                <div
                  key={h.id}
                  className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-snow">{h.name}</h3>
                      {h.configured ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <CheckIcon size="xs" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <span className="rounded bg-surface-card px-2 py-0.5 text-[10px] text-ash">
                          Not configured
                        </span>
                      )}

                      {verification && (
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                            verification.success ? 'bg-sky-500/10 text-sky-400' : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                          <span>{verification.success ? `Verified (${verification.latencyMs}ms)` : 'Failed'}</span>
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-ash">{h.configPath}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                      className="rounded-md border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
                    >
                      {isVerifying ? 'Testing…' : 'Test'}
                    </button>
                    {h.configured ? (
                      <button
                        type="button"
                        onClick={() => void handleDisconnect(h)}
                        className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleConnect(h)}
                        className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-snow hover:bg-surface-card"
                      >
                        Connect
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void removeCustomHarness(h.id)}
                      className="text-ash hover:text-red-400 p-1"
                      title="Delete custom harness"
                    >
                      <CloseIcon size="xs" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 4. Live Recent MCP Tool Calls Audit Log */}
      {mcpStatus?.recentToolCalls && mcpStatus.recentToolCalls.length > 0 && (
        <div className="mb-8 rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <TerminalIcon size="sm" className="text-sky-400" />
              <h2 className="text-sm font-semibold text-snow">Live External Agent Activity (MCP Invocations)</h2>
            </div>
            <span className="text-[11px] text-ash font-mono">
              {mcpStatus.recentToolCalls.length} tool calls recorded
            </span>
          </div>

          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {mcpStatus.recentToolCalls.slice(0, 10).map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between rounded bg-surface-elevated px-3 py-2 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sky-400">{call.tool}</span>
                  {call.taskId && <span className="text-ash truncate max-w-xs">task: {call.taskId}</span>}
                </div>
                <span className="text-[10px] text-ash">
                  {new Date(call.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Manual JSON Configuration Box */}
      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h2 className="text-sm font-semibold text-snow">Manual MCP Configuration JSON</h2>
          <button
            type="button"
            onClick={copyConfigSnippet}
            className="flex items-center gap-1.5 rounded bg-surface-elevated px-2.5 py-1 text-xs font-medium text-snow hover:bg-surface-card"
          >
            {copied ? <CheckIcon size="xs" className="text-emerald-400" /> : <CopyIcon size="xs" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-ash">
          If you prefer to configure manually, copy and paste this definition into your harness config:
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-canvas p-3 font-mono text-xs text-ash">
          {sampleJsonSnippet}
        </pre>
      </div>

      {/* Diagnostic Trace Modal */}
      {selectedDiagnosticHarness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-lg border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <h3 className="text-sm font-bold text-snow">
                  Connection Diagnostics: {selectedDiagnosticHarness.name}
                </h3>
                <p className="text-[11px] font-mono text-ash truncate mt-0.5">
                  {selectedDiagnosticHarness.configPath}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDiagnosticHarness(null)}
                className="rounded p-1 text-ash hover:text-snow hover:bg-surface-elevated"
              >
                <CloseIcon size="sm" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {mcpVerifications[selectedDiagnosticHarness.id]?.diagnostics.map((diag, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 rounded-md p-3 text-xs ${
                    diag.status === 'ok'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : diag.status === 'warn'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  <div className="mt-0.5">
                    {diag.status === 'ok' ? (
                      <CheckIcon size="xs" />
                    ) : (
                      <AlertIcon size="xs" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold uppercase tracking-wider text-[10px]">
                      Step: {diag.step}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px]">{diag.message}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-6 text-xs text-ash">
                  No active diagnostics recorded. Click &quot;Test Connection&quot; to run live handshake probe.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => void handleTestConnection(selectedDiagnosticHarness)}
                disabled={verifyingHarness === selectedDiagnosticHarness.id}
                className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-snow hover:opacity-90 disabled:opacity-40"
              >
                {verifyingHarness === selectedDiagnosticHarness.id ? (
                  <SpinnerIcon size="xs" animate="spin" />
                ) : (
                  <RefreshIcon size="xs" />
                )}
                <span>Re-run Test</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDiagnosticHarness(null)}
                className="rounded-md border border-line bg-surface-elevated px-4 py-2 text-xs font-medium text-snow hover:bg-surface-card"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Harness Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleAddCustom} className="w-full max-w-md rounded-lg border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-sm font-bold text-snow">Register Custom Harness Config</h3>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="rounded p-1 text-ash hover:text-snow"
              >
                <CloseIcon size="sm" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-ash mb-1">Harness / Agent Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. My Custom Agent IDE"
                  className="w-full rounded border border-line bg-surface-elevated px-3 py-2 text-snow outline-none focus:border-white/40"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ash mb-1">Absolute Config File Path</label>
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="e.g. /Users/name/.my-agent/mcp_config.json"
                  className="w-full rounded border border-line bg-surface-elevated px-3 py-2 font-mono text-[11px] text-snow outline-none focus:border-white/40"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-snow hover:opacity-90"
              >
                Save &amp; Register
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
