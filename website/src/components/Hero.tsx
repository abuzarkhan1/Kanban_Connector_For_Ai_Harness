import React, { useState, useEffect, useRef } from 'react'
import {
  Download,
  Terminal,
  ShieldCheck,
  Zap,
  Copy,
  CheckCircle2,
  ChevronRight,
  Play,
  GitBranch
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sounds } from '../lib/audio'

export const Hero: React.FC = () => {
  const [os, setOs] = useState<'mac' | 'windows' | 'linux'>('mac')
  const [copied, setCopied] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current) return
    const rect = windowRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -(y * 6), y: x * 8 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

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
    <section
      className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden flex flex-col items-center justify-center text-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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

        {/* ========================================================================= */}
        {/* CENTERPIECE: 3D PERSPECTIVE MACOS APP WINDOW SHOWCASE */}
        {/* ========================================================================= */}
        <div
          ref={windowRef}
          style={{
            transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          }}
          className="relative mt-8 rounded-2xl border border-white/15 bg-[#0a0c10] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(255,255,255,0.08)] overflow-hidden text-left tilt-3d transition-transform duration-200"
        >
          {/* macOS Title Bar with Authentic Traffic Lights */}
          <div className="h-11 px-4 border-b border-white/[0.08] bg-[#11141a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-inner" />
              <span className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-inner" />
              <span className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-inner" />
              <span className="ml-3 font-mono text-[11px] text-[#a0a5ad] font-medium hidden sm:inline">
                AI Harness Project Manager — [Workspace: /Users/abuzar/Desktop/kanban]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OBSERVATION ENGINE: ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Desktop App Interior Layout */}
          <div className="grid grid-cols-12 min-h-[460px] bg-[#07080a]">
            {/* Sidebar (3 cols) */}
            <div className="col-span-3 border-r border-white/[0.06] bg-[#0d0f14] p-4 hidden md:flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <div className="size-6 rounded-md bg-white/10 p-1 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="size-full object-contain" />
                  </div>
                  <span className="font-semibold text-white text-[13px] tracking-tight">Ai Harness</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-2">Projects</div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-medium text-[12px] flex items-center justify-between">
                    <span>Ai Harness PM</span>
                    <span className="size-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-[#a0a5ad] hover:text-white text-[12px]">
                    E-Commerce Core
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/[0.04]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-2">Connected Repos</div>
                  <div className="px-2 py-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                    <GitBranch className="size-3" />
                    <span>main (clean)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Diagnostics HUD */}
              <div className="p-2.5 rounded-xl border border-white/[0.06] bg-[#14171c] font-mono text-[10px] text-[#a0a5ad] space-y-1">
                <div className="flex justify-between">
                  <span>SQLite Query Latency</span>
                  <span className="text-emerald-400">0.2ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Git Poller Interval</span>
                  <span className="text-white">8s</span>
                </div>
              </div>
            </div>

            {/* Kanban Columns (9 cols) */}
            <div className="col-span-12 md:col-span-9 p-4 grid grid-cols-3 gap-3.5 bg-[#07080a] overflow-x-auto">
              {/* Column 1: TODO */}
              <div className="rounded-xl border border-white/[0.06] bg-[#0d0f14] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-white/80">To Do</span>
                  <span className="size-4 rounded bg-white/10 text-white font-mono text-[10px] grid place-items-center">1</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2.5 rounded-lg border border-white/[0.08] bg-[#14171c] shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-white/50 font-semibold">TASK-104</span>
                      <span className="text-[8px] font-mono px-1 rounded bg-white/10 text-white/80">MEDIUM</span>
                    </div>
                    <h5 className="text-[12px] font-medium text-white leading-snug">Transactional SQLite Backup Engine</h5>
                    <div className="mt-2 text-[9px] font-mono text-white/40">git: feature/backup</div>
                  </div>
                </div>
              </div>

              {/* Column 2: IN PROGRESS (Active Highlight) */}
              <div className="rounded-xl border border-cyan-500/30 bg-[#0d1219] p-3 flex flex-col justify-between shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-cyan-300">In Progress</span>
                  <span className="size-4 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] grid place-items-center">1</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-3 rounded-lg border border-cyan-500/40 bg-[#16202c] shadow-md">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-mono text-cyan-400 font-semibold">TASK-103</span>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                        URGENT
                      </span>
                    </div>
                    <h5 className="text-[12px] font-semibold text-white leading-snug">Background Git Polling & Commit Detector</h5>
                    <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] font-mono text-cyan-300">
                      <span>rule: RULE_GIT_COMMIT</span>
                      <span className="text-emerald-400 font-bold">98% conf</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: DONE */}
              <div className="rounded-xl border border-white/[0.06] bg-[#0d0f14] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04]">
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-emerald-400">Done</span>
                  <span className="size-4 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] grid place-items-center">2</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2.5 rounded-lg border border-white/[0.08] bg-[#14171c] opacity-80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-white/50">TASK-101</span>
                      <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400">DONE</span>
                    </div>
                    <h5 className="text-[12px] font-medium text-white leading-snug line-through text-white/60">
                      Multi-Channel Toast Notification System
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Luxury Orbit Badges */}
          <div className="hidden lg:block absolute -top-4 -left-4 p-3 rounded-xl border border-white/20 bg-[#0d0f14]/90 backdrop-blur-xl shadow-2xl font-mono text-[11px] text-white">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-cyan-400" />
              <span>8s Periodic Git Loop: 0ms Latency</span>
            </div>
          </div>

          <div className="hidden lg:block absolute -bottom-4 -right-4 p-3 rounded-xl border border-white/20 bg-[#0d0f14]/90 backdrop-blur-xl shadow-2xl font-mono text-[11px] text-white">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>100% Embedded SQLite: Zero Cloud</span>
            </div>
          </div>
        </div>

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
