# Git and Repository Intelligence

## Repository discovery

Detect repositories through:
- explicit user selection
- configured project paths
- workspace registration

Do not recursively scan the entire home directory by default.

## Repository metadata

Track:
- root path
- branch
- HEAD
- remotes
- worktrees
- changed files
- recent commits

## Worktree support

Worktrees are important for multi-agent development.

Model each worktree separately:

```text
Repository
 ├── Worktree A → Agent/session/task
 ├── Worktree B → Agent/session/task
 └── Worktree C → Agent/session/task
```

This avoids confusing concurrent agents.

## Task correlation

Strong correlation:
- explicit task workspace
- matching branch
- matching worktree
- session launched from task workspace

Secondary correlation:
- changed files overlap with task-linked files
- commit message references task identifier

## Git mutation

The initial MVP should be observation-first.

Do not automatically:
- commit
- push
- reset
- checkout
- merge

unless a future feature explicitly enables and secures those operations.
