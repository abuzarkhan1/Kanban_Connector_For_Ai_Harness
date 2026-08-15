# Feasibility and Risk Analysis

## Feasibility

The core product is technically feasible without AI APIs.

The most reliable signals are local development-environment signals:
- repository location
- worktree
- branch
- filesystem activity
- process activity
- commands/tests
- Git commits
- optional harness-specific events

## Integration surface

A desktop app can naturally observe local Git repositories, terminals/PTYs, processes, filesystem events, local AI tools, IDEs, Docker, test runners and build processes — a browser-first product cannot. This is the core reason the product is desktop-first. IDE, container and SSH/remote awareness are optional enhancements (see OBSERVATION_ENGINE.md), not MVP requirements.

## Biggest risks

### 1. Harness observability

Not every harness exposes the same lifecycle events.

Mitigation:
generic observer + capability-based adapters.

### 2. Task correlation

Detecting an AI process is easier than knowing which task it is performing.

Mitigation:
explicit task/workspace association, branch/worktree matching, session context and evidence scoring.

### 3. False positives

File changes may be caused by humans, IDEs or build tools.

Mitigation:
multi-signal inference and conservative thresholds.

### 4. False completion

Inactivity does not mean completion.

Mitigation:
never infer DONE from inactivity alone.

### 5. OS differences

Process and terminal observation differs across macOS, Windows and Linux.

Mitigation:
platform abstraction and capability detection.

### 6. Performance

Large repositories can produce huge event volumes.

Mitigation:
ignore rules, debouncing, aggregation and bounded polling.

### 7. Security

The application has access to sensitive developer environments.

Mitigation:
read-only observation by default, secure Electron architecture, strict IPC and no source-code upload in core product.

### 8. Misreading agent activity

An active process may be thinking, waiting for permission, or stuck. Confusing these causes premature or delayed transitions.

Mitigation:
keep agent-activity inference separate from task-state inference (STATE_INFERENCE_ENGINE.md), use the signal hierarchy, and prefer user confirmation when intent is ambiguous.

## Pre-implementation audit

Before building harness adapters, run the observability audit in `09-research/HARNESS_OBSERVABILITY_AUDIT.md`. It determines what can be automatic per harness versus what requires adapters or manual fallback. This is the feasibility pass the architecture should be built around.

## Core feasibility conclusion

The product should be built around a generic observation engine first. Harness-specific integrations should improve accuracy, not determine whether the product works.
