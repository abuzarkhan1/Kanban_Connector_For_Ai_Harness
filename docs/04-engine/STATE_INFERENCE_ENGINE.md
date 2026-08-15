# State Inference Engine

## Purpose

Convert noisy development activity into trustworthy task-state transitions.

## Design

The inference engine should be deterministic for identical event histories.

```text
Evidence
   ↓
Feature extraction
   ↓
Rule evaluation
   ↓
Confidence calculation
   ↓
Contradiction check
   ↓
Transition policy
   ↓
State transition
```

## Agent activity states

Task state answers "is the work complete?". A separate, per-session agent-activity state answers "what is the agent doing right now?". The two must not be conflated: an active process is not proof of productive work.

Agent activity is rarely directly observable and must be inferred from signals:

```text
thinking                 usually indistinguishable from idle externally
waiting for input        prompt or terminal interaction detected
awaiting permission      permission/approval prompt detected
executing commands       child process or PTY command activity
modifying files          filesystem events in the workspace
running tests            test/build process active
finished                 explicit adapter event or session end
failed                   error output or non-zero exit
stuck / doing nothing    active process with no progress for a long window
```

## Signal hierarchy

Not all signals are equally strong for answering "what is the agent doing?":

```text
Native harness events    strongest intent signal
Terminal / PTY
Process monitoring
Filesystem
Git
Tests / builds           weakest intent signal
```

Use the strongest signals a harness exposes. Weak signals must be combined and time-bounded before they drive task-state transitions. This hierarchy ranks signals for agent intent only — for task completion, tests-passed and commit/merge events remain strong completion signals (see STATE_MACHINE.md).

## Stuck and idle detection

An agent that is alive but unproductive should not hold a task in IMPLEMENTING forever.

- define an idle window per session (configurable, default minutes)
- progress resets the window: file changes, commands, terminal output, Git activity
- when the window expires with a live agent, raise a HARNESS_IDLE observation
- repeated idle observations may surface BLOCKED, normally with user confirmation
- never auto-transition to REVIEW or DONE on idle alone

## Correlation before inference

Never infer task state until activity is correlated to:

- repository
- workspace
- branch
- session
- task

Correlation confidence is separate from state confidence.

## Example features

- process active
- known harness
- workspace match
- branch match
- recent file modifications
- changed-file overlap with task metadata
- test process active
- tests passed
- tests failed
- commit created
- agent exited
- user marked review

## Temporal windows

Evidence should expire.

Example:
- process signal: seconds/minutes
- file activity: minutes
- test result: minutes
- commit: persistent
- merge: persistent

## Hysteresis

Prevent:

```text
IN PROGRESS
→ REVIEW
→ IN PROGRESS
→ REVIEW
```

from rapid noisy signals.

Use:
- minimum state dwell time
- stronger evidence requirement for reversal
- cooldown periods

## Explainability

Each decision should produce:

```text
Decision
- candidate state: REVIEW
- confidence: 0.87
- rule: IMPLEMENTATION_COMPLETE
- evidence:
  - tests passed
  - agent session ended
  - 14 files changed
  - commit created
```

## Manual overrides

A manual state change should temporarily suppress automation according to a configurable policy.

Example modes:
- AUTO
- MANUAL
- AUTO_WITH_CONFIRMATION

## Conservative default

False-positive automation is worse than requiring occasional user confirmation. The initial product should bias toward conservative transitions.
