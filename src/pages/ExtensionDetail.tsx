import { useParams, Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { extensions } from '@/data/mock-data';
import { useExtensionStore } from '@/stores';
import { Card, CardHeader, Badge, Button, Tabs, TabPanel } from '@/components/ui';
import {
  ArrowLeft,
  Star,
  Download,
  ExternalLink,
  Shield,
  GitBranch,
  FileText,
  MessageSquare,
  Heart,
  Rocket,
  Activity,
  DollarSign,
  Zap,
  Database,
  Server,
  Users,
  Flag,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Activity,
  DollarSign,
  Zap,
  Database,
  Server,
  Users,
  Flag,
  Shield,
  GitBranch,
  FileText,
};

function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Database;
}

// Mock window header component
function MockWindowHeader() {
  return (
    <div className="h-7 bg-surface-raised border-b border-border-subtle flex items-center px-3 gap-2 flex-shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <div className="flex-1 mx-6 h-4 bg-surface rounded-md" />
    </div>
  );
}

// Realistic chart data based on platform mock data
const deploymentTrend = [32, 38, 35, 42, 39, 45, 41, 48, 44, 52, 47, 55]; // Last 12 weeks
const successRateTrend = [94.2, 95.1, 94.8, 96.2, 95.5, 96.8, 95.9, 97.1, 96.4, 97.3, 96.2, 96.4];
const costTrend = [68500, 71200, 69800, 73100, 72650, 75400, 74200, 76800, 75900, 78200, 77100, 78950];
const latencyTrend = [142, 138, 145, 135, 148, 132, 140, 128, 156, 125, 152, 156];
const incidentTrend = [4, 3, 5, 2, 4, 3, 2, 4, 1, 3, 2, 2];

