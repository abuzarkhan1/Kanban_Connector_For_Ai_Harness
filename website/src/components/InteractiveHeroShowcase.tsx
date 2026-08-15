import React, { useState } from 'react'
import {
  GitCommit,
  CheckCircle2,
  RotateCcw,
  Bot,
  Zap
} from 'lucide-react'
import { sounds } from '../lib/audio'
import confetti from 'canvas-confetti'

export const InteractiveHeroShowcase: React.FC = () => {
  const [taskStatus, setTaskStatus] = useState<'READY' | 'ASSIGNED' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'>('IN_PROGRESS')
  const [activeTab, setActiveTab] = useState<'ide' | 'terminal' | 'rules'>('ide')
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[14:40:02] [engine] Observation loop active on /Users/abuzar/Desktop/kanban',
    '[14:40:10] [mcp] Antigravity agent connected via stdio JSON-RPC 2.0',
    '[14:40:12] [inference] Task TASK-102 moved to IN_PROGRESS (Agent Claim)'
  ])
  const [isSimulating, setIsSimulating] = useState(false)

  const triggerCommit = () => {
    if (isSimulating) return
    setIsSimulating(true)
    sounds.playThud()

    setTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] $ git add . && git commit -m "feat(toast): implement multi-channel alerts"`,
      `[${new Date().toLocaleTimeString()}] [git-observer] Commit 4a8f9c detected on branch feature/toast`,
      `[${new Date().toLocaleTimeString()}] [inference] Evaluating RULE_GIT_COMMIT (Confidence: 0.98)`,
      ...prev.slice(0, 5)
    ])

    setTimeout(() => {
      setTaskStatus('REVIEW')
      sounds.playSuccess()
      setIsSimulating(false)
    }, 400)
  }

  const triggerTests = () => {
    if (isSimulating) return
    setIsSimulating(true)
    sounds.playThud()

    setTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] $ npx vitest run`,
      `[${new Date().toLocaleTimeString()}] ✓ src/packages/engine/__tests__/inference.test.ts (12 tests) 24ms`,
      `[${new Date().toLocaleTimeString()}] Tests: 58 passed (58 total) | Exit Code: 0 (SUCCESS)`,
      `[${new Date().toLocaleTimeString()}] [inference] RULE_TEST_RUN_PASSED -> TASK-102 moved to DONE`,
      ...prev.slice(0, 5)
    ])

    setTimeout(() => {
      setTaskStatus('DONE')
      sounds.playSuccess()
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00ffcc', '#ffffff', '#38bdf8', '#a855f7']
      })
      setIsSimulating(false)
    }, 400)
  }

  const triggerAgentClaim = () => {
    sounds.playClick()
    setTaskStatus('IN_PROGRESS')
    setTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [mcp-server] Tool call: kanban_move_task(id="TASK-102", to="IN_PROGRESS")`,
      `[${new Date().toLocaleTimeString()}] [agent] Claude 3.5 Sonnet claimed TASK-102. Work tree initialized.`,
      ...prev.slice(0, 5)
    ])
  }

  const resetSimulation = () => {
    sounds.playClick()
    setTaskStatus('READY')
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] [engine] Simulator reset to initial state.`,
      `[${new Date().toLocaleTimeString()}] [kanban] TASK-102 status set to READY.`
    ])
  }

  return (
    <div className="relative rounded-2xl border border-white/15 bg-[#080a0f]/90 backdrop-blur-2xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(56,189,248,0.15)] overflow-hidden text-left">
      {/* Top macOS App Chrome Header */}
      <div className="h-12 px-4 border-b border-white/[0.08] bg-[#0e1118] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-inner" />
            <span className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-inner" />
            <span className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-inner" />
          </div>
          <span className="font-mono text-[12px] text-white/70 font-medium hidden sm:inline">
            Interactive AI Harness & Kanban Simulator
          </span>
        </div>

        {/* Action Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerAgentClaim}
            disabled={isSimulating}
            className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Simulate AI Agent Claiming Task"
          >
            <Bot className="size-3.5 text-purple-400" />
            <span className="hidden md:inline">1. Agent Claim</span>
          </button>

          <button
            onClick={triggerCommit}
            disabled={isSimulating}
            className="px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Simulate Git Commit"
          >
            <GitCommit className="size-3.5 text-cyan-400" />
            <span className="hidden md:inline">2. Git Commit</span>
          </button>

          <button
            onClick={triggerTests}
            disabled={isSimulating}
            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Simulate Tests Passing"
          >
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span className="hidden md:inline">3. Vitest Pass</span>
          </button>

          <button
            onClick={resetSimulation}
            className="p-1 rounded-lg border border-white/10 bg-[#161a22] hover:bg-[#202632] text-white/60 hover:text-white transition-colors"
            title="Reset Simulator"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split-Screen Canvas: IDE & Agent on Left | Kanban Board on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        {/* Left Side: Agent IDE & Live File Terminal (6 cols) */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0b0e14] p-4 flex flex-col justify-between">
          <div>
            {/* Tab Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.06]">
              <button
                onClick={() => setActiveTab('ide')}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  activeTab === 'ide'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                src/toast/toastEngine.ts
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  activeTab === 'terminal'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                Agent Terminal
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  activeTab === 'rules'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                Inference Rules
              </button>
            </div>

            {/* Code / Terminal Display */}
            {activeTab === 'ide' && (
              <div className="rounded-xl border border-white/[0.06] bg-[#06080c] p-3.5 font-mono text-[12px] leading-relaxed text-[#c4c9d0] shadow-inner">
                <div className="text-white/30 text-[10px] mb-2 flex items-center justify-between">
                  <span>TYPESCRIPT · 48 LINES</span>
                  <span className="text-emerald-400">DIFF: +18 / -2</span>
                </div>
                <pre className="text-[11px] font-mono overflow-x-auto text-[#f0f3f6]">
                  <code>
                    <span className="text-purple-400">export class</span>{' '}
                    <span className="text-yellow-300">ToastNotificationEngine</span> {'{\n'}
                    {'  '}<span className="text-purple-400">private</span> queue = <span className="text-blue-400">new</span>{' '}
                    <span className="text-yellow-300">Map</span>&lt;<span className="text-cyan-300">string, Toast</span>&gt;(){'\n'}
                    {'\n'}
                    {'  '}<span className="text-purple-400">public</span>{' '}
                    <span className="text-blue-300">emit</span>(message: <span className="text-cyan-300">string</span>, channel: <span className="text-yellow-300">ToastChannel</span>) {'{\n'}
                    {'    '}<span className="text-green-400">// Native OS Notification + Desktop IPC Sound</span>{'\n'}
                    {'    '}<span className="text-blue-400">this</span>.queue.<span className="text-blue-300">set</span>(Date.<span className="text-blue-300">now</span>(), {'{ message, channel }'})\n
                    {'    '}<span className="text-purple-400">return</span> <span className="text-emerald-400">true</span>\n
                    {'  }'}\n
                    {'}'}
                  </code>
                </pre>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="rounded-xl border border-white/[0.06] bg-[#06080c] p-3.5 font-mono text-[11px] leading-relaxed text-[#c4c9d0] shadow-inner min-h-[160px]">
                <div className="text-white/40 text-[10px] mb-2 flex items-center justify-between border-b border-white/[0.06] pb-1">
                  <span>TERMINAL OUTPUT (STDIO)</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="space-y-1.5">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      {log.includes('✓') ? (
                        <span className="text-emerald-400">{log}</span>
                      ) : log.includes('RULE_') ? (
                        <span className="text-cyan-300">{log}</span>
                      ) : log.includes('$') ? (
                        <span className="text-yellow-300 font-bold">{log}</span>
                      ) : (
                        <span className="text-white/70">{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="rounded-xl border border-white/[0.06] bg-[#06080c] p-3.5 font-mono text-[11px] text-[#c4c9d0] space-y-2">
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                  <span>RULE_GIT_COMMIT</span>
                  <span className="text-emerald-400 font-bold">IN_PROGRESS → REVIEW (98%)</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                  <span>RULE_TEST_RUN_PASSED</span>
                  <span className="text-emerald-400 font-bold">REVIEW → DONE (100%)</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                  <span>RULE_BRANCH_CREATE</span>
                  <span className="text-cyan-400 font-bold">READY → IN_PROGRESS (95%)</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Observer Status Strip */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#a0a5ad]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Background Git Loop: 8s interval</span>
            </div>
            <span className="text-white/40">Zero AI Tokens Used</span>
          </div>
        </div>

        {/* Right Side: Live Reactive Kanban Board (6 cols) */}
        <div className="lg:col-span-6 bg-[#07090e] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-semibold text-white tracking-wider uppercase flex items-center gap-2">
                <Zap className="size-3.5 text-cyan-400" />
                <span>Live Kanban State Machine</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                0.2ms SQLite
              </span>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Col 1: To Do */}
              <div className="rounded-xl border border-white/[0.06] bg-[#0d1017] p-2.5 min-h-[220px] flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-white/50 mb-2">
                  <span>TO DO</span>
                  <span>{taskStatus === 'READY' ? 1 : 0}</span>
                </div>
                {taskStatus === 'READY' && (
                  <div className="p-2.5 rounded-lg border border-white/20 bg-[#161a22] shadow-md animate-fade-in">
                    <div className="flex justify-between text-[9px] font-mono text-white/50 mb-1">
                      <span>TASK-102</span>
                      <span className="text-orange-400 font-bold">HIGH</span>
                    </div>
                    <div className="text-[11px] font-medium text-white leading-snug">
                      Multi-Channel Toast System
                    </div>
                  </div>
                )}
                <div className="flex-1" />
              </div>

              {/* Col 2: In Progress / Review */}
              <div className="rounded-xl border border-cyan-500/20 bg-[#0d121c] p-2.5 min-h-[220px] flex flex-col justify-between shadow-[0_0_15px_-3px_rgba(6,182,212,0.1)]">
                <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-cyan-400 mb-2">
                  <span>{taskStatus === 'REVIEW' ? 'IN REVIEW' : 'IN PROGRESS'}</span>
                  <span>{taskStatus === 'IN_PROGRESS' || taskStatus === 'REVIEW' ? 1 : 0}</span>
                </div>
                {(taskStatus === 'IN_PROGRESS' || taskStatus === 'REVIEW') && (
                  <div className="p-2.5 rounded-lg border border-cyan-500/40 bg-[#141f2d] shadow-lg animate-scale-up">
                    <div className="flex justify-between text-[9px] font-mono text-cyan-300 mb-1">
                      <span>TASK-102</span>
                      <span className="px-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        {taskStatus === 'REVIEW' ? 'IN REVIEW' : 'ASSIGNED'}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-white leading-snug">
                      Multi-Channel Toast System
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-white/[0.08] flex justify-between text-[8px] font-mono text-cyan-400">
                      <span>branch: feature/toast</span>
                      <span className="text-emerald-400 font-bold">98% conf</span>
                    </div>
                  </div>
                )}
                <div className="flex-1" />
              </div>

              {/* Col 3: Done */}
              <div className="rounded-xl border border-white/[0.06] bg-[#0d1017] p-2.5 min-h-[220px] flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-emerald-400 mb-2">
                  <span>DONE</span>
                  <span>{taskStatus === 'DONE' ? 1 : 0}</span>
                </div>
                {taskStatus === 'DONE' && (
                  <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-[#0f2119] shadow-lg animate-scale-up">
                    <div className="flex justify-between text-[9px] font-mono text-emerald-300 mb-1">
                      <span>TASK-102</span>
                      <span className="px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">DONE</span>
                    </div>
                    <div className="text-[11px] font-medium text-white leading-snug line-through text-white/70">
                      Multi-Channel Toast System
                    </div>
                    <div className="mt-2 pt-1 text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-2.5" />
                      <span>Verified by Vitest</span>
                    </div>
                  </div>
                )}
                <div className="flex-1" />
              </div>
            </div>
          </div>

          {/* Telemetry Footer Callout */}
          <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0b0e14] flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/60">Active State:</span>
            <span className="text-emerald-400 font-bold">{taskStatus}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
