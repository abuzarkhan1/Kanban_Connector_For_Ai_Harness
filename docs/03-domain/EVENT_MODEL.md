# Normalized Event Model

## Purpose

All raw observations become a common event shape before entering the domain engine.

## Event categories

### Process
- PROCESS_STARTED
- PROCESS_UPDATED
- PROCESS_EXITED

### Harness
- HARNESS_DETECTED
- HARNESS_SESSION_STARTED
- HARNESS_SESSION_ENDED
- HARNESS_WAITING
- HARNESS_AWAITING_INPUT
- HARNESS_AWAITING_PERMISSION
- HARNESS_IDLE
- HARNESS_ERROR
- HARNESS_COMPLETED

HARNESS_AWAITING_INPUT, HARNESS_AWAITING_PERMISSION and HARNESS_IDLE are typically derived from PTY/terminal or adapter signals, never from raw process presence alone.

### Filesystem
- FILE_CREATED
- FILE_MODIFIED
- FILE_DELETED
- FILE_RENAMED

### Terminal
- TERMINAL_SESSION_STARTED
- TERMINAL_SESSION_ENDED
- COMMAND_STARTED
- COMMAND_OUTPUT
- COMMAND_EXITED

Raw terminal output should not be persisted by default.

### Git
- REPOSITORY_DETECTED
- BRANCH_CHANGED
- WORKTREE_CHANGED
- DIFF_CHANGED
- COMMIT_CREATED
- MERGE_DETECTED

### Tests/builds
- TEST_STARTED
- TEST_PASSED
- TEST_FAILED
- BUILD_STARTED
- BUILD_PASSED
- BUILD_FAILED

## Common event envelope

Conceptually:

```text
Event {
  id
  timestamp
  source
  category
  type
  projectId?
  repositoryId?
  workspaceId?
  sessionId?
  taskId?
  processId?
  payload
  correlationKey?
}
```

## Event requirements

- Events must be immutable.
- Event IDs must be unique.
- Duplicate observations must be safely ignored.
- Payloads must be schema validated.
- Events should be timestamped using a consistent clock strategy.

## Evidence

Inference should reference event IDs rather than copying raw event data into every transition.
