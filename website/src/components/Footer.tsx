import React from 'react'
import { ArrowUp, Sparkles, ExternalLink, BookOpen, ShieldCheck } from 'lucide-react'

interface FooterProps {
  onNavigatePage?: (page: 'docs' | 'terms' | 'privacy' | 'compliance') => void
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Top Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/60">
          {/* Brand Col (4 cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AI Harness Project Manager Logo"
                className="size-8 rounded-lg object-contain border border-border/60 shadow-xs"
              />
              <span className="font-semibold text-foreground tracking-tight text-base">
                AI Harness
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The local development control plane for autonomous AI coding agents. Open source under MIT.
            </p>
          </div>

          {/* Product Links (3 cols) */}
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
              <li>
                <button
                  onClick={() => onNavigatePage?.('docs')}
                  className="hover:text-foreground transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="size-3.5" />
                  <span>Documentation</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase text-foreground font-semibold tracking-wider">
              Governance & Legal
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => onNavigatePage?.('terms')}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage?.('privacy')}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage?.('compliance')}
                  className="hover:text-foreground transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Compliance & Security</span>
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Back to Top (2 cols) */}
          <div className="md:col-span-2 flex items-start justify-start md:justify-end">
            <button
              onClick={scrollToTop}
              className="size-9 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground grid place-items-center transition-all hover:scale-105 cursor-pointer shadow-xs"
              title="Back to top"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>

        {/* Clean Single-Line Architectural Brand Name */}
        <div className="py-8 sm:py-10 text-center select-none overflow-hidden">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/80 uppercase font-sans whitespace-nowrap">
            AI HARNESS
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under MIT License.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigatePage?.('docs')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Docs
            </button>
            <button
              onClick={() => onNavigatePage?.('terms')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigatePage?.('privacy')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigatePage?.('compliance')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Compliance
            </button>
            <a
              href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
