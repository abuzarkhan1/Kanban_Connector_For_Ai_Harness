# MVP Definition

## MVP objective

Prove the central hypothesis:

> A desktop application can automatically maintain meaningful Kanban state by observing local development activity around AI coding harnesses without requiring AI APIs.

## Must have

- Electron + React
- SQLite
- Project/task model
- Kanban
- Repository registration
- Git observer
- Filesystem observer
- Process observer
- Basic session detection
- Task correlation
- State inference
- Confidence
- Evidence timeline
- Automatic TODO → IN PROGRESS
- Conservative IN PROGRESS → REVIEW
- Manual override
- Audit history
- Diagnostics

## Should have

- PTY observation
- generic harness detection
- worktree support
- test detection
- one or two high-value harness adapters

## Not MVP

- cloud backend
- team collaboration
- billing
- LLM reasoning
- autonomous agent spawning
- automatic code changes
- automatic Git push
- automatic merge
- complex analytics

## MVP success test

A developer should be able to:

1. Register a repository.
2. Create a task.
3. Associate a workspace/branch.
4. Start an AI coding harness normally.
5. Make code changes through the harness.
6. See the task automatically enter IN PROGRESS.
7. Run tests.
8. Stop/finish the agent.
9. See sufficient evidence accumulate for REVIEW.
10. Inspect exactly why the transition occurred.
