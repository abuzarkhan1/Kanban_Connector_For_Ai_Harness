import React, { useState } from 'react'
import {
  GitCommit,
  CheckCircle,
  RotateCcw,
  Plus,
  Terminal,
  Activity
} from 'lucide-react'

interface SimulatedTask {
  id: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  branch: string
  labels: string[]
  updatedAgo: string
}

interface SimulatedEvent {
  id: string
  timestamp: string
  actor: string
  ruleId: string
  confidence: number
  summary: string
}

const INITIAL_TASKS: SimulatedTask[] = [
  {
    id: 'TASK-101',
    title: 'Implement Toast Notification System with Severity Channels',
    priority: 'HIGH',
    status: 'DONE',
    branch: 'feature/toast-system',
    labels: ['ui', 'toast', 'ux'],
    updatedAgo: '2m ago'
  },
  {
    id: 'TASK-102',
    title: 'Richer Task Cards & Advanced Filtering Engine',
    priority: 'HIGH',
    status: 'REVIEW',
    branch: 'feature/rich-cards-filters',
    labels: ['kanban', 'filters'],
    updatedAgo: 'Just now'
  },
  {
    id: 'TASK-103',
    title: 'Background Periodic Git Observation Loop',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    branch: 'feature/git-polling',
    labels: ['engine', 'git'],
    updatedAgo: '4m ago'
  },
  {
    id: 'TASK-104',
    title: 'Transactional Database Backup & JSON Snapshot Facility',
    priority: 'MEDIUM',
    status: 'TODO',
    branch: 'feature/backup-restore',
    labels: ['database', 'diagnostics'],
    updatedAgo: '12m ago'
  }
]

const INITIAL_EVENTS: SimulatedEvent[] = [
  {
    id: 'ev-1',
    timestamp: '14:35:12',
    actor: 'INFERENCE_ENGINE',
    ruleId: 'RULE_GIT_COMMIT',
    confidence: 0.98,
    summary: 'Observed commit 8f9b2a on branch feature/rich-cards-filters. Transitioned TASK-102 to REVIEW.'
  },
  {
    id: 'ev-2',
    timestamp: '14:32:45',
    actor: 'MCP_CLIENT (Antigravity)',
    ruleId: 'MCP_AGENT_START',
    confidence: 1.0,
    summary: 'Agent claimed task TASK-103. Transitioned from READY to IN_PROGRESS.'
  }
]

