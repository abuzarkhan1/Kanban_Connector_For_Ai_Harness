import React, { useState, useEffect, useRef } from 'react'
import {
  Download,
  Terminal,
  ShieldCheck,
  Zap,
  HardDrive,
  Copy,
  CheckCircle2,
  ChevronRight,
  Play
} from 'lucide-react'
import confetti from 'canvas-confetti'

export const Hero: React.FC = () => {
  const [os, setOs] = useState<'mac' | 'windows' | 'linux'>('mac')
  const [copied, setCopied] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes('win')) {
      setOs('windows')
    } else if (userAgent.includes('linux')) {
      setOs('linux')
    } else {
      setOs('mac')
    }
  }, [])

  const handleDownloadClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#a0a5ad', '#333a44', '#717882']
    })
  }

  const copyQuickstart = () => {
    navigator.clipboard.writeText('npx kanban-mcp')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={heroRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Background Radial Spotlight */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent blur-3xl -z-10"
        aria-hidden
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0d0f12]/90 backdrop-blur-md mb-8 shadow-inner animate-fade-in">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] font-mono font-medium text-[#c4c9d0]">
            AI Harness Project Manager v0.1.0 Released
          </span>
          <span className="text-white/20">|</span>
          <a
            href="#mcp-playground"
            className="text-[12px] text-white/80 hover:text-white font-medium flex items-center gap-1 group"
          >
            <span>Explore MCP Connector</span>
            <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6">
          The Local-First Control Plane for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/60">
            AI Coding Harnesses.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#a0a5ad] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Observe <strong className="text-white font-medium">Google Antigravity</strong>,{' '}
          <strong className="text-white font-medium">Claude Desktop</strong>, and{' '}
          <strong className="text-white font-medium">Cursor</strong> in real-time. Zero external servers, 0ms latency,
          embedded SQLite, and deterministic Kanban state derivation with native Model Context Protocol (MCP).
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <a
            href="#download"
            onClick={handleDownloadClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-white/90 text-[#07080a] font-semibold text-[15px] tracking-tight transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2.5 group"
          >
            <Download className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span>
              Download for {os === 'mac' ? 'macOS (Universal DMG)' : os === 'windows' ? 'Windows (x64)' : 'Linux (AppImage)'}
            </span>
          </a>

          <button
            onClick={copyQuickstart}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/10 bg-[#14171c] hover:bg-[#1f242c] hover:border-white/20 text-[#f0f3f6] font-mono text-[13px] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Terminal className="size-4 text-[#a0a5ad]" />
            <span>npx kanban-mcp</span>
            {copied ? (
              <CheckCircle2 className="size-4 text-emerald-400" />
            ) : (
              <Copy className="size-3.5 text-[#606771] group-hover:text-white transition-colors" />
            )}
          </button>

          <a
            href="#interactive-demo"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] text-[#c4c9d0] hover:text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Play className="size-3.5 fill-current text-[#a0a5ad]" />
            <span>Interactive Simulator</span>
          </a>
        </div>

        {/* Telemetry Micro-Pill Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0d0f12]/60 backdrop-blur-sm flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <Zap className="size-4 text-white/90" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white font-mono">0ms Latency</div>
              <div className="text-[10px] text-[#a0a5ad]">Local-first IPC bus</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0d0f12]/60 backdrop-blur-sm flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 text-white/90" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white font-mono">100% Private</div>
              <div className="text-[10px] text-[#a0a5ad]">Zero telemetry sent</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0d0f12]/60 backdrop-blur-sm flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <HardDrive className="size-4 text-white/90" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white font-mono">Embedded SQLite</div>
              <div className="text-[10px] text-[#a0a5ad]">Zero database setup</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0d0f12]/60 backdrop-blur-sm flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <Terminal className="size-4 text-white/90" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white font-mono">0 Token Cost</div>
              <div className="text-[10px] text-[#a0a5ad]">Deterministic rules</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
