# Developer Handoff Guide

This guide provides everything a developer needs to integrate the backend API and deploy this Internal Developer Platform to production.

## Table of Contents

- [Current State](#current-state)
- [API Specification Required](#api-specification-required)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [Data Models](#data-models)
- [Integration Points to Replace](#integration-points-to-replace)
- [Real-time Updates](#real-time-updates)
- [Deployment Checklist](#deployment-checklist)
- [Testing Requirements](#testing-requirements)
- [Performance Requirements](#performance-requirements)
- [Security Requirements](#security-requirements)
- [Monitoring & Observability](#monitoring--observability)
- [Documentation to Provide](#documentation-to-provide)
- [Handoff Checklist](#handoff-checklist)
- [Quick Start for Developer](#quick-start-for-developer)
- [Critical Integration Points](#critical-integration-points)

## Current State

✅ **What's Complete:**
- Frontend prototype is complete and fully functional
- All data is mocked in `src/data/mock-data.ts`
- API hooks in `src/hooks/use-api.ts` simulate network calls with delays
- All TypeScript types are defined in `src/types/index.ts`
- Design system is fully implemented
- All UI components are built and accessible

❌ **What Needs to Be Built:**
- Backend API server
- Database schema and migrations
- Authentication system
- Real API endpoints
- WebSocket/SSE for real-time updates
- File upload handling
- Production deployment infrastructure

## API Specification Required

Create an API specification document (`docs/API_SPECIFICATION.md`) with the following endpoints:

### Authentication Endpoints

```
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
GET    /api/auth/me             # Get current user
POST   /api/auth/refresh        # Refresh authentication token
```

### Application Endpoints

```
GET    /api/applications                    # List all applications
GET    /api/applications/:id                # Get application details
GET    /api/applications/owned              # Get user's applications
GET    /api/applications/team/:teamId       # Get team's applications
POST   /api/applications                    # Create application
PUT    /api/applications/:id                # Update application
DELETE /api/applications/:id                # Delete application
```

### Deployment Endpoints

```
GET    /api/deployments                     # List deployments
GET    /api/deployments/:id                 # Get deployment details
GET    /api/deployments/recent              # Recent deployments
GET    /api/deployments/application/:id     # Deployments for application
POST   /api/deployments                     # Create deployment
POST   /api/deployments/:id/approve         # Approve deployment
POST   /api/deployments/:id/rollback        # Rollback deployment
```

### Incident Endpoints

```
GET    /api/incidents                       # List incidents
GET    /api/incidents/:id                   # Get incident details
GET    /api/incidents/active                # Active incidents
POST   /api/incidents                       # Create incident
PUT    /api/incidents/:id                   # Update incident
POST   /api/incidents/:id/resolve           # Resolve incident
```

### Cost Endpoints

```
GET    /api/costs                           # Cost data
GET    /api/costs/application/:id           # Costs for application
GET    /api/costs/total                     # Total cost summary
GET    /api/costs/trends                    # Cost trends over time
```

### Search Endpoint

```
GET    /api/search?q=:query                 # Global search
```

### Extension Endpoints

```
GET    /api/extensions                      # List extensions
GET    /api/extensions/:id                  # Get extension details
POST   /api/extensions/:id/install         # Install extension
DELETE /api/extensions/:id                  # Uninstall extension
```

### User & Team Endpoints

```
GET    /api/users/me                        # Current user
PUT    /api/users/me/preferences            # Update preferences
GET    /api/teams                           # List teams
GET    /api/teams/:id                       # Get team details
```

## Environment Variables

Create `.env.example` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000

# Environment
VITE_ENVIRONMENT=development

# Feature Flags
VITE_FEATURE_NEW_DASHBOARD=false
VITE_FEATURE_BETA_ANALYTICS=false

# Analytics (optional)
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# Authentication
VITE_AUTH_PROVIDER=oauth  # or 'basic', 'saml'
VITE_AUTH_DOMAIN=
```

**Note:** All environment variables in Vite must be prefixed with `VITE_` to be accessible in the frontend.

## Authentication & Authorization

### Requirements

- **JWT-based authentication** (or OAuth 2.0)
- **Token refresh mechanism** to keep users logged in
- **Role-based access control (RBAC)** - Different permissions for Developer, Tech Lead, Manager, Executive
- **Permission system** - See `User.permissions` in types

### Implementation Steps

1. **Create API Client** (`src/lib/api-client.ts`):
   - Axios instance with interceptors
   - Add Authorization header automatically
   - Handle token refresh
   - Handle 401/403 errors (redirect to login)

2. **Update API Hooks** (`src/hooks/use-api.ts`):
   - Replace mock data with actual API calls
   - Use the API client
   - Handle loading/error states properly

3. **Authentication Flow**:
   - User logs in → Backend returns JWT token
   - Store token in localStorage or httpOnly cookie
   - Include token in all API requests
   - Refresh token before expiration
   - Handle token expiration gracefully

## Data Models

All TypeScript interfaces are defined in `src/types/index.ts`. The backend should match these exactly:

- **User** - User profile, preferences, permissions
- **Application** - Service/application metadata
- **Deployment** - Deployment records
- **Incident** - Incident management
- **CostData** - Cost tracking
- **Extension** - Extension marketplace
- **Team** - Team information
- **Activity** - Activity feed
- **Notification** - User notifications

See `src/types/index.ts` for complete type definitions.

## Integration Points to Replace

### File: `src/hooks/use-api.ts`

Replace all mock implementations with real API calls:

- `useApplications()` → `GET /api/applications`
- `useApplication(id)` → `GET /api/applications/:id`
- `useDeployment(id)` → `GET /api/deployments/:id`
- `useIncidents()` → `GET /api/incidents`
- `useCostData()` → `GET /api/costs`
- All mutations → POST/PUT/DELETE endpoints

### File: `src/data/mock-data.ts`

- **Keep for development/testing** - Useful for local development
- **Remove from production builds** - Not needed in production
- **Use as seed data** - Can be used to populate backend database

## Real-time Updates

### Consider WebSocket/SSE for:

- **Deployment status updates** - Real-time deployment progress
- **Incident updates** - New incidents, status changes
- **System health metrics** - Live health data
- **Notifications** - Real-time notifications

### Implementation Example

```typescript
// src/hooks/use-websocket.ts
// Subscribe to deployment updates
// Subscribe to incident updates
// Handle reconnection logic
```

## Deployment Checklist

### Pre-Deployment

- [ ] API endpoints implemented and tested
- [ ] Authentication working end-to-end
- [ ] Environment variables configured
- [ ] CORS configured on backend
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Error boundaries in place
- [ ] All mock data replaced with API calls

### Build Configuration

- [ ] Update `vite.config.ts` with production API URL
- [ ] Configure build optimizations
- [ ] Set up source maps (for debugging)
- [ ] Configure asset hashing

### Deployment Options

**Option 1: Static Hosting** (Recommended for SPA)
- Vercel, Netlify, AWS S3 + CloudFront
- Requires SPA routing support (all routes → `index.html`)
- HTTPS enabled
- Security headers configured

**Option 2: Container Deployment**
- Docker + Kubernetes
- Nginx configuration for SPA routing
- Health check endpoints

**Required for All Options:**
- SPA routing support (all routes serve `index.html`)
- HTTPS enabled
- Security headers configured
- CORS properly configured

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## Testing Requirements

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### Integration Tests
- API client
- Authentication flow
- Data fetching

### E2E Tests
- Critical user flows
- Persona tours
- Dashboard interactions

See [Testing Guide](TESTING.md) for details.

## Performance Requirements

- **Initial load:** < 2 seconds
- **Time to Interactive (TTI):** < 3 seconds
- **API response time:** < 500ms (p95)
- **Bundle size:** < 500KB gzipped

## Security Requirements

- **HTTPS only** - All traffic encrypted
- **Secure cookie handling** - httpOnly, secure flags
- **XSS protection** - Input sanitization, React's built-in protections
- **CSRF protection** - Tokens/headers
- **Content Security Policy (CSP)** - Restrict resource loading
- **Input validation** - Validate all user input
- **Rate limiting** - Prevent API abuse

See [Security Guide](SECURITY.md) for details.

## Monitoring & Observability

### Required Tools

- **Error tracking** - Sentry or similar
- **Performance monitoring** - DataDog, New Relic, or similar
- **User analytics** - Google Analytics, Mixpanel, or similar
- **API monitoring** - Track API health, response times, errors

### Implementation

```typescript
// src/lib/monitoring.ts
// Initialize Sentry
// Track errors
// Track performance metrics
```

## Documentation to Provide

1. **API Specification** - OpenAPI/Swagger format
2. **Authentication Flow** - Diagram and explanation
3. **Data Model ERD** - Entity Relationship Diagram
4. **Deployment Architecture** - Diagram of infrastructure
5. **Environment Setup** - Step-by-step guide
6. **Development Workflow** - How to develop and test

## Handoff Checklist

### Designer Provides

- [x] Complete frontend codebase
- [x] Design system documentation
- [x] Component library
- [x] TypeScript type definitions
- [x] Mock data structure
- [ ] API specification (needs creation)
- [ ] User flows documentation
- [x] Accessibility requirements

### Developer Needs to Provide

- [ ] Backend API implementation
- [ ] Database schema
- [ ] Authentication system
- [ ] Deployment pipeline
- [ ] Testing suite
- [ ] Monitoring setup
- [ ] Documentation updates

## Quick Start for Developer

```bash
# 1. Clone and install
git clone <repo>
cd internal-developer-platform
npm install

# 2. Review mock data structure
# See: src/data/mock-data.ts

# 3. Review API hooks
# See: src/hooks/use-api.ts

# 4. Review types
# See: src/types/index.ts

# 5. Set up environment
cp .env.example .env
# Configure VITE_API_URL

# 6. Start development
npm run dev

# 7. Replace mock implementations
# Update src/hooks/use-api.ts with real API calls
```

## Critical Integration Points

### 1. Authentication
- **File:** `src/stores/user-store.ts`
- **What:** User authentication state
- **Needs:** Backend auth endpoints, token management

### 2. API Calls
- **File:** `src/hooks/use-api.ts`
- **What:** All data fetching
- **Needs:** Replace mocks with real API calls

### 3. Real-time Updates
- **What:** Live updates for deployments, incidents
- **Needs:** WebSocket or SSE implementation

### 4. File Uploads
- **What:** Extension screenshots, user avatars
- **Needs:** File upload endpoints, storage solution

### 5. Search
- **What:** Global search functionality
- **Needs:** Search endpoint with proper indexing

### 6. Notifications
- **What:** Real-time notifications
- **Needs:** Notification system, WebSocket/SSE

---

## Additional Resources

- [Glossary](GLOSSARY.md) - Explanation of all acronyms and terms
- [Architecture Documentation](ARCHITECTURE.md) - System architecture
- [API Specification](API_SPECIFICATION.md) - Backend API requirements (to be created)
- [Deployment Guide](DEPLOYMENT.md) - Deployment procedures
- [Security Guide](SECURITY.md) - Security best practices

---

**Questions?** Refer to the [Glossary](GLOSSARY.md) for explanations of technical terms, or contact the design team for clarification on UI/UX requirements.
