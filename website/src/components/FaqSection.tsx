import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Does AI Harness Project Manager require an external server or database?',
      a: 'No. AI Harness Project Manager is 100% local-first. It runs on an embedded SQLite database with atomic ACID compliance. All task metadata, activity logs, and evidence traces are stored locally on your machine with zero cloud configuration.'
    },
    {
      q: 'How does it observe AI agent actions without API keys or token costs?',
      a: 'The engine uses a deterministic inference pipeline that passively monitors Git repository events (commits, branches, working tree diffs), filesystem events, and terminal test outputs. It derives Kanban state transitions using strict logical rule evaluation rather than sending context tokens to costly cloud LLMs.'
    },
    {
      q: 'Which AI coding harnesses and tools are supported via MCP?',
      a: 'Any environment that speaks the standard Model Context Protocol (MCP) over stdio. This includes Google Antigravity, Claude Desktop, Cursor IDE, Windsurf, Devin Desktop, and custom CLI automation scripts.'
    },
    {
      q: 'Can I track multiple repositories simultaneously?',
      a: 'Yes. You can link multiple local Git repositories to a single project. The background observation engine monitors active branches and working trees across all linked repositories simultaneously.'
    },
    {
      q: 'How does data backup and recovery work?',
      a: 'The desktop app provides a 1-click transactional database export and import facility. You can export complete project and task snapshots to JSON or restore existing SQLite databases at any time.'
    }
  ]

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header (No top tag pill) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Common questions about architecture, privacy, Model Context Protocol, and local persistence.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <span className="font-medium text-foreground text-[15px]">{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-foreground' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-[13px] text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
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
