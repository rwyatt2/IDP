# ADR-002: Zustand for State Management

## Status

Accepted

## Date

2024-01-15

## Context

We need a state management solution for the IDP that handles:

- Global UI state (navigation, modals, themes)
- User preferences (dashboard configuration)
- Cached application state
- Cross-component communication

### Options Considered

1. **Redux + Redux Toolkit** - Industry standard, verbose
2. **Zustand** - Lightweight, simple API
3. **Jotai** - Atomic state model
4. **Recoil** - Facebook's atomic solution
5. **MobX** - Observable-based
6. **React Context** - Built-in, no external dependency

### Evaluation Criteria

| Criteria | Redux | Zustand | Jotai | Context |
|----------|-------|---------|-------|---------|
| Bundle size | Large | Small | Small | None |
| Learning curve | High | Low | Medium | Low |
| Boilerplate | High | Low | Low | Medium |
| DevTools | Excellent | Good | Good | Basic |
| TypeScript | Good | Excellent | Excellent | Good |
| Persistence | Plugin | Plugin | Plugin | Manual |

## Decision

We will use **Zustand** for global state management, combined with **TanStack Query** for server state.

### Reasoning

1. **Simplicity**
   - Minimal boilerplate
   - Intuitive hook-based API
   - Easy to understand and teach

2. **Size**
   - ~1KB gzipped
   - No impact on bundle size

3. **TypeScript Support**
   - First-class TypeScript support
   - Type inference works well

4. **Flexibility**
   - Works with or without React
   - Easy to add middleware (persist, devtools)
   - Can be used alongside other solutions

5. **Server State Separation**
   - TanStack Query handles API data
   - Zustand handles UI/client state
   - Clear separation of concerns

## Implementation

### Store Structure

```typescript
// User preferences store
const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settings-storage' }
  )
);

// UI state store
const useNavigationStore = create<NavigationState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
```

### When to Use What

| State Type | Solution |
|------------|----------|
| Server data (APIs) | TanStack Query |
| User preferences | Zustand + persist |
| UI state (modals, tabs) | Zustand |
| Form state | React useState |
| URL state | React Router |

## Consequences

### Positive

- Simple, readable code
- Small bundle impact
- Fast developer onboarding
- Works well with TypeScript
- Easy testing

### Negative

- Less structured than Redux (requires discipline)
- Smaller ecosystem than Redux
- DevTools less powerful than Redux DevTools
- No built-in action logging

### Mitigations

- Establish store organization patterns
- Document store conventions
- Use DevTools middleware for debugging
- Create store templates

## References

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
