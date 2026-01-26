# Testing Guide

This document outlines the testing strategy, tools, and best practices for the Internal Developer Platform.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Types](#test-types)
- [Testing Tools](#testing-tools)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## Testing Strategy

### Testing Pyramid

```
         ┌───────────────┐
         │    E2E        │  Few, expensive, slow
         │   Tests       │  Critical user journeys
         ├───────────────┤
         │  Integration  │  Medium, API + component
         │    Tests      │  integration points
         ├───────────────┤
         │               │
         │    Unit       │  Many, fast, isolated
         │    Tests      │  Components, hooks, utils
         │               │
         └───────────────┘
```

### Testing Priorities

| Priority | What to Test | Coverage Target |
|----------|--------------|-----------------|
| **High** | Utility functions | 100% |
| **High** | Custom hooks | 90%+ |
| **High** | Critical user flows | E2E coverage |
| **Medium** | UI components | 80%+ |
| **Medium** | Store logic | 80%+ |
| **Low** | Static pages | Smoke tests |

## Test Types

### Unit Tests

Test individual functions, hooks, and components in isolation.

```typescript
// Example: Testing a utility function
// src/lib/utils.test.ts

import { formatCurrency, formatRelativeTime, cn } from './utils';

describe('formatCurrency', () => {
  it('formats positive numbers with currency symbol', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large numbers with abbreviations', () => {
    expect(formatCurrency(1500000)).toBe('$1.5M');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
```

### Component Tests

Test React components with React Testing Library.

```typescript
// Example: Testing a Button component
// src/components/ui/Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });
});
```

### Hook Tests

Test custom hooks with `@testing-library/react-hooks`.

```typescript
// Example: Testing a custom hook
// src/hooks/use-keyboard-shortcuts.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { useKeyboardShortcuts } from './use-keyboard-shortcuts';

describe('useKeyboardShortcuts', () => {
  it('calls handler when shortcut is pressed', () => {
    const handler = jest.fn();
    
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [{ key: 'k', meta: true, handler }]
    }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
      }));
    });

    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler when different key is pressed', () => {
    const handler = jest.fn();
    
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [{ key: 'k', meta: true, handler }]
    }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'j',
        metaKey: true,
      }));
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
```

### Integration Tests

Test multiple components working together.

```typescript
// Example: Testing Dashboard with widgets
// src/pages/Dashboard.test.tsx

import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  it('renders welcome message with user name', async () => {
    render(<Dashboard />, { wrapper });
    
    expect(await screen.findByText(/Ready to ship/i)).toBeInTheDocument();
  });

  it('displays configured widgets', async () => {
    render(<Dashboard />, { wrapper });
    
    expect(await screen.findByText('System Health')).toBeInTheDocument();
    expect(await screen.findByText('Recent Deployments')).toBeInTheDocument();
  });

  it('allows adding new widgets', async () => {
    render(<Dashboard />, { wrapper });
    
    const addButton = screen.getByText('Add Widget');
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Widget Library')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

Test complete user journeys with Playwright.

```typescript
// Example: E2E test for deployment approval flow
// e2e/deployment-approval.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deployment Approval Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('tech lead can approve pending deployment', async ({ page }) => {
    // Navigate to pending approvals
    await page.click('text=Pending Approvals');
    
    // Find a pending deployment
    const deployment = page.locator('[data-testid="pending-deployment"]').first();
    await expect(deployment).toBeVisible();
    
    // Click approve button
    await deployment.locator('button:has-text("Approve")').click();
    
    // Verify success toast
    await expect(page.locator('text=Deployment Approved')).toBeVisible();
    
    // Verify deployment is no longer in pending
    await expect(deployment).not.toBeVisible();
  });

  test('deployment can be rejected with reason', async ({ page }) => {
    await page.click('text=Pending Approvals');
    
    const deployment = page.locator('[data-testid="pending-deployment"]').first();
    await deployment.locator('button:has-text("Reject")').click();
    
    // Fill rejection reason
    await page.fill('[data-testid="rejection-reason"]', 'Missing tests');
    await page.click('button:has-text("Confirm Rejection")');
    
    await expect(page.locator('text=Deployment Rejected')).toBeVisible();
  });
});
```

## Testing Tools

### Recommended Stack

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Vitest** | Unit/Integration testing | [vitest.dev](https://vitest.dev) |
| **React Testing Library** | Component testing | [testing-library.com](https://testing-library.com/docs/react-testing-library/intro/) |
| **Playwright** | E2E testing | [playwright.dev](https://playwright.dev) |
| **MSW** | API mocking | [mswjs.io](https://mswjs.io) |

### Setup (Future Implementation)

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D msw

# Add test scripts to package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

## Writing Tests

### Test File Location

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx    # Co-located test
├── hooks/
│   ├── use-api.ts
│   └── use-api.test.ts        # Co-located test
└── lib/
    ├── utils.ts
    └── utils.test.ts          # Co-located test

e2e/
├── dashboard.spec.ts          # E2E tests
└── deployment.spec.ts
```

