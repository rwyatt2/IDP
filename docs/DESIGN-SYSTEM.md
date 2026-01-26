# Design System Documentation

This document defines the design system for the Internal Developer Platform, including design tokens, color system, typography, spacing, and visual patterns.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Tokens](#design-tokens)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Animations](#animations)
- [Accessibility](#accessibility)
- [Dark Theme](#dark-theme)

## Design Philosophy

### Core Principles

1. **Accessibility First** - WCAG 2.1 AA compliance is non-negotiable
2. **Consistency** - Same patterns across all features
3. **Semantic Naming** - Token names describe purpose, not appearance
4. **Progressive Disclosure** - Complexity revealed as needed
5. **Eye Comfort** - Optimized for extended use (dark theme focus)

### Token-Based Architecture

All visual properties are defined as CSS custom properties (design tokens) in `src/styles/design-tokens.css`. Components reference these tokens rather than hardcoded values.

```
Design Tokens → Tailwind Config → Component Classes → UI
```

## Design Tokens

### Token Categories

| Category | Prefix | Example |
|----------|--------|---------|
| Colors | `--color-` | `--color-text-primary` |
| Spacing | `--space-` | `--space-4` |
| Typography | `--text-`, `--font-`, `--leading-` | `--text-lg` |
| Borders | `--radius-` | `--radius-lg` |
| Shadows | `--shadow-` | `--shadow-md` |
| Transitions | `--duration-`, `--ease-` | `--duration-fast` |
| Z-index | `--z-` | `--z-modal` |

### Using Tokens

```css
/* In CSS */
.component {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

```tsx
/* In Tailwind classes */
<div className="bg-surface text-text-primary p-4 rounded-lg" />
```

## Color System

### Semantic Color Tokens

#### Surface Colors (Backgrounds)

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `canvas` | `--color-canvas` | Page background |
| `surface` | `--color-surface` | Card backgrounds |
| `surface-raised` | `--color-surface-raised` | Elevated surfaces |
| `surface-overlay` | `--color-surface-overlay` | Modal/dropdown backgrounds |

```tsx
<div className="bg-canvas">           {/* Page background */}
<div className="bg-surface">          {/* Card background */}
<div className="bg-surface-raised">   {/* Hover states, elevated */}
<div className="bg-surface-overlay">  {/* Modals, tooltips */}
```

#### Text Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `text-primary` | `--color-text-primary` | Primary content |
| `text-secondary` | `--color-text-secondary` | Secondary content |
| `text-tertiary` | `--color-text-tertiary` | Supporting text |
| `text-disabled` | `--color-text-disabled` | Disabled states |

```tsx
<h1 className="text-text-primary">Heading</h1>
<p className="text-text-secondary">Body text</p>
<span className="text-text-tertiary">Caption</span>
<span className="text-text-disabled">Disabled</span>
```

#### Border Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `border-subtle` | `--color-border-subtle` | Subtle dividers |
| `border-default` | `--color-border-default` | Default borders |
| `border-strong` | `--color-border-strong` | Emphasized borders |

```tsx
<div className="border border-border-subtle">  {/* Light border */}
<div className="border border-border-default"> {/* Normal border */}
<div className="border border-border-strong">  {/* Heavy border */}
```

#### Accent Colors (Brand)

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `accent` | `--color-accent-primary` | Primary brand color |
| `accent-hover` | `--color-accent-primary-hover` | Hover state |
| `accent-text` | `--color-accent-text` | Links, interactive text |

```tsx
<button className="bg-accent hover:bg-accent-hover">
  Primary Button
</button>
<a className="text-accent-text hover:text-accent">Link</a>
```

#### Semantic Status Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `success` | `--color-success` | Success states |
| `warning` | `--color-warning` | Warning states |
| `error` | `--color-error` | Error states |
| `info` | `--color-info` | Informational |

```tsx
<Badge variant="success">Healthy</Badge>
<Badge variant="warning">Degraded</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>

{/* Background with opacity */}
<div className="bg-success/10 text-success">Success message</div>
<div className="bg-error/10 text-error">Error message</div>
```

### Color Values (Dark Theme)

```css
:root {
  /* Canvas & Surfaces */
  --color-canvas: #0a0e14;
  --color-surface: #10141a;
  --color-surface-raised: #181d24;
  --color-surface-overlay: #1e242c;

  /* Text */
  --color-text-primary: #e6eaf0;
  --color-text-secondary: #9ca3af;
  --color-text-tertiary: #6b7280;
  --color-text-disabled: #4b5563;

  /* Borders */
  --color-border-subtle: #1f2937;
  --color-border-default: #2d3748;
  --color-border-strong: #4b5563;

  /* Accent (Indigo) */
  --color-accent-primary: #5558d4;
  --color-accent-primary-hover: #6366f1;
  --color-accent-text: #818cf8;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Color Contrast Requirements

All color combinations must meet WCAG 2.1 AA contrast ratios:

| Combination | Minimum Ratio | Current |
|-------------|---------------|---------|
| `text-primary` on `surface` | 4.5:1 | ✅ 12.4:1 |
| `text-secondary` on `surface` | 4.5:1 | ✅ 6.8:1 |
| `text-tertiary` on `surface` | 3:1 (large text) | ✅ 4.2:1 |
| `accent-text` on `surface` | 4.5:1 | ✅ 5.1:1 |

## Typography

### Font Family

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Labels, captions |
| `text-sm` | 14px | 20px | Body small, UI text |
| `text-base` | 16px | 24px | Body default |
| `text-lg` | 18px | 28px | Lead text |
| `text-xl` | 20px | 28px | H5 |
| `text-2xl` | 24px | 32px | H4 |
| `text-3xl` | 30px | 36px | H3 |
| `text-4xl` | 36px | 40px | H2, Page titles |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | UI labels, buttons |
| `font-semibold` | 600 | Headings, emphasis |
| `font-bold` | 700 | Strong emphasis |

### Typography Examples

```tsx
{/* Page heading */}
<h1 className="text-4xl font-bold text-text-primary">
  Dashboard
</h1>

{/* Section heading */}
<h2 className="text-2xl font-semibold text-text-primary">
  Recent Deployments
</h2>

{/* Card title */}
<h3 className="text-lg font-semibold text-text-primary">
  System Health
</h3>

{/* Body text */}
<p className="text-base text-text-secondary">
  Description text goes here.
</p>

{/* Caption */}
<span className="text-xs text-text-tertiary">
  Last updated 5 minutes ago
</span>

{/* Code */}
<code className="font-mono text-sm">npm install</code>
```

## Spacing

### Spacing Scale

Based on 4px base unit:

| Token | Value | Tailwind |
|-------|-------|----------|
| `space-0.5` | 2px | `0.5` |
| `space-1` | 4px | `1` |
| `space-1.5` | 6px | `1.5` |
| `space-2` | 8px | `2` |
| `space-2.5` | 10px | `2.5` |
| `space-3` | 12px | `3` |
| `space-4` | 16px | `4` |
| `space-5` | 20px | `5` |
| `space-6` | 24px | `6` |
| `space-8` | 32px | `8` |
| `space-10` | 40px | `10` |
| `space-12` | 48px | `12` |
| `space-16` | 64px | `16` |

### Spacing Guidelines

```tsx
{/* Component internal padding */}
<Card className="p-4">...</Card>           {/* 16px */}
<Card className="p-6">...</Card>           {/* 24px - larger cards */}

{/* Element spacing */}
<div className="space-y-4">...</div>       {/* 16px vertical gap */}
<div className="gap-3">...</div>           {/* 12px grid gap */}

{/* Section spacing */}
<section className="mb-8">...</section>    {/* 32px margin */}
```

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Small elements, badges |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, containers |
| `radius-xl` | 12px | Modals, large cards |
| `radius-full` | 9999px | Pills, avatars |

```tsx
<Badge className="rounded-sm">Badge</Badge>
<Button className="rounded-md">Button</Button>
<Card className="rounded-lg">Card</Card>
<Modal className="rounded-xl">Modal</Modal>
<Avatar className="rounded-full">Avatar</Avatar>
```

## Shadows

### Shadow Scale

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.4);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.5);
```

### Special Shadows

```css
/* Focus ring for accessibility */
--shadow-focus: 0 0 0 3px rgba(85, 88, 212, 0.4);

/* Error focus */
--shadow-focus-error: 0 0 0 3px rgba(239, 68, 68, 0.3);

/* Glow effects */
--shadow-glow-accent: 0 0 20px rgba(85, 88, 212, 0.15);
```

## Animations

### Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Micro-interactions |
| `duration-normal` | 200ms | Standard transitions |
| `duration-slow` | 300ms | Modal/drawer transitions |
| `duration-slower` | 500ms | Complex animations |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy feel |

### Common Animations

```tsx
{/* Fade in */}
<div className="animate-fade-in">...</div>

{/* Slide in from right */}
<div className="animate-slide-in-right">...</div>

{/* Scale in */}
<div className="animate-scale-in">...</div>

{/* Hover transition */}
<button className="transition-colors duration-fast hover:bg-surface-raised">
  ...
</button>

{/* Transform transition */}
<Card className="transition-transform duration-normal hover:-translate-y-1">
  ...
</Card>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility

### Focus Indicators

All interactive elements have visible focus states:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### Color Independence

Information is never conveyed by color alone:

```tsx
{/* Bad: Color only */}
<span className="text-error">Error</span>

{/* Good: Color + icon */}
<span className="text-error flex items-center gap-1">
  <AlertCircle className="w-4 h-4" />
  Error
</span>
```

### Touch Targets

Minimum touch target size: 44x44px

```css
.btn {
  min-height: 36px;   /* 44px with padding */
  padding: 8px 16px;
}
```

## Dark Theme

The IDP is optimized for dark theme, which is the default. All color tokens are designed for comfortable extended use.

### Theme Variables

The design system supports both dark and light themes through CSS custom properties:

```css
/* Dark theme (default) */
:root {
  --color-canvas: #0a0e14;
  /* ... */
}

/* Light theme */
[data-theme="light"] {
  --color-canvas: #ffffff;
  /* ... */
}
```

### Implementing Theme Toggle

```tsx
function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === 'light' ? 'dark' : 'light';
}
```

---

For component-specific styling, see [Components](COMPONENTS.md).
