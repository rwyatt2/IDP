import type {
  User,
  Extension,
  Widget,
  Application,
  Team,
  Deployment,
  Incident,
  Alert,
  CostData,
  Activity,
  Notification,
  SearchResult,
} from '@/types';

// ============================================================================
// Current User
// ============================================================================

export const currentUser: User = {
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  role: 'tech-lead',
  team: 'Platform Engineering',
  teams: ['Platform Engineering', 'Infrastructure'],
  permissions: ['deploy:prod', 'approve:deployments', 'manage:team', 'admin:extensions'],
  preferences: {
    theme: 'light',
    dashboardLayout: {
      widgets: [
        { id: 'w1', widgetId: 'my-applications', position: { x: 0, y: 0 }, size: 'medium' },
        { id: 'w2', widgetId: 'recent-deployments', position: { x: 1, y: 0 }, size: 'medium' },
        { id: 'w3', widgetId: 'on-call-schedule', position: { x: 0, y: 1 }, size: 'small' },
        { id: 'w4', widgetId: 'system-health', position: { x: 1, y: 1 }, size: 'small' },
        { id: 'w5', widgetId: 'pending-approvals', position: { x: 2, y: 0 }, size: 'small' },
        { id: 'w6', widgetId: 'cost-trends', position: { x: 2, y: 1 }, size: 'medium' },
      ],
    },
    favoriteExtensions: ['system-catalog', 'release-management', 'observability'],
    notifications: {
      email: true,
      push: true,
      slack: true,
      deployments: true,
      incidents: true,
      approvals: true,
    },
  },
  onCallStatus: {
    isOnCall: true,
    schedule: 'Platform Primary',
    endsAt: '2026-01-26T09:00:00Z',
    escalationPolicy: 'Platform Escalation',
  },
};

