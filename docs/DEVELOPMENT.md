# Development Guide

This guide covers everything you need to know to develop features for the Internal Developer Platform.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Project Conventions](#project-conventions)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.x+ | `node --version` |
| npm | 9.x+ | `npm --version` |
| Git | 2.x+ | `git --version` |

### IDE Setup (VS Code Recommended)

1. **Install VS Code**: [Download](https://code.visualstudio.com/)

2. **Install Required Extensions**:
   ```
   dbaeumer.vscode-eslint
   esbenp.prettier-vscode
   bradlc.vscode-tailwindcss
   pmneo.tsimporter
   ```

3. **Workspace Settings** (`.vscode/settings.json`):
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     },
     "typescript.preferences.importModuleSpecifier": "non-relative",
     "tailwindCSS.experimental.classRegex": [
       ["cn\\(([^)]*)\\)", "'([^']*)'"]
     ]
   }
   ```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/internal-developer-platform.git
cd internal-developer-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Development Workflow

### Daily Development Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Development Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Pull latest    2. Create branch   3. Make changes          │
│   ───────────────►  ───────────────►   ───────────────►        │
│   git pull          git checkout -b    (code, test)             │
│                     feature/xyz                                  │
│                                                                  │
│   6. PR Review      5. Push & PR       4. Commit                │
│   ◄───────────────  ◄───────────────   ◄───────────────        │
│   (team review)     git push           git commit               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Starting a New Feature

```bash
# 1. Ensure you're on main and up-to-date
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/IDP-123-add-cost-widget

# 3. Start development server
npm run dev

# 4. Make your changes...

# 5. Check for issues
npm run lint
npm run build

# 6. Commit with conventional commit format
git add .
git commit -m "feat(widgets): add cost trends widget

- Implement CostTrendsWidget component
- Add cost data hooks
- Update dashboard store"

# 7. Push to origin
git push -u origin feature/IDP-123-add-cost-widget

# 8. Create PR via GitHub
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for:
- React components
- CSS/Tailwind changes
- Most TypeScript changes

Changes are reflected immediately without losing application state.

## Project Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `SystemHealthWidget.tsx` |
| Hooks | camelCase with `use` prefix | `use-keyboard-shortcuts.ts` |
| Stores | kebab-case with `-store` suffix | `dashboard-store.ts` |
| Types | kebab-case | `persona.ts` |
| Utils | kebab-case | `utils.ts` |
| Pages | PascalCase | `Dashboard.tsx` |

### Directory Structure

```
src/components/
├── ui/                    # Design system primitives
│   ├── Button.tsx
│   ├── Button.test.tsx   # Co-located tests (if applicable)
│   └── index.ts          # Barrel export
│
├── widgets/              # Dashboard widgets
│   ├── SystemHealthWidget.tsx
│   └── index.ts
│
└── shell/                # Application shell
    ├── Layout.tsx
    └── index.ts
```

### Import Organization

```typescript
// 1. React/External libraries
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 2. Internal absolute imports (@/)
import { cn } from '@/lib/utils';
import { Button, Card } from '@/components/ui';
import { useUserStore } from '@/stores';
import type { Application } from '@/types';

// 3. Relative imports (same module)
import { WidgetHeader } from './WidgetHeader';
```

### Component Template

```tsx
// ComponentName.tsx

// Imports
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { SomeType } from '@/types';

// Types
interface ComponentNameProps {
  /** Description of prop */
  requiredProp: string;
  /** Description of optional prop */
  optionalProp?: number;
  /** Callback description */
  onAction?: (value: string) => void;
  /** Children elements */
  children?: React.ReactNode;
}

// Constants (if needed)
const DEFAULT_VALUE = 10;

// Component
export function ComponentName({
  requiredProp,
  optionalProp = DEFAULT_VALUE,
  onAction,
  children,
}: ComponentNameProps) {
  // State
  const [localState, setLocalState] = useState(false);
  
  // Callbacks
  const handleClick = useCallback(() => {
    setLocalState(true);
    onAction?.(requiredProp);
  }, [requiredProp, onAction]);
  
  // Render
  return (
    <div className={cn('base-class', localState && 'active-class')}>
      {children}
    </div>
  );
}

// Type export
export type { ComponentNameProps };
```

### Hook Template

```typescript
// use-feature-name.ts

import { useState, useEffect, useCallback } from 'react';

interface UseFeatureNameOptions {
  initialValue?: string;
  onComplete?: () => void;
}

interface UseFeatureNameReturn {
  value: string;
  isLoading: boolean;
  error: Error | null;
  setValue: (value: string) => void;
  reset: () => void;
}

export function useFeatureName(
  options: UseFeatureNameOptions = {}
): UseFeatureNameReturn {
  const { initialValue = '', onComplete } = options;
  
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);
  
  useEffect(() => {
    // Effect logic
  }, [value, onComplete]);
  
  return { value, isLoading, error, setValue, reset };
}
```

