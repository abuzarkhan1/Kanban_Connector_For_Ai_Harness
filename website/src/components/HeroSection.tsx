import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { Menu, X, Download, Terminal, CheckCircle2, Copy, GitBranch, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const copyQuickstart = () => {
    navigator.clipboard.writeText('npx -y kanban-mcp')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#a1a1aa', '#71717a', '#e4e4e7']
    })
  }

  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        {/* ========================================================================= */}
        {/* HERO SECTION WITH BALANCED 3D PERSPECTIVE PRODUCT SHOWCASE */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pb-28 lg:pb-36 lg:pt-32">
          <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
              {/* Left Column: Headline & Action CTAs (6 cols) */}
              <div className="lg:col-span-6 text-center lg:text-left z-10">
                <h1 className="text-balance text-5xl font-medium tracking-tight text-foreground md:text-6xl xl:text-7xl leading-[1.06]">
                  Ship 10x Faster with AI Harness PM
                </h1>

                <p className="mt-6 text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  The local-first development control plane for Google Antigravity, Claude Desktop, and Cursor.
                  Zero cloud servers, 0ms SQLite latency, and deterministic Kanban state derivation without spending a single API token.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="px-6 text-base font-medium cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <a href="#download" onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="size-4" />
                      <span className="text-nowrap">Download Free</span>
                    </a>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={copyQuickstart}
                    className="px-5 text-base font-mono cursor-pointer border-border hover:bg-muted/50 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Terminal className="size-4" />
                    <span className="text-nowrap">npx kanban-mcp</span>
                    {copied ? (
                      <CheckCircle2 className="size-4 text-foreground" />
                    ) : (
                      <Copy className="size-3.5 opacity-50" />
                    )}
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-1.5">
                    <span>⚡ 0ms SQLite latency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🔒 100% Private</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>✨ Native MCP</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Balanced Height Showcase with Proper Margin & Padding (6 cols) */}
              <div className="lg:col-span-6 relative flex justify-center lg:justify-end lg:pr-2">
                <div className="w-full max-w-lg lg:max-w-none rounded-2xl border border-border bg-card shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all hover:border-border/80">
                  {/* Clean macOS Titlebar with only Traffic Dots */}
                  <div className="h-9 px-4 border-b border-border bg-muted/30 flex items-center">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#ff5f56]/80" />
                      <span className="size-2.5 rounded-full bg-[#ffbd2e]/80" />
                      <span className="size-2.5 rounded-full bg-[#27c93f]/80" />
                    </div>
                  </div>

                  {/* App Interior Grid (Balanced Compact Height) */}
                  <div className="grid grid-cols-12 bg-background/50 p-4 gap-3 text-left">
                    {/* Left Mini Sidebar (4 cols on sm) */}
                    <div className="col-span-4 rounded-xl border border-border bg-card p-3 space-y-3 hidden sm:flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                          <img src="/logo.png" alt="Logo" className="size-5 rounded object-contain" />
                          <span className="font-medium text-xs text-foreground tracking-tight">AI Harness</span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] font-mono uppercase text-muted-foreground">Active Repo</div>
                          <div className="text-[11px] font-mono text-foreground font-medium flex items-center gap-1.5">
                            <GitBranch className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">main (clean)</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] font-mono uppercase text-muted-foreground">Harness</div>
                          <div className="text-[11px] font-mono text-foreground font-medium flex items-center gap-1.5">
                            <Sparkles className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">Antigravity</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-muted/40 border border-border text-[9px] font-mono text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Latency</span>
                          <span className="text-foreground font-medium">0.2ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Token Cost</span>
                          <span className="text-foreground font-medium">$0.00</span>
                        </div>
                      </div>
                    </div>

                    {/* 2 Focused Kanban Columns (8 cols on sm, 12 on mobile) */}
                    <div className="col-span-12 sm:col-span-8 grid grid-cols-2 gap-2.5">
                      {/* IN PROGRESS Column */}
                      <div className="rounded-xl border border-border bg-card p-2.5 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center pb-1 border-b border-border text-[10px] font-mono text-muted-foreground font-medium uppercase tracking-wider">
                            <span>IN PROGRESS</span>
                            <span>1</span>
                          </div>

                          <div className="mt-2 p-2.5 rounded-lg border border-border bg-muted/40 shadow-xs space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                              <span>TASK-102</span>
                              <span className="px-1 py-0.2 rounded bg-muted text-foreground font-medium">HIGH</span>
                            </div>
                            <div className="text-[11px] font-medium text-foreground leading-snug">
                              Richer Task Cards & Filters
                            </div>
                            <div className="pt-1 border-t border-border/60 flex justify-between text-[8px] font-mono text-muted-foreground">
                              <span>rule: GIT_COMMIT</span>
                              <span className="text-foreground font-medium">98%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DONE Column */}
                      <div className="rounded-xl border border-border bg-card p-2.5 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center pb-1 border-b border-border text-[10px] font-mono text-muted-foreground font-medium uppercase tracking-wider">
                            <span>DONE</span>
                            <span>1</span>
                          </div>

                          <div className="mt-2 p-2.5 rounded-lg border border-border bg-muted/20 opacity-85 space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                              <span>TASK-101</span>
                              <span className="px-1 py-0.2 rounded bg-muted text-foreground">DONE</span>
                            </div>
                            <div className="text-[11px] font-medium text-muted-foreground line-through leading-snug">
                              Toast Notification Engine
                            </div>
                            <div className="pt-1 border-t border-border/60 text-[8px] font-mono text-foreground flex items-center gap-1">
                              <span>✓ 58/58 passed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INFINITE BRAND LOGO MARQUEE WITH INLINE CRISP SVGS */}
        {/* ========================================================================= */}
        <section className="bg-background pb-16 md:pb-32 border-b border-border/40">
          <div className="group relative m-auto max-w-6xl px-6 sm:px-8">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r border-border md:pr-6 mb-4 md:mb-0 shrink-0">
                <p className="text-center md:text-end text-sm text-muted-foreground font-medium">
                  Compatible with top harnesses
                </p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={35} gap={72}>
                  {/* Google Antigravity */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>ANTIGRAVITY</span>
                  </div>

                  {/* Claude Desktop / Anthropic */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z" />
                    </svg>
                    <span>CLAUDE DESKTOP</span>
                  </div>

                  {/* Cursor IDE */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M4 4l16 8-8 2-2 8z" />
                    </svg>
                    <span>CURSOR IDE</span>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GITHUB</span>
                  </div>

                  {/* OpenAI */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>OPENAI</span>
                  </div>

                  {/* Windsurf */}
                  <div className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity font-mono text-xs font-semibold text-foreground tracking-wider">
                    <svg viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d="M2 12h20M7 7l5 5-5 5M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                    <span>WINDSURF</span>
                  </div>
                </InfiniteSlider>

                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20 pointer-events-none" />
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20 pointer-events-none" />
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

const menuItems = [
  { name: 'Features', href: '#interactive-demo' },
  { name: 'Protocol', href: '#mcp-playground' },
  { name: 'Architecture', href: '#architecture' },
  { name: 'Comparison', href: '#comparison' },
  { name: 'Download', href: '#download' },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="group bg-background/50 fixed top-0 left-0 z-30 w-full border-b border-border/60 backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8 transition-all duration-300">
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            {/* Left: User's Project Logo & Name */}
            <div className="flex items-center gap-8">
              <a
                href="#"
                aria-label="home"
                className="flex items-center gap-2.5 group/brand"
              >
                <img
                  src="/logo.png"
                  alt="AI Harness Project Manager Logo"
                  className="size-7 rounded-md object-contain border border-border/40 shadow-xs transition-transform group-hover/brand:scale-105"
                />
                <span className="font-medium text-base tracking-tight text-foreground">
                  AI Harness
                </span>
              </a>

              {/* Desktop Nav Links */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground font-medium block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Desktop Action Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                asChild
                size="sm"
                className="px-4 cursor-pointer font-medium"
              >
                <a href="#download">
                  <span>Download Free</span>
                </a>
              </Button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? 'Close Menu' : 'Open Menu'}
              className="relative z-20 -m-2.5 p-2.5 block cursor-pointer lg:hidden text-foreground"
            >
              <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
              <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
            </button>
          </div>

          {/* Mobile Menu Dropdown Drawer */}
          {menuState && (
            <div className="lg:hidden pb-6 pt-2 border-t border-border/40 bg-background animate-fade-in">
              <ul className="space-y-4 text-base py-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="text-muted-foreground hover:text-foreground block duration-150 font-medium py-1"
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button
                  asChild
                  size="sm"
                  className="w-full cursor-pointer font-medium"
                >
                  <a href="#download" onClick={() => setMenuState(false)}>
                    <span>Download Free</span>
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
