import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useIncidents } from '@/hooks';
import { useInteractionStore } from '@/stores';
import { Button, SearchInput, Badge, Card, Tabs, TabPanel, Avatar, Skeleton, useToast } from '@/components/ui';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Plus,
  User,
  Eye,
  Bell,
  ChevronRight,
} from 'lucide-react';
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types';

const severityConfig: Record<IncidentSeverity, { color: string; label: string; icon: React.ReactNode }> = {
  critical: {
    color: 'bg-danger-100 text-danger-700 border-danger-200',
    label: 'Critical',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  high: {
    color: 'bg-danger-50 text-danger-600 border-danger-100',
    label: 'High',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  medium: {
    color: 'bg-warning-100 text-warning-700 border-warning-200',
    label: 'Medium',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  low: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'Low',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const statusConfig: Record<IncidentStatus, { color: string; label: string }> = {
  open: { color: 'bg-danger-100 text-danger-700', label: 'Open' },
  investigating: { color: 'bg-warning-100 text-warning-700', label: 'Investigating' },
  identified: { color: 'bg-blue-100 text-blue-700', label: 'Identified' },
  monitoring: { color: 'bg-primary-100 text-primary-700', label: 'Monitoring' },
  resolved: { color: 'bg-success-100 text-success-700', label: 'Resolved' },
};

function IncidentCard({ incident }: { incident: Incident }) {
  const severity = severityConfig[incident.severity];
  const { 
    acknowledgeIncident, 
    assignIncident, 
    resolveIncident, 
    getIncidentUpdate,
    logAction 
  } = useInteractionStore();
  const toast = useToast();

  const update = getIncidentUpdate(incident.id);
  const isAcknowledged = update?.acknowledged;
  const currentAssignee = update?.assignee || incident.assignee;
  const currentStatus = update?.status || incident.status;
  const status = statusConfig[currentStatus as IncidentStatus] || statusConfig.open;

  const handleAcknowledge = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    acknowledgeIncident(incident.id);
    logAction('Acknowledged incident', incident.title);
    toast.success('Incident Acknowledged', `You acknowledged "${incident.title}"`);
  };

  const handleAssignToMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    assignIncident(incident.id, 'Sarah Chen');
    logAction('Assigned incident', incident.title);
    toast.success('Incident Assigned', `"${incident.title}" is now assigned to you`);
  };

  const handleResolve = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resolveIncident(incident.id);
    logAction('Resolved incident', incident.title);
    toast.success('Incident Resolved', `"${incident.title}" has been marked as resolved`);
  };

  const isResolved = currentStatus === 'resolved';

  return (
    <Link to={`/manage/incidents/${incident.id}`}>
      <Card variant="hover" padding="none" className="overflow-hidden">
        <div className={cn('h-1', severity.color.split(' ')[0])} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className={severity.color} size="sm">
                {severity.icon}
                {severity.label}
              </Badge>
              <Badge className={status.color} size="sm">
                {status.label}
              </Badge>
              {isAcknowledged && !isResolved && (
                <Badge variant="neutral" size="sm" className="gap-1">
                  <Eye className="w-3 h-3" />
                  Acked
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {formatRelativeTime(incident.createdAt)}
            </span>
          </div>

          <h3 className="font-semibold text-slate-900 mb-1">{incident.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {incident.description}
          </p>

          {incident.applicationName && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <span className="font-medium text-primary-600">{incident.applicationName}</span>
              <span className="text-slate-300">•</span>
              <span>{incident.team}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              {currentAssignee ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Avatar name={currentAssignee} size="sm" />
                  <span>{currentAssignee}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Unassigned</span>
              )}
            </div>

            {/* Action buttons */}
            {!isResolved && (
              <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                {!isAcknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAcknowledge}
                    title="Acknowledge"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                )}
                {!currentAssignee && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAssignToMe}
                    title="Assign to me"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResolve}
                  className="text-success-600"
                  title="Resolve"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            )}

            {isResolved && (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function Incidents() {
  const { data: incidents, isLoading } = useIncidents();
  const { incidentUpdates } = useInteractionStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const toast = useToast();

  // Merge incident data with updates
  const mergedIncidents = useMemo(() => {
    if (!incidents) return [];
    return incidents.map((incident) => {
      const update = incidentUpdates[incident.id];
      if (update) {
        return {
          ...incident,
          status: (update.status || incident.status) as IncidentStatus,
          assignee: update.assignee || incident.assignee,
        };
      }
      return incident;
    });
  }, [incidents, incidentUpdates]);

  const tabs = useMemo(() => {
    const active = mergedIncidents.filter((i) => i.status !== 'resolved').length;
    const resolved = mergedIncidents.filter((i) => i.status === 'resolved').length;
    return [
      { id: 'active', label: 'Active', count: active },
      { id: 'resolved', label: 'Resolved', count: resolved },
      { id: 'all', label: 'All', count: mergedIncidents.length },
    ];
  }, [mergedIncidents]);

  const filteredIncidents = useMemo(() => {
    let result = mergedIncidents;

    // Filter by tab
    if (activeTab === 'active') {
      result = result.filter((i) => i.status !== 'resolved');
    } else if (activeTab === 'resolved') {
      result = result.filter((i) => i.status === 'resolved');
    }

    // Filter by search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(lower) ||
          i.description.toLowerCase().includes(lower) ||
          i.applicationName?.toLowerCase().includes(lower)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [mergedIncidents, activeTab, search]);

  const activeIncidents = mergedIncidents.filter((i) => i.status !== 'resolved');

  const handleCreateIncident = () => {
    toast.info('Create Incident', 'Opening incident creation form...');
    // In a real app, this would open a modal or navigate to a form
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incidents</h1>
          <p className="text-slate-500 mt-1">
            Track and manage incidents across your platform
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreateIncident}
        >
          Create Incident
        </Button>
      </div>

      {/* Active Incidents Summary */}
      {activeIncidents.length > 0 && (
        <Card className="bg-danger-50 border-danger-200 p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-danger-800">
                {activeIncidents.length} Active Incident{activeIncidents.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-danger-600">
                {activeIncidents.filter((i) => i.severity === 'critical').length} critical,{' '}
                {activeIncidents.filter((i) => i.severity === 'high').length} high severity
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search incidents..."
          className="flex-1"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Incidents Grid */}
      <TabPanel>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredIncidents.length === 0 ? (
          <Card className="text-center py-12">
            {activeTab === 'active' ? (
              <>
                <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <p className="font-medium text-slate-900">No Active Incidents</p>
                <p className="text-slate-500">All systems are operating normally</p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No incidents found</p>
              </>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
