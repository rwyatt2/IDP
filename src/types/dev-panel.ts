// Developer Panel Types for Guided Persona Experiences

import type { PersonaType } from './persona';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  jtbd: string; // Job-to-be-done this step helps accomplish
  target?: string; // CSS selector for element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'type' | 'navigate' | 'wait';
  actionTarget?: string;
  actionValue?: string;
  route?: string; // Route to navigate to for this step
  spotlight?: boolean; // Whether to spotlight the target element
  interactive?: boolean; // Whether user can interact with highlighted element
  completionTrigger?: 'click' | 'navigation' | 'timer' | 'manual';
  completionTarget?: string;
  timerDuration?: number;
  interactiveElements?: InteractiveElement[]; // Specific elements user can interact with
  tryItPrompt?: string; // Prompt encouraging user to try the feature
}

export interface InteractiveElement {
  label: string;
  selector: string;
  action: 'click' | 'type' | 'hover';
  description: string;
  icon?: string;
}

export interface PersonaTour {
  id: string;
  persona: PersonaType;
  title: string;
  description: string;
  steps: TourStep[];
  estimatedTime: string;
  completionMessage: string;
  completionEmoji: string;
}

export interface DemoScenario {
  id: string;
  persona: PersonaType;
  name: string;
  description: string;
  data: Record<string, unknown>;
}

export interface DevPanelState {
  // Panel visibility
  isOpen: boolean;
  isMinimized: boolean;
  
  // Tour state
  activeTour: PersonaTour | null;
  currentStepIndex: number;
  tourCompleted: boolean;
  
  // Demo mode
  demoMode: boolean;
  activeScenario: DemoScenario | null;
  
  // Completion tracking
  completedTours: string[];
  tourProgress: Record<string, number>; // tour id -> last completed step
  
  // Analytics
  tourStartTimes: Record<string, number>;
  stepViewTimes: Record<string, number[]>;
}

export interface PersonaCard {
  persona: PersonaType;
  icon: string;
  badge: string;
  title: string;
  description: string;
  keyMetrics: string;
  color: string;
  tourId: string;
}

// Persona card configurations
export const PERSONA_CARDS: PersonaCard[] = [
  {
    persona: 'developer',
    icon: 'Code',
    badge: 'Dev',
    title: 'Developer',
    description: 'Speed & self-service focused. Needs rapid discovery and deployment.',
    keyMetrics: '2-click deployment, <200ms search, minimal cognitive load',
    color: 'blue',
    tourId: 'developer-tour',
  },
  {
    persona: 'tech-lead',
    icon: 'Users',
    badge: 'TL',
    title: 'Tech Lead',
    description: 'Team oversight & system understanding. Manages dependencies and incidents.',
    keyMetrics: 'Team visibility, approval workflows, system architecture',
    color: 'violet',
    tourId: 'tech-lead-tour',
  },
  {
    persona: 'engineering-manager',
    icon: 'BarChart3',
    badge: 'EM',
    title: 'Engineering Manager',
    description: 'Resource allocation & cross-team visibility. Plans capacity and tracks productivity.',
    keyMetrics: 'Multi-team metrics, cost optimization, strategic planning',
    color: 'emerald',
    tourId: 'manager-tour',
  },
  {
    persona: 'executive',
    icon: 'Briefcase',
    badge: 'Exec',
    title: 'Executive',
    description: 'Strategic metrics & risk awareness. Business impact and ROI focused.',
    keyMetrics: 'Business correlation, risk assessment, strategic ROI',
    color: 'amber',
    tourId: 'executive-tour',
  },
];

