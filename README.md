# Internal Developer Platform (IDP)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, accessible, and award-winning Internal Developer Platform that serves as a unified entry point for all developer tools and services. Built with modern React, TypeScript, and a robust design system.

> **Current Status:** This is a **frontend prototype** with mock data. Backend API integration is required for production deployment. See the [Developer Handoff Guide](docs/DEVELOPER_HANDOFF.md) for complete integration instructions.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Features](#features)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

The IDP is designed around the **Jobs-to-be-Done (JTBD)** framework, organizing capabilities by developer workflows rather than tool categories. It provides a federated shell system where various tools and extensions can plug in while maintaining a consistent user experience.

### Design Philosophy

- **Jobs-to-be-Done** over tool-centric thinking
- **Progressive Disclosure** of complexity
- **Accessibility First** (WCAG 2.1 AA compliant)
- **Persona-Aware** experiences (Developer, Tech Lead, Manager, Executive)
- **Performance Optimized** (&lt; 2s page loads)

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (or yarn 1.22+)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/internal-developer-platform.git
cd internal-developer-platform

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### For Developers: Backend Integration

If you're a developer integrating the backend API, start with:

1. **Read the [Developer Handoff Guide](docs/DEVELOPER_HANDOFF.md)** - Complete guide for backend integration
2. **Check the [Glossary](docs/GLOSSARY.md)** - Explanation of all technical terms and acronyms
3. **Review Type Definitions** - See `src/types/index.ts` for all data models
4. **Review API Hooks** - See `src/hooks/use-api.ts` for integration points

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        IDP Shell                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   TopNav    │  │  Sidebar    │  │     Main Content        │ │
│  │  (Search,   │  │ (Navigation │  │  (Page Routes +         │ │
│  │   Actions)  │  │  Phases)    │  │   Dashboard Widgets)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │ Discover │          │  Build  │          │ Deploy  │
   │  Phase   │          │  Phase  │          │  Phase  │
   └─────────┘          └─────────┘          └─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                        ┌────▼────┐
                        │ Manage  │
                        │  Phase  │
                        └─────────┘
```

### Project Structure

```
src/
├── components/           # React components
│   ├── dashboard/       # Dashboard-specific components
│   ├── dev-panel/       # Developer tools panel
│   ├── help/            # Help system components
│   ├── shell/           # Navigation, layout, search
│   ├── ui/              # Reusable UI component library
│   └── widgets/         # Dashboard widgets
├── data/                # Mock data and documentation data
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components (routes)
├── stores/              # Zustand state management
├── styles/              # Design tokens and global styles
└── types/               # TypeScript type definitions
```

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 | UI library with concurrent features |
| **Language** | TypeScript 5.3 | Type safety and developer experience |
| **Build Tool** | Vite 5 | Fast development and optimized builds |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **State** | Zustand 4.4 | Lightweight state management |
| **Server State** | TanStack Query 5 | Async state management |
| **Routing** | React Router 6 | Client-side routing |
| **DnD** | @dnd-kit | Drag and drop functionality |
| **Icons** | Lucide React | Consistent iconography |
| **Charts** | Recharts | Data visualization |

## Features

### Four-Phase Workflow Organization

1. **Discover** - Browse applications, search resources, view dependencies, API documentation
2. **Build** - Create applications, configure services, set up CI/CD pipelines
3. **Deploy** - Release management, deployment tracking, environment management
4. **Manage** - Monitor health, track costs, incident management, analytics

### Core Capabilities

- **Personalized Dashboard** - Drag-and-drop widget system with persona-aware defaults
- **Global Search** - Unified search across all platform resources (⌘K)
- **Command Palette** - Quick actions and navigation (⌘/)
- **Extension Marketplace** - Self-service extension discovery and installation
- **System Catalog** - Unified view of applications, services, and infrastructure
- **Knowledge Management** - Contextual help and documentation system
- **Guided Tours** - Persona-specific onboarding experiences

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open global search |
| `⌘/` | Open help center |
| `⌘B` | Toggle sidebar |
| `⌘⇧N` | Create new application |
| `⌘⇧P` | Open command palette |
| `Escape` | Close modals/drawers |

## Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System architecture and design decisions |
| [Development](docs/DEVELOPMENT.md) | Development setup and workflow guide |
| [Components](docs/COMPONENTS.md) | UI component library documentation |
| [Design System](docs/DESIGN-SYSTEM.md) | Design tokens, colors, typography |
| [Testing](docs/TESTING.md) | Testing strategy and guidelines |
| [Deployment](docs/DEPLOYMENT.md) | Build and deployment procedures |
| [Security](docs/SECURITY.md) | Security guidelines and best practices |
| [Developer Handoff](docs/DEVELOPER_HANDOFF.md) | **Complete guide for backend integration and production deployment** |
| [Glossary](docs/GLOSSARY.md) | **Explanation of all acronyms and technical terms** |
| [Contributing](CONTRIBUTING.md) | Contribution guidelines |

### Architecture Decision Records (ADRs)

Key architectural decisions are documented in `docs/adr/`:

- [ADR-001: React + TypeScript Stack](docs/adr/001-react-typescript-stack.md)
- [ADR-002: Zustand for State Management](docs/adr/002-zustand-state-management.md)
- [ADR-003: Design Token System](docs/adr/003-design-token-system.md)
- [ADR-004: Persona-Based Architecture](docs/adr/004-persona-based-architecture.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Pull request process
- Coding standards

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with care by Russell Wyatt**
