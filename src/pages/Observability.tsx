import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { applications, alerts, incidents } from '@/data/mock-data';
import { Card, CardHeader, Badge, StatusBadge, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  AlertTriangle,
  XCircle,
  Bell,
  TrendingUp,
  TrendingDown,
  LineChart,
  RefreshCw,
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MetricCard {
  name: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

const mockMetrics: MetricCard[] = [
  { name: 'Requests/sec', value: '15,420', change: 12.5, status: 'good' },
  { name: 'Error Rate', value: '0.23%', change: -5.2, status: 'good' },
  { name: 'P99 Latency', value: '89ms', change: 8.1, status: 'warning' },
  { name: 'Uptime', value: '99.97%', change: 0.02, status: 'good' },
];

const mockAlertRules = [
  { id: 'rule-1', name: 'High Error Rate', condition: 'error_rate > 2%', severity: 'critical', enabled: true, lastTriggered: '2026-01-25T10:15:00Z' },
  { id: 'rule-2', name: 'High Latency', condition: 'p99_latency > 500ms', severity: 'warning', enabled: true, lastTriggered: '2026-01-23T14:30:00Z' },
  { id: 'rule-3', name: 'Low Availability', condition: 'uptime < 99.9%', severity: 'critical', enabled: true, lastTriggered: null },
  { id: 'rule-4', name: 'CPU Threshold', condition: 'cpu_usage > 80%', severity: 'warning', enabled: true, lastTriggered: '2026-01-24T09:00:00Z' },
  { id: 'rule-5', name: 'Memory Threshold', condition: 'memory_usage > 85%', severity: 'warning', enabled: false, lastTriggered: null },
];

export function Observability() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1h');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'alerts', label: 'Alerts', count: alerts.filter((a) => !a.acknowledged).length },
    { id: 'logs', label: 'Logs' },
    { id: 'traces', label: 'Traces' },
  ];

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Observability</h1>
          <p className="text-text-tertiary mt-1">
            Monitor metrics, logs, traces, and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '15m', label: 'Last 15 minutes' },
              { value: '1h', label: 'Last 1 hour' },
              { value: '6h', label: 'Last 6 hours' },
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' },
            ]}
            className="w-40"
          />
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button variant="secondary" leftIcon={<Settings className="w-4 h-4" />}>
            Configure
          </Button>
        </div>
      </div>

      {/* Active Incidents Banner */}
      {activeIncidents.length > 0 && (
        <Card className="bg-error-subtle border-error-border p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-error-muted flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-error-text">
                {activeIncidents.length} Active Incident{activeIncidents.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-error-text">
                {activeIncidents[0].title}
              </p>
            </div>
            <Link to="/manage/incidents" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md">
              <Button variant="danger" size="sm">
                View Incidents
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-tertiary">{metric.name}</span>
              <div className={cn(
                'flex items-center gap-1 text-sm',
                metric.change > 0 ? 'text-success' : 'text-error'
              )}>
                {metric.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{metric.value}</p>
            <div className={cn(
              'mt-2 h-1 rounded-full',
              metric.status === 'good' && 'bg-success/30',
              metric.status === 'warning' && 'bg-warning/30',
              metric.status === 'critical' && 'bg-error/30'
            )}>
              <div className={cn(
                'h-1 rounded-full w-3/4',
                metric.status === 'good' && 'bg-success',
                metric.status === 'warning' && 'bg-warning',
                metric.status === 'critical' && 'bg-error'
              )} />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Health */}
            <Card padding="lg">
              <CardHeader 
                title="Service Health" 
                action={
                  <Link to="/discover/catalog" className="text-sm text-accent-text hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded">
                    View all
                  </Link>
                }
              />
              <div className="mt-4 space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <Link
                    key={app.id}
                    to={`/discover/catalog/${app.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-surface-raised hover:bg-surface-raised/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      app.status === 'healthy' && 'bg-success',
                      app.status === 'degraded' && 'bg-warning',
                      app.status === 'critical' && 'bg-error'
                    )} />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{app.displayName}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-text-primary">{app.metrics.requestsPerSecond.toLocaleString()} rps</p>
                      <p className="text-text-tertiary">{app.metrics.latencyP99}ms p99</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card padding="lg">
              <CardHeader 
                title="Recent Alerts" 
                action={
                  <Badge variant={activeAlerts.length > 0 ? 'danger' : 'success'}>
                    {activeAlerts.length} active
                  </Badge>
                }
              />
              <div className="mt-4 space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      !alert.acknowledged && 'bg-warning/10 border-warning/30',
                      alert.acknowledged && 'bg-surface-raised border-border-subtle'
                    )}
                  >
                    {alert.severity === 'critical' && <XCircle className="w-5 h-5 text-error mt-0.5" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />}
                    {alert.severity === 'info' && <Bell className="w-5 h-5 text-accent mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary">{alert.title}</p>
                      <p className="text-sm text-text-secondary truncate">{alert.message}</p>
                      <p className="text-xs text-text-disabled mt-1">
                        {formatRelativeTime(alert.timestamp)}
                        {alert.acknowledged && ` · Acknowledged by ${alert.acknowledgedBy}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chart Placeholder */}
            <Card padding="lg" className="lg:col-span-2">
              <CardHeader title="Request Rate & Error Rate" />
              <div className="mt-4 h-64 flex items-center justify-center bg-surface-raised rounded-lg border-2 border-dashed border-border-subtle">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-text-disabled mx-auto mb-2" />
                  <p className="text-text-tertiary">Chart visualization</p>
                  <p className="text-sm text-text-disabled">Time-series data would render here</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Rules */}
            <Card padding="lg">
              <CardHeader 
                title="Alert Rules" 
                description="Configure alerting thresholds"
                action={
                  <Button variant="secondary" size="sm" leftIcon={<Bell className="w-4 h-4" />}>
                    Add Rule
                  </Button>
                }
              />
              <div className="mt-4 space-y-3">
                {mockAlertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border',
                      rule.enabled ? 'border-border-subtle' : 'border-border-subtle bg-surface-raised opacity-60'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      rule.severity === 'critical' && 'bg-error/20',
                      rule.severity === 'warning' && 'bg-warning/20'
                    )}>
                      <AlertTriangle className={cn(
                        'w-5 h-5',
                        rule.severity === 'critical' && 'text-error',
                        rule.severity === 'warning' && 'text-warning'
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{rule.name}</p>
                      <code className="text-sm text-text-tertiary">{rule.condition}</code>
                    </div>
                    <Badge variant={rule.severity === 'critical' ? 'danger' : 'warning'} size="sm">
                      {rule.severity}
                    </Badge>
                    {rule.lastTriggered && (
                      <span className="text-sm text-text-tertiary">
                        Last: {formatRelativeTime(rule.lastTriggered)}
                      </span>
                    )}
                    <Button variant="ghost" size="sm">
                      {rule.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.slice(0, 4).map((app) => (
              <Card key={app.id} padding="lg">
                <CardHeader title={app.displayName} />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <p className="text-sm text-text-tertiary">Requests/sec</p>
                    <p className="text-xl font-bold text-text-primary">
                      {app.metrics.requestsPerSecond.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <p className="text-sm text-text-tertiary">P99 Latency</p>
                    <p className="text-xl font-bold text-text-primary">{app.metrics.latencyP99}ms</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <p className="text-sm text-text-tertiary">Error Rate</p>
                    <p className={cn(
                      'text-xl font-bold',
                      app.metrics.errorRate > 1 ? 'text-error' : 'text-text-primary'
                    )}>
                      {app.metrics.errorRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <p className="text-sm text-text-tertiary">Uptime</p>
                    <p className="text-xl font-bold text-success">{app.metrics.uptime}%</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <Card padding="lg">
            <CardHeader 
              title="Logs" 
              action={
                <Button variant="secondary" size="sm">
                  Live Tail
                </Button>
              }
            />
            <div className="mt-4 bg-code-bg rounded-lg p-4 max-h-96 overflow-auto font-mono text-sm">
              {[
                { time: '11:30:15.234', level: 'INFO', service: 'api-gateway', message: 'Request processed successfully' },
                { time: '11:30:15.156', level: 'DEBUG', service: 'auth-service', message: 'Token validated for user_123' },
                { time: '11:30:14.989', level: 'INFO', service: 'payment-service', message: 'Payment completed: $49.99' },
                { time: '11:30:14.567', level: 'WARN', service: 'notification-service', message: 'SendGrid rate limit approaching' },
                { time: '11:30:14.234', level: 'ERROR', service: 'notification-service', message: 'Failed to send email: timeout' },
                { time: '11:30:13.890', level: 'INFO', service: 'api-gateway', message: 'Health check passed' },
                { time: '11:30:13.456', level: 'INFO', service: 'user-dashboard', message: 'Static assets served' },
                { time: '11:30:12.123', level: 'DEBUG', service: 'data-pipeline', message: 'Batch job completed: 1000 records' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 py-1">
                  <span className="text-text-disabled">{log.time}</span>
                  <span className={cn(
                    'w-12',
                    log.level === 'INFO' && 'text-info-text',
                    log.level === 'DEBUG' && 'text-text-tertiary',
                    log.level === 'WARN' && 'text-warning-text',
                    log.level === 'ERROR' && 'text-error-text'
                  )}>
                    {log.level}
                  </span>
                  <span className="text-accent-text">[{log.service}]</span>
                  <span className="text-code-text">{log.message}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'traces' && (
          <Card padding="lg">
            <CardHeader title="Distributed Traces" />
            <div className="mt-4 space-y-4">
              {[
                { id: 'trace-1', name: 'POST /api/v1/payments', duration: '234ms', spans: 8, status: 'success' },
                { id: 'trace-2', name: 'GET /api/v1/users/me', duration: '45ms', spans: 4, status: 'success' },
                { id: 'trace-3', name: 'POST /api/v1/notifications', duration: '1.2s', spans: 6, status: 'error' },
                { id: 'trace-4', name: 'GET /api/v1/products', duration: '89ms', spans: 5, status: 'success' },
              ].map((trace) => (
                <div key={trace.id} className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle hover:bg-surface-raised transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas" tabIndex={0}>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    trace.status === 'success' && 'bg-success',
                    trace.status === 'error' && 'bg-error'
                  )} />
                  <div className="flex-1">
                    <p className="font-mono text-sm text-text-primary">{trace.name}</p>
                    <p className="text-xs text-text-tertiary">{trace.spans} spans</p>
                  </div>
                  <span className={cn(
                    'font-mono text-sm text-text-secondary',
                    trace.status === 'error' && 'text-error'
                  )}>
                    {trace.duration}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-disabled" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </TabPanel>
    </div>
  );
}
