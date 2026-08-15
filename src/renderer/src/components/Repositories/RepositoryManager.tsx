import React, { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'
import {
  FolderIcon,
  RepositoryIcon,
  WorktreeIcon,
  RefreshIcon
} from '../icons'
import { Button, TextInput } from '../ui'

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
    <div className="flex flex-1 flex-col overflow-auto bg-canvas p-6 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">Repositories &amp; Worktrees</h1>
          <p className="text-xs text-ash">
            Manage local Git repositories observed for branch changes, commits, diffs, and worktrees
          </p>
        </div>
      </div>

      {/* Add Repository Card */}
      <div className="mb-6 rounded-lg border border-hairline bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">Register Local Git Repository</h2>
        <p className="mt-1 text-xs text-ash">
          Associate a workspace with {activeProject ? `project "${activeProject.name}"` : 'the active project'}
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 gap-2">
            <TextInput
              placeholder="/path/to/local/git/repository"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              className="flex-1 font-mono text-xs"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handlePickFolder}
              className="shrink-0"
            >
              <FolderIcon size="xs" />
              <span>Browse…</span>
            </Button>
          </div>

          <TextInput
            placeholder="Display Name (optional)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full sm:w-48 text-xs"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!pathInput.trim() || !selectedProjectId}
          >
            Register Repository
          </Button>
        </form>
      </div>

      {/* Repositories List */}
      <div className="space-y-4">
        {repositories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline p-12 text-center text-xs text-ash">
            No repositories registered yet. Use the form above to link a local Git repository.
          </div>
        ) : (
          repositories.map((repo) => (
            <div key={repo.id} className="rounded-lg border border-hairline bg-surface p-5 transition-colors hover:border-hairline-strong">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="grid size-7 place-items-center rounded-md border border-hairline bg-surface-elevated text-mute">
                      <RepositoryIcon size="sm" />
                    </div>
                    <h3 className="text-sm font-semibold text-ink">{repo.name}</h3>
                    <span className="rounded-[5px] border border-hairline bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-mute">
                      branch: {repo.currentBranch}
                    </span>
                    <span className="rounded-[5px] border border-hairline bg-surface-card px-2 py-0.5 font-mono text-[10px] text-ash">
                      default: {repo.defaultBranch}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-ash">{repo.path}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleScan(repo.id)}
                    disabled={isScanning === repo.id}
                  >
                    <RefreshIcon size="xs" animate={isScanning === repo.id ? 'spin' : 'hover-rotate'} />
                    <span>{isScanning === repo.id ? 'Scanning…' : 'Scan Git'}</span>
                  </Button>

                  {confirmDelete === repo.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          void deleteRepository(repo.id)
                          setConfirmDelete(null)
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(repo.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              {/* Worktrees list */}
              {repo.worktrees && repo.worktrees.length > 0 && (
                <div className="mt-4 border-t border-hairline pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ash">
                    <WorktreeIcon size="xs" />
                    <span>Detected Worktrees:</span>
                  </div>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {repo.worktrees.map((wt, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md border border-hairline bg-surface-elevated p-2 text-xs">
                        <span className="truncate font-mono text-[11px] text-ink">{wt.path}</span>
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