export const InteractiveBoardDemo: React.FC = () => {
  const [tasks, setTasks] = useState<SimulatedTask[]>(INITIAL_TASKS)
  const [events, setEvents] = useState<SimulatedEvent[]>(INITIAL_EVENTS)
  const [newTitle, setNewTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<SimulatedTask | null>(tasks[1] || null)

  const columns = [
    { id: 'TODO', label: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length },
    { id: 'IN_PROGRESS', label: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
    { id: 'REVIEW', label: 'In Review', count: tasks.filter((t) => t.status === 'REVIEW').length },
    { id: 'DONE', label: 'Done', count: tasks.filter((t) => t.status === 'DONE').length }
  ] as const

  const moveTask = (taskId: string, newStatus: SimulatedTask['status'], reason: string, ruleId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAgo: 'Just now' } : t))
    )

    const newEv: SimulatedEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'INFERENCE_ENGINE',
      ruleId,
      confidence: 0.96,
      summary: `Automated transition for ${taskId} -> ${newStatus}. (${reason})`
    }

    setEvents((prev) => [newEv, ...prev.slice(0, 5)])
  }

  const simulateAgentCommit = () => {
    const inProg = tasks.find((t) => t.status === 'IN_PROGRESS')
    if (inProg) {
      moveTask(inProg.id, 'REVIEW', 'Git commit detected with passing linter', 'RULE_GIT_COMMIT')
    } else {
      const todo = tasks.find((t) => t.status === 'TODO')
      if (todo) {
        moveTask(todo.id, 'IN_PROGRESS', 'Agent branch creation detected', 'RULE_BRANCH_CREATE')
      }
    }
  }

  const simulateTestPass = () => {
    const review = tasks.find((t) => t.status === 'REVIEW')
    if (review) {
      moveTask(review.id, 'DONE', 'Vitest 58/58 passed & Smoke Test confirmed', 'RULE_TEST_RUN_PASSED')
    }
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newTask: SimulatedTask = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      priority: 'HIGH',
      status: 'TODO',
      branch: `feature/${newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      labels: ['frontend', 'mcp'],
      updatedAgo: 'Just now'
    }
    setTasks((prev) => [newTask, ...prev])
    setNewTitle('')

    const newEv: SimulatedEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'USER / MCP',
      ruleId: 'TASK_CREATE',
      confidence: 1.0,
      summary: `Created ${newTask.id}: "${newTask.title}" in BACKLOG.`
    }
    setEvents((prev) => [newEv, ...prev])
  }

  const resetDemo = () => {
    setTasks(INITIAL_TASKS)
    setEvents(INITIAL_EVENTS)
    setSelectedTask(INITIAL_TASKS[1] || null)
  }

  const getPriorityBadge = (p: SimulatedTask['priority']) => {
    switch (p) {
      case 'URGENT':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'MEDIUM':
        return 'bg-white/10 text-white/80 border-white/10'
      case 'LOW':
        return 'bg-white/5 text-white/50 border-white/5'
    }
  }

  return (
    <section id="interactive-demo" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <Activity className="size-3.5 text-emerald-400" />
            <span>Interactive Live Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Experience the Autonomous Inference Engine
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Test how Git observations and MCP commands automatically transition task states across Kanban columns
            with zero user friction. Click simulation buttons or interact with cards below:
          </p>
        </div>

        {/* Live Simulator Outer Shell */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12] shadow-2xl overflow-hidden">
          {/* Top Control Bar */}
          <div className="p-4 border-b border-white/[0.08] bg-[#14171c]/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/40 border border-red-500/80" />
              <span className="size-3 rounded-full bg-yellow-500/40 border border-yellow-500/80" />
              <span className="size-3 rounded-full bg-green-500/40 border border-green-500/80" />
              <span className="ml-2 font-mono text-[12px] text-[#a0a5ad] font-medium hidden sm:inline">
                ai-harness-pm :: project/Ai Harness (Local SQLite)
              </span>
            </div>

            {/* Quick Action Simulator Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={simulateAgentCommit}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#1f242c] hover:bg-[#282f3a] text-white text-[12px] font-mono flex items-center gap-2 transition-colors cursor-pointer"
              >
                <GitCommit className="size-3.5 text-cyan-400" />
                <span>Simulate Git Commit</span>
              </button>

              <button
                onClick={simulateTestPass}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#1f242c] hover:bg-[#282f3a] text-white text-[12px] font-mono flex items-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle className="size-3.5 text-emerald-400" />
                <span>Simulate Tests Pass</span>
              </button>

              <button
                onClick={resetDemo}
                className="p-1.5 rounded-lg border border-white/10 bg-[#1f242c] hover:bg-[#282f3a] text-[#a0a5ad] hover:text-white transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#07080a]">
            {columns.map((col) => (
              <div
                key={col.id}
                className="flex flex-col rounded-xl border border-white/[0.06] bg-[#0d0f12] p-3 min-h-[380px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <span className="font-mono text-[12px] font-semibold tracking-wider uppercase text-white">
                    {col.label}
                  </span>
                  <span className="size-5 rounded bg-white/[0.06] text-[#a0a5ad] font-mono text-[10px] grid place-items-center font-medium">
                    {col.count}
                  </span>
                </div>

                {col.id === 'TODO' && (
                  <form onSubmit={handleCreateTask} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="+ Add quick task…"
                        className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-white/10 bg-[#14171c] text-[12px] text-white placeholder-white/30 focus:outline-hidden focus:border-white/30"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task) => {
                      const isSelected = selectedTask?.id === task.id
                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer glow-card ${
                            isSelected
                              ? 'border-white/30 bg-[#1a1e24] shadow-lg'
                              : 'border-white/[0.06] bg-[#14171c] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-[10px] text-[#a0a5ad] font-semibold">{task.id}</span>
                            <span
                              className={`text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded border ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="text-[13px] font-medium text-white leading-snug mb-2.5">{task.title}</h4>

                          <div className="flex items-center justify-between text-[10px] font-mono text-[#a0a5ad]">
                            <span className="truncate max-w-[120px] text-white/60">git: {task.branch}</span>
                            <span>{task.updatedAgo}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Telemetry Stream & State Transition Live Feed */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0d0f12] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[12px] font-mono text-[#c4c9d0]">
              <Terminal className="size-4 text-emerald-400" />
              <span>Real-Time Inference Telemetry Stream</span>
            </div>

            <div className="flex-1 max-w-2xl w-full bg-[#14171c] rounded-lg border border-white/[0.06] p-2.5 font-mono text-[11px] text-[#a0a5ad] space-y-1">
              {events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="flex items-start gap-2">
                  <span className="text-white/40">[{ev.timestamp}]</span>
                  <span className="text-emerald-400 font-semibold">{ev.ruleId}</span>
                  <span className="text-white/80 truncate flex-1">{ev.summary}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
