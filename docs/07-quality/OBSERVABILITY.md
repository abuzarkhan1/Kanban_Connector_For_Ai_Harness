# Application Observability

## Internal diagnostics

Expose an internal diagnostics page containing:

- application version
- OS
- observer status
- database status
- active sessions
- active adapters
- event throughput
- recent errors
- CPU/memory estimates
- watcher counts

## Structured logs

Log fields:

```text
timestamp
level
component
event
correlationId
projectId
repositoryId
workspaceId
sessionId
taskId
message
```

Avoid secrets and raw terminal output.

## Correlation IDs

A single development activity chain should be traceable:

```text
raw observation
 → normalized event
 → correlation
 → inference
 → transition
 → UI update
```

## Debug mode

Provide opt-in diagnostic verbosity.

Debug mode may expose additional metadata but must still redact secrets.

## User-facing activity

The activity feed should show meaningful domain events rather than every low-level filesystem notification.
