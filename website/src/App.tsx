import { useState, useEffect } from 'react'
import { OriginHero } from './components/origin/OriginHero'
import {
  SimplifySection,
  TrackSection,
  AskSection,
} from './components/origin/FeatureSections'
import {
  ConnectSection,
  InferSection,
  LocalSection,
  TestimonialsSection,
  UpdatesSection,
  DownloadHero,
} from './components/origin/MoreSections'
import { OriginFooter } from './components/origin/OriginFooter'
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

  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-ash">
      <OriginHero onNavigateDocs={() => navigateTo('docs')} />
      <main className="flex-1">
        <SimplifySection />
        <TrackSection />
        <AskSection />
        <ConnectSection />
        <InferSection />
        <LocalSection />
        <TestimonialsSection />
        <UpdatesSection />
        <DownloadHero />
      </main>
      <OriginFooter onNavigatePage={(page) => navigateTo(page)} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}

export default App
