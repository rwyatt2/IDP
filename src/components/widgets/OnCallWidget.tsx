import { formatDate } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { Phone, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export function OnCallWidget() {
  const { user } = useUserStore();
  const onCall = user?.onCallStatus;

  if (!onCall?.isOnCall) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-success-500" />
        </div>
        <p className="font-medium text-slate-900">Not On-Call</p>
        <p className="text-sm text-slate-500 mt-1">You're not currently on-call</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-50 border border-warning-200">
        <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
          <Phone className="w-5 h-5 text-warning-600" />
        </div>
        <div>
          <p className="font-medium text-warning-800">Currently On-Call</p>
          <p className="text-sm text-warning-700">{onCall.schedule}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Ends</span>
          <span className="font-medium text-slate-900">
            {onCall.endsAt ? formatDate(onCall.endsAt, { weekday: 'short', hour: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Escalation</span>
          <span className="font-medium text-slate-900">
            {onCall.escalationPolicy || 'Default'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-2">
        <button className="flex-1 btn-secondary btn-sm">
          <Calendar className="w-4 h-4" />
          Schedule
        </button>
        <button className="flex-1 btn-secondary btn-sm">
          <AlertCircle className="w-4 h-4" />
          Escalate
        </button>
      </div>
    </div>
  );
}
