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
  LiveObserverBlip,
  TerminalIcon
} from '../icons'
import { Button, IconButton, TextInput, Field, Badge } from '../ui'

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
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">Model Context Protocol (MCP) &amp; Agent Integrations</h1>
          <p className="text-xs text-ash">
            Seamlessly connect Google Antigravity (CLI, Desktop, IDE), Claude Code, Cursor, and custom agent harnesses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void verifyAllHarnesses()}
            disabled={verifyingHarness === 'all' || connectedCount === 0}
          >
            {verifyingHarness === 'all' ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
            <span>{verifyingHarness === 'all' ? 'Verifying All…' : 'Verify All Connections'}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void loadMcpStatus()}
          >
            <RefreshIcon size="sm" animate="hover-rotate" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Live MCP Server Status Banner */}
      <div className="mb-6 rounded-lg border border-status-success-border bg-status-success-bg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md border border-status-success-border bg-surface text-status-success">
              <McpPlugIcon size="md" animate="pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-status-success">Kanban MCP Server Online</h2>
                <LiveObserverBlip />
              </div>
              <p className="mt-0.5 text-[11px] text-mute">
                Direct Stdio JSON-RPC Bridge · {connectedCount} connected harness{connectedCount === 1 ? '' : 'es'} · 8 exposed agent tools
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-mute">
            <span className="rounded-[5px] border border-status-success-border bg-surface px-2 py-0.5 font-mono text-[10px]">
              stdio: kanban-mcp.js
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 flex items-center justify-between rounded-md p-3 text-xs border ${
            feedback.success
              ? 'border-status-success-border bg-status-success-bg text-status-success'
              : 'border-status-danger-border bg-status-danger-bg text-status-danger'
          }`}
        >
          <span>{feedback.msg}</span>
          <IconButton label="Dismiss feedback" size="sm" onClick={() => setFeedback(null)} />
        </div>
      )}

      {/* 1. Google Antigravity Ecosystem Section */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Google Antigravity Ecosystem</h2>
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
                className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-semibold text-ink">{h.name}</h3>
                    {h.configured ? (
                      <Badge className="badge-success">
                        <CheckIcon size="xs" />
                        <span>Connected</span>
                      </Badge>
                    ) : h.detected ? (
                      <Badge className="badge-warning">
                        Detected
                      </Badge>
                    ) : (
                      <Badge className="badge-neutral">
                        Path Not Found
                      </Badge>
                    )}

                    {/* Verification Badge */}
                    {verification && (
                      <button
                        type="button"
                        onClick={() => setSelectedDiagnosticHarness(h)}
                        className="focus-ring rounded-[5px]"
                      >
                        <Badge className={verification.success ? 'badge-info' : 'badge-danger'}>
                          {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                          <span>
                            {verification.success
                              ? `Verified (${verification.latencyMs ?? 0}ms · ${verification.toolsDiscovered ?? 8} tools)`
                              : 'Verification Failed'}
                          </span>
                        </Badge>
                      </button>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-ash" title={h.configPath}>
                    {h.configPath}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {h.configured && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
                      <span>{isVerifying ? 'Testing…' : 'Test Connection'}</span>
                    </Button>
                  )}

                  {verification && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDiagnosticHarness(h)}
                    >
                      Diagnostics
                    </Button>
                  )}

                  {h.configured ? (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => void handleDisconnect(h)}
                      disabled={isConfiguring}
                    >
                      {isConfiguring ? 'Disconnecting…' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => void handleConnect(h)}
                      disabled={isConfiguring}
                    >
                      {isConfiguring ? 'Connecting…' : '1-Click Connect'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Claude, Cursor & AI IDEs Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-ink">Claude, Cursor &amp; AI Code Editors</h2>
        <div className="space-y-3">
          {editorHarnesses.map((h) => {
            const verification = mcpVerifications[h.id]
            const isVerifying = verifyingHarness === h.id || verifyingHarness === 'all'
            const isConfiguring = configuring === h.id

            return (
              <div
                key={h.id}
                className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-semibold text-ink">{h.name}</h3>
                    {h.configured ? (
                      <Badge className="badge-success">
                        <CheckIcon size="xs" />
                        <span>Connected</span>
                      </Badge>
                    ) : h.detected ? (
                      <Badge className="badge-warning">
                        Detected
                      </Badge>
                    ) : (
                      <Badge className="badge-neutral">
                        Not installed
                      </Badge>
                    )}

                    {verification && (
                      <button
                        type="button"
                        onClick={() => setSelectedDiagnosticHarness(h)}
                        className="focus-ring rounded-[5px]"
                      >
                        <Badge className={verification.success ? 'badge-info' : 'badge-danger'}>
                          {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                          <span>
                            {verification.success
                              ? `Verified (${verification.latencyMs ?? 0}ms · ${verification.toolsDiscovered ?? 8} tools)`
                              : 'Verification Failed'}
                          </span>
                        </Badge>
                      </button>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-ash" title={h.configPath}>
                    {h.configPath}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {h.configured && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? <SpinnerIcon size="xs" animate="spin" /> : <McpPlugIcon size="xs" />}
                      <span>{isVerifying ? 'Testing…' : 'Test Connection'}</span>
                    </Button>
                  )}

                  {verification && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDiagnosticHarness(h)}
                    >
                      Diagnostics
                    </Button>
                  )}

                  {h.configured ? (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => void handleDisconnect(h)}
                      disabled={isConfiguring}
                    >
                      {isConfiguring ? 'Disconnecting…' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => void handleConnect(h)}
                      disabled={isConfiguring}
                    >
                      {isConfiguring ? 'Connecting…' : '1-Click Connect'}
                    </Button>
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
            <h2 className="text-sm font-semibold text-ink">Custom Agent Harnesses &amp; Configurations</h2>
            <p className="text-xs text-ash">
              Register any custom MCP config file path for proprietary agents or experimental tools.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowAddCustomModal(true)}
          >
            <span>+ Add Custom Path</span>
          </Button>
        </div>

        {customHarnesses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline p-4 text-center text-xs text-ash">
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
                  className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-hairline-strong sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-ink">{h.name}</h3>
                      {h.configured ? (
                        <Badge className="badge-success">
                          <CheckIcon size="xs" />
                          <span>Connected</span>
                        </Badge>
                      ) : (
                        <Badge className="badge-neutral">
                          Not configured
                        </Badge>
                      )}

                      {verification && (
                        <Badge className={verification.success ? 'badge-info' : 'badge-danger'}>
                          {verification.success ? <CheckIcon size="xs" /> : <AlertIcon size="xs" />}
                          <span>{verification.success ? `Verified (${verification.latencyMs}ms)` : 'Failed'}</span>
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-ash">{h.configPath}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleTestConnection(h)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Testing…' : 'Test'}
                    </Button>
                    {h.configured ? (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDisconnect(h)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => void handleConnect(h)}
                      >
                        Connect
                      </Button>
                    )}
                    <IconButton
                      label="Delete custom harness"
                      size="sm"
                      onClick={() => void removeCustomHarness(h.id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 4. Live Recent MCP Tool Calls Audit Log */}
      {mcpStatus?.recentToolCalls && mcpStatus.recentToolCalls.length > 0 && (
        <div className="mb-8 rounded-lg border border-hairline bg-surface p-5">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <TerminalIcon size="sm" className="text-mute" />
              <h2 className="text-sm font-semibold text-ink">Live External Agent Activity (MCP Invocations)</h2>
            </div>
            <span className="text-[11px] text-ash font-mono">
              {mcpStatus.recentToolCalls.length} tool calls recorded
            </span>
          </div>

          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {mcpStatus.recentToolCalls.slice(0, 10).map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated px-3 py-2 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{call.tool}</span>
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
      <div className="rounded-lg border border-hairline bg-surface p-5">
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <h2 className="text-sm font-semibold text-ink">Manual MCP Configuration JSON</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={copyConfigSnippet}
          >
            {copied ? <CheckIcon size="xs" className="text-status-success" /> : <CopyIcon size="xs" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </Button>
        </div>
        <p className="mt-2 text-xs text-ash">
          If you prefer to configure manually, copy and paste this definition into your harness config:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-md border border-hairline bg-canvas p-3 font-mono text-xs text-ash">
          {sampleJsonSnippet}
        </pre>
      </div>

      {/* Diagnostic Trace Modal */}
      {selectedDiagnosticHarness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-lg border border-hairline bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-sm font-bold text-ink">
                  Connection Diagnostics: {selectedDiagnosticHarness.name}
                </h3>
                <p className="text-[11px] font-mono text-ash truncate mt-0.5">
                  {selectedDiagnosticHarness.configPath}
                </p>
              </div>
              <IconButton
                label="Close modal"
                size="md"
                onClick={() => setSelectedDiagnosticHarness(null)}
              />
            </div>

            <div className="mt-4 space-y-3">
              {mcpVerifications[selectedDiagnosticHarness.id]?.diagnostics.map((diag, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 rounded-md p-3 text-xs border ${
                    diag.status === 'ok'
                      ? 'border-status-success-border bg-status-success-bg text-status-success'
                      : diag.status === 'warn'
                      ? 'border-status-warning-border bg-status-warning-bg text-status-warning'
                      : 'border-status-danger-border bg-status-danger-bg text-status-danger'
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
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => void handleTestConnection(selectedDiagnosticHarness)}
                disabled={verifyingHarness === selectedDiagnosticHarness.id}
              >
                {verifyingHarness === selectedDiagnosticHarness.id ? (
                  <SpinnerIcon size="xs" animate="spin" />
                ) : (
                  <RefreshIcon size="xs" />
                )}
                <span>Re-run Test</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDiagnosticHarness(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Harness Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleAddCustom} className="w-full max-w-md rounded-lg border border-hairline bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <h3 className="text-sm font-bold text-ink">Register Custom Harness Config</h3>
              <IconButton
                label="Close modal"
                size="sm"
                onClick={() => setShowAddCustomModal(false)}
              />
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <Field label="Harness / Agent Name">
                <TextInput
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. My Custom Agent IDE"
                  required
                />
              </Field>

              <Field label="Absolute Config File Path">
                <TextInput
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="/Users/name/.my-agent/mcp_config.json"
                  className="font-mono text-[11px]"
                  required
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowAddCustomModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Save &amp; Register
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