## Common Tasks

### Adding a New Page

1. **Create page component**:
   ```tsx
   // src/pages/NewFeature.tsx
   import { Card } from '@/components/ui';
   
   export function NewFeature() {
     return (
       <div className="space-y-6">
         <h1 className="text-2xl font-bold text-text-primary">
           New Feature
         </h1>
         <Card padding="lg">
           {/* Page content */}
         </Card>
       </div>
     );
   }
   ```

2. **Add route** in `App.tsx`:
   ```tsx
   import { NewFeature } from '@/pages/NewFeature';
   
   // In routes
   <Route path="new-feature" element={<NewFeature />} />
   ```

3. **Add navigation** in `Sidebar.tsx` (if needed).

### Adding a New Widget

1. **Create widget component**:
   ```tsx
   // src/components/widgets/NewWidget.tsx
   import { useQuery } from '@tanstack/react-query';
   import { Card, Skeleton } from '@/components/ui';
   
   export function NewWidget() {
     const { data, isLoading } = useQuery({
       queryKey: ['widget-data'],
       queryFn: fetchWidgetData,
     });
     
     if (isLoading) {
       return <Skeleton className="h-32" />;
     }
     
     return (
       <div className="space-y-4">
         {/* Widget content */}
       </div>
     );
   }
   ```

2. **Export from index**:
   ```typescript
   // src/components/widgets/index.ts
   export { NewWidget } from './NewWidget';
   ```

3. **Register in dashboard**:
   ```typescript
   // src/pages/Dashboard.tsx
   const widgetComponents = {
     // ...existing widgets
     'new-widget': NewWidget,
   };
   ```

4. **Add to available widgets**:
   ```typescript
   // src/data/mock-data.ts
   export const availableWidgets = [
     // ...existing
     {
       id: 'new-widget',
       title: 'New Widget',
       description: 'Description of the widget',
       category: 'monitoring',
       defaultSize: 'small',
     },
   ];
   ```

### Adding a New Store

```typescript
// src/stores/new-feature-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewFeatureState {
  items: Item[];
  selectedId: string | null;
  
  // Actions
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
}

export const useNewFeatureStore = create<NewFeatureState>()(
  persist(
    (set) => ({
      items: [],
      selectedId: null,
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      
      selectItem: (id) => set({ selectedId: id }),
    }),
    {
      name: 'new-feature-storage', // localStorage key
    }
  )
);
```

### Adding Design Tokens

1. **Add CSS variable** in `src/styles/design-tokens.css`:
   ```css
   :root {
     --color-new-token: #value;
   }
   ```

2. **Add Tailwind config** in `tailwind.config.js`:
   ```javascript
   colors: {
     'new-token': 'var(--color-new-token)',
   }
   ```

3. **Use in components**:
   ```tsx
   <div className="text-new-token bg-new-token/10" />
   ```

## Debugging

### React DevTools

1. Install [React DevTools](https://react.dev/learn/react-developer-tools)
2. Inspect component hierarchy
3. View props and state
4. Profile render performance

### Zustand DevTools

```typescript
// Enable devtools in store
import { devtools } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({ /* ... */ }),
      { name: 'store-name' }
    ),
    { name: 'Store Name' }
  )
);
```

### React Query DevTools

```tsx
// Already configured in App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In development, devtools panel available at bottom of screen
```

### Console Debugging

```typescript
// Conditional logging
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Structured logging
console.group('API Request');
console.log('URL:', url);
console.log('Params:', params);
console.log('Response:', response);
console.groupEnd();
```

## Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### TypeScript errors after pulling changes

```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### HMR not working

```bash
# Restart dev server
# Press Ctrl+C then run again
npm run dev
```

#### Tailwind classes not applying

1. Check class name spelling
2. Ensure using design tokens (not arbitrary values)
3. Check `tailwind.config.js` content paths

#### State not persisting

1. Check localStorage in DevTools
2. Verify `persist` middleware is configured
3. Check storage key naming

### Performance Issues

```typescript
// Check for unnecessary re-renders
import { useEffect, useRef } from 'react';

function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} render count:`, renderCount.current);
  });
}

// Use in component
function MyComponent() {
  useRenderCount('MyComponent');
  // ...
}
```

### Getting Help

1. **Check existing documentation** in `/docs`
2. **Search GitHub issues** for similar problems
3. **Ask in Slack** #idp-support channel
4. **Create an issue** with reproduction steps

---

For more detailed information, see:
- [Architecture](ARCHITECTURE.md) - System design
- [Components](COMPONENTS.md) - Component documentation
- [Design System](DESIGN-SYSTEM.md) - Styling guidelines
