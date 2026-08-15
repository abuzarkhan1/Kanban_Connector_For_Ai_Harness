# Harness Observability Audit

Status: living research artifact. Complete before building each adapter
(Phase 6 / ROADMAP Milestone 4), and refresh whenever a harness version
changes.

## Purpose

Determine exactly what each target harness exposes for automatic state
derivation, and what therefore must rely on generic observation or a manual
fallback. This is the pre-coding feasibility pass the architecture is built
around: no adapter work should start until the surface for that harness is
understood and recorded.

## Method

For each harness:

1. Read official documentation and public source where available.
2. Run controlled experiments: launch the harness inside a fixture repository
   under process and PTY observation, with known commands, file edits, tests
   and commits.
3. Record what was observed with evidence links and the date.
4. Assign a recommended adapter level (see HARNESS_ADAPTERS.md, levels 0-3).

## Capability dimensions

| Dimension | What we need to know |
|---|---|
| Process identity | Reliable identification? Executable name, command line, cwd, parent chain |
| stdout/stderr | What is emitted? Can state markers be parsed without fragile scraping? |
| CLI events | Structured/JSON output, exit codes, event flags, non-interactive mode |
| Hooks / plugins | Lifecycle hooks (start, tool use, completion, error) |
| MCP | Local MCP endpoint we could observe or use |
| Terminal interaction | Detectable prompt, waiting-for-input, permission approval, echo |
| Git behavior | Does it commit, branch or create worktrees itself? |
| Lifecycle signals | Start/end markers, completion message, failure output |
| Permission prompts | Can \"approve this command\" prompts be detected? |
| Session/task context | Can it be launched with task context (cwd, branch, prompt)? |
| Manual fallback | How much must remain user-confirmed for this harness? |

## Target harnesses

- Claude Code
- Codex
- Antigravity CLI (`agy`) — primary Google target; replaces Gemini CLI (retiring June 2026)
- Gemini CLI — legacy, superseded by Antigravity CLI
- Aider
- OpenCode

## Antigravity CLI — known surface (research snapshot, Aug 2026)

- Local binary (`agy`), runs in the user's terminal: process + PTY observation apply (Level 1–2).
- Works on local Git repositories; creates branches/commits: Git observer applies (universal).
- Supports MCP as a client: config at `~/.gemini/config/mcp_config.json` and workspace `.agents/mcp_config.json`; stdio servers launched by the CLI. Our app can register as an MCP server for explicit lifecycle/tool events (Level 3).
- Plugin system (`agy plugin …`): potential hooks surface.
- Execution modes (Ask / auto-approve / YOLO): permission-prompt detection via PTY is feasible.
- Cloud/browser surfaces (Antigravity 2.0, IDE, web Mission Control) are NOT locally observable; rely on Git/remote signals there.
- Detailed capability sheet to be filled via controlled experiments before adapter work.

## Per-harness template

```text
## <Harness> v<version> (<date>)

Process identity: ...
stdout/stderr: ...
CLI events: ...
Hooks/plugins: ...
MCP: ...
Terminal interaction: ...
Git behavior: ...
Lifecycle signals: ...
Permission prompts: ...
Session/task context: ...
Manual fallback needed: ...
Adapter level achievable (0-3): ...
Confidence: ...
Evidence links: ...
```

## Expected outputs

- one capability sheet per harness (fill the template above)
- recommended adapter level per harness
- signals that must come from generic observation for every harness
- signals that require manual user confirmation
- items where observability changed between harness versions
