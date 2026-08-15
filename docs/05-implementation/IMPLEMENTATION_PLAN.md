# Implementation Plan

## Phase 0 — Foundation

Deliver:
- Electron + React + TypeScript shell
- secure preload bridge
- application configuration
- SQLite
- migrations
- logging
- project/repository/task domain models

Exit criteria:
- application starts on all target OSes
- database migrations work
- renderer has no direct Node access

## Phase 1 — Kanban

Implement:
- projects
- tasks
- columns
- drag/drop
- task details
- manual status changes
- activity timeline
- transition history

Exit criteria:
- complete local project-management workflow works without observers

## Phase 2 — Repository awareness

Implement:
- repository registration
- Git metadata
- branch detection
- diff/status
- worktree discovery

Exit criteria:
- task can be associated with a repository/workspace/branch

## Phase 3 — Observation infrastructure

Implement:
- process observer
- filesystem observer
- Git observer
- command/test observer
- normalized event pipeline

Exit criteria:
- fixture repository generates deterministic events

## Phase 4 — Correlation

Implement:
- session detection
- repository/workspace correlation
- task correlation
- correlation confidence

Exit criteria:
- simultaneous activity in multiple workspaces does not cross-contaminate tasks

## Phase 5 — State inference

Implement:
- evidence aggregation
- confidence scoring
- state machine
- transition policies
- cooldown/hysteresis
- explainability

Exit criteria:
- automatic TODO → IN PROGRESS and IN PROGRESS → REVIEW work reliably on fixtures

## Phase 6 — Harness adapters

Implement adapter framework and first supported harness integrations where local observability is reliable.

Exit criteria:
- adapters emit normalized events
- generic observer remains functional

## Phase 7 — Reliability

Implement:
- crash recovery
- observer restart
- event deduplication
- database integrity checks
- performance optimization
- large repository handling

## Phase 8 — Packaging

Implement:
- macOS
- Windows
- Linux
- auto-update strategy
- signed builds
- diagnostics collection

## Phase 9 — Advanced features

Only after MVP stability:
- pull requests
- reviews
- multi-agent orchestration
- worktree management
- dependency-aware scheduling
- remote team features

## Development rule

Do not start with AI-agent orchestration. First prove that observation + correlation + inference is reliable.
