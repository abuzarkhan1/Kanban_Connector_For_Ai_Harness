# UX Gap Analysis

Status: living document. Reviewed Aug 2026 against the current Kanban-only
surface (sidebar, board, columns, cards, task detail, app shell).

Method: each surface was audited for **discoverability, efficiency, feedback,
forgiveness, accessibility and density**. Items are grouped by surface with a
priority and a status.

- P0 = core usability gap, blocks a professional feel
- P1 = significant improvement, high value/effort ratio
- P2 = nice-to-have, lower value or needs domain changes

## App shell / global

| Gap | Priority | Status |
|---|---|---|
| No global keyboard handling (Escape to dismiss/deselect, blur fields) | P0 | ✅ implemented |
| Error toast is the only feedback channel — no success/undo feedback | P1 | ⏳ planned (toast system) |
| No app-level loading state beyond per-board text | P0 | ✅ skeleton for board |
| No focus management after destructive actions | P1 | ✅ deleting a non-selected project no longer kicks you off the current board |
| Nothing communicates the observation engine state (footer is hard-coded "idle") | P2 | ⏳ planned (needs engine) |
| No window-level density/zoom setting | P2 | ⏳ planned |

## Sidebar

| Gap | Priority | Status |
|---|---|---|
| Fixed 256px sidebar cannot be collapsed to reclaim board space | P0 | ✅ implemented (persisted) |
| No way to rename a project (create/delete only) | P0 | ✅ implemented (inline edit) |
| Delete has no confirmation — one click destroys a project | P0 | ✅ two-step inline confirm |
| No project count anywhere | P1 | ✅ label count |
| Truncated project names have no tooltip | P1 | ✅ title tooltips |
| No keyboard shortcut to jump to the create input (`/`) | P1 | ⏳ planned |
| No ordering (recent first / alphabetical) | P2 | ⏳ planned |
| No indication of which project is "active" beyond selection | P2 | ⏳ planned |

## Board

| Gap | Priority | Status |
|---|---|---|
| No way to find a task when the board grows — no search/filter | P0 | ✅ filter in header |
| Dead "Loading board…" text instead of a skeleton | P0 | ✅ skeleton |
| Project with zero tasks shows four empty columns — no guidance | P1 | ✅ empty-board state |
| Header shows only name + raw id; no board-level actions | P1 | ⏳ planned (menu) |
| No sort/filter inside columns | P1 | ✅ sort cycle per column |

## Columns

| Gap | Priority | Status |
|---|---|---|
| Columns cannot be collapsed to a rail (density control) | P0 | ✅ implemented (persisted) |
| No drag-and-drop — cards must be moved through the detail panel | P0 | ✅ HTML5 DnD + drop highlight |
| Empty column copy is passive ("No tasks here") | P1 | ✅ guidance copy |
| No visual feedback while dragging over a column | P1 | ✅ drop-target highlight |
| Column width fixed; no resize | P2 | ⏳ planned |

## Task cards

| Gap | Priority | Status |
|---|---|---|
| Long titles clip with no tooltip | P1 | ✅ title tooltip |
| No affordance that a card can be dragged | P1 | ✅ cursor + drag state |
| No inline edit (must open the panel for everything) | P2 | ⏳ planned |
| No multi-select / bulk actions | P2 | ⏳ planned (domain) |
| No keyboard navigation between cards (arrow keys) | P2 | ⏳ planned |

## Task detail

| Gap | Priority | Status |
|---|---|---|
| Save has no feedback and no disabled/invalid state (can attempt empty title) | P0 | ✅ validation + "Saving…/Saved" feedback |
| Delete has no confirmation | P0 | ✅ two-step inline confirm |
| History grows unbounded — no way to collapse it | P1 | ✅ collapsible section |
| No Escape-to-close | P0 | ✅ global Escape |
| No dirty-state indicator / discard | P1 | ⏳ planned |
| Transitions only show "Move to X" — no explanation of rules | P1 | ⏳ planned (needs engine) |
| Panel could not be collapsed — fixed 320px chrome | P1 | ✅ collapse-to-rail (persisted); resize still ⏳ planned |

## Out of scope (need domain/engine work first)

- Assignees, due dates, estimates (domain model has none)
- Multi-select + bulk move/delete (needs selection model)
- Activity/timeline views, sessions, agents (UX spec's future surfaces)
- Undo for moves/deletes (needs event sourcing or an undo log)
- Drag-and-drop *ordering* inside a column (needs a sort-order column)

## Shipped in this pass

Collapsible sidebar · collapsible columns (persisted) · collapsible task-detail
panel (persisted rail) · drag-and-drop between
columns · board search filter · per-column sort · loading skeleton ·
empty-board state · project rename · two-step delete confirmation (project +
task) · title tooltips · save feedback + validation · collapsible history ·
global Escape handling.
