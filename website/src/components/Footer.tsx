import React from 'react'
import { ArrowUp, Sparkles, ExternalLink } from 'lucide-react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-border/40">
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AI Harness Project Manager Logo"
                className="size-8 rounded-lg object-contain border border-border/40 shadow-xs"
              />
              <span className="font-semibold text-foreground tracking-tight text-base">
                AI Harness
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The local-first development control plane for autonomous coding agents. Open source under MIT.
            </p>
          </div>

          {/* Nav Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase text-foreground font-semibold tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#interactive-demo" className="hover:text-foreground transition-colors">
                  Live Simulator
                </a>
              </li>
              <li>
                <a href="#mcp-playground" className="hover:text-foreground transition-colors">
                  MCP Protocol
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-foreground transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-foreground transition-colors">
                  Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Back to Top (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-foreground font-semibold tracking-wider">
                Resources
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://modelcontextprotocol.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Model Context Protocol</span>
                  </a>
                </li>
                <li>
                  <a href="#download" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                    <ExternalLink className="size-3.5" />
                    <span>Releases & Downloads</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-start md:justify-end">
              <button
                onClick={scrollToTop}
                className="size-9 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground grid place-items-center transition-all hover:scale-105 cursor-pointer shadow-xs"
                title="Back to top"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GIANT ARCHITECTURAL TYPOGRAPHY FOOTER STATEMENT */}
        {/* ========================================================================= */}
        <div className="py-12 sm:py-16 text-center select-none pointer-events-none">
          <div className="text-[12vw] sm:text-[13vw] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-foreground/[0.18] via-foreground/[0.05] to-transparent uppercase font-sans">
            AI HARNESS
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under MIT License.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Releases
            </a>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              MCP Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
