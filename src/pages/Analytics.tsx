import { useState } from 'react';
import { cn } from '@/lib/utils';
import { applications, incidents, platformMetrics, teamMetrics as mockTeamMetrics, getActiveIncidents, doraMetrics } from '@/data/mock-data';
import { Card, CardHeader, Badge, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  Users,
  Rocket,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  TrendingUp,
  Activity,
} from 'lucide-react';

// ============================================================================
// CHART DATA
// ============================================================================

const deploymentTrendData = [
  { week: 'W1', deploys: 32 },
  { week: 'W2', deploys: 38 },
  { week: 'W3', deploys: 35 },
  { week: 'W4', deploys: 42 },
  { week: 'W5', deploys: 39 },
  { week: 'W6', deploys: 45 },
  { week: 'W7', deploys: 41 },
  { week: 'W8', deploys: 48 },
  { week: 'W9', deploys: 44 },
  { week: 'W10', deploys: 52 },
  { week: 'W11', deploys: 47 },
  { week: 'W12', deploys: 55 },
];

const serviceDistributionData = [
  { name: 'Backend', value: 45, color: '#8b5cf6' },
  { name: 'Frontend', value: 25, color: '#22c55e' },
  { name: 'Data', value: 15, color: '#eab308' },
  { name: 'Infra', value: 10, color: '#3b82f6' },
  { name: 'Libs', value: 5, color: '#ec4899' },
];

const environmentData = [
  { name: 'Production', deploys: platformMetrics.deployments.byEnvironment.production, color: '#8b5cf6' },
  { name: 'Staging', deploys: platformMetrics.deployments.byEnvironment.staging, color: '#22c55e' },
  { name: 'Development', deploys: platformMetrics.deployments.byEnvironment.development, color: '#3b82f6' },
];

const teamVelocityData = mockTeamMetrics.map(t => ({
  name: t.teamName.split(' ')[0],
  fullName: t.teamName,
  success: Math.round(t.deployments * (t.successRate / 100)),
  failed: Math.round(t.deployments * ((100 - t.successRate) / 100)),
  total: t.deployments,
  successRate: t.successRate,
}));

const leadTimeData = [
  { bucket: '<1h', value: 15, color: '#22c55e' },
  { bucket: '1-2h', value: 35, color: '#22c55e' },
  { bucket: '2-4h', value: 28, color: '#eab308' },
  { bucket: '4-8h', value: 12, color: '#f97316' },
  { bucket: '8-24h', value: 7, color: '#f97316' },
  { bucket: '>24h', value: 3, color: '#ef4444' },
];

// ============================================================================
// PURE CSS + INLINE SVG CHART COMPONENTS
// ============================================================================

