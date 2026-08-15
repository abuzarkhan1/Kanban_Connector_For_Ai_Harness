# Harness Adapter Architecture

## Goal

Support many AI coding harnesses without coupling the core application to one vendor.

## Core interface

Conceptually:

```text
HarnessAdapter
 ├── id
 ├── detect(process)
 ├── capabilities()
 ├── observe(context)
 └── normalize(rawEvent)
```

The exact implementation should be typed and versioned.

## Adapter levels

### Level 0 — Generic

No harness-specific integration.

Uses:
- process
- filesystem
- Git
- terminal
- tests

Works with unknown tools.

### Level 1 — Process identity

Recognizes executable/process signatures.

Provides stronger harness identity but limited lifecycle semantics.

### Level 2 — CLI/PTY integration

Observes terminal sessions and command lifecycle.

### Level 3 — Native integration

Uses official hooks, events, plugins, MCP or other supported local mechanisms when available.

## Initial targets

Architecture should allow adapters for:

- Claude Code
- Codex
- Antigravity CLI (`agy`) — Google's agentic platform; Gemini CLI is being retired in its favor (June 2026), see `09-research/HARNESS_OBSERVABILITY_AUDIT.md`
- Gemini CLI — legacy; superseded by Antigravity CLI
- Aider
- OpenCode
- other future coding harnesses

Do not hard-code assumptions about proprietary internals. Adapter capabilities must be feature-detected.

Before building an adapter, complete the per-harness observability audit in `09-research/HARNESS_OBSERVABILITY_AUDIT.md` to confirm which signals are reliably available.

## Observability surfaces

A harness may expose any subset of:

- CLI, stdout and stderr
- process identity and command line
- filesystem and Git behavior (always available)
- CLI events or structured output
- hooks or a plugin system
- MCP endpoints
- official APIs/SDKs
- documented permission and completion signals

Some harnesses expose almost nothing externally. Capability detection happens at runtime, and generic observation is the fallback for every harness.

## Adapter isolation

A harness adapter must never contain task-state business logic.

Adapter responsibility:

```text
Raw harness behavior → normalized events
```

Inference responsibility:

```text
Normalized events → task state
```

## Unknown harness behavior

Unknown AI harnesses must still benefit from generic observation.

This is essential to the product promise.