// Guided Tours for each persona with JTBD context
export const PERSONA_TOURS: PersonaTour[] = [
  {
    id: 'developer-tour',
    persona: 'developer',
    title: 'Developer Workflow',
    description: 'Experience the platform as a developer focused on speed and self-service.',
    estimatedTime: '3 min',
    completionMessage: "You've mastered the developer workflow!",
    completionEmoji: '🚀',
    steps: [
      {
        id: 'dev-1',
        title: "Find existing services instantly",
        description: "Don't rebuild what already exists. The global search helps you discover services, APIs, and documentation in under 200ms.",
        jtbd: "I need to quickly find existing services to avoid rebuilding",
        target: '[aria-label="Open search dialog"]',
        placement: 'bottom',
        spotlight: true,
        interactive: true,
        completionTrigger: 'click',
        completionTarget: '[aria-label="Open search dialog"]',
        tryItPrompt: "Click the search bar or press ⌘K to try it",
        interactiveElements: [
          { label: 'Search Bar', selector: '[aria-label="Open search dialog"]', action: 'click', description: 'Open global search', icon: 'Search' },
        ],
      },
      {
        id: 'dev-2',
        title: 'Instant search results',
        description: "Results appear as you type with smart filtering. Search for services, APIs, documentation, or team members all in one place.",
        jtbd: "I need to quickly find existing services to avoid rebuilding",
        target: '[role="dialog"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Try typing 'auth' or 'payment' to find services",
        interactiveElements: [
          { label: 'Search Input', selector: 'input[type="text"]', action: 'type', description: 'Type to search', icon: 'Type' },
          { label: 'Filter: Services', selector: '[data-filter="services"]', action: 'click', description: 'Filter by services only', icon: 'Filter' },
          { label: 'Filter: APIs', selector: '[data-filter="apis"]', action: 'click', description: 'Filter by APIs only', icon: 'Code' },
        ],
      },
      {
        id: 'dev-3',
        title: 'Create a new app in minutes',
        description: "Start from templates with smart defaults based on your team's patterns. No tickets, no waiting—go from idea to deployed service in under 10 minutes.",
        jtbd: "I need to onboard a new application in under 10 minutes",
        route: '/build/create',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Let's go to the Create App page",
        interactiveElements: [
          { label: 'New App Button', selector: '[aria-label="Create new application"]', action: 'click', description: 'Start creating a new app', icon: 'Plus' },
        ],
      },
      {
        id: 'dev-4',
        title: 'Configure with smart defaults',
        description: "Choose a template, name your service, and let the platform handle the rest. Real-time cost estimation shows impact before you commit.",
        jtbd: "I need to onboard a new application in under 10 minutes",
        target: '[data-tour="create-app-form"]',
        placement: 'right',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 8000,
        tryItPrompt: "Select a template and enter a service name",
        interactiveElements: [
          { label: 'Template Cards', selector: '[data-tour="template-card"]', action: 'click', description: 'Choose a starter template', icon: 'Layout' },
          { label: 'Service Name', selector: 'input[name="name"]', action: 'type', description: 'Enter your service name', icon: 'Type' },
          { label: 'Create Button', selector: 'button[type="submit"]', action: 'click', description: 'Create your application', icon: 'Check' },
        ],
      },
      {
        id: 'dev-5',
        title: 'One-click deployments',
        description: "Deploy to any environment with a single click. No waiting for approvals on non-production environments—ship when you're ready.",
        jtbd: "I need to deploy my code without waiting for approvals",
        route: '/deploy/deployments',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Let's check your deployment options",
        interactiveElements: [
          { label: 'Deploy to Staging', selector: '[data-action="deploy-staging"]', action: 'click', description: 'Deploy to staging environment', icon: 'Rocket' },
        ],
      },
      {
        id: 'dev-6',
        title: 'Monitor deployment progress',
        description: "Watch your deployment in real-time. Health checks run automatically, and if anything fails, one-click rollback gets you back to safety.",
        jtbd: "I need to deploy my code without waiting for approvals",
        target: '[data-tour="deployment-list"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Click any deployment to see details, or try the rollback button",
        interactiveElements: [
          { label: 'Deployment Row', selector: '[data-tour="deployment-row"]', action: 'click', description: 'View deployment details', icon: 'Eye' },
          { label: 'Rollback', selector: '[data-action="rollback"]', action: 'click', description: 'Rollback to previous version', icon: 'RotateCcw' },
          { label: 'View Logs', selector: '[data-action="view-logs"]', action: 'click', description: 'See deployment logs', icon: 'FileText' },
        ],
      },
      {
        id: 'dev-7',
        title: 'Troubleshoot during incidents',
        description: "When things go wrong, get instant access to on-call contacts, runbooks, and deployment history. Correlate incidents with recent changes.",
        jtbd: "I need to troubleshoot issues during an incident",
        route: '/manage/incidents',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'manual',
        tryItPrompt: "Explore the incident dashboard and its quick actions",
        interactiveElements: [
          { label: 'Active Incidents', selector: '[data-tour="incidents-list"]', action: 'click', description: 'View active incidents', icon: 'AlertTriangle' },
          { label: 'Page On-Call', selector: '[data-action="page-oncall"]', action: 'click', description: 'Alert the on-call engineer', icon: 'Phone' },
          { label: 'View Runbook', selector: '[data-action="view-runbook"]', action: 'click', description: 'Open incident runbook', icon: 'Book' },
          { label: 'Recent Deployments', selector: '[data-tour="recent-deploys"]', action: 'click', description: 'Check recent deployments', icon: 'History' },
        ],
      },
    ],
  },
  {
    id: 'tech-lead-tour',
    persona: 'tech-lead',
    title: 'Tech Lead Workflow',
    description: 'Experience the platform as a tech lead focused on team oversight and system understanding.',
    estimatedTime: '4 min',
    completionMessage: "You're ready to lead your team effectively!",
    completionEmoji: '👥',
    steps: [
      {
        id: 'tl-1',
        title: 'Your team at a glance',
        description: "See service health, pending approvals, and on-call status in one view. No context switching—everything you need to lead your team effectively.",
        jtbd: "I need visibility into my team's applications and their health",
        route: '/',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'timer',
        timerDuration: 5000,
        tryItPrompt: "Explore the dashboard widgets showing your team's status",
        interactiveElements: [
          { label: 'Team Services', selector: '[data-widget="my-applications"]', action: 'click', description: 'View your team\'s services', icon: 'Layers' },
          { label: 'On-Call Status', selector: '[data-widget="on-call"]', action: 'click', description: 'See who\'s on-call', icon: 'Phone' },
          { label: 'System Health', selector: '[data-widget="system-health"]', action: 'click', description: 'Check overall health', icon: 'Activity' },
        ],
      },
      {
        id: 'tl-2',
        title: 'Review and approve deployments',
        description: "Each deployment request shows risk assessment, dependency impact, and change summary. Make informed decisions without digging through PRs.",
        jtbd: "I need to understand system dependencies before approving changes",
        route: '/deploy/releases',
        target: '[data-tour="approvals"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 7000,
        tryItPrompt: "Click an approval to see risk details, then approve or reject",
        interactiveElements: [
          { label: 'View Changes', selector: '[data-action="view-changes"]', action: 'click', description: 'See what changed', icon: 'GitCommit' },
          { label: 'Risk Assessment', selector: '[data-tour="risk-badge"]', action: 'hover', description: 'View risk analysis', icon: 'Shield' },
          { label: 'Approve', selector: '[data-action="approve"]', action: 'click', description: 'Approve deployment', icon: 'Check' },
          { label: 'Request Changes', selector: '[data-action="request-changes"]', action: 'click', description: 'Ask for modifications', icon: 'MessageSquare' },
        ],
      },
      {
        id: 'tl-3',
        title: 'Understand blast radius',
        description: "Before approving, see exactly which services could be affected. The dependency graph shows upstream and downstream impacts visually.",
        jtbd: "I need to understand system dependencies before approving changes",
        route: '/discover/dependencies',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Let's explore the service dependency map",
        interactiveElements: [
          { label: 'Dependencies Link', selector: '[href="/discover/dependencies"]', action: 'click', description: 'Open dependency view', icon: 'GitBranch' },
        ],
      },
      {
        id: 'tl-4',
        title: 'Interactive service map',
        description: "Click any service to see its health, recent deployments, and dependencies. Hover to highlight the blast radius of potential changes.",
        jtbd: "I need to understand system dependencies before approving changes",
        target: '[data-tour="dependency-graph"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 7000,
        tryItPrompt: "Click a service node to explore, or hover to see connections",
        interactiveElements: [
          { label: 'Service Node', selector: '[data-tour="service-node"]', action: 'click', description: 'View service details', icon: 'Circle' },
          { label: 'Zoom Controls', selector: '[data-tour="zoom"]', action: 'click', description: 'Zoom in/out', icon: 'ZoomIn' },
          { label: 'Filter by Team', selector: '[data-filter="team"]', action: 'click', description: 'Show only your team', icon: 'Users' },
          { label: 'Show Critical Path', selector: '[data-action="critical-path"]', action: 'click', description: 'Highlight critical services', icon: 'AlertTriangle' },
        ],
      },
      {
        id: 'tl-5',
        title: 'Manage on-call and incidents',
        description: "Set up rotations, manage escalations, and coordinate incident response. Your team always knows who to contact and how.",
        jtbd: "I need to manage on-call rotations and incident response",
        route: '/manage/incidents',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Check your on-call schedule and active incidents",
        interactiveElements: [
          { label: 'On-Call Schedule', selector: '[data-tab="on-call"]', action: 'click', description: 'Manage rotations', icon: 'Calendar' },
          { label: 'Escalation Policy', selector: '[data-action="escalation"]', action: 'click', description: 'Edit escalation paths', icon: 'ArrowUp' },
          { label: 'Create Incident', selector: '[data-action="create-incident"]', action: 'click', description: 'Declare new incident', icon: 'AlertTriangle' },
        ],
      },
      {
        id: 'tl-6',
        title: 'Track team productivity',
        description: "DORA metrics show deployment frequency, lead time, MTTR, and change failure rate. Identify bottlenecks and celebrate wins with data.",
        jtbd: "I need to track team productivity and delivery metrics",
        route: '/manage/analytics',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'manual',
        tryItPrompt: "Explore your team's DORA metrics and trends",
        interactiveElements: [
          { label: 'DORA Dashboard', selector: '[data-tour="dora-metrics"]', action: 'click', description: 'View DORA metrics', icon: 'TrendingUp' },
          { label: 'Time Range', selector: '[data-filter="time-range"]', action: 'click', description: 'Change date range', icon: 'Calendar' },
          { label: 'Export Report', selector: '[data-action="export"]', action: 'click', description: 'Export to PDF/CSV', icon: 'Download' },
          { label: 'Compare Periods', selector: '[data-action="compare"]', action: 'click', description: 'Compare time periods', icon: 'GitCompare' },
        ],
      },
    ],
  },
  {
    id: 'manager-tour',
    persona: 'engineering-manager',
    title: 'Engineering Manager Workflow',
    description: 'Experience the platform with multi-team visibility and resource allocation focus.',
    estimatedTime: '4 min',
    completionMessage: 'You have full organizational visibility!',
    completionEmoji: '📊',
    steps: [
      {
        id: 'em-1',
        title: 'Organization-wide visibility',
        description: "See all teams' performance side-by-side. Identify which teams are thriving and which need support—without waiting for status reports.",
        jtbd: "I need to understand team capacity and resource utilization",
        route: '/',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'timer',
        timerDuration: 5000,
        tryItPrompt: "Explore the multi-team dashboard and health indicators",
        interactiveElements: [
          { label: 'Team Comparison', selector: '[data-widget="team-comparison"]', action: 'click', description: 'Compare team metrics', icon: 'BarChart' },
          { label: 'Org Health', selector: '[data-widget="org-health"]', action: 'click', description: 'Overall org status', icon: 'Activity' },
          { label: 'Filter by Team', selector: '[data-filter="team"]', action: 'click', description: 'Focus on specific team', icon: 'Filter' },
        ],
      },
      {
        id: 'em-2',
        title: 'Understand resource allocation',
        description: "See where your engineering investment goes—by team, project, and infrastructure. Identify optimization opportunities instantly.",
        jtbd: "I need to understand team capacity and resource utilization",
        route: '/manage/costs',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Let's dive into cost and resource allocation",
        interactiveElements: [
          { label: 'Costs Link', selector: '[href="/manage/costs"]', action: 'click', description: 'Open cost analysis', icon: 'DollarSign' },
        ],
      },
      {
        id: 'em-3',
        title: 'Cost breakdown by team',
        description: "Interactive breakdown shows spending trends and anomalies. Click any segment to drill down, set budgets, and get alerts for overruns.",
        jtbd: "I need visibility into cross-team dependencies and bottlenecks",
        target: '[data-tour="cost-breakdown"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 7000,
        tryItPrompt: "Click chart segments to drill down, or adjust the time range",
        interactiveElements: [
          { label: 'Cost Chart', selector: '[data-tour="cost-chart"]', action: 'click', description: 'Click to drill down', icon: 'PieChart' },
          { label: 'Time Range', selector: '[data-filter="time-range"]', action: 'click', description: 'Change date range', icon: 'Calendar' },
          { label: 'Set Budget', selector: '[data-action="set-budget"]', action: 'click', description: 'Set team budgets', icon: 'Target' },
          { label: 'Export', selector: '[data-action="export"]', action: 'click', description: 'Export for reporting', icon: 'Download' },
        ],
      },
      {
        id: 'em-4',
        title: 'Cross-team dependency mapping',
        description: "See how teams depend on each other's services. Identify coupling that slows delivery or creates organizational bottlenecks.",
        jtbd: "I need visibility into cross-team dependencies and bottlenecks",
        route: '/discover/dependencies',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Explore the organization-wide dependency view",
        interactiveElements: [
          { label: 'Org View', selector: '[data-view="organization"]', action: 'click', description: 'See all teams', icon: 'Building' },
          { label: 'Bottlenecks', selector: '[data-action="show-bottlenecks"]', action: 'click', description: 'Highlight bottlenecks', icon: 'AlertCircle' },
        ],
      },
      {
        id: 'em-5',
        title: 'Compliance and security posture',
        description: "Track compliance across all teams. See audit findings, remediation status, and security scores without chasing individual reports.",
        jtbd: "I need to track compliance and security across multiple teams",
        route: '/manage/analytics',
        target: '[data-tour="compliance"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Review compliance scores and pending remediations",
        interactiveElements: [
          { label: 'Compliance Tab', selector: '[data-tab="compliance"]', action: 'click', description: 'View compliance', icon: 'Shield' },
          { label: 'Team Scores', selector: '[data-tour="compliance-scores"]', action: 'click', description: 'See team breakdown', icon: 'CheckSquare' },
          { label: 'Pending Items', selector: '[data-tour="pending-remediations"]', action: 'click', description: 'View action items', icon: 'Clock' },
          { label: 'Audit Report', selector: '[data-action="audit-report"]', action: 'click', description: 'Generate audit report', icon: 'FileText' },
        ],
      },
      {
        id: 'em-6',
        title: 'Report to leadership',
        description: "Generate executive-ready reports with one click. Customize metrics, add context, and export in formats leadership expects.",
        jtbd: "I need to report on engineering productivity to leadership",
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'manual',
        tryItPrompt: "Try generating a leadership report",
        interactiveElements: [
          { label: 'Generate Report', selector: '[data-action="generate-report"]', action: 'click', description: 'Create executive report', icon: 'FileText' },
          { label: 'Customize Metrics', selector: '[data-action="customize"]', action: 'click', description: 'Choose what to include', icon: 'Settings' },
          { label: 'Schedule Report', selector: '[data-action="schedule"]', action: 'click', description: 'Set up recurring reports', icon: 'Clock' },
          { label: 'Share', selector: '[data-action="share"]', action: 'click', description: 'Share with stakeholders', icon: 'Share' },
        ],
      },
    ],
  },
  {
    id: 'executive-tour',
    persona: 'executive',
    title: 'Executive Workflow',
    description: 'Experience the platform with strategic metrics and business impact focus.',
    estimatedTime: '3 min',
    completionMessage: "You're equipped for strategic technology decisions!",
    completionEmoji: '🎯',
    steps: [
      {
        id: 'exec-1',
        title: 'Technology health at a glance',
        description: "One dashboard for technology ROI, operational risk, and business impact. Green/yellow/red indicators—no technical jargon required.",
        jtbd: "I need to understand our technology investment ROI",
        route: '/',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'timer',
        timerDuration: 5000,
        tryItPrompt: "Review the executive KPIs and health indicators",
        interactiveElements: [
          { label: 'Technology ROI', selector: '[data-kpi="roi"]', action: 'click', description: 'View ROI breakdown', icon: 'TrendingUp' },
          { label: 'Health Score', selector: '[data-kpi="health"]', action: 'click', description: 'See health factors', icon: 'Activity' },
          { label: 'Risk Indicator', selector: '[data-kpi="risk"]', action: 'click', description: 'View risk details', icon: 'AlertTriangle' },
        ],
      },
      {
        id: 'exec-2',
        title: 'Strategic KPIs explained',
        description: "Click any metric to see what drives it. Engineering efficiency, customer impact, and innovation index—all correlated with business outcomes.",
        jtbd: "I need to understand our technology investment ROI",
        target: '[data-tour="strategic-kpis"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Click any KPI card to drill down into the details",
        interactiveElements: [
          { label: 'ROI Card', selector: '[data-kpi="technology-roi"]', action: 'click', description: 'Technology ROI analysis', icon: 'DollarSign' },
          { label: 'Efficiency Card', selector: '[data-kpi="efficiency"]', action: 'click', description: 'Engineering efficiency', icon: 'Zap' },
          { label: 'Innovation Card', selector: '[data-kpi="innovation"]', action: 'click', description: 'Innovation index', icon: 'Lightbulb' },
          { label: 'Trend Toggle', selector: '[data-action="show-trends"]', action: 'click', description: 'Show historical trends', icon: 'TrendingUp' },
        ],
      },
      {
        id: 'exec-3',
        title: 'Operational risk assessment',
        description: "See what could go wrong and how prepared we are. Business-critical services, compliance status, and mitigation plans—all in one view.",
        jtbd: "I need visibility into operational risk and compliance status",
        target: '[data-tour="risk-overview"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Explore risk items and their business impact",
        interactiveElements: [
          { label: 'Risk Items', selector: '[data-tour="risk-item"]', action: 'click', description: 'View risk details', icon: 'AlertTriangle' },
          { label: 'Severity Filter', selector: '[data-filter="severity"]', action: 'click', description: 'Filter by severity', icon: 'Filter' },
          { label: 'Mitigation Plan', selector: '[data-action="mitigation"]', action: 'click', description: 'See mitigation status', icon: 'Shield' },
          { label: 'Risk Trends', selector: '[data-action="risk-trends"]', action: 'click', description: 'Historical risk trends', icon: 'TrendingDown' },
        ],
      },
      {
        id: 'exec-4',
        title: 'Investment portfolio view',
        description: "Where is technology spend going? See allocation across maintenance, features, and innovation. Identify optimization opportunities.",
        jtbd: "I need to make data-driven decisions about technology strategy",
        route: '/manage/costs',
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'navigation',
        tryItPrompt: "Let's see the investment breakdown",
        interactiveElements: [
          { label: 'Executive View', selector: '[data-view="executive"]', action: 'click', description: 'Executive cost view', icon: 'PieChart' },
        ],
      },
      {
        id: 'exec-5',
        title: 'Business impact correlation',
        description: "See how platform improvements affect the bottom line. Customer satisfaction, time-to-market, and revenue—correlated with technology investments.",
        jtbd: "I need to make data-driven decisions about technology strategy",
        target: '[data-tour="business-impact"]',
        placement: 'center',
        spotlight: true,
        interactive: true,
        completionTrigger: 'timer',
        timerDuration: 6000,
        tryItPrompt: "Explore the correlation between tech investments and business outcomes",
        interactiveElements: [
          { label: 'Customer Impact', selector: '[data-metric="customer"]', action: 'click', description: 'Customer satisfaction link', icon: 'Users' },
          { label: 'Revenue Impact', selector: '[data-metric="revenue"]', action: 'click', description: 'Revenue correlation', icon: 'DollarSign' },
          { label: 'Time to Market', selector: '[data-metric="ttm"]', action: 'click', description: 'Delivery speed impact', icon: 'Clock' },
          { label: 'Compare Periods', selector: '[data-action="compare"]', action: 'click', description: 'Compare to last quarter', icon: 'GitCompare' },
        ],
      },
      {
        id: 'exec-6',
        title: 'Board-ready reports',
        description: "Generate presentation-ready reports in seconds. Customize for your audience, add executive summary, and export in any format.",
        jtbd: "I need to report on engineering efficiency to the board",
        target: 'main',
        placement: 'center',
        spotlight: false,
        completionTrigger: 'manual',
        tryItPrompt: "Generate an executive summary or board report",
        interactiveElements: [
          { label: 'Board Report', selector: '[data-action="board-report"]', action: 'click', description: 'Generate board report', icon: 'Briefcase' },
          { label: 'Executive Summary', selector: '[data-action="exec-summary"]', action: 'click', description: 'One-page summary', icon: 'FileText' },
          { label: 'Customize', selector: '[data-action="customize"]', action: 'click', description: 'Choose metrics to show', icon: 'Settings' },
          { label: 'Schedule', selector: '[data-action="schedule"]', action: 'click', description: 'Recurring reports', icon: 'Calendar' },
        ],
      },
    ],
  },
];

