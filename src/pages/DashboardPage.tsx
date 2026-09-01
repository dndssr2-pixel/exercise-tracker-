import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Plus, Calendar, Flame, Trophy, Activity, Dumbbell, ArrowRight } from 'lucide-react';
import { storage } from '@/lib/storage';
import { DashboardStats } from '@/types';
import { formatMonthDay } from '@/lib/utils';
import { StatCard } from '@/components/StatCard';
import { WorkoutCard } from '@/components/WorkoutCard';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(() => storage.getDashboardStats());

  useEffect(() => {
    const updateStats = () => {
      setStats(storage.getDashboardStats());
    };
    const unsubscribe = storage.subscribe(updateStats);
    return () => unsubscribe();
  }, []);

  return (
    <div className="animate-rise-in">
      {/* Header */}
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Today / {formatMonthDay()}
          </p>
          <h1
            className="mt-3 font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl font-bold"
            data-testid="heading-dashboard"
          >
            Make every set count<span className="text-primary">.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Your training log is a record of what you chose to do today. Keep it simple, keep it moving.
          </p>
        </div>

        <Link
          href="/workouts/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-ink-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-ink-lg active:translate-y-0 sm:self-auto select-none"
          data-testid="link-quick-start"
        >
          <Plus size={18} /> Start a workout
        </Link>
      </header>

      {/* 4 Stat Cards */}
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Workouts logged"
          value={stats.workoutCount}
          icon={Trophy}
          accent="orange"
        />
        <StatCard
          label="This week"
          value={stats.weekCount}
          suffix="sessions"
          icon={Flame}
          accent="teal"
        />
        <StatCard
          label="Total sets"
          value={stats.totalSets}
          icon={Activity}
          accent="yellow"
        />
        <StatCard
          label="Total reps"
          value={stats.totalReps}
          icon={Dumbbell}
          accent="orange"
        />
      </div>

      {/* Main Grid: History (Left) & Editorial Note (Right) */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* Left Column: Recent Workouts */}
        <section className="rounded-2xl border border-card-border bg-card p-5 sm:p-7 ink-shadow text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Recent pages
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold">Your training history</h2>
            </div>
            <Link
              href="/workouts/new"
              className="hidden items-center gap-1 text-xs font-bold text-primary hover:underline sm:flex"
              data-testid="link-history-add"
            >
              New entry <Plus size={14} />
            </Link>
          </div>

          <div className="mt-6" data-testid="list-recent-workouts">
            {stats.recentWorkouts.length > 0 ? (
              <div className="divide-y divide-border/70">
                {stats.recentWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div
                className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-8 text-center"
                data-testid="state-empty-history"
              >
                <div className="absolute -right-5 -top-8 font-display text-[110px] leading-none text-primary/7 select-none font-bold">
                  0
                </div>
                <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-secondary">
                  <Dumbbell size={21} />
                </div>
                <h3 className="relative mt-4 font-display text-xl font-bold">Your first entry is waiting.</h3>
                <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  A few honest numbers today make tomorrow’s progress easier to see.
                </p>
                <Link
                  href="/workouts/new"
                  className="relative mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold text-secondary-foreground transition-transform hover:-translate-y-0.5"
                  data-testid="link-empty-log-workout"
                >
                  Log your first workout <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Editorial Card */}
        <section className="paper-grid relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary p-6 text-secondary-foreground sm:p-7 ink-shadow text-left">
          <div className="absolute -bottom-12 -right-5 font-display text-[170px] leading-none text-secondary-foreground/6 select-none font-bold">
            +
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary-foreground/70 font-bold">
                Keep an eye on
              </p>
              <Flame size={18} className="text-accent" />
            </div>
            <h2 className="mt-3 max-w-xs font-display text-3xl font-bold leading-tight">
              Build a log you trust.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-secondary-foreground/70">
              The details are the point. Track the weight, the reps, the way it felt.
            </p>
            <div className="mt-8 border-t border-secondary-foreground/15 pt-5">
              <p className="font-mono-ui text-3xl font-bold text-accent" data-testid="text-exercise-count">
                {stats.exerciseCount}
              </p>
              <p className="mt-1 text-xs font-semibold text-secondary-foreground/65">
                distinct movements in your log
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-secondary-foreground/15">
              <Link
                href="/exercises"
                className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline"
              >
                View all movements & Personal Records <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};