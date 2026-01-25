import { useState } from 'react';
import { cn } from '@/lib/utils';
import { applications, incidents } from '@/data/mock-data';
import { Card, CardHeader, Badge, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Rocket,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';

interface MetricTile {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

const metrics: MetricTile[] = [
  { label: 'Total Deployments', value: '247', change: 12, changeLabel: 'vs last month', icon: <Rocket className="w-5 h-5" />, color: 'bg-primary-100 text-primary-600' },
  { label: 'Deployment Success Rate', value: '96.4%', change: 2.3, changeLabel: 'vs last month', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-success-100 text-success-600' },
  { label: 'Mean Time to Recovery', value: '32m', change: -15, changeLabel: 'vs last month', icon: <Clock className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
  { label: 'Active Incidents', value: '2', change: -50, changeLabel: 'vs last week', icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-warning-100 text-warning-600' },
];

const teamMetrics = [
  { team: 'Platform Engineering', deployments: 89, successRate: 97.8, mttr: '28m', incidents: 3 },
  { team: 'Payments', deployments: 54, successRate: 98.1, mttr: '22m', incidents: 1 },
  { team: 'User Experience', deployments: 67, successRate: 94.5, mttr: '45m', incidents: 2 },
  { team: 'Data Platform', deployments: 37, successRate: 95.2, mttr: '38m', incidents: 0 },
];

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deployments', label: 'Deployments' },
    { id: 'reliability', label: 'Reliability' },
    { id: 'teams', label: 'Teams' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Platform metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'Last year' },
            ]}
            className="w-36"
          />
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', metric.color)}>
                {metric.icon}
              </div>
              <div className={cn(
                'flex items-center gap-1 text-sm',
                metric.change > 0 ? 'text-success-600' : 'text-danger-600'
              )}>
                {metric.change > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="text-xs text-slate-400 mt-1">{metric.changeLabel}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deployment Trends Chart */}
            <Card padding="lg">
              <CardHeader title="Deployment Trends" description="Deployments over time" />
              <div className="mt-4 h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">Trend chart</p>
                </div>
              </div>
            </Card>

            {/* Service Distribution */}
            <Card padding="lg">
              <CardHeader title="Service Distribution" description="Applications by type" />
              <div className="mt-4 h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">Distribution chart</p>
                </div>
              </div>
            </Card>

            {/* Top Services */}
            <Card padding="lg">
              <CardHeader title="Top Deployed Services" description="Most active services this month" />
              <div className="mt-4 space-y-3">
                {applications.slice(0, 5).map((app, i) => (
                  <div key={app.id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-400 w-6">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{app.displayName}</p>
                      <p className="text-sm text-slate-500">{app.team.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{Math.floor(Math.random() * 30) + 10}</p>
                      <p className="text-sm text-slate-500">deploys</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Incident Summary */}
            <Card padding="lg">
              <CardHeader title="Incident Summary" description="This month's incident breakdown" />
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-slate-50 text-center">
                    <p className="text-3xl font-bold text-slate-900">{incidents.length}</p>
                    <p className="text-sm text-slate-500">Total Incidents</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 text-center">
                    <p className="text-3xl font-bold text-success-600">
                      {incidents.filter((i) => i.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-slate-500">Resolved</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = incidents.filter((i) => i.severity === severity).length;
                    const total = incidents.length;
                    return (
                      <div key={severity} className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 w-16 capitalize">{severity}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200">
                          <div
                            className={cn(
                              'h-2 rounded-full',
                              severity === 'critical' && 'bg-danger-500',
                              severity === 'high' && 'bg-danger-400',
                              severity === 'medium' && 'bg-warning-500',
                              severity === 'low' && 'bg-blue-500'
                            )}
                            style={{ width: `${(count / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-4xl font-bold text-slate-900">247</p>
                <p className="text-slate-500">Total Deployments</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-4xl font-bold text-success-600">238</p>
                <p className="text-slate-500">Successful</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-4xl font-bold text-danger-600">9</p>
                <p className="text-slate-500">Failed</p>
              </Card>
            </div>

            <Card padding="lg">
              <CardHeader title="Deployments by Environment" />
              <div className="mt-4 h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">Bar chart by environment</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Deployment Frequency" />
              <div className="mt-4 grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-10 rounded',
                      Math.random() > 0.7 ? 'bg-primary-500' :
                      Math.random() > 0.4 ? 'bg-primary-300' :
                      Math.random() > 0.2 ? 'bg-primary-100' : 'bg-slate-100'
                    )}
                    title={`${Math.floor(Math.random() * 20)} deployments`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>4 weeks ago</span>
                <span>Today</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reliability' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-slate-500">Uptime (30d)</p>
                <p className="text-3xl font-bold text-success-600">99.95%</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-slate-500">MTTR</p>
                <p className="text-3xl font-bold text-slate-900">32m</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-slate-500">MTBF</p>
                <p className="text-3xl font-bold text-slate-900">12.4d</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-slate-500">Error Budget</p>
                <p className="text-3xl font-bold text-warning-600">67%</p>
              </Card>
            </div>

            <Card padding="lg">
              <CardHeader title="SLO Performance" description="Service Level Objectives compliance" />
              <div className="mt-4 space-y-4">
                {[
                  { slo: 'Availability', target: '99.9%', current: '99.97%', status: 'met' },
                  { slo: 'Latency P99', target: '<200ms', current: '156ms', status: 'met' },
                  { slo: 'Error Rate', target: '<0.5%', current: '0.23%', status: 'met' },
                  { slo: 'Throughput', target: '>10k rps', current: '15.4k rps', status: 'met' },
                ].map((item) => (
                  <div key={item.slo} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.slo}</p>
                      <p className="text-sm text-slate-500">Target: {item.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success-600">{item.current}</p>
                      <Badge variant="success" size="sm">Met</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-4 font-medium text-slate-600">Team</th>
                    <th className="text-left p-4 font-medium text-slate-600">Deployments</th>
                    <th className="text-left p-4 font-medium text-slate-600">Success Rate</th>
                    <th className="text-left p-4 font-medium text-slate-600">MTTR</th>
                    <th className="text-left p-4 font-medium text-slate-600">Incidents</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMetrics.map((team) => (
                    <tr key={team.team} className="border-b border-slate-100 last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary-600" />
                          </div>
                          <span className="font-medium text-slate-900">{team.team}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-900">{team.deployments}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={team.successRate > 95 ? 'success' : 'warning'}>
                          {team.successRate}%
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900">{team.mttr}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={team.incidents === 0 ? 'success' : team.incidents < 3 ? 'warning' : 'danger'}>
                          {team.incidents}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card padding="lg">
                <CardHeader title="Team Velocity" description="Deployments per team" />
                <div className="mt-4 h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Team velocity chart</p>
                  </div>
                </div>
              </Card>
              <Card padding="lg">
                <CardHeader title="Lead Time Distribution" description="Time from commit to production" />
                <div className="mt-4 h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Lead time histogram</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
