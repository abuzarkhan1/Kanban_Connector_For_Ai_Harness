import React, { useState } from 'react'
import {
  BookOpen,
  Terminal,
  Server,
  Workflow,
  HardDrive,
  Copy,
  CheckCircle2,
  ArrowLeft,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sounds } from '../lib/audio'

export const DocumentationPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState('quickstart')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const copySnippet = (code: string, id: string) => {
    sounds.playSuccess()
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    { id: 'quickstart', title: 'Quickstart & Installation', icon: Zap },
    { id: 'mcp-integration', title: 'MCP Harness Integration', icon: Server },
    { id: 'mcp-tools', title: 'MCP Tool Reference', icon: Terminal },
    { id: 'observation-engine', title: 'Observation Engine & Rules', icon: Workflow },
    { id: 'database-backup', title: 'SQLite & Backup Recovery', icon: HardDrive },
    { id: 'security', title: 'Security & Local Privacy', icon: ShieldCheck }
  ]

  const filteredSections = sections.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Docs Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AI Harness Logo" className="size-6 rounded object-contain" />
              <span className="font-semibold text-sm text-foreground tracking-tight">
                AI Harness Documentation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline" className="text-xs font-mono border-border">
              <a
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <span>GitHub</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Docs Body */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Sidebar Nav (3 cols) */}
        <aside className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-foreground/50 font-sans"
            />
          </div>

          <nav className="space-y-1">
            {filteredSections.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    sounds.playClick()
                    setActiveSection(sec.id)
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{sec.title}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right Content Area (9 cols) */}
        <main className="md:col-span-9 max-w-3xl space-y-12">
          {/* Quickstart Section */}
          {activeSection === 'quickstart' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  Quickstart & Installation
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get up and running with AI Harness Project Manager in seconds on macOS, Windows, or Linux.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">Option 1: NPX Instant Execution (Zero Install)</h2>
                <p className="text-sm text-muted-foreground">
                  Run the Model Context Protocol connector directly in any terminal or harness config:
                </p>
                <div className="rounded-2xl border border-border bg-card p-4 font-mono text-xs text-foreground flex items-center justify-between">
                  <code>npx -y kanban-mcp</code>
                  <button
                    onClick={() => copySnippet('npx -y kanban-mcp', 'npx')}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copiedCode === 'npx' ? <CheckCircle2 className="size-4 text-foreground" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">Option 2: Native Desktop App</h2>
                <p className="text-sm text-muted-foreground">
                  Download the standalone desktop app with full graphical Kanban board, system tray controls, and local SQLite engine:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>macOS</strong>: Universal DMG for Apple Silicon (M1/M2/M3/M4) & Intel.</li>
                  <li>• <strong>Windows</strong>: Standalone Setup (.exe) with global hotkeys.</li>
                  <li>• <strong>Linux</strong>: Portable AppImage for Ubuntu, Fedora, and Debian.</li>
                </ul>
              </div>
            </div>
          )}

          {/* MCP Harness Integration */}
          {activeSection === 'mcp-integration' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  Model Context Protocol (MCP) Integration
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Connect AI Harness PM to Google Antigravity, Claude Desktop, Cursor IDE, and Windsurf via standard stdio JSON-RPC.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">Claude Desktop Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Add the following entry to your `claude_desktop_config.json`:
                </p>
                <div className="rounded-2xl border border-border bg-card p-4 font-mono text-xs overflow-x-auto relative">
                  <pre className="text-foreground">
{`{
  "mcpServers": {
    "kanban": {
      "command": "npx",
      "args": ["-y", "kanban-mcp"]
    }
  }
}`}
                  </pre>
                  <button
                    onClick={() =>
                      copySnippet(
                        JSON.stringify(
                          { mcpServers: { kanban: { command: 'npx', args: ['-y', 'kanban-mcp'] } } },
                          null,
                          2
                        ),
                        'claude-json'
                      )
                    }
                    className="absolute right-4 top-4 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copiedCode === 'claude-json' ? (
                      <CheckCircle2 className="size-4 text-foreground" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MCP Tool Reference */}
          {activeSection === 'mcp-tools' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  MCP Tool Specification
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The MCP server exposes 7 standard tools over stdio for autonomous agent orchestration.
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="font-mono text-sm font-semibold text-foreground">kanban_list_tasks</div>
                  <p className="text-xs text-muted-foreground">
                    Lists tasks filtered by project, column status (BACKLOG, READY, IN_PROGRESS, REVIEW, DONE), or priority.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="font-mono text-sm font-semibold text-foreground">kanban_create_task</div>
                  <p className="text-xs text-muted-foreground">
                    Creates a new task with title, description, priority, tags, and initial status.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="font-mono text-sm font-semibold text-foreground">kanban_move_task</div>
                  <p className="text-xs text-muted-foreground">
                    Atomically transitions a task state with transition reason and confidence validation.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <div className="font-mono text-sm font-semibold text-foreground">kanban_get_workspace_context</div>
                  <p className="text-xs text-muted-foreground">
                    Retrieves linked Git repository status, active branch, and project sprint metadata.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Observation Engine */}
          {activeSection === 'observation-engine' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  Observation Engine & Rules
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The passive observation engine monitors developer and agent actions without modifying your code.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-medium text-foreground">Deterministic Rule Pipeline</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  State transitions are derived deterministically using confidence scoring ($\ge 0.90$). For example,
                  creating a feature branch transitions a task to <code>IN_PROGRESS</code>, making a git commit moves it to{' '}
                  <code>REVIEW</code>, and passing Vitest test suites moves it to <code>DONE</code>.
                </p>
              </div>
            </div>
          )}

          {/* Database Backup */}
          {activeSection === 'database-backup' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  SQLite & Backup Recovery
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your data is stored in an embedded SQLite database located at `~/.ai-harness/kanban.sqlite`.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-medium text-foreground">1-Click JSON Snapshot & Restore</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use the desktop app's Diagnostics view or CLI to create full atomic JSON backups, or restore existing project
                  databases at any time with zero vendor lock-in.
                </p>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
                  Security & Local Privacy
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Zero cloud servers, zero telemetry, and zero network egress.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI Harness PM operates 100% locally on your machine. No task data, code diffs, or API keys are ever
                  transmitted to external cloud servers.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under MIT License.</p>
      </footer>
    </div>
  )
}
