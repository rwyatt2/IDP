import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useEscapeKey, useClickOutside } from '@/hooks';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showClose = true,
  className,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen);
  useClickOutside(contentRef, onClose, isOpen);

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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
  };

  return createPortal(
    <div className="modal-overlay animate-fade-in">
      <div
        ref={contentRef}
        className={cn(
          'bg-surface-overlay border border-border-default rounded-xl shadow-2xl w-full animate-scale-in',
          sizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between p-5 border-b border-border-subtle bg-surface-raised">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
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
                className="text-text-tertiary hover:text-text-primary hover:bg-surface"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
        <div className="p-5 bg-surface">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-secondary">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
