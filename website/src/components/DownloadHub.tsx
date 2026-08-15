import React, { useState } from 'react'
import { Download, Apple, Monitor, Terminal, CheckCircle2, Copy, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'
import { sounds } from '../lib/audio'

export const DownloadHub: React.FC = () => {
  const [copiedMac, setCopiedMac] = useState(false)
  const [copiedNpx, setCopiedNpx] = useState(false)

  const triggerConfetti = () => {
    sounds.playSuccess()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#a1a1aa', '#71717a']
    })
  }

  const copyMacBrew = () => {
    sounds.playSuccess()
    navigator.clipboard.writeText('brew install --cask ai-harness-project-manager')
    setCopiedMac(true)
    setTimeout(() => setCopiedMac(false), 2000)
  }

  const copyNpxCli = () => {
    sounds.playSuccess()
    navigator.clipboard.writeText('npx -y kanban-mcp')
    setCopiedNpx(true)
    setTimeout(() => setCopiedNpx(false), 2000)
  }

  return (
    <section id="download" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Get Started with AI Harness PM
          </h2>
        </div>

        {/* 3 Multi-Platform Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* macOS */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-muted text-foreground">
                  <Apple className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-foreground font-medium px-2 py-0.5 rounded bg-muted border border-border">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1.5">macOS</h3>
              <p className="text-[13px] text-muted-foreground mb-6">
                Native binary for Apple Silicon (M1/M2/M3/M4) &amp; Intel via Rosetta. Requires macOS 12+.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full font-medium cursor-pointer shadow-sm"
              >
                <a
                  href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases/download/V1/AI.Harness.Project.Manager-0.1.0-arm64.dmg"
                  download
                  onClick={triggerConfetti}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download DMG (Apple Silicon)</span>
                </a>
              </Button>

              <button
                onClick={copyMacBrew}
                className="w-full py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 text-[12px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="size-3.5" />
                <span>brew install ...</span>
                {copiedMac ? <CheckCircle2 className="size-3.5 text-foreground" /> : <Copy className="size-3 opacity-50" />}
              </button>
            </div>
          </div>

          {/* Windows */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-muted text-foreground">
                  <Monitor className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
                  x64
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1.5">Windows</h3>
              <p className="text-[13px] text-muted-foreground mb-6">
                Native Windows installer (.exe) with automatic system tray & shortcut support. Requires Windows 10/11.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full font-medium cursor-pointer border-border hover:bg-muted"
              >
                <a
                  href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={triggerConfetti}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download Setup (.exe)</span>
                </a>
              </Button>

              <div className="text-center font-mono text-[11px] text-muted-foreground py-1">
                Zero external dependencies
              </div>
            </div>
          </div>

          {/* Linux & NPM CLI */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-muted text-foreground">
                  <Terminal className="size-6" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
                  CLI & AppImage
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1.5">Linux & NPM</h3>
              <p className="text-[13px] text-muted-foreground mb-6">
                Standalone AppImage for Linux distributions and instant npm CLI execution for any harness.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full font-medium cursor-pointer border-border hover:bg-muted"
              >
                <a
                  href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={triggerConfetti}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download AppImage</span>
                </a>
              </Button>

              <button
                onClick={copyNpxCli}
                className="w-full py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 text-[12px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="size-3.5" />
                <span>npx -y kanban-mcp</span>
                {copiedNpx ? <CheckCircle2 className="size-3.5 text-foreground" /> : <Copy className="size-3 opacity-50" />}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="rounded-3xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-foreground shrink-0" />
            <div className="text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">100% Open Source & Verified:</span> All builds are
              signed, virus-scanned, and published transparently on GitHub.
            </div>
          </div>
          <a
            href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases/tag/V1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-mono text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            View V1 SHA-256 Checksums
          </a>
        </div>
      </div>
    </section>
  )
}
