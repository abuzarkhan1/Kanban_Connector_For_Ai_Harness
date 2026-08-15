# Error Handling and Recovery

## Principles

Errors should degrade functionality rather than destroy the project state.

## Observer failure

If filesystem observation fails:
- mark observer degraded
- retry
- continue Git/process observation
- show diagnostic warning

## Harness failure

If an adapter fails:
- disable that adapter
- preserve generic observation
- continue tracking the workspace

## Git failure

If Git becomes unavailable:
- preserve task state
- mark repository observation degraded
- retry later

## Database failure

- stop state mutations
- show clear error
- preserve diagnostics
- attempt safe recovery
- never silently discard events

## Contradictory evidence

Example:

```text
Agent exited
but files continue changing
```

Do not immediately transition to REVIEW.

Use temporal aggregation and confidence thresholds.

## Crash recovery

On startup:
- recover incomplete sessions
- reconcile process list
- refresh Git state
- refresh filesystem state
- expire stale evidence
- recompute current projections

## User trust

Never silently make a surprising destructive change.
Automatic status changes must be reversible through task history/manual override.
