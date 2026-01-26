// Persona Types for JTBD-focused IDP Experience

export type PersonaType = 'developer' | 'tech-lead' | 'engineering-manager' | 'executive';

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  icon: string;
  primaryColor: string;
  jobsToBeDone: string[];
  quickActions: QuickAction[];
  dashboardWidgets: string[];
  navigationPriority: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  shortcut?: string;
  action: string;
  persona: PersonaType[];
}

export interface PersonaMetrics {
  developer: DeveloperMetrics;
  techLead: TechLeadMetrics;
  manager: ManagerMetrics;
  executive: ExecutiveMetrics;
}

export interface DeveloperMetrics {
  myServices: number;
  activeDeployments: number;
  pendingPRs: number;
  incidentsAssigned: number;
  recentSearches: string[];
  favoriteServices: string[];
}

export interface TechLeadMetrics {
  teamMembers: number;
  teamServices: number;
  pendingApprovals: number;
  activeIncidents: number;
  deploymentSuccessRate: number;
  teamVelocity: number;
  onCallToday: string;
}

export interface ManagerMetrics {
  totalTeams: number;
  totalEngineers: number;
  monthlySpend: number;
  spendTrend: number;
  crossTeamDependencies: number;
  complianceScore: number;
  avgDeployFrequency: number;
}

export interface ExecutiveMetrics {
  technologyROI: number;
  operationalRisk: 'low' | 'medium' | 'high';
  complianceStatus: 'compliant' | 'at-risk' | 'non-compliant';
  engineeringEfficiency: number;
  customerImpactScore: number;
  innovationIndex: number;
}

