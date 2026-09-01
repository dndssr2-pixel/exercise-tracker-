import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  accent?: 'orange' | 'teal' | 'yellow';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  icon: Icon,
  accent = 'orange',
  className = '',
}) => {
  const accentThemes = {
    orange: 'bg-primary/10 text-primary',
    teal: 'bg-secondary/10 text-secondary',
    yellow: 'bg-accent/30 text-foreground',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-card-border bg-card p-5 ink-shadow transition-transform duration-200 hover:-translate-y-1',
        className
      )}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between">
        <div className={cn('grid h-9 w-9 place-items-center rounded-xl', accentThemes[accent])}>
          <Icon size={17} />
        </div>
        <span className="font-mono-ui text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          all time
        </span>
      </div>
      <p
        className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground"
        data-testid={`text-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix && <span className="ml-1 text-base font-normal text-muted-foreground">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
};