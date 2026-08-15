# Requirements

## Functional requirements

### FR-001 Project management
The system shall support creating, editing, archiving and deleting projects.

### FR-002 Repository registration
The system shall register local Git repositories and discover repository metadata.

### FR-003 Kanban
The system shall provide configurable columns with default TODO, IN PROGRESS, REVIEW and DONE.

### FR-004 Tasks
Tasks shall contain title, description, priority, labels, status, repository association and timestamps.

### FR-005 Sessions
The system shall model development sessions independently from tasks.

### FR-006 Process observation
The application shall detect relevant local processes where OS permissions permit.

### FR-007 Filesystem observation
The application shall detect relevant repository file changes without continuously scanning entire repositories.

### FR-008 Git observation
The application shall observe branch, working-tree, diff and commit changes.

### FR-009 Test/build observation
The application shall detect configured test/build commands and capture exit state.

### FR-010 Harness abstraction
The system shall expose a harness adapter interface without making any individual harness mandatory.

### FR-011 State inference
The system shall calculate task state from multiple evidence signals.

### FR-012 Confidence
Every automatic state transition shall have a confidence score and evidence references.

### FR-013 Manual override
Users shall be able to override an inferred state.

### FR-014 Automation controls
Users shall be able to disable automation globally, per project, repository, task or transition.

### FR-015 Audit trail
The system shall preserve state-transition history.

### FR-016 Explainability
The UI shall show why an automatic transition occurred.

### FR-017 Privacy
Source code contents shall remain local unless the user explicitly adds an external integration that requires transmission.

### FR-018 Recovery
The application shall recover from process termination, missed filesystem events and database restarts.

## Non-functional requirements

### Performance
- UI must remain responsive while observation is active.
- File watching must be event-driven.
- Git polling must use bounded intervals and change detection.
- Large repositories must not be recursively rescanned on every event.

### Reliability
- Event ingestion must tolerate duplicates.
- Events must be idempotently processed.
- Observer failure must not corrupt project data.
- A single failing adapter must not affect unrelated adapters.

### Security
- Renderer process has no direct filesystem, shell or Node access.
- Privileged operations occur in controlled Electron main-process services.
- IPC uses explicit allowlisted commands.
- External integrations require explicit user consent.

### Maintainability
- Domain logic must be independent of Electron.
- OS-specific implementations must be isolated.
- Harness adapters must be independently testable.
