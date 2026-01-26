import { useParams, Link } from 'react-router-dom';
import { cn, formatRelativeTime, formatDateTime } from '@/lib/utils';
import { incidents } from '@/data/mock-data';
import { Card, CardHeader, Badge, Button, Avatar, Tabs, TabPanel } from '@/components/ui';
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Users,
  Link as LinkIcon,
  ExternalLink,
  Bell,
  FileText,
  Activity,
  Send,
} from 'lucide-react';
import { useState } from 'react';

const severityConfig = {
  critical: { color: 'bg-error-subtle text-error border-error/20', icon: <AlertTriangle className="w-5 h-5" /> },
  high: { color: 'bg-error/10 text-error border-error/10', icon: <AlertCircle className="w-5 h-5" /> },
  medium: { color: 'bg-warning-subtle text-warning border-warning/20', icon: <AlertCircle className="w-5 h-5" /> },
  low: { color: 'bg-info-subtle text-info border-info/20', icon: <AlertCircle className="w-5 h-5" /> },
};

const statusConfig = {
  open: { color: 'bg-error-subtle text-error', label: 'Open' },
  investigating: { color: 'bg-warning-subtle text-warning', label: 'Investigating' },
  identified: { color: 'bg-info-subtle text-info', label: 'Identified' },
  monitoring: { color: 'bg-accent-subtle text-accent', label: 'Monitoring' },
  resolved: { color: 'bg-success-subtle text-success', label: 'Resolved' },
};

