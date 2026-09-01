import React from 'react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quiet' | 'outline' | 'danger' | 'accent' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  testId?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  testId,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-primary text-primary-foreground shadow-ink-sm hover:-translate-y-0.5 hover:shadow-ink-md active:translate-y-0 active:shadow-none border border-transparent',
    quiet:
      'bg-muted text-foreground hover:bg-accent/40 active:bg-accent/50 border border-transparent',
    outline:
      'border border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10',
    danger:
      'border border-destructive/20 bg-destructive/8 text-destructive hover:bg-destructive/15 active:bg-destructive/20',
    accent:
      'bg-accent text-accent-foreground shadow-ink-dark hover:-translate-y-0.5 active:translate-y-0 border border-transparent',
    secondary:
      'bg-secondary text-secondary-foreground hover:opacity-90 active:scale-[0.99] border border-transparent',
  };

  const sizeStyles = {
    sm: 'min-h-8 px-3 text-xs font-semibold rounded-lg',
    md: 'min-h-10 px-4 text-sm font-bold rounded-xl',
    lg: 'min-h-12 px-6 text-base font-bold rounded-xl',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testId}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};