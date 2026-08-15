import React, { useState, useEffect } from 'react'
import {
  Download,
  Terminal,
  Copy,
  CheckCircle2,
  ChevronRight,
  Play
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sounds } from '../lib/audio'
import { InteractiveHeroShowcase } from './InteractiveHeroShowcase'

export const Hero: React.FC = () => {
  const [os, setOs] = useState<'mac' | 'windows' | 'linux'>('mac')
  const [copied, setCopied] = useState(false)

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
    sounds.playSuccess()
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#00ffcc', '#a0a5ad', '#38bdf8']
    })
  }

  const copyQuickstart = () => {
    navigator.clipboard.writeText('npx -y kanban-mcp')
    sounds.playSuccess()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Perspective Grid Background */}
      <div className="absolute inset-0 perspective-grid opacity-60 pointer-events-none -z-10" />

      {/* Volumetric Radial Light Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] hero-ambient-glow blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl mb-8 shadow-xl shimmer-badge animate-fade-in">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[12px] font-mono font-medium text-[#c4c9d0] tracking-tight">
            v0.1.0 Released · 100% Local-First & Zero AI API Tokens
          </span>
          <span className="text-white/20">|</span>
          <a
            href="#mcp-playground"
            className="text-[12px] text-white/90 hover:text-white font-medium flex items-center gap-1 group"
          >
            <span>Model Context Protocol (MCP)</span>
            <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-[-0.035em] text-white leading-[1.04] max-w-5xl mx-auto mb-7">
          The Autonomous Control Plane for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e8f0] to-[#94a3b8]">
            AI Coding Harnesses.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#a0a5ad] max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          Observe <strong className="text-white font-semibold">Google Antigravity</strong>,{' '}
          <strong className="text-white font-semibold">Claude Desktop</strong>, and{' '}
          <strong className="text-white font-semibold">Cursor</strong> in real-time. Zero cloud servers, 0ms latency,
          embedded SQLite, and deterministic Kanban state derivation without spending a single API token.
        </p>

        {/* Call to Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#download"
            onClick={handleDownloadClick}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-[#f0f3f6] text-[#07080a] font-bold text-[15px] tracking-tight transition-all duration-200 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_-2px_rgba(255,255,255,0.6)] hover:scale-[1.02] flex items-center justify-center gap-2.5 group"
          >
            <Download className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span>
              Download for {os === 'mac' ? 'macOS (Universal DMG)' : os === 'windows' ? 'Windows (x64)' : 'Linux (AppImage)'}
            </span>
          </a>

          <button
            onClick={copyQuickstart}
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 text-[#f0f3f6] font-mono text-[13px] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group shadow-lg"
          >
            <Terminal className="size-4 text-[#a0a5ad] group-hover:text-cyan-400 transition-colors" />
            <span>npx -y kanban-mcp</span>
            {copied ? (
              <CheckCircle2 className="size-4 text-emerald-400" />
            ) : (
              <Copy className="size-3.5 text-[#606771] group-hover:text-white transition-colors" />
            )}
          </button>

          <a
            href="#interactive-demo"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.04] text-[#c4c9d0] hover:text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Play className="size-3.5 fill-current text-[#a0a5ad]" />
            <span>Interactive Simulator</span>
          </a>
        </div>

        {/* Centerpiece: Interactive Live IDE & Kanban Split-Screen Simulator */}
        <InteractiveHeroShowcase />

        {/* Telemetry Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="text-[11px] font-mono text-white/50 uppercase">IPC Latency</div>
            <div className="text-xl font-bold font-mono text-white mt-1">0.2ms</div>
            <div className="text-[10px] text-[#a0a5ad]">Local-first message bus</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="text-[11px] font-mono text-white/50 uppercase">AI Token Cost</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">$0.00 / mo</div>
            <div className="text-[10px] text-[#a0a5ad]">Deterministic rule engine</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="text-[11px] font-mono text-white/50 uppercase">Protocol</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">Native MCP</div>
            <div className="text-[10px] text-[#a0a5ad]">Stdio JSON-RPC 2.0</div>
          </div>
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="text-[11px] font-mono text-white/50 uppercase">Storage</div>
            <div className="text-xl font-bold font-mono text-white mt-1">SQLite ACID</div>
            <div className="text-[10px] text-[#a0a5ad]">Zero database installation</div>
          </div>
        </div>
      </div>
    </section>
  )
}