// Demo scenarios with realistic data
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'developer-scenario',
    persona: 'developer',
    name: 'Day in the Life: Developer',
    description: 'Realistic developer workflow with service discovery and deployment',
    data: {
      services: [
        { name: 'auth-service', status: 'healthy', team: 'Platform' },
        { name: 'payment-api', status: 'healthy', team: 'Payments' },
        { name: 'user-profile-service', status: 'degraded', team: 'User Experience' },
        { name: 'notification-service', status: 'healthy', team: 'Platform' },
      ],
      deployments: [
        { service: 'auth-service', version: 'v2.4.1', env: 'staging', status: 'in-progress' },
        { service: 'payment-api', version: 'v1.8.3', env: 'production', status: 'succeeded' },
      ],
      incidents: [
        { title: 'High memory usage', service: 'user-profile-service', severity: 'warning' },
      ],
    },
  },
  {
    id: 'tech-lead-scenario',
    persona: 'tech-lead',
    name: 'Day in the Life: Tech Lead',
    description: 'Team management with approvals and incident coordination',
    data: {
      teamMembers: [
        { name: 'Sarah Chen', role: 'Tech Lead', status: 'available' },
        { name: 'Alex Rivera', role: 'Senior Engineer', status: 'busy' },
        { name: 'Emily Wang', role: 'Senior Engineer', status: 'on-call' },
        { name: 'Jordan Lee', role: 'Engineer', status: 'available' },
        { name: 'Taylor Kim', role: 'Engineer', status: 'away' },
        { name: 'Morgan Davis', role: 'Junior Engineer', status: 'available' },
      ],
      serviceHealth: { healthy: 80, warning: 15, critical: 5 },
      pendingApprovals: [
        { service: 'API Gateway', version: 'v2.15.0', risk: 'low', requester: 'Alex Rivera' },
        { service: 'Payment Service', version: 'v1.9.0', risk: 'medium', requester: 'Jordan Lee' },
        { service: 'User Dashboard', version: 'v4.3.0', risk: 'high', requester: 'Taylor Kim' },
      ],
    },
  },
  {
    id: 'manager-scenario',
    persona: 'engineering-manager',
    name: 'Day in the Life: Engineering Manager',
    description: 'Multi-team oversight with resource allocation',
    data: {
      teams: [
        { name: 'Platform', members: 6, services: 8, health: 94, trend: 'up' },
        { name: 'Payments', members: 5, services: 4, health: 88, trend: 'stable' },
        { name: 'User Experience', members: 7, services: 6, health: 76, trend: 'down' },
        { name: 'Data Platform', members: 4, services: 5, health: 92, trend: 'up' },
      ],
      resourceAllocation: { features: 60, maintenance: 30, innovation: 10 },
      crossTeamDependencies: 12,
      bottlenecks: ['API Gateway', 'Authentication Service'],
    },
  },
  {
    id: 'executive-scenario',
    persona: 'executive',
    name: 'Day in the Life: Executive',
    description: 'Strategic metrics and business impact overview',
    data: {
      annualSpend: 2400000,
      optimizationOpportunity: 15,
      uptime: 99.7,
      customerSatisfaction: 94,
      strategicInitiatives: [
        { name: 'Cloud Migration', progress: 75 },
        { name: 'API Modernization', progress: 30 },
        { name: 'Security Hardening', progress: 85 },
      ],
      technologyROI: 3.2,
      innovationIndex: 72,
    },
  },
];
