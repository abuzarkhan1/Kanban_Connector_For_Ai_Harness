import React, { useState } from 'react'
import { Calculator, TrendingUp, Cpu } from 'lucide-react'
import { sounds } from '../lib/audio'

export const TokenRoiCalculator: React.FC = () => {
  const [dailyTasks, setDailyTasks] = useState(50)

  // Calculations:
  // Each task undergoes ~8 lifecycle checks & transitions in an active harness sprint.
  // A cloud LLM approach sends ~2,500 context tokens per check (task description, rules, file diffs, prompt formatting).
  // Cost model: ~$0.015 per 1K tokens (blended input/output for GPT-4o / Claude 3.5 Sonnet agent calls).
  const transitionsPerTask = 8
  const tokensPerTransition = 2500
  const monthlyTasks = dailyTasks * 30
  const monthlyTransitions = monthlyTasks * transitionsPerTask
  const monthlyTokens = monthlyTransitions * tokensPerTransition
  const monthlyCloudCost = Math.round((monthlyTokens / 1000) * 0.015)
  const yearlySavings = monthlyCloudCost * 12

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyTasks(Number(e.target.value))
    sounds.playClick()
  }

  return (
    <section className="py-20 bg-[#07080a] relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <Calculator className="size-3.5 text-emerald-400" />
            <span>Interactive Token ROI Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Calculate Your Cloud LLM Savings
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Other tools charge you hundreds of dollars in API tokens just to classify tickets and move cards. AI
            Harness PM does it with deterministic rules on your CPU in 0.2ms.
          </p>
        </div>

        {/* Interactive Calculator Shell */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Control Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="tasks-slider" className="text-sm font-semibold text-white tracking-tight">
                    Daily AI Agent Tasks / Sprints
                  </label>
                  <span className="font-mono text-xl font-bold text-emerald-400">
                    {dailyTasks} tasks / day
                  </span>
                </div>
                <input
                  id="tasks-slider"
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={dailyTasks}
                  onChange={handleSliderChange}
                  className="w-full accent-emerald-400 h-2 bg-[#14171c] rounded-lg cursor-pointer border border-white/10"
                />
                <div className="flex justify-between text-[11px] font-mono text-white/40 mt-2">
                  <span>5 (Solo Dev)</span>
                  <span>50 (Active Team)</span>
                  <span>250 (High-Velocity Swarm)</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#14171c]">
                  <div className="text-[11px] font-mono text-[#a0a5ad]">Monthly Lifecycle Transitions</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {monthlyTransitions.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#14171c]">
                  <div className="text-[11px] font-mono text-[#a0a5ad]">Cloud Tokens Avoided</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                    {(monthlyTokens / 1_000_000).toFixed(1)}M tokens
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#14171c] text-[12px] text-[#a0a5ad] flex items-start gap-3">
                <Cpu className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Deterministic inference runs on your local CPU with <strong>0 tokens sent</strong> to OpenAI,
                  Anthropic, or Google. Your data stays 100% private.
                </p>
              </div>
            </div>

            {/* Right Comparison Column (6 cols) */}
            <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#14171c] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Cloud Tool Price */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[13px] text-[#a0a5ad] block">Cloud LLM Prompt-Based PMs</span>
                    <span className="text-xs text-red-400/80 font-mono">Token billing + cloud server tier</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono line-through text-white/40">
                      ${monthlyCloudCost} / mo
                    </span>
                  </div>
                </div>

                {/* AI Harness PM Price */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[14px] font-semibold text-white block">AI Harness Project Manager</span>
                    <span className="text-xs text-emerald-400 font-mono">100% Local-First Engine</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-emerald-400">$0.00</span>
                    <span className="text-xs text-white/50 block font-mono">Forever Free & OSS</span>
                  </div>
                </div>
              </div>

              {/* Net Annual Savings Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                    Estimated Annual Savings
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    ${yearlySavings.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/50 block">/ year saved in API tokens</span>
                </div>
                <div className="size-12 rounded-xl bg-emerald-400 text-[#07080a] grid place-items-center font-bold">
                  <TrendingUp className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
