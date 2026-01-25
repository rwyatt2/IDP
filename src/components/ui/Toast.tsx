import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { create } from 'zustand';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast store
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 4000);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

// Hook for easy toast usage
export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore();

  return {
    toast: addToast,
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
    dismiss: removeToast,
    clearAll: clearToasts,
  };
}

// Toast icons
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

// Toast colors (dark mode aesthetic)
const toastStyles: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: 'bg-success-bg/90',
    border: 'border-success-border',
    icon: 'text-emerald-400',
    text: 'text-emerald-300',
  },
  error: {
    bg: 'bg-danger-bg/90',
    border: 'border-danger-border',
    icon: 'text-red-400',
    text: 'text-red-300',
  },
  warning: {
    bg: 'bg-warning-bg/90',
    border: 'border-warning-border',
    icon: 'text-amber-400',
    text: 'text-amber-300',
  },
  info: {
    bg: 'bg-info-bg/90',
    border: 'border-info-border',
    icon: 'text-blue-400',
    text: 'text-blue-300',
  },
};

// Single toast component
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[toast.type];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 150);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border backdrop-blur-md transition-all duration-150',
        style.bg,
        style.border,
        isExiting ? 'opacity-0 translate-x-2 scale-95' : 'opacity-100 translate-x-0 scale-100'
      )}
    >
      <span className={cn('mt-0.5', style.icon)}>{toastIcons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium text-sm', style.text)}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-zinc-400 mt-0.5">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn('text-xs font-medium underline mt-1.5 hover:no-underline', style.text)}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="p-0.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Toast container component
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
