# Security Architecture

## Threat model

The application observes processes, terminals, repositories and potentially commands. This creates a high-privilege desktop security boundary.

Primary threats:

- malicious repository scripts
- compromised dependencies
- accidental command execution
- renderer privilege escalation
- malicious IPC payloads
- secret leakage through logs
- unauthorized source-code transmission

## Security rules

### Renderer isolation

The renderer must never have direct access to:

- Node.js
- filesystem
- child processes
- shell
- arbitrary OS APIs

### IPC

Every IPC endpoint must be:

- explicitly named
- typed
- schema validated
- permission checked
- narrowly scoped

Never expose a generic:

```text
execute(command)
```

IPC endpoint.

### Command execution

If the application executes commands:

- use explicit executable + argument arrays
- never concatenate untrusted strings into shell commands
- record command metadata, not secrets
- provide user-visible consent for dangerous operations

### Repository trust

Opening a repository must not automatically execute project scripts.

Test/build commands must be discovered and/or configured but require explicit execution policy.

### Secrets

Never persist:

- environment variables wholesale
- shell history
- authentication tokens
- raw terminal output by default

Redact known secret patterns in diagnostics.

### External integrations

Remote integrations must be opt-in.

Core operation must not require uploading source code.

## Principle

Observation should be read-only by default. Mutation requires explicit application policy.
