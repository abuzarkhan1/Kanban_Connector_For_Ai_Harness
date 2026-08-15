import React from 'react'
import { ArrowUp } from 'lucide-react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#07080a] border-t border-white/[0.08] py-14 text-[13px] text-[#a0a5ad]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/[0.06]">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg border border-white/10 bg-[#14171c] p-1 flex items-center justify-center">
              <img src="/logo.png" alt="AI Harness Project Manager Logo" className="size-full object-contain rounded" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight">AI Harness Project Manager</span>
              <span className="text-[11px] font-mono text-[#a0a5ad] block">
                Local-First Development Control Plane
              </span>
            </div>
          </div>

          {/* Engine Status & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Status: Active (0ms)</span>
            </div>

            <button
              onClick={scrollToTop}
              className="size-8 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-white grid place-items-center transition-colors cursor-pointer"
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
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Model Context Protocol
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
