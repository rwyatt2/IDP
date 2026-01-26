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
  Resource,
} from '@/types';

// ============================================================================
// Helper Functions
// ============================================================================

const generateId = (prefix: string, index: number) => `${prefix}-${index}`;

const randomFromArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateTimestamp = (daysAgo: number, hoursOffset = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursOffset);
  return date.toISOString();
};

// ============================================================================
// Users
// ============================================================================

export const allUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'tech-lead',
    team: 'Platform Engineering',
    teams: ['Platform Engineering', 'Infrastructure'],
    permissions: ['deploy:prod', 'approve:deployments', 'manage:team', 'admin:extensions'],
    preferences: {
      theme: 'dark',
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
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: true },
    },
    onCallStatus: { isOnCall: true, schedule: 'Platform Primary', endsAt: '2026-01-26T09:00:00Z', escalationPolicy: 'Platform Escalation' },
  },
  {
    id: 'user-2',
    name: 'Mike Johnson',
    email: 'mike.j@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'developer',
    team: 'Platform Engineering',
    teams: ['Platform Engineering'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['system-catalog'],
      notifications: { email: true, push: false, slack: true, deployments: true, incidents: true, approvals: false },
    },
  },
  {
    id: 'user-3',
    name: 'Emily Wang',
    email: 'emily.w@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'developer',
    team: 'Platform Engineering',
    teams: ['Platform Engineering'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['observability'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: false },
    },
    onCallStatus: { isOnCall: false },
  },
  {
    id: 'user-4',
    name: 'Alex Rivera',
    email: 'alex.r@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'tech-lead',
    team: 'Payments',
    teams: ['Payments'],
    permissions: ['deploy:prod', 'approve:deployments', 'manage:team'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['release-management', 'security-scanner'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: true },
    },
    onCallStatus: { isOnCall: false },
  },
  {
    id: 'user-5',
    name: 'Jordan Lee',
    email: 'jordan.l@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    role: 'developer',
    team: 'Payments',
    teams: ['Payments'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['cost-management'],
      notifications: { email: true, push: false, slack: true, deployments: true, incidents: true, approvals: false },
    },
  },
  {
    id: 'user-6',
    name: 'Taylor Kim',
    email: 'taylor.k@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    role: 'tech-lead',
    team: 'User Experience',
    teams: ['User Experience'],
    permissions: ['deploy:prod', 'approve:deployments', 'manage:team'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['system-catalog', 'api-docs'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: true },
    },
  },
  {
    id: 'user-7',
    name: 'Casey Morgan',
    email: 'casey.m@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    role: 'developer',
    team: 'User Experience',
    teams: ['User Experience'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['api-docs'],
      notifications: { email: true, push: false, slack: true, deployments: true, incidents: false, approvals: false },
    },
  },
  {
    id: 'user-8',
    name: 'Sam Patel',
    email: 'sam.p@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    role: 'tech-lead',
    team: 'Data Platform',
    teams: ['Data Platform'],
    permissions: ['deploy:prod', 'approve:deployments', 'manage:team'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['observability', 'cost-management'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: true },
    },
  },
  {
    id: 'user-9',
    name: 'Chris Zhang',
    email: 'chris.z@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    role: 'developer',
    team: 'Data Platform',
    teams: ['Data Platform'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['cost-management'],
      notifications: { email: true, push: false, slack: true, deployments: true, incidents: true, approvals: false },
    },
  },
  {
    id: 'user-10',
    name: 'Dana Williams',
    email: 'dana.w@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dana',
    role: 'manager',
    team: 'Engineering',
    teams: ['Platform Engineering', 'Payments', 'User Experience', 'Data Platform'],
    permissions: ['deploy:prod', 'approve:deployments', 'manage:all', 'admin:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['cost-management', 'observability'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: true },
    },
  },
  {
    id: 'user-11',
    name: 'Robin Martinez',
    email: 'robin.m@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robin',
    role: 'executive',
    team: 'Engineering',
    teams: ['Engineering'],
    permissions: ['read:all', 'admin:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['cost-management'],
      notifications: { email: true, push: false, slack: false, deployments: false, incidents: true, approvals: false },
    },
  },
  {
    id: 'user-12',
    name: 'Jamie Park',
    email: 'jamie.p@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    role: 'developer',
    team: 'Platform Engineering',
    teams: ['Platform Engineering'],
    permissions: ['deploy:staging', 'read:all'],
    preferences: {
      theme: 'dark',
      dashboardLayout: { widgets: [] },
      favoriteExtensions: ['pipeline-automation'],
      notifications: { email: true, push: true, slack: true, deployments: true, incidents: true, approvals: false },
    },
  },
];

export const currentUser = allUsers[0];

