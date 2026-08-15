# UX Specification

## Product feel

The UI should feel like a professional developer control plane rather than a generic productivity board.

Priorities:
- dense but readable information
- clear activity
- fast navigation
- evidence visibility
- minimal manual management

## Main navigation

- Overview
- Projects
- Kanban
- Timeline
- Sessions
- Activity
- Repositories
- Agents
- Settings
- Diagnostics

## Dashboard

Show:
- active agents
- active sessions
- tasks in progress
- tasks needing review
- failed tests
- blocked tasks
- observer health

## Task detail

Sections:
- title/description
- status
- repository/workspace
- branch
- active agent/session
- agent activity state (working / waiting / blocked / idle) where inferable
- changed files
- tests/builds
- commits
- evidence
- transition history

## Explainability UX

When automation changes state, show:

```text
Moved to REVIEW

Why?
✓ Agent session ended
✓ Tests passed
✓ 12 files changed
✓ Commit created
Confidence: 91%
```

Never hide automatic decisions.

## Manual controls

Users can:
- move a card
- pause automation
- change repository
- change workspace
- relink session
- reject an inference
- mark task complete
- launch a harness session for a task (optional)

## Empty states

Empty states should explain how to connect the next useful piece of context rather than simply showing blank screens.
