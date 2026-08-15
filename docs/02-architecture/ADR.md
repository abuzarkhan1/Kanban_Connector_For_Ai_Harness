# Architecture Decision Records

## ADR-001 — Electron + React

### Decision
Use Electron.js for desktop capabilities and React + TypeScript for UI.

### Reason
The product needs deep local OS integration while retaining a productive cross-platform UI stack.

## ADR-002 — Local-first

### Decision
SQLite is the source of truth for core project data.

### Reason
The core product is a local development control plane and should function without a cloud service.

## ADR-003 — No mandatory AI API

### Decision
The core state engine must not depend on an LLM or AI API.

### Reason
The application should observe and infer from development-environment signals. This makes the system cheaper, private, harness-agnostic and deterministic.

## ADR-004 — Evidence-based state

### Decision
Never move a task solely because one weak signal occurred.

### Reason
Process names and file changes are noisy. Multiple signals reduce false positives.

## ADR-005 — Generic observer + optional adapters

### Decision
Use generic environmental observation as the baseline and optional harness-specific adapters for stronger signals.

### Reason
Harnesses expose different capabilities and change over time.

## ADR-006 — Explainable automation

### Decision
Every automatic transition stores evidence and a rule identifier.

### Reason
Users must be able to trust and debug automation.

## ADR-007 — Domain independent of Electron

### Decision
The state machine, inference engine and task model must not depend on Electron.

### Reason
This improves testability and makes future migration or headless execution possible.

## ADR-008 — Build tooling: electron-vite + Vite 7 + React 19

### Decision
Use electron-vite (Vite 7) for the build, React 19 + TypeScript (strict) for the renderer, Tailwind v4 for styling, Zustand for renderer state.

### Reason
The toolchain is the mainstream, well-maintained path for Electron + React and keeps the main/preload/renderer builds in one configuration.

## ADR-009 — Persistence: better-sqlite3 with hand-rolled migrations

### Decision
Use better-sqlite3 with versioned SQL migrations (`PRAGMA user_version`) and thin typed repositories. No ORM in the foundation.

### Reason
Better-sqlite3 is synchronous, battle-tested and trivial to keep behind a typed layer. Hand-rolled migrations keep the dependency graph small; an ORM can be added later without schema changes.

Native-module ABI alignment with Electron is handled by `@electron/rebuild` (`npm run rebuild:native`) and verified by the smoke test.

## ADR-010 — Strict zod contracts + IpcResult envelope

### Decision
Every IPC payload is validated with a strict zod schema (unknown fields rejected). Every handler returns a discriminated `IpcResult<T>` envelope; domain errors map to stable codes.

### Reason
Zod-strict validation rejects malformed or hostile payloads at the boundary. The envelope avoids lossy thrown-error serialization across the bridge and gives the renderer structured errors.

## ADR-011 — Single-package layered layout (deviation from monorepo recommendation)

### Decision
The foundation ships as one npm package with the documented layers as source folders under `src/packages/*`, instead of the npm-workspaces monorepo sketched in REPOSITORY_STRUCTURE.md.

### Reason
For the foundation phase, a single package avoids workspace build orchestration while preserving every architectural boundary (domain has no Node/Electron imports; persistence has no Electron imports; IPC channels are centralized). Splitting into npm workspaces later is mechanical because package boundaries already exist as folders.

### Alternatives considered
Full npm-workspaces monorepo — rejected for now as premature infrastructure.

### Trade-offs
Single package shares one lockfile and build config; this is a benefit at this size. If observation/harness packages grow independently, revisit.
