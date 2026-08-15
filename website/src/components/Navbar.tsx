import React, { useState, useEffect } from 'react'
import { Download, Terminal, CheckCircle2, Volume2, VolumeX, Search } from 'lucide-react'
import { sounds } from '../lib/audio'

export const Navbar: React.FC<{ onOpenCommandPalette: () => void }> = ({ onOpenCommandPalette }) => {
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [soundActive, setSoundActive] = useState(sounds.isEnabled())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyNpx = () => {
    navigator.clipboard.writeText('npx -y kanban-mcp')
    sounds.playSuccess()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSound = () => {
    const newState = sounds.toggle()
    setSoundActive(newState)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07080a]/80 backdrop-blur-xl border-b border-white/[0.08] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="size-9 rounded-lg border border-white/10 bg-[#14171c] p-1.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="AI Harness Project Manager Logo" className="size-full object-contain rounded" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] tracking-tight text-white group-hover:text-white/90">
                AI Harness
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-medium">
                v0.1.0
              </span>
            </div>
            <span className="text-[11px] text-[#a0a5ad] font-mono block -mt-0.5">Project Manager</span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#0d0f12]/80 px-4 py-1.5 backdrop-blur-md shadow-2xl">
          <a
            href="#interactive-demo"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Live Demo
          </a>
          <a
            href="#mcp-playground"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            MCP Terminal
          </a>
          <a
            href="#motion-showcase"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Motion Reel
          </a>
          <a
            href="#architecture"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Architecture
          </a>
          <a
            href="#comparison"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Comparison
          </a>
          <a
            href="#faq"
            className="text-[13px] font-medium text-[#c4c9d0] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Actions (Cmd+K, Sound Toggle, CLI copy & Download CTA) */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Omnibar Trigger */}
          <button
            onClick={() => {
              sounds.playClick()
              onOpenCommandPalette()
            }}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-[12px] font-mono text-[#a0a5ad] hover:text-white transition-colors cursor-pointer"
            title="Open Command Palette (Cmd+K)"
          >
            <Search className="size-3.5" />
            <span className="text-[11px]">Command</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">⌘K</kbd>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`size-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              soundActive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/10 bg-[#14171c] text-[#a0a5ad] hover:text-white'
            }`}
            title={soundActive ? 'Audio haptics enabled (Click to mute)' : 'Audio haptics muted (Click to enable)'}
          >
            {soundActive ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
          </button>

          {/* CLI Copy */}
          <button
            onClick={copyNpx}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-[12px] font-mono text-[#c4c9d0] hover:text-white transition-all cursor-pointer"
            title="Click to copy npx command"
          >
            <Terminal className="size-3.5 text-[#a0a5ad]" />
            <span>npx kanban-mcp</span>
            {copied ? (
              <CheckCircle2 className="size-3 text-emerald-400" />
            ) : (
              <span className="text-[10px] text-white/40">copy</span>
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] flex items-center justify-center text-[#c4c9d0] hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Download CTA */}
          <a
            href="#download"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-white/90 text-[#07080a] text-[13px] font-semibold tracking-tight transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </header>
  )
}
