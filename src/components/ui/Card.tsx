import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', as: Component = 'div', children, ...props }, ref) => {
    const variants = {
      default: 'card',
      hover: 'card card-hover',
      interactive: 'card card-interactive',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <Component
        ref={ref as any}
        className={cn(variants[variant], paddings[padding], className)}
        tabIndex={variant === 'interactive' ? 0 : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4';
}

export function CardHeader({
  title,
  description,
  action,
  titleAs: TitleTag = 'h3',
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div>
        <TitleTag className="text-lg font-semibold text-text-primary tracking-tight">
          {title}
        </TitleTag>
        {description && (
          <p className="mt-1 text-sm text-text-tertiary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('mt-4', className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-6 pt-4 border-t border-border-subtle flex items-center justify-between gap-4',
        className
      )}
      {...props}
    />
  );
}
