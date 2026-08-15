# Local Data and Persistence

## Database

Use SQLite as the local source of truth.

## Core tables

Conceptual schema:

```text
projects
repositories
workspaces
tasks
task_labels
agents
sessions
events
evidence
transitions
executions
artifacts
settings
observer_status
```

## Event retention

Do not retain unlimited low-level events.

Use retention policies:
- domain events: long-lived
- inference evidence: long-lived
- raw process snapshots: short-lived
- raw terminal output: not persisted by default

## Database principles

- migrations are mandatory
- foreign keys enabled
- transactions around state transitions
- indexes on repository/workspace/session/task/time
- periodic integrity checks
- safe backups/export

## Sensitive data

Avoid storing:
- environment variables
- shell history
- terminal secrets
- full source-code snapshots

Store metadata and references wherever possible.

## Recovery

On startup:
1. verify schema
2. validate database
3. recover unfinished sessions
4. restart observers
5. reconcile repository state
6. recalculate current task projections
