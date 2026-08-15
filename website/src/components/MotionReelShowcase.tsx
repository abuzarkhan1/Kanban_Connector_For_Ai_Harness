import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2, FileCode, Bell, Cpu } from 'lucide-react'

export const MotionReelShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(30) // 0 to 100

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Map progress (0 - 100) to stages
  const getStageIndex = () => {
    if (progress < 20) return 0
    if (progress < 40) return 1
    if (progress < 65) return 2
    if (progress < 85) return 3
    return 4
  }

  const stageIndex = getStageIndex()

  const stages = [
    {
      step: '01',
      title: 'Prompt Dispatched',
      subtitle: 'Developer instructs Antigravity/Claude',
      icon: Sparkles,
      color: 'text-cyan-400',
      terminal: '$ antigravity /goal "Implement Toast Notification System"'
    },
    {
      step: '02',
      title: 'Filesystem & Git Watch',
      subtitle: 'Engine observes code changes & commits',
      icon: FileCode,
      color: 'text-indigo-400',
      terminal: 'FS_EVENT: modified src/renderer/src/components/Toast.tsx\nGIT_EVENT: commit b43165f on branch feature/toast-system'
    },
    {
      step: '03',
      title: 'Automated Test Verification',
      subtitle: 'Observes Vitest test suite execution',
      icon: Cpu,
      color: 'text-yellow-400',
      terminal: 'RUN vitest run\nTest Files: 10 passed (10)\nTests: 58 passed (58)\nExit Code: 0 (SUCCESS)'
    },
    {
      step: '04',
      title: 'Deterministic Rule Inference',
      subtitle: 'Evaluates state transition with 98% confidence',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      terminal: 'EVALUATE RULE_GIT_COMMIT & RULE_TEST_RUN_PASSED\nTarget: TASK-101 (READY_FOR_REVIEW -> APPROVED -> DONE)\nConfidence: 98.4%'
    },
    {
      step: '05',
      title: 'Instant Board Update & OS Alert',
      subtitle: 'Zero cloud latency, card moves instantly',
      icon: Bell,
      color: 'text-emerald-300',
      terminal: 'NOTIFICATION: "Task State Changed: Toast Notification System moved to DONE"\nSQLite DB Updated (0.4ms)'
    }
  ]

  return (
    <section id="motion-showcase" className="py-20 bg-[#07080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>Remotion-Style Motion Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Autonomous Lifecycle in Motion
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Watch how AI Harness Project Manager observes file writes, Git commits, and test outputs to
            deterministically advance Kanban tasks without sending a single prompt to a cloud LLM.
          </p>
        </div>

        {/* Motion Studio Reel Player */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12] shadow-2xl overflow-hidden">
          {/* Main Visual Display */}
          <div className="p-8 sm:p-12 bg-gradient-to-b from-[#14171c] to-[#07080a] min-h-[360px] flex flex-col justify-between">
            {/* Top Stage Indicators */}
            <div className="grid grid-cols-5 gap-2 mb-8">
              {stages.map((s, idx) => {
                const isActive = stageIndex === idx
                const isPast = stageIndex > idx
                const Icon = s.icon
                return (
                  <button
                    key={s.step}
                    onClick={() => setProgress(idx * 20 + 5)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-white/40 bg-white/[0.06] shadow-lg'
                        : isPast
                        ? 'border-white/10 bg-white/[0.02] text-white/60'
                        : 'border-white/[0.04] bg-transparent text-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-white/50">{s.step}</span>
                      <Icon className={`size-3.5 ${isActive ? s.color : 'text-white/40'}`} />
                    </div>
                    <div className="text-[12px] font-semibold text-white tracking-tight truncate">{s.title}</div>
                  </button>
                )
              })}
            </div>

            {/* Active Stage Cinematic Frame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-[11px] font-mono text-white/90">
                  <span>STAGE {stages[stageIndex].step} OF 05</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stages[stageIndex].title}
                </h3>
                <p className="text-base text-[#a0a5ad] leading-relaxed font-normal">
                  {stages[stageIndex].subtitle}
                </p>
              </div>

              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#07080a] p-4 font-mono text-[12px] text-emerald-400 shadow-inner">
                <div className="text-white/40 text-[10px] mb-2 pb-1.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span>TELEMETRY STAGE LOG</span>
                  <span className="text-emerald-400">STATUS: ACTIVE</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{stages[stageIndex].terminal}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Timeline Scrub Controls */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0d0f12] flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="size-9 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-white grid place-items-center transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => setProgress(0)}
              className="size-9 rounded-lg border border-white/10 bg-[#14171c] hover:bg-[#1f242c] text-[#a0a5ad] hover:text-white grid place-items-center transition-colors cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="size-4" />
            </button>

            {/* Scrub Slider */}
            <div className="flex-1 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#a0a5ad] w-12 text-right">
                {Math.round((progress / 100) * 10)}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
