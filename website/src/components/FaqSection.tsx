import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Do I need an OpenAI, Anthropic, or Gemini API key to run this?',
      a: 'No! AI Harness Project Manager does not require any external AI API keys or tokens. Its deterministic inference engine analyzes filesystem events, Git commits, and test results directly using local rules.'
    },
    {
      q: 'Do I need to install or configure a database like PostgreSQL or MySQL?',
      a: 'No database setup is required. The app embeds high-performance SQLite (via `better-sqlite3`) inside the local application bundle. All tables and schemas are created automatically on launch.'
    },
    {
      q: 'How does the Model Context Protocol (MCP) server connect with Antigravity / Claude / Cursor?',
      a: 'The `kanban-mcp` CLI communicates over standard `stdio` transport. When you add the simple JSON configuration to your harness settings, the harness automatically launches the CLI and discovers tools like `kanban_list_tasks`, `kanban_create_task`, and `kanban_move_task`.'
    },
    {
      q: 'Can I track multiple repositories and workspaces at the same time?',
      a: 'Yes. You can register multiple local Git repositories inside the Repositories tab. The observation engine will inspect and poll all registered paths simultaneously every 8 seconds.'
    },
    {
      q: 'How do I backup or transfer my project data to another computer?',
      a: 'Inside the Diagnostics view of the desktop app, click "Export Database Backup" to download a complete, portable JSON snapshot of all your projects, tasks, transitions, repositories, and evidence. You can restore it anytime with one click.'
    },
    {
      q: 'Is my codebase or task data uploaded to any cloud server?',
      a: 'Zero cloud telemetry. Everything runs locally on your workstation, perfectly offline, and completely private.'
    }
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 bg-[#07080a] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <HelpCircle className="size-3.5 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Clear answers on architecture, privacy, MCP integrations, and local-first execution.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-[#0d0f12] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-white/90 cursor-pointer focus:outline-hidden"
                >
                  <span className="text-[15px] font-semibold tracking-tight">{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-[#a0a5ad] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-[13px] text-[#a0a5ad] leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