// ============================================================================
// Teams
// ============================================================================

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Platform Engineering',
    slug: 'platform-engineering',
    description: 'Building internal tools and infrastructure for developer productivity',
    lead: 'user-1',
    slackChannel: '#platform-eng',
    email: 'platform@company.com',
    oncallSchedule: 'Platform Primary',
    members: [
      { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'Senior Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      { id: 'user-3', name: 'Emily Wang', email: 'emily.w@company.com', role: 'Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
      { id: 'user-12', name: 'Jamie Park', email: 'jamie.p@company.com', role: 'Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie' },
    ],
  },
  {
    id: 'team-2',
    name: 'Payments',
    slug: 'payments',
    description: 'Payment processing, billing, and subscription management',
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
    description: 'Frontend applications, design systems, and user-facing products',
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
    description: 'Data pipelines, analytics infrastructure, and ML platform',
    lead: 'user-8',
    slackChannel: '#data-platform',
    email: 'data@company.com',
    oncallSchedule: 'Data Primary',
    members: [
      { id: 'user-8', name: 'Sam Patel', email: 'sam.p@company.com', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
      { id: 'user-9', name: 'Chris Zhang', email: 'chris.z@company.com', role: 'Data Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    ],
  },
  {
    id: 'team-5',
    name: 'Security',
    slug: 'security',
    description: 'Application security, compliance, and identity management',
    lead: 'user-10',
    slackChannel: '#security',
    email: 'security@company.com',
    oncallSchedule: 'Security Primary',
    members: [
      { id: 'user-10', name: 'Dana Williams', email: 'dana.w@company.com', role: 'Security Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dana' },
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
    metrics: { requestsPerSecond: 15420, latencyP50: 12, latencyP99: 89, errorRate: 0.02, uptime: 99.99, instances: 12, cpu: 45, memory: 62 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: true, lastAudit: '2025-12-15', certifications: ['SOC2 Type II', 'PCI DSS Level 1'] },
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
    metrics: { requestsPerSecond: 2340, latencyP50: 45, latencyP99: 234, errorRate: 0.01, uptime: 99.995, instances: 8, cpu: 38, memory: 71 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: true, lastAudit: '2025-11-20', certifications: ['SOC2 Type II', 'PCI DSS Level 1'] },
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
    metrics: { requestsPerSecond: 8920, latencyP50: 180, latencyP99: 890, errorRate: 0.05, uptime: 99.95, instances: 1, cpu: 0, memory: 0 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
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
    metrics: { requestsPerSecond: 890, latencyP50: 120, latencyP99: 450, errorRate: 2.3, uptime: 98.5, instances: 4, cpu: 52, memory: 48 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
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
    metrics: { requestsPerSecond: 0, latencyP50: 0, latencyP99: 0, errorRate: 0.1, uptime: 99.8, instances: 3, cpu: 78, memory: 85 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
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
    metrics: { requestsPerSecond: 5670, latencyP50: 8, latencyP99: 45, errorRate: 0.005, uptime: 99.999, instances: 6, cpu: 25, memory: 40 },
    compliance: { soc2: true, gdpr: true, hipaa: true, pci: true, lastAudit: '2025-12-01', certifications: ['SOC2 Type II', 'HIPAA', 'PCI DSS Level 1'] },
    tags: ['critical', 'security', 'auth'],
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 'app-7',
    name: 'inventory-service',
    displayName: 'Inventory Service',
    description: 'Real-time inventory management and stock tracking',
    type: 'backend',
    status: 'healthy',
    team: teams[1],
    owners: ['user-4', 'user-5'],
    tier: 'tier-2',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/inventory-service',
    language: 'Java',
    framework: 'Spring Boot',
    dependencies: [
      { id: 'dep-17', name: 'postgres-inventory', type: 'database', status: 'healthy', critical: true },
      { id: 'dep-18', name: 'kafka-cluster', type: 'queue', status: 'healthy', critical: true },
    ],
    metrics: { requestsPerSecond: 1240, latencyP50: 35, latencyP99: 180, errorRate: 0.03, uptime: 99.95, instances: 4, cpu: 42, memory: 58 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
    tags: ['inventory', 'ecommerce'],
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2026-01-24T18:30:00Z',
  },
  {
    id: 'app-8',
    name: 'search-service',
    displayName: 'Search Service',
    description: 'Full-text search and recommendation engine',
    type: 'service',
    status: 'healthy',
    team: teams[3],
    owners: ['user-8', 'user-9'],
    tier: 'tier-2',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/search-service',
    language: 'Python',
    framework: 'FastAPI',
    dependencies: [
      { id: 'dep-19', name: 'elasticsearch-cluster', type: 'database', status: 'healthy', critical: true },
      { id: 'dep-20', name: 'redis-cache', type: 'cache', status: 'healthy', critical: false },
    ],
    metrics: { requestsPerSecond: 3450, latencyP50: 25, latencyP99: 120, errorRate: 0.02, uptime: 99.97, instances: 6, cpu: 55, memory: 72 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
    tags: ['search', 'recommendations', 'ml'],
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2026-01-25T06:00:00Z',
  },
  {
    id: 'app-9',
    name: 'mobile-bff',
    displayName: 'Mobile BFF',
    description: 'Backend for frontend service optimized for mobile clients',
    type: 'backend',
    status: 'healthy',
    team: teams[2],
    owners: ['user-6', 'user-7'],
    tier: 'tier-2',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/mobile-bff',
    language: 'TypeScript',
    framework: 'Node.js',
    dependencies: [
      { id: 'dep-21', name: 'api-gateway', type: 'service', status: 'healthy', critical: true },
      { id: 'dep-22', name: 'redis-mobile', type: 'cache', status: 'healthy', critical: false },
    ],
    metrics: { requestsPerSecond: 4560, latencyP50: 45, latencyP99: 210, errorRate: 0.04, uptime: 99.92, instances: 5, cpu: 35, memory: 48 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
    tags: ['mobile', 'bff', 'api'],
    createdAt: '2024-07-10T09:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'app-10',
    name: 'analytics-collector',
    displayName: 'Analytics Collector',
    description: 'Event collection and processing for product analytics',
    type: 'service',
    status: 'healthy',
    team: teams[3],
    owners: ['user-8'],
    tier: 'tier-2',
    environment: ['development', 'staging', 'production'],
    repository: 'github.com/company/analytics-collector',
    language: 'Go',
    framework: 'Custom',
    dependencies: [
      { id: 'dep-23', name: 'kafka-analytics', type: 'queue', status: 'healthy', critical: true },
      { id: 'dep-24', name: 'clickhouse', type: 'database', status: 'healthy', critical: true },
    ],
    metrics: { requestsPerSecond: 25000, latencyP50: 5, latencyP99: 25, errorRate: 0.001, uptime: 99.99, instances: 8, cpu: 68, memory: 55 },
    compliance: { soc2: true, gdpr: true, hipaa: false, pci: false, certifications: ['SOC2 Type II'] },
    tags: ['analytics', 'events', 'high-throughput'],
    createdAt: '2024-09-01T11:00:00Z',
    updatedAt: '2026-01-25T12:00:00Z',
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
  { id: 'my-applications', type: 'my-applications', title: 'My Applications', description: 'Quick access to your owned and starred applications', size: 'medium' },
  { id: 'on-call-schedule', type: 'on-call-schedule', title: 'On-Call Schedule', description: 'View your on-call rotation and upcoming shifts', size: 'small' },
  { id: 'recent-deployments', type: 'recent-deployments', title: 'Recent Deployments', description: 'Track deployment activity across your applications', size: 'medium' },
  { id: 'cost-trends', type: 'cost-trends', title: 'Cost Trends', description: 'Monitor cloud spending and budget utilization', size: 'medium' },
  { id: 'system-health', type: 'system-health', title: 'System Health', description: 'Overall health status of your services', size: 'small' },
  { id: 'team-projects', type: 'team-projects', title: 'Team Projects', description: 'Active projects and initiatives for your team', size: 'medium' },
  { id: 'pending-approvals', type: 'pending-approvals', title: 'Pending Approvals', description: 'Deployment and change approvals awaiting your review', size: 'small' },
  { id: 'performance-metrics', type: 'performance-metrics', title: 'Performance Metrics', description: 'Key performance indicators across services', size: 'large' },
  { id: 'quick-actions', type: 'quick-actions', title: 'Quick Actions', description: 'Shortcuts to common tasks', size: 'small' },
  { id: 'recent-activity', type: 'recent-activity', title: 'Recent Activity', description: 'Latest activity across your applications', size: 'medium' },
  { id: 'alerts', type: 'alerts', title: 'Active Alerts', description: 'Current alerts and incidents', size: 'small' },
  { id: 'resources', type: 'resources', title: 'Resource Usage', description: 'CPU, memory, and storage utilization', size: 'medium' },
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
    triggeredAt: generateTimestamp(0, 3),
    completedAt: generateTimestamp(0, 2.75),
    duration: 900,
    commits: [
      { sha: 'abc1234', message: 'fix: rate limiting edge case', author: 'Sarah Chen', timestamp: generateTimestamp(0, 5) },
      { sha: 'def5678', message: 'chore: update dependencies', author: 'Mike Johnson', timestamp: generateTimestamp(0, 6) },
    ],
    artifacts: [{ name: 'api-gateway:v2.14.3', type: 'docker', size: 245000000, checksum: 'sha256:abc123' }],
    approvals: [{ id: 'apr-1', approver: 'Alex Rivera', status: 'approved', timestamp: generateTimestamp(0, 3.1) }],
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
    triggeredAt: generateTimestamp(0, 0.5),
    commits: [
      { sha: 'ghi9012', message: 'feat: add Apple Pay support', author: 'Alex Rivera', timestamp: generateTimestamp(0, 2) },
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
    triggeredAt: generateTimestamp(0, 5),
    commits: [
      { sha: 'jkl3456', message: 'feat: redesigned settings page', author: 'Taylor Kim', timestamp: generateTimestamp(1, 0) },
      { sha: 'mno7890', message: 'fix: accessibility improvements', author: 'Casey Morgan', timestamp: generateTimestamp(1, 2) },
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
    triggeredAt: generateTimestamp(1, 0),
    completedAt: generateTimestamp(1, -0.25),
    duration: 900,
    commits: [
      { sha: 'pqr1234', message: 'feat: batch notification support', author: 'Emily Wang', timestamp: generateTimestamp(1, 4) },
    ],
    artifacts: [{ name: 'notification-service:v1.12.0', type: 'docker', size: 189000000, checksum: 'sha256:jkl012' }],
    approvals: [{ id: 'apr-3', approver: 'Sarah Chen', status: 'approved', timestamp: generateTimestamp(1, 0.1) }],
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
    triggeredAt: generateTimestamp(1, 6),
    completedAt: generateTimestamp(1, 5.8),
    duration: 720,
    commits: [
      { sha: 'stu5678', message: 'security: patch CVE-2026-1234', author: 'Sarah Chen', timestamp: generateTimestamp(1, 8) },
    ],
    artifacts: [{ name: 'auth-service:v5.1.2', type: 'docker', size: 156000000, checksum: 'sha256:mno345' }],
    approvals: [
      { id: 'apr-4', approver: 'Mike Johnson', status: 'approved', timestamp: generateTimestamp(1, 6.1) },
      { id: 'apr-5', approver: 'Alex Rivera', status: 'approved', timestamp: generateTimestamp(1, 6.05) },
    ],
    canRollback: true,
  },
  {
    id: 'deploy-6',
    applicationId: 'app-7',
    applicationName: 'Inventory Service',
    version: 'v2.5.0',
    environment: 'production',
    status: 'succeeded',
    triggeredBy: 'Jordan Lee',
    triggeredAt: generateTimestamp(2, 4),
    completedAt: generateTimestamp(2, 3.75),
    duration: 600,
    commits: [
      { sha: 'vwx9012', message: 'feat: real-time stock updates', author: 'Jordan Lee', timestamp: generateTimestamp(2, 8) },
    ],
    artifacts: [{ name: 'inventory-service:v2.5.0', type: 'docker', size: 178000000, checksum: 'sha256:pqr678' }],
    approvals: [{ id: 'apr-6', approver: 'Alex Rivera', status: 'approved', timestamp: generateTimestamp(2, 4.1) }],
    canRollback: true,
  },
  {
    id: 'deploy-7',
    applicationId: 'app-8',
    applicationName: 'Search Service',
    version: 'v3.1.2',
    environment: 'staging',
    status: 'succeeded',
    triggeredBy: 'Chris Zhang',
    triggeredAt: generateTimestamp(0, 8),
    completedAt: generateTimestamp(0, 7.75),
    duration: 540,
    commits: [
      { sha: 'yza3456', message: 'perf: optimize query performance', author: 'Chris Zhang', timestamp: generateTimestamp(0, 12) },
    ],
    artifacts: [{ name: 'search-service:v3.1.2', type: 'docker', size: 201000000, checksum: 'sha256:stu901' }],
    approvals: [],
    canRollback: true,
  },
  {
    id: 'deploy-8',
    applicationId: 'app-9',
    applicationName: 'Mobile BFF',
    version: 'v1.8.5',
    environment: 'production',
    status: 'succeeded',
    triggeredBy: 'Casey Morgan',
    triggeredAt: generateTimestamp(3, 2),
    completedAt: generateTimestamp(3, 1.8),
    duration: 480,
    commits: [
      { sha: 'bcd7890', message: 'fix: improve caching strategy', author: 'Casey Morgan', timestamp: generateTimestamp(3, 6) },
    ],
    artifacts: [{ name: 'mobile-bff:v1.8.5', type: 'docker', size: 134000000, checksum: 'sha256:vwx234' }],
    approvals: [{ id: 'apr-7', approver: 'Taylor Kim', status: 'approved', timestamp: generateTimestamp(3, 2.1) }],
    canRollback: true,
  },
  {
    id: 'deploy-9',
    applicationId: 'app-10',
    applicationName: 'Analytics Collector',
    version: 'v2.0.0',
    environment: 'production',
    status: 'succeeded',
    triggeredBy: 'Sam Patel',
    triggeredAt: generateTimestamp(4, 3),
    completedAt: generateTimestamp(4, 2.75),
    duration: 660,
    commits: [
      { sha: 'efg1234', message: 'feat: clickhouse migration', author: 'Sam Patel', timestamp: generateTimestamp(4, 8) },
      { sha: 'hij5678', message: 'docs: update schema documentation', author: 'Chris Zhang', timestamp: generateTimestamp(4, 10) },
    ],
    artifacts: [{ name: 'analytics-collector:v2.0.0', type: 'docker', size: 167000000, checksum: 'sha256:yza567' }],
    approvals: [{ id: 'apr-8', approver: 'Dana Williams', status: 'approved', timestamp: generateTimestamp(4, 3.2) }],
    canRollback: true,
  },
  {
    id: 'deploy-10',
    applicationId: 'app-5',
    applicationName: 'Data Pipeline',
    version: 'v4.3.1',
    environment: 'production',
    status: 'rolled-back',
    triggeredBy: 'Sam Patel',
    triggeredAt: generateTimestamp(5, 2),
    completedAt: generateTimestamp(5, 1.5),
    duration: 1200,
    commits: [
      { sha: 'klm9012', message: 'feat: new DAG scheduling', author: 'Sam Patel', timestamp: generateTimestamp(5, 6) },
    ],
    artifacts: [{ name: 'data-pipeline:v4.3.1', type: 'docker', size: 289000000, checksum: 'sha256:bcd890' }],
    approvals: [{ id: 'apr-9', approver: 'Dana Williams', status: 'approved', timestamp: generateTimestamp(5, 2.1) }],
    rollbackOf: 'deploy-prev-5',
    canRollback: false,
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
    createdAt: generateTimestamp(0, 4),
    updatedAt: generateTimestamp(0, 1),
    timeline: [
      { id: 'evt-1', type: 'created', timestamp: generateTimestamp(0, 4), user: 'System', content: 'Incident created from alert' },
      { id: 'evt-2', type: 'status-change', timestamp: generateTimestamp(0, 3.5), user: 'Emily Wang', content: 'Status changed to investigating' },
      { id: 'evt-3', type: 'comment', timestamp: generateTimestamp(0, 2), user: 'Emily Wang', content: 'Confirmed issue is on SendGrid side. Opened ticket with their support.' },
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
    createdAt: generateTimestamp(1, 8),
    updatedAt: generateTimestamp(0, 6),
    timeline: [
      { id: 'evt-4', type: 'created', timestamp: generateTimestamp(1, 8), user: 'System', content: 'Incident created from alert' },
      { id: 'evt-5', type: 'status-change', timestamp: generateTimestamp(1, 7.5), user: 'Jordan Lee', content: 'Investigating connection patterns' },
      { id: 'evt-6', type: 'comment', timestamp: generateTimestamp(1, 4), user: 'Jordan Lee', content: 'Increased pool size from 50 to 100 connections' },
      { id: 'evt-7', type: 'status-change', timestamp: generateTimestamp(0, 6), user: 'Jordan Lee', content: 'Monitoring after fix deployment' },
    ],
  },
  {
    id: 'inc-3',
    title: 'Intermittent 502 errors from API Gateway',
    description: 'Upstream timeouts causing 502 errors during high load',
    severity: 'high',
    status: 'resolved',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    assignee: 'Sarah Chen',
    team: 'Platform Engineering',
    createdAt: generateTimestamp(3, 12),
    updatedAt: generateTimestamp(3, 2),
    resolvedAt: generateTimestamp(3, 2),
    timeline: [
      { id: 'evt-8', type: 'created', timestamp: generateTimestamp(3, 12), user: 'System', content: 'Alert triggered: Error rate exceeded 1%' },
      { id: 'evt-9', type: 'status-change', timestamp: generateTimestamp(3, 11), user: 'Sarah Chen', content: 'Investigating load patterns' },
      { id: 'evt-10', type: 'comment', timestamp: generateTimestamp(3, 8), user: 'Mike Johnson', content: 'Identified slow upstream service' },
      { id: 'evt-11', type: 'comment', timestamp: generateTimestamp(3, 4), user: 'Sarah Chen', content: 'Deployed timeout adjustment' },
      { id: 'evt-12', type: 'resolved', timestamp: generateTimestamp(3, 2), user: 'Sarah Chen', content: 'Incident resolved - timeout adjustments effective' },
    ],
  },
  {
    id: 'inc-4',
    title: 'Search latency degradation',
    description: 'Elasticsearch cluster experiencing high query latency',
    severity: 'medium',
    status: 'resolved',
    applicationId: 'app-8',
    applicationName: 'Search Service',
    assignee: 'Chris Zhang',
    team: 'Data Platform',
    createdAt: generateTimestamp(5, 6),
    updatedAt: generateTimestamp(5, 1),
    resolvedAt: generateTimestamp(5, 1),
    timeline: [
      { id: 'evt-13', type: 'created', timestamp: generateTimestamp(5, 6), user: 'System', content: 'P99 latency exceeded threshold' },
      { id: 'evt-14', type: 'status-change', timestamp: generateTimestamp(5, 5), user: 'Chris Zhang', content: 'Investigating cluster health' },
      { id: 'evt-15', type: 'comment', timestamp: generateTimestamp(5, 3), user: 'Chris Zhang', content: 'Rebalancing shards across nodes' },
      { id: 'evt-16', type: 'resolved', timestamp: generateTimestamp(5, 1), user: 'Chris Zhang', content: 'Shard rebalancing complete, latency normalized' },
    ],
  },
  {
    id: 'inc-5',
    title: 'Memory leak in Mobile BFF',
    description: 'Gradual memory increase leading to OOM errors',
    severity: 'low',
    status: 'resolved',
    applicationId: 'app-9',
    applicationName: 'Mobile BFF',
    assignee: 'Casey Morgan',
    team: 'User Experience',
    createdAt: generateTimestamp(7, 10),
    updatedAt: generateTimestamp(6, 2),
    resolvedAt: generateTimestamp(6, 2),
    timeline: [
      { id: 'evt-17', type: 'created', timestamp: generateTimestamp(7, 10), user: 'System', content: 'Memory usage alert triggered' },
      { id: 'evt-18', type: 'comment', timestamp: generateTimestamp(7, 6), user: 'Casey Morgan', content: 'Analyzing heap dumps' },
      { id: 'evt-19', type: 'comment', timestamp: generateTimestamp(6, 8), user: 'Casey Morgan', content: 'Found leak in cache module, fix in progress' },
      { id: 'evt-20', type: 'resolved', timestamp: generateTimestamp(6, 2), user: 'Taylor Kim', content: 'Fix deployed, memory stable' },
    ],
  },
  {
    id: 'inc-6',
    title: 'Authentication service high latency',
    description: 'Token validation taking longer than expected',
    severity: 'critical',
    status: 'resolved',
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    assignee: 'Sarah Chen',
    team: 'Platform Engineering',
    createdAt: generateTimestamp(10, 4),
    updatedAt: generateTimestamp(10, 1),
    resolvedAt: generateTimestamp(10, 1),
    timeline: [
      { id: 'evt-21', type: 'created', timestamp: generateTimestamp(10, 4), user: 'System', content: 'Critical: Auth latency exceeded 500ms' },
      { id: 'evt-22', type: 'status-change', timestamp: generateTimestamp(10, 3.8), user: 'Sarah Chen', content: 'Investigating immediately' },
      { id: 'evt-23', type: 'comment', timestamp: generateTimestamp(10, 2), user: 'Sarah Chen', content: 'Redis connection issue identified' },
      { id: 'evt-24', type: 'resolved', timestamp: generateTimestamp(10, 1), user: 'Sarah Chen', content: 'Redis failover complete, latency restored' },
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
    message: 'Error rate exceeded 2% threshold in Notification Service',
    severity: 'warning',
    source: 'Observability Hub',
    applicationId: 'app-4',
    timestamp: generateTimestamp(0, 4),
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
    timestamp: generateTimestamp(0, 5),
    acknowledged: false,
  },
  {
    id: 'alert-3',
    title: 'SSL certificate expiring',
    message: 'Certificate for api.company.com expires in 14 days',
    severity: 'warning',
    source: 'Security Scanner',
    timestamp: generateTimestamp(0, 8),
    acknowledged: false,
  },
  {
    id: 'alert-4',
    title: 'Budget threshold reached',
    message: 'Data Pipeline spending at 98% of monthly budget',
    severity: 'warning',
    source: 'Cost Management',
    applicationId: 'app-5',
    timestamp: generateTimestamp(0, 12),
    acknowledged: true,
    acknowledgedBy: 'Sam Patel',
  },
  {
    id: 'alert-5',
    title: 'High CPU usage',
    message: 'Analytics Collector CPU usage at 85%',
    severity: 'warning',
    source: 'Observability Hub',
    applicationId: 'app-10',
    timestamp: generateTimestamp(0, 6),
    acknowledged: false,
  },
  {
    id: 'alert-6',
    title: 'Memory pressure',
    message: 'Data Pipeline memory usage at 92%',
    severity: 'warning',
    source: 'Observability Hub',
    applicationId: 'app-5',
    timestamp: generateTimestamp(0, 2),
    acknowledged: false,
  },
  {
    id: 'alert-7',
    title: 'Dependency vulnerability',
    message: 'Critical CVE found in lodash@4.17.20',
    severity: 'critical',
    source: 'Security Scanner',
    applicationId: 'app-3',
    timestamp: generateTimestamp(1, 0),
    acknowledged: true,
    acknowledgedBy: 'Taylor Kim',
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
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    team: 'User Experience',
    currentMonth: 2100,
    previousMonth: 1950,
    trend: 7.7,
    breakdown: { compute: 200, storage: 100, network: 1500, database: 0, other: 300 },
    forecast: 2300,
    budget: 3000,
    budgetUtilization: 70,
  },
  {
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    team: 'Platform Engineering',
    currentMonth: 4200,
    previousMonth: 3800,
    trend: 10.5,
    breakdown: { compute: 2100, storage: 400, network: 800, database: 600, other: 300 },
    forecast: 4600,
    budget: 5000,
    budgetUtilization: 84,
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
  {
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    team: 'Platform Engineering',
    currentMonth: 5600,
    previousMonth: 5400,
    trend: 3.7,
    breakdown: { compute: 3200, storage: 400, network: 600, database: 1200, other: 200 },
    forecast: 5800,
    budget: 7000,
    budgetUtilization: 80,
  },
  {
    applicationId: 'app-7',
    applicationName: 'Inventory Service',
    team: 'Payments',
    currentMonth: 3400,
    previousMonth: 3200,
    trend: 6.3,
    breakdown: { compute: 1800, storage: 500, network: 400, database: 600, other: 100 },
    forecast: 3600,
    budget: 4000,
    budgetUtilization: 85,
  },
  {
    applicationId: 'app-8',
    applicationName: 'Search Service',
    team: 'Data Platform',
    currentMonth: 8200,
    previousMonth: 7800,
    trend: 5.1,
    breakdown: { compute: 4500, storage: 2000, network: 800, database: 700, other: 200 },
    forecast: 8600,
    budget: 9000,
    budgetUtilization: 91,
  },
  {
    applicationId: 'app-9',
    applicationName: 'Mobile BFF',
    team: 'User Experience',
    currentMonth: 2800,
    previousMonth: 2600,
    trend: 7.7,
    breakdown: { compute: 1600, storage: 200, network: 700, database: 200, other: 100 },
    forecast: 3000,
    budget: 3500,
    budgetUtilization: 80,
  },
  {
    applicationId: 'app-10',
    applicationName: 'Analytics Collector',
    team: 'Data Platform',
    currentMonth: 6800,
    previousMonth: 6200,
    trend: 9.7,
    breakdown: { compute: 4200, storage: 1200, network: 800, database: 400, other: 200 },
    forecast: 7400,
    budget: 8000,
    budgetUtilization: 85,
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
    timestamp: generateTimestamp(0, 2.75),
  },
  {
    id: 'act-2',
    type: 'incident',
    title: 'Incident created',
    description: 'Elevated error rates in Notification Service',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    timestamp: generateTimestamp(0, 4),
  },
  {
    id: 'act-3',
    type: 'approval',
    title: 'Approval requested',
    description: 'User Dashboard v4.2.0 awaiting production approval',
    user: 'Taylor Kim',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    timestamp: generateTimestamp(0, 5),
  },
  {
    id: 'act-4',
    type: 'deployment',
    title: 'Deployment started',
    description: 'Payment Service v3.8.1 deploying to staging',
    user: 'Alex Rivera',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    timestamp: generateTimestamp(0, 0.5),
  },
  {
    id: 'act-5',
    type: 'config-change',
    title: 'Configuration updated',
    description: 'Database connection pool increased to 100',
    user: 'Jordan Lee',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    timestamp: generateTimestamp(1, 4),
  },
  {
    id: 'act-6',
    type: 'deployment',
    title: 'Deployment succeeded',
    description: 'Search Service v3.1.2 deployed to staging',
    user: 'Chris Zhang',
    applicationId: 'app-8',
    applicationName: 'Search Service',
    timestamp: generateTimestamp(0, 7.75),
  },
  {
    id: 'act-7',
    type: 'deployment',
    title: 'Deployment succeeded',
    description: 'Authentication Service v5.1.2 deployed to production',
    user: 'Sarah Chen',
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    timestamp: generateTimestamp(1, 5.8),
  },
  {
    id: 'act-8',
    type: 'incident',
    title: 'Incident resolved',
    description: 'Database connection pool exhaustion - fixed',
    user: 'Jordan Lee',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    timestamp: generateTimestamp(0, 6),
  },
  {
    id: 'act-9',
    type: 'alert',
    title: 'Alert acknowledged',
    description: 'Budget threshold alert for Data Pipeline',
    user: 'Sam Patel',
    applicationId: 'app-5',
    applicationName: 'Data Pipeline',
    timestamp: generateTimestamp(0, 11),
  },
  {
    id: 'act-10',
    type: 'team-update',
    title: 'Team member added',
    description: 'Jamie Park joined Platform Engineering',
    user: 'Sarah Chen',
    timestamp: generateTimestamp(2, 0),
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
    timestamp: generateTimestamp(0, 5),
    actionUrl: '/deploy/deployments/deploy-3',
  },
  {
    id: 'notif-2',
    type: 'incident',
    title: 'New Incident',
    message: 'Elevated error rates detected in Notification Service',
    read: true,
    timestamp: generateTimestamp(0, 4),
    actionUrl: '/manage/incidents/inc-1',
  },
  {
    id: 'notif-3',
    type: 'deployment',
    title: 'Deployment Complete',
    message: 'API Gateway v2.14.3 successfully deployed to production',
    read: true,
    timestamp: generateTimestamp(0, 2.75),
    actionUrl: '/deploy/deployments/deploy-1',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'On-Call Reminder',
    message: 'Your on-call shift starts tomorrow at 9:00 AM',
    read: false,
    timestamp: generateTimestamp(0, 8),
  },
  {
    id: 'notif-5',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Mike Johnson mentioned you in a comment on API Gateway',
    read: true,
    timestamp: generateTimestamp(1, 2),
    actionUrl: '/discover/catalog/app-1',
  },
  {
    id: 'notif-6',
    type: 'approval-response',
    title: 'Deployment Approved',
    message: 'Alex Rivera approved Authentication Service v5.1.2',
    read: true,
    timestamp: generateTimestamp(1, 6.05),
    actionUrl: '/deploy/deployments/deploy-5',
  },
];

// ============================================================================
// Resources
// ============================================================================

export const resources: Resource[] = [
  { id: 'res-1', name: 'api-gateway-prod', type: 'container', provider: 'kubernetes', region: 'us-east-1', status: 'healthy', applicationId: 'app-1', team: 'Platform Engineering', cost: 4100, utilization: 45, tags: { environment: 'production', tier: '1' } },
  { id: 'res-2', name: 'api-gateway-staging', type: 'container', provider: 'kubernetes', region: 'us-east-1', status: 'healthy', applicationId: 'app-1', team: 'Platform Engineering', cost: 1200, utilization: 25, tags: { environment: 'staging', tier: '1' } },
  { id: 'res-3', name: 'postgres-primary', type: 'database', provider: 'aws', region: 'us-east-1', status: 'healthy', applicationId: 'app-1', team: 'Platform Engineering', cost: 2800, utilization: 62, tags: { environment: 'production', type: 'primary' } },
  { id: 'res-4', name: 'redis-cluster', type: 'cache', provider: 'aws', region: 'us-east-1', status: 'healthy', team: 'Platform Engineering', cost: 1500, utilization: 55, tags: { environment: 'production', type: 'cluster' } },
  { id: 'res-5', name: 'payment-service-prod', type: 'container', provider: 'kubernetes', region: 'us-east-1', status: 'healthy', applicationId: 'app-2', team: 'Payments', cost: 2250, utilization: 38, tags: { environment: 'production', tier: '1' } },
  { id: 'res-6', name: 'postgres-payments', type: 'database', provider: 'aws', region: 'us-east-1', status: 'healthy', applicationId: 'app-2', team: 'Payments', cost: 2000, utilization: 71, tags: { environment: 'production', pci: 'true' } },
  { id: 'res-7', name: 'kafka-cluster', type: 'queue', provider: 'aws', region: 'us-east-1', status: 'healthy', team: 'Platform Engineering', cost: 3500, utilization: 48, tags: { environment: 'production', type: 'cluster' } },
  { id: 'res-8', name: 'cdn-global', type: 'cdn', provider: 'aws', region: 'global', status: 'healthy', applicationId: 'app-3', team: 'User Experience', cost: 1500, utilization: 35, tags: { environment: 'production' } },
  { id: 'res-9', name: 'elasticsearch-cluster', type: 'database', provider: 'aws', region: 'us-east-1', status: 'healthy', applicationId: 'app-8', team: 'Data Platform', cost: 4500, utilization: 68, tags: { environment: 'production', type: 'cluster' } },
  { id: 'res-10', name: 'snowflake-warehouse', type: 'database', provider: 'gcp', region: 'us-central1', status: 'healthy', applicationId: 'app-5', team: 'Data Platform', cost: 8000, utilization: 78, tags: { environment: 'production', type: 'warehouse' } },
  { id: 'res-11', name: 'clickhouse-analytics', type: 'database', provider: 'aws', region: 'us-east-1', status: 'healthy', applicationId: 'app-10', team: 'Data Platform', cost: 3200, utilization: 65, tags: { environment: 'production' } },
  { id: 'res-12', name: 'lb-primary', type: 'load-balancer', provider: 'aws', region: 'us-east-1', status: 'healthy', team: 'Platform Engineering', cost: 800, utilization: 42, tags: { environment: 'production', type: 'application' } },
];

// ============================================================================
// Analytics & Metrics
// ============================================================================

export interface PlatformMetrics {
  deployments: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    avgDuration: number;
    byEnvironment: { production: number; staging: number; development: number };
    trend: number;
  };
  incidents: {
    total: number;
    resolved: number;
    active: number;
    mttr: number;
    bySeverity: { critical: number; high: number; medium: number; low: number };
    trend: number;
  };
  costs: {
    currentMonth: number;
    previousMonth: number;
    forecast: number;
    totalBudget: number;
    budgetUtilization: number;
    trend: number;
    byTeam: Record<string, number>;
  };
  reliability: {
    uptime: number;
    errorBudget: number;
    mtbf: number;
    p99Latency: number;
  };
}

export const platformMetrics: PlatformMetrics = {
  deployments: {
    total: 247,
    successful: 238,
    failed: 9,
    successRate: 96.4,
    avgDuration: 720,
    byEnvironment: { production: 89, staging: 112, development: 46 },
    trend: 12,
  },
  incidents: {
    total: 18,
    resolved: 16,
    active: 2,
    mttr: 32,
    bySeverity: { critical: 2, high: 4, medium: 8, low: 4 },
    trend: -15,
  },
  costs: {
    currentMonth: 78950,
    previousMonth: 72650,
    forecast: 85200,
    totalBudget: 90000,
    budgetUtilization: 87.7,
    trend: 8.7,
    byTeam: {
      'Platform Engineering': 22250,
      'Payments': 12300,
      'User Experience': 4900,
      'Data Platform': 39500,
    },
  },
  reliability: {
    uptime: 99.95,
    errorBudget: 67,
    mtbf: 12.4,
    p99Latency: 156,
  },
};

// Team-specific metrics
export interface TeamMetrics {
  teamId: string;
  teamName: string;
  deployments: number;
  successRate: number;
  mttr: string;
  incidents: number;
  services: number;
  members: number;
  costTrend: number;
  healthScore: number;
}

export const teamMetrics: TeamMetrics[] = [
  { teamId: 'team-1', teamName: 'Platform Engineering', deployments: 89, successRate: 97.8, mttr: '28m', incidents: 3, services: 4, members: 4, costTrend: 8.2, healthScore: 94 },
  { teamId: 'team-2', teamName: 'Payments', deployments: 54, successRate: 98.1, mttr: '22m', incidents: 1, services: 2, members: 2, costTrend: 5.5, healthScore: 96 },
  { teamId: 'team-3', teamName: 'User Experience', deployments: 67, successRate: 94.5, mttr: '45m', incidents: 2, services: 2, members: 2, costTrend: 7.7, healthScore: 89 },
  { teamId: 'team-4', teamName: 'Data Platform', deployments: 37, successRate: 95.2, mttr: '38m', incidents: 0, services: 3, members: 2, costTrend: 9.4, healthScore: 91 },
];

// DORA Metrics
export interface DORAMetrics {
  deploymentFrequency: { value: number; unit: string; trend: number; status: 'elite' | 'high' | 'medium' | 'low' };
  leadTime: { value: number; unit: string; trend: number; status: 'elite' | 'high' | 'medium' | 'low' };
  mttr: { value: number; unit: string; trend: number; status: 'elite' | 'high' | 'medium' | 'low' };
  changeFailureRate: { value: number; unit: string; trend: number; status: 'elite' | 'high' | 'medium' | 'low' };
}

export const doraMetrics: DORAMetrics = {
  deploymentFrequency: { value: 3.2, unit: 'per day', trend: 15, status: 'elite' },
  leadTime: { value: 2.4, unit: 'hours', trend: -8, status: 'elite' },
  mttr: { value: 45, unit: 'minutes', trend: -12, status: 'elite' },
  changeFailureRate: { value: 5.5, unit: '%', trend: -2, status: 'elite' },
};

// SLO Data
export interface SLOData {
  name: string;
  target: string;
  current: string;
  status: 'met' | 'at-risk' | 'breached';
  errorBudgetRemaining: number;
  service: string;
}

export const sloData: SLOData[] = [
  { name: 'API Availability', target: '99.9%', current: '99.97%', status: 'met', errorBudgetRemaining: 78, service: 'API Gateway' },
  { name: 'Latency P99', target: '<200ms', current: '156ms', status: 'met', errorBudgetRemaining: 85, service: 'API Gateway' },
  { name: 'Error Rate', target: '<0.5%', current: '0.23%', status: 'met', errorBudgetRemaining: 92, service: 'Payment Service' },
  { name: 'Auth Latency', target: '<100ms', current: '45ms', status: 'met', errorBudgetRemaining: 95, service: 'Authentication Service' },
  { name: 'Search Latency', target: '<150ms', current: '120ms', status: 'met', errorBudgetRemaining: 72, service: 'Search Service' },
  { name: 'Notification Delivery', target: '99%', current: '97.8%', status: 'at-risk', errorBudgetRemaining: 12, service: 'Notification Service' },
];

// Pipeline Data
export interface Pipeline {
  id: string;
  name: string;
  applicationId: string;
  applicationName: string;
  status: 'running' | 'succeeded' | 'failed' | 'pending' | 'cancelled';
  branch: string;
  commit: string;
  duration?: number;
  startedAt: string;
  completedAt?: string;
  stages: PipelineStage[];
  triggeredBy: string;
}

export interface PipelineStage {
  name: string;
  status: 'running' | 'succeeded' | 'failed' | 'pending' | 'skipped';
  duration?: number;
}

export const pipelines: Pipeline[] = [
  {
    id: 'pipe-1',
    name: 'api-gateway-main',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    status: 'succeeded',
    branch: 'main',
    commit: 'abc1234',
    duration: 480,
    startedAt: generateTimestamp(0, 4),
    completedAt: generateTimestamp(0, 3.87),
    stages: [
      { name: 'Build', status: 'succeeded', duration: 120 },
      { name: 'Test', status: 'succeeded', duration: 180 },
      { name: 'Security Scan', status: 'succeeded', duration: 60 },
      { name: 'Deploy Staging', status: 'succeeded', duration: 60 },
      { name: 'Deploy Production', status: 'succeeded', duration: 60 },
    ],
    triggeredBy: 'Sarah Chen',
  },
  {
    id: 'pipe-2',
    name: 'payment-service-main',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    status: 'running',
    branch: 'feature/apple-pay',
    commit: 'ghi9012',
    startedAt: generateTimestamp(0, 0.5),
    stages: [
      { name: 'Build', status: 'succeeded', duration: 180 },
      { name: 'Test', status: 'succeeded', duration: 240 },
      { name: 'Security Scan', status: 'running' },
      { name: 'Deploy Staging', status: 'pending' },
      { name: 'Deploy Production', status: 'pending' },
    ],
    triggeredBy: 'Alex Rivera',
  },
  {
    id: 'pipe-3',
    name: 'user-dashboard-main',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    status: 'pending',
    branch: 'main',
    commit: 'jkl3456',
    startedAt: generateTimestamp(0, 6),
    stages: [
      { name: 'Build', status: 'succeeded', duration: 90 },
      { name: 'Test', status: 'succeeded', duration: 150 },
      { name: 'Security Scan', status: 'succeeded', duration: 45 },
      { name: 'Deploy Staging', status: 'succeeded', duration: 30 },
      { name: 'Deploy Production', status: 'pending' },
    ],
    triggeredBy: 'Taylor Kim',
  },
  {
    id: 'pipe-4',
    name: 'notification-service-main',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    status: 'failed',
    branch: 'main',
    commit: 'pqr1234',
    duration: 420,
    startedAt: generateTimestamp(1, 1),
    completedAt: generateTimestamp(1, 0.88),
    stages: [
      { name: 'Build', status: 'succeeded', duration: 100 },
      { name: 'Test', status: 'succeeded', duration: 200 },
      { name: 'Security Scan', status: 'succeeded', duration: 50 },
      { name: 'Deploy Staging', status: 'succeeded', duration: 40 },
      { name: 'Deploy Production', status: 'failed', duration: 30 },
    ],
    triggeredBy: 'Emily Wang',
  },
];

// Environment Data
export interface EnvironmentConfig {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  status: 'healthy' | 'degraded' | 'maintenance';
  region: string;
  servicesDeployed: number;
  lastDeployment: string;
  approvalRequired: boolean;
  autoScale: boolean;
}

export const environments: EnvironmentConfig[] = [
  { id: 'env-1', name: 'Production US-East', type: 'production', status: 'healthy', region: 'us-east-1', servicesDeployed: 10, lastDeployment: generateTimestamp(0, 2.75), approvalRequired: true, autoScale: true },
  { id: 'env-2', name: 'Production US-West', type: 'production', status: 'healthy', region: 'us-west-2', servicesDeployed: 8, lastDeployment: generateTimestamp(0, 6), approvalRequired: true, autoScale: true },
  { id: 'env-3', name: 'Staging', type: 'staging', status: 'healthy', region: 'us-east-1', servicesDeployed: 10, lastDeployment: generateTimestamp(0, 0.5), approvalRequired: false, autoScale: false },
  { id: 'env-4', name: 'Development', type: 'development', status: 'healthy', region: 'us-east-1', servicesDeployed: 10, lastDeployment: generateTimestamp(0, 1), approvalRequired: false, autoScale: false },
  { id: 'env-5', name: 'EU-West (GDPR)', type: 'production', status: 'healthy', region: 'eu-west-1', servicesDeployed: 6, lastDeployment: generateTimestamp(1, 0), approvalRequired: true, autoScale: true },
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
      app.description.toLowerCase().includes(lowerQuery) ||
      app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
      ext.description.toLowerCase().includes(lowerQuery) ||
      ext.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
      team.slug.toLowerCase().includes(lowerQuery) ||
      team.description?.toLowerCase().includes(lowerQuery)
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

  // Search deployments
  deployments.forEach((deploy) => {
    if (
      deploy.applicationName.toLowerCase().includes(lowerQuery) ||
      deploy.version.toLowerCase().includes(lowerQuery) ||
      deploy.triggeredBy.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: deploy.id,
        type: 'deployment',
        title: `${deploy.applicationName} ${deploy.version}`,
        subtitle: `${deploy.status} - ${deploy.environment}`,
        description: `Triggered by ${deploy.triggeredBy}`,
        url: `/deploy/deployments/${deploy.id}`,
        relevance: 0.6,
      });
    }
  });

  // Search incidents
  incidents.forEach((incident) => {
    if (
      incident.title.toLowerCase().includes(lowerQuery) ||
      incident.description.toLowerCase().includes(lowerQuery) ||
      incident.applicationName?.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        id: incident.id,
        type: 'incident',
        title: incident.title,
        subtitle: `${incident.severity} - ${incident.status}`,
        description: incident.description,
        url: `/manage/incidents/${incident.id}`,
        relevance: 0.65,
      });
    }
  });

  return results.sort((a, b) => b.relevance - a.relevance);
};

// ============================================================================
// Helper exports for specific use cases
// ============================================================================

export const getApplicationsByTeam = (teamId: string) => 
  applications.filter(app => app.team.id === teamId);

export const getDeploymentsByApplication = (appId: string) =>
  deployments.filter(d => d.applicationId === appId);

export const getIncidentsByApplication = (appId: string) =>
  incidents.filter(i => i.applicationId === appId);

export const getActiveIncidents = () =>
  incidents.filter(i => i.status !== 'resolved');

export const getPendingApprovals = () =>
  deployments.filter(d => d.status === 'awaiting-approval');

export const getRecentDeployments = (limit = 5) =>
  [...deployments].sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()).slice(0, limit);

export const getUnreadNotifications = () =>
  notifications.filter(n => !n.read);

export const getUserById = (userId: string) =>
  allUsers.find(u => u.id === userId);

export const getTeamById = (teamId: string) =>
  teams.find(t => t.id === teamId);

export const getApplicationById = (appId: string) =>
  applications.find(a => a.id === appId);
