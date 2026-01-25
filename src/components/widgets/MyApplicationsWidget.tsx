import { Link } from 'react-router-dom';
import { useMyApplications } from '@/hooks';
import { useUserStore } from '@/stores';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { StatusBadge, Skeleton } from '@/components/ui';

export function MyApplicationsWidget() {
  const { user } = useUserStore();
  const { data: applications, isLoading } = useMyApplications(user?.id || '');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">No applications owned</p>
        <Link
          to="/build/create"
          className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
        >
          Create your first application
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.slice(0, 5).map((app) => (
        <Link
          key={app.id}
          to={`/discover/catalog/${app.id}`}
          className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{app.displayName}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-slate-500">{app.team.name}</p>
          </div>
          <StatusBadge status={app.status} />
        </Link>
      ))}
      {applications.length > 5 && (
        <Link
          to="/discover/catalog?filter=owned"
          className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 pt-2"
        >
          View all {applications.length} applications
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