// ============================================================================
// Teams
// ============================================================================

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Platform Engineering',
    slug: 'platform-engineering',
    description: 'Building internal tools and infrastructure',
    lead: 'user-1',
    slackChannel: '#platform-eng',
    email: 'platform@company.com',
    oncallSchedule: 'Platform Primary',
    members: [
      { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'Senior Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      { id: 'user-3', name: 'Emily Wang', email: 'emily.w@company.com', role: 'Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    ],
  },
  {
    id: 'team-2',
    name: 'Payments',
    slug: 'payments',
    description: 'Payment processing and billing',
    lead: 'user-4',
    slackChannel: '#payments',
    email: 'payments@company.com',
    oncallSchedule: 'Payments Primary',
    members: [
      { id: 'user-4', name: 'Alex Rivera', email: 'alex.r@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { id: 'user-5', name: 'Jordan Lee', email: 'jordan.l@company.com', role: 'Senior Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
    ],
  },
  {
    id: 'team-3',
    name: 'User Experience',
    slug: 'user-experience',
    description: 'Frontend applications and design systems',
    lead: 'user-6',
    slackChannel: '#ux-eng',
    email: 'ux@company.com',
    members: [
      { id: 'user-6', name: 'Taylor Kim', email: 'taylor.k@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
      { id: 'user-7', name: 'Casey Morgan', email: 'casey.m@company.com', role: 'Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
    ],
  },
  {
    id: 'team-4',
    name: 'Data Platform',
    slug: 'data-platform',
    description: 'Data pipelines and analytics infrastructure',
    lead: 'user-8',
    slackChannel: '#data-platform',
    email: 'data@company.com',
    members: [
      { id: 'user-8', name: 'Sam Patel', email: 'sam.p@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
      { id: 'user-9', name: 'Chris Zhang', email: 'chris.z@company.com', role: 'Data Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    ],
  },
];

// ============================================================================
// Applications
// ============================================================================

export const applications: Application[] = [
  {
    id: 'app-1',
    name: 'api-gateway',
    displayName: 'API Gateway',
    description: 'Central API gateway handling authentication, rate limiting, and request routing for all microservices',
    type: 'service',
    status: 'healthy',
    team: teams[0],
    owners: ['user-1', 'user-2'],
    tier: 'tier-1',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/api-gateway',
    language: 'Go',
    framework: 'Gin',
    dependencies: [
      { id: 'dep-1', name: 'auth-service', type: 'service', status: 'healthy', critical: true },
      { id: 'dep-2', name: 'redis-cluster', type: 'cache', status: 'healthy', critical: true },
      { id: 'dep-3', name: 'postgres-primary', type: 'database', status: 'healthy', critical: true },
    ],
    endpoints: [
      { path: '/api/v1/*', method: 'GET', description: 'Proxy all GET requests', authenticated: true, rateLimit: 1000 },
      { path: '/api/v1/*', method: 'POST', description: 'Proxy all POST requests', authenticated: true, rateLimit: 500 },
      { path: '/health', method: 'GET', description: 'Health check endpoint', authenticated: false },
    ],
    metrics: {
      requestsPerSecond: 15420,
      latencyP50: 12,
      latencyP99: 89,
      errorRate: 0.02,
      uptime: 99.99,
      instances: 12,
      cpu: 45,
      memory: 62,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: false,
      pci: true,
      lastAudit: '2025-12-15',
      certifications: ['SOC2 Type II', 'PCI DSS Level 1'],
    },
    tags: ['critical', 'platform', 'gateway'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2026-01-24T14:30:00Z',
  },
  {
    id: 'app-2',
    name: 'payment-service',
    displayName: 'Payment Service',
    description: 'Handles all payment processing, billing, and subscription management',
    type: 'backend',
    status: 'healthy',
    team: teams[1],
    owners: ['user-4', 'user-5'],
    tier: 'tier-1',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/payment-service',
    language: 'Java',
    framework: 'Spring Boot',
    dependencies: [
      { id: 'dep-4', name: 'stripe-api', type: 'external', status: 'healthy', critical: true },
      { id: 'dep-5', name: 'postgres-payments', type: 'database', status: 'healthy', critical: true },
      { id: 'dep-6', name: 'kafka-cluster', type: 'queue', status: 'healthy', critical: true },
    ],
    metrics: {
      requestsPerSecond: 2340,
      latencyP50: 45,
      latencyP99: 234,
      errorRate: 0.01,
      uptime: 99.995,
      instances: 8,
      cpu: 38,
      memory: 71,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: false,
      pci: true,
      lastAudit: '2025-11-20',
      certifications: ['SOC2 Type II', 'PCI DSS Level 1'],
    },
    tags: ['critical', 'payments', 'pci'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2026-01-23T16:45:00Z',
  },
  {
    id: 'app-3',
    name: 'user-dashboard',
    displayName: 'User Dashboard',
    description: 'Main customer-facing dashboard application',
    type: 'frontend',
    status: 'healthy',
    team: teams[2],
    owners: ['user-6', 'user-7'],
    tier: 'tier-1',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/user-dashboard',
    language: 'TypeScript',
    framework: 'React',
    dependencies: [
      { id: 'dep-7', name: 'api-gateway', type: 'service', status: 'healthy', critical: true },
      { id: 'dep-8', name: 'cdn-global', type: 'external', status: 'healthy', critical: false },
    ],
    metrics: {
      requestsPerSecond: 8920,
      latencyP50: 180,
      latencyP99: 890,
      errorRate: 0.05,
      uptime: 99.95,
      instances: 1,
      cpu: 0,
      memory: 0,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: false,
      pci: false,
      certifications: ['SOC2 Type II'],
    },
    tags: ['frontend', 'customer-facing'],
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2026-01-25T09:15:00Z',
  },
  {
    id: 'app-4',
    name: 'notification-service',
    displayName: 'Notification Service',
    description: 'Handles email, SMS, and push notifications across all products',
    type: 'service',
    status: 'degraded',
    team: teams[0],
    owners: ['user-2', 'user-3'],
    tier: 'tier-2',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/notification-service',
    language: 'Python',
    framework: 'FastAPI',
    dependencies: [
      { id: 'dep-9', name: 'sendgrid-api', type: 'external', status: 'degraded', critical: true },
      { id: 'dep-10', name: 'twilio-api', type: 'external', status: 'healthy', critical: false },
      { id: 'dep-11', name: 'redis-notifications', type: 'cache', status: 'healthy', critical: true },
    ],
    metrics: {
      requestsPerSecond: 890,
      latencyP50: 120,
      latencyP99: 450,
      errorRate: 2.3,
      uptime: 98.5,
      instances: 4,
      cpu: 52,
      memory: 48,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: false,
      pci: false,
      certifications: ['SOC2 Type II'],
    },
    tags: ['notifications', 'email', 'sms'],
    createdAt: '2024-04-05T14:00:00Z',
    updatedAt: '2026-01-25T11:30:00Z',
  },
  {
    id: 'app-5',
    name: 'data-pipeline',
    displayName: 'Data Pipeline',
    description: 'ETL pipelines for analytics and reporting data',
    type: 'data-pipeline',
    status: 'healthy',
    team: teams[3],
    owners: ['user-8', 'user-9'],
    tier: 'tier-2',
    environment: ['development', 'production'],
    repository: 'github.com/company/data-pipeline',
    language: 'Python',
    framework: 'Apache Airflow',
    dependencies: [
      { id: 'dep-12', name: 'snowflake', type: 'database', status: 'healthy', critical: true },
      { id: 'dep-13', name: 's3-datalake', type: 'external', status: 'healthy', critical: true },
    ],
    metrics: {
      requestsPerSecond: 0,
      latencyP50: 0,
      latencyP99: 0,
      errorRate: 0.1,
      uptime: 99.8,
      instances: 3,
      cpu: 78,
      memory: 85,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: false,
      pci: false,
      certifications: ['SOC2 Type II'],
    },
    tags: ['data', 'etl', 'analytics'],
    createdAt: '2024-06-12T09:00:00Z',
    updatedAt: '2026-01-24T22:00:00Z',
  },
  {
    id: 'app-6',
    name: 'auth-service',
    displayName: 'Authentication Service',
    description: 'Centralized authentication and authorization service with SSO support',
    type: 'service',
    status: 'healthy',
    team: teams[0],
    owners: ['user-1'],
    tier: 'tier-1',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/auth-service',
    language: 'Go',
    framework: 'Custom',
    dependencies: [
      { id: 'dep-14', name: 'postgres-auth', type: 'database', status: 'healthy', critical: true },
      { id: 'dep-15', name: 'redis-sessions', type: 'cache', status: 'healthy', critical: true },
      { id: 'dep-16', name: 'okta', type: 'external', status: 'healthy', critical: true },
    ],
    metrics: {
      requestsPerSecond: 5670,
      latencyP50: 8,
      latencyP99: 45,
      errorRate: 0.005,
      uptime: 99.999,
      instances: 6,
      cpu: 25,
      memory: 40,
    },
    compliance: {
      soc2: true,
      gdpr: true,
      hipaa: true,
      pci: true,
      lastAudit: '2025-12-01',
      certifications: ['SOC2 Type II', 'HIPAA', 'PCI DSS Level 1'],
    },
    tags: ['critical', 'security', 'auth'],
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2026-01-25T08:00:00Z',
  },
];

// ============================================================================
// Extensions
// ============================================================================

export const extensions: Extension[] = [
  {
    id: 'system-catalog',
    name: 'System Catalog',
    description: 'Unified view of all applications, services, and infrastructure. Track ownership, dependencies, and health status across your entire ecosystem.',
    shortDescription: 'Browse and manage all services',
    icon: 'Database',
    category: 'catalog',
    phase: 'discover',
    version: '2.4.1',
    author: 'Platform Team',
    rating: 4.8,
    downloads: 12500,
    installed: true,
    featured: true,
    tags: ['catalog', 'services', 'dependencies'],
    permissions: ['read:applications', 'write:applications'],
    lastUpdated: '2026-01-20',
  },
  {
    id: 'release-management',
    name: 'Release Management',
    description: 'End-to-end release orchestration with approval workflows, rollback capabilities, and deployment tracking across all environments.',
    shortDescription: 'Deploy and manage releases',
    icon: 'Rocket',
    category: 'deployment',
    phase: 'deploy',
    version: '3.1.0',
    author: 'Platform Team',
    rating: 4.9,
    downloads: 11200,
    installed: true,
    featured: true,
    tags: ['deployment', 'releases', 'rollback'],
    permissions: ['read:deployments', 'write:deployments', 'approve:deployments'],
    lastUpdated: '2026-01-22',
  },
  {
    id: 'observability',
    name: 'Observability Hub',
    description: 'Unified observability with metrics, logs, and traces. Integrated dashboards, alerting, and incident management.',
    shortDescription: 'Monitor and observe systems',
    icon: 'Activity',
    category: 'monitoring',
    phase: 'manage',
    version: '2.8.3',
    author: 'Platform Team',
    rating: 4.7,
    downloads: 10800,
    installed: true,
    featured: true,
    tags: ['monitoring', 'metrics', 'alerts', 'logs'],
    permissions: ['read:metrics', 'write:alerts'],
    lastUpdated: '2026-01-18',
  },
  {
    id: 'cost-management',
    name: 'Cost Management',
    description: 'Track and optimize cloud spending across all teams and applications. Budget alerts, forecasting, and optimization recommendations.',
    shortDescription: 'Track and optimize costs',
    icon: 'DollarSign',
    category: 'cost',
    phase: 'manage',
    version: '1.9.2',
    author: 'FinOps Team',
    rating: 4.5,
    downloads: 8900,
    installed: true,
    featured: false,
    tags: ['cost', 'finops', 'budget'],
    permissions: ['read:costs'],
    lastUpdated: '2026-01-15',
  },
  {
    id: 'pipeline-automation',
    name: 'Pipeline Automation',
    description: 'Visual CI/CD pipeline builder with templates, parallel execution, and integration with popular tools.',
    shortDescription: 'Build and manage pipelines',
    icon: 'GitBranch',
    category: 'automation',
    phase: 'build',
    version: '2.2.0',
    author: 'Platform Team',
    rating: 4.6,
    downloads: 9500,
    installed: true,
    featured: false,
    tags: ['ci/cd', 'pipelines', 'automation'],
    permissions: ['read:pipelines', 'write:pipelines'],
    lastUpdated: '2026-01-19',
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Automated security scanning for vulnerabilities, secrets detection, and compliance checks.',
    shortDescription: 'Scan for security issues',
    icon: 'Shield',
    category: 'security',
    phase: 'build',
    version: '1.5.1',
    author: 'Security Team',
    rating: 4.4,
    downloads: 7200,
    installed: true,
    featured: false,
    tags: ['security', 'vulnerabilities', 'compliance'],
    permissions: ['read:security', 'write:security'],
    lastUpdated: '2026-01-17',
  },
  {
    id: 'capacity-planner',
    name: 'Capacity Planner',
    description: 'Resource capacity planning with forecasting, auto-scaling recommendations, and utilization analysis.',
    shortDescription: 'Plan resource capacity',
    icon: 'BarChart3',
    category: 'infrastructure',
    phase: 'build',
    version: '1.3.0',
    author: 'Infrastructure Team',
    rating: 4.3,
    downloads: 5400,
    installed: false,
    featured: false,
    tags: ['capacity', 'scaling', 'resources'],
    permissions: ['read:resources', 'write:resources'],
    lastUpdated: '2026-01-10',
  },
  {
    id: 'incident-commander',
    name: 'Incident Commander',
    description: 'Incident management with automated runbooks, on-call scheduling, and post-mortem workflows.',
    shortDescription: 'Manage incidents',
    icon: 'AlertTriangle',
    category: 'monitoring',
    phase: 'manage',
    version: '2.0.1',
    author: 'SRE Team',
    rating: 4.8,
    downloads: 8100,
    installed: true,
    featured: true,
    tags: ['incidents', 'on-call', 'runbooks'],
    permissions: ['read:incidents', 'write:incidents'],
    lastUpdated: '2026-01-21',
  },
  {
    id: 'api-docs',
    name: 'API Documentation',
    description: 'Auto-generated API documentation with interactive explorer, versioning, and SDK generation.',
    shortDescription: 'Browse API documentation',
    icon: 'FileText',
    category: 'catalog',
    phase: 'discover',
    version: '1.8.0',
    author: 'Developer Experience Team',
    rating: 4.6,
    downloads: 7800,
    installed: true,
    featured: false,
    tags: ['api', 'documentation', 'swagger'],
    permissions: ['read:apis'],
    lastUpdated: '2026-01-14',
  },
  {
    id: 'feature-flags',
    name: 'Feature Flags',
    description: 'Feature flag management with gradual rollouts, A/B testing, and targeting rules.',
    shortDescription: 'Manage feature flags',
    icon: 'Flag',
    category: 'deployment',
    phase: 'deploy',
    version: '1.4.2',
    author: 'Platform Team',
    rating: 4.5,
    downloads: 6300,
    installed: false,
    featured: false,
    tags: ['feature-flags', 'rollouts', 'experiments'],
    permissions: ['read:flags', 'write:flags'],
    lastUpdated: '2026-01-12',
  },
];

// ============================================================================
// Widgets
// ============================================================================

export const availableWidgets: Widget[] = [
  {
    id: 'my-applications',
    type: 'my-applications',
    title: 'My Applications',
    description: 'Quick access to your owned and starred applications',
    size: 'medium',
  },
  {
    id: 'on-call-schedule',
    type: 'on-call-schedule',
    title: 'On-Call Schedule',
    description: 'View your on-call rotation and upcoming shifts',
    size: 'small',
  },
  {
    id: 'recent-deployments',
    type: 'recent-deployments',
    title: 'Recent Deployments',
    description: 'Track deployment activity across your applications',
    size: 'medium',
  },
  {
    id: 'cost-trends',
    type: 'cost-trends',
    title: 'Cost Trends',
    description: 'Monitor cloud spending and budget utilization',
    size: 'medium',
  },
  {
    id: 'system-health',
    type: 'system-health',
    title: 'System Health',
    description: 'Overall health status of your services',
    size: 'small',
  },
  {
    id: 'team-projects',
    type: 'team-projects',
    title: 'Team Projects',
    description: 'Active projects and initiatives for your team',
    size: 'medium',
  },
  {
    id: 'pending-approvals',
    type: 'pending-approvals',
    title: 'Pending Approvals',
    description: 'Deployment and change approvals awaiting your review',
    size: 'small',
  },
  {
    id: 'performance-metrics',
    type: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Key performance indicators across services',
    size: 'large',
  },
  {
    id: 'quick-actions',
    type: 'quick-actions',
    title: 'Quick Actions',
    description: 'Shortcuts to common tasks',
    size: 'small',
  },
  {
    id: 'recent-activity',
    type: 'recent-activity',
    title: 'Recent Activity',
    description: 'Latest activity across your applications',
    size: 'medium',
  },
  {
    id: 'alerts',
    type: 'alerts',
    title: 'Active Alerts',
    description: 'Current alerts and incidents',
    size: 'small',
  },
  {
    id: 'resources',
    type: 'resources',
    title: 'Resource Usage',
    description: 'CPU, memory, and storage utilization',
    size: 'medium',
  },
];

// ============================================================================
// Deployments
// ============================================================================

export const deployments: Deployment[] = [
  {
    id: 'deploy-1',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    version: 'v2.14.3',
    environment: 'production',
    status: 'succeeded',
    triggeredBy: 'Sarah Chen',
    triggeredAt: '2026-01-25T10:30:00Z',
    completedAt: '2026-01-25T10:45:00Z',
    duration: 900,
    commits: [
      { sha: 'abc1234', message: 'fix: rate limiting edge case', author: 'Sarah Chen', timestamp: '2026-01-25T09:00:00Z' },
      { sha: 'def5678', message: 'chore: update dependencies', author: 'Mike Johnson', timestamp: '2026-01-25T08:30:00Z' },
    ],
    artifacts: [{ name: 'api-gateway:v2.14.3', type: 'docker', size: 245000000, checksum: 'sha256:abc123' }],
    approvals: [{ id: 'apr-1', approver: 'Alex Rivera', status: 'approved', timestamp: '2026-01-25T10:28:00Z' }],
    canRollback: true,
  },
  {
    id: 'deploy-2',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    version: 'v3.8.1',
    environment: 'staging',
    status: 'in-progress',
    triggeredBy: 'Alex Rivera',
    triggeredAt: '2026-01-25T11:00:00Z',
    commits: [
      { sha: 'ghi9012', message: 'feat: add Apple Pay support', author: 'Alex Rivera', timestamp: '2026-01-25T10:00:00Z' },
    ],
    artifacts: [{ name: 'payment-service:v3.8.1', type: 'docker', size: 312000000, checksum: 'sha256:def456' }],
    approvals: [],
    canRollback: false,
  },
  {
    id: 'deploy-3',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    version: 'v4.2.0',
    environment: 'production',
    status: 'awaiting-approval',
    triggeredBy: 'Taylor Kim',
    triggeredAt: '2026-01-25T09:00:00Z',
    commits: [
      { sha: 'jkl3456', message: 'feat: redesigned settings page', author: 'Taylor Kim', timestamp: '2026-01-24T16:00:00Z' },
      { sha: 'mno7890', message: 'fix: accessibility improvements', author: 'Casey Morgan', timestamp: '2026-01-24T15:00:00Z' },
    ],
    artifacts: [{ name: 'user-dashboard:v4.2.0', type: 'static', size: 15000000, checksum: 'sha256:ghi789' }],
    approvals: [{ id: 'apr-2', approver: 'Sarah Chen', status: 'pending' }],
    canRollback: false,
  },
  {
    id: 'deploy-4',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    version: 'v1.12.0',
    environment: 'production',
    status: 'failed',
    triggeredBy: 'Emily Wang',
    triggeredAt: '2026-01-24T14:00:00Z',
    completedAt: '2026-01-24T14:15:00Z',
    duration: 900,
    commits: [
      { sha: 'pqr1234', message: 'feat: batch notification support', author: 'Emily Wang', timestamp: '2026-01-24T12:00:00Z' },
    ],
    artifacts: [{ name: 'notification-service:v1.12.0', type: 'docker', size: 189000000, checksum: 'sha256:jkl012' }],
    approvals: [{ id: 'apr-3', approver: 'Sarah Chen', status: 'approved', timestamp: '2026-01-24T13:55:00Z' }],
    canRollback: false,
  },
  {
    id: 'deploy-5',
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    version: 'v5.1.2',
    environment: 'production',
    status: 'succeeded',
    triggeredBy: 'Sarah Chen',
    triggeredAt: '2026-01-24T08:00:00Z',
    completedAt: '2026-01-24T08:12:00Z',
    duration: 720,
    commits: [
      { sha: 'stu5678', message: 'security: patch CVE-2026-1234', author: 'Sarah Chen', timestamp: '2026-01-24T07:00:00Z' },
    ],
    artifacts: [{ name: 'auth-service:v5.1.2', type: 'docker', size: 156000000, checksum: 'sha256:mno345' }],
    approvals: [
      { id: 'apr-4', approver: 'Mike Johnson', status: 'approved', timestamp: '2026-01-24T07:55:00Z' },
      { id: 'apr-5', approver: 'Alex Rivera', status: 'approved', timestamp: '2026-01-24T07:58:00Z' },
    ],
    canRollback: true,
  },
];

// ============================================================================
// Incidents
// ============================================================================

export const incidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Elevated error rates in Notification Service',
    description: 'SendGrid API returning intermittent 503 errors causing notification delays',
    severity: 'medium',
    status: 'investigating',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    assignee: 'Emily Wang',
    team: 'Platform Engineering',
    createdAt: '2026-01-25T10:15:00Z',
    updatedAt: '2026-01-25T11:00:00Z',
    timeline: [
      { id: 'evt-1', type: 'created', timestamp: '2026-01-25T10:15:00Z', user: 'System', content: 'Incident created from alert' },
      { id: 'evt-2', type: 'status-change', timestamp: '2026-01-25T10:20:00Z', user: 'Emily Wang', content: 'Status changed to investigating' },
      { id: 'evt-3', type: 'comment', timestamp: '2026-01-25T10:45:00Z', user: 'Emily Wang', content: 'Confirmed issue is on SendGrid side. Opened ticket with their support.' },
    ],
  },
  {
    id: 'inc-2',
    title: 'Database connection pool exhaustion',
    description: 'Postgres connection pool reaching capacity during peak hours',
    severity: 'high',
    status: 'monitoring',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    assignee: 'Jordan Lee',
    team: 'Payments',
    createdAt: '2026-01-24T16:00:00Z',
    updatedAt: '2026-01-25T09:00:00Z',
    timeline: [
      { id: 'evt-4', type: 'created', timestamp: '2026-01-24T16:00:00Z', user: 'System', content: 'Incident created from alert' },
      { id: 'evt-5', type: 'status-change', timestamp: '2026-01-24T16:15:00Z', user: 'Jordan Lee', content: 'Investigating connection patterns' },
      { id: 'evt-6', type: 'comment', timestamp: '2026-01-24T18:00:00Z', user: 'Jordan Lee', content: 'Increased pool size from 50 to 100 connections' },
      { id: 'evt-7', type: 'status-change', timestamp: '2026-01-25T09:00:00Z', user: 'Jordan Lee', content: 'Monitoring after fix deployment' },
    ],
  },
];

// ============================================================================
// Alerts
// ============================================================================

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'High error rate',
    message: 'Error rate exceeded 2% threshold',
    severity: 'warning',
    source: 'Observability Hub',
    applicationId: 'app-4',
    timestamp: '2026-01-25T10:15:00Z',
    acknowledged: true,
    acknowledgedBy: 'Emily Wang',
  },
  {
    id: 'alert-2',
    title: 'Deployment awaiting approval',
    message: 'User Dashboard v4.2.0 requires approval for production',
    severity: 'info',
    source: 'Release Management',
    applicationId: 'app-3',
    timestamp: '2026-01-25T09:00:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    title: 'SSL certificate expiring',
    message: 'Certificate for api.company.com expires in 14 days',
    severity: 'warning',
    source: 'Security Scanner',
    timestamp: '2026-01-25T06:00:00Z',
    acknowledged: false,
  },
];

// ============================================================================
// Cost Data
// ============================================================================

export const costData: CostData[] = [
  {
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    team: 'Platform Engineering',
    currentMonth: 12450,
    previousMonth: 11200,
    trend: 11.2,
    breakdown: { compute: 8200, storage: 1500, network: 2100, database: 0, other: 650 },
    forecast: 13500,
    budget: 15000,
    budgetUtilization: 83,
  },
  {
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    team: 'Payments',
    currentMonth: 8900,
    previousMonth: 8500,
    trend: 4.7,
    breakdown: { compute: 4500, storage: 800, network: 1200, database: 2000, other: 400 },
    forecast: 9200,
    budget: 10000,
    budgetUtilization: 89,
  },
  {
    applicationId: 'app-5',
    applicationName: 'Data Pipeline',
    team: 'Data Platform',
    currentMonth: 24500,
    previousMonth: 22000,
    trend: 11.4,
    breakdown: { compute: 15000, storage: 6000, network: 1500, database: 1500, other: 500 },
    forecast: 26000,
    budget: 25000,
    budgetUtilization: 98,
  },
];

// ============================================================================
// Activities
// ============================================================================

export const activities: Activity[] = [
  {
    id: 'act-1',
    type: 'deployment',
    title: 'Deployment succeeded',
    description: 'API Gateway v2.14.3 deployed to production',
    user: 'Sarah Chen',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    timestamp: '2026-01-25T10:45:00Z',
  },
  {
    id: 'act-2',
    type: 'incident',
    title: 'Incident created',
    description: 'Elevated error rates in Notification Service',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    timestamp: '2026-01-25T10:15:00Z',
  },
  {
    id: 'act-3',
    type: 'approval',
    title: 'Approval requested',
    description: 'User Dashboard v4.2.0 awaiting production approval',
    user: 'Taylor Kim',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    timestamp: '2026-01-25T09:00:00Z',
  },
  {
    id: 'act-4',
    type: 'deployment',
    title: 'Deployment started',
    description: 'Payment Service v3.8.1 deploying to staging',
    user: 'Alex Rivera',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    timestamp: '2026-01-25T11:00:00Z',
  },
  {
    id: 'act-5',
    type: 'config-change',
    title: 'Configuration updated',
    description: 'Database connection pool increased to 100',
    user: 'Jordan Lee',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    timestamp: '2026-01-24T18:00:00Z',
  },
];

// ============================================================================
// Notifications
// ============================================================================

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'approval-request',
    title: 'Approval Required',
    message: 'User Dashboard v4.2.0 is ready for production deployment',
    read: false,
    timestamp: '2026-01-25T09:00:00Z',
    actionUrl: '/deploy/deployments/deploy-3',
  },
  {
    id: 'notif-2',
    type: 'incident',
    title: 'New Incident',
    message: 'Elevated error rates detected in Notification Service',
    read: true,
    timestamp: '2026-01-25T10:15:00Z',
    actionUrl: '/manage/incidents/inc-1',
  },
  {
    id: 'notif-3',
    type: 'deployment',
    title: 'Deployment Complete',
    message: 'API Gateway v2.14.3 successfully deployed to production',
    read: true,
    timestamp: '2026-01-25T10:45:00Z',
    actionUrl: '/deploy/deployments/deploy-1',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'On-Call Reminder',
    message: 'Your on-call shift starts tomorrow at 9:00 AM',
    read: false,
    timestamp: '2026-01-25T08:00:00Z',
  },
];

// ============================================================================
// Search Results
// ============================================================================

export const generateSearchResults = (query: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // Search applications
  applications.forEach((app) => {
    if (
      app.name.toLowerCase().includes(lowerQuery) ||
      app.displayName.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: app.id,
        type: 'application',
        title: app.displayName,
        subtitle: app.team.name,
        description: app.description,
        url: `/discover/catalog/${app.id}`,
        relevance: app.name.toLowerCase().startsWith(lowerQuery) ? 1 : 0.7,
      });
    }
  });

  // Search extensions
  extensions.forEach((ext) => {
    if (
      ext.name.toLowerCase().includes(lowerQuery) ||
      ext.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: ext.id,
        type: 'extension',
        title: ext.name,
        subtitle: ext.category,
        description: ext.shortDescription,
        url: `/extensions/${ext.id}`,
        relevance: ext.name.toLowerCase().startsWith(lowerQuery) ? 0.9 : 0.6,
      });
    }
  });

  // Search teams
  teams.forEach((team) => {
    if (
      team.name.toLowerCase().includes(lowerQuery) ||
      team.slug.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: team.id,
        type: 'team',
        title: team.name,
        subtitle: `${team.members.length} members`,
        description: team.description,
        url: `/discover/teams/${team.id}`,
        relevance: team.name.toLowerCase().startsWith(lowerQuery) ? 0.85 : 0.5,
      });
    }
  });

  return results.sort((a, b) => b.relevance - a.relevance);
};
