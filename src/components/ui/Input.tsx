import { forwardRef } from 'react';
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
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    const sizes = {
      sm: 'input-sm',
      md: '',
      lg: 'input-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
              className
            )}
            {...props}
          />
          {(rightIcon || (onClear && props.value)) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {onClear && props.value ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-slate-500">{hint}</p>}
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
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
