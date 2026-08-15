import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import {
  FolderIcon,
  RepositoryIcon,
  WorktreeIcon,
  RefreshIcon
} from '../icons'

export const RepositoryManager: React.FC = () => {
  const {
    repositories,
    selectedProjectId,
    projects,
    addRepository,
    deleteRepository,
    scanRepository,
    pickDirectory
  } = useBoardStore()

  const [pathInput, setPathInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isScanning, setIsScanning] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const activeProject = projects.find((p) => p.id === selectedProjectId)

  const handlePickFolder = async (): Promise<void> => {
    const picked = await pickDirectory()
    if (picked) {
      setPathInput(picked)
      if (!nameInput) {
        setNameInput(picked.split(/[\\/]/).filter(Boolean).pop() || '')
      }
    }
  }

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!pathInput.trim()) return
    await addRepository(pathInput.trim(), nameInput.trim() || undefined)
    setPathInput('')
    setNameInput('')
  }

  const handleScan = async (id: string): Promise<void> => {
    setIsScanning(id)
    try {
      await scanRepository(id)
    } finally {
      setIsScanning(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-snow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-snow">Repositories & Worktrees</h1>
          <p className="text-xs text-ash">
            Manage local Git repositories observed for branch changes, commits, diffs, and worktrees
          </p>
        </div>
      </div>

      {/* Add Repository Card */}
      <div className="mb-6 rounded-lg border border-line bg-surface p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-snow">Register Local Git Repository</h2>
        <p className="mt-1 text-xs text-ash">
          Associate a workspace with {activeProject ? `project "${activeProject.name}"` : 'the active project'}
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="/path/to/local/git/repository"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              className="flex-1 rounded-md border border-line bg-surface-elevated px-3 py-1.5 font-mono text-xs text-snow focus:border-white/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={handlePickFolder}
              className="flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
            >
              <FolderIcon size="xs" />
              <span>Browse…</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Display Name (optional)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full sm:w-48 rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs text-snow focus:border-white/40 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!pathInput.trim() || !selectedProjectId}
            className="rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-canvas hover:bg-snow disabled:opacity-40"
          >
            Register Repository
          </button>
        </form>
      </div>

      {/* Repositories List */}
      <div className="space-y-4">
        {repositories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-12 text-center text-xs text-ash">
            No repositories registered yet. Use the form above to link a local Git repository.
          </div>
        ) : (
          repositories.map((repo) => (
            <div key={repo.id} className="rounded-lg border border-line bg-surface p-5 transition-all hover:border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded bg-surface-elevated border border-hairline text-sky-400">
                      <RepositoryIcon size="sm" />
                    </div>
                    <h3 className="text-sm font-semibold text-snow">{repo.name}</h3>
                    <span className="rounded bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-sky-400">
                      branch: {repo.currentBranch}
                    </span>
                    <span className="rounded bg-surface-card px-2 py-0.5 font-mono text-[10px] text-ash">
                      default: {repo.defaultBranch}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-ash">{repo.path}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleScan(repo.id)}
                    disabled={isScanning === repo.id}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-surface-elevated px-2.5 py-1 text-xs font-medium text-snow hover:bg-surface-card disabled:opacity-40"
                  >
                    <RefreshIcon size="xs" animate={isScanning === repo.id ? 'spin' : 'hover-rotate'} />
                    <span>{isScanning === repo.id ? 'Scanning…' : 'Scan Git'}</span>
                  </button>

                  {confirmDelete === repo.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          void deleteRepository(repo.id)
                          setConfirmDelete(null)
                        }}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-ash hover:text-snow"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(repo.id)}
                      className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ash hover:bg-red-500/10 hover:text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Worktrees list */}
              {repo.worktrees && repo.worktrees.length > 0 && (
                <div className="mt-4 border-t border-line/60 pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ash">
                    <WorktreeIcon size="xs" />
                    <span>Detected Worktrees:</span>
                  </div>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {repo.worktrees.map((wt, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded bg-surface-elevated p-2 text-xs">
                        <span className="truncate font-mono text-[11px] text-snow">{wt.path}</span>
                        <span className="ml-2 font-mono text-[10px] text-ash">[{wt.branch || 'detached'}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
