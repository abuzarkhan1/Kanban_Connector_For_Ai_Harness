# Product Roadmap

## Milestone 1 — Local Kanban

- Projects
- Repositories
- Tasks
- Kanban
- SQLite
- Manual workflow

## Milestone 2 — Development Awareness

- Git observer
- Filesystem observer
- Process observer
- Session model
- Activity timeline

## Milestone 3 — Automatic State

- Correlation engine
- Evidence model
- Confidence scoring
- State machine
- Automatic transitions
- Explainability

## Milestone 4 — Harness Ecosystem

- Generic harness detection
- Adapter framework
- Claude Code adapter
- Codex adapter
- Gemini CLI adapter
- Antigravity adapter
- Aider adapter
- OpenCode adapter
- Capability registry

Adapters should only be implemented where reliable local observability exists, confirmed by the per-harness audit in `09-research/HARNESS_OBSERVABILITY_AUDIT.md`.

## Milestone 5 — Multi-agent Development

- Worktree management
- Concurrent sessions
- Agent-to-task assignment
- Dependency graph
- Conflict detection
- Agent workload view

## Milestone 6 — Development Control Plane

- Pull request awareness
- Review lifecycle
- Build pipelines
- Release awareness
- Optional IDE, Docker/container and remote/SSH awareness
- Advanced analytics
- Optional remote/team synchronization

## Milestone 7 — Orchestration

Only after observation is proven reliable:

```text
Task
 ↓
Planning
 ↓
Agent assignment
 ↓
Execution
 ↓
Testing
 ↓
Review
 ↓
Merge
```

Orchestration must remain a separate layer from observation.