### Test Naming Conventions

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Test implementation
    });
  });
});

// Examples:
describe('Button', () => {
  describe('when clicked', () => {
    it('should call onClick handler', () => {});
  });

  describe('when disabled', () => {
    it('should not call onClick handler', () => {});
    it('should have disabled attribute', () => {});
  });
});
```

### Testing Patterns

#### Arrange-Act-Assert (AAA)

```typescript
it('should update count when button is clicked', () => {
  // Arrange
  const { getByRole, getByText } = render(<Counter />);
  
  // Act
  fireEvent.click(getByRole('button', { name: 'Increment' }));
  
  // Assert
  expect(getByText('Count: 1')).toBeInTheDocument();
});
```

#### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should filter list when typing in search', async () => {
  const user = userEvent.setup();
  render(<SearchableList items={mockItems} />);
  
  await user.type(screen.getByRole('searchbox'), 'react');
  
  expect(screen.getByText('React Component')).toBeInTheDocument();
  expect(screen.queryByText('Vue Component')).not.toBeInTheDocument();
});
```

#### Testing Async Operations

```typescript
it('should load and display data', async () => {
  render(<DataLoader />);
  
  // Wait for loading to complete
  await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
  
  // Assert data is displayed
  expect(screen.getByText('Data Item 1')).toBeInTheDocument();
});
```

## Test Coverage

### Coverage Targets

| Category | Target | Rationale |
|----------|--------|-----------|
| Utilities | 100% | Pure functions, easy to test |
| Hooks | 90% | Critical logic encapsulation |
| Components | 80% | Balance coverage and effort |
| Stores | 80% | State management logic |
| Pages | 60% | Integration-level coverage |

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Continuous Integration

### CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run build
      
      - name: Unit tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build app
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
```

## Best Practices

### Do's

- ✅ Test behavior, not implementation
- ✅ Use meaningful test descriptions
- ✅ Keep tests independent
- ✅ Use data-testid for test selectors
- ✅ Mock external dependencies
- ✅ Test edge cases and error states
- ✅ Write tests before fixing bugs (TDD)

### Don'ts

- ❌ Test implementation details
- ❌ Test third-party libraries
- ❌ Write fragile tests dependent on DOM structure
- ❌ Ignore flaky tests
- ❌ Over-mock (test real integrations when possible)
- ❌ Write tests just for coverage metrics

### Test Readability

```typescript
// ❌ Bad: Unclear test
it('works', () => {
  const result = fn(1, 2);
  expect(result).toBe(3);
});

// ✅ Good: Clear intent
it('should add two numbers together', () => {
  const sum = add(1, 2);
  expect(sum).toBe(3);
});
```

### Test Independence

```typescript
// ❌ Bad: Tests depend on each other
let counter = 0;

it('increments counter', () => {
  counter++;
  expect(counter).toBe(1);
});

it('counter is still incremented', () => {
  expect(counter).toBe(1); // Fails if run in isolation
});

// ✅ Good: Each test is independent
it('increments counter', () => {
  const counter = new Counter();
  counter.increment();
  expect(counter.value).toBe(1);
});
```

---

For development setup, see [Development](DEVELOPMENT.md).
