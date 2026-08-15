import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { WorktreeInfo } from '@domain/entities/Repository'

const execFileAsync = promisify(execFile)

export interface GitInspectionResult {
  isGitRepo: boolean
  currentBranch: string
  defaultBranch: string
  headCommit: string | null
  worktrees: WorktreeInfo[]
  modifiedFilesCount: number
  recentCommits: Array<{ hash: string; message: string }>
}

export class GitService {
  async runGit(repoPath: string, args: string[]): Promise<string> {
    try {
      const { stdout } = await execFileAsync('git', args, {
        cwd: repoPath,
        timeout: 8000,
        env: { ...process.env, LANG: 'en_US.UTF-8' }
      })
      return stdout.trim()
    } catch {
      return ''
    }
  }

  async inspect(repoPath: string): Promise<GitInspectionResult> {
    const isInside = await this.runGit(repoPath, ['rev-parse', '--is-inside-work-tree'])
    if (isInside !== 'true') {
      return {
        isGitRepo: false,
        currentBranch: 'main',
        defaultBranch: 'main',
        headCommit: null,
        worktrees: [],
        modifiedFilesCount: 0,
        recentCommits: []
      }
    }

    // Current branch or detached HEAD
    let currentBranch = await this.runGit(repoPath, ['branch', '--show-current'])
    if (!currentBranch) {
      currentBranch = await this.runGit(repoPath, ['rev-parse', '--short', 'HEAD']) || 'HEAD'
    }

    // Default branch (guess from remote origin/HEAD or fallback)
    let defaultBranch = 'main'
    const originHead = await this.runGit(repoPath, ['symbolic-ref', 'refs/remotes/origin/HEAD'])
    if (originHead) {
      defaultBranch = originHead.replace('refs/remotes/origin/', '').trim()
    }

    // HEAD commit
    const headCommit = (await this.runGit(repoPath, ['rev-parse', 'HEAD'])) || null

    // Worktrees
    const worktrees = await this.listWorktrees(repoPath)

    // Modified / untracked files count
    const statusOutput = await this.runGit(repoPath, ['status', '--porcelain'])
    const modifiedFilesCount = statusOutput ? statusOutput.split('\n').filter(Boolean).length : 0

    // Recent commits
    const logOutput = await this.runGit(repoPath, ['log', '-n', '8', '--oneline'])
    const recentCommits: Array<{ hash: string; message: string }> = []
    if (logOutput) {
      for (const line of logOutput.split('\n')) {
        const spaceIdx = line.indexOf(' ')
        if (spaceIdx > 0) {
          recentCommits.push({
            hash: line.substring(0, spaceIdx),
            message: line.substring(spaceIdx + 1)
          })
        }
      }
    }

    return {
      isGitRepo: true,
      currentBranch,
      defaultBranch,
      headCommit,
      worktrees,
      modifiedFilesCount,
      recentCommits
    }
  }

  async listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
    const raw = await this.runGit(repoPath, ['worktree', 'list', '--porcelain'])
    if (!raw) {
      return [{ path: repoPath, branch: null, head: null, isBare: false }]
    }

    const worktrees: WorktreeInfo[] = []
    const blocks = raw.split('\n\n')
    for (const block of blocks) {
      if (!block.trim()) continue
      let wtPath = repoPath
      let head: string | null = null
      let branch: string | null = null
      let isBare = false

      for (const line of block.split('\n')) {
        if (line.startsWith('worktree ')) wtPath = line.substring(9).trim()
        else if (line.startsWith('HEAD ')) head = line.substring(5).trim()
        else if (line.startsWith('branch ')) branch = line.substring(7).replace('refs/heads/', '').trim()
        else if (line === 'bare') isBare = true
      }
      worktrees.push({ path: wtPath, branch, head, isBare })
    }
    return worktrees.length > 0 ? worktrees : [{ path: repoPath, branch: null, head: null, isBare: false }]
  }
}
