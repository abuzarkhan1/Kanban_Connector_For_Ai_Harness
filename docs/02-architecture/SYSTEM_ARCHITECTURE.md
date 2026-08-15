# System Architecture

## Architectural style

Modular desktop application with clear separation between:

1. Presentation
2. Application services
3. Domain
4. Observation/integration infrastructure
5. Persistence
6. Operating-system adapters

## High-level architecture

```text
┌─────────────────────────────────────────────┐
│                 React Renderer              │
│ Dashboard / Kanban / Tasks / Activity      │
└──────────────────────┬──────────────────────┘
                       │ Typed IPC
┌──────────────────────▼──────────────────────┐
│              Electron Main                  │
│ App Services / IPC / Lifecycle / Security   │
└──────────────┬───────────────┬──────────────┘
               │               │
      ┌────────▼───────┐ ┌─────▼────────────┐
      │ Domain Engine  │ │ Observation Layer │
      │ Tasks/States   │ │ OS/Git/PTY/FS     │
      └────────┬───────┘ └─────┬────────────┘
               │               │
               └───────┬───────┘
                       ▼
             State Inference Engine
                       │
                       ▼
                 Event Store
                       │
                       ▼
                    SQLite
```

## Core architectural rule

The domain layer must not import Electron APIs.

The observation layer may use Electron/Node/OS facilities but must emit normalized domain events.

## Event pipeline

```text
OS / Git / Harness
       ↓
Raw Observer
       ↓
Normalizer
       ↓
Deduplicator
       ↓
Correlator
       ↓
Evidence Store
       ↓
State Inference
       ↓
Transition Policy
       ↓
Domain Command
       ↓
SQLite + UI Event
```

## Main processes

### Renderer
Responsible for UI only.

### Main
Responsible for privileged operations, application lifecycle and IPC.

### Worker processes/threads
Use where observation or indexing would otherwise block the main process.

## Isolation

The Electron renderer must use:

- context isolation
- sandboxing where compatible
- preload bridge
- explicit IPC channels
- no arbitrary `ipcRenderer` exposure
- no `nodeIntegration`

## Extensibility

Every observer and harness adapter should implement a common interface and emit normalized events.
