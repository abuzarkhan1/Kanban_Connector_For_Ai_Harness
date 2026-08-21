import React, { useState, useEffect } from 'react'
import {
  Search,
  Download,
  Terminal,
  Eye,
  Sparkles,
  Workflow,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { sounds } from '../lib/audio'

interface CommandItem {
  id: string
  title: string
  category: 'Navigation' | 'Integrations & MCP' | 'Download'
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  action: () => void
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items: CommandItem[] = [
    {
      id: 'observe',
      title: 'Jump to Observe Everything',
      category: 'Navigation',
      icon: Eye,
      shortcut: 'G O',
      action: () => {
        document.getElementById('observe')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
    },
    {
      id: 'ask',
      title: 'Jump to Ask / MCP Protocol',
      category: 'Navigation',
      icon: Terminal,
      shortcut: 'G M',
      action: () => {
        document.getElementById('ask')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
    },
    {
      id: 'connect',
      title: 'Jump to Connect Any Agent',
      category: 'Navigation',
      icon: Workflow,
      shortcut: 'G C',
      action: () => {
        document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
    },
    {
      id: 'infer',
      title: 'Jump to Derive Next State',
      category: 'Navigation',
      icon: Sparkles,
      shortcut: 'G I',
      action: () => {
        document.getElementById('infer')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
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
        onClose()
      },
    },
    {
      id: 'download',
      title: 'Open GitHub Releases',
      category: 'Download',
      icon: Download,
      action: () => {
        window.open(
          'https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases',
          '_blank'
        )
        onClose()
      },
    },
    {
      id: 'github',
      title: 'View Repository on GitHub',
      category: 'Download',
      icon: ExternalLink,
      action: () => {
        window.open('https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness', '_blank')
        onClose()
      },
    },
  ]

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        filtered[selectedIndex].action()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, filtered, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-graphite shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="size-4 text-ash" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="w-full bg-transparent text-[16px] text-pure outline-none placeholder:text-ash"
          />
          <kbd className="mono-label rounded border border-white/15 px-1.5 py-0.5 text-ash">
            ESC
          </kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ash">No matching commands</p>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon
              const active = index === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-[background-color] duration-200 ease ${
                    active ? 'bg-steel text-pure' : 'text-cloud hover:bg-steel/60'
                  }`}
                >
                  <Icon className="size-4 shrink-0 text-ash" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px]">{item.title}</div>
                    <div className="mono-label mt-0.5 text-ash">{item.category}</div>
                  </div>
                  {item.shortcut ? (
                    <kbd className="mono-label text-fog">{item.shortcut}</kbd>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
