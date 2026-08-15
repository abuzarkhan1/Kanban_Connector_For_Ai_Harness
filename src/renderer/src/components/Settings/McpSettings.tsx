import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import type { SupportedHarness } from '@ipc'
import { McpPlugIcon, RefreshIcon, CheckIcon, CopyIcon } from '../icons'

export const McpSettings: React.FC = () => {
  const { mcpStatus, configureHarness, loadMcpStatus } = useBoardStore()
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ harness: string; msg: string; success: boolean } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConnect = async (harness: SupportedHarness): Promise<void> => {
    setConfiguring(harness)
    setFeedback(null)
    try {
      const res = await configureHarness(harness)
      setFeedback({ harness, msg: res.message, success: res.success })
    } finally {
      setConfiguring(null)
    }
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

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-snow">Model Context Protocol (MCP) & Integrations</h1>
          <p className="text-xs text-ash">
            Connect AI coding harnesses to your local development control plane with bidirectional MCP integration
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadMcpStatus()}
          className="group flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
        >
          <RefreshIcon size="sm" animate="hover-rotate" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* MCP Server Banner */}
      <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <McpPlugIcon size="md" animate="pulse-slow" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-emerald-300">Kanban MCP Server Ready</h2>
              <p className="text-[11px] text-emerald-400/80">
                Listening for external harness connections over stdio and local protocol bridge
              </p>
            </div>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
            Transport: stdio
          </span>
        </div>
      </div>

      {/* 1-Click Connect Harnesses */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-snow">1-Click Auto-Configuration for AI Harnesses</h2>
        <p className="mb-4 text-xs text-ash">
          Automatically inject the Kanban MCP tools and server configuration into your local agent config files.
        </p>

        <div className="space-y-3">
          {mcpStatus?.harnesses.map((h) => (
            <div
              key={h.harness}
              className="flex items-center justify-between rounded-lg border border-line bg-surface p-4 transition-all hover:border-white/20"
            >
              <div>
                <div className="flex items-center gap-2">
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
                </div>
                <p className="mt-1 font-mono text-[11px] text-ash truncate max-w-xl">{h.configPath}</p>
              </div>

              <button
                type="button"
                onClick={() => handleConnect(h.harness)}
                disabled={configuring === h.harness}
                className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-snow hover:bg-surface-card disabled:opacity-40"
              >
                {configuring === h.harness
                  ? 'Connecting…'
                  : h.configured
                  ? 'Re-configure'
                  : '1-Click Connect'}
              </button>
            </div>
          ))}
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-md p-3 text-xs ${
              feedback.success ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
            }`}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Manual JSON Configuration */}
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
          Add this entry to your `mcp_config.json` or `claude_desktop_config.json`:
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-canvas p-3 font-mono text-xs text-ash">
          {sampleJsonSnippet}
        </pre>
      </div>

      {/* Supported MCP Tools Reference */}
      <div className="mt-6 rounded-lg border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-snow">Exposed MCP Tools for AI Agents</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
          <div className="rounded bg-surface-elevated p-2.5">
            <span className="font-mono font-semibold text-sky-400">kanban_list_tasks</span>
            <p className="mt-0.5 text-ash">List, query, and filter tasks by project or column status.</p>
          </div>
          <div className="rounded bg-surface-elevated p-2.5">
            <span className="font-mono font-semibold text-sky-400">kanban_move_task</span>
            <p className="mt-0.5 text-ash">Transition task state (e.g. TODO → IN_PROGRESS → REVIEW) with rationale.</p>
          </div>
          <div className="rounded bg-surface-elevated p-2.5">
            <span className="font-mono font-semibold text-sky-400">kanban_report_activity</span>
            <p className="mt-0.5 text-ash">Report execution milestones (modifying_files, running_tests, blocked).</p>
          </div>
          <div className="rounded bg-surface-elevated p-2.5">
            <span className="font-mono font-semibold text-sky-400">kanban_get_workspace_context</span>
            <p className="mt-0.5 text-ash">Resolve current repo, branch, and matching tasks for working directory.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
