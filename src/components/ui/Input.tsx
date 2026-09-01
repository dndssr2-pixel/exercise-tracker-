import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  testId?: string;
  error?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
  max,
  step,
  disabled = false,
  className = '',
  testId,
  error,
  suffix,
  ...props
}) => {
  return (
    <label className="block text-left">
      {label && (
        <span className="mb-2 block text-xs font-bold text-foreground/75">
          {label}
          {required && <span className="ml-1 text-primary">*</span>}
        </span>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          data-testid={testId}
          className={cn(
            'h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/15',
            suffix && 'pr-10',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-destructive">{error}</span>}
    </label>
  );
};