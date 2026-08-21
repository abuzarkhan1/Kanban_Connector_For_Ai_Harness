import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { cn } from '@/lib/utils'

export const atmosphereEase: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955]
export const snappyEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
  tone?: 'atmosphere' | 'quick' | 'rise' | 'blur' | 'scale'
}

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  tone = 'rise',
}: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const presets = {
    atmosphere: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1.4, ease: atmosphereEase, delay },
    },
    quick: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: snappyEase, delay },
    },
    rise: {
      initial: { opacity: 0, y: 36, filter: 'blur(6px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      transition: { duration: 0.85, ease: snappyEase, delay },
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(12px)', scale: 1.02 },
      animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
      transition: { duration: 1, ease: atmosphereEase, delay },
    },
    scale: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.7, ease: snappyEase, delay },
    },
  }[tone]

  return (
    <motion.div
      className={className}
      initial={presets.initial}
      whileInView={presets.animate}
      viewport={{ once, margin: '-80px' }}
      transition={presets.transition}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className,
  stagger = 0.12,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.7, ease: snappyEase },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 18 })
  const sy = useSpring(y, { stiffness: 180, damping: 18 })

  if (reduce) return <div className={className}>{children}</div>

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 20,
  })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 200,
    damping: 20,
  })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ scale: 1.025, transition: { duration: 0.25 } }}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  value,
  decimals = 2,
  className,
}: {
  value: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => v.toFixed(decimals))

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    let start: number | null = null
    const dur = 1600
    let raf = 0
    const tick = (t: number) => {
      if (start == null) start = t
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      mv.set(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce, mv])

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}

export function DrawChart({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const path =
    'M0 70 C40 65, 80 60, 120 55 S200 35, 240 28 S320 18, 400 8'

  return (
    <svg viewBox="0 0 400 80" className={className} aria-hidden>
      <motion.path
        d={path}
        fill="none"
        stroke="#00b3dd"
        strokeWidth="2"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: atmosphereEase }}
      />
      {!reduce && (
        <motion.circle
          r="4.5"
          fill="#00b3dd"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <animateMotion dur="4s" repeatCount="indefinite" path={path} />
        </motion.circle>
      )}
    </svg>
  )
}

export function FloatingOrbs() {
  const reduce = useReducedMotion()
  if (reduce) return null

  const orbs = [
    { className: 'bg-iris-gleam/30', size: 280, x: '8%', y: '14%', dur: 14 },
    { className: 'bg-cyan-signal/25', size: 220, x: '70%', y: '22%', dur: 18 },
    { className: 'bg-orchid-bloom/20', size: 190, x: '48%', y: '58%', dur: 16 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className={cn('absolute rounded-full blur-[90px]', o.className)}
          style={
            {
              width: o.size,
              height: o.size,
              left: o.x,
              top: o.y,
            } as CSSProperties
          }
          animate={{
            x: [0, 48, -24, 0],
            y: [0, -36, 24, 0],
            scale: [1, 1.15, 0.94, 1],
          }}
          transition={{
            duration: o.dur,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function Marquee({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-obsidian to-transparent" />
      <motion.div
        className="flex w-max gap-12"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={reduce ? undefined : { duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="mono-label shrink-0 text-ash/80">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function SplitHeadline({
  italic,
  rest,
  className,
}: {
  italic: string
  rest: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const italicChars = italic.split('')
  const restChars = (` ${rest}`).split('')

  if (reduce) {
    return (
      <h1 className={cn('headline-display', className)}>
        <em className="italic">{italic}</em> {rest}
      </h1>
    )
  }

  return (
    <h1
      className={cn('headline-display flex flex-wrap justify-center', className)}
      aria-label={`${italic} ${rest}`}
    >
      <span className="inline-flex italic">
        {italicChars.map((c, i) => (
          <motion.span
            key={`i-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 48, rotateX: 50 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.85, delay: 0.12 + i * 0.055, ease: snappyEase }}
          >
            {c}
          </motion.span>
        ))}
      </span>
      <span className="inline-flex">
        {restChars.map((c, i) => (
          <motion.span
            key={`r-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.12 + italicChars.length * 0.055 + i * 0.032,
              ease: snappyEase,
            }}
          >
            {c === ' ' ? '\u00A0' : c}
          </motion.span>
        ))}
      </span>
    </h1>
  )
}

export function AnimatedBoardMockup() {
  const reduce = useReducedMotion()
  const columns = [
    { title: 'TODO', cards: ['Wire MCP tools', 'Tray shortcuts'] },
    { title: 'IN PROGRESS', cards: ['Observe git hooks'] },
    { title: 'REVIEW', cards: ['Evidence timeline'] },
  ]

  return (
    <motion.div
      className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-obsidian"
      style={{ transformStyle: 'preserve-3d' }}
      initial={reduce ? false : { rotateY: -14, rotateX: 8, opacity: 0, y: 24 }}
      whileInView={{ rotateY: -6, rotateX: 3, opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.35, ease: atmosphereEase }}
      whileHover={reduce ? undefined : { rotateY: 0, rotateX: 0, transition: { duration: 0.45 } }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <motion.span
          className="size-2.5 rounded-full bg-[#ff5f56]/80"
          animate={reduce ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <span className="size-2.5 rounded-full bg-[#ffbd2e]/80" />
        <span className="size-2.5 rounded-full bg-[#27c93f]/80" />
        <span className="mono-label ml-2 text-ash">AI Harness PM</span>
        {!reduce && (
          <motion.span
            className="ml-auto size-1.5 rounded-full bg-cyan-signal"
            animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        {columns.map((col, ci) => (
          <div key={col.title} className="space-y-2">
            <div className="mono-label text-ash">{col.title}</div>
            {col.cards.map((c, i) => (
              <motion.div
                key={c}
                className="rounded-lg bg-graphite p-2.5 text-[12px] leading-snug text-cloud"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + ci * 0.12 + i * 0.08, duration: 0.45 }}
                animate={
                  reduce || !(ci === 1 && i === 0)
                    ? undefined
                    : {
                        y: [0, -3, 0],
                        boxShadow: [
                          '0 0 0 0 rgba(0,179,221,0)',
                          '0 0 0 1px rgba(0,179,221,0.5)',
                          '0 0 0 0 rgba(0,179,221,0)',
                        ],
                      }
                }
              >
                {c}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function TypedCode({ code }: { code: string }) {
  const ref = useRef<HTMLPreElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [text, setText] = useState(reduce ? code : '')

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setText(code)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 3
      setText(code.slice(0, i))
      if (i >= code.length) window.clearInterval(id)
    }, 14)
    return () => window.clearInterval(id)
  }, [inView, code, reduce])

  return (
    <pre ref={ref} className="mt-4 overflow-x-auto font-mono text-[12px] leading-relaxed text-cloud">
      {text}
      {!reduce && text.length < code.length ? <span className="inline typed-caret" /> : null}
    </pre>
  )
}
