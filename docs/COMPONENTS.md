# Component Library Documentation

This document provides comprehensive documentation for all UI components in the Internal Developer Platform.

## Table of Contents

- [Overview](#overview)
- [Base Components](#base-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Feedback Components](#feedback-components)
- [Widget Components](#widget-components)
- [Shell Components](#shell-components)
- [Usage Guidelines](#usage-guidelines)

## Overview

### Component Categories

| Category | Location | Purpose |
|----------|----------|---------|
| **Base Components** | `components/ui/` | Foundational UI elements |
| **Form Components** | `components/ui/` | Input and form controls |
| **Layout Components** | `components/ui/` | Structural containers |
| **Feedback Components** | `components/ui/` | User feedback elements |
| **Widget Components** | `components/widgets/` | Dashboard widgets |
| **Shell Components** | `components/shell/` | Application shell |

### Import Convention

```tsx
// Import from barrel file
import { Button, Card, Input, Badge } from '@/components/ui';

// Import widgets
import { SystemHealthWidget, CostTrendsWidget } from '@/components/widgets';
```

## Base Components

### Button

Interactive button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon={<Plus className="w-4 h-4" />}>
  Create
</Button>

// Loading state
<Button loading>Submitting...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `fullWidth` | `boolean` | `false` | Full width |
| `leftIcon` | `ReactNode` | - | Icon before text |
| `rightIcon` | `ReactNode` | - | Icon after text |

### Badge

Status indicators and labels.

```tsx
import { Badge } from '@/components/ui';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="accent">Accent</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>

// With icon
<Badge variant="success" icon={<Check className="w-3 h-3" />}>
  Completed
</Badge>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'accent'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |
| `icon` | `ReactNode` | - | Optional icon |

### Avatar

User or entity representation.

```tsx
import { Avatar } from '@/components/ui';

// With image
<Avatar src="/user.jpg" alt="John Doe" />

// With initials (fallback)
<Avatar name="John Doe" />

// Sizes
<Avatar name="JD" size="sm" />  // 24px
<Avatar name="JD" size="md" />  // 32px
<Avatar name="JD" size="lg" />  // 40px
<Avatar name="JD" size="xl" />  // 48px
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL |
| `alt` | `string` | - | Alt text |
| `name` | `string` | - | Name for initials |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |

## Form Components

### Input

Text input field with label and validation support.

```tsx
import { Input } from '@/components/ui';

// Basic usage
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With error
<Input
  label="Username"
  error="Username is required"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// With icon
<Input
  leftIcon={<Search className="w-4 h-4" />}
  placeholder="Search..."
/>

// Sizes
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text |
| `error` | `string` | - | Error message |
| `hint` | `string` | - | Help text |
| `leftIcon` | `ReactNode` | - | Icon on left |
| `rightIcon` | `ReactNode` | - | Icon on right |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `...rest` | `InputHTMLAttributes` | - | Native input props |

### Dropdown

Selection component with custom styling.

```tsx
import { Dropdown } from '@/components/ui';

<Dropdown
  trigger={<Button>Select Option</Button>}
  items={[
    { label: 'Option 1', onClick: () => handleSelect(1) },
    { label: 'Option 2', onClick: () => handleSelect(2) },
    { type: 'divider' },
    { label: 'Delete', onClick: handleDelete, variant: 'danger' },
  ]}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | - | Trigger element |
| `items` | `DropdownItem[]` | - | Menu items |
| `align` | `'left' \| 'right'` | `'left'` | Alignment |

## Layout Components

### Card

Container component for content grouping.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

// Basic card
<Card>
  <p>Card content</p>
</Card>

// With header and footer
<Card>
  <CardHeader
    title="Card Title"
    description="Optional description"
    action={<Button size="sm">Action</Button>}
  />
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Padding variants
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>

// Interactive card
<Card hover onClick={handleClick}>
  Clickable card
</Card>
```

**Card Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `hover` | `boolean` | `false` | Hover effect |
| `onClick` | `() => void` | - | Click handler |

### Modal

Dialog overlay for focused interactions.

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <h2>Modal Title</h2>
  </ModalHeader>
  <ModalBody>
    <p>Modal content</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>

// Size variants
<Modal size="sm">Small modal</Modal>
<Modal size="md">Medium modal (default)</Modal>
<Modal size="lg">Large modal</Modal>
<Modal size="xl">Extra large modal</Modal>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Open state |
| `onClose` | `() => void` | - | Close handler |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal size |

### Drawer

Slide-out panel for secondary content.

```tsx
import { Drawer } from '@/components/ui';

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Drawer Title"
  position="right"
>
  <p>Drawer content</p>
</Drawer>

// Position variants
<Drawer position="left">Left drawer</Drawer>
<Drawer position="right">Right drawer (default)</Drawer>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Open state |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Header title |
| `position` | `'left' \| 'right'` | `'right'` | Slide direction |

### Tabs

Tabbed content navigation.

```tsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
    <Tab value="tab3" disabled>Disabled</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="tab1">
      Content for tab 1
    </TabPanel>
    <TabPanel value="tab2">
      Content for tab 2
    </TabPanel>
  </TabPanels>
</Tabs>
```

## Feedback Components

### Toast

Notification messages.

```tsx
import { useToast } from '@/components/ui';

function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Success', 'Operation completed successfully');
  };
  
  const handleError = () => {
    toast.error('Error', 'Something went wrong');
  };
  
  const handleWarning = () => {
    toast.warning('Warning', 'Please review your input');
  };
  
  const handleInfo = () => {
    toast.info('Info', 'New update available');
  };
}
```

**Toast Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `success` | `(title, message?)` | Success notification |
| `error` | `(title, message?)` | Error notification |
| `warning` | `(title, message?)` | Warning notification |
| `info` | `(title, message?)` | Info notification |

### Skeleton

Loading placeholder.

```tsx
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/ui';

// Basic skeleton
<Skeleton className="h-4 w-32" />

// Variants
<Skeleton variant="text" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" height={100} />

// Preset components
<SkeletonCard />
<SkeletonList count={5} />
```

### Progress

Progress indicators.

```tsx
import { ProgressBar, CircularProgress } from '@/components/ui';

// Linear progress
<ProgressBar value={75} max={100} />
<ProgressBar value={75} variant="success" showLabel />

// Circular progress
<CircularProgress value={75} />
<CircularProgress value={75} size={80} showLabel />
```

### EmptyState

Placeholder for empty content.

```tsx
import { EmptyState } from '@/components/ui';

<EmptyState
  icon={<Inbox className="w-12 h-12" />}
  title="No applications"
  description="Get started by creating your first application."
  action={
    <Button onClick={handleCreate}>
      Create Application
    </Button>
  }
/>
```

### Tooltip

Contextual information on hover.

```tsx
import { Tooltip } from '@/components/ui';

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Positions
<Tooltip content="Top tooltip" position="top">...</Tooltip>
<Tooltip content="Bottom tooltip" position="bottom">...</Tooltip>
<Tooltip content="Left tooltip" position="left">...</Tooltip>
<Tooltip content="Right tooltip" position="right">...</Tooltip>
```

## Widget Components

### WidgetWrapper

HOC for dashboard widgets with drag-drop support.

```tsx
import { WidgetWrapper } from '@/components/widgets';

<WidgetWrapper
  instanceId="widget-1"
  title="System Health"
  size="medium"
>
  <SystemHealthWidget />
</WidgetWrapper>
```

### Available Widgets

| Widget | Description | Default Size |
|--------|-------------|--------------|
| `MyApplicationsWidget` | User's owned applications | small |
| `RecentDeploymentsWidget` | Latest deployments | medium |
| `SystemHealthWidget` | Overall system health | small |
| `OnCallWidget` | On-call status | small |
| `CostTrendsWidget` | Cost tracking | small |
| `PendingApprovalsWidget` | Pending approvals | small |
| `QuickActionsWidget` | Quick action buttons | medium |
| `RecentActivityWidget` | Activity feed | medium |
| `AlertsWidget` | Active alerts | small |
| `TeamOverviewWidget` | Team status (Tech Lead) | large |
| `TeamMetricsWidget` | Team metrics (Manager) | medium |
| `StrategicKPIsWidget` | KPIs (Executive) | large |

## Shell Components

### Layout

Root layout component.

```tsx
// Used automatically by React Router
<Route element={<Layout />}>
  <Route path="/" element={<Dashboard />} />
  {/* ... */}
</Route>
```

### Sidebar

Navigation sidebar.

```tsx
// Internal component - not typically used directly
// Configuration via navigation structure in component
```

### TopNav

Header navigation.

```tsx
// Internal component - not typically used directly
// Includes search, notifications, user menu
```

### GlobalSearch

Command-K search modal.

```tsx
// Triggered by ⌘K or search button
// Used internally by Layout
```

### CommandPalette

Quick actions palette.

```tsx
// Triggered by ⌘/ or command button
// Used internally by Layout
```

## Usage Guidelines

### Component Selection

| Need | Use |
|------|-----|
| Primary action | `<Button variant="primary">` |
| Secondary action | `<Button variant="secondary">` |
| Destructive action | `<Button variant="danger">` |
| Status indicator | `<Badge variant="...">` |
| Content container | `<Card>` |
| Form input | `<Input>` |
| Selection | `<Dropdown>` |
| Focused task | `<Modal>` |
| Secondary panel | `<Drawer>` |
| Notification | `useToast()` |
| Loading state | `<Skeleton>` |

### Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Color is not the only way to convey information
- [ ] Focus states are visible
- [ ] ARIA labels are provided where needed
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers

### Performance Tips

1. **Lazy load modals/drawers** when not immediately needed
2. **Memoize callbacks** passed to child components
3. **Use skeleton loaders** instead of spinners for better UX
4. **Avoid inline styles** - use Tailwind classes

---

For design tokens and theming, see [Design System](DESIGN-SYSTEM.md).
