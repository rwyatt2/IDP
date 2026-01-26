import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'danger' | 'info' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot,
  children,
  className,
}: BadgeProps) {
  // Map 'danger' to 'error' and 'neutral' to 'default' for backwards compat
  const normalizedVariant = variant === 'danger' ? 'error' : variant === 'neutral' ? 'default' : variant;

  const variants = {
    default: 'badge',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    error: 'badge badge-error',
    info: 'badge badge-info',
    accent: 'badge badge-accent',
  };

  const dotColors = {
    default: 'status-dot-neutral',
    success: 'status-dot-success',
    warning: 'status-dot-warning',
    error: 'status-dot-error',
    info: 'status-dot-info',
    accent: 'bg-accent',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: '',
  };

  return (
    <span 
      className={cn(variants[normalizedVariant], sizes[size], className)}
      role="status"
    >
      {dot && (
        <span 
          className={cn('status-dot', dotColors[normalizedVariant])} 
          aria-hidden="true"
        />
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
        return 'error';
      case 'in-progress':
      case 'pending':
      case 'awaiting-approval':
      case 'deploying':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatStatus = (s: string) => {
    return s
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedStatus = formatStatus(status);

  return (
    <Badge 
      variant={getVariant()} 
      dot 
      className={className}
    >
      {formattedStatus}
    </Badge>
  );
}
