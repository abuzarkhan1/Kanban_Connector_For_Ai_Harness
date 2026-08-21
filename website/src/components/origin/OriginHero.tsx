import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { NavBar } from './NavBar'
import { PrimaryButton, PromoChip } from './Buttons'
import {
  FloatingOrbs,
  Magnetic,
  Marquee,
  Reveal,
  SplitHeadline,
} from './motion'

const PROMPTS = [
  'Which task is the agent on right now?',
  'Show evidence for the last board move',
  'npx -y kanban-mcp',
  'What harnesses are connected?',
]

const HARNESSES = [
  'Antigravity',
  'Claude Desktop',
  'Cursor',
  'Windsurf',
  'OpenAI Codex',
  'GitHub Copilot',
]

interface HeroSectionProps {
  onNavigateDocs?: () => void
}

export function OriginHero({ onNavigateDocs }: HeroSectionProps) {
  const [promptIndex, setPromptIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const full = PROMPTS[promptIndex]
    const speed = deleting ? 32 : 48

    if (!deleting && display === full) {
      const hold = setTimeout(() => setDeleting(true), 1400)
      return () => clearTimeout(hold)
    }

    if (deleting && display === '') {
      setDeleting(false)
      setPromptIndex((i) => (i + 1) % PROMPTS.length)
      return
    }

    const t = setTimeout(() => {
      setDisplay((prev) =>
        deleting ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(t)
  }, [display, deleting, promptIndex])

  return (
    <>
      <NavBar onNavigateDocs={onNavigateDocs} />
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-20 pt-36">
        <div className="sky-atmosphere pointer-events-none absolute inset-0" />
        <FloatingOrbs />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian to-transparent" />

        <div className="site-wrap relative z-10 flex flex-col items-center text-center">
          <Reveal tone="scale">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PromoChip>LOCAL-FIRST — MIT OPEN SOURCE</PromoChip>
            </motion.div>
          </Reveal>

          <div className="mt-8 max-w-[920px]">
            <SplitHeadline italic="Observe" rest="your agents." />
          </div>

          <Reveal tone="atmosphere" delay={0.55} className="mt-6 max-w-[560px]">
            <p className="text-body-light">
              The local control plane for coding agents—Kanban from evidence, not guesses.
            </p>
          </Reveal>

          <Reveal tone="scale" delay={0.7} className="mt-8">
            <Magnetic>
              <PrimaryButton
                href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
                target="_blank"
                rel="noreferrer"
                className="btn-primary-glow"
              >
                Get Started
              </PrimaryButton>
            </Magnetic>
          </Reveal>

          <Reveal tone="rise" delay={0.85} className="mt-8 w-full max-w-[590px]">
            <motion.div
              className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-[22px] py-2 backdrop-blur-[24px]"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(132,125,255,0)',
                  '0 0 24px 0 rgba(132,125,255,0.18)',
                  '0 0 0 0 rgba(132,125,255,0)',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="typed-caret min-h-[1.5rem] flex-1 text-left text-[16px] font-light text-ash">
                {display}
              </span>
              <motion.button
                type="button"
                aria-label="Copy MCP command"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-pure"
                whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.35)' }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigator.clipboard.writeText('npx -y kanban-mcp')}
              >
                <ArrowUp className="size-4" />
              </motion.button>
            </motion.div>
          </Reveal>

          <Reveal tone="quick" delay={1} className="mt-12 w-full max-w-3xl">
            <Marquee items={HARNESSES} />
          </Reveal>
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.4, duration: 0.6 },
            y: { delay: 1.4, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-ash to-transparent" />
        </motion.div>
      </section>
    </>
  )
}
