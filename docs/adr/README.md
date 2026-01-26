# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Internal Developer Platform.

## What are ADRs?

ADRs are documents that capture important architectural decisions made along with their context and consequences. They serve as a historical record of why certain decisions were made.

## ADR Format

Each ADR follows this template:

```markdown
# ADR-XXX: Title

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?
```

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](001-react-typescript-stack.md) | React + TypeScript Stack | Accepted | 2024-01 |
| [002](002-zustand-state-management.md) | Zustand for State Management | Accepted | 2024-01 |
| [003](003-design-token-system.md) | Design Token System | Accepted | 2024-01 |
| [004](004-persona-based-architecture.md) | Persona-Based Architecture | Accepted | 2024-02 |

## Creating a New ADR

1. Copy the template from `000-template.md`
2. Name it with the next sequential number: `XXX-short-title.md`
3. Fill in the sections
4. Submit via PR for review
5. Update this README index

## Guidelines

- ADRs are immutable once accepted
- To change a decision, create a new ADR that supersedes the old one
- Keep ADRs focused on a single decision
- Include enough context for future readers
