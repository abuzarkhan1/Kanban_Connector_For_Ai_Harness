# Task State Machine

## User-facing columns

Default Kanban:

- TODO
- IN PROGRESS
- REVIEW
- DONE

## Internal lifecycle

```text
BACKLOG
  ↓
READY
  ↓
ASSIGNED
  ↓
AGENT_STARTED
  ↓
IMPLEMENTING
  ↓
TESTING
  ├──→ BLOCKED
  ↓
READY_FOR_REVIEW
  ↓
CHANGES_REQUESTED
  ↓
IMPLEMENTING
  ↓
APPROVED
  ↓
MERGED
  ↓
DONE
```

## State semantics

### TODO
No active execution evidence.

### IN PROGRESS
Strong evidence that implementation activity is occurring.

### REVIEW
Implementation appears complete and reviewable, but completion has not been confirmed.

### DONE
Completion evidence exists according to configured project policy.

### BLOCKED (internal)

Strong:
- adapter permission prompt requiring user action
- repeated failing tests while the agent is active
- confirmed agent idle with incomplete work

Medium:
- environment or dependency errors in agent output

BLOCKED should resolve via user action or an explicit resume. Never auto-promote a blocked task to REVIEW.

## Evidence examples

### IN PROGRESS
Strong:
- harness process active in task workspace
- recent file changes
- active command execution

Medium:
- recent Git modifications
- branch associated with task

Weak:
- process name alone

### REVIEW
Strong:
- tests passed + recent code changes + no active agent
- explicit adapter completion event
- commit exists and matches task workspace

Medium:
- agent stopped after implementation
- clean build

### DONE
Strong:
- merged PR or configured merge event
- user explicitly marks done
- configured completion rule satisfied

## Confidence model

Use a bounded score from 0 to 1.

Example:

```text
Process detected          +0.10
Known harness             +0.15
Correct repository        +0.20
Correct branch            +0.15
Recent file changes       +0.20
Tests running             +0.10
Tests passed              +0.10
```

Weights are examples, not final production values.

## Transition safeguards

- Require minimum confidence.
- Require temporal relevance.
- Reject contradictory evidence.
- Apply cooldown windows.
- Avoid oscillation.
- Allow user override.
- Record every decision.

## Critical rule

Do not map `process exists` directly to `DONE` or `REVIEW`. State is a conclusion from evidence.

## User column moves (drag-and-drop)

Dragging a card to a board column is explicit user intent and is the documented
"Allow user override" safeguard: the task is set to the column's entry status
(BACKLOG / IMPLEMENTING / READY_FOR_REVIEW / DONE) even when that is not a
one-step lifecycle edge. Every such move is recorded as an audited `user`
transition. System/inferred moves remain strictly gated by the transition
table above.
