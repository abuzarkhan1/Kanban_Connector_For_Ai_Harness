import { useEffect, useMemo, useState } from 'react'
import type { TaskDto, TransitionDto } from '@ipc'
import { nextStatuses } from '@domain/state-machine/stateMachine'
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
  ArrowRightIcon
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
  const updateTask = useBoardStore((s) => s.updateTask)
  const deleteTask = useBoardStore((s) => s.deleteTask)
  const repositories = useBoardStore((s) => s.repositories)

  const task = useMemo<TaskDto | undefined>(() => {
    if (!board || !selectedTaskId) return undefined
    return board.columns.flatMap((c) => c.tasks).find((t) => t.id === selectedTaskId)
  }, [board, selectedTaskId])

  const [transitions, setTransitions] = useState<TransitionDto[]>([])
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
    void api.tasks
      .transitions({ taskId: task.id })
      .then((result) => {
        if (!cancelled) setTransitions(unwrap(result))
      })
      .catch(() => {
        if (!cancelled) setTransitions([])
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
          <h3 className="text-[13px] font-medium tracking-tight text-ink">Task detail</h3>
          <IconButton label="Collapse task detail" onClick={() => setCollapsed(true)}>
            <ChevronRightIcon size="xs" />
          </IconButton>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="grid size-9 place-items-center rounded-md border border-hairline bg-surface text-ash">
            <ArrowRightIcon size="xs" />
          </span>
          <p className="mt-3 text-[12px] text-ash">Select a task to inspect it</p>
        </div>
      </aside>
    )
  }

  if (collapsed) {
    return <CollapsedRail task={task} onExpand={() => setCollapsed(false)} />
  }

  const canSave = title.trim().length > 0 && !saving

  const handleSave = () => {
    if (!canSave) return
    setSaving(true)
    setSaved(false)
    void updateTask(task.id, {
      title: title.trim(),
      description,
      priority,
      labels: labels
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      branch: branch.trim() || null,
      repositoryId: repositoryId || null,
      automationMode
    }).finally(() => {
      setSaving(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1600)
    })
  }

  return (
    <aside className="flex w-80 min-h-0 shrink-0 flex-col border-l border-hairline bg-canvas">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
        <h3 className="text-[13px] font-medium tracking-tight text-ink">Task detail</h3>
        <div className="flex items-center gap-1">
          <IconButton label="Collapse task detail" onClick={() => setCollapsed(true)}>
            <ChevronRightIcon size="xs" />
          </IconButton>
          <IconButton label="Close task detail" onClick={() => selectTask(null)}>
            <CloseIcon size="xs" />
          </IconButton>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <Field label="Title" htmlFor="task-title">
          <TextInput
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={500}
            aria-invalid={title.trim().length === 0}
          />
        </Field>

        <Field label="Description" htmlFor="task-description">
          <TextArea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority" htmlFor="task-priority">
            <Select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskDto['priority'])}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Labels" hint="comma separated" htmlFor="task-labels">
            <TextInput
              id="task-labels"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="bug, ui"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Git Branch" htmlFor="task-branch">
            <TextInput
              id="task-branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="feature/xyz"
            />
          </Field>

          <Field label="Automation" htmlFor="task-automation">
            <Select
              id="task-automation"
              value={automationMode}
              onChange={(e) => setAutomationMode(e.target.value as 'AUTO' | 'MANUAL' | 'CONFIRM')}
            >
              <option value="AUTO">Auto (Inferred)</option>
              <option value="MANUAL">Manual Only</option>
              <option value="CONFIRM">Confirm</option>
            </Select>
          </Field>
        </div>

        {repositories.length > 0 && (
          <Field label="Linked Repository" htmlFor="task-repo">
            <Select
              id="task-repo"
              value={repositoryId}
              onChange={(e) => setRepositoryId(e.target.value)}
            >
              <option value="">No repository linked</option>
              {repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.currentBranch})
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Button variant="primary" onClick={handleSave} disabled={!canSave} className="w-full">
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </Button>

        {/* Status */}
        <section className="space-y-2.5 border-t border-hairline pt-4">
          <div className="flex items-center justify-between">
            <span className="label">Status</span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-body">
              {task.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {nextStatuses(task.status).map((toStatus) => (
              <button
                key={toStatus}
                onClick={() => void moveTask(task.id, toStatus)}
                className={cx(
                  'rounded-md border border-hairline px-2.5 py-1.5 text-[11px] font-medium text-body',
                  'transition-colors duration-150 hover:border-stone hover:bg-surface-elevated hover:text-ink focus-ring'
                )}
              >
                Move to {toStatus}
              </button>
            ))}
            {nextStatuses(task.status).length === 0 && (
              <p className="text-[12px] text-ash">This task is in a terminal state.</p>
            )}
          </div>
        </section>

        {/* History */}
        <section className="space-y-2.5 border-t border-hairline pt-4">
          <button
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
                        <p className="font-mono text-[10px] text-sky-400">rule: {t.ruleId}</p>
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
              className="w-full border-white/40 text-ink"
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
