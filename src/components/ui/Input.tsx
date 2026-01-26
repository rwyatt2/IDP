import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onClear,
      inputSize = 'md',
      id,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    
    const sizes = {
      sm: 'input-sm',
      md: '',
      lg: 'input-lg',
    };

    // Build aria-describedby
    const describedBy = [
      ariaDescribedBy,
      error ? errorId : null,
      hint && !error ? hintId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className={cn('label', required && 'label-required')}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              sizes[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || onClear) && 'pr-10',
              error && 'input-error',
              className
            )}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            {...props}
          />
          {(rightIcon || (onClear && props.value)) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {onClear && props.value ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-colors focus-visible-ring"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <span className="text-zinc-500" aria-hidden="true">{rightIcon}</span>
              )}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="error-text" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="hint-text">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="w-4 h-4" />}
        placeholder="Search..."
        aria-label="Search"
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
