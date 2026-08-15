import React, { useState } from 'react'
import { Copy, CheckCircle2, Play, Server, Cpu } from 'lucide-react'

export const InteractiveTerminalMcp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'claude' | 'antigravity' | 'cursor' | 'windsurf'>('antigravity')
  const [copiedConfig, setCopiedConfig] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>('kanban_list_tasks')
  const [executing, setExecuting] = useState(false)

  const toolOutputs: Record<string, string> = {
    kanban_list_tasks: JSON.stringify(
      [
        {
          id: 'TASK-101',
          title: 'Implement Toast Notification System with Severity Channels',
          status: 'DONE',
          priority: 'HIGH',
          branch: 'feature/toast-system',
          labels: ['ui', 'toast', 'ux']
        },
        {
          id: 'TASK-102',
          title: 'Richer Task Cards & Advanced Filtering Engine',
          status: 'REVIEW',
          priority: 'HIGH',
          branch: 'feature/rich-cards-filters',
          labels: ['kanban', 'filters']
        },
        {
          id: 'TASK-103',
          title: 'Background Periodic Git Observation Loop',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          branch: 'feature/git-polling',
          labels: ['engine', 'git']
        }
      ],
      null,
      2
    ),
    kanban_move_task: JSON.stringify(
      {
        taskId: 'TASK-103',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'REVIEW',
        actor: 'INFERENCE_ENGINE',
        reason: 'Git commit detected with passing test suite',
        ruleId: 'RULE_GIT_COMMIT',
        confidence: 0.98,
        timestamp: 1786785600000
      },
      null,
      2
    ),
    kanban_get_workspace_context: JSON.stringify(
      {
        projectName: 'Ai Harness Project Manager',
        activeBranch: 'main',
        totalTasks: 7,
        openTasks: 0,
        linkedRepositories: [
          {
            name: 'Kanban_Connector_For_Ai_Harness',
            path: '/Users/abuzar/Desktop/kanban',
            branch: 'main'
          }
        ],
        observationEngine: {
          status: 'ACTIVE',
          pollIntervalMs: 8000
        }
      },
      null,
      2
    )
  }

  const configs = {
    antigravity: JSON.stringify(
      {
        mcpServers: {
          kanban: {
            command: 'npx',
            args: ['-y', 'kanban-mcp']
          }
        }
      },
      null,
      2
    ),
    claude: JSON.stringify(
      {
        mcpServers: {
          kanban: {
            command: 'npx',
            args: ['-y', 'kanban-mcp']
          }
        }
      },
      null,
      2
    ),
    cursor: JSON.stringify(
      {
        mcpServers: {
          kanban: {
            command: 'npx',
            args: ['-y', 'kanban-mcp']
          }
        }
      },
      null,
      2
    ),
    windsurf: JSON.stringify(
      {
        mcpServers: {
          kanban: {
            command: 'npx',
            args: ['-y', 'kanban-mcp']
          }
        }
      },
      null,
      2
    )
  }

  const copyCurrentConfig = () => {
    navigator.clipboard.writeText(configs[activeTab])
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  const handleRunTool = (toolName: string) => {
    setExecuting(true)
    setSelectedTool(toolName)
    setTimeout(() => setExecuting(false), 250)
  }

  return (
    <section id="mcp-playground" className="py-20 bg-[#07080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <Server className="size-3.5 text-cyan-400" />
            <span>Standard Model Context Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Plug Directly into Any AI Coding Harness
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            `kanban-mcp` exposes standard Model Context Protocol tools. AI agents query tasks, inspect workspace
            context, and report actions without touching any external API or database configuration.
          </p>
        </div>

        {/* Dual Layout: Interactive CLI + One-Click Config Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive MCP Terminal Simulator (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0d0f12] shadow-2xl overflow-hidden">
            <div className="p-3.5 border-b border-white/[0.08] bg-[#14171c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500/40 border border-red-500/80" />
                <span className="size-3 rounded-full bg-yellow-500/40 border border-yellow-500/80" />
                <span className="size-3 rounded-full bg-green-500/40 border border-green-500/80" />
                <span className="ml-2 font-mono text-[12px] text-[#c4c9d0]">Interactive MCP Tool Inspector</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-medium">stdio transport: ready</span>
            </div>

            <div className="p-4 bg-[#07080a]">
              {/* Tool Execution Selector */}
              <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <button
                  onClick={() => handleRunTool('kanban_list_tasks')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedTool === 'kanban_list_tasks'
                      ? 'bg-white text-[#07080a] font-semibold'
                      : 'bg-[#14171c] text-[#c4c9d0] hover:text-white border border-white/10'
                  }`}
                >
                  <Play className="size-3 fill-current" />
                  <span>kanban_list_tasks</span>
                </button>

                <button
                  onClick={() => handleRunTool('kanban_move_task')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedTool === 'kanban_move_task'
                      ? 'bg-white text-[#07080a] font-semibold'
                      : 'bg-[#14171c] text-[#c4c9d0] hover:text-white border border-white/10'
                  }`}
                >
                  <Play className="size-3 fill-current" />
                  <span>kanban_move_task</span>
                </button>

                <button
                  onClick={() => handleRunTool('kanban_get_workspace_context')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedTool === 'kanban_get_workspace_context'
                      ? 'bg-white text-[#07080a] font-semibold'
                      : 'bg-[#14171c] text-[#c4c9d0] hover:text-white border border-white/10'
                  }`}
                >
                  <Play className="size-3 fill-current" />
                  <span>kanban_get_workspace_context</span>
                </button>
              </div>

              {/* JSON Output Viewer */}
              <div className="relative rounded-xl border border-white/[0.06] bg-[#0d0f12] p-4 font-mono text-[12px] leading-relaxed text-[#c4c9d0] overflow-x-auto min-h-[260px]">
                {executing ? (
                  <div className="flex items-center gap-2 text-white/50 animate-pulse py-10 justify-center">
                    <Cpu className="size-4 animate-spin" />
                    <span>Executing MCP tool call via JSON-RPC 2.0...</span>
                  </div>
                ) : (
                  <pre className="text-[#f0f3f6]">
                    <code>{toolOutputs[selectedTool]}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: One-Click Harness Config (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0d0f12] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white tracking-tight">One-Click Harness Integration</h3>
                <button
                  onClick={copyCurrentConfig}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-[12px] font-mono text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedConfig ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>

              {/* Harness Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-[#14171c] p-1 mb-4">
                {(['antigravity', 'claude', 'cursor', 'windsurf'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-1.5 text-[11px] font-mono capitalize rounded transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-[#07080a] font-semibold shadow-xs'
                        : 'text-[#a0a5ad] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Config Code Block */}
              <div className="rounded-xl border border-white/[0.06] bg-[#07080a] p-4 font-mono text-[12px] text-[#c4c9d0] mb-4">
                <pre className="text-emerald-400">
                  <code>{configs[activeTab]}</code>
                </pre>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#14171c] text-[12px] text-[#a0a5ad] space-y-1">
              <span className="font-semibold text-white block">Zero Cloud Registration</span>
              <p>
                The connector communicates over local `stdio`. No API keys, no tokens, and no account required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
