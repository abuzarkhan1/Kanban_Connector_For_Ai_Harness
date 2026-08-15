# Observation Engine

## Purpose

Observe the local development environment without requiring an AI API.

## Observer types

### 1. Process observer

Detect relevant processes.

Inputs:
- executable name
- command-line metadata where permitted
- PID
- parent PID
- working directory
- start time
- exit code

Important:
Process names alone are insufficient evidence for task state.

### 2. PTY/terminal observer

When the application owns or launches a terminal session, PTY observation can provide stronger signals:

- command start
- command completion
- exit code
- prompt return
- session lifetime
- prompt/pause states (waiting for input, permission approval) where the harness emits identifiable markers

For externally launched terminals, observability depends on OS and integration capabilities.

### 3. Filesystem observer

Watch registered repositories.

Rules:
- ignore `.git` internals unless specifically required
- ignore dependency directories
- ignore build outputs
- debounce bursts
- aggregate related changes
- support large repositories

### 4. Git observer

Collect:
- current branch
- HEAD
- working-tree status
- changed files
- diff summary
- recent commits
- merge information where locally observable

### 5. Test/build observer

Detect configured or recognized commands.

Do not execute arbitrary commands merely because they exist in a repository.

### 6. Harness adapter

Optional stronger integration.

Adapter can provide:
- harness identity
- session identity
- explicit lifecycle events
- task/context metadata
- completion/error states

### 7. Future/optional observers

- Container observer: map Docker/devcontainer work back to the owning workspace and session.
- IDE observer: distinguish human edits (IDE editor/terminal) from agent edits.
- Remote/SSH observer: associate remote sessions with workspaces where applicable.

These are integrations of opportunity, not MVP requirements.

## Observation pipeline

```text
Raw signal
  ↓
Platform adapter
  ↓
Normalized event
  ↓
Deduplication
  ↓
Temporal aggregation
  ↓
Correlation
  ↓
Inference
```

## Resource controls

- adjustable polling intervals
- event debouncing
- repository watch limits
- idle detection
- backpressure
- bounded event buffers

## Failure behavior

If an observer fails:
- mark observer degraded
- continue unrelated observers
- expose diagnostic status
- retry using exponential backoff
