# Internal Developer Platform (IDP)

A high-fidelity React application serving as a unified entry point for all developer tools and services.

## Features

### Federated Shell System
- Consistent navigation, authentication, and user context
- Extension system where tools plug into the shell
- Widget marketplace for personalized dashboards
- Shared design system across all extensions

### Four-Phase Workflow Organization

1. **Discover** - Browse applications, search resources, view dependencies
2. **Build** - Create applications, configure services, set up pipelines
3. **Deploy** - Release management, deployment history, environment management
4. **Manage** - Monitor health, track costs, incident management

### Key Features

- **Personalized Dashboard** - Drag-and-drop widget system with real-time data
- **Global Search** - Search across all extensions with smart filtering
- **Extension Marketplace** - Self-service extension registration and discovery
- **System Catalog** - Unified view of applications, services, and infrastructure
- **Application Onboarding** - Multi-step wizard with cost estimation

## Tech Stack

- **React 18** + **TypeScript** - Modern React with full type safety
- **Vite** - Fast build tooling with HMR
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **@dnd-kit** - Drag and drop functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── dashboard/      # Dashboard-specific components
│   ├── shell/          # Navigation, layout, search
│   ├── ui/             # Reusable UI components
│   └── widgets/        # Dashboard widgets
├── data/
│   └── mock-data.ts    # Sample data for development
├── hooks/
│   ├── use-api.ts      # React Query hooks
│   └── use-keyboard-shortcuts.ts
├── lib/
│   └── utils.ts        # Utility functions
├── pages/              # Page components
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Design Principles

- **Jobs-to-be-done** over tool-centric thinking
- **Progressive disclosure** of complexity
- **Consistent visual language** across extensions
- **Mobile-responsive** for on-call scenarios
- **Accessibility** (WCAG 2.1 AA compliance)
- **Performance** (< 2s page loads)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `/` | Focus search |
| `⌘B` | Toggle sidebar |
| `⌘1-4` | Navigate phases |
| `⌘⇧N` | Create new application |

## License

MIT
