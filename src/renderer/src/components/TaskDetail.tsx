import { useEffect, useMemo, useState } from 'react'
import type { TaskDto, TransitionDto, EvidenceDto } from '@ipc'
import { nextStatuses } from '@domain/state-machine/stateMachine'
import { columnFor } from '@domain/state-machine/status'
import { PRIORITIES } from '@domain/value-objects/priority'
import { api, unwrap } from '../api/client'
import { useBoardStore } from '../stores/useBoardStore'
import { formatDateTime } from '../lib/format'
import { useLocalStorage } from '../lib/useLocalStorage'
import { Button, cx, Field, IconButton, Select, TextArea, TextInput } from './ui'
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CloseIcon,
  ArrowRightIcon,
  RefreshIcon,
  StatusTodoIcon,
  StatusInProgressIcon,
  StatusReviewIcon,
  StatusDoneIcon
} from './icons'

function CollapsedRail({ task, onExpand, className }: { task?: TaskDto; onExpand: () => void; className?: string }) {
  return (
    <aside className={cx('flex w-12 shrink-0 flex-col items-center border-l border-hairline bg-canvas py-3', className)}>
      <IconButton label="Expand task detail" onClick={onExpand}>
        <ChevronDoubleRightIcon size="xs" />
      </IconButton>
      {task && (
        <span
          className="mt-3 max-h-44 overflow-hidden text-[10px] leading-tight text-ash [writing-mode:vertical-rl]"
          title={task.title}
        >
          {task.title}
        </span>
      )}
    </aside>
  )
}

