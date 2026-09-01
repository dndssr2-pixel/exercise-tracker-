import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Workout } from '@/types';
import { formatShortDate, formatFullDate } from '@/lib/utils';

export const WorkoutCard: React.FC<{ workout: Workout }> = ({ workout }) => {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="group flex items-center gap-4 py-4 transition-colors first:pt-1 last:pb-1 hover:bg-primary/[0.03] px-2 rounded-xl"
      data-testid={`link-workout-${workout.id}`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted font-mono-ui text-xs font-bold text-secondary">
        {formatShortDate(workout.workoutDate)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {workout.name}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {workout.setCount} sets <span className="mx-1 text-border font-light">/</span> {workout.totalReps} reps
          {workout.totalVolumeKg ? (
            <>
              <span className="mx-1 text-border font-light">/</span> {workout.totalVolumeKg.toLocaleString()} kg
            </>
          ) : null}
        </span>
      </span>

      <span className="hidden text-right sm:block">
        <span className="block font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
          logged
        </span>
        <span className="mt-1 block text-xs text-foreground/70">
          {formatFullDate(workout.workoutDate).split(',')[0]}
        </span>
      </span>

      <ChevronRight
        size={17}
        className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
      />
    </Link>
  );
};