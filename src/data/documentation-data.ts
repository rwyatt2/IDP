import type {
  DocumentationArticle,
  ContextualHelp,
  FaqCategory,
  DocumentationCategory,
  Glossary,
  Runbook,
  LearningPath,
  Tutorial,
} from '@/types/documentation';

// ============================================================================
// Documentation Categories
// ============================================================================

export const documentationCategories: DocumentationCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics and get up and running quickly',
    icon: 'Rocket',
    slug: 'getting-started',
    articleCount: 8,
    subcategories: [
      { id: 'gs-overview', name: 'Platform Overview', slug: 'overview', articleCount: 2 },
      { id: 'gs-quickstart', name: 'Quick Start Guides', slug: 'quickstart', articleCount: 4 },
      { id: 'gs-concepts', name: 'Core Concepts', slug: 'concepts', articleCount: 2 },
    ],
  },
  {
    id: 'applications',
    name: 'Applications',
    description: 'Create, configure, and manage your applications',
    icon: 'Box',
    slug: 'applications',
    articleCount: 12,
    subcategories: [
      { id: 'app-create', name: 'Creating Applications', slug: 'create', articleCount: 3 },
      { id: 'app-config', name: 'Configuration', slug: 'configuration', articleCount: 4 },
      { id: 'app-templates', name: 'Templates & Scaffolding', slug: 'templates', articleCount: 3 },
      { id: 'app-lifecycle', name: 'Lifecycle Management', slug: 'lifecycle', articleCount: 2 },
    ],
  },
  {
    id: 'deployments',
    name: 'Deployments',
    description: 'Deploy, release, and manage your applications in production',
    icon: 'Upload',
    slug: 'deployments',
    articleCount: 15,
    subcategories: [
      { id: 'deploy-basics', name: 'Deployment Basics', slug: 'basics', articleCount: 4 },
      { id: 'deploy-pipelines', name: 'CI/CD Pipelines', slug: 'pipelines', articleCount: 4 },
      { id: 'deploy-strategies', name: 'Deployment Strategies', slug: 'strategies', articleCount: 4 },
      { id: 'deploy-rollbacks', name: 'Rollbacks & Recovery', slug: 'rollbacks', articleCount: 3 },
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Observability',
    description: 'Monitor, alert, and debug your applications',
    icon: 'Activity',
    slug: 'monitoring',
    articleCount: 10,
    subcategories: [
      { id: 'mon-metrics', name: 'Metrics & Dashboards', slug: 'metrics', articleCount: 3 },
      { id: 'mon-alerts', name: 'Alerting', slug: 'alerts', articleCount: 3 },
      { id: 'mon-logs', name: 'Logging', slug: 'logs', articleCount: 2 },
      { id: 'mon-tracing', name: 'Distributed Tracing', slug: 'tracing', articleCount: 2 },
    ],
  },
  {
    id: 'incidents',
    name: 'Incident Management',
    description: 'Respond to and resolve incidents effectively',
    icon: 'AlertTriangle',
    slug: 'incidents',
    articleCount: 8,
    subcategories: [
      { id: 'inc-response', name: 'Incident Response', slug: 'response', articleCount: 3 },
      { id: 'inc-oncall', name: 'On-Call Management', slug: 'oncall', articleCount: 2 },
      { id: 'inc-postmortem', name: 'Post-Mortems', slug: 'postmortem', articleCount: 3 },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security best practices and compliance',
    icon: 'Shield',
    slug: 'security',
    articleCount: 9,
    subcategories: [
      { id: 'sec-auth', name: 'Authentication & Authorization', slug: 'auth', articleCount: 3 },
      { id: 'sec-secrets', name: 'Secrets Management', slug: 'secrets', articleCount: 3 },
      { id: 'sec-compliance', name: 'Compliance', slug: 'compliance', articleCount: 3 },
    ],
  },
  {
    id: 'costs',
    name: 'Cost Management',
    description: 'Optimize cloud spending and manage budgets',
    icon: 'DollarSign',
    slug: 'costs',
    articleCount: 6,
  },
  {
    id: 'api',
    name: 'API Reference',
    description: 'Complete API documentation and specifications',
    icon: 'Code',
    slug: 'api',
    articleCount: 20,
  },
  {
    id: 'for-developers',
    name: 'For Developers',
    description: 'Backend integration guide and technical documentation',
    icon: 'Wrench',
    slug: 'for-developers',
    articleCount: 2,
    subcategories: [
      { id: 'dev-handoff', name: 'Developer Handoff', slug: 'handoff', articleCount: 1 },
      { id: 'dev-glossary', name: 'Glossary', slug: 'glossary', articleCount: 1 },
    ],
  },
];

// ============================================================================
// Documentation Articles
// ============================================================================

export const documentationArticles: DocumentationArticle[] = [
  // Getting Started
  {
    id: 'gs-platform-overview',
    slug: 'platform-overview',
    title: 'Platform Overview',
    description: 'Learn what the Internal Developer Platform offers and how it can accelerate your development workflow.',
    content: `
# Platform Overview

The Internal Developer Platform (IDP) is your one-stop shop for building, deploying, and managing applications at scale. It provides a unified interface that abstracts away infrastructure complexity while giving you full control over your applications.

## Key Capabilities

### 🔍 Discover
- **System Catalog**: Browse and discover all services, libraries, and resources across your organization
- **Search**: Find anything instantly with intelligent search
- **Dependencies**: Visualize and understand service relationships

### 🔧 Build
- **Create Applications**: Scaffold new applications with best practices baked in
- **Configure**: Manage environment variables, secrets, and settings
- **Infrastructure**: Define and provision infrastructure as code

### 🚀 Deploy
- **Releases**: Manage release versions and artifacts
- **Deployments**: Deploy to any environment with confidence
- **Change Gates**: Automated approval workflows and safety checks

### 📊 Manage
- **Observability**: Real-time metrics, logs, and traces
- **Costs**: Track and optimize cloud spending
- **Incidents**: Respond to and resolve issues quickly

## Architecture Philosophy

The platform is built on these core principles:

1. **Self-Service**: Developers should be able to do everything themselves
2. **Guardrails, Not Gates**: Enable velocity while maintaining safety
3. **Observable by Default**: Every application comes with monitoring out of the box
4. **Cost Aware**: Visibility into spending at every level
    `,
    contentType: 'explanation',
    category: 'getting-started',
    subcategory: 'overview',
    tags: ['overview', 'introduction', 'basics'],
    personas: ['developer', 'tech-lead', 'manager', 'executive'],
    difficulty: 'beginner',
    estimatedReadTime: 5,
    lastUpdated: '2024-01-15',
    author: 'Platform Team',
    featured: true,
    views: 15420,
    helpfulVotes: 1243,
  },
  {
    id: 'gs-first-application',
    slug: 'creating-your-first-application',
    title: 'Creating Your First Application',
    description: 'A step-by-step guide to creating and deploying your first application on the platform.',
    content: `
# Creating Your First Application

This tutorial walks you through creating your first application from scratch. By the end, you'll have a deployed service running in your development environment.

## Prerequisites

- Access to the platform (contact your admin if needed)
- Basic familiarity with Git
- A GitHub/GitLab account connected to the platform

## Step 1: Navigate to Create Application

1. Click **Build** in the left sidebar
2. Select **Create App**
3. You'll see the application creation wizard

## Step 2: Choose a Template

Select from our pre-configured templates:

- **Web Service**: REST API with best practices
- **Frontend**: React/Vue/Angular starter
- **Backend for Frontend (BFF)**: API gateway pattern
- **Worker**: Background job processor
- **Library**: Shared code package

## Step 3: Configure Your Application

Fill in the required fields:

\`\`\`yaml
name: my-first-service
type: service
team: platform-engineering
language: typescript
framework: express
tier: tier-3
\`\`\`

## Step 4: Set Up Infrastructure

Choose your infrastructure requirements:

- **Compute**: Kubernetes pods (default) or serverless
- **Database**: PostgreSQL, MySQL, or none
- **Cache**: Redis if needed
- **Monitoring**: Always enabled by default

## Step 5: Deploy to Development

Click **Create & Deploy** to:
1. Generate your repository from the template
2. Set up CI/CD pipelines
3. Provision infrastructure
4. Deploy to your development environment

## What's Next?

- Configure environment variables
- Set up database connections
- Add dependencies
- Deploy to staging
    `,
    contentType: 'tutorial',
    category: 'getting-started',
    subcategory: 'quickstart',
    tags: ['tutorial', 'first-app', 'getting-started', 'create'],
    personas: ['developer'],
    difficulty: 'beginner',
    estimatedReadTime: 10,
    prerequisites: ['gs-platform-overview'],
    relatedArticles: ['app-configuration', 'deploy-first-deployment'],
    lastUpdated: '2024-01-10',
    author: 'Platform Team',
    featured: true,
    views: 12890,
    helpfulVotes: 987,
  },
  {
    id: 'gs-for-tech-leads',
    slug: 'getting-started-tech-leads',
    title: 'Getting Started for Tech Leads',
    description: 'A guide tailored for tech leads covering team management, standards, and oversight.',
    content: `
# Getting Started for Tech Leads

As a Tech Lead, you need visibility across your team's applications while empowering your developers to move fast. This guide covers everything you need to be effective.

## Your Dashboard

When you log in, you'll see a dashboard tailored for technical leadership:

- **Team Overview**: Health status of all your team's services
- **Pending Approvals**: Deployments waiting for your review
- **Recent Activity**: What your team has been shipping
- **Risk Overview**: Potential issues to address

## Key Responsibilities

### 1. Application Oversight

Navigate to **Discover > System Catalog** to see all your team's applications:

- Monitor health status across services
- Review dependency graphs
- Check compliance status
- Track technical debt

### 2. Change Management

Use **Deploy > Change Gates** to:

- Configure approval requirements
- Set up automated quality gates
- Define deployment windows
- Manage release trains

### 3. Team Metrics

Monitor team performance through **Manage > Analytics**:

- Deployment frequency
- Lead time for changes
- Change failure rate
- Mean time to recovery (MTTR)

## Setting Team Standards

Use the platform to enforce standards:

1. **Service Templates**: Create approved templates for new services
2. **Pipeline Policies**: Require security scans, tests, coverage thresholds
3. **Infrastructure Guardrails**: Limit resource sizes, require tagging
4. **Review Requirements**: Configure who can approve what

## Best Practices

- Review your team's services weekly
- Address high-severity alerts within 24 hours
- Maintain documentation in the System Catalog
- Regular 1:1s with developers on platform usage
    `,
    contentType: 'tutorial',
    category: 'getting-started',
    subcategory: 'quickstart',
    tags: ['tech-lead', 'team-management', 'getting-started'],
    personas: ['tech-lead'],
    difficulty: 'beginner',
    estimatedReadTime: 8,
    lastUpdated: '2024-01-12',
    author: 'Platform Team',
    views: 3420,
    helpfulVotes: 289,
  },
  // Deployments
  {
    id: 'deploy-first-deployment',
    slug: 'first-deployment',
    title: 'Your First Deployment',
    description: 'Learn how to deploy your application to development, staging, and production environments.',
    content: `
# Your First Deployment

Deployments move your code from development to production. The platform supports multiple deployment strategies with built-in safety checks.

## Understanding Environments

| Environment | Purpose | Access |
|------------|---------|--------|
| Development | Active development | All developers |
| Staging | Pre-production testing | Team members |
| Production | Live traffic | Restricted |

## Triggering a Deployment

### From the UI

1. Navigate to **Deploy > Releases**
2. Select the version you want to deploy
3. Choose target environment
4. Review the deployment plan
5. Click **Deploy**

### From CI/CD

Deployments are automatically triggered when:
- Code is merged to \`main\` → Development
- Release tags are created → Staging
- Approval is granted → Production

## The Deployment Process

\`\`\`
1. Pre-deployment checks
   ├── Security scan passes
   ├── Tests pass
   └── Change gate approval

2. Deployment execution
   ├── Create new pods/instances
   ├── Health check new instances
   ├── Gradually shift traffic
   └── Monitor for errors

3. Post-deployment
   ├── Verify metrics
   ├── Check error rates
   └── Confirm success
\`\`\`

## Monitoring Your Deployment

During deployment, you can monitor:

- **Progress**: Real-time status updates
- **Logs**: Live log streaming
- **Metrics**: Request rate, latency, errors
- **Health**: Pod/instance status

## Rolling Back

If something goes wrong:

1. Click the **Rollback** button on any deployment
2. Select the previous version to restore
3. Confirm the rollback

Rollbacks use the same safe deployment process.
    `,
    contentType: 'how-to',
    category: 'deployments',
    subcategory: 'basics',
    tags: ['deployment', 'ci-cd', 'releases', 'rollback'],
    personas: ['developer', 'tech-lead'],
    difficulty: 'beginner',
    estimatedReadTime: 8,
    prerequisites: ['gs-first-application'],
    relatedArticles: ['deploy-strategies', 'deploy-rollback'],
    lastUpdated: '2024-01-08',
    author: 'Platform Team',
    views: 8920,
    helpfulVotes: 743,
  },
  {
    id: 'deploy-strategies',
    slug: 'deployment-strategies',
    title: 'Deployment Strategies',
    description: 'Learn about different deployment strategies: rolling, blue-green, and canary deployments.',
    content: `
# Deployment Strategies

Choose the right deployment strategy based on your risk tolerance, application type, and traffic patterns.

## Rolling Deployment (Default)

Gradually replaces old instances with new ones.

**How it works:**
\`\`\`
[Old] [Old] [Old] [Old]  ← Start
[New] [Old] [Old] [Old]  ← 25% new
[New] [New] [Old] [Old]  ← 50% new
[New] [New] [New] [Old]  ← 75% new
[New] [New] [New] [New]  ← Complete
\`\`\`

**Best for:**
- Most applications
- When zero-downtime is required
- Applications that handle traffic gracefully

**Configuration:**
\`\`\`yaml
deployment:
  strategy: rolling
  maxUnavailable: 25%
  maxSurge: 25%
\`\`\`

## Blue-Green Deployment

Maintains two identical environments, switching traffic instantly.

**How it works:**
\`\`\`
Blue (Live)  ←── Traffic
Green (Idle)

# After deployment
Blue (Idle)
Green (Live) ←── Traffic
\`\`\`

**Best for:**
- Critical services requiring instant rollback
- Database migrations
- Major version upgrades

## Canary Deployment

Routes a small percentage of traffic to the new version first.

**How it works:**
\`\`\`
v1.0 ←── 95% traffic
v1.1 ←── 5% traffic (canary)

# If healthy, gradually increase
v1.0 ←── 50% traffic
v1.1 ←── 50% traffic

# Complete rollout
v1.1 ←── 100% traffic
\`\`\`

**Best for:**
- High-traffic services
- Changes with unknown risk
- A/B testing scenarios

## Choosing a Strategy

| Factor | Rolling | Blue-Green | Canary |
|--------|---------|------------|--------|
| Rollback Speed | Moderate | Instant | Fast |
| Resource Cost | Low | High (2x) | Low |
| Risk Exposure | Moderate | Low | Very Low |
| Complexity | Low | Medium | High |
    `,
    contentType: 'explanation',
    category: 'deployments',
    subcategory: 'strategies',
    tags: ['deployment', 'strategy', 'canary', 'blue-green', 'rolling'],
    personas: ['developer', 'tech-lead'],
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    prerequisites: ['deploy-first-deployment'],
    lastUpdated: '2024-01-05',
    author: 'Platform Team',
    views: 6540,
    helpfulVotes: 521,
  },
  // Monitoring
  {
    id: 'mon-setting-up-alerts',
    slug: 'setting-up-alerts',
    title: 'Setting Up Alerts',
    description: 'Configure alerts to be notified when your services need attention.',
    content: `
# Setting Up Alerts

Effective alerting ensures you're notified about issues before they impact users. This guide covers setting up, tuning, and managing alerts.

## Alert Types

### Metric-Based Alerts

Triggered when metrics cross thresholds:

\`\`\`yaml
alert: HighErrorRate
condition: error_rate > 5%
duration: 5m
severity: critical
\`\`\`

### Log-Based Alerts

Triggered by specific log patterns:

\`\`\`yaml
alert: ExceptionDetected
pattern: "Exception|Error|Fatal"
threshold: 10 occurrences/minute
severity: warning
\`\`\`

### Availability Alerts

Triggered when services are unreachable:

\`\`\`yaml
alert: ServiceDown
condition: health_check == false
duration: 1m
severity: critical
\`\`\`

## Creating an Alert

1. Navigate to **Manage > Observability**
2. Select your application
3. Click **Alerts** tab
4. Click **Create Alert**

Configure:
- **Name**: Descriptive alert name
- **Condition**: When to trigger
- **Severity**: Critical, High, Medium, Low
- **Notification Channels**: Where to send

## Best Practices

### The Right Thresholds

Start with industry standards and tune:

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | > 1% | > 5% |
| Latency P99 | > 500ms | > 1s |
| CPU | > 70% | > 90% |
| Memory | > 75% | > 90% |

### Avoid Alert Fatigue

- Don't alert on things that don't require action
- Group related alerts
- Use appropriate severities
- Include runbook links

### On-Call Integration

Connect alerts to your on-call rotation:
1. Go to **Settings > Integrations**
2. Connect PagerDuty/Opsgenie
3. Map severities to escalation policies
    `,
    contentType: 'how-to',
    category: 'monitoring',
    subcategory: 'alerts',
    tags: ['alerts', 'monitoring', 'observability', 'on-call'],
    personas: ['developer', 'tech-lead'],
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    relatedArticles: ['inc-on-call', 'mon-dashboards'],
    lastUpdated: '2024-01-03',
    author: 'Platform Team',
    views: 5670,
    helpfulVotes: 432,
  },
  // Costs
  {
    id: 'cost-optimization',
    slug: 'cost-optimization',
    title: 'Cost Optimization Guide',
    description: 'Learn how to optimize your cloud spending and reduce waste.',
    content: `
# Cost Optimization Guide

Cloud costs can spiral quickly without proper management. This guide helps you identify savings opportunities and implement cost controls.

## Understanding Your Costs

Navigate to **Manage > Costs** to see:

- **Current Month**: Total spend this month
- **Trend**: Month-over-month change
- **By Application**: Cost breakdown by service
- **By Category**: Compute, storage, network, database

## Quick Wins

### 1. Right-Size Resources

Many applications over-provision resources. Check:

\`\`\`
CPU Utilization < 20%  → Consider downsizing
Memory Usage < 30%     → Consider downsizing
\`\`\`

### 2. Clean Up Unused Resources

Look for:
- Development environments running 24/7
- Orphaned storage volumes
- Unused load balancers
- Idle databases

### 3. Use Spot/Preemptible Instances

For non-critical workloads, use spot instances:
- Development environments
- Batch processing
- CI/CD workers
- Testing infrastructure

Savings: **60-90%** compared to on-demand

### 4. Reserved Capacity

For stable, predictable workloads:
- 1-year commitment: 30-40% savings
- 3-year commitment: 50-60% savings

## Setting Budgets

Create budgets to track spending:

1. Go to **Manage > Costs**
2. Click **Set Budget**
3. Define monthly budget
4. Configure alerts at 50%, 75%, 90%, 100%

## Cost Allocation

Tag all resources for accurate attribution:

\`\`\`yaml
tags:
  team: platform-engineering
  environment: production
  application: api-gateway
  cost-center: CC-1234
\`\`\`

## Automated Recommendations

The platform provides automated recommendations:
- ✅ Right-sizing suggestions
- ✅ Unused resource detection
- ✅ Reserved instance recommendations
- ✅ Architecture optimization tips
    `,
    contentType: 'how-to',
    category: 'costs',
    tags: ['costs', 'optimization', 'budget', 'finops'],
    personas: ['developer', 'tech-lead', 'manager'],
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    lastUpdated: '2024-01-02',
    author: 'Platform Team',
    views: 4320,
    helpfulVotes: 367,
  },
  // For Developers
  {
    id: 'dev-handoff-guide',
    slug: 'developer-handoff-guide',
    title: 'Developer Handoff Guide',
    description: 'Complete guide for integrating the backend API and deploying to production',
    content: `
# Developer Handoff Guide

This guide provides everything a developer needs to integrate the backend API and deploy this Internal Developer Platform to production.

## Current State

✅ **What's Complete:**
- Frontend prototype is complete and fully functional
- All data is mocked in \`src/data/mock-data.ts\`
- API hooks in \`src/hooks/use-api.ts\` simulate network calls with delays
- All TypeScript types are defined in \`src/types/index.ts\`
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

The backend needs to implement the following endpoints:

### Authentication Endpoints
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/logout\` - User logout
- \`GET /api/auth/me\` - Get current user
- \`POST /api/auth/refresh\` - Refresh authentication token

### Application Endpoints
- \`GET /api/applications\` - List all applications
- \`GET /api/applications/:id\` - Get application details
- \`GET /api/applications/owned\` - Get user's applications
- \`GET /api/applications/team/:teamId\` - Get team's applications
- \`POST /api/applications\` - Create application
- \`PUT /api/applications/:id\` - Update application
- \`DELETE /api/applications/:id\` - Delete application

### Deployment Endpoints
- \`GET /api/deployments\` - List deployments
- \`GET /api/deployments/:id\` - Get deployment details
- \`GET /api/deployments/recent\` - Recent deployments
- \`GET /api/deployments/application/:id\` - Deployments for application
- \`POST /api/deployments\` - Create deployment
- \`POST /api/deployments/:id/approve\` - Approve deployment
- \`POST /api/deployments/:id/rollback\` - Rollback deployment

### Incident Endpoints
- \`GET /api/incidents\` - List incidents
- \`GET /api/incidents/:id\` - Get incident details
- \`GET /api/incidents/active\` - Active incidents
- \`POST /api/incidents\` - Create incident
- \`PUT /api/incidents/:id\` - Update incident
- \`POST /api/incidents/:id/resolve\` - Resolve incident

### Cost Endpoints
- \`GET /api/costs\` - Cost data
- \`GET /api/costs/application/:id\` - Costs for application
- \`GET /api/costs/total\` - Total cost summary
- \`GET /api/costs/trends\` - Cost trends over time

### Search Endpoint
- \`GET /api/search?q=:query\` - Global search

### Extension Endpoints
- \`GET /api/extensions\` - List extensions
- \`GET /api/extensions/:id\` - Get extension details
- \`POST /api/extensions/:id/install\` - Install extension
- \`DELETE /api/extensions/:id\` - Uninstall extension

### User & Team Endpoints
- \`GET /api/users/me\` - Current user
- \`PUT /api/users/me/preferences\` - Update preferences
- \`GET /api/teams\` - List teams
- \`GET /api/teams/:id\` - Get team details

## Environment Variables

Create \`.env.example\` file:

\`\`\`bash
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
\`\`\`

**Note:** All environment variables in Vite must be prefixed with \`VITE_\` to be accessible in the frontend.

## Authentication & Authorization

### Requirements

- **JWT-based authentication** (or OAuth 2.0)
- **Token refresh mechanism** to keep users logged in
- **Role-based access control (RBAC)** - Different permissions for Developer, Tech Lead, Manager, Executive
- **Permission system** - See \`User.permissions\` in types

### Implementation Steps

1. **Create API Client** (\`src/lib/api-client.ts\`):
   - Axios instance with interceptors
   - Add Authorization header automatically
   - Handle token refresh
   - Handle 401/403 errors (redirect to login)

2. **Update API Hooks** (\`src/hooks/use-api.ts\`):
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

All TypeScript interfaces are defined in \`src/types/index.ts\`. The backend should match these exactly:

- **User** - User profile, preferences, permissions
- **Application** - Service/application metadata
- **Deployment** - Deployment records
- **Incident** - Incident management
- **CostData** - Cost tracking
- **Extension** - Extension marketplace
- **Team** - Team information
- **Activity** - Activity feed
- **Notification** - User notifications

See \`src/types/index.ts\` for complete type definitions.

## Integration Points to Replace

### File: \`src/hooks/use-api.ts\`

Replace all mock implementations with real API calls:

- \`useApplications()\` → \`GET /api/applications\`
- \`useApplication(id)\` → \`GET /api/applications/:id\`
- \`useDeployment(id)\` → \`GET /api/deployments/:id\`
- \`useIncidents()\` → \`GET /api/incidents\`
- \`useCostData()\` → \`GET /api/costs\`
- All mutations → POST/PUT/DELETE endpoints

### File: \`src/data/mock-data.ts\`

- **Keep for development/testing** - Useful for local development
- **Remove from production builds** - Not needed in production
- **Use as seed data** - Can be used to populate backend database

## Real-time Updates

### Consider WebSocket/SSE for:

- **Deployment status updates** - Real-time deployment progress
- **Incident updates** - New incidents, status changes
- **System health metrics** - Live health data
- **Notifications** - Real-time notifications

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

- [ ] Update \`vite.config.ts\` with production API URL
- [ ] Configure build optimizations
- [ ] Set up source maps (for debugging)
- [ ] Configure asset hashing

### Deployment Options

**Option 1: Static Hosting** (Recommended for SPA)
- Vercel, Netlify, AWS S3 + CloudFront
- Requires SPA routing support (all routes → \`index.html\`)
- HTTPS enabled
- Security headers configured

**Option 2: Container Deployment**
- Docker + Kubernetes
- Nginx configuration for SPA routing
- Health check endpoints

**Required for All Options:**
- SPA routing support (all routes serve \`index.html\`)
- HTTPS enabled
- Security headers configured
- CORS properly configured

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

## Quick Start for Developer

\`\`\`bash
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
\`\`\`

## Critical Integration Points

1. **Authentication** - \`src/stores/user-store.ts\` - User authentication state
2. **API Calls** - \`src/hooks/use-api.ts\` - All data fetching
3. **Real-time Updates** - WebSocket or SSE implementation
4. **File Uploads** - Extension screenshots, user avatars
5. **Search** - Global search endpoint
6. **Notifications** - Real-time notification system

---

For more details, see the full documentation in \`docs/DEVELOPER_HANDOFF.md\` in the repository.
    `,
    contentType: 'guide',
    category: 'for-developers',
    subcategory: 'handoff',
    tags: ['backend', 'integration', 'api', 'deployment', 'handoff'],
    personas: ['developer'],
    difficulty: 'intermediate',
    estimatedReadTime: 15,
    lastUpdated: '2026-01-26',
    author: 'Design Team',
    featured: true,
    views: 0,
    helpfulVotes: 0,
  },
  {
    id: 'dev-glossary',
    slug: 'glossary',
    title: 'Glossary: Acronyms and Technical Terms',
    description: 'Complete explanation of all acronyms and technical terms used in the project',
    content: `
# Glossary: Acronyms and Technical Terms

This document explains all acronyms and technical terms used throughout the project documentation and codebase.

## Acronyms

### **API (Application Programming Interface)**
- **What it is:** The way the frontend communicates with the backend server
- **In this project:** Endpoints like \`/api/applications\` that return data to the frontend
- **Think of it as:** A menu at a restaurant - you order (request) and get food (data) back

### **JWT (JSON Web Token)**
- **What it is:** A secure way to prove who you are without sending your password every time
- **In this project:** Used to verify the user is logged in
- **Think of it as:** A temporary ID badge that expires after a certain time

### **OAuth 2.0**
- **What it is:** A standard way to let users sign in with external services (Google, GitHub, etc.)
- **In this project:** One option for authentication
- **Think of it as:** "Sign in with Google" buttons you see on websites

### **SAML (Security Assertion Markup Language)**
- **What it is:** An enterprise authentication standard used by large companies
- **In this project:** Another authentication option for corporate environments
- **Think of it as:** Corporate single sign-on (SSO) systems

### **RBAC (Role-Based Access Control)**
- **What it is:** Permissions based on user roles (Developer, Tech Lead, Manager, Executive)
- **In this project:** Controls what each persona can do
- **Think of it as:** Different key cards for different access levels in a building

### **CORS (Cross-Origin Resource Sharing)**
- **What it is:** Browser security that allows requests from your frontend domain to your backend domain
- **In this project:** Must be configured so the frontend can call the backend API
- **Think of it as:** A security guard checking IDs before allowing access

### **XSS (Cross-Site Scripting)**
- **What it is:** A security attack where malicious scripts run in the browser
- **In this project:** Prevented by sanitizing user input and using React's built-in protections
- **Think of it as:** Someone trying to inject harmful code into your website

### **CSRF (Cross-Site Request Forgery)**
- **What it is:** A security attack that tricks users into performing actions they didn't intend
- **In this project:** Prevented with tokens/headers
- **Think of it as:** Someone tricking you into clicking a button that does something you don't want

### **CSP (Content Security Policy)**
- **What it is:** HTTP headers that restrict which resources can load
- **In this project:** Helps prevent XSS and other attacks
- **Think of it as:** A whitelist of allowed resources

### **SSE (Server-Sent Events)**
- **What it is:** A way for the server to push updates to the browser (one-way)
- **In this project:** Alternative to WebSockets for real-time updates
- **Think of it as:** A one-way radio broadcast from server to browser

### **HTTPS (HyperText Transfer Protocol Secure)**
- **What it is:** Encrypted HTTP (the secure version)
- **In this project:** Required in production
- **Think of it as:** A secure, encrypted connection (the lock icon in your browser)

### **ERD (Entity Relationship Diagram)**
- **What it is:** A visual diagram showing database tables and how they relate
- **In this project:** Helps the developer understand data structure
- **Think of it as:** A map of how data is organized

### **OpenAPI/Swagger**
- **What it is:** A standard format for documenting APIs
- **In this project:** Used to document backend endpoints
- **Think of it as:** A detailed instruction manual for the API

### **E2E (End-to-End)**
- **What it is:** Testing that simulates a full user journey
- **In this project:** Tests like "user logs in, creates app, deploys it"
- **Think of it as:** Testing the entire flow from start to finish

### **p95 (95th Percentile)**
- **What it is:** 95% of requests are faster than this value
- **In this project:** API response time target
- **Think of it as:** "95% of the time, it's faster than this"

### **gzipped**
- **What it is:** Compressed file format to reduce size
- **In this project:** Bundle size target after compression
- **Think of it as:** Zipping a file to make it smaller

## Technical Terms

### **Frontend**
- **What it is:** The part of the application users see and interact with (in the browser)
- **In this project:** The React app you've built
- **Think of it as:** The storefront of a shop

### **Backend**
- **What it is:** The server that handles business logic and data storage
- **In this project:** Needs to be built by the developer
- **Think of it as:** The warehouse and office behind the storefront

### **Mock Data**
- **What it is:** Fake data used for development and testing
- **In this project:** Located in \`src/data/mock-data.ts\`, will be replaced with real API calls
- **Think of it as:** Placeholder content used during design

### **API Endpoints**
- **What it is:** URLs the frontend calls to get/send data
- **Example:** \`GET /api/applications\` returns a list of applications
- **Think of it as:** Specific addresses you visit to get specific information

### **Authentication**
- **What it is:** Verifying who the user is (login process)
- **In this project:** Handled by the backend
- **Think of it as:** Showing your ID to prove who you are

### **Authorization**
- **What it is:** Determining what the user can do (permissions)
- **In this project:** Based on user roles and permissions
- **Think of it as:** Checking if you have permission to enter a restricted area

### **Token Refresh**
- **What it is:** Getting a new authentication token before the old one expires
- **In this project:** Keeps users logged in without re-authenticating
- **Think of it as:** Renewing your ID badge before it expires

### **State Management**
- **What it is:** How the app stores and updates data
- **In this project:** Zustand for UI state, TanStack Query for server data
- **Think of it as:** A filing system for app data

### **Query Cache**
- **What it is:** Storing API responses to avoid duplicate requests
- **In this project:** TanStack Query handles this automatically
- **Think of it as:** Remembering answers so you don't have to ask again

### **SPA (Single Page Application)**
- **What it is:** An app that loads once and updates content without full page reloads
- **In this project:** The entire app is a SPA
- **Think of it as:** A single page that changes content dynamically

### **Code Splitting**
- **What it is:** Breaking the app into smaller chunks loaded on demand
- **In this project:** Improves initial load time
- **Think of it as:** Loading only what you need, when you need it

### **Bundle Size**
- **What it is:** Total size of JavaScript files sent to the browser
- **In this project:** Target is under 500KB after compression
- **Think of it as:** The total weight of your app's code

### **Environment Variables**
- **What it is:** Configuration values that change per environment (dev/staging/prod)
- **In this project:** API URLs, feature flags, etc.
- **Think of it as:** Settings that change based on where the app runs

### **WebSocket**
- **What it is:** A persistent connection for real-time, two-way communication
- **In this project:** For live updates (deployments, incidents)
- **Think of it as:** A phone call that stays open for instant communication

### **Deployment Pipeline**
- **What it is:** Automated steps to build, test, and deploy
- **In this project:** CI/CD (Continuous Integration/Continuous Deployment)
- **Think of it as:** An assembly line for deploying your app

### **CI/CD (Continuous Integration/Continuous Deployment)**
- **What it is:** Automating testing and deployment
- **In this project:** Push code → tests run → deploy if tests pass
- **Think of it as:** An automated factory that builds and ships your app

## In Simple Terms: What Each Part Does

### **Frontend (What You Built)**
- The user interface that users see and interact with
- Makes requests to the backend for data
- Handles user interactions and displays information

### **Backend (What Developer Needs to Build)**
- The server that stores data and handles business logic
- Receives requests from the frontend
- Returns data or performs actions

### **API (The Connection)**
- The contract between frontend and backend
- Defines what data can be requested and how

### **Authentication (Login)**
- Verifies who the user is
- Issues tokens to prove identity

### **Authorization (Permissions)**
- Determines what the user can do
- Based on roles and permissions

### **Database**
- Where data is stored
- Tables for users, applications, deployments, etc.

### **Deployment (Going Live)**
- Process of putting the app on a server so users can access it
- Includes building, testing, and publishing

### **Monitoring (Watching the App)**
- Tracking errors, performance, and usage
- Helps catch and fix issues quickly

## The Flow: How Everything Works Together

1. **User opens the app** → Frontend loads
2. **User logs in** → Frontend sends credentials → Backend verifies → Returns token
3. **User views dashboard** → Frontend requests data → Backend queries database → Returns data → Frontend displays it
4. **User creates an app** → Frontend sends data → Backend saves to database → Returns confirmation → Frontend updates UI

---

For the complete glossary with all terms, see \`docs/GLOSSARY.md\` in the repository.
    `,
    contentType: 'reference',
    category: 'for-developers',
    subcategory: 'glossary',
    tags: ['glossary', 'terms', 'acronyms', 'reference'],
    personas: ['developer', 'tech-lead', 'manager'],
    difficulty: 'beginner',
    estimatedReadTime: 10,
    lastUpdated: '2026-01-26',
    author: 'Design Team',
    featured: true,
    views: 0,
    helpfulVotes: 0,
  },
];

// ============================================================================
// Contextual Help
// ============================================================================

export const contextualHelp: ContextualHelp[] = [
  // Dashboard
  {
    id: 'ctx-dashboard-widgets',
    location: '/',
    elementSelector: '.widget-library-button',
    triggers: ['hover', 'first-visit'],
    content: {
      quick: 'Customize your dashboard by adding or removing widgets',
      detailed: 'The dashboard is fully customizable. Add widgets that matter to your role, resize them, and arrange them however you like. Changes are saved automatically.',
      tutorial: 'gs-dashboard-customization',
      relatedLinks: [
        { label: 'Available Widgets', url: '/help/widgets', type: 'internal' },
        { label: 'Dashboard Best Practices', url: '/help/dashboard-tips', type: 'internal' },
      ],
    },
    priority: 1,
  },
  // Create Application
  {
    id: 'ctx-create-app-name',
    location: '/build/create',
    elementSelector: 'input[name="name"]',
    triggers: ['focus'],
    content: {
      quick: 'Use lowercase letters, numbers, and hyphens only',
      detailed: 'Application names must be unique across the platform. They become part of your service URLs and repository names. Choose something descriptive but concise.',
      examples: [
        {
          id: 'ex-name-good',
          title: 'Good names',
          language: 'text',
          code: 'user-service\npayment-api\nanalytics-dashboard',
        },
        {
          id: 'ex-name-bad',
          title: 'Avoid',
          language: 'text',
          code: 'UserService (no capitals)\nmy_app (no underscores)\napp1 (not descriptive)',
        },
      ],
    },
    priority: 2,
  },
  {
    id: 'ctx-create-app-tier',
    location: '/build/create',
    elementSelector: 'select[name="tier"]',
    triggers: ['focus', 'hover'],
    content: {
      quick: 'Service tier determines SLA requirements and resource allocation',
      detailed: `
**Tier 1**: Mission-critical, 99.99% SLA, highest resources
**Tier 2**: Business-critical, 99.9% SLA, high resources  
**Tier 3**: Standard services, 99.5% SLA, standard resources
**Tier 4**: Development/internal, best-effort SLA
      `,
      relatedLinks: [
        { label: 'Service Tier Guidelines', url: '/help/service-tiers', type: 'internal' },
      ],
    },
    personaVariations: {
      developer: {
        quick: 'Most applications should use Tier 3 unless they\'re customer-facing',
      },
      'tech-lead': {
        quick: 'Consider SLA requirements and on-call impact when selecting tier',
      },
    },
    priority: 2,
  },
  // Deployments
  {
    id: 'ctx-deploy-environment',
    location: '/deploy/deployments',
    elementSelector: '.environment-selector',
    triggers: ['focus'],
    content: {
      quick: 'Select the target environment for deployment',
      detailed: 'Different environments have different approval requirements. Development deploys automatically, staging requires tests to pass, and production requires human approval.',
      tutorial: 'deploy-first-deployment',
    },
    priority: 1,
  },
  {
    id: 'ctx-deploy-rollback',
    location: '/deploy/deployments',
    elementSelector: '.rollback-button',
    triggers: ['hover'],
    content: {
      quick: 'Quickly restore the previous working version',
      detailed: 'Rollback uses the same safe deployment process as regular deployments. It won\'t instantly swap traffic—it gradually shifts to the previous version while monitoring for issues.',
      relatedLinks: [
        { label: 'Rollback Best Practices', url: '/help/rollbacks', type: 'internal' },
      ],
    },
    priority: 1,
  },
  // Incidents
  {
    id: 'ctx-incident-severity',
    location: '/manage/incidents',
    elementSelector: '.severity-selector',
    triggers: ['focus'],
    content: {
      quick: 'Set severity based on customer impact',
      detailed: `
**Critical (SEV1)**: Complete service outage, immediate escalation
**High (SEV2)**: Major functionality impacted, escalate within 15 min
**Medium (SEV3)**: Partial impact, normal response time
**Low (SEV4)**: Minor issues, can wait for business hours
      `,
      tutorial: 'inc-severity-guidelines',
    },
    priority: 1,
  },
  // Costs
  {
    id: 'ctx-costs-budget',
    location: '/manage/costs',
    elementSelector: '.budget-indicator',
    triggers: ['hover'],
    content: {
      quick: 'Budget utilization shows how much of your allocated budget has been used',
      detailed: 'If you\'re approaching your budget limit, consider optimizing resources or requesting a budget increase. The platform provides recommendations for cost savings.',
      tutorial: 'cost-optimization',
      relatedLinks: [
        { label: 'Request Budget Increase', url: '/settings/billing', type: 'internal' },
        { label: 'Cost Optimization Tips', url: '/help/cost-optimization', type: 'internal' },
      ],
    },
    priority: 2,
  },
  // System Catalog
  {
    id: 'ctx-catalog-health',
    location: '/discover/catalog',
    elementSelector: '.health-indicator',
    triggers: ['hover'],
    content: {
      quick: 'Real-time health status based on metrics and alerts',
      detailed: `
**Healthy**: All metrics within normal ranges
**Degraded**: Some metrics elevated but still functional
**Critical**: Service experiencing significant issues
**Unknown**: Unable to determine status (check monitoring)
      `,
    },
    priority: 1,
  },
  // Settings
  {
    id: 'ctx-settings-api-key',
    location: '/settings',
    elementSelector: '.api-key-section',
    triggers: ['focus', 'hover'],
    content: {
      quick: 'API keys allow programmatic access to the platform',
      detailed: 'Treat API keys like passwords. Don\'t commit them to source control, rotate them regularly, and use the minimum required permissions.',
      examples: [
        {
          id: 'ex-api-usage',
          title: 'Using API keys',
          language: 'bash',
          code: 'curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  https://api.platform.dev/v1/applications',
        },
      ],
      relatedLinks: [
        { label: 'API Documentation', url: '/help/api', type: 'internal' },
      ],
    },
    priority: 2,
  },
];

// ============================================================================
// FAQ Categories
// ============================================================================

export const faqCategories: FaqCategory[] = [
  {
    id: 'faq-getting-started',
    name: 'Getting Started',
    description: 'Common questions for new users',
    icon: 'Rocket',
    questions: [
      {
        id: 'faq-gs-1',
        question: 'How do I create my first application?',
        answer: 'Navigate to Build > Create Application in the sidebar. You\'ll be guided through a wizard that helps you configure your application with the right settings, choose a template, and set up CI/CD pipelines. Most applications can be created in under 5 minutes.',
        tags: ['create', 'application', 'getting-started'],
        relatedArticles: ['gs-first-application'],
      },
      {
        id: 'faq-gs-2',
        question: 'What permissions do I need?',
        answer: 'Basic users can view the catalog, create development applications, and deploy to development environments. Additional permissions are needed for production deployments, team management, and admin functions. Contact your team lead to request additional access.',
        tags: ['permissions', 'access', 'getting-started'],
      },
      {
        id: 'faq-gs-3',
        question: 'How do I connect my Git repository?',
        answer: 'Go to Settings > Integrations and connect your GitHub or GitLab account. Once connected, you can import existing repositories or let the platform create new ones for your applications.',
        tags: ['git', 'github', 'gitlab', 'repository'],
      },
    ],
  },
  {
    id: 'faq-deployments',
    name: 'Deployments',
    description: 'Questions about deploying applications',
    icon: 'Upload',
    questions: [
      {
        id: 'faq-deploy-1',
        question: 'Why is my deployment stuck in pending?',
        answer: 'Deployments can be pending for several reasons: awaiting approval from a change gate, waiting for a previous deployment to complete, or blocked by a freeze window. Check the deployment details for the specific reason and required actions.',
        tags: ['deployment', 'pending', 'troubleshooting'],
      },
      {
        id: 'faq-deploy-2',
        question: 'How do I roll back a failed deployment?',
        answer: 'Navigate to Deploy > History, find the deployment you want to roll back, and click the Rollback button. You can also rollback from the application detail page. Rollbacks use the same safe deployment process as forward deployments.',
        tags: ['rollback', 'deployment', 'recovery'],
        relatedArticles: ['deploy-rollback'],
      },
      {
        id: 'faq-deploy-3',
        question: 'Can I deploy to production on weekends?',
        answer: 'Production deployments outside business hours require additional approvals. Configure your deployment windows in Deploy > Change Gates. Emergency deployments can override these restrictions with proper authorization.',
        tags: ['production', 'deployment', 'change-gates'],
      },
    ],
  },
  {
    id: 'faq-monitoring',
    name: 'Monitoring & Alerts',
    description: 'Questions about observability',
    icon: 'Activity',
    questions: [
      {
        id: 'faq-mon-1',
        question: 'Why am I not receiving alerts?',
        answer: 'Check your notification settings in Settings > Notifications. Ensure your email/Slack/PagerDuty is configured correctly. Also verify that alerts are enabled for your application and that you\'re subscribed to the relevant alert groups.',
        tags: ['alerts', 'notifications', 'troubleshooting'],
      },
      {
        id: 'faq-mon-2',
        question: 'How do I create a custom dashboard?',
        answer: 'Navigate to Manage > Observability and click Create Dashboard. You can add metrics from any of your applications, create custom queries, and arrange visualizations however you prefer. Dashboards can be shared with your team.',
        tags: ['dashboard', 'metrics', 'observability'],
      },
    ],
  },
  {
    id: 'faq-incidents',
    name: 'Incident Management',
    description: 'Questions about handling incidents',
    icon: 'AlertTriangle',
    questions: [
      {
        id: 'faq-inc-1',
        question: 'How do I declare an incident?',
        answer: 'Click the + Incident button from the top navigation or go to Manage > Incidents > Create. Provide a clear title, select the severity based on customer impact, and assign the affected services. This will notify the relevant on-call personnel.',
        tags: ['incident', 'create', 'on-call'],
      },
      {
        id: 'faq-inc-2',
        question: 'What\'s the difference between severity levels?',
        answer: 'SEV1 (Critical): Complete outage affecting many users. SEV2 (High): Major feature unavailable. SEV3 (Medium): Partial functionality impacted. SEV4 (Low): Minor issues. Severity determines response time expectations and escalation paths.',
        tags: ['severity', 'incident', 'sla'],
      },
    ],
  },
  {
    id: 'faq-costs',
    name: 'Cost Management',
    description: 'Questions about cloud costs',
    icon: 'DollarSign',
    questions: [
      {
        id: 'faq-cost-1',
        question: 'How are costs calculated?',
        answer: 'Costs are calculated based on resource usage: compute (CPU/memory hours), storage, network transfer, and managed services. Costs are attributed to applications using tags and tracked in real-time.',
        tags: ['costs', 'billing', 'calculation'],
      },
      {
        id: 'faq-cost-2',
        question: 'How do I reduce my cloud spending?',
        answer: 'Start with the Cost Optimization page which shows recommendations. Common savings include right-sizing resources, using spot instances for non-production, cleaning up unused resources, and reserved capacity for stable workloads.',
        tags: ['costs', 'optimization', 'savings'],
        relatedArticles: ['cost-optimization'],
      },
    ],
  },
];

// ============================================================================
// Glossary
// ============================================================================

export const glossary: Glossary[] = [
  {
    term: 'Application',
    definition: 'A deployable unit in the platform—can be a service, frontend, library, or infrastructure component.',
    relatedTerms: ['Service', 'Component'],
  },
  {
    term: 'Blue-Green Deployment',
    definition: 'A deployment strategy that maintains two identical environments (blue and green) and switches traffic between them.',
    relatedTerms: ['Canary Deployment', 'Rolling Deployment'],
    seeAlso: ['deploy-strategies'],
  },
  {
    term: 'Canary Deployment',
    definition: 'A deployment strategy that gradually routes a small percentage of traffic to the new version before full rollout.',
    relatedTerms: ['Blue-Green Deployment', 'Rolling Deployment'],
    seeAlso: ['deploy-strategies'],
  },
  {
    term: 'Change Gate',
    definition: 'An approval workflow that controls when and how changes can be deployed, including automated checks and manual approvals.',
    relatedTerms: ['Deployment', 'Approval'],
  },
  {
    term: 'DORA Metrics',
    definition: 'DevOps Research and Assessment metrics: deployment frequency, lead time for changes, change failure rate, and mean time to recovery.',
    relatedTerms: ['Lead Time', 'MTTR'],
  },
  {
    term: 'Golden Signals',
    definition: 'Four key metrics for monitoring: latency, traffic, errors, and saturation.',
    relatedTerms: ['SLI', 'SLO'],
  },
  {
    term: 'Lead Time',
    definition: 'The time from code commit to production deployment.',
    relatedTerms: ['DORA Metrics', 'Deployment Frequency'],
  },
  {
    term: 'MTTR',
    definition: 'Mean Time To Recovery—the average time to restore service after an incident.',
    relatedTerms: ['MTTD', 'Incident', 'DORA Metrics'],
  },
  {
    term: 'Rolling Deployment',
    definition: 'A deployment strategy that gradually replaces old instances with new ones, maintaining availability throughout.',
    relatedTerms: ['Blue-Green Deployment', 'Canary Deployment'],
    seeAlso: ['deploy-strategies'],
  },
  {
    term: 'Service Tier',
    definition: 'A classification that determines SLA requirements, resource allocation, and operational expectations for an application.',
    seeAlso: ['gs-service-tiers'],
  },
  {
    term: 'SLI',
    definition: 'Service Level Indicator—a quantitative measure of service behavior (e.g., request latency, error rate).',
    relatedTerms: ['SLO', 'SLA', 'Golden Signals'],
  },
  {
    term: 'SLO',
    definition: 'Service Level Objective—a target value for an SLI (e.g., 99.9% of requests under 100ms).',
    relatedTerms: ['SLI', 'SLA', 'Error Budget'],
  },
  {
    term: 'System Catalog',
    definition: 'The central registry of all applications, services, libraries, and infrastructure components in the organization.',
    relatedTerms: ['Application', 'Service'],
  },
];

// ============================================================================
// Runbooks
// ============================================================================

export const runbooks: Runbook[] = [
  {
    id: 'rb-high-error-rate',
    title: 'High Error Rate Response',
    description: 'Steps to diagnose and resolve elevated error rates in production services',
    category: 'incident-response',
    severity: 'high',
    owner: 'Platform Team',
    steps: [
      {
        id: 'rb-err-1',
        title: 'Assess Impact',
        description: 'Determine the scope and severity of the error rate increase',
        commands: [
          '# Check error rate trend',
          'curl -s "$METRICS_URL/api/v1/query?query=rate(http_requests_total{status=~\"5..\"}[5m])"',
        ],
        expectedOutcome: 'Understand if errors are localized to specific endpoints or widespread',
        troubleshooting: 'If metrics are unavailable, check the Observability dashboard directly',
      },
      {
        id: 'rb-err-2',
        title: 'Check Recent Changes',
        description: 'Review recent deployments that might have caused the issue',
        expectedOutcome: 'Identify if a recent deployment correlates with the error spike',
        automation: { available: true, actionId: 'check-recent-deploys' },
      },
      {
        id: 'rb-err-3',
        title: 'Review Logs',
        description: 'Search logs for error patterns and stack traces',
        commands: [
          '# Search for errors in the last hour',
          'platform logs --app $APP_NAME --level error --since 1h',
        ],
        expectedOutcome: 'Identify the root cause from error messages and stack traces',
      },
      {
        id: 'rb-err-4',
        title: 'Rollback if Necessary',
        description: 'If a recent deployment is the cause, initiate a rollback',
        expectedOutcome: 'Error rate returns to normal levels after rollback',
        automation: { available: true, actionId: 'rollback-deployment' },
      },
    ],
  },
  {
    id: 'rb-service-down',
    title: 'Service Down Response',
    description: 'Emergency response for complete service unavailability',
    category: 'incident-response',
    severity: 'critical',
    owner: 'Platform Team',
    steps: [
      {
        id: 'rb-down-1',
        title: 'Confirm Outage',
        description: 'Verify the service is actually down and not a monitoring false positive',
        commands: [
          'curl -I $SERVICE_URL/health',
          'platform status --app $APP_NAME',
        ],
        expectedOutcome: 'Confirm whether service is unreachable or responding with errors',
      },
      {
        id: 'rb-down-2',
        title: 'Declare Incident',
        description: 'Create an incident and page the on-call team',
        expectedOutcome: 'Incident created and responders notified',
        automation: { available: true, actionId: 'create-incident' },
      },
      {
        id: 'rb-down-3',
        title: 'Check Infrastructure',
        description: 'Verify underlying infrastructure is healthy',
        commands: [
          'kubectl get pods -n $NAMESPACE',
          'kubectl describe pods -n $NAMESPACE | grep -A5 Events',
        ],
        expectedOutcome: 'Identify infrastructure issues like crashed pods, OOM, or node problems',
      },
      {
        id: 'rb-down-4',
        title: 'Restart Service',
        description: 'If pods are unhealthy, perform a rolling restart',
        commands: [
          'kubectl rollout restart deployment/$APP_NAME -n $NAMESPACE',
        ],
        expectedOutcome: 'New pods start successfully and pass health checks',
        automation: { available: true, actionId: 'restart-service' },
      },
    ],
  },
];

// ============================================================================
// Learning Paths
// ============================================================================

export const learningPaths: LearningPath[] = [
  {
    id: 'lp-developer-onboarding',
    title: 'Developer Onboarding',
    description: 'Everything you need to know to be productive on the platform',
    persona: 'developer',
    difficulty: 'beginner',
    estimatedHours: 4,
    modules: [
      {
        id: 'lp-dev-m1',
        title: 'Platform Fundamentals',
        description: 'Understand the platform architecture and key concepts',
        articles: ['gs-platform-overview', 'gs-concepts'],
      },
      {
        id: 'lp-dev-m2',
        title: 'Creating Applications',
        description: 'Learn to create and configure applications',
        articles: ['gs-first-application', 'app-configuration'],
      },
      {
        id: 'lp-dev-m3',
        title: 'Deploying Your Code',
        description: 'Master the deployment workflow',
        articles: ['deploy-first-deployment', 'deploy-strategies'],
      },
      {
        id: 'lp-dev-m4',
        title: 'Monitoring & Debugging',
        description: 'Keep your services healthy',
        articles: ['mon-setting-up-alerts', 'mon-dashboards'],
      },
    ],
  },
  {
    id: 'lp-tech-lead-essentials',
    title: 'Tech Lead Essentials',
    description: 'Managing teams and services effectively on the platform',
    persona: 'tech-lead',
    difficulty: 'intermediate',
    estimatedHours: 6,
    modules: [
      {
        id: 'lp-tl-m1',
        title: 'Team Management',
        description: 'Oversee your team\'s services and deployments',
        articles: ['gs-for-tech-leads', 'team-management'],
      },
      {
        id: 'lp-tl-m2',
        title: 'Quality & Standards',
        description: 'Enforce quality through change gates and policies',
        articles: ['deploy-change-gates', 'standards-enforcement'],
      },
      {
        id: 'lp-tl-m3',
        title: 'Cost Management',
        description: 'Keep your team\'s cloud costs under control',
        articles: ['cost-optimization', 'budget-management'],
      },
      {
        id: 'lp-tl-m4',
        title: 'Incident Response',
        description: 'Lead your team through incidents effectively',
        articles: ['inc-response', 'inc-postmortem'],
      },
    ],
  },
];

// ============================================================================
// Interactive Tutorials
// ============================================================================

export const tutorials: Tutorial[] = [
  {
    id: 'tut-first-app',
    title: 'Create Your First Application',
    description: 'Walk through creating and deploying a new application step by step',
    persona: 'developer',
    difficulty: 'beginner',
    estimatedTime: 10,
    steps: [
      {
        id: 'tut-fa-1',
        title: 'Open Create Application',
        description: 'Navigate to the application creation page',
        targetPage: '/build/create',
        action: 'navigate',
        hint: 'Click "Build" in the sidebar, then "Create App"',
      },
      {
        id: 'tut-fa-2',
        title: 'Enter Application Name',
        description: 'Give your application a descriptive name',
        targetSelector: 'input[name="name"]',
        action: 'type',
        hint: 'Use lowercase letters and hyphens, like "my-first-service"',
      },
      {
        id: 'tut-fa-3',
        title: 'Select Template',
        description: 'Choose a template that matches your use case',
        targetSelector: '.template-selector',
        action: 'click',
        hint: 'Web Service is a good starting point for backend APIs',
      },
      {
        id: 'tut-fa-4',
        title: 'Configure Infrastructure',
        description: 'Set up the resources your application needs',
        targetSelector: '.infrastructure-config',
        action: 'observe',
        hint: 'Default settings work for most applications',
      },
      {
        id: 'tut-fa-5',
        title: 'Create Application',
        description: 'Submit and create your application',
        targetSelector: 'button[type="submit"]',
        action: 'click',
        validation: {
          type: 'url-match',
          value: '/discover/catalog/*',
        },
      },
    ],
    completionReward: 'You\'ve created your first application! 🎉',
  },
  {
    id: 'tut-deploy',
    title: 'Deploy to Production',
    description: 'Learn the production deployment workflow',
    persona: 'developer',
    difficulty: 'intermediate',
    estimatedTime: 15,
    steps: [
      {
        id: 'tut-deploy-1',
        title: 'Navigate to Releases',
        description: 'Find your application\'s releases',
        targetPage: '/deploy/releases',
        action: 'navigate',
      },
      {
        id: 'tut-deploy-2',
        title: 'Select a Release',
        description: 'Choose the version you want to deploy',
        targetSelector: '.release-card',
        action: 'click',
      },
      {
        id: 'tut-deploy-3',
        title: 'Choose Production',
        description: 'Select production as the target environment',
        targetSelector: '.environment-production',
        action: 'click',
      },
      {
        id: 'tut-deploy-4',
        title: 'Review Changes',
        description: 'Review what will be deployed',
        targetSelector: '.deployment-diff',
        action: 'observe',
        hint: 'Always review changes before deploying to production',
      },
      {
        id: 'tut-deploy-5',
        title: 'Submit for Approval',
        description: 'Request approval for the production deployment',
        targetSelector: '.request-approval-button',
        action: 'click',
      },
    ],
    completionReward: 'You\'ve learned the production deployment workflow! 🚀',
  },
];
