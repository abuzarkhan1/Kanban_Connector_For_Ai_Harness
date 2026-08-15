import React, { useState } from 'react'
import { Plus } from 'lucide-react'

interface SimulatedTask {
  id: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  branch: string
  labels: string[]
  updatedAgo: string
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

export const InteractiveBoardDemo: React.FC = () => {
  const [tasks, setTasks] = useState<SimulatedTask[]>(INITIAL_TASKS)
  const [newTitle, setNewTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<SimulatedTask | null>(tasks[1] || null)

  const columns = [
    { id: 'TODO', label: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length },
    { id: 'IN_PROGRESS', label: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
    { id: 'REVIEW', label: 'In Review', count: tasks.filter((t) => t.status === 'REVIEW').length },
    { id: 'DONE', label: 'Done', count: tasks.filter((t) => t.status === 'DONE').length }
  ] as const

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
  }

  const getPriorityBadge = (p: SimulatedTask['priority']) => {
    switch (p) {
      case 'URGENT':
        return 'bg-muted text-foreground border-border font-bold'
      case 'HIGH':
        return 'bg-muted text-foreground border-border'
      case 'MEDIUM':
        return 'bg-muted/60 text-muted-foreground border-border'
      case 'LOW':
        return 'bg-muted/40 text-muted-foreground border-border'
    }
  }

  return (
    <section id="interactive-demo" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Experience Deterministic State Derivation
          </h2>
        </div>

        {/* Live Simulator Outer Shell */}
        <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Clean macOS Top Bar */}
          <div className="h-10 px-4 border-b border-border bg-muted/30 flex items-center">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f56]/80" />
              <span className="size-3 rounded-full bg-[#ffbd2e]/80" />
              <span className="size-3 rounded-full bg-[#27c93f]/80" />
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-background/50">
            {columns.map((col) => (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-3 min-h-[380px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                  <span className="font-mono text-[12px] font-medium tracking-wider uppercase text-foreground">
                    {col.label}
                  </span>
                  <span className="size-5 rounded bg-muted text-muted-foreground font-mono text-[10px] grid place-items-center font-medium">
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
                        className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-border bg-muted/40 text-[12px] text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-border"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-foreground/40 bg-muted/60 shadow-md'
                              : 'border-border bg-card hover:border-border/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-[10px] text-muted-foreground font-semibold">{task.id}</span>
                            <span
                              className={`text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded border ${getPriorityBadge(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="text-[13px] font-medium text-foreground leading-snug mb-2.5">{task.title}</h4>

                          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                            <span className="truncate max-w-[120px] opacity-70">git: {task.branch}</span>
                            <span>{task.updatedAgo}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
