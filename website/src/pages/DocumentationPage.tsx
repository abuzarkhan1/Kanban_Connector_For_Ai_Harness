import { useState } from 'react'
import { Copy, CheckCircle2, Search } from 'lucide-react'
import { sounds } from '../lib/audio'

const SECTIONS = [
  { id: 'quickstart', title: 'Quickstart' },
  { id: 'mcp-integration', title: 'MCP Integration' },
  { id: 'mcp-tools', title: 'MCP Tools' },
  { id: 'observation-engine', title: 'Observation' },
  { id: 'database-backup', title: 'SQLite' },
  { id: 'security', title: 'Security' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export const DocumentationPage: React.FC<{ onNavigateHome: () => void }> = ({
  onNavigateHome,
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('quickstart')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const copySnippet = (code: string, id: string) => {
    sounds.playSuccess()
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filtered = SECTIONS.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-obsidian/80 backdrop-blur-[24px]">
        <div className="site-wrap flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-[16px] font-light text-ash transition-opacity duration-200 ease hover:opacity-70"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="size-6 rounded object-contain" />
            <span className="font-display text-[18px] font-light text-pure">Docs</span>
          </div>
        </div>
      </header>

      <div className="site-wrap grid flex-1 grid-cols-1 gap-10 py-12 md:grid-cols-12">
        <aside className="md:col-span-3">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash" />
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/15 bg-void py-2 pl-9 pr-3 text-[14px] text-pure placeholder:text-ash outline-none transition-[border-color] duration-200 ease focus:border-white/40"
            />
          </div>
          <nav className="flex flex-col gap-0.5">
            {filtered.map((sec) => {
              const active = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick()
                    setActiveSection(sec.id)
                  }}
                  className={`rounded-lg px-3 py-2.5 text-left text-[14px] font-light transition-[background-color,color] duration-200 ease ${
                    active
                      ? 'bg-pure text-void'
                      : 'text-ash hover:bg-steel/60 hover:text-cloud'
                  }`}
                >
                  {sec.title}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="md:col-span-9 max-w-2xl space-y-8">
          {activeSection === 'quickstart' && (
            <>
              <h1 className="headline-page">Quickstart</h1>
              <p className="text-body-light !text-[16px]">
                Run MCP instantly, or install the desktop app.
              </p>
              <CodeBlock
                code="npx -y kanban-mcp"
                copied={copiedCode === 'npx'}
                onCopy={() => copySnippet('npx -y kanban-mcp', 'npx')}
              />
              <ul className="space-y-2 text-[16px] font-light text-ash">
                <li>macOS — Universal DMG</li>
                <li>Windows — Setup .exe</li>
                <li>Linux — AppImage</li>
              </ul>
            </>
          )}

          {activeSection === 'mcp-integration' && (
            <>
              <h1 className="headline-page">MCP Integration</h1>
              <p className="text-body-light !text-[16px]">
                Connect Antigravity, Claude Desktop, Cursor, or Windsurf via stdio.
              </p>
              <CodeBlock
                code={`{\n  "mcpServers": {\n    "kanban": {\n      "command": "npx",\n      "args": ["-y", "kanban-mcp"]\n    }\n  }\n}`}
                copied={copiedCode === 'claude-json'}
                onCopy={() =>
                  copySnippet(
                    JSON.stringify(
                      { mcpServers: { kanban: { command: 'npx', args: ['-y', 'kanban-mcp'] } } },
                      null,
                      2
                    ),
                    'claude-json'
                  )
                }
              />
            </>
          )}

          {activeSection === 'mcp-tools' && (
            <>
              <h1 className="headline-page">MCP Tools</h1>
              <div className="space-y-3">
                {[
                  ['kanban_list_tasks', 'List tasks by project, column, or priority.'],
                  ['kanban_create_task', 'Create a task with title, tags, and status.'],
                  ['kanban_move_task', 'Move a task with reason and confidence.'],
                  ['kanban_get_workspace_context', 'Git status, branch, and sprint metadata.'],
                ].map(([name, desc]) => (
                  <div key={name} className="card-elevated !p-5">
                    <div className="font-mono text-[14px] text-cloud">{name}</div>
                    <p className="mt-2 text-[14px] font-light text-ash">{desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'observation-engine' && (
            <>
              <h1 className="headline-page">Observation</h1>
              <p className="text-[16px] font-light leading-relaxed text-ash">
                Passive watchers for Git, filesystem, and processes. Transitions are deterministic
                with confidence ≥ 0.90—branch → IN PROGRESS, commit → REVIEW, tests pass → DONE.
              </p>
            </>
          )}

          {activeSection === 'database-backup' && (
            <>
              <h1 className="headline-page">SQLite</h1>
              <p className="text-[16px] font-light leading-relaxed text-ash">
                Data lives at <code className="font-mono text-cloud">~/.ai-harness/kanban.sqlite</code>.
                Export or restore JSON snapshots anytime—no vendor lock-in.
              </p>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <h1 className="headline-page">Security</h1>
              <p className="text-[16px] font-light leading-relaxed text-ash">
                Zero cloud servers, zero telemetry, zero network egress. Task data never leaves
                your machine.
              </p>
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="site-wrap">
          <p className="text-[12px] text-fog">
            © {new Date().getFullYear()} AI Harness Project Manager · MIT
          </p>
        </div>
      </footer>
    </div>
  )
}

function CodeBlock({
  code,
  copied,
  onCopy,
}: {
  code: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="relative rounded-2xl bg-graphite p-5 font-mono text-[12px] text-cloud">
      <pre className="overflow-x-auto pr-10 whitespace-pre-wrap">{code}</pre>
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-ash transition-[background-color,color] duration-200 ease hover:bg-steel hover:text-pure"
        aria-label="Copy"
      >
        {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  )
}
