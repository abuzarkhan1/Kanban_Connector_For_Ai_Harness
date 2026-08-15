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
import { DocumentationPage } from './pages/DocumentationPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { CompliancePage } from './pages/CompliancePage'
import { sounds } from './lib/audio'

type PageType = 'home' | 'docs' | 'terms' | 'privacy' | 'compliance'

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Listen to hash changes (e.g. #/docs, #/terms, #/privacy, #/compliance)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/docs' || hash === '#docs') setCurrentPage('docs')
      else if (hash === '#/terms' || hash === '#terms') setCurrentPage('terms')
      else if (hash === '#/privacy' || hash === '#privacy') setCurrentPage('privacy')
      else if (hash === '#/compliance' || hash === '#compliance') setCurrentPage('compliance')
      else if (hash === '' || hash === '#/' || hash.startsWith('#')) {
        if (!['#/docs', '#/terms', '#/privacy', '#/compliance'].includes(hash)) {
          setCurrentPage('home')
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

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

  const navigateTo = (page: PageType) => {
    sounds.playClick()
    setCurrentPage(page)
    window.location.hash = page === 'home' ? '/' : `#/${page}`
  }

  // Render Sub-pages
  if (currentPage === 'docs') {
    return <DocumentationPage onNavigateHome={() => navigateTo('home')} />
  }

  if (currentPage === 'terms') {
    return <TermsPage onNavigateHome={() => navigateTo('home')} />
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicyPage onNavigateHome={() => navigateTo('home')} />
  }

  if (currentPage === 'compliance') {
    return <CompliancePage onNavigateHome={() => navigateTo('home')} />
  }

  // Render Main Landing Page
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background flex flex-col justify-between">
      {/* Hero Section & Navigation directly from design.md */}
      <HeroSection onNavigateDocs={() => navigateTo('docs')} />
      
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

      <Footer onNavigatePage={(page) => navigateTo(page)} />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}

export default App
