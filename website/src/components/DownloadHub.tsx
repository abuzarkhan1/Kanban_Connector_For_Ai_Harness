import React, { useState } from 'react'
import { Download, Apple, Monitor, Terminal, CheckCircle2, Copy, ShieldCheck } from 'lucide-react'
import confetti from 'canvas-confetti'

export const DownloadHub: React.FC = () => {
  const [copiedMac, setCopiedMac] = useState(false)
  const [copiedNpx, setCopiedNpx] = useState(false)

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#00ffcc', '#a0a5ad']
    })
  }

  const copyMacBrew = () => {
    navigator.clipboard.writeText('brew install --cask ai-harness-project-manager')
    setCopiedMac(true)
    setTimeout(() => setCopiedMac(false), 2000)
  }

  const copyNpxCli = () => {
    navigator.clipboard.writeText('npx -y kanban-mcp')
    setCopiedNpx(true)
    setTimeout(() => setCopiedNpx(false), 2000)
  }

  return (
    <section id="download" className="py-24 bg-[#0d0f12] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#14171c] text-xs font-mono text-[#c4c9d0] mb-4">
            <Download className="size-3.5 text-emerald-400" />
            <span>Ready for Production</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Get Started with AI Harness PM
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Download the native desktop app for your operating system, or connect the MCP CLI directly to your
            existing AI harness in 10 seconds.
          </p>
        </div>

        {/* 4 Multi-Platform Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* macOS */}
          <div className="rounded-2xl border border-white/10 bg-[#14171c] p-6 glow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-white/10 text-white">
                  <Apple className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5">macOS</h3>
              <p className="text-[13px] text-[#a0a5ad] mb-6">
                Universal binary for Apple Silicon (M1/M2/M3/M4) & Intel Macs. Requires macOS 12+.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerConfetti}
                className="w-full py-3 rounded-xl bg-white hover:bg-white/90 text-[#07080a] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="size-4" />
                <span>Download DMG (Universal)</span>
              </a>

              <button
                onClick={copyMacBrew}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-[#07080a] hover:bg-[#1a1e24] text-[12px] font-mono text-[#c4c9d0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="size-3.5 text-[#a0a5ad]" />
                <span>brew install ...</span>
                {copiedMac ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <Copy className="size-3 text-white/40" />}
              </button>
            </div>
          </div>

          {/* Windows */}
          <div className="rounded-2xl border border-white/10 bg-[#14171c] p-6 glow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-white/10 text-white">
                  <Monitor className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-white/60 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  x64
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5">Windows</h3>
              <p className="text-[13px] text-[#a0a5ad] mb-6">
                Native Windows installer (.exe) with automatic system tray & shortcut support. Requires Windows 10/11.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerConfetti}
                className="w-full py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all"
              >
                <Download className="size-4" />
                <span>Download Setup (.exe)</span>
              </a>

              <div className="text-center font-mono text-[11px] text-white/40 py-1">
                Zero external dependencies
              </div>
            </div>
          </div>

          {/* Linux & NPM CLI */}
          <div className="rounded-2xl border border-white/10 bg-[#14171c] p-6 glow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-white/10 text-white">
                  <Terminal className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  CLI & AppImage
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5">Linux & NPM</h3>
              <p className="text-[13px] text-[#a0a5ad] mb-6">
                Standalone AppImage for Linux distributions and instant npm CLI execution for any harness.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerConfetti}
                className="w-full py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all"
              >
                <Download className="size-4" />
                <span>Download AppImage</span>
              </a>

              <button
                onClick={copyNpxCli}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-[#07080a] hover:bg-[#1a1e24] text-[12px] font-mono text-[#c4c9d0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="size-3.5 text-[#a0a5ad]" />
                <span>npx -y kanban-mcp</span>
                {copiedNpx ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <Copy className="size-3 text-white/40" />}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#07080a] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
            <div className="text-[13px] text-[#c4c9d0]">
              <span className="font-semibold text-white">100% Open Source & Verified:</span> All builds are
              signed, virus-scanned, and published transparently on GitHub.
            </div>
          </div>
          <a
            href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-mono text-white/70 hover:text-white underline underline-offset-4"
          >
            View SHA-256 Checksums
          </a>
        </div>
      </div>
    </section>
  )
}
