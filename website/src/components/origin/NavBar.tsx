import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { PrimaryButton } from './Buttons'
import { cn } from '@/lib/utils'

interface NavBarProps {
  onNavigateDocs?: () => void
}

const NAV_LINKS = [
  { label: 'Track', href: '#observe' },
  { label: 'Ask', href: '#ask' },
  { label: 'Connect', href: '#connect' },
  { label: 'Derive', href: '#infer' },
]

export function NavBar({ onNavigateDocs }: NavBarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[99] px-4 pt-4 md:px-6 md:pt-6"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={cn(
          'nav-glass mx-auto flex max-w-[1200px] items-center justify-between gap-3 rounded-lg px-3 py-2 transition-[background-color,box-shadow] duration-300 ease',
          scrolled && 'bg-[rgba(15,16,17,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
        )}
      >
        <a href="#/" className="flex items-center gap-2.5 pl-1">
          <motion.img
            src="/logo.png"
            alt="AI Harness"
            className="size-7 rounded object-contain"
            whileHover={{ rotate: 8, scale: 1.06 }}
            transition={{ duration: 0.25 }}
          />
          <span className="font-display text-[18px] font-light tracking-tight text-pure">
            AI Harness
          </span>
        </a>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <button type="button" onClick={onNavigateDocs} className="nav-link">
            Docs
          </button>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
            target="_blank"
            rel="noreferrer"
            className="text-[16px] font-light text-ash transition-opacity duration-200 ease hover:opacity-70"
          >
            GitHub
          </a>
          <PrimaryButton
            href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
            target="_blank"
            rel="noreferrer"
          >
            Get Started
          </PrimaryButton>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/15 p-2 text-pure md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="nav-glass mt-2 overflow-hidden rounded-lg p-3 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onNavigateDocs?.()
                }}
                className="nav-link text-left"
              >
                Docs
              </button>
              <PrimaryButton
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                className="mt-3 justify-center"
                onClick={() => setOpen(false)}
              >
                Get Started
              </PrimaryButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
