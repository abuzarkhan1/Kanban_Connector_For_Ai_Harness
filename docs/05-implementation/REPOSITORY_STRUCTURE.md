# Repository Structure

Current structure (implemented, single package with layered source folders).

## Layout

```text
ai-harness-project-manager/
├── src/
│   ├── main/                     # Electron main process
│   │   ├── index.ts              # app lifecycle, bootstrap
│   │   ├── window.ts             # secure BrowserWindow creation
│   │   ├── ipc.ts                # schema-validated IPC handler registry
│   │   ├── db.ts                 # DB init wired to userData
│   │   ├── logger.ts             # structured logger (console + file)
│   │   └── config.ts             # typed config loader
│   ├── preload/
│   │   ├── index.ts              # contextBridge implementation
│   │   └── api.ts                # RendererApi type (no Electron imports)
│   ├── renderer/                 # React application
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── api/client.ts     # typed bridge wrapper + IpcResult unwrap
│   │       ├── stores/           # zustand stores
│   │       ├── components/       # Sidebar, Board, Column, TaskCard, TaskDetail
│   │       └── styles/           # global.css (Tailwind v4 entry)
│   └── packages/                 # framework-independent layers
│       ├── domain/               # pure TS, no Node/Electron imports
│       │   ├── entities/         # Project, Task, Transition
│       │   ├── state-machine/    # status, column mapping, transitions
│       │   ├── value-objects/    # Priority
│       │   ├── events/           # domain event envelope
│       │   └── errors/           # typed domain errors
│       ├── application/          # services + queries (wires domain + persistence)
│       │   ├── services/         # ProjectService, TaskService
│       │   └── queries/          # board projection
│       ├── persistence/          # better-sqlite3
│       │   ├── schema/           # versioned migrations
│       │   ├── database.ts       # open/configure/migrate
│       │   └── repositories/     # typed repositories
│       ├── ipc/                  # channels, zod contracts, IpcResult
│       │   ├── channels.ts
│       │   ├── errors.ts
│       │   └── contracts/        # per-domain zod schemas + DTO types
│       └── shared/               # framework-neutral utilities (ids, etc.)
├── tests/                        # reserved for shared fixtures/e2e/performance
├── docs/                         # documentation set
├── impl.md
├── electron.vite.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── tsconfig.json                 # base
├── tsconfig.node.json            # main/preload/packages/tests
└── tsconfig.web.json             # renderer + web-safe packages
```

## Dependency direction

```text
renderer
   ↓
preload (typed api)
   ↓
ipc (contracts, channels)
   ↓
application
   ↓
domain
   ↓
persistence → domain/application contracts
   ↓
shared (used by all layers; framework-neutral)
```

Rules:

- `src/packages/domain` must never import Node, Electron, SQLite or React.
- `src/packages/persistence` must never import Electron (callers pass paths).
- `src/main` is the only place Electron is imported.
- `src/preload/api.ts` is types-only so both node and web projects can share it.
- IPC channels exist only in `src/packages/ipc/channels.ts`.

## Planned packages (later phases)

These layer folders are created when their phases start (see
IMPLEMENTATION_PLAN.md):

```text
src/packages/observation/   # process, filesystem, terminal, git, tests observers
src/packages/harnesses/     # adapter core + generic + per-harness adapters
src/packages/inference/     # evidence aggregation, confidence, transition policy
```

If the package count and build complexity grow, splitting into an npm
workspaces monorepo (the original recommended layout) is a mechanical move —
the source boundaries already match package boundaries.
