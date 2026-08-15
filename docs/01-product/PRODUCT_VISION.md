# Product Vision

## Problem

AI coding agents can execute large amounts of software work, but the surrounding project-management layer remains largely manual. Developers still have to remember which task is active, whether an agent is actually working, whether tests ran, whether changes are ready for review, and when work is truly complete.

Traditional Kanban systems know about tasks but not the development environment. AI coding harnesses know about execution but are not project-management systems.

## Vision

Build a local-first desktop control plane that connects project management with the observable state of software development.

The application should answer:

- What is being worked on?
- Which agent/harness is working?
- Which repository and branch are involved?
- Is the agent active, waiting, blocked, testing, or finished?
- What files changed?
- Did tests/builds pass?
- Is the work ready for review?
- What evidence caused the system to move a task?

## Product principle

> Observe first. Infer second. Automate third.

The system should never pretend to know more than its evidence supports.

## Product characteristics

- Desktop-first
- Local-first
- Privacy-preserving
- Harness-agnostic
- Evidence-driven
- Event-oriented
- Explainable automation
- Extensible through adapters
- Offline-capable for core features
