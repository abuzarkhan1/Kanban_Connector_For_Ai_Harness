import { motion } from 'framer-motion'
import { PrimaryButton, PromoChip } from './Buttons'
import {
  CountUp,
  DrawChart,
  FloatingOrbs,
  Magnetic,
  Reveal,
  Stagger,
  StaggerItem,
  TiltCard,
} from './motion'

const CONNECT_CARDS = [
  {
    italic: 'Monitor',
    rest: 'every harness',
    body: 'Cursor to Claude—activity across every agent.',
    mock: 'cursor · claude · antigravity',
  },
  {
    italic: 'See',
    rest: 'the entire board',
    body: 'Confidence scores on every move.',
    mock: 'confidence 0.94 · IN PROGRESS',
  },
  {
    italic: 'Open',
    rest: 'any task',
    body: 'Commits, diffs, and process evidence.',
    mock: 'evidence · commit:a1f3',
  },
  {
    italic: 'Plan',
    rest: "what's next",
    body: 'Multi-repo workspaces and tray shortcuts.',
    mock: 'workspace · 3 repos',
  },
]

export function ConnectSection() {
  return (
    <section id="connect" className="section-pad bg-obsidian">
      <div className="site-wrap">
        <div className="mx-auto max-w-[560px] text-center">
          <Reveal>
            <h2 className="headline-section">
              <em className="italic">Connect</em> any agent
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <p className="text-body-light">
              Native MCP — <span className="font-mono text-[16px] text-cloud">npx -y kanban-mcp</span>
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2" stagger={0.12}>
          {CONNECT_CARDS.map((card) => (
            <StaggerItem key={card.italic}>
              <TiltCard>
                <article className="dark-chrome card-elevated flex min-h-[260px] flex-col justify-between !rounded-2xl">
                  <motion.div
                    className="rounded-lg bg-obsidian px-4 py-3 font-mono text-[12px] text-ash"
                    whileHover={{ color: '#f5f5f7' }}
                  >
                    {card.mock}
                  </motion.div>
                  <div className="mt-8">
                    <h3 className="headline-card">
                      <em className="italic">{card.italic}</em> {card.rest}
                    </h3>
                    <p className="mt-3 text-[16px] font-light leading-[1.5] text-ash">{card.body}</p>
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

export function InferSection() {
  return (
    <section id="infer" className="section-pad bg-obsidian">
      <div className="site-wrap">
        <Reveal tone="blur">
          <div className="sky-atmosphere relative overflow-hidden rounded-[30px] px-8 py-20 text-center md:px-16 md:py-24">
            <FloatingOrbs />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="relative z-10 mx-auto max-w-[560px]">
              <h2 className="headline-section">
                <em className="italic">Derive</em> your next state
              </h2>
              <p className="text-body-light mt-5">
                Board moves inferred from commits, tests, and processes.
              </p>
              <motion.div
                className="mx-auto mt-12 max-w-xl rounded-2xl bg-black/35 p-6 text-left backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="mono-label text-ash">Confidence</div>
                    <div className="headline-card mt-1">
                      <CountUp value={0.94} />
                    </div>
                  </div>
                  <motion.div
                    className="text-right text-[14px] font-light text-ash"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    TODO → IN PROGRESS
                    <br />
                    evidence: commit + pty
                  </motion.div>
                </div>
                <DrawChart className="mt-6 h-16 w-full" />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function LocalSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-abyss">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-gleam/15 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="site-wrap relative z-10 text-center">
        <Reveal tone="scale">
          <h2 className="headline-section">
            <em className="italic">Keep</em> work local
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-5 max-w-[560px]">
          <p className="text-body-light">SQLite. Zero tokens. No cloud.</p>
        </Reveal>
      </div>
    </section>
  )
}

const QUOTES = [
  {
    quote: 'One board for everything my coding agents touch.',
    name: 'DEV TEAM LEAD',
  },
  {
    quote: 'Pointed Cursor at kanban-mcp—the board started tracking real work.',
    name: 'STAFF ENGINEER',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-pad bg-obsidian">
      <div className="site-wrap">
        <Reveal>
          <h2 className="headline-section text-center">
            <em className="italic">Read</em> what builders say
          </h2>
        </Reveal>
        <Stagger className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
          {QUOTES.map((q) => (
            <StaggerItem key={q.name}>
              <motion.article
                className="card-inverted flex h-full flex-col justify-between"
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <p className="text-[16px] font-light leading-[1.5] text-void">{q.quote}</p>
                <p className="mono-label mt-8 text-void/60">{q.name}</p>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

const UPDATES = [
  {
    label: 'Launch',
    title: 'Local control plane for AI coding harnesses',
    href: '#/docs',
  },
  {
    label: 'Technical',
    title: 'Deriving Kanban from Git, FS, and process evidence',
    href: '#/docs',
  },
  {
    label: 'Update',
    title: 'Native MCP for Cursor, Claude, and more',
    href: '#/docs',
  },
]

export function UpdatesSection() {
  return (
    <section className="section-pad bg-obsidian">
      <div className="site-wrap">
        <Reveal>
          <h2 className="headline-section text-center">
            <em className="italic">Discover</em> what's new
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3" stagger={0.12}>
          {UPDATES.map((u) => (
            <StaggerItem key={u.title}>
              <TiltCard>
                <article className="dark-chrome card-elevated flex min-h-[240px] flex-col justify-between !rounded-2xl">
                  <div className="mono-label text-ash">{u.label}</div>
                  <div>
                    <h3 className="headline-card">{u.title}</h3>
                    <a
                      href={u.href}
                      className="mt-6 inline-block text-[16px] font-light text-cloud transition-opacity duration-200 ease hover:opacity-70"
                    >
                      Read more
                    </a>
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

export function DownloadHero() {
  return (
    <section id="download" className="relative overflow-hidden py-[100px]">
      <div className="sky-atmosphere absolute inset-0" />
      <FloatingOrbs />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
      <div className="site-wrap relative z-10 text-center">
        <Reveal tone="scale">
          <PromoChip>FREE FOREVER — MIT LICENSE</PromoChip>
        </Reveal>
        <Reveal tone="blur" delay={0.1}>
          <h2 className="headline-display mt-8">
            <em className="italic">Download</em> AI Harness
          </h2>
        </Reveal>
        <Reveal delay={0.18} className="mx-auto mt-5 max-w-[560px]">
          <p className="text-body-light">macOS, Windows, Linux. MIT.</p>
        </Reveal>
        <Reveal tone="scale" delay={0.28} className="mt-8">
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
      </div>
    </section>
  )
}
