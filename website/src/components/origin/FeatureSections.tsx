import { motion } from 'framer-motion'
import {
  AnimatedBoardMockup,
  Reveal,
  Stagger,
  StaggerItem,
  TiltCard,
  TypedCode,
} from './motion'

export function SimplifySection() {
  return (
    <section className="section-pad bg-obsidian">
      <div className="site-wrap text-center">
        <Reveal>
          <h2 className="headline-section">
            <em className="italic">Simplify</em> your workflow
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-5 max-w-[560px]">
          <p className="text-body-light">One local board. Evidence, not guesses.</p>
        </Reveal>
        <Reveal tone="atmosphere" delay={0.15} className="mt-14">
          <motion.div
            className="card-elevated !px-8 !py-16 md:!px-[90px] md:!py-[90px]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.35 }}
          >
            <AnimatedBoardMockup />
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

const TRACK_CARDS = [
  {
    title: 'Watch Git',
    body: 'Commits and branches stream in as evidence.',
    bg: 'bg-iris-gleam',
    mock: 'git commit · main',
  },
  {
    title: 'Track files',
    body: 'Edits map to tasks as agents ship code.',
    bg: 'bg-orchid-bloom',
    mock: 'src/board.ts changed',
  },
  {
    title: 'See processes',
    body: 'Know which harness is running or stalled.',
    bg: 'bg-periwinkle',
    mock: 'cursor · active',
  },
]

export function TrackSection() {
  return (
    <section id="observe" className="section-pad bg-obsidian">
      <div className="site-wrap">
        <div className="mx-auto max-w-[560px] text-center">
          <Reveal>
            <h2 className="headline-section">
              <em className="italic">Track</em> everything
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <p className="text-body-light">
              Git, filesystem, and process signals—one board.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3" stagger={0.14}>
          {TRACK_CARDS.map((card) => (
            <StaggerItem key={card.title}>
              <TiltCard>
                <article
                  className={`${card.bg} card-feature flex min-h-[320px] flex-col justify-between overflow-hidden`}
                >
                  <motion.div
                    className="rounded-lg bg-black/20 px-4 py-3 font-mono text-[12px] text-pure"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {card.mock}
                  </motion.div>
                  <div className="mt-10">
                    <h3 className="headline-card">{card.title}</h3>
                    <p className="mt-3 text-[16px] font-light leading-[1.5] text-pure/90">
                      {card.body}
                    </p>
                  </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function AskSection() {
  const code = `{
  "column": "IN_PROGRESS",
  "task": "Observe git hooks",
  "confidence": 0.94,
  "evidence": ["commit:a1f3", "pty:cursor"]
}`

  return (
    <section id="ask" className="section-pad bg-abyss">
      <div className="site-wrap">
        <div className="mx-auto max-w-[560px] text-center">
          <Reveal>
            <h2 className="headline-section">
              <em className="italic">Ask</em> anything
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <p className="text-body-light">
              MCP answers grounded in your workspace evidence.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2" stagger={0.15}>
          <StaggerItem>
            <TiltCard>
              <article className="card-feature relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-deep-iris text-center">
                <motion.span
                  className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-iris-gleam/50 blur-3xl"
                  animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative z-10">
                  <h3 className="headline-card">
                    <em className="italic">See</em> instant insights
                  </h3>
                  <p className="mx-auto mt-4 max-w-sm text-[16px] font-light leading-[1.5] text-pure/90">
                    Which agent owns which task—and why it moved.
                  </p>
                </div>
              </article>
            </TiltCard>
          </StaggerItem>
          <StaggerItem>
            <TiltCard>
              <article className="card-feature relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-orchid-bloom text-center">
                <motion.span
                  className="pointer-events-none absolute -bottom-8 -right-8 size-52 rounded-full bg-pale-iris/60 blur-3xl"
                  animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative z-10">
                  <h3 className="headline-card">
                    <em className="italic">Unlock</em> deep recaps
                  </h3>
                  <p className="mx-auto mt-4 max-w-sm text-[16px] font-light leading-[1.5] text-pure/90">
                    Your day, summarized from commits and harness activity.
                  </p>
                </div>
              </article>
            </TiltCard>
          </StaggerItem>
        </Stagger>

        <Reveal tone="blur" delay={0.1} className="mt-3">
          <div className="card-elevated text-left">
            <div className="mono-label text-ash">JSON-RPC · kanban_list_tasks</div>
            <TypedCode code={code} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
