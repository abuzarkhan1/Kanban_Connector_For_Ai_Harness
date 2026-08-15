import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { Menu, X } from 'lucide-react'

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl text-foreground">
                  Ship 10x Faster with AI Harness PM
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                  The local-first development control plane for Google Antigravity, Claude Desktop, and Cursor.
                  Zero cloud servers, 0ms SQLite latency, and deterministic Kanban state derivation without spending a single API token.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="px-5 text-base cursor-pointer"
                  >
                    <a href="#download">
                      <span className="text-nowrap">Start Building</span>
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base cursor-pointer"
                  >
                    <a href="#interactive-demo">
                      <span className="text-nowrap">Explore Demo</span>
                    </a>
                  </Button>
                </div>
              </div>

              <img
                className="pointer-events-none order-first ml-auto h-56 w-full object-cover invert sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain dark:mix-blend-lighten dark:invert-0"
                src="https://ik.imagekit.io/lrigu76hy/tailark/abstract-bg.jpg?updatedAt=1745733473768"
                alt="Abstract Object"
                height="4000"
                width="3000"
              />
            </div>
          </div>
        </section>

        {/* Customer & Harness Brand Slider from design.md */}
        <section className="bg-background pb-16 md:pb-32">
          <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r border-border md:pr-6 mb-4 md:mb-0">
                <p className="text-end text-sm text-muted-foreground">Powering the best teams</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider
                  speedOnHover={20}
                  speed={40}
                  gap={112}
                >
                  <div className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nvidia.svg"
                      alt="Nvidia Logo"
                      height="20"
                      width="auto"
                    />
                  </div>

                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/column.svg"
                      alt="Column Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/github.svg"
                      alt="GitHub Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nike.svg"
                      alt="Nike Logo"
                      height="20"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                      alt="Lemon Squeezy Logo"
                      height="20"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/laravel.svg"
                      alt="Laravel Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-7 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lilly.svg"
                      alt="Lilly Logo"
                      height="28"
                      width="auto"
                    />
                  </div>

                  <div className="flex">
                    <img
                      className="mx-auto h-6 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/openai.svg"
                      alt="OpenAI Logo"
                      height="24"
                      width="auto"
                    />
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
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
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
