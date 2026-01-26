import { useParams, Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { teams, applications, deployments, incidents } from '@/data/mock-data';
import { Card, CardHeader, Badge, StatusBadge, Avatar, Button } from '@/components/ui';
import {
  ArrowLeft,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Server,
  AlertTriangle,
  ChevronRight,
  Phone,
  Shield,
} from 'lucide-react';

export function TeamDetail() {
  const { id } = useParams();
  const team = teams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Team not found</p>
        <Link to="/discover/catalog" className="text-accent-text hover:text-accent-text mt-2 inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const teamApps = applications.filter((a) => a.team.id === team.id);
  const teamDeployments = deployments.filter((d) =>
    teamApps.some((a) => a.id === d.applicationId)
  );
  const teamIncidents = incidents.filter((i) => i.team === team.name);

  const healthyApps = teamApps.filter((a) => a.status === 'healthy').length;
  const activeIncidents = teamIncidents.filter((i) => i.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/discover/catalog"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center text-accent-text">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{team.name}</h1>
            {team.description && (
              <p className="text-text-secondary mt-1">{team.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              {team.email && (
                <a
                  href={`mailto:${team.email}`}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent-text"
                >
                  <Mail className="w-4 h-4" />
                  {team.email}
                </a>
              )}
              {team.slackChannel && (
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent-text"
                >
                  <MessageSquare className="w-4 h-4" />
                  {team.slackChannel}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<MessageSquare className="w-4 h-4" />}>
            Message
          </Button>
          <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
              <Users className="w-5 h-5 text-text-tertiary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{team.members.length}</p>
              <p className="text-sm text-text-secondary">Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{teamApps.length}</p>
              <p className="text-sm text-text-secondary">Services</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {healthyApps}/{teamApps.length}
              </p>
              <p className="text-sm text-text-secondary">Healthy</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              activeIncidents > 0 ? 'bg-error-subtle' : 'bg-surface-raised'
            )}>
              <AlertTriangle className={cn(
                'w-5 h-5',
                activeIncidents > 0 ? 'text-error' : 'text-text-tertiary'
              )} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{activeIncidents}</p>
              <p className="text-sm text-text-secondary">Active Incidents</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <Card padding="lg">
            <CardHeader 
              title="Services" 
              description={`${teamApps.length} services owned by this team`}
              action={
                <Link to={`/discover/catalog?team=${team.id}`} className="text-sm text-accent-text hover:text-accent-text">
                  View all
                </Link>
              }
            />
            <div className="mt-4 space-y-3">
              {teamApps.slice(0, 5).map((app) => (
                <Link
                  key={app.id}
                  to={`/discover/catalog/${app.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-surface-raised hover:bg-surface-overlay transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-border-subtle">
                    <Server className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary">{app.displayName}</p>
                    <p className="text-sm text-text-secondary">{app.type} · {app.language}</p>
                  </div>
                  <StatusBadge status={app.status} />
                  <ChevronRight className="w-5 h-5 text-text-tertiary" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Deployments */}
          <Card padding="lg">
            <CardHeader 
              title="Recent Deployments" 
              description="Latest deployment activity"
            />
            <div className="mt-4 space-y-3">
              {teamDeployments.slice(0, 5).map((deploy) => (
                <div
                  key={deploy.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-surface-raised"
                >
                  <StatusBadge status={deploy.status} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary">{deploy.applicationName}</p>
                    <p className="text-sm text-text-secondary">
                      {deploy.version} → {deploy.environment}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-text-primary">{deploy.triggeredBy}</p>
                    <p className="text-text-secondary">{formatRelativeTime(deploy.triggeredAt)}</p>
                  </div>
                </div>
              ))}
              {teamDeployments.length === 0 && (
                <p className="text-center text-text-secondary py-4">No recent deployments</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* On-Call */}
          {team.oncallSchedule && (
            <Card padding="lg">
              <CardHeader title="On-Call" />
              <div className="mt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-200">
                  <Phone className="w-5 h-5 text-accent-text" />
                  <div>
                    <p className="font-medium text-primary-800">{team.oncallSchedule}</p>
                    <p className="text-sm text-accent-text">Active schedule</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Team Members */}
          <Card padding="lg">
            <CardHeader title="Team Members" />
            <div className="mt-4 space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{member.name}</p>
                    <p className="text-sm text-text-secondary truncate">{member.role}</p>
                  </div>
                  {member.id === team.lead && (
                    <Badge variant="info" size="sm">Lead</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Active Incidents */}
          {teamIncidents.filter((i) => i.status !== 'resolved').length > 0 && (
            <Card padding="lg">
              <CardHeader title="Active Incidents" />
              <div className="mt-4 space-y-3">
                {teamIncidents
                  .filter((i) => i.status !== 'resolved')
                  .map((incident) => (
                    <Link
                      key={incident.id}
                      to={`/manage/incidents/${incident.id}`}
                      className="block p-3 rounded-lg bg-danger-50 border border-danger-200 hover:bg-danger-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={incident.severity === 'critical' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {incident.severity}
                        </Badge>
                        <StatusBadge status={incident.status} />
                      </div>
                      <p className="font-medium text-danger-800">{incident.title}</p>
                      <p className="text-sm text-danger-600 mt-1">
                        {formatRelativeTime(incident.createdAt)}
                      </p>
                    </Link>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
