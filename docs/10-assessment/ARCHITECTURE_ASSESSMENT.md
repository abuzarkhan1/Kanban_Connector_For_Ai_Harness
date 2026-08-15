# Architecture Assessment & Implementation Status

Status: maintained per implementation phase. Last updated: foundation slice (Phase 1–3).

## CURRENT STATE

Repository state at assessment time: **greenfield**. No source code, no package
configuration. The repository contained only the documentation set and
`impl.md`.

Documentation reviewed in full before implementation:

- `README.md`
- all of `docs/01-product` through `docs/09-research`
- `impl.md`

## ARCHITECTURAL GAPS (identified, addressed)

1. **Repository layout** — `REPOSITORY_STRUCTURE.md` prescribes an npm-workspaces
   monorepo (`apps/desktop`, `packages/*`). For the foundation slice this was
   simplified to a **single package with layered source folders** that preserve
   the documented package names and dependency direction. See ADR-011.
2. **No running code to inspect** — nothing existed, so the foundation was built
   from scratch rather than evolved.
3. **Tooling gaps** — no lint/test/typecheck configuration existed; added
   TypeScript (strict), ESLint (flat config), Vitest, electron-vite.

## RISKS

| Risk | Level | Mitigation |
|---|---|---|
| better-sqlite3 native ABI drift with Electron | Medium | `npm run rebuild:native` (electron-rebuild); smoke test verifies native load under Electron |
| Electron binary download on fresh checkout | Low | `npm install` runs postinstall; verified working |
| Renderer bundle size (React + zod inlined) | Low | Acceptable for desktop; code-split later if needed |
| No drag-and-drop yet | Low | Deliberate — manual state moves via task detail; DnD is Phase 3 polish |
| Observation/inference not yet implemented | Expected | Phases 4–12 per IMPLEMENTATION_PLAN; architecture ready for them |

## DEPENDENCY GAPS

None blocking. Deliberately deferred (per TECH_STACK and dependency discipline):

- Tailwind v4 — **included** in foundation (one plugin).
- Drizzle ORM — **not used**; hand-rolled versioned migrations + typed
  repositories chosen instead (ADR-009). Drizzle can be introduced later
  without schema changes.
- `@electron/rebuild` — included; used for native module ABI alignment.
- No AI SDK, no LLM SDK, no backend service — by design (ADR-003).

## SECURITY CONCERNS

Implemented and verified:

- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`.
- Preload exposes only a narrow, typed `RendererApi`; raw `ipcRenderer` never
  reaches the page.
- Every IPC payload validated with **strict** zod schemas (unknown fields
  rejected).
- All handlers return an `IpcResult` envelope; no generic
  `execute(command)`-style endpoints exist.
- CSP header set on the renderer entry.
- Renderer has zero filesystem/shell access — mutations go through typed
  application services.

Remaining (later phases): crash-recovery hardening, migration backup before
upgrade, signed builds, diagnostics redaction review.

## IMPLEMENTATION ORDER (executed / planned)

| Phase | Status |
|---|---|
| 1. Application foundation (Electron, React, TS, Vite, preload, IPC, SQLite, logging, config) | ✅ Done |
| 2. Domain (Project, Task, Agent placeholder, Session placeholder, Event, Evidence, Transition) | ✅ Done (Project, Task, Transition; Agent/Session/Evidence come with observation) |
| 3. Kanban with manual state management | ✅ Done |
| 4. Repository/Git integration | ⏳ Next |
| 5. Filesystem observer | Planned |
| 6. Process observer | Planned |
| 7. Session + correlation engine | Planned |
| 8. State inference engine | Planned |
| 9. Automatic Kanban transitions | Planned |
| 10. PTY/terminal observation | Planned |
| 11. Harness adapters (after HARNESS_OBSERVABILITY_AUDIT) | Planned |
| 12. Performance, security, recovery, cross-platform hardening | Planned |

## FIRST IMPLEMENTATION SLICE (delivered)

Verification results (after hardening pass):

```text
typecheck   ✅ tsc --noEmit (node + web projects)
tests       ✅ 41/41 passing (state machine, IPC contracts, repositories, task/project services, board query, dev-CSP)
lint        ✅ eslint clean
build       ✅ electron-vite build (main, preload, renderer)
smoke test  ✅ electron . --smoke-test: DB + IPC + preload bridge + React mount verified, 0 renderer errors, exit 0
dev server  ✅ electron-vite dev serves with dev-only relaxed CSP; production build keeps strict CSP
```

## Foundation hardening (audit pass)

Findings from the post-implementation deep audit, all fixed:

1. **Dev-mode CSP blocked React Fast Refresh** — @vitejs/plugin-react injects an
   inline preamble script; `script-src 'self'` would blank the dev app.
   Fixed with a dev-only CSP relaxation plugin (`build/dev-csp.ts`); the
   production build keeps the strict policy. Verified on the live dev server
   and in the built output.
2. **Smoke test did not verify the renderer** — now checks the preload bridge
   (`window.api`), the React mount, and renderer console errors, and exits
   non-zero on failure.
3. **macOS `activate` could create duplicate windows** — guarded with
   `BrowserWindow.getAllWindows().length === 0`.
4. **Transition history went stale after a move** — task-detail effects split
   so the audit trail reloads when task status changes.
5. **Fresh installs got a better-sqlite3 ABI mismatch** — added a `postinstall`
   electron-rebuild so native modules always match Electron's ABI.
6. **Newly created project was not auto-selected** — the store now opens it.
7. **Missing coverage** — added tests for the board projection, project
   service lifecycle, and the CSP transform.

Delivered structure (actual, see REPOSITORY_STRUCTURE.md):

```text
src/
  main/          Electron main: lifecycle, window, IPC registry, logger, config, DB
  preload/       contextBridge API (types in api.ts)
  renderer/      React 19 + Tailwind v4 Kanban UI
  packages/
    domain/      Pure TS: entities, state machine, value objects, errors, events
    application/ Services + board query
    persistence/ better-sqlite3, migrations, repositories
    ipc/         Channels, zod contracts, IpcResult
    shared/      Framework-neutral utilities
tests/           (vitest roots in src/**; fixtures directory reserved)
```

## NEXT SLICE

Phase 4 — Repository/Git integration: register repositories, track
branch/HEAD/status, associate tasks with a repository/workspace/branch. This is
the prerequisite for all observation work that follows.

No known foundation-level gaps remain.
