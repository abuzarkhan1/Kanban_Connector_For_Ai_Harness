import React, { useState, useEffect } from 'react'
import {
  Search,
  Download,
  Terminal,
  Play,
  Sparkles,
  Workflow,
  Copy,
  ExternalLink
} from 'lucide-react'
import { sounds } from '../lib/audio'
import confetti from 'canvas-confetti'

interface CommandItem {
  id: string
  title: string
  category: 'Navigation' | 'Simulate Agent' | 'Integrations & MCP' | 'Download'
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  action: () => void
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items: CommandItem[] = [
    {
      id: 'demo',
      title: 'Jump to Interactive Live Kanban Simulator',
      category: 'Navigation',
      icon: Play,
      shortcut: 'G D',
      action: () => {
        document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      }
    },
    {
      id: 'mcp-terminal',
      title: 'Open Interactive MCP Terminal & Playground',
      category: 'Navigation',
      icon: Terminal,
      shortcut: 'G M',
      action: () => {
        document.getElementById('mcp-playground')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      }
    },
    {
      id: 'motion-reel',
      title: 'Watch Autonomous Lifecycle Motion Reel',
      category: 'Navigation',
      icon: Sparkles,
      shortcut: 'G R',
      action: () => {
        document.getElementById('motion-showcase')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      }
    },
    {
      id: 'architecture',
      title: 'Inspect 4-Layer Deterministic Inference Engine',
      category: 'Navigation',
      icon: Workflow,
      shortcut: 'G A',
      action: () => {
        document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      }
    },
    {
      id: 'copy-npx',
      title: 'Copy "npx kanban-mcp" Quickstart Command',
      category: 'Integrations & MCP',
      icon: Copy,
      shortcut: 'C',
      action: () => {
        navigator.clipboard.writeText('npx -y kanban-mcp')
        sounds.playSuccess()
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } })
        onClose()
      }
    },
    {
      id: 'copy-claude',
      title: 'Copy Claude Desktop & Antigravity MCP Config',
      category: 'Integrations & MCP',
      icon: Copy,
      shortcut: 'M',
      action: () => {
        const config = JSON.stringify(
          {
            mcpServers: {
              kanban: {
                command: 'npx',
                args: ['-y', 'kanban-mcp']
              }
            }
          },
          null,
          2
        )
        navigator.clipboard.writeText(config)
        sounds.playSuccess()
        onClose()
      }
    },
    {
      id: 'download-mac',
      title: 'Download Desktop App for macOS (.dmg)',
      category: 'Download',
      icon: Download,
      shortcut: 'D',
      action: () => {
        window.open('https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases', '_blank')
        sounds.playSuccess()
        onClose()
      }
    },
    {
      id: 'github',
      title: 'View Open Source Repository on GitHub',
      category: 'Navigation',
      icon: ExternalLink,
      shortcut: 'G H',
      action: () => {
        window.open('https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness', '_blank')
        onClose()
      }
    }
  ]

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        sounds.playClick()
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        sounds.playClick()
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = filtered[selectedIndex]
        if (selected) {
          sounds.playThud()
          selected.action()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0d0f12] shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3 bg-[#14171c]">
          <Search className="size-5 text-[#a0a5ad]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action (e.g. 'mcp', 'demo', 'download')…"
            className="flex-1 bg-transparent text-white placeholder-white/40 text-[15px] focus:outline-hidden font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px] border border-white/10">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#a0a5ad] font-mono text-[13px]">
              No commands found matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playThud()
                    item.action()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/10 text-white' : 'text-[#c4c9d0] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-lg grid place-items-center border ${
                        isSelected
                          ? 'border-white/30 bg-white/10 text-white'
                          : 'border-white/10 bg-[#14171c] text-[#a0a5ad]'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium tracking-tight text-white">{item.title}</div>
                      <div className="text-[11px] font-mono text-[#a0a5ad]">{item.category}</div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#07080a] flex items-center justify-between text-[11px] font-mono text-[#a0a5ad]">
          <div className="flex items-center gap-3">
            <span>Navigation: ↑ ↓</span>
            <span>Select: ↵</span>
          </div>
          <span>Bionic Omnibar v1.0</span>
        </div>
      </div>
    </div>
  )
}
