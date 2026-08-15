# Kanban Specification

## Default columns

```text
TODO
IN PROGRESS
REVIEW
DONE
```

## Card data

Display:
- title
- priority
- labels
- repository
- branch
- agent
- active session indicator
- agent activity indicator (working / waiting / blocked) where inferable
- automation indicator
- last activity
- confidence/status indicator where useful

## Automatic movement

Automatic movement must visually differ from manual movement without being distracting.

Example:

```text
AUTO
Moved by development activity
```

## Drag-and-drop

Manual drag should:
1. validate transition
2. create user transition event
3. apply manual override policy
4. optionally pause automation

## Review column

A task enters REVIEW only when configured evidence is sufficient.

Typical evidence:
- implementation activity stopped
- tests pass
- meaningful diff exists
- agent completion signal
- commit exists

## Done

Default policy should be conservative.

Recommended MVP:
- user confirmation OR
- explicit configured completion event

Do not infer DONE solely from inactivity.

## Filters

Support:
- project
- repository
- agent
- status
- priority
- label
- active session
- automated/manual