// Persona Definitions
export const PERSONAS: Record<PersonaType, Persona> = {
  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Speed & Self-Service',
    icon: 'Code',
    primaryColor: 'blue',
    jobsToBeDone: [
      'Quickly find existing services to avoid rebuilding',
      'Onboard a new application in under 10 minutes',
      'Deploy code without waiting for approvals',
      'Troubleshoot issues during an incident',
      'Understand dependencies before making changes',
    ],
    quickActions: [
      { id: 'create-app', label: 'Create App', description: 'Start a new application', icon: 'Plus', shortcut: 'c', action: '/build/create', persona: ['developer'] },
      { id: 'deploy', label: 'Deploy', description: 'Deploy to staging', icon: 'Rocket', shortcut: 'd', action: '/deploy/deployments', persona: ['developer'] },
      { id: 'view-logs', label: 'View Logs', description: 'Check application logs', icon: 'FileText', shortcut: 'l', action: '/manage/observability?tab=logs', persona: ['developer'] },
      { id: 'search-api', label: 'Search APIs', description: 'Find API documentation', icon: 'Search', shortcut: 's', action: '/discover/api-docs', persona: ['developer'] },
    ],
    dashboardWidgets: ['my-applications', 'recent-deployments', 'quick-actions', 'system-health', 'on-call'],
    navigationPriority: ['discover', 'build', 'deploy', 'manage'],
  },
  'tech-lead': {
    id: 'tech-lead',
    name: 'Tech Lead',
    description: 'Team Oversight & System Understanding',
    icon: 'Users',
    primaryColor: 'violet',
    jobsToBeDone: [
      'Get visibility into team applications and their health',
      'Understand system dependencies before approving changes',
      'Manage on-call rotations and incident response',
      'Track team productivity and delivery metrics',
      'Ensure compliance and security across team services',
    ],
    quickActions: [
      { id: 'review-approvals', label: 'Review Approvals', description: 'Pending deployment approvals', icon: 'CheckCircle', shortcut: 'a', action: '/deploy/releases?filter=pending', persona: ['tech-lead'] },
      { id: 'team-health', label: 'Team Health', description: 'View team service status', icon: 'Activity', shortcut: 'h', action: '/manage/observability', persona: ['tech-lead'] },
      { id: 'on-call', label: 'On-Call Schedule', description: 'Manage rotations', icon: 'Calendar', shortcut: 'o', action: '/manage/incidents?tab=on-call', persona: ['tech-lead'] },
      { id: 'dependencies', label: 'Dependencies', description: 'View service graph', icon: 'GitBranch', shortcut: 'g', action: '/discover/dependencies', persona: ['tech-lead'] },
    ],
    dashboardWidgets: ['team-overview', 'pending-approvals', 'team-metrics', 'active-incidents', 'on-call', 'dependency-graph'],
    navigationPriority: ['manage', 'deploy', 'discover', 'build'],
  },
  'engineering-manager': {
    id: 'engineering-manager',
    name: 'Engineering Manager',
    description: 'Visibility & Resource Allocation',
    icon: 'BarChart3',
    primaryColor: 'emerald',
    jobsToBeDone: [
      'Understand team capacity and resource utilization',
      'Get visibility into cross-team dependencies',
      'Report on engineering productivity to leadership',
      'Plan resource allocation and hiring priorities',
      'Track compliance and security across multiple teams',
    ],
    quickActions: [
      { id: 'team-metrics', label: 'Team Metrics', description: 'View DORA metrics', icon: 'TrendingUp', shortcut: 'm', action: '/manage/analytics', persona: ['engineering-manager'] },
      { id: 'cost-report', label: 'Cost Report', description: 'Monthly spend analysis', icon: 'DollarSign', shortcut: 'c', action: '/manage/costs', persona: ['engineering-manager'] },
      { id: 'compliance', label: 'Compliance', description: 'Security & audit status', icon: 'Shield', shortcut: 's', action: '/manage/analytics?tab=compliance', persona: ['engineering-manager'] },
      { id: 'capacity', label: 'Capacity Planning', description: 'Resource allocation', icon: 'Layers', shortcut: 'p', action: '/manage/analytics?tab=capacity', persona: ['engineering-manager'] },
    ],
    dashboardWidgets: ['org-health', 'cost-overview', 'team-comparison', 'compliance-status', 'delivery-metrics', 'resource-utilization'],
    navigationPriority: ['manage', 'discover', 'deploy', 'build'],
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Strategic Metrics & Risk Awareness',
    icon: 'Briefcase',
    primaryColor: 'amber',
    jobsToBeDone: [
      'Understand technology investment ROI',
      'Get visibility into operational risk and compliance',
      'Make data-driven decisions about technology strategy',
      'Report on engineering efficiency to the board',
      'Get early warning of issues that could impact business',
    ],
    quickActions: [
      { id: 'exec-summary', label: 'Executive Summary', description: 'High-level overview', icon: 'FileText', shortcut: 'e', action: '/executive/summary', persona: ['executive'] },
      { id: 'risk-report', label: 'Risk Report', description: 'Operational risks', icon: 'AlertTriangle', shortcut: 'r', action: '/executive/risk', persona: ['executive'] },
      { id: 'roi-metrics', label: 'ROI Metrics', description: 'Investment returns', icon: 'TrendingUp', shortcut: 'i', action: '/executive/roi', persona: ['executive'] },
      { id: 'board-report', label: 'Board Report', description: 'Export for board', icon: 'Download', shortcut: 'b', action: '/executive/reports', persona: ['executive'] },
    ],
    dashboardWidgets: ['strategic-kpis', 'risk-overview', 'financial-summary', 'business-impact', 'compliance-executive'],
    navigationPriority: ['manage', 'discover', 'deploy', 'build'],
  },
};

// Widget Registry for Persona-Aware Dashboard
export interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  component: string;
  personas: PersonaType[];
  size: 'small' | 'medium' | 'large' | 'full';
  category: 'health' | 'metrics' | 'actions' | 'alerts' | 'team';
}

