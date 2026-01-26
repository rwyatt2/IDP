import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useEscapeKey } from '@/hooks';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showClose = true,
  className,
  footer,
}: DrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[600px]',
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <div
        ref={contentRef}
        className={cn(
          'absolute right-0 top-0 h-full flex flex-col',
          'bg-surface-overlay border-l border-border-default shadow-2xl',
          'animate-slide-in-right',
          sizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between p-5 border-b border-border-subtle bg-surface-raised flex-shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              {title && (
                <h2 id="drawer-title" className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-text-tertiary">{description}</p>
              )}
            </div>
            {showClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary hover:bg-surface flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-surface">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 p-5 border-t border-border-subtle bg-surface-raised">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
