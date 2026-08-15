import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { InteractiveBoardDemo } from './components/InteractiveBoardDemo'
import { InteractiveTerminalMcp } from './components/InteractiveTerminalMcp'
import { MotionReelShowcase } from './components/MotionReelShowcase'
import { ArchitectureDeepDive } from './components/ArchitectureDeepDive'
import { TokenRoiCalculator } from './components/TokenRoiCalculator'
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
    <div className="min-h-screen bg-[#07080a] text-[#f0f3f6] selection:bg-white/20 selection:text-white flex flex-col justify-between">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      
      <main className="flex-1">
        <Hero />
        <InteractiveBoardDemo />
        <InteractiveTerminalMcp />
        <MotionReelShowcase />
        <ArchitectureDeepDive />
        <TokenRoiCalculator />
        <ComparisonMatrix />
        <DownloadHub />
        <FaqSection />
      </main>

      <Footer />

      {/* Global Raycast/Linear-Style Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}

export default App