// Area Chart Component
function AreaChart({ data }: { data: typeof deploymentTrendData }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxValue = Math.max(...data.map(d => d.deploys));
  const minValue = Math.min(...data.map(d => d.deploys));
  const range = maxValue - minValue || 1;
  
  // Generate SVG path
  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 10, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.deploys - minValue) / range) * chartHeight,
  }));
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;
  
  return (
    <div className="relative h-52">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const value = Math.round(minValue + range * ratio);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">{value}</text>
            </g>
          );
        })}
        
        {/* X axis labels */}
        {data.filter((_, i) => i % 2 === 0).map((d, idx) => {
          const i = idx * 2;
          return (
            <text key={i} x={points[i].x} y={height - 8} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">{d.week}</text>
          );
        })}
        
        {/* Area */}
        <path d={areaPath} fill="url(#areaGrad)" />
        
        {/* Line */}
        <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} />
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={hoveredIndex === i ? 6 : 4} 
              fill={hoveredIndex === i ? '#8b5cf6' : '#1a1a2e'} 
              stroke="#8b5cf6" 
              strokeWidth="2"
              style={{ transition: 'all 0.2s', filter: hoveredIndex === i ? 'drop-shadow(0 0 8px #8b5cf6)' : 'none' }}
            />
          </g>
        ))}
      </svg>
      
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 pointer-events-none bg-surface-overlay border border-accent/40 rounded-lg px-3 py-2 shadow-xl animate-fade-in"
          style={{ 
            left: `${(points[hoveredIndex].x / width) * 100}%`, 
            top: `${(points[hoveredIndex].y / height) * 100 - 5}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <p className="font-semibold text-text-primary text-sm">{data[hoveredIndex].week}</p>
          <p className="text-sm text-accent">Deployments: <strong>{data[hoveredIndex].deploys}</strong></p>
        </div>
      )}
    </div>
  );
}

// Donut Chart Component
function DonutChart({ data }: { data: typeof serviceDistributionData }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const size = 160;
  const center = size / 2;
  const outerRadius = 65;
  const innerRadius = 42;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate segments
  let currentAngle = -90;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const r = activeIndex === i ? outerRadius + 6 : outerRadius;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + r * Math.cos(startRad);
    const y1 = center + r * Math.sin(startRad);
    const x2 = center + r * Math.cos(endRad);
    const y2 = center + r * Math.sin(endRad);
    const ix1 = center + innerRadius * Math.cos(endRad);
    const iy1 = center + innerRadius * Math.sin(endRad);
    const ix2 = center + innerRadius * Math.cos(startRad);
    const iy2 = center + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    
    return { ...d, path, index: i };
  });
  
  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0">
        <svg width={size} height={size} className="overflow-visible">
          {segments.map((seg) => (
            <path
              key={seg.index}
              d={seg.path}
              fill={seg.color}
              opacity={activeIndex === null || activeIndex === seg.index ? 1 : 0.35}
              className="cursor-pointer transition-all duration-300"
              style={{ filter: activeIndex === seg.index ? 'brightness(1.2) drop-shadow(0 0 10px ' + seg.color + ')' : 'none' }}
              onMouseEnter={() => setActiveIndex(seg.index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
          <text x={center} y={center - 4} textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="20" fontWeight="bold">
            {activeIndex !== null ? `${data[activeIndex].value}%` : '100%'}
          </text>
          <text x={center} y={center + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
            {activeIndex !== null ? data[activeIndex].name : 'Total'}
          </text>
        </svg>
      </div>
      <div className="flex-1 space-y-2.5">
        {data.map((entry, i) => (
          <div 
            key={i} 
            className={cn('flex items-center gap-3 cursor-pointer p-2 rounded-lg -mx-2 transition-all duration-200', activeIndex === i && 'bg-surface-raised')}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div 
              className={cn('w-3 h-3 rounded-full transition-transform duration-200', activeIndex === i && 'scale-125')}
              style={{ backgroundColor: entry.color, boxShadow: activeIndex === i ? `0 0 8px ${entry.color}` : 'none' }} 
            />
            <span className={cn('text-sm flex-1 transition-colors', activeIndex === i ? 'text-text-primary font-medium' : 'text-text-secondary')}>{entry.name}</span>
            <span className={cn('text-sm font-semibold transition-colors', activeIndex === i ? 'text-text-primary' : 'text-text-tertiary')}>{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar Chart Component
function BarChart({ data, valueKey = 'deploys', nameKey = 'name' }: { data: Array<{ [key: string]: string | number; color?: string }>; valueKey?: string; nameKey?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => Number(d[valueKey])));
  
  return (
    <div className="space-y-4 pt-2">
      {data.map((item, i) => {
        const value = Number(item[valueKey]);
        const percentage = (value / maxValue) * 100;
        return (
          <div 
            key={i} 
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn('text-sm transition-colors', hoveredIndex === i ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                {String(item[nameKey])}
              </span>
              <span className={cn('text-sm font-semibold transition-all', hoveredIndex === i ? 'text-text-primary scale-105' : 'text-text-tertiary')}>
                {value}
              </span>
            </div>
            <div className="h-8 rounded-lg bg-surface-raised overflow-hidden relative">
              <div 
                className="h-full rounded-lg transition-all duration-300"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: item.color as string || '#8b5cf6',
                  filter: hoveredIndex === i ? 'brightness(1.2)' : 'none',
                  boxShadow: hoveredIndex === i ? `0 0 20px ${item.color || '#8b5cf6'}40` : 'none'
                }}
              />
              {hoveredIndex === i && (
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xs font-bold text-white drop-shadow-lg">{value}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Stacked Bar Chart for Teams
function StackedBarChart({ data }: { data: typeof teamVelocityData }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => d.total));
  
  return (
    <div className="space-y-4 pt-2">
      {data.map((item, i) => {
        const successPercentage = (item.success / maxValue) * 100;
        const failedPercentage = (item.failed / maxValue) * 100;
        return (
          <div 
            key={i} 
            className="group cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn('text-sm transition-colors', hoveredIndex === i ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                {item.fullName}
              </span>
              <span className={cn('text-sm font-semibold', hoveredIndex === i ? 'text-text-primary' : 'text-text-tertiary')}>
                {item.total} ({item.successRate}%)
              </span>
            </div>
            <div className="h-6 rounded-lg bg-surface-raised overflow-hidden flex">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${successPercentage}%`,
                  backgroundColor: '#22c55e',
                  filter: hoveredIndex === i ? 'brightness(1.2)' : 'none'
                }}
              />
              <div 
                className="h-full rounded-r-lg transition-all duration-300"
                style={{ 
                  width: `${failedPercentage}%`,
                  backgroundColor: '#ef4444',
                  filter: hoveredIndex === i ? 'brightness(1.2)' : 'none'
                }}
              />
            </div>
            {hoveredIndex === i && (
              <div className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-surface-overlay border border-accent/40 rounded-lg px-3 py-2 shadow-xl animate-fade-in">
                <p className="font-semibold text-text-primary text-sm mb-1">{item.fullName}</p>
                <p className="text-xs text-success">Success: {item.success}</p>
                <p className="text-xs text-error">Failed: {item.failed}</p>
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-xs text-text-tertiary">Successful</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error" />
          <span className="text-xs text-text-tertiary">Failed</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ANALYTICS COMPONENT
// ============================================================================

interface MetricTile {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

const activeIncidents = getActiveIncidents();

const metrics: MetricTile[] = [
  { label: 'Total Deployments', value: platformMetrics.deployments.total.toString(), change: platformMetrics.deployments.trend, changeLabel: 'vs last month', icon: <Rocket className="w-5 h-5" />, color: 'bg-accent/20 text-accent' },
  { label: 'Deployment Success Rate', value: `${platformMetrics.deployments.successRate}%`, change: 2.3, changeLabel: 'vs last month', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-success/20 text-success' },
  { label: 'Mean Time to Recovery', value: `${platformMetrics.incidents.mttr}m`, change: platformMetrics.incidents.trend, changeLabel: 'vs last month', icon: <Clock className="w-5 h-5" />, color: 'bg-info/20 text-info' },
  { label: 'Active Incidents', value: activeIncidents.length.toString(), change: -50, changeLabel: 'vs last week', icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-warning/20 text-warning' },
];

const teamMetricsData = mockTeamMetrics.map(t => ({
  team: t.teamName,
  deployments: t.deployments,
  successRate: t.successRate,
  mttr: t.mttr,
  incidents: t.incidents,
}));

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
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-text-tertiary mt-1">Platform metrics and insights</p>
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
          <Card key={metric.label} className="p-4 hover:border-accent/30 transition-all duration-300 cursor-default group">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110', metric.color)}>
                {metric.icon}
              </div>
              <div className={cn('flex items-center gap-1 text-sm font-medium', metric.change > 0 ? 'text-success' : 'text-error')}>
                {metric.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{metric.value}</p>
            <p className="text-sm text-text-tertiary">{metric.label}</p>
            <p className="text-xs text-text-disabled mt-1">{metric.changeLabel}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deployment Trends */}
            <Card padding="lg" className="hover:border-accent/20 transition-colors">
              <CardHeader 
                title="Deployment Trends" 
                description="Weekly deployment volume (last 12 weeks)"
                action={<TrendingUp className="w-5 h-5 text-accent" />}
              />
              <div className="mt-4">
                <AreaChart data={deploymentTrendData} />
              </div>
            </Card>

            {/* Service Distribution */}
            <Card padding="lg" className="hover:border-accent/20 transition-colors">
              <CardHeader 
                title="Service Distribution" 
                description="Applications by type"
                action={<Activity className="w-5 h-5 text-accent" />}
              />
              <div className="mt-6">
                <DonutChart data={serviceDistributionData} />
              </div>
            </Card>

            {/* Top Services */}
            <Card padding="lg" className="hover:border-accent/20 transition-colors">
              <CardHeader title="Top Deployed Services" description="Most active services this month" />
              <div className="mt-4 space-y-3">
                {applications.slice(0, 5).map((app, i) => {
                  const deployCount = [38, 35, 32, 29, 24][i] || 20;
                  return (
                    <div key={app.id} className="group cursor-pointer">
                      <div className="flex items-center gap-4 mb-1.5">
                        <span className="text-sm font-semibold text-text-disabled w-6">{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-medium text-text-primary group-hover:text-accent transition-colors">{app.displayName}</p>
                          <p className="text-sm text-text-tertiary">{app.team.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-text-primary">{deployCount}</p>
                          <p className="text-xs text-text-tertiary">deploys</p>
                        </div>
                      </div>
                      <div className="ml-10 h-2 bg-surface-raised rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full transition-all duration-500 group-hover:brightness-125"
                          style={{ width: `${(deployCount / 40) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Incident Summary */}
            <Card padding="lg" className="hover:border-accent/20 transition-colors">
              <CardHeader title="Incident Summary" description="This month's incident breakdown" />
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="p-4 rounded-xl bg-surface-raised text-center group hover:bg-surface-raised/80 transition-colors cursor-default">
                    <p className="text-3xl font-bold text-text-primary group-hover:scale-110 transition-transform inline-block">{incidents.length}</p>
                    <p className="text-sm text-text-tertiary">Total Incidents</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-raised text-center group hover:bg-surface-raised/80 transition-colors cursor-default">
                    <p className="text-3xl font-bold text-success group-hover:scale-110 transition-transform inline-block">
                      {incidents.filter((inc) => inc.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-text-tertiary">Resolved</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = incidents.filter((inc) => inc.severity === severity).length;
                    const total = incidents.length || 1;
                    const colors: Record<string, string> = {
                      critical: 'from-red-600 to-red-400',
                      high: 'from-orange-600 to-orange-400',
                      medium: 'from-yellow-600 to-yellow-400',
                      low: 'from-blue-600 to-blue-400'
                    };
                    return (
                      <div key={severity} className="group cursor-default">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-text-tertiary capitalize font-medium">{severity}</span>
                          <span className="text-sm font-bold text-text-primary">{count}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-surface-raised overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500 bg-gradient-to-r group-hover:brightness-125', colors[severity])}
                            style={{ width: `${(count / total) * 100}%` }}
                          />
                        </div>
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
              {[
                { value: platformMetrics.deployments.total, label: 'Total', color: 'text-accent' },
                { value: platformMetrics.deployments.successful, label: 'Successful', color: 'text-success' },
                { value: platformMetrics.deployments.failed, label: 'Failed', color: 'text-error' },
              ].map((stat) => (
                <Card key={stat.label} className="p-5 text-center hover:border-accent/30 transition-all duration-300 cursor-default group">
                  <p className={cn('text-4xl font-bold group-hover:scale-105 transition-transform inline-block', stat.color)}>
                    {stat.value}
                  </p>
                  <p className="text-text-tertiary mt-1">{stat.label}</p>
                </Card>
              ))}
            </div>

            <Card padding="lg" className="hover:border-accent/20 transition-colors">
              <CardHeader title="Deployments by Environment" description="Distribution across environments this month" />
              <div className="mt-4">
                <BarChart data={environmentData} />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Deployment Frequency" description="Activity heatmap (last 4 weeks)" />
              <div className="mt-4 grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={i}
                      className={cn(
                        'h-10 rounded-lg transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-accent/50 cursor-pointer',
                        intensity > 0.7 ? 'bg-accent' : intensity > 0.4 ? 'bg-accent/60' : intensity > 0.2 ? 'bg-accent/30' : 'bg-surface-raised'
                      )}
                      title={`${Math.floor(intensity * 20)} deployments`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-text-tertiary">
                <span>4 weeks ago</span>
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {['bg-surface-raised', 'bg-accent/30', 'bg-accent/60', 'bg-accent'].map((c, i) => (
                      <div key={i} className={cn('w-3 h-3 rounded', c)} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
                <span>Today</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reliability' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Uptime (30d)', value: `${platformMetrics.reliability.uptime}%`, color: 'text-success' },
                { label: 'MTTR', value: `${platformMetrics.incidents.mttr}m`, color: 'text-text-primary' },
                { label: 'MTBF', value: `${platformMetrics.reliability.mtbf}d`, color: 'text-text-primary' },
                { label: 'Error Budget', value: `${platformMetrics.reliability.errorBudget}%`, color: 'text-warning' },
              ].map((stat) => (
                <Card key={stat.label} className="p-4 hover:border-accent/30 transition-all duration-300 cursor-default group">
                  <p className="text-sm text-text-tertiary">{stat.label}</p>
                  <p className={cn('text-3xl font-bold group-hover:scale-105 transition-transform inline-block', stat.color)}>
                    {stat.value}
                  </p>
                </Card>
              ))}
            </div>

            <Card padding="lg">
              <CardHeader title="SLO Performance" description="Service Level Objectives compliance" />
              <div className="mt-4 space-y-4">
                {[
                  { slo: 'Availability', target: '99.9%', current: '99.97%' },
                  { slo: 'Latency P99', target: '<200ms', current: `${platformMetrics.reliability.p99Latency}ms` },
                  { slo: 'Error Rate', target: '<0.5%', current: '0.23%' },
                  { slo: 'Throughput', target: '>10k rps', current: '15.4k rps' },
                ].map((item) => (
                  <div key={item.slo} className="p-4 rounded-xl bg-surface-raised hover:bg-surface-raised/80 transition-colors cursor-default group">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{item.slo}</p>
                        <p className="text-sm text-text-tertiary">Target: {item.target}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">{item.current}</p>
                        <Badge variant="success" size="sm">Met</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <Card padding="none" className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-raised">
                    {['Team', 'Deployments', 'Success Rate', 'MTTR', 'Incidents'].map((h) => (
                      <th key={h} className="text-left p-4 font-medium text-text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamMetricsData.map((team) => (
                    <tr key={team.team} className="border-b border-border-subtle last:border-0 hover:bg-surface-raised/50 transition-colors cursor-pointer">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-accent" />
                          </div>
                          <span className="font-medium text-text-primary">{team.team}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-text-primary">{team.deployments}</td>
                      <td className="p-4">
                        <Badge variant={team.successRate > 95 ? 'success' : 'warning'}>{team.successRate}%</Badge>
                      </td>
                      <td className="p-4 text-text-primary">{team.mttr}</td>
                      <td className="p-4">
                        <Badge variant={team.incidents === 0 ? 'success' : team.incidents < 3 ? 'warning' : 'danger'}>{team.incidents}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card padding="lg" className="hover:border-accent/20 transition-colors">
                <CardHeader title="Team Velocity" description="Deployments per team (success vs failed)" />
                <div className="mt-4">
                  <StackedBarChart data={teamVelocityData} />
                </div>
              </Card>

              <Card padding="lg" className="hover:border-accent/20 transition-colors">
                <CardHeader title="Lead Time Distribution" description="Time from commit to production" />
                <div className="mt-4">
                  <BarChart data={leadTimeData} valueKey="value" nameKey="bucket" />
                </div>
                <div className="text-center mt-3">
                  <span className="text-xs text-text-tertiary">
                    Avg: {doraMetrics.leadTime.value} {doraMetrics.leadTime.unit} • P90: 4.2 hours
                  </span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
