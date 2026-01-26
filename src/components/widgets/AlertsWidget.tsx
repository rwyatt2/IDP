import { cn, formatRelativeTime } from '@/lib/utils';
import { alerts } from '@/data/mock-data';
import { useInteractionStore } from '@/stores';
import { useToast } from '@/components/ui';
import { AlertTriangle, AlertCircle, Info, Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui';

const severityConfig = {
  critical: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-error-text', bg: 'bg-error-subtle' },
  error: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-error-text', bg: 'bg-error-subtle' },
  warning: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-warning-text', bg: 'bg-warning-subtle' },
  info: { icon: <Info className="w-4 h-4" />, color: 'text-info-text', bg: 'bg-info-subtle' },
};

export function AlertsWidget() {
  const { acknowledgeAlert, isAlertAcknowledged, logAction } = useInteractionStore();
  const toast = useToast();

  // Filter to show unacknowledged alerts first
  const sortedAlerts = [...alerts].sort((a, b) => {
    const aAcked = a.acknowledged || isAlertAcknowledged(a.id);
    const bAcked = b.acknowledged || isAlertAcknowledged(b.id);
    if (aAcked && !bAcked) return 1;
    if (!aAcked && bAcked) return -1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleAcknowledge = (alertId: string, title: string) => {
    acknowledgeAlert(alertId);
    logAction('Acknowledged alert', title);
    toast.success('Alert Acknowledged', `"${title}" has been acknowledged`);
  };

  const activeCount = alerts.filter((a) => !a.acknowledged && !isAlertAcknowledged(a.id)).length;

  if (alerts.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-3">
          <Bell className="w-6 h-6 text-success-text" />
        </div>
        <p className="font-medium text-text-primary">No Active Alerts</p>
        <p className="text-sm text-text-tertiary mt-1">All systems operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeCount > 0 && (
        <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
          {activeCount} Active Alert{activeCount !== 1 ? 's' : ''}
        </div>
      )}
      {sortedAlerts.slice(0, 4).map((alert) => {
        const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.info;
        const isAcked = alert.acknowledged || isAlertAcknowledged(alert.id);
        
        return (
          <div
            key={alert.id}
            className={cn(
              'p-3 rounded-lg border transition-all',
              isAcked
                ? 'border-border-subtle bg-surface-raised opacity-60'
                : 'border-border-subtle'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('p-1.5 rounded-lg', config.bg, config.color)}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn(
                      'font-medium text-sm',
                      isAcked ? 'text-text-tertiary' : 'text-text-primary'
                    )}>
                      {alert.title}
                    </p>
                    <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
                      {alert.message}
                    </p>
                  </div>
                  {!isAcked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id, alert.title)}
                      className="text-text-tertiary hover:text-text-secondary flex-shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-text-disabled">
                    {alert.source}
                  </span>
                  <span className="text-xs text-text-disabled">•</span>
                  <span className="text-xs text-text-disabled">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                  {isAcked && (
                    <>
                      <span className="text-xs text-text-disabled">•</span>
                      <span className="text-xs text-success">Acknowledged</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
