import { motion, useReducedMotion } from 'framer-motion'
import { PrimaryButton } from './Buttons'

interface FooterProps {
  onNavigatePage?: (page: 'docs' | 'terms' | 'privacy' | 'compliance') => void
}

const atmosphereEase: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955]

const BRAND_CHARS = [
  { ch: 'A', italic: true },
  { ch: 'I', italic: true },
  { ch: '\u00A0', italic: false },
  { ch: 'H', italic: false },
  { ch: 'a', italic: false },
  { ch: 'r', italic: false },
  { ch: 'n', italic: false },
  { ch: 'e', italic: false },
  { ch: 's', italic: false },
  { ch: 's', italic: false },
]

function GiantBrand() {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <p className="footer-giant-brand text-center" aria-label="AI Harness">
        <em>AI</em> Harness
      </p>
    )
  }

  return (
    <motion.p
      className="footer-giant-brand flex justify-center overflow-hidden"
      aria-label="AI Harness"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.045, delayChildren: 0.08 },
        },
      }}
    >
      {BRAND_CHARS.map((item, i) => (
        <motion.span
          key={`${item.ch}-${i}`}
          className={item.italic ? 'italic' : undefined}
          variants={{
            hidden: { opacity: 0, y: '0.35em' },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 2.5, ease: atmosphereEase },
            },
          }}
        >
          {item.ch}
        </motion.span>
      ))}
    </motion.p>
  )
}

export function OriginFooter({ onNavigatePage }: FooterProps) {
  return (
    <footer className="overflow-hidden border-t border-white/10 bg-obsidian pb-8 pt-20">
      <div className="site-wrap">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="headline-card">The Gist</h3>
            <p className="mt-4 max-w-sm text-body-light !text-[16px]">
              Notes on local-first agent workflows.
            </p>
            <form
              className="mt-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-void px-[22px] py-2.5 text-[16px] text-pure placeholder:text-ash outline-none transition-[border-color] duration-200 ease focus:border-white/40"
              />
              <PrimaryButton type="submit" withArrow={false}>
                Join
              </PrimaryButton>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="mono-label text-cloud">Product</div>
            <ul className="mt-4 space-y-3 text-[16px] font-light text-ash">
              <li>
                <a href="#observe" className="transition-opacity duration-200 hover:opacity-70">
                  Track
                </a>
              </li>
              <li>
                <a href="#ask" className="transition-opacity duration-200 hover:opacity-70">
                  Ask
                </a>
              </li>
              <li>
                <a href="#connect" className="transition-opacity duration-200 hover:opacity-70">
                  Connect
                </a>
              </li>
              <li>
                <a href="#infer" className="transition-opacity duration-200 hover:opacity-70">
                  Derive
                </a>
              </li>
              <li>
                <a href="#download" className="transition-opacity duration-200 hover:opacity-70">
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-label text-cloud">Resources</div>
            <ul className="mt-4 space-y-3 text-[16px] font-light text-ash">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('docs')}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  Documentation
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  GitHub
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('privacy')}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('terms')}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('compliance')}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  Compliance
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-label text-cloud">Desktop app</div>
            <p className="mt-4 text-[16px] font-light text-ash">
              macOS, Windows, and Linux on GitHub Releases.
            </p>
            <PrimaryButton
              href="https://github.com/abuzarkhan1/Kanban_Connector_For_Ai_Harness/releases"
              target="_blank"
              rel="noreferrer"
              className="mt-5"
            >
              Get Started
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Giant brand — full-bleed signature */}
      <div className="relative mt-20 w-full overflow-hidden px-4 md:mt-28">
        <GiantBrand />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <div className="site-wrap mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="mono-label text-fog">Local-first · MIT</p>
        <p className="text-[12px] leading-relaxed text-fog">
          © {new Date().getFullYear()} AI Harness Project Manager
        </p>
      </div>
    </footer>
  )
}
