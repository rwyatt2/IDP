# Contributing to the Internal Developer Platform

Thank you for your interest in contributing to the IDP! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or derogatory comments
- Personal or political attacks
- Publishing others' private information without consent
- Other conduct that could reasonably be considered inappropriate

## Getting Started

### Prerequisites

1. **Node.js 18.x or higher** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **VS Code** (recommended) with extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Importer

### Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/internal-developer-platform.git
cd internal-developer-platform

# 3. Add upstream remote
git remote add upstream https://github.com/your-org/internal-developer-platform.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

### Project Structure Overview

```
src/
├── components/     # Reusable React components
│   ├── ui/        # Base UI components (Button, Card, etc.)
│   ├── widgets/   # Dashboard widgets
│   └── shell/     # Layout components
├── pages/         # Route page components
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── types/         # TypeScript type definitions
├── lib/           # Utility functions
└── data/          # Mock data and constants
```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<ticket-id>-<short-description>
```

**Types:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

**Examples:**
```
feature/IDP-123-add-cost-dashboard
fix/IDP-456-widget-drag-drop
refactor/IDP-789-extract-hooks
docs/IDP-101-api-documentation
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(dashboard): add cost trends widget

- Implement CostTrendsWidget component
- Add cost data to mock-data.ts
- Integrate with dashboard grid

Closes #123
```

```
fix(widgets): resolve drag-drop flickering on Safari

The issue was caused by missing transform origin.
Added explicit transform-origin: center property.

Fixes #456
```

### Development Process

1. **Create a branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/IDP-123-your-feature
   ```

2. **Make changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint          # Check for linting errors
   npm run build         # Ensure build succeeds
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/IDP-123-your-feature
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit types for function parameters and returns
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ DO: Use interfaces for object shapes
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ✅ DO: Use type unions for limited options
type Status = 'pending' | 'active' | 'completed' | 'failed';

// ❌ DON'T: Use `any` type
function processData(data: any) { } // Bad

// ✅ DO: Use `unknown` and narrow types
function processData(data: unknown) {
  if (isValidData(data)) {
    // Now TypeScript knows the type
  }
}
```

### React Component Guidelines

```tsx
// ✅ DO: Use functional components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ✅ DO: Export component and its types
export type { ButtonProps };
```

### File Organization

```typescript
// Component file structure
// 1. Imports (external, then internal)
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import type { Application } from '@/types';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants
const DEFAULT_PAGE_SIZE = 10;

// 4. Helper functions (if small, otherwise separate file)
function formatDate(date: Date): string {
  // ...
}

// 5. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState();
  
  // Callbacks/handlers
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // Effects (if needed)
  
  // Render
  return (
    // ...
  );
}
```

### Styling Guidelines

```tsx
// ✅ DO: Use design tokens
<div className="bg-surface text-text-primary border-border-subtle" />

// ❌ DON'T: Use arbitrary values
<div className="bg-[#1a1a2e] text-[#ffffff]" />

// ✅ DO: Use semantic color names
<span className="text-success">Healthy</span>
<span className="text-error">Failed</span>
<span className="text-warning">Degraded</span>

// ✅ DO: Use the cn() utility for conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes'
)} />
```

### Accessibility Requirements

All components must meet WCAG 2.1 AA standards:

```tsx
// ✅ DO: Include proper ARIA attributes
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={onClose}
>
  <X className="w-4 h-4" />
</button>

// ✅ DO: Support keyboard navigation
<div
  role="listbox"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  aria-activedescendant={activeId}
>

// ✅ DO: Provide focus indicators
// (Already handled by design system focus styles)

// ✅ DO: Ensure sufficient color contrast
// (Use design tokens which meet contrast requirements)
```

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] All existing tests pass
- [ ] New code has appropriate test coverage
- [ ] Documentation is updated (if needed)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Commits follow conventional commit format

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged
```

### Review Process

1. **Automated checks** must pass (lint, build)
2. **At least one approval** from a code owner
3. **All comments** must be addressed
4. **Squash and merge** into main

## Issue Guidelines

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS)
- Screenshots/videos if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case / problem it solves
- Proposed solution (if any)
- Alternative solutions considered

### Questions

For questions, please use:
- GitHub Discussions for general questions
- Slack #idp-support for urgent issues

---

Thank you for contributing to the Internal Developer Platform!
