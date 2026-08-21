import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  eyebrow?: string
  onNavigateHome: () => void
  children: ReactNode
  wide?: boolean
}

export function PageShell({
  title,
  eyebrow,
  onNavigateHome,
  children,
  wide = false,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-obsidian/80 backdrop-blur-[24px]">
        <div className="site-wrap flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-[16px] font-light text-ash transition-opacity duration-200 ease hover:opacity-70"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="size-6 rounded object-contain" />
            <span className="font-display text-[18px] font-light text-pure">AI Harness</span>
          </div>
        </div>
      </header>

      <main className={`site-wrap flex-1 py-16 ${wide ? '' : 'max-w-[800px]'}`}>
        {eyebrow ? <p className="mono-label text-ash">{eyebrow}</p> : null}
        <h1 className={`headline-page ${eyebrow ? 'mt-4' : ''}`}>{title}</h1>
        <div className="mt-10 space-y-8 text-[16px] font-light leading-relaxed text-ash">
          {children}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="site-wrap">
          <p className="text-[12px] text-fog">
            © {new Date().getFullYear()} AI Harness Project Manager · MIT
          </p>
        </div>
      </footer>
    </div>
  )
}

export function PageSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-[22px] font-light leading-tight text-cloud">{title}</h2>
      {children}
    </section>
  )
}
