import { useMemo } from 'react';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { useCostData, useTotalCosts } from '@/hooks';
import { Card, Badge, ProgressBar, Skeleton } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { CostData } from '@/types';

function CostCard({ cost }: { cost: CostData }) {
  const isOverBudget = cost.budget && cost.currentMonth > cost.budget;
  const trend = cost.trend;

  return (
    <Card variant="hover" className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-text-primary">{cost.applicationName}</h3>
          <p className="text-sm text-text-tertiary">{cost.team}</p>
        </div>
        {isOverBudget && (
          <Badge variant="danger" size="sm">
            <AlertTriangle className="w-3 h-3" />
            Over Budget
          </Badge>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold text-text-primary">
            {formatCurrency(cost.currentMonth)}
          </p>
          <div
            className={cn(
              'flex items-center gap-0.5 text-sm',
              trend > 0 ? 'text-success' : 'text-error'
            )}
          >
            {trend > 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{formatPercentage(Math.abs(trend))}</span>
          </div>
        </div>
        <p className="text-sm text-text-tertiary">
          vs {formatCurrency(cost.previousMonth)} last month
        </p>
      </div>

      {cost.budget && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-tertiary">Budget Utilization</span>
            <span className={cn(
              'font-medium',
              cost.budgetUtilization! > 90 ? 'text-error' : 'text-text-primary'
            )}>
              {formatPercentage(cost.budgetUtilization!)}
            </span>
          </div>
          <ProgressBar
            value={cost.budgetUtilization!}
            variant={
              cost.budgetUtilization! > 90
                ? 'danger'
                : cost.budgetUtilization! > 70
                ? 'warning'
                : 'primary'
            }
          />
          <p className="text-xs text-text-disabled">
            {formatCurrency(cost.budget)} budget
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border-subtle">
        <p className="text-xs text-text-tertiary mb-2">Cost Breakdown</p>
        <div className="grid grid-cols-5 gap-1">
          <div
            className="h-2 rounded bg-blue-500"
            style={{ flex: cost.breakdown.compute / cost.currentMonth }}
            title={`Compute: ${formatCurrency(cost.breakdown.compute)}`}
          />
          <div
            className="h-2 rounded bg-purple-500"
            style={{ flex: cost.breakdown.storage / cost.currentMonth }}
            title={`Storage: ${formatCurrency(cost.breakdown.storage)}`}
          />
          <div
            className="h-2 rounded bg-green-500"
            style={{ flex: cost.breakdown.network / cost.currentMonth }}
            title={`Network: ${formatCurrency(cost.breakdown.network)}`}
          />
          <div
            className="h-2 rounded bg-orange-500"
            style={{ flex: cost.breakdown.database / cost.currentMonth }}
            title={`Database: ${formatCurrency(cost.breakdown.database)}`}
          />
          <div
            className="h-2 rounded bg-slate-400"
            style={{ flex: cost.breakdown.other / cost.currentMonth }}
            title={`Other: ${formatCurrency(cost.breakdown.other)}`}
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-blue-500" />
            Compute
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-purple-500" />
            Storage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-green-500" />
            Network
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-orange-500" />
            Database
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Costs() {
  const { data: costData, isLoading } = useCostData();
  const { data: totalCosts, isLoading: loadingTotal } = useTotalCosts();

  const totalBudget = useMemo(() => {
    if (!costData) return 0;
    return costData.reduce((sum, c) => sum + (c.budget || 0), 0);
  }, [costData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Cost Management</h1>
        <p className="text-text-tertiary mt-1">
          Track and optimize cloud spending across your organization
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Current Month</p>
              {loadingTotal ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-xl font-bold text-text-primary">
                  {formatCurrency(totalCosts?.currentMonth || 0)}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Forecasted</p>
              {loadingTotal ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-xl font-bold text-text-primary">
                  {formatCurrency(totalCosts?.forecast || 0)}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              totalCosts?.trend! > 0 ? 'bg-success/20' : 'bg-error/20'
            )}>
              {totalCosts?.trend! > 0 ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-error" />
              )}
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Trend</p>
              {loadingTotal ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className={cn(
                  'text-xl font-bold',
                  totalCosts?.trend! > 0 ? 'text-success' : 'text-error'
                )}>
                  {totalCosts?.trend! > 0 ? '+' : ''}
                  {formatPercentage(totalCosts?.trend || 0)}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
              <PieChart className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Total Budget</p>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-xl font-bold text-text-primary">
                  {formatCurrency(totalBudget)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Cost by Application */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Cost by Application</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : costData && costData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {costData.map((cost) => (
              <CostCard key={cost.applicationId} cost={cost} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <DollarSign className="w-12 h-12 text-text-disabled mx-auto mb-4" />
            <p className="text-text-tertiary">No cost data available</p>
          </Card>
        )}
      </div>
    </div>
  );
}
