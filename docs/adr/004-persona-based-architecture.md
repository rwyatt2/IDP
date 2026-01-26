# ADR-004: Persona-Based Architecture

## Status

Accepted

## Date

2024-02-01

## Context

The IDP serves users with vastly different needs and responsibilities:

- **Developers** - Focus on shipping code, debugging, daily operations
- **Tech Leads** - Team coordination, code reviews, architectural decisions
- **Engineering Managers** - Resource allocation, metrics, cross-team visibility
- **Executives** - Strategic decisions, ROI, risk assessment

A one-size-fits-all interface would either overwhelm some users or underwhelm others.

### Options Considered

1. **Persona-Based Views** - Different default layouts per role
2. **Progressive Disclosure** - Same interface, reveal complexity gradually
3. **Separate Applications** - Different apps for different users
4. **Role-Based Dashboards Only** - Same features, different home pages

## Decision

We will implement a **Persona-Based Architecture** where:

1. Users can select their persona (Developer, Tech Lead, Manager, Executive)
2. The dashboard and navigation adapt to the selected persona
3. All features remain accessible, but organization differs
4. Default widgets and quick actions are persona-specific

### Implementation

```typescript
// Persona definition
interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  defaultWidgets: string[];
  quickActions: QuickAction[];
  highlightedFeatures: string[];
}

// Persona-aware hook
function usePersona() {
  const { personaType } = useUserStore();
  const persona = PERSONAS[personaType];
  
  return {
    persona,
    personaType,
    isLeadOrAbove: ['tech-lead', 'manager', 'executive'].includes(personaType),
    canApprove: ['tech-lead', 'manager'].includes(personaType),
  };
}

// Persona-aware component
function DashboardHeader() {
  const { persona, personaType } = usePersona();
  
  const welcomeMessages = {
    developer: 'Ready to ship?',
    'tech-lead': 'Team Status',
    manager: 'Organization Overview',
    executive: 'Executive Summary',
  };
  
  return <h1>{welcomeMessages[personaType]}</h1>;
}
```

### Jobs-to-be-Done Mapping

| Persona | Primary Jobs |
|---------|-------------|
| Developer | Ship code, debug issues, find docs |
| Tech Lead | Review PRs, approve deploys, monitor team |
| Manager | Track DORA metrics, manage costs, staffing |
| Executive | ROI reports, risk assessment, strategy |

## Consequences

### Positive

- **Reduced cognitive load** - Users see what matters to them
- **Faster task completion** - Quick access to relevant features
- **Better onboarding** - Guided experiences per role
- **Scalable UX** - Can add personas without redesigning

### Negative

- **Increased complexity** - Must maintain multiple views
- **Potential confusion** - Users might miss features
- **More testing** - Each persona path needs coverage
- **Content duplication** - Some widgets appear in multiple personas

### Mitigations

- Clear persona switcher in UI
- "All Features" navigation always available
- Guided tours explain persona differences
- Shared component library reduces duplication

## Persona Details

### Developer Persona

```typescript
const developerPersona: Persona = {
  id: 'developer',
  name: 'Developer',
  description: 'Build and deploy applications',
  defaultWidgets: [
    'my-applications',
    'recent-deployments', 
    'system-health',
    'quick-actions',
  ],
  quickActions: [
    { label: 'Create App', path: '/build/create' },
    { label: 'View Deployments', path: '/deploy/deployments' },
    { label: 'Search APIs', path: '/discover/api-docs' },
  ],
};
```

### Tech Lead Persona

```typescript
const techLeadPersona: Persona = {
  id: 'tech-lead',
  name: 'Tech Lead',
  description: 'Coordinate team and architecture',
  defaultWidgets: [
    'team-overview',
    'pending-approvals',
    'recent-deployments',
    'on-call-schedule',
  ],
  quickActions: [
    { label: 'Review Approvals', path: '/deploy/releases' },
    { label: 'Team Health', path: '/manage/observability' },
    { label: 'Dependencies', path: '/discover/dependencies' },
  ],
};
```

### Manager/Executive Personas

Similar structure with focus on metrics, costs, and strategic views.

## References

- [Jobs to be Done Framework](https://jtbd.info)
- [Persona-Based Design](https://www.nngroup.com/articles/persona/)
- [Internal Developer Platforms](https://internaldeveloperplatform.org)
