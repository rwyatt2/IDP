import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(d);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return num.toLocaleString('en-US', options);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
    case 'succeeded':
    case 'approved':
    case 'resolved':
      return 'text-success-600 bg-success-50';
    case 'degraded':
    case 'warning':
    case 'monitoring':
    case 'investigating':
      return 'text-warning-600 bg-warning-50';
    case 'critical':
    case 'failed':
    case 'rejected':
    case 'open':
      return 'text-danger-600 bg-danger-50';
    case 'in-progress':
    case 'pending':
    case 'awaiting-approval':
      return 'text-primary-600 bg-primary-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
}

export function getStatusDotColor(status: string): string {
  switch (status) {
    case 'healthy':
    case 'succeeded':
    case 'approved':
    case 'resolved':
      return 'bg-success-500';
    case 'degraded':
    case 'warning':
    case 'monitoring':
    case 'investigating':
      return 'bg-warning-500';
    case 'critical':
    case 'failed':
    case 'rejected':
    case 'open':
      return 'bg-danger-500';
    case 'in-progress':
    case 'pending':
    case 'awaiting-approval':
      return 'bg-primary-500';
    default:
      return 'bg-slate-400';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-danger-700 bg-danger-100 border-danger-200';
    case 'high':
    case 'error':
      return 'text-danger-600 bg-danger-50 border-danger-100';
    case 'medium':
    case 'warning':
      return 'text-warning-700 bg-warning-100 border-warning-200';
    case 'low':
    case 'info':
      return 'text-primary-700 bg-primary-100 border-primary-200';
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}