// Contextual mock screenshots based on extension category
function MockScreenshots({ category, name }: { category: string; name: string }) {
  // Deployment category - Release Management, etc.
  if (category === 'deployment') {
    return (
      <>
        {/* Deployment Frequency Chart */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-text-tertiary">Deployment Frequency</div>
                <div className="text-[8px] text-success">↑ 12%</div>
              </div>
              <div className="text-lg font-bold text-text-primary">247</div>
              <div className="text-[8px] text-text-tertiary mb-2">Total this month</div>
              <div className="flex-1 flex items-end gap-0.5 pt-2">
                {deploymentTrend.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t ${i === deploymentTrend.length - 1 ? 'bg-accent' : 'bg-accent/40'}`} 
                      style={{ height: `${(v / 60) * 100}%` }} 
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[6px] text-text-disabled mt-1 px-0.5">
                <span>W1</span><span>W4</span><span>W8</span><span>W12</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Success Rate Trend */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-text-tertiary">Success Rate</div>
                <div className="text-[8px] text-success">96.4%</div>
              </div>
              <div className="flex gap-3 mb-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-success">238</div>
                  <div className="text-[7px] text-text-tertiary">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-error">9</div>
                  <div className="text-[7px] text-text-tertiary">Failed</div>
                </div>
              </div>
              <div className="flex-1 relative">
                {/* Area chart */}
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M0,${40 - (successRateTrend[0] - 90) * 4} ${successRateTrend.map((v, i) => `L${(i / 11) * 100},${40 - (v - 90) * 4}`).join(' ')} L100,40 L0,40 Z`}
                    fill="url(#successGradient)"
                  />
                  <path 
                    d={`M0,${40 - (successRateTrend[0] - 90) * 4} ${successRateTrend.map((v, i) => `L${(i / 11) * 100},${40 - (v - 90) * 4}`).join(' ')}`}
                    fill="none" stroke="rgb(34, 197, 94)" strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Distribution */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Deployments by Environment</div>
              <div className="space-y-2">
                {[
                  { env: 'Production', count: 89, pct: 36, color: 'accent' },
                  { env: 'Staging', count: 112, pct: 45, color: 'success' },
                  { env: 'Development', count: 46, pct: 19, color: 'warning' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[8px] mb-0.5">
                      <span className="text-text-primary">{item.env}</span>
                      <span className="text-text-secondary">{item.count} deploys</span>
                    </div>
                    <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                      <div className={`h-full bg-${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-border-subtle">
                <div className="text-[8px] text-text-tertiary">Avg Duration</div>
                <div className="text-sm font-semibold text-text-primary">12 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* DORA Metrics */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">DORA Metrics</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Deploy Freq', value: '3.2/day', status: 'elite', trend: '+15%' },
                  { label: 'Lead Time', value: '2.4 hrs', status: 'elite', trend: '-8%' },
                  { label: 'MTTR', value: '45 min', status: 'elite', trend: '-12%' },
                  { label: 'Change Fail', value: '5.5%', status: 'elite', trend: '-2%' },
                ].map((m, i) => (
                  <div key={i} className="bg-surface-raised rounded p-2 border border-border-subtle">
                    <div className="text-[7px] text-text-tertiary">{m.label}</div>
                    <div className="text-[11px] font-semibold text-text-primary">{m.value}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[7px] px-1 py-0.5 bg-success/20 text-success rounded">Elite</span>
                      <span className="text-[7px] text-success">{m.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Monitoring category
  if (category === 'monitoring') {
    return (
      <>
        {/* Latency Trend Chart */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-text-tertiary">P99 Latency</div>
                <div className="text-[8px] text-text-secondary">Last 12 weeks</div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-lg font-bold text-text-primary">156ms</div>
                <div className="text-[8px] text-success">SLO: &lt;200ms ✓</div>
              </div>
              <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* SLO threshold line */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="rgb(239, 68, 68)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
                  <path 
                    d={`M0,${40 - (latencyTrend[0] / 200) * 40} ${latencyTrend.map((v, i) => `L${(i / 11) * 100},${40 - (v / 200) * 40}`).join(' ')} L100,40 L0,40 Z`}
                    fill="url(#latencyGradient)"
                  />
                  <path 
                    d={`M0,${40 - (latencyTrend[0] / 200) * 40} ${latencyTrend.map((v, i) => `L${(i / 11) * 100},${40 - (v / 200) * 40}`).join(' ')}`}
                    fill="none" stroke="rgb(139, 92, 246)" strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute top-0 right-0 text-[6px] text-error/60">200ms SLO</div>
              </div>
            </div>
          </div>
        </div>

        {/* SLO Dashboard */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">SLO Status</div>
              <div className="space-y-1.5">
                {[
                  { name: 'API Availability', target: '99.9%', current: '99.97%', budget: 78 },
                  { name: 'Error Rate', target: '<0.5%', current: '0.23%', budget: 92 },
                  { name: 'Auth Latency', target: '<100ms', current: '45ms', budget: 95 },
                  { name: 'Notification Delivery', target: '99%', current: '97.8%', budget: 12 },
                ].map((slo, i) => (
                  <div key={i} className="bg-surface-raised rounded p-1.5 border border-border-subtle">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] text-text-primary">{slo.name}</span>
                      <span className={`text-[7px] ${slo.budget > 30 ? 'text-success' : slo.budget > 10 ? 'text-warning' : 'text-error'}`}>
                        {slo.current}
                      </span>
                    </div>
                    <div className="h-1 bg-canvas rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${slo.budget > 30 ? 'bg-success' : slo.budget > 10 ? 'bg-warning' : 'bg-error'}`}
                        style={{ width: `${slo.budget}%` }}
                      />
                    </div>
                    <div className="text-[6px] text-text-disabled mt-0.5">{slo.budget}% error budget</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Incident Trend */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-text-tertiary">Incidents</div>
                <div className="text-[8px] text-success">↓ 15%</div>
              </div>
              <div className="flex gap-3 mb-2">
                <div>
                  <div className="text-sm font-bold text-text-primary">18</div>
                  <div className="text-[7px] text-text-tertiary">This month</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-success">32m</div>
                  <div className="text-[7px] text-text-tertiary">Avg MTTR</div>
                </div>
              </div>
              <div className="flex-1 flex items-end gap-1">
                {incidentTrend.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${v >= 4 ? 'bg-error/60' : v >= 3 ? 'bg-warning/60' : 'bg-success/60'}`}
                      style={{ height: `${(v / 6) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[6px] text-text-disabled mt-1">
                <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Uptime & Reliability */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Platform Reliability</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-surface-raised rounded p-2 border border-border-subtle text-center">
                  <div className="text-lg font-bold text-success">99.95%</div>
                  <div className="text-[7px] text-text-tertiary">Uptime</div>
                </div>
                <div className="bg-surface-raised rounded p-2 border border-border-subtle text-center">
                  <div className="text-lg font-bold text-accent">67%</div>
                  <div className="text-[7px] text-text-tertiary">Error Budget</div>
                </div>
              </div>
              <div className="text-[8px] text-text-tertiary mb-1">Uptime Last 90 Days</div>
              <div className="flex gap-px">
                {Array.from({ length: 90 }, (_, i) => {
                  const isDown = [12, 34, 67].includes(i);
                  const isDegraded = [23, 45, 78].includes(i);
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 h-3 rounded-sm ${isDown ? 'bg-error' : isDegraded ? 'bg-warning' : 'bg-success/60'}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[6px] text-text-disabled mt-1">
                <span>90 days ago</span><span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Cost category
  if (category === 'cost') {
    return (
      <>
        {/* Cost Trend Chart */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-text-tertiary">Monthly Spend Trend</div>
                <div className="text-[8px] text-error">↑ 8.7%</div>
              </div>
              <div className="text-lg font-bold text-text-primary">$78,950</div>
              <div className="text-[8px] text-text-tertiary mb-2">Current month</div>
              <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Budget line */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgb(239, 68, 68)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
                  <path 
                    d={`M0,${40 - ((costTrend[0] - 60000) / 30000) * 40} ${costTrend.map((v, i) => `L${(i / 11) * 100},${40 - ((v - 60000) / 30000) * 40}`).join(' ')} L100,40 L0,40 Z`}
                    fill="url(#costGradient)"
                  />
                  <path 
                    d={`M0,${40 - ((costTrend[0] - 60000) / 30000) * 40} ${costTrend.map((v, i) => `L${(i / 11) * 100},${40 - ((v - 60000) / 30000) * 40}`).join(' ')}`}
                    fill="none" stroke="rgb(234, 179, 8)" strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute top-0 right-0 text-[6px] text-error/60">$90k Budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost by Team */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Cost by Team</div>
              <div className="space-y-2">
                {[
                  { name: 'Data Platform', cost: '$39,500', pct: 50, color: 'accent' },
                  { name: 'Platform Engineering', cost: '$22,250', pct: 28, color: 'success' },
                  { name: 'Payments', cost: '$12,300', pct: 16, color: 'warning' },
                  { name: 'User Experience', cost: '$4,900', pct: 6, color: 'error' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[8px] mb-0.5">
                      <span className="text-text-primary">{item.name}</span>
                      <span className="text-text-secondary">{item.cost}</span>
                    </div>
                    <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
                      <div className={`h-full bg-${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Utilization Gauge */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col items-center justify-center">
              <div className="text-[10px] text-text-tertiary mb-2">Budget Utilization</div>
              <div className="relative w-20 h-10 overflow-hidden">
                <div className="absolute w-20 h-20 rounded-full border-8 border-surface-raised" />
                <div 
                  className="absolute w-20 h-20 rounded-full border-8 border-transparent border-t-success border-r-warning border-b-transparent"
                  style={{ transform: 'rotate(-45deg)' }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-text-primary origin-bottom" 
                  style={{ transform: 'rotate(50deg)' }} 
                />
              </div>
              <div className="text-xl font-bold text-warning mt-2">87.7%</div>
              <div className="text-[8px] text-text-tertiary">$78,950 of $90,000</div>
              <div className="mt-2 flex gap-3 text-[7px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-text-tertiary">&lt;70%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-text-tertiary">70-90%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-error" />
                  <span className="text-text-tertiary">&gt;90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast vs Actual */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Forecast vs Budget</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-surface-raised rounded p-1.5 border border-border-subtle text-center">
                  <div className="text-[7px] text-text-tertiary">Budget</div>
                  <div className="text-[10px] font-semibold text-text-primary">$90,000</div>
                </div>
                <div className="bg-surface-raised rounded p-1.5 border border-border-subtle text-center">
                  <div className="text-[7px] text-text-tertiary">Forecast</div>
                  <div className="text-[10px] font-semibold text-warning">$85,200</div>
                </div>
                <div className="bg-surface-raised rounded p-1.5 border border-border-subtle text-center">
                  <div className="text-[7px] text-text-tertiary">Variance</div>
                  <div className="text-[10px] font-semibold text-success">-$4,800</div>
                </div>
              </div>
              <div className="text-[8px] text-text-tertiary mb-1">Monthly Projection</div>
              <div className="flex-1 flex items-end gap-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                  const actual = [68.5, 71.2, 69.8, 73.1, 72.6, 78.9][i];
                  const forecast = [70, 72, 71, 74, 73, 85][i];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex gap-0.5">
                        <div className="flex-1 bg-accent/60 rounded-t" style={{ height: `${(actual / 90) * 50}px` }} />
                        <div className="flex-1 bg-warning/40 rounded-t border border-dashed border-warning/60" style={{ height: `${(forecast / 90) * 50}px` }} />
                      </div>
                      <span className="text-[6px] text-text-disabled mt-1">{month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 justify-center mt-2 text-[7px]">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-accent/60 rounded" /><span className="text-text-tertiary">Actual</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-warning/40 border border-dashed border-warning/60 rounded" /><span className="text-text-tertiary">Forecast</span></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Catalog category
  if (category === 'catalog') {
    return (
      <>
        {/* Service Catalog */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Service Catalog</div>
              <div className="space-y-1.5">
                {[
                  { name: 'api-gateway', team: 'Platform', type: 'service', tier: 'T1' },
                  { name: 'user-service', team: 'Identity', type: 'service', tier: 'T1' },
                  { name: 'analytics-ui', team: 'Data', type: 'frontend', tier: 'T2' },
                  { name: 'payment-api', team: 'Payments', type: 'service', tier: 'T1' },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-surface-raised rounded border border-border-subtle">
                    <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-[8px] text-accent">
                      {svc.type === 'service' ? '⚙' : '🖥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[8px] text-text-primary truncate">{svc.name}</div>
                      <div className="text-[7px] text-text-tertiary">{svc.team} • {svc.type}</div>
                    </div>
                    <div className="text-[7px] px-1.5 py-0.5 bg-accent/20 text-accent rounded">{svc.tier}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dependency Graph */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4 flex flex-col">
              <div className="text-[10px] text-text-tertiary mb-2">Dependencies</div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-lg bg-accent/30 border-2 border-accent flex items-center justify-center text-[8px] text-accent font-medium z-10">
                  API
                </div>
                {/* Connection lines */}
                <div className="absolute w-8 h-0.5 bg-border-default left-[calc(50%-40px)] top-1/2" />
                <div className="absolute w-8 h-0.5 bg-border-default right-[calc(50%-40px)] top-1/2" />
                <div className="absolute w-0.5 h-8 bg-border-default top-[calc(50%-40px)] left-1/2" />
                <div className="absolute w-0.5 h-8 bg-border-default bottom-[calc(50%-40px)] left-1/2" />
                {/* Connected nodes */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-success/20 border border-success/40 flex items-center justify-center text-[6px] text-success">DB</div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-warning/20 border border-warning/40 flex items-center justify-center text-[6px] text-warning">Cache</div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-[6px] text-accent">Auth</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-error/20 border border-error/40 flex items-center justify-center text-[6px] text-error">Queue</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">API Endpoints</div>
              <div className="space-y-1.5">
                {[
                  { method: 'GET', path: '/api/users', desc: 'List users' },
                  { method: 'POST', path: '/api/users', desc: 'Create user' },
                  { method: 'GET', path: '/api/users/:id', desc: 'Get user' },
                  { method: 'DELETE', path: '/api/users/:id', desc: 'Delete user' },
                ].map((api, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-surface-raised rounded border border-border-subtle">
                    <div className={`text-[7px] px-1.5 py-0.5 rounded font-mono ${
                      api.method === 'GET' ? 'bg-success/20 text-success' :
                      api.method === 'POST' ? 'bg-accent/20 text-accent' :
                      api.method === 'DELETE' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                    }`}>{api.method}</div>
                    <span className="text-[8px] text-text-primary font-mono flex-1">{api.path}</span>
                    <span className="text-[7px] text-text-tertiary">{api.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Ownership */}
        <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <MockWindowHeader />
            <div className="flex-1 p-4">
              <div className="text-[10px] text-text-tertiary mb-2">Ownership</div>
              <div className="bg-surface-raised rounded border border-border-subtle p-2 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-[10px]">👤</div>
                  <div>
                    <div className="text-[9px] text-text-primary">Platform Team</div>
                    <div className="text-[7px] text-text-tertiary">5 services • 3 members</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-surface border border-border-subtle" />
                  ))}
                </div>
              </div>
              <div className="text-[8px] text-text-tertiary">On-call: @sarah.chen</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default/generic screenshots for other categories
  return (
    <>
      {/* Generic Dashboard */}
      <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
        <div className="h-full flex flex-col">
          <MockWindowHeader />
          <div className="flex-1 p-4">
            <div className="text-[10px] text-text-tertiary mb-2">{name} Dashboard</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: 'Active', value: '24', color: 'success' },
                { label: 'Pending', value: '8', color: 'warning' },
                { label: 'Issues', value: '2', color: 'error' },
              ].map((m, i) => (
                <div key={i} className="bg-surface-raised rounded p-2 border border-border-subtle text-center">
                  <div className={`text-sm font-bold text-${m.color}`}>{m.value}</div>
                  <div className="text-[7px] text-text-tertiary">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="flex-1 bg-surface-raised rounded border border-border-subtle" />
          </div>
        </div>
      </div>

      {/* Generic List View */}
      <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
        <div className="h-full flex flex-col">
          <MockWindowHeader />
          <div className="flex-1 p-4">
            <div className="text-[10px] text-text-tertiary mb-2">Recent Activity</div>
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 bg-surface-raised rounded border border-border-subtle">
                  <div className="w-6 h-6 rounded bg-accent/20" />
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-text-primary/20 rounded mb-1" />
                    <div className="h-1.5 w-28 bg-text-tertiary/10 rounded" />
                  </div>
                  <div className="text-[7px] text-text-tertiary">{i}h ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generic Settings */}
      <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
        <div className="h-full flex flex-col">
          <MockWindowHeader />
          <div className="flex-1 p-4">
            <div className="text-[10px] text-text-tertiary mb-2">Configuration</div>
            <div className="space-y-2">
              {['Enable notifications', 'Auto-sync data', 'Dark mode'].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-surface-raised rounded border border-border-subtle">
                  <span className="text-[8px] text-text-primary">{label}</span>
                  <div className={`w-8 h-4 rounded-full ${i < 2 ? 'bg-accent' : 'bg-surface'} flex items-center ${i < 2 ? 'justify-end' : 'justify-start'} px-0.5`}>
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generic Analytics */}
      <div className="aspect-video bg-canvas border border-border-subtle rounded-lg overflow-hidden">
        <div className="h-full flex flex-col">
          <MockWindowHeader />
          <div className="flex-1 p-4 flex flex-col">
            <div className="text-[10px] text-text-tertiary mb-2">Analytics</div>
            <div className="flex-1 flex items-end gap-1">
              {[45, 60, 35, 80, 55, 70, 50, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-accent/60 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="h-px bg-border-subtle mt-1" />
          </div>
        </div>
      </div>
    </>
  );
}

export function ExtensionDetail() {
  const { id } = useParams();
  const extension = extensions.find((e) => e.id === id);
  const { installedIds, installExtension, uninstallExtension, favoriteIds, toggleFavorite } = useExtensionStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!extension) {
    return (
      <div className="text-center py-12">
        <p className="text-text-tertiary">Extension not found</p>
        <Link to="/extensions" className="text-accent hover:text-accent/80 mt-2 inline-block">
          Back to Extensions
        </Link>
      </div>
    );
  }

  const isInstalled = installedIds.includes(extension.id);
  const isFavorite = favoriteIds.includes(extension.id);
  const IconComponent = getIconComponent(extension.icon);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'permissions', label: 'Permissions' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/extensions"
        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Extensions
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-8 h-8 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">{extension.name}</h1>
              <Badge variant="neutral">v{extension.version}</Badge>
              {extension.featured && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-text-secondary mb-3">{extension.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-tertiary">
              <span>By {extension.author}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{extension.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{extension.downloads.toLocaleString()} downloads</span>
              </div>
              <span>Category: {extension.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(extension.id)}
            className={isFavorite ? 'text-error' : 'text-text-tertiary'}
          >
            <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
          </Button>
          {isInstalled ? (
            <Button
              variant="secondary"
              onClick={() => uninstallExtension(extension.id)}
            >
              Uninstall
            </Button>
          ) : (
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => installExtension(extension.id)}
            >
              Install
            </Button>
          )}
          {isInstalled && (
            <Button variant="primary" leftIcon={<ExternalLink className="w-4 h-4" />}>
              Open
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <TabPanel>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h3 className="font-semibold text-text-primary mb-4">About</h3>
                  <div className="prose prose-invert max-w-none text-text-secondary">
                    <p>
                      {extension.name} is a powerful extension that enhances your developer experience 
                      by providing seamless integration with your existing workflows.
                    </p>
                    <h4 className="text-text-primary mt-4 mb-2">Key Features</h4>
                    <ul className="space-y-1 list-disc list-inside marker:text-text-tertiary">
                      <li>Seamless integration with the developer platform</li>
                      <li>Real-time updates and notifications</li>
                      <li>Customizable dashboards and views</li>
                      <li>Role-based access controls</li>
                      <li>Comprehensive API and webhook support</li>
                    </ul>
                    <h4 className="text-text-primary mt-4 mb-2">Getting Started</h4>
                    <p>
                      Install the extension and navigate to your dashboard to see the new widgets 
                      and features available. Configure your preferences in the extension settings.
                    </p>
                  </div>
                </Card>

                {/* Screenshots */}
                <Card padding="lg">
                  <h3 className="font-semibold text-text-primary mb-4">Screenshots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MockScreenshots category={extension.category} name={extension.name} />
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'documentation' && (
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-4">Documentation</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Getting Started', description: 'Learn how to set up and configure the extension' },
                    { title: 'Configuration Guide', description: 'Detailed configuration options and settings' },
                    { title: 'API Reference', description: 'Complete API documentation for advanced usage' },
                    { title: 'Troubleshooting', description: 'Common issues and how to resolve them' },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised hover:bg-surface hover:border-border-default transition-colors cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-text-tertiary" />
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{doc.title}</p>
                        <p className="text-sm text-text-tertiary">{doc.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-text-tertiary" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'changelog' && (
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-4">Changelog</h3>
                <div className="space-y-6">
                  {[
                    { version: extension.version, date: '2026-01-20', changes: ['Fixed dashboard rendering issue', 'Improved performance for large datasets', 'Added new configuration options'] },
                    { version: '2.4.1', date: '2026-01-10', changes: ['Bug fixes and stability improvements', 'Updated dependencies'] },
                    { version: '2.4.0', date: '2025-12-15', changes: ['New widget types', 'Enhanced filtering capabilities', 'Dark mode support'] },
                  ].map((release) => (
                    <div key={release.version}>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="info">v{release.version}</Badge>
                        <span className="text-sm text-text-tertiary">{release.date}</span>
                      </div>
                      <ul className="space-y-1 text-text-secondary text-sm">
                        {release.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-text-disabled">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'permissions' && (
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-4">Required Permissions</h3>
                <div className="space-y-3">
                  {[
                    { permission: 'Read Applications', description: 'Access to view application metadata', risk: 'low' },
                    { permission: 'Read Deployments', description: 'Access to view deployment history', risk: 'low' },
                    { permission: 'Read Metrics', description: 'Access to view performance metrics', risk: 'low' },
                    { permission: 'Read User Profile', description: 'Access to your basic profile information', risk: 'low' },
                  ].map((perm) => (
                    <div
                      key={perm.permission}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised"
                    >
                      <Shield className={cn(
                        'w-5 h-5 mt-0.5',
                        perm.risk === 'low' && 'text-success',
                        perm.risk === 'medium' && 'text-warning',
                        perm.risk === 'high' && 'text-error'
                      )} />
                      <div>
                        <p className="font-medium text-text-primary">{perm.permission}</p>
                        <p className="text-sm text-text-tertiary">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Extension Info */}
          <Card padding="lg">
            <CardHeader title="Extension Info" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Version</span>
                <span className="text-sm font-medium text-text-primary">{extension.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Author</span>
                <span className="text-sm font-medium text-text-primary">{extension.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Category</span>
                <Badge variant="neutral">{extension.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Last Updated</span>
                <span className="text-sm font-medium text-text-primary">
                  {formatRelativeTime(extension.lastUpdated)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= Math.round(extension.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-text-disabled'
                      )}
                    />
                  ))}
                  <span className="text-sm text-text-tertiary ml-1">({extension.rating})</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Support */}
          <Card padding="lg">
            <CardHeader title="Support" />
            <div className="mt-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                Documentation
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Report Issue
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<GitBranch className="w-4 h-4" />}>
                View Source
              </Button>
            </div>
          </Card>

          {/* Related Extensions */}
          <Card padding="lg">
            <CardHeader title="Related Extensions" />
            <div className="mt-4 space-y-3">
              {extensions
                .filter((e) => e.id !== extension.id && e.category === extension.category)
                .slice(0, 3)
                .map((ext) => {
                  const ExtIcon = getIconComponent(ext.icon);
                  return (
                    <Link
                      key={ext.id}
                      to={`/extensions/${ext.id}`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <ExtIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">{ext.name}</p>
                        <p className="text-sm text-text-tertiary">
                          <Star className="w-3 h-3 inline text-amber-400 fill-amber-400" /> {ext.rating}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
