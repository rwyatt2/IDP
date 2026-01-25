import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot,
  children,
  className,
}: BadgeProps) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral',
    accent: 'badge-accent',
  };

  const dotColors = {
    success: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    warning: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
    danger: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]',
    info: 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]',
    neutral: 'bg-zinc-500',
    accent: 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: '',
  };

  return (
    <span className={cn(variants[variant], sizes[size], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (): BadgeProps['variant'] => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'succeeded':
      case 'approved':
      case 'resolved':
      case 'active':
        return 'success';
      case 'degraded':
      case 'warning':
      case 'monitoring':
      case 'investigating':
      case 'identified':
        return 'warning';
      case 'critical':
      case 'failed':
      case 'rejected':
      case 'open':
      case 'error':
        return 'danger';
      case 'in-progress':
      case 'pending':
      case 'awaiting-approval':
      case 'deploying':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatStatus = (s: string) => {
    return s
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Badge variant={getVariant()} dot className={className}>
      {formatStatus(status)}
    </Badge>
  );
}
