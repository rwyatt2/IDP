// ============================================================================
// Documentation Types
// ============================================================================

export * from './documentation';

// ============================================================================
// Core Platform Types
// ============================================================================

export type Phase = 'discover' | 'build' | 'deploy' | 'manage';

export type UserRole = 'developer' | 'tech-lead' | 'manager' | 'executive';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  team: string;
  teams: string[];
  permissions: string[];
  preferences: UserPreferences;
  onCallStatus?: OnCallStatus;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: DashboardLayout;
  favoriteExtensions: string[];
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  slack: boolean;
  deployments: boolean;
  incidents: boolean;
  approvals: boolean;
}

export interface OnCallStatus {
  isOnCall: boolean;
  schedule?: string;
  endsAt?: string;
  escalationPolicy?: string;
}

// ============================================================================
// Extension System Types
// ============================================================================

export interface Extension {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: ExtensionCategory;
  phase: Phase;
  version: string;
  author: string;
  rating: number;
  downloads: number;
  installed: boolean;
  featured: boolean;
  tags: string[];
  permissions: string[];
  lastUpdated: string;
  screenshots?: string[];
  documentation?: string;
}

export type ExtensionCategory = 
  | 'catalog'
  | 'deployment'
  | 'monitoring'
  | 'security'
  | 'cost'
  | 'infrastructure'
  | 'collaboration'
  | 'automation';

// ============================================================================
// Widget System Types
// ============================================================================

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  size: WidgetSize;
  extensionId?: string;
  config?: Record<string, unknown>;
  refreshInterval?: number;
}

export type WidgetType = 
  | 'my-applications'
  | 'on-call-schedule'
  | 'recent-deployments'
  | 'cost-trends'
  | 'system-health'
  | 'team-projects'
  | 'pending-approvals'
  | 'performance-metrics'
  | 'quick-actions'
  | 'recent-activity'
  | 'alerts'
  | 'resources';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface DashboardLayout {
  widgets: WidgetInstance[];
}

export interface WidgetInstance {
  id: string;
  widgetId: string;
  position: { x: number; y: number };
  size: WidgetSize;
}

// ============================================================================
// System Catalog Types
// ============================================================================

export interface Application {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: ApplicationType;
  status: HealthStatus;
  team: Team;
  owners: string[];
  tier: ServiceTier;
  environment: Environment[];
  repository: string;
  language: string;
  framework?: string;
  dependencies: Dependency[];
  endpoints?: Endpoint[];
  metrics: ApplicationMetrics;
  compliance: ComplianceStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastDeployment?: Deployment;
}

export type ApplicationType = 'service' | 'frontend' | 'backend' | 'library' | 'infrastructure' | 'data-pipeline';

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'unknown' | 'maintenance';

export type ServiceTier = 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';

export type Environment = 'development' | 'staging' | 'production' | 'sandbox';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  members: TeamMember[];
  lead?: string;
  slackChannel?: string;
  email?: string;
  oncallSchedule?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Dependency {
  id: string;
  name: string;
  type: 'service' | 'database' | 'queue' | 'cache' | 'external';
  status: HealthStatus;
  critical: boolean;
}

export interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  authenticated: boolean;
  rateLimit?: number;
}

export interface ApplicationMetrics {
  requestsPerSecond: number;
  latencyP50: number;
  latencyP99: number;
  errorRate: number;
  uptime: number;
  instances: number;
  cpu: number;
  memory: number;
}

export interface ComplianceStatus {
  soc2: boolean;
  gdpr: boolean;
  hipaa: boolean;
  pci: boolean;
  lastAudit?: string;
  certifications: string[];
}

// ============================================================================
// Deployment Types
// ============================================================================

export interface Deployment {
  id: string;
  applicationId: string;
  applicationName: string;
  version: string;
  environment: Environment;
  status: DeploymentStatus;
  triggeredBy: string;
  triggeredAt: string;
  completedAt?: string;
  duration?: number;
  commits: Commit[];
  artifacts: Artifact[];
  approvals: Approval[];
  rollbackOf?: string;
  canRollback: boolean;
}

export type DeploymentStatus = 
  | 'pending'
  | 'in-progress'
  | 'succeeded'
  | 'failed'
  | 'rolled-back'
  | 'cancelled'
  | 'awaiting-approval';

export interface Commit {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
}

export interface Artifact {
  name: string;
  type: string;
  size: number;
  checksum: string;
}

export interface Approval {
  id: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comment?: string;
}

// ============================================================================
// Incident & Alert Types
// ============================================================================

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  applicationId?: string;
  applicationName?: string;
  assignee?: string;
  team: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: IncidentEvent[];
}

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface IncidentEvent {
  id: string;
  type: 'created' | 'updated' | 'comment' | 'status-change' | 'resolved';
  timestamp: string;
  user: string;
  content: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  applicationId?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

// ============================================================================
// Cost & Resource Types
// ============================================================================

export interface CostData {
  applicationId: string;
  applicationName: string;
  team: string;
  currentMonth: number;
  previousMonth: number;
  trend: number;
  breakdown: CostBreakdown;
  forecast: number;
  budget?: number;
  budgetUtilization?: number;
}

export interface CostBreakdown {
  compute: number;
  storage: number;
  network: number;
  database: number;
  other: number;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  provider: 'aws' | 'gcp' | 'azure' | 'kubernetes' | 'on-premise';
  region: string;
  status: HealthStatus;
  applicationId?: string;
  team?: string;
  cost: number;
  utilization: number;
  tags: Record<string, string>;
}

export type ResourceType = 
  | 'compute'
  | 'database'
  | 'storage'
  | 'cache'
  | 'queue'
  | 'cdn'
  | 'load-balancer'
  | 'container';

// ============================================================================
// Search & Navigation Types
// ============================================================================

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  icon?: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export type SearchResultType = 
  | 'application'
  | 'service'
  | 'team'
  | 'documentation'
  | 'deployment'
  | 'incident'
  | 'extension'
  | 'resource';

export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'create' | 'manage' | 'help';
}

// ============================================================================
// Activity & Notification Types
// ============================================================================

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user?: string;
  applicationId?: string;
  applicationName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type ActivityType = 
  | 'deployment'
  | 'incident'
  | 'approval'
  | 'config-change'
  | 'team-update'
  | 'comment'
  | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType = 
  | 'deployment'
  | 'incident'
  | 'approval-request'
  | 'approval-response'
  | 'mention'
  | 'system';

// ============================================================================
// Form & Wizard Types
// ============================================================================

export interface ApplicationFormData {
  name: string;
  displayName: string;
  description: string;
  type: ApplicationType;
  team: string;
  tier: ServiceTier;
  language: string;
  framework?: string;
  repository: string;
  environments: Environment[];
  infrastructure: InfrastructureConfig;
}

export interface InfrastructureConfig {
  compute: {
    type: 'kubernetes' | 'serverless' | 'vm';
    replicas: number;
    cpu: string;
    memory: string;
  };
  database?: {
    type: 'postgres' | 'mysql' | 'mongodb' | 'dynamodb' | 'none';
    size: string;
  };
  cache?: {
    type: 'redis' | 'memcached' | 'none';
    size: string;
  };
  cdn?: boolean;
  monitoring?: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
