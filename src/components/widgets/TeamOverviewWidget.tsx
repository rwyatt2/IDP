import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge, Avatar } from '@/components/ui';
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'available' | 'busy' | 'away' | 'on-call';
  currentTask?: string;
}

interface TeamService {
  id: string;
  name: string;
  health: 'healthy' | 'degraded' | 'critical';
  deployments24h: number;
  lastDeployed: string;
}

// Mock data
const teamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', role: 'Tech Lead', status: 'available', currentTask: 'Code review' },
  { id: '2', name: 'Alex Rivera', role: 'Senior Engineer', status: 'busy', currentTask: 'API Gateway fix' },
  { id: '3', name: 'Emily Wang', role: 'Senior Engineer', status: 'on-call', currentTask: 'Incident response' },
  { id: '4', name: 'Jordan Lee', role: 'Engineer', status: 'available', currentTask: 'Feature development' },
  { id: '5', name: 'Taylor Kim', role: 'Engineer', status: 'away' },
  { id: '6', name: 'Morgan Davis', role: 'Junior Engineer', status: 'available', currentTask: 'Bug fixes' },
];

const teamServices: TeamService[] = [
  { id: '1', name: 'API Gateway', health: 'healthy', deployments24h: 2, lastDeployed: '2 hours ago' },
  { id: '2', name: 'Authentication Service', health: 'healthy', deployments24h: 1, lastDeployed: '1 day ago' },
  { id: '3', name: 'User Dashboard', health: 'healthy', deployments24h: 3, lastDeployed: '4 hours ago' },
  { id: '4', name: 'Notification Service', health: 'degraded', deployments24h: 1, lastDeployed: '1 day ago' },
  { id: '5', name: 'Payment Service', health: 'healthy', deployments24h: 0, lastDeployed: '3 days ago' },
];

const statusColors = {
  available: 'bg-success',
  busy: 'bg-error',
  away: 'bg-text-disabled',
  'on-call': 'bg-warning',
};

const healthColors = {
  healthy: 'text-success-text',
  degraded: 'text-warning-text',
  critical: 'text-error-text',
};

const healthIcons = {
  healthy: <CheckCircle className="w-4 h-4" />,
  degraded: <AlertTriangle className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4" />,
};

export function TeamOverviewWidget() {
  const healthyServices = teamServices.filter(s => s.health === 'healthy').length;
  const totalDeployments = teamServices.reduce((sum, s) => sum + s.deployments24h, 0);
  const onCallMember = teamMembers.find(m => m.status === 'on-call');

  return (
    <div>
      {/* Team Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">Members</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{teamMembers.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs">Services</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{teamServices.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs">Healthy</span>
          </div>
          <p className="text-xl font-semibold text-success-text">{healthyServices}/{teamServices.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">Deploys/24h</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{totalDeployments}</p>
        </div>
      </div>

      {/* On-Call Alert */}
      {onCallMember && (
        <div className="mb-6 p-3 rounded-lg bg-warning-subtle border border-warning-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={onCallMember.name} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-warning border-2 border-surface" />
              </div>
              <div>
                <p className="text-sm font-medium text-warning-text">{onCallMember.name} is On-Call</p>
                <p className="text-xs text-text-tertiary">{onCallMember.currentTask}</p>
              </div>
            </div>
            <Link 
              to="/manage/incidents?tab=on-call"
              className="text-xs text-warning-text hover:underline"
            >
              View Schedule
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Team Members */}
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Team Members
          </h4>
          <div className="space-y-2">
            {teamMembers.slice(0, 5).map((member) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-raised transition-colors"
              >
                <div className="relative">
                  <Avatar name={member.name} size="sm" />
                  <span 
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface',
                      statusColors[member.status]
                    )} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{member.name}</p>
                  <p className="text-xs text-text-tertiary truncate">
                    {member.currentTask || member.role}
                  </p>
                </div>
                {member.status === 'on-call' && (
                  <Badge variant="warning" size="sm">On-Call</Badge>
                )}
              </div>
            ))}
          </div>
          <Link 
            to="/settings/team"
            className="flex items-center gap-1 mt-3 text-xs text-accent-text hover:text-accent"
          >
            View all members
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Team Services */}
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Service Health
          </h4>
          <div className="space-y-2">
            {teamServices.map((service) => (
              <Link
                key={service.id}
                to={`/discover/catalog/${service.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-raised transition-colors group"
              >
                <span className={healthColors[service.health]}>
                  {healthIcons[service.health]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-text">
                    {service.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {service.deployments24h} deploy{service.deployments24h !== 1 ? 's' : ''} · {service.lastDeployed}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-disabled group-hover:text-text-tertiary" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
