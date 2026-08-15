# Kanban_Connector_For_Ai_Harness

A desktop-first project management and development control-plane application built with Electron.js + React.

The product observes local development activity around AI coding harnesses (Claude Code, Codex, Gemini CLI, Antigravity, Aider, OpenCode, and future harnesses) without requiring an AI API. It derives development state from observable signals such as processes, PTYs/terminals, filesystem changes, Git activity, tests, builds, and optional native harness adapters.

## Core principle

> The agent does the work. The project manager observes the work.

## Documentation map

- `01-product/PRD.md` — Product requirements and scope
- `01-product/PRODUCT_VISION.md` — Product vision and principles
- `01-product/REQUIREMENTS.md` — Functional/non-functional requirements
- `02-architecture/SYSTEM_ARCHITECTURE.md` — Overall architecture
- `02-architecture/TECH_STACK.md` — Technology decisions
- `02-architecture/SECURITY_ARCHITECTURE.md` — Security model
- `02-architecture/ADR.md` — Architecture decisions
- `03-domain/DOMAIN_MODEL.md` — Domain entities and relationships
- `03-domain/STATE_MACHINE.md` — Task lifecycle and transition rules
- `03-domain/EVENT_MODEL.md` — Normalized event model
- `04-engine/OBSERVATION_ENGINE.md` — Process/PTY/filesystem/Git/test observation
- `04-engine/STATE_INFERENCE_ENGINE.md` — Evidence-based state inference
- `04-engine/HARNESS_ADAPTERS.md` — Harness integration architecture
- `04-engine/GIT_AND_REPOSITORY.md` — Repository intelligence
- `05-implementation/IMPLEMENTATION_PLAN.md` — Phased implementation plan
- `05-implementation/REPOSITORY_STRUCTURE.md` — Codebase organization
- `05-implementation/TESTING_STRATEGY.md` — Testing strategy
- `05-implementation/LOCAL_DATA.md` — SQLite/storage strategy
- `06-ux/UX_SPECIFICATION.md` — Product UX and interaction model
- `06-ux/KANBAN_SPECIFICATION.md` — Kanban behavior
- `07-quality/ERROR_HANDLING.md` — Failure and recovery behavior
- `07-quality/OBSERVABILITY.md` — Internal diagnostics/logging
- `08-release/RELEASE_PLAN.md` — Release and distribution strategy
- `08-release/ROADMAP.md` — Product roadmap
- `09-research/FEASIBILITY_AND_RISKS.md` — Feasibility and risk analysis
- `09-research/HARNESS_OBSERVABILITY_AUDIT.md` — Per-harness observability audit
- `09-research/MVP_DEFINITION.md` — MVP definition
- `10-assessment/ARCHITECTURE_ASSESSMENT.md` — Implementation assessment and phase status

## Implementation status

Foundation slice (Phases 1–3) is implemented and verified:

- Electron 43 + React 19 + TypeScript (strict) + Tailwind v4
- Secure renderer: `contextIsolation`, `sandbox`, preload bridge, strict zod IPC contracts
- SQLite via better-sqlite3 with versioned migrations
- Domain layer: entities, explicit state machine (12 internal states → 4 columns), typed errors
- Manual Kanban: projects, tasks, labels, priorities, state moves, transition audit trail
- Tests: 41 passing (state machine, IPC contracts, repositories, task/project services, board query, dev-CSP); typecheck + lint + build + smoke test green

See `docs/10-assessment/ARCHITECTURE_ASSESSMENT.md` for the full assessment and the phase plan.

## Explicit non-goals

- No mandatory AI API
- No cloud backend required for core functionality
- No AI-generated project management decisions as the primary mechanism
- No requirement that a harness expose a proprietary API
- No assumption that every harness exposes identical events

## Architecture rule

Native harness integrations are optional. Generic environmental observation is the universal fallback.
