import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  lead: string;
  members: number;
  services: number;
  healthScore: number;
  deployments: number;
  incidents: number;
  trend: 'up' | 'down' | 'stable';
}

const teams: Team[] = [
  { id: '1', name: 'Platform Engineering', lead: 'Sarah Chen', members: 6, services: 8, healthScore: 94, deployments: 12, incidents: 1, trend: 'up' },
  { id: '2', name: 'Payments', lead: 'Jordan Lee', members: 5, services: 4, healthScore: 88, deployments: 8, incidents: 0, trend: 'stable' },
  { id: '3', name: 'User Experience', lead: 'Taylor Kim', members: 7, services: 6, healthScore: 76, deployments: 6, incidents: 2, trend: 'down' },
  { id: '4', name: 'Data Platform', lead: 'Alex Rivera', members: 4, services: 5, healthScore: 92, deployments: 4, incidents: 0, trend: 'up' },
];

const getHealthColor = (score: number) => {
  if (score >= 90) return { text: 'text-success-text', bg: 'bg-success-subtle', border: 'border-success-border' };
  if (score >= 75) return { text: 'text-warning-text', bg: 'bg-warning-subtle', border: 'border-warning-border' };
  return { text: 'text-error-text', bg: 'bg-error-subtle', border: 'border-error-border' };
};

export function OrgHealthWidget() {
  const totalMembers = teams.reduce((sum, t) => sum + t.members, 0);
  const totalServices = teams.reduce((sum, t) => sum + t.services, 0);
  const totalIncidents = teams.reduce((sum, t) => sum + t.incidents, 0);

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">Teams</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{teams.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">Engineers</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{totalMembers}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs">Services</span>
          </div>
          <p className="text-xl font-semibold text-text-primary">{totalServices}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 text-text-tertiary mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs">Active Incidents</span>
          </div>
          <p className={cn(
            'text-xl font-semibold',
            totalIncidents > 0 ? 'text-error-text' : 'text-success-text'
          )}>
            {totalIncidents}
          </p>
        </div>
      </div>

      {/* Team List */}
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr,80px,80px,80px,80px,60px] gap-2 px-3 py-2 text-xs font-medium text-text-tertiary uppercase tracking-wider">
          <span>Team</span>
          <span className="text-center">Members</span>
          <span className="text-center">Services</span>
          <span className="text-center">Health</span>
          <span className="text-center">Deploys/wk</span>
          <span className="text-center">Trend</span>
        </div>
        
        {teams.map((team) => {
          const healthColors = getHealthColor(team.healthScore);
          
          return (
            <Link
              key={team.id}
              to={`/manage/analytics/teams/${team.id}`}
              className="grid grid-cols-[1fr,80px,80px,80px,80px,60px] gap-2 items-center p-3 rounded-lg bg-surface border border-border-subtle hover:border-border-default transition-colors group"
            >
              <div>
                <p className="font-medium text-sm text-text-primary group-hover:text-accent-text">
                  {team.name}
                </p>
                <p className="text-xs text-text-tertiary">Lead: {team.lead}</p>
              </div>
              <div className="text-center">
                <span className="text-sm text-text-secondary">{team.members}</span>
              </div>
              <div className="text-center">
                <span className="text-sm text-text-secondary">{team.services}</span>
              </div>
              <div className="text-center">
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  healthColors.bg,
                  healthColors.text,
                  healthColors.border,
                  'border'
                )}>
                  {team.healthScore}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm text-text-secondary">{team.deployments}</span>
              </div>
              <div className="flex justify-center">
                {team.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-text" />}
                {team.trend === 'down' && <TrendingDown className="w-4 h-4 text-error-text" />}
                {team.trend === 'stable' && <span className="w-4 h-0.5 bg-text-tertiary rounded" />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Clock className="w-4 h-4" />
          <span>Updated 5 minutes ago</span>
        </div>
        <Link 
          to="/manage/analytics"
          className="flex items-center gap-1 text-sm text-accent-text hover:text-accent"
        >
          View detailed analytics
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
