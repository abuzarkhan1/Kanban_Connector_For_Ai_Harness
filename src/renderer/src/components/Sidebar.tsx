import { useEffect, useState } from 'react'
import { useBoardStore } from '../stores/useBoardStore'
import { useLocalStorage } from '../lib/useLocalStorage'
import { BrandMark, Button, cx, IconButton, TextInput } from './ui'
import { ChevronLeftIcon, EditIcon, CloseIcon, LiveObserverBlip } from './icons'

export function Sidebar() {
  const projects = useBoardStore((s) => s.projects)
  const selectedProjectId = useBoardStore((s) => s.selectedProjectId)
  const createProject = useBoardStore((s) => s.createProject)
  const updateProject = useBoardStore((s) => s.updateProject)
  const deleteProject = useBoardStore((s) => s.deleteProject)
  const selectProject = useBoardStore((s) => s.selectProject)
  const [collapsed, setCollapsed] = useLocalStorage('ahpm:sidebar:collapsed', false)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  // Auto-disarm the delete confirmation after a pause.
  useEffect(() => {
    if (!confirmId) return
    const timer = window.setTimeout(() => setConfirmId(null), 2500)
    return () => window.clearTimeout(timer)
  }, [confirmId])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    void createProject(trimmed)
    setName('')
  }

  const startRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleRenameSubmit = (id: string, original: string) => (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = editName.trim()
    setEditingId(null)
    if (trimmed && trimmed !== original) void updateProject(id, trimmed)
  }

  return (
    <aside
      className={cx(
        'flex shrink-0 flex-col border-r border-hairline bg-canvas transition-[width] duration-150',
        collapsed ? 'w-14' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className={cx('flex items-center', collapsed ? 'justify-center py-3.5' : 'justify-between gap-2.5 px-4 pb-3.5 pt-4')}>
        {collapsed ? (
          <IconButton label="Expand sidebar" onClick={() => setCollapsed(false)} className="size-8">
            <BrandMark className="size-4" />
          </IconButton>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-on-primary">
                <BrandMark className="size-4" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[13px] font-semibold tracking-tight text-ink">AI Harness PM</h1>
                <p className="text-[10px] leading-tight text-ash">Development control plane</p>
              </div>
            </div>
            <IconButton label="Collapse sidebar" onClick={() => setCollapsed(true)}>
              <ChevronLeftIcon size="xs" />
            </IconButton>
          </>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Create project */}
          <form onSubmit={handleCreate} className="flex gap-1.5 border-y border-hairline px-3 py-3">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New project…"
              aria-label="New project name"
              className="min-w-0 flex-1"
            />
            <Button type="submit" variant="primary" disabled={!name.trim()} className="shrink-0">
              Add
            </Button>
          </form>

          {/* Projects */}
          <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2" aria-label="Projects">
            <div className="flex items-center justify-between px-4 pb-1.5 pt-0.5">
              <p className="label">Projects</p>
              <span className="font-mono text-[10px] tabular-nums text-ash">{projects.length}</span>
            </div>
            {projects.length === 0 ? (
              <p className="px-4 py-2 text-[12px] leading-relaxed text-ash">
                No projects yet. Create one above to get started.
              </p>
            ) : (
              projects.map((project) => {
                const selected = project.id === selectedProjectId
                if (editingId === project.id) {
                  return (
                    <form
                      key={project.id}
                      onSubmit={handleRenameSubmit(project.id, project.name)}
                      className="mx-2 rounded-md border border-hairline bg-surface-elevated focus-within:border-white/60"
                    >
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            e.stopPropagation()
                            setEditingId(null)
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        autoFocus
                        maxLength={200}
                        aria-label={`Rename project ${project.name}`}
                        className="w-full bg-transparent px-2.5 py-[7px] text-[13px] text-ink outline-none"
                      />
                    </form>
                  )
                }
                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => void selectProject(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        void selectProject(project.id)
                      }
                    }}
                    aria-current={selected || undefined}
                    className={cx(
                      'group mx-2 flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-[7px] text-[13px] outline-none',
                      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink',
                      selected
                        ? 'bg-surface-elevated text-ink shadow-[inset_2px_0_0_0_#ffffff]'
                        : 'text-body hover:bg-surface-elevated hover:text-ink'
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate" title={project.name}>
                      {project.name}
                    </span>
                    <IconButton
                      label={`Rename project ${project.name}`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        startRename(project.id, project.name)
                      }}
                      className="opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <EditIcon size="xs" />
                    </IconButton>
                    {confirmId === project.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          void deleteProject(project.id)
                        }}
                        className="shrink-0 rounded-md border border-white/40 px-1.5 py-0.5 text-[10px] font-medium text-ink focus-ring"
                      >
                        Delete?
                      </button>
                    ) : (
                      <IconButton
                        label={`Delete project ${project.name}`}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setConfirmId(project.id)
                        }}
                        className="opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <CloseIcon size="xs" />
                      </IconButton>
                    )}
                  </div>
                )
              })
            )}
          </nav>

          {/* Status footer */}
          <div className="flex items-center gap-2 border-t border-hairline px-4 py-2.5">
            <LiveObserverBlip status="active" label="observation engine: active" />
          </div>
        </>
      )}
    </aside>
  )
}
