import React, { useState } from 'react'
import {
  Bot,
  Terminal,
  GitBranch,
  Copy,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sounds } from '../lib/audio'

interface NodeItem {
  id: string
  name: string
  type: 'harness' | 'observer'
  samplePayload: Record<string, unknown>
}

export const McpTopologyExplorer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('antigravity')
  const [copied, setCopied] = useState(false)

  const nodes: NodeItem[] = [
    {
      id: 'antigravity',
      name: 'Google Antigravity',
      type: 'harness',
      samplePayload: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'kanban_move_task',
          arguments: {
            taskId: 'TASK-102',
            toStatus: 'IN_PROGRESS',
            reason: 'Agent started feature implementation'
          }
        }
      }
    },
    {
      id: 'claude',
      name: 'Claude Desktop',
      type: 'harness',
      samplePayload: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'kanban_get_workspace_context',
          arguments: {
            includeGitStatus: true
          }
        }
      }
    },
    {
      id: 'cursor',
      name: 'Cursor IDE',
      type: 'harness',
      samplePayload: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'kanban_list_tasks',
          arguments: {
            status: 'READY'
          }
        }
      }
    },
    {
      id: 'git-poller',
      name: 'Git Observer',
      type: 'observer',
      samplePayload: {
        event: 'GIT_COMMIT_DETECTED',
        branch: 'feature/toast-system',
        hash: '8f9b2a',
        filesChanged: 3,
        insertions: 48,
        deletions: 4
      }
    },
    {
      id: 'fs-watcher',
      name: 'Filesystem Watcher',
      type: 'observer',
      samplePayload: {
        event: 'VITEST_RUN_FINISHED',
        suite: 'inference.test.ts',
        testsPassed: 58,
        testsFailed: 0,
        durationMs: 24.5
      }
    }
  ]

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0]

  const copyPayload = () => {
    sounds.playSuccess()
    navigator.clipboard.writeText(JSON.stringify(activeNode.samplePayload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNodeClick = (id: string) => {
    sounds.playClick()
    setSelectedNodeId(id)
  }

  return (
    <section id="mcp-playground" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            The "USB-C" for AI Coding Agents
          </h2>
        </div>

        {/* Interactive Topology Graph & Inspector Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Topology Node Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              const isHarness = node.type === 'harness'
              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'border-foreground/40 bg-muted/60 shadow-md'
                      : 'border-border bg-card hover:border-border/80 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-9 rounded-xl grid place-items-center border ${
                        isSelected
                          ? 'border-foreground/20 bg-foreground text-background'
                          : 'border-border bg-muted text-muted-foreground'
                      }`}
                    >
                      {isHarness ? <Bot className="size-4" /> : <GitBranch className="size-4" />}
                    </div>
                    <div className="text-[14px] font-medium text-foreground tracking-tight">
                      {node.name}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="size-1.5 rounded-full bg-foreground animate-pulse mr-1" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Real-time JSON-RPC Payload Inspector (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-foreground opacity-80" />
                <span className="font-mono text-[12px] text-foreground font-medium">
                  {activeNode.name} :: JSON-RPC 2.0
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={copyPayload}
                className="font-mono text-xs cursor-pointer border-border hover:bg-muted"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-foreground mr-1.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 opacity-60 mr-1.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>

            {/* Code Output */}
            <div className="p-5 font-mono text-[12px] text-muted-foreground overflow-x-auto min-h-[260px] bg-background/50">
              <div className="text-muted-foreground text-[10px] mb-3 pb-1 border-b border-border/40 flex items-center justify-between">
                <span>TRANSPORT: STDIO · LATENCY: 0.2MS</span>
                <span className="text-foreground font-medium">CONFIRMED</span>
              </div>
              <pre className="text-foreground">
                <code>{JSON.stringify(activeNode.samplePayload, null, 2)}</code>
              </pre>
            </div>

            {/* Explainer Box */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-[12px] text-muted-foreground">
              <span>Zero cloud setup required</span>
              <span className="text-foreground font-mono text-[11px]">stdio transport</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
