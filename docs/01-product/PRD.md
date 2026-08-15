# Product Requirements Document

## 1. Product

Working name: AI Harness Project Manager.

A desktop project-management application that automatically synchronizes Kanban task state with local software-development activity, especially activity produced by AI coding harnesses.

## 2. Primary users

- Individual developers using AI coding agents
- Small development teams
- Developers running multiple agents simultaneously
- Technical leads supervising agent-driven implementation
- Power users managing multiple repositories/worktrees

## 3. Core use case

A developer creates a task:

> Implement GitHub OAuth.

The task starts in TODO. The developer starts an AI harness in the associated repository. The application observes the environment and automatically derives:

TODO → IN PROGRESS → REVIEW

The user can inspect the evidence behind every transition.

## 4. Core workflow

1. Create/import project.
2. Select one or more repositories.
3. Create Kanban tasks.
4. Associate a task with a repository/worktree/branch.
5. Start an AI harness normally (or launch it from the task view).
6. Observer detects relevant activity.
7. Correlation engine associates activity with a task/session.
8. State inference engine calculates the most likely lifecycle state.
9. Kanban updates automatically when confidence and transition rules permit.
10. User reviews evidence.
11. Git/test/review signals move the task toward completion.

## 5. MVP features

### Project management
- Projects
- Repositories
- Workspaces
- Kanban board
- Tasks
- Labels
- Priority
- Assignees
- Task descriptions
- Task activity history

### Development awareness
- Process detection
- Terminal/PTY observation where technically available
- Filesystem observation
- Git status/diff/branch/commit observation
- Test/build process detection
- Repository/worktree correlation

### Automation
- Automatic task-state inference
- Confidence scoring
- Evidence timeline
- Automatic transitions
- Manual override
- Pause automation per task/project
- Transition audit log

### Harness support
- Generic harness detection
- Adapter interface
- Initial adapter architecture for Claude Code, Codex, Gemini CLI, Antigravity, Aider, OpenCode and future tools
- Adapter capability registry
- No AI API requirement

### Harness launching (optional)
From a task, the user can optionally launch a supported harness into the task's workspace/branch with task context. Launching is the simplest integration level and is never required for observation to work.

## 6. Post-MVP

- Worktree lifecycle management
- Pull-request integration
- Review workflows
- Multi-agent orchestration
- Agent assignment
- Dependency-aware task scheduling
- Advanced analytics
- Team synchronization
- Remote collaboration

## 7. Non-functional requirements

- Core functionality must work offline.
- Application must not require sending source code to a cloud service.
- Observation must be resource-conscious.
- State transitions must be explainable.
- All automatic changes must be auditable.
- The renderer must not receive unrestricted Node.js access.
- IPC must be explicit and typed.
- Corrupted local state must be recoverable.
- The system must degrade gracefully when a harness cannot be identified.

## 8. Success criteria

MVP is successful when a developer can:

1. Open a repository.
2. Create a task.
3. Start a supported or unknown AI harness normally.
4. Work without changing their normal workflow.
5. Have meaningful activity detected automatically.
6. See the task move to IN PROGRESS based on evidence.
7. See testing/repository evidence appear.
8. Have the task reach REVIEW when configured completion evidence exists.
9. Understand why every automatic transition occurred.