export function TaskDetail() {
  const board = useBoardStore((s) => s.board)
  const selectedTaskId = useBoardStore((s) => s.selectedTaskId)
  const selectTask = useBoardStore((s) => s.selectTask)
  const moveTask = useBoardStore((s) => s.moveTask)
  const moveTaskToColumn = useBoardStore((s) => s.moveTaskToColumn)
  const updateTask = useBoardStore((s) => s.updateTask)
  const deleteTask = useBoardStore((s) => s.deleteTask)
  const repositories = useBoardStore((s) => s.repositories)

  const task = useMemo<TaskDto | undefined>(() => {
    if (!board || !selectedTaskId) return undefined
    return board.columns.flatMap((c) => c.tasks).find((t) => t.id === selectedTaskId)
  }, [board, selectedTaskId])

  const [transitions, setTransitions] = useState<TransitionDto[]>([])
  const [evidenceList, setEvidenceList] = useState<EvidenceDto[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskDto['priority']>('MEDIUM')
  const [labels, setLabels] = useState('')
  const [branch, setBranch] = useState('')
  const [repositoryId, setRepositoryId] = useState<string>('')
  const [automationMode, setAutomationMode] = useState<'AUTO' | 'MANUAL' | 'CONFIRM'>('AUTO')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(true)
  const [collapsed, setCollapsed] = useLocalStorage('ahpm:detail:collapsed', false)

  useEffect(() => {
    if (!task) return
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setLabels(task.labels.join(', '))
    setBranch(task.branch || '')
    setRepositoryId(task.repositoryId || '')
    setAutomationMode(task.automationMode || 'AUTO')
    setSaving(false)
    setSaved(false)
    setConfirmDelete(false)
  }, [task?.id])

  useEffect(() => {
    if (!task) return
    let cancelled = false
    void Promise.all([
      api.tasks.transitions({ taskId: task.id }),
      api.tasks.evidence({ taskId: task.id })
    ])
      .then(([transRes, evidRes]) => {
        if (!cancelled) {
          setTransitions(unwrap(transRes))
          setEvidenceList(unwrap(evidRes))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTransitions([])
          setEvidenceList([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [task?.id, task?.status])

  if (!task) {
    if (collapsed) {
      return <CollapsedRail className="hidden lg:flex" onExpand={() => setCollapsed(false)} />
    }
    return (
      <aside className="hidden w-80 shrink-0 flex-col border-l border-hairline bg-canvas lg:flex">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
          <span className="label">Task Details</span>
          <IconButton label="Collapse panel" onClick={() => setCollapsed(true)}>
            <ChevronRightIcon size="xs" />
          </IconButton>
        </header>
        <div className="flex flex-1 items-center justify-center p-6 text-center text-[12px] text-ash">
          Select a task on the board to view its properties and transition history.
        </div>
      </aside>
    )
  }

  if (collapsed) {
    return <CollapsedRail task={task} className="hidden lg:flex" onExpand={() => setCollapsed(false)} />
  }

  const isDirty =
    title !== task.title ||
    description !== task.description ||
    priority !== task.priority ||
    labels !== task.labels.join(', ') ||
    branch !== (task.branch || '') ||
    repositoryId !== (task.repositoryId || '') ||
    automationMode !== (task.automationMode || 'AUTO')

  const canSave = isDirty && title.trim().length > 0 && !saving

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    const labelList = labels
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
    await updateTask(task.id, {
      title: title.trim(),
      description,
      priority,
      labels: labelList,
      branch: branch.trim() || null,
      repositoryId: repositoryId || null,
      automationMode
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <aside className="flex w-full flex-col border-l border-hairline bg-canvas sm:w-96 lg:w-96">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
        <div className="flex items-center gap-2">
          <span className="label">Task</span>
          <span className="font-mono text-[11px] text-ash truncate max-w-[140px]">{task.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Collapse panel" onClick={() => setCollapsed(true)} className="hidden lg:flex">
            <ChevronRightIcon size="xs" />
          </IconButton>
          <IconButton label="Close detail" onClick={() => selectTask(null)}>
            <CloseIcon size="xs" />
          </IconButton>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Title */}
        <Field label="Title">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task summary"
            className="w-full"
          />
        </Field>

        {/* Priority & Automation Mode */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority">
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskDto['priority'])}
              className="w-full"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Automation">
            <Select
              value={automationMode}
              onChange={(e) => setAutomationMode(e.target.value as 'AUTO' | 'MANUAL' | 'CONFIRM')}
              className="w-full"
            >
              <option value="AUTO">AUTO (Inference)</option>
              <option value="MANUAL">MANUAL (User)</option>
              <option value="CONFIRM">CONFIRM</option>
            </Select>
          </Field>
        </div>

        {/* Repository */}
        <Field label="Linked Repository">
          <Select
            value={repositoryId}
            onChange={(e) => setRepositoryId(e.target.value)}
            className="w-full font-mono text-[11px]"
          >
            <option value="">No repository linked</option>
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.currentBranch})
              </option>
            ))}
          </Select>
        </Field>

        {/* Git Branch */}
        <Field label="Git Branch">
          <TextInput
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="feature/branch-name"
            className="w-full font-mono text-[11px]"
          />
        </Field>

        {/* Labels */}
        <Field label="Labels (comma-separated)">
          <TextInput
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="frontend, auth, mcp"
            className="w-full text-[11px]"
          />
        </Field>

        {/* Description */}
        <Field label="Description & Acceptance Criteria">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be implemented and acceptance criteria..."
            rows={5}
            className="w-full text-[12px] leading-relaxed"
          />
        </Field>

        <Button variant="primary" onClick={handleSave} disabled={!canSave} className="w-full">
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </Button>

        {/* Status & Stage Section */}
        <section className="space-y-3 border-t border-hairline pt-4">
          <div className="flex items-center justify-between">
            <span className="label">Kanban Stage & Status</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink bg-surface-elevated px-2 py-0.5 rounded border border-hairline">
              {task.status}
            </span>
          </div>

          {/* 4 Primary Kanban Columns Quick-Move Grid */}
          <div>
            <span className="text-[11px] font-medium text-mute block mb-1.5">Move to Column</span>
            <div className="grid grid-cols-4 gap-1 rounded-md border border-hairline bg-surface p-1">
              {(
                [
                  { id: 'TODO', label: 'To Do', Icon: StatusTodoIcon },
                  { id: 'IN_PROGRESS', label: 'In Progress', Icon: StatusInProgressIcon },
                  { id: 'REVIEW', label: 'Review', Icon: StatusReviewIcon },
                  { id: 'DONE', label: 'Done', Icon: StatusDoneIcon }
                ] as const
              ).map(({ id: colId, label, Icon }) => {
                const isActive = columnFor(task.status) === colId
                return (
                  <button
                    key={colId}
                    type="button"
                    onClick={() => void moveTaskToColumn(task.id, colId)}
                    className={cx(
                      'flex flex-col items-center justify-center gap-1 rounded py-1.5 px-1 text-[11px] font-medium transition-colors focus-ring',
                      isActive
                        ? 'bg-surface-elevated text-ink border border-line shadow-xs font-semibold'
                        : 'text-mute hover:text-body hover:bg-surface-card border border-transparent'
                    )}
                  >
                    <Icon size="xs" className={isActive ? 'text-ink' : 'text-ash'} />
                    <span className="text-[10px] leading-none">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Granular Lifecycle Transitions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-medium text-mute block">Lifecycle Actions</span>
            <div className="flex flex-wrap gap-1.5">
              {nextStatuses(task.status).map((toStatus) => (
                <button
                  key={toStatus}
                  type="button"
                  onClick={() => void moveTask(task.id, toStatus)}
                  className={cx(
                    'rounded-md border border-hairline px-2.5 py-1 text-[11px] font-medium text-body',
                    'transition-colors duration-150 hover:border-stone hover:bg-surface-elevated hover:text-ink focus-ring'
                  )}
                >
                  <span className="text-ash">→</span> {toStatus}
                </button>
              ))}
              {task.status === 'DONE' && (
                <button
                  type="button"
                  onClick={() => void moveTask(task.id, 'BACKLOG')}
                  className="btn btn-secondary btn-sm text-[11px]"
                >
                  <RefreshIcon size="xs" />
                  <span>Reopen Task (Backlog)</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Evidence & Inferences */}
        {evidenceList.length > 0 && (
          <section className="space-y-2.5 border-t border-hairline pt-4">
            <span className="label">Inference Evidence ({evidenceList.length})</span>
            <div className="space-y-2">
              {evidenceList.map((ev) => (
                <div key={ev.id} className="rounded-md border border-hairline bg-surface-elevated p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink font-semibold">{ev.ruleId}</span>
                    <span className="font-mono text-[10px] text-ash">{Math.round(ev.confidence * 100)}% conf</span>
                  </div>
                  <p className="mt-1 text-[11px] text-body">{ev.summary}</p>
                  {ev.items.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-hairline pt-1.5">
                      {ev.items.map((item, idx) => (
                        <div key={idx} className="font-mono text-[10px] text-ash">
                          • [{item.type}] {item.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* History */}
        <section className="space-y-2.5 border-t border-hairline pt-4">
          <button
            type="button"
            onClick={() => setHistoryOpen((open) => !open)}
            aria-expanded={historyOpen}
            className="focus-ring flex w-full items-center justify-between"
          >
            <span className="label">History</span>
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] tabular-nums text-ash">
                {transitions.length} {transitions.length === 1 ? 'entry' : 'entries'}
              </span>
              <ChevronDownIcon
                size="xs"
                className={cx('text-mute transition-transform duration-150', !historyOpen && '-rotate-90')}
              />
            </span>
          </button>
          {historyOpen && (
            <>
              {transitions.length === 0 ? (
                <p className="text-[12px] text-ash">No transitions recorded yet.</p>
              ) : (
                <ol className="space-y-2.5">
                  {transitions.map((t) => (
                    <li key={t.id} className="relative pl-4">
                      <span className="absolute left-0 top-1.5 size-1 rounded-full bg-stone" aria-hidden />
                      <p className="text-[12px] leading-snug text-body">
                        <span className="text-ink">{t.fromStatus}</span>
                        <ArrowRightIcon size="xs" className="mx-1 inline-block text-ash" />
                        <span className="text-ink">{t.toStatus}</span>
                        <span className="ml-1.5 text-ash">by {t.actor}</span>
                        {t.confidence !== null && (
                          <span className="ml-1.5 font-mono text-[10px] tabular-nums text-mute">
                            {Math.round(t.confidence * 100)}% confidence
                          </span>
                        )}
                      </p>
                      {t.ruleId && (
                        <p className="font-mono text-[10px] text-mute">rule: {t.ruleId}</p>
                      )}
                      <p className="mt-0.5 font-mono text-[10px] text-stone">{formatDateTime(t.createdAt)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </section>

        <div className="border-t border-hairline pt-4">
          {confirmDelete ? (
            <Button
              variant="danger"
              onClick={() => void deleteTask(task.id)}
              className="w-full"
            >
              Delete task?
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
              Delete task
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