export const WIDGET_REGISTRY: WidgetConfig[] = [
  // Developer Widgets
  { id: 'my-applications', title: 'My Applications', description: 'Services you own', component: 'MyApplicationsWidget', personas: ['developer', 'tech-lead'], size: 'medium', category: 'health' },
  { id: 'recent-deployments', title: 'Recent Deployments', description: 'Latest deployment activity', component: 'RecentDeploymentsWidget', personas: ['developer', 'tech-lead'], size: 'medium', category: 'metrics' },
  { id: 'quick-actions', title: 'Quick Actions', description: 'Common tasks', component: 'QuickActionsWidget', personas: ['developer'], size: 'small', category: 'actions' },
  
  // Tech Lead Widgets
  { id: 'team-overview', title: 'Team Overview', description: 'Team services and health', component: 'TeamOverviewWidget', personas: ['tech-lead', 'engineering-manager'], size: 'large', category: 'team' },
  { id: 'pending-approvals', title: 'Pending Approvals', description: 'Deployments awaiting approval', component: 'PendingApprovalsWidget', personas: ['tech-lead', 'engineering-manager'], size: 'medium', category: 'actions' },
  { id: 'team-metrics', title: 'Team Metrics', description: 'DORA and productivity metrics', component: 'TeamMetricsWidget', personas: ['tech-lead', 'engineering-manager'], size: 'medium', category: 'metrics' },
  { id: 'dependency-graph', title: 'Dependency Graph', description: 'Service dependencies', component: 'DependencyGraphWidget', personas: ['tech-lead'], size: 'large', category: 'health' },
  
  // Manager Widgets
  { id: 'org-health', title: 'Organization Health', description: 'Cross-team service status', component: 'OrgHealthWidget', personas: ['engineering-manager', 'executive'], size: 'large', category: 'health' },
  { id: 'cost-overview', title: 'Cost Overview', description: 'Monthly spend and trends', component: 'CostOverviewWidget', personas: ['engineering-manager', 'executive'], size: 'medium', category: 'metrics' },
  { id: 'team-comparison', title: 'Team Comparison', description: 'Cross-team benchmarking', component: 'TeamComparisonWidget', personas: ['engineering-manager'], size: 'large', category: 'metrics' },
  { id: 'resource-utilization', title: 'Resource Utilization', description: 'Infrastructure usage', component: 'ResourceUtilizationWidget', personas: ['engineering-manager'], size: 'medium', category: 'metrics' },
  
  // Executive Widgets
  { id: 'strategic-kpis', title: 'Strategic KPIs', description: 'Key business metrics', component: 'StrategicKPIsWidget', personas: ['executive'], size: 'full', category: 'metrics' },
  { id: 'risk-overview', title: 'Risk Overview', description: 'Operational and security risks', component: 'RiskOverviewWidget', personas: ['executive'], size: 'medium', category: 'alerts' },
  { id: 'financial-summary', title: 'Financial Summary', description: 'Technology investment ROI', component: 'FinancialSummaryWidget', personas: ['executive'], size: 'medium', category: 'metrics' },
  { id: 'business-impact', title: 'Business Impact', description: 'Tech metrics vs business KPIs', component: 'BusinessImpactWidget', personas: ['executive'], size: 'large', category: 'metrics' },
  
  // Shared Widgets
  { id: 'system-health', title: 'System Health', description: 'Service health overview', component: 'SystemHealthWidget', personas: ['developer', 'tech-lead', 'engineering-manager'], size: 'medium', category: 'health' },
  { id: 'on-call', title: 'On-Call Schedule', description: 'Current on-call rotation', component: 'OnCallWidget', personas: ['developer', 'tech-lead'], size: 'medium', category: 'team' },
  { id: 'active-incidents', title: 'Active Incidents', description: 'Current incidents', component: 'AlertsWidget', personas: ['developer', 'tech-lead', 'engineering-manager', 'executive'], size: 'medium', category: 'alerts' },
  { id: 'compliance-status', title: 'Compliance Status', description: 'Security and compliance', component: 'ComplianceWidget', personas: ['tech-lead', 'engineering-manager', 'executive'], size: 'medium', category: 'health' },
  { id: 'cost-trends', title: 'Cost Trends', description: 'Spending over time', component: 'CostTrendsWidget', personas: ['developer', 'tech-lead', 'engineering-manager'], size: 'medium', category: 'metrics' },
];
