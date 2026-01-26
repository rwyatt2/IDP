import { Link } from 'react-router-dom';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { useTotalCosts } from '@/hooks';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Skeleton, ProgressBar } from '@/components/ui';

export function CostTrendsWidget() {
  const { data: costs, isLoading } = useTotalCosts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!costs) return null;

  const isIncreasing = costs.trend > 0;

  return (
    <div className="space-y-4">
      {/* Current Month */}
      <div>
        <p className="text-sm text-text-tertiary">Current Month</p>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-text-primary">
            {formatCurrency(costs.currentMonth)}
          </p>
          <div
            className={cn(
              'flex items-center gap-1 mb-1',
              isIncreasing ? 'text-success' : 'text-error'
            )}
          >
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(Math.abs(costs.trend))}
            </span>
          </div>
        </div>
        <p className="text-sm text-text-tertiary mt-1">
          vs {formatCurrency(costs.previousMonth)} last month
        </p>
      </div>

      {/* Forecast */}
      <div className="p-3 rounded-lg bg-surface-raised">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Forecasted</span>
          <span className="text-sm font-medium text-text-primary">
            {formatCurrency(costs.forecast)}
          </span>
        </div>
        <ProgressBar
          value={costs.currentMonth}
          max={costs.forecast}
          variant="primary"
          size="sm"
        />
        <p className="text-xs text-text-tertiary mt-1 text-right">
          {formatPercentage((costs.currentMonth / costs.forecast) * 100)} of forecast
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 rounded-lg border border-border-subtle">
          <p className="text-xs text-text-tertiary">Avg Daily</p>
          <p className="font-semibold text-text-primary">
            {formatCurrency(costs.currentMonth / 25)}
          </p>
        </div>
        <div className="p-2 rounded-lg border border-border-subtle">
          <p className="text-xs text-text-tertiary">Projected</p>
          <p className="font-semibold text-text-primary">
            {formatCurrency(costs.forecast)}
          </p>
        </div>
      </div>

      {/* Link to Costs */}
      <Link
        to="/manage/costs"
        className="flex items-center justify-center gap-1 text-sm text-accent hover:text-accent-hover pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
      >
        View cost details
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
