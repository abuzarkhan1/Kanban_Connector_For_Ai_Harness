import React from 'react'
import { ArrowUp } from 'lucide-react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-background border-t border-border py-14 text-[13px] text-muted-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-border">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AI Harness Project Manager Logo"
              className="size-8 rounded-lg object-contain border border-border/40"
            />
            <div>
              <span className="font-medium text-foreground tracking-tight text-sm block">
                AI Harness Project Manager
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Local-First Development Control Plane
              </span>
            </div>
          </div>

          {/* Status & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-[11px]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Status: Active (0ms)</span>
            </div>

            <button
              onClick={scrollToTop}
              className="size-8 rounded-lg border border-border bg-muted/30 hover:bg-muted text-foreground grid place-items-center transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
          <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under the MIT License.</p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Model Context Protocol
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
