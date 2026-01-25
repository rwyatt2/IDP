import { cn, formatRelativeTime } from '@/lib/utils';
import { useActivities } from '@/hooks';
import {
  Rocket,
  AlertTriangle,
  CheckCircle,
  Settings,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { Skeleton } from '@/components/ui';

const activityIcons = {
  deployment: <Rocket className="w-4 h-4" />,
  incident: <AlertTriangle className="w-4 h-4" />,
  approval: <CheckCircle className="w-4 h-4" />,
  'config-change': <Settings className="w-4 h-4" />,
  comment: <MessageSquare className="w-4 h-4" />,
  alert: <Bell className="w-4 h-4" />,
};

const activityColors = {
  deployment: 'bg-purple-100 text-purple-600',
  incident: 'bg-danger-100 text-danger-600',
  approval: 'bg-success-100 text-success-600',
  'config-change': 'bg-blue-100 text-blue-600',
  comment: 'bg-slate-100 text-slate-600',
  alert: 'bg-warning-100 text-warning-600',
};

export function RecentActivityWidget() {
  const { data: activities, isLoading } = useActivities(8);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              activityColors[activity.type as keyof typeof activityColors] ||
                'bg-slate-100 text-slate-600'
            )}
          >
            {activityIcons[activity.type as keyof typeof activityIcons] || (
              <Bell className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">{activity.title}</p>
            <p className="text-sm text-slate-500 truncate">{activity.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              {activity.user && <span>{activity.user}</span>}
              {activity.user && <span>·</span>}
              <span>{formatRelativeTime(activity.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
