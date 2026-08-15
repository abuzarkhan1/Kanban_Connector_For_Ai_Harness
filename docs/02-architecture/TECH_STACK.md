# Technology Stack

## Desktop

- Electron.js
- TypeScript
- Electron Forge or Electron Builder for packaging
- Electron preload API for secure IPC

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand for local UI/application state where appropriate
- React Router if multi-page navigation becomes necessary

## Data

- SQLite
- Drizzle ORM or another lightweight typed SQLite layer
- Migration-based schema management

SQLite is the source of truth for local application state.

## Validation

- Zod for IPC payloads and external event validation

## Git

Use a Git library where it provides reliable cross-platform support, but retain a controlled CLI fallback for advanced Git functionality.

## Observation

- Node child-process APIs for controlled process inspection
- PTY library for terminal observation when required
- Native OS facilities isolated behind adapters
- Chokidar or equivalent event-driven filesystem watcher
- Git status/diff/log observation

## Testing

- Vitest for unit/integration tests
- React Testing Library for renderer behavior
- Playwright where end-to-end desktop coverage is appropriate
- Fixture repositories for deterministic observation tests

## Logging

- Structured application logger
- Separate diagnostic log channel
- Persistent event history only for user-relevant domain events; avoid storing raw terminal output by default

## Packaging

Target:
- macOS
- Windows
- Linux

OS-specific functionality must be implemented behind platform interfaces.

## Principles

- Prefer boring, stable dependencies.
- Do not introduce an AI SDK into the core.
- Avoid unnecessary backend services.
- Keep domain logic framework-independent.
- Minimize native modules unless they provide meaningful capability.
