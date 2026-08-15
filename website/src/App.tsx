import { useState, useEffect } from 'react'
import { HeroSection } from './components/HeroSection'
import { InteractiveBoardDemo } from './components/InteractiveBoardDemo'
import { McpTopologyExplorer } from './components/McpTopologyExplorer'
import { ArchitectureDeepDive } from './components/ArchitectureDeepDive'
import { ComparisonMatrix } from './components/ComparisonMatrix'
import { DownloadHub } from './components/DownloadHub'
import { FaqSection } from './components/FaqSection'
import { Footer } from './components/Footer'
import { CommandPalette } from './components/CommandPalette'
import { sounds } from './lib/audio'

export function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        sounds.playClick()
        setCommandPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background flex flex-col justify-between">
      {/* Hero Section & Navigation directly from design.md */}
      <HeroSection />
      
      <main className="flex-1">
        {/* Interactive Kanban Simulator */}
        <InteractiveBoardDemo />

        {/* Universal Model Context Protocol Explorer */}
        <McpTopologyExplorer />

        {/* Deterministic Architecture Deep Dive */}
        <ArchitectureDeepDive />

        {/* Competitive Benchmark Comparison */}
        <ComparisonMatrix />

        {/* Multi-Platform Download Center */}
        <DownloadHub />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      <Footer />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}

export default App