export function IncidentDetail() {
  const { id } = useParams();
  const incident = incidents.find((i) => i.id === id);
  const [activeTab, setActiveTab] = useState('timeline');
  const [newComment, setNewComment] = useState('');

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Incident not found</p>
        <Link to="/manage/incidents" className="text-accent-text hover:text-accent-text mt-2 inline-block">
          Back to Incidents
        </Link>
      </div>
    );
  }

  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];

  const tabs = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'related', label: 'Related' },
    { id: 'runbook', label: 'Runbook' },
    { id: 'postmortem', label: 'Post-mortem' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/manage/incidents"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Incidents
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', severity.color)}>
            {severity.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{incident.title}</h1>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Badge className={severity.color}>{incident.severity}</Badge>
              <Badge className={status.color}>{status.label}</Badge>
              {incident.applicationName && (
                <Link
                  to={`/discover/catalog/${incident.applicationId}`}
                  className="text-sm text-accent-text hover:text-accent-text"
                >
                  {incident.applicationName}
                </Link>
              )}
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Opened {formatRelativeTime(incident.createdAt)} · Team: {incident.team}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {incident.status !== 'resolved' && (
            <>
              <Button variant="secondary" leftIcon={<Bell className="w-4 h-4" />}>
                Page On-Call
              </Button>
              <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
                Resolve
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <Card padding="lg">
        <h3 className="font-semibold text-text-primary mb-2">Description</h3>
        <p className="text-text-secondary">{incident.description}</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <TabPanel>
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {/* Add Comment */}
                <Card padding="lg">
                  <div className="flex gap-3">
                    <Avatar name="Sarah Chen" size="md" />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add an update..."
                        className="input min-h-[80px]"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Status Update
                          </Button>
                          <Button variant="ghost" size="sm">
                            Attach
                          </Button>
                        </div>
                        <Button variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Timeline Events */}
                <div className="space-y-4 relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border-subtle" />
                  {incident.timeline.map((event) => (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                        event.type === 'created' && 'bg-danger-100',
                        event.type === 'status-change' && 'bg-primary-100',
                        event.type === 'comment' && 'bg-surface-raised',
                        event.type === 'resolved' && 'bg-success-100'
                      )}>
                        {event.type === 'created' && <AlertTriangle className="w-5 h-5 text-danger-600" />}
                        {event.type === 'status-change' && <Activity className="w-5 h-5 text-accent-text" />}
                        {event.type === 'comment' && <MessageSquare className="w-5 h-5 text-text-tertiary" />}
                        {event.type === 'resolved' && <CheckCircle className="w-5 h-5 text-success-600" />}
                      </div>
                      <Card className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">{event.user}</span>
                            {event.type === 'status-change' && (
                              <Badge variant="neutral" size="sm">Status Update</Badge>
                            )}
                          </div>
                          <span className="text-sm text-text-secondary">
                            {formatDateTime(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-text-secondary">{event.content}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <Card padding="lg">
                <CardHeader title="Related Items" />
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-lg border border-border-subtle flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning-500" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Alert: High error rate</p>
                      <p className="text-sm text-text-secondary">Triggered {formatRelativeTime(incident.createdAt)}</p>
                    </div>
                    <Badge variant="warning" size="sm">Alert</Badge>
                  </div>
                  {incident.applicationName && (
                    <Link
                      to={`/discover/catalog/${incident.applicationId}`}
                      className="p-3 rounded-lg border border-border-subtle flex items-center gap-3 hover:bg-surface-raised transition-colors"
                    >
                      <Activity className="w-5 h-5 text-text-secondary" />
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{incident.applicationName}</p>
                        <p className="text-sm text-text-secondary">Affected service</p>
                      </div>
                      <Badge variant="info" size="sm">Service</Badge>
                    </Link>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'runbook' && (
              <Card padding="lg">
                <CardHeader 
                  title="Runbook" 
                  description="Step-by-step incident response guide"
                />
                <div className="mt-4 space-y-4">
                  {[
                    { step: 1, title: 'Assess Impact', description: 'Determine the scope and severity of the incident', done: true },
                    { step: 2, title: 'Page On-Call', description: 'Notify the on-call engineer if not already done', done: true },
                    { step: 3, title: 'Investigate Root Cause', description: 'Check logs, metrics, and recent deployments', done: false },
                    { step: 4, title: 'Implement Fix', description: 'Apply the fix or rollback if necessary', done: false },
                    { step: 5, title: 'Verify Resolution', description: 'Confirm the issue is resolved', done: false },
                    { step: 6, title: 'Document & Close', description: 'Update timeline and schedule post-mortem', done: false },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border',
                        item.done ? 'bg-success-50 border-success-200' : 'border-border-subtle'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        item.done ? 'bg-success-500 text-white' : 'bg-surface-raised text-text-tertiary'
                      )}>
                        {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
                      </div>
                      <div>
                        <p className={cn(
                          'font-medium',
                          item.done ? 'text-success-800' : 'text-text-primary'
                        )}>
                          {item.title}
                        </p>
                        <p className={cn(
                          'text-sm',
                          item.done ? 'text-success-700' : 'text-text-secondary'
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'postmortem' && (
              <Card padding="lg">
                <CardHeader 
                  title="Post-Mortem" 
                  description={incident.status === 'resolved' ? 'Document learnings from this incident' : 'Available after incident is resolved'}
                />
                {incident.status === 'resolved' ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Summary</h4>
                      <textarea className="input min-h-[80px]" placeholder="Brief summary of the incident..." />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Root Cause</h4>
                      <textarea className="input min-h-[80px]" placeholder="What caused the incident..." />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Action Items</h4>
                      <textarea className="input min-h-[80px]" placeholder="Follow-up tasks to prevent recurrence..." />
                    </div>
                    <Button variant="primary">Save Post-Mortem</Button>
                  </div>
                ) : (
                  <div className="mt-4 text-center py-8">
                    <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary">Resolve the incident to create a post-mortem</p>
                  </div>
                )}
              </Card>
            )}
          </TabPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card padding="lg">
            <CardHeader title="Details" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Severity</span>
                <Badge className={severity.color}>{incident.severity}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Team</span>
                <span className="text-sm font-medium text-text-primary">{incident.team}</span>
              </div>
              {incident.assignee && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={incident.assignee} size="sm" />
                    <span className="text-sm font-medium text-text-primary">{incident.assignee}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Duration</span>
                <span className="text-sm font-medium text-text-primary">
                  {incident.resolvedAt
                    ? formatRelativeTime(incident.resolvedAt)
                    : formatRelativeTime(incident.createdAt) + ' (ongoing)'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="lg">
            <CardHeader title="Quick Actions" />
            <div className="mt-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start" leftIcon={<Users className="w-4 h-4" />}>
                Assign to me
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<Bell className="w-4 h-4" />}>
                Subscribe
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<LinkIcon className="w-4 h-4" />}>
                Copy link
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<ExternalLink className="w-4 h-4" />}>
                Open in Slack
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
