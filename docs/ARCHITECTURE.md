# Architecture Documentation

This document describes the architecture of the Internal Developer Platform (IDP), including design decisions, patterns, and system organization.

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [System Architecture](#system-architecture)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Considerations](#performance-considerations)

## Overview

The IDP is a single-page application (SPA) built with React that serves as a unified portal for developer tools and services. It follows a **federated shell architecture** where the core shell provides consistent navigation, authentication, and theming, while individual features (extensions) can be independently developed and deployed.

### Key Architectural Goals

1. **Modularity** - Components and features are loosely coupled
2. **Extensibility** - New tools can be added without modifying core code
3. **Performance** - Fast load times and responsive interactions
4. **Accessibility** - WCAG 2.1 AA compliance throughout
5. **Maintainability** - Clear patterns and comprehensive documentation

## Architecture Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                          │
│   (React Components, UI Library, Layouts)                       │
├─────────────────────────────────────────────────────────────────┤
│                      Application Layer                           │
│   (Hooks, State Management, Business Logic)                     │
├─────────────────────────────────────────────────────────────────┤
│                        Data Layer                                │
│   (API Clients, Data Transformations, Caching)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Component-Based Architecture

All UI elements are built as composable, reusable components:

- **Atomic Components** (`ui/`) - Basic building blocks (Button, Input, Card)
- **Composite Components** (`widgets/`, `shell/`) - Combinations of atomic components
- **Page Components** (`pages/`) - Full page layouts with routing

### 3. Unidirectional Data Flow

```
User Action → Event Handler → State Update → Re-render
```

## System Architecture

### High-Level Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                           Browser                                     │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                      IDP Shell (Layout)                         │  │
│  │  ┌──────────┐  ┌──────────────────────────────────────────┐   │  │
│  │  │  TopNav  │  │              Content Area                  │   │  │
│  │  │ ────────│  │  ┌──────────────────────────────────────┐ │   │  │
│  │  │ Search   │  │  │           Page Router               │ │   │  │
│  │  │ Actions  │  │  │  ┌─────────────────────────────────┐│ │   │  │
│  │  └──────────┘  │  │  │   Dashboard / Feature Pages    ││ │   │  │
│  │  ┌──────────┐  │  │  │   ┌──────┐ ┌──────┐ ┌──────┐  ││ │   │  │
│  │  │ Sidebar  │  │  │  │   │Widget│ │Widget│ │Widget│  ││ │   │  │
│  │  │ ────────│  │  │  │   └──────┘ └──────┘ └──────┘  ││ │   │  │
│  │  │ Phases   │  │  │  └─────────────────────────────────┘│ │   │  │
│  │  │ Nav      │  │  └──────────────────────────────────────┘ │   │  │
│  │  └──────────┘  └──────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │  Global Search  │  │ Command Palette │  │    Help Sidebar     │  │
│  │    (Modal)      │  │    (Modal)      │  │     (Drawer)        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Module Organization

```
src/
├── components/
│   ├── ui/                 # Design System Components
│   │   ├── Button.tsx     # Atomic: Single responsibility
│   │   ├── Card.tsx       # Atomic: Container component
│   │   ├── Input.tsx      # Atomic: Form control
│   │   └── index.ts       # Barrel export
│   │
│   ├── shell/             # Application Shell
│   │   ├── Layout.tsx     # Root layout with providers
│   │   ├── TopNav.tsx     # Header navigation
│   │   ├── Sidebar.tsx    # Side navigation
│   │   └── GlobalSearch.tsx
│   │
│   ├── widgets/           # Dashboard Widgets
│   │   ├── WidgetWrapper.tsx  # HOC for drag-drop
│   │   ├── SystemHealthWidget.tsx
│   │   └── CostTrendsWidget.tsx
│   │
│   └── help/              # Help System
│       ├── HelpSidebar.tsx
│       └── ContextualHelpTooltip.tsx
│
├── pages/                 # Route Components
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
│
├── stores/                # State Management
│   ├── user-store.ts
│   ├── dashboard-store.ts
│   └── settings-store.ts
│
├── hooks/                 # Custom Hooks
│   ├── use-api.ts
│   └── use-keyboard-shortcuts.ts
│
├── types/                 # TypeScript Definitions
│   ├── index.ts
│   └── persona.ts
│
└── lib/                   # Utilities
    └── utils.ts
```

## Component Architecture

### Component Hierarchy

```
App
└── QueryClientProvider (React Query)
    └── BrowserRouter (React Router)
        └── Routes
            └── Layout (Shell)
                ├── Sidebar (Navigation)
                ├── TopNav (Header)
                ├── Outlet (Page Content)
                │   └── Dashboard / Analytics / etc.
                ├── GlobalSearch (Modal)
                ├── CommandPalette (Modal)
                ├── HelpSidebar (Drawer)
                └── ToastContainer (Notifications)
```

### Component Categories

#### 1. UI Components (`components/ui/`)

Base design system components with no business logic:

```typescript
// Example: Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // Pure presentation logic
}
```

#### 2. Feature Components (`components/widgets/`, `components/help/`)

Business logic combined with presentation:

```typescript
// Example: Widget with data fetching
export function SystemHealthWidget() {
  const { data, isLoading } = useSystemHealth(); // Custom hook
  
  if (isLoading) return <WidgetSkeleton />;
  
  return (
    <Card>
      <CircularProgress value={data.healthPercentage} />
      {/* ... */}
    </Card>
  );
}
```

#### 3. Page Components (`pages/`)

Full page layouts with routing and data orchestration:

```typescript
// Example: Page component
export function Dashboard() {
  const { widgets } = useDashboardStore();
  const { persona } = usePersona();
  
  return (
    <div className="space-y-6">
      <DashboardHeader persona={persona} />
      <WidgetGrid widgets={widgets} />
    </div>
  );
}
```

## State Management

### State Categories

| Category | Tool | Example |
|----------|------|---------|
| **Server State** | TanStack Query | API data, cache |
| **Client State** | Zustand | UI state, preferences |
| **URL State** | React Router | Current route, params |
| **Form State** | React (local) | Input values, validation |

### Zustand Store Pattern

```typescript
// stores/dashboard-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  widgets: WidgetInstance[];
  addWidget: (widgetId: string) => void;
  removeWidget: (instanceId: string) => void;
  reorderWidgets: (fromId: string, toId: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      addWidget: (widgetId) => set((state) => ({
        widgets: [...state.widgets, createWidgetInstance(widgetId)]
      })),
      // ...
    }),
    { name: 'dashboard-storage' }
  )
);
```

### React Query Pattern

```typescript
// hooks/use-api.ts
export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

## Data Flow

### Request Flow

```
Component
    │
    ├── useQuery('applications')
    │       │
    │       ▼
    │   Query Cache (TanStack Query)
    │       │
    │       ├── Cache Hit? → Return cached data
    │       │
    │       └── Cache Miss? → fetchApplications()
    │                               │
    │                               ▼
    │                         API Response
    │                               │
    │                               ▼
    │                         Update Cache
    │                               │
    ▼                               ▼
Re-render with data ◄──────────────┘
```

### State Update Flow

```
User Interaction
    │
    ▼
Event Handler
    │
    ├── Local State? → useState setter → Re-render
    │
    ├── Global State? → Zustand action → Re-render
    │
    └── Server State? → useMutation → Cache invalidation → Re-render
```

## Design Patterns

### 1. Compound Components

Used for complex components with multiple sub-components:

```tsx
// Usage
<Card>
  <CardHeader title="System Health" action={<RefreshButton />} />
  <CardContent>
    <HealthMetrics />
  </CardContent>
  <CardFooter>
    <ViewDetailsLink />
  </CardFooter>
</Card>
```

### 2. Render Props / Children as Function

Used for flexible component composition:

```tsx
<DataLoader
  query={useApplications}
  loading={<ApplicationSkeleton />}
  error={(err) => <ErrorMessage error={err} />}
>
  {(data) => <ApplicationList applications={data} />}
</DataLoader>
```

### 3. Custom Hooks

Encapsulate reusable logic:

```typescript
// Encapsulates keyboard shortcut logic
function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

### 4. Higher-Order Components (HOC)

Used for cross-cutting concerns:

```tsx
// Widget wrapper adds drag-drop functionality
export function WidgetWrapper({ children, instanceId }) {
  const { attributes, listeners, setNodeRef } = useSortable({ id: instanceId });
  
  return (
    <div ref={setNodeRef} {...attributes}>
      <DragHandle {...listeners} />
      {children}
    </div>
  );
}
```

## Performance Considerations

### Code Splitting

```typescript
// Lazy load pages
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

// Route configuration
<Route path="/analytics" element={
  <Suspense fallback={<PageSkeleton />}>
    <Analytics />
  </Suspense>
} />
```

### Memoization

```typescript
// Memoize expensive computations
const sortedApplications = useMemo(
  () => applications.sort((a, b) => a.name.localeCompare(b.name)),
  [applications]
);

// Memoize callbacks
const handleSearch = useCallback(
  (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  },
  [debouncedSearch]
);

// Memoize components
const ApplicationCard = memo(function ApplicationCard({ app }) {
  return <Card>{/* ... */}</Card>;
});
```

### Bundle Optimization

- **Tree shaking** - ES modules enable dead code elimination
- **Dynamic imports** - Load features on demand
- **Asset optimization** - Vite handles image/font optimization
- **CSS purging** - Tailwind removes unused styles

---

For more details on specific patterns, see the [Components](COMPONENTS.md) and [Design System](DESIGN-SYSTEM.md) documentation.
