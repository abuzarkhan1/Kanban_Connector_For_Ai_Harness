# Domain Model

## Core entities

### Project
Top-level container for repositories and tasks.

### Repository
A registered local Git repository.

Fields:
- id
- projectId
- path
- name
- remote metadata
- default branch
- detected worktrees

### Workspace
A working directory associated with a repository. Can represent a normal checkout or worktree.

### Task
The primary project-management object.

Fields:
- id
- projectId
- title
- description
- status
- priority
- labels
- repositoryId
- workspaceId
- branch
- automationMode
- timestamps

### Agent
Represents a detected or integrated AI coding harness.

Fields:
- id
- type
- displayName
- capabilities
- process identifiers
- adapter status

### Session
A period of development activity.

Fields:
- id
- agentId
- repositoryId
- workspaceId
- taskId
- start/end time
- lifecycle state
- evidence summary

### Terminal
An owned or observed terminal/PTY session, linkable to a workspace, session and task.

Fields:
- id
- workspaceId
- sessionId?
- processId?
- start/end time
- pty capability
- last activity

### Event
Normalized observation from any source.

### Evidence
A persisted explanation attached to an inferred state.

### Transition
A state change with:
- previous state
- new state
- confidence
- rule
- evidence references
- timestamp
- actor (`system` or `user`)

### Execution
A detected command/test/build process.

### Artifact
A meaningful output such as a commit, test result or build result.

### ChangeSet
The files changed within a session, used for correlation and review evidence.

Fields:
- id
- sessionId
- added/modified/deleted file lists
- diff summary
- first/last change timestamps

## Relationships

```text
Project
 ├── Repositories
 │    └── Workspaces
 │          ├── Terminals
 │          └── Sessions
 │                ├── Events
 │                └── ChangeSets
 └── Tasks
       ├── Sessions
       ├── Transitions
       └── Evidence
```

## Important invariant

A task may have many sessions. A session must belong to at most one primary task, while correlation may remain uncertain until enough evidence exists.

## Post-MVP entities

Reviews, PullRequests and Branches gain entity status when review/PR workflows ship (see ROADMAP.md). Until then, Branch is tracked as task/repository metadata and Reviews are lifecycle states in STATE_MACHINE.md.
