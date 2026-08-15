# Testing Strategy

## Testing pyramid

### Unit tests

Test:
- state machine
- confidence calculations
- evidence expiry
- transition policy
- correlation logic
- event normalization
- Git parsing

These should be fast and deterministic.

### Integration tests

Test:
- SQLite repositories
- event ingestion
- observer → event pipeline
- inference → transition persistence
- IPC contracts

### Fixture-based observation tests

Create synthetic repositories with known activity:

```text
fixture/
 ├── initial state
 ├── modify files
 ├── run tests
 ├── create commit
 └── expected events
```

### End-to-end tests

Validate:
- app startup
- create project
- register repository
- create task
- observe activity
- automatic transition
- inspect evidence

## Important scenarios

1. Unknown harness.
2. Known harness.
3. Multiple simultaneous agents.
4. Same repository, different worktrees.
5. Agent crashes.
6. Tests fail.
7. Tests pass.
8. Files change without an agent.
9. Agent runs but makes no changes.
10. User manually overrides state.
11. Filesystem watcher misses an event.
12. Git repository is unavailable.
13. Database restarts during inference.
14. Large repository.
15. Duplicate events.

## Property-style tests

The state engine should guarantee:
- invalid transitions are rejected
- repeated identical events do not duplicate transitions
- old evidence cannot dominate fresh contradictory evidence
- manual overrides follow policy

## Performance tests

Measure:
- event ingestion throughput
- CPU during idle observation
- memory during long sessions
- filesystem watcher overhead
- Git polling cost
- large repository startup time
