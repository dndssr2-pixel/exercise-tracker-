import React from 'react';
import { Link, useLocation } from 'wouter';
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROUTINE_TEMPLATES } from '@/lib/seedData';
import { Button } from '@/components/ui/Button';

export const TemplatesPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="animate-rise-in text-left">
      <header>
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          Pre-built Programs
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Workout Routines<span className="text-primary">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Jump straight into structured training sessions with pre-populated compound movements and volume targets.
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {ROUTINE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-3xl border border-card-border bg-card p-6 sm:p-7 ink-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono-ui text-xs font-bold text-primary">
                  {tmpl.tag}
                </span>
                <Sparkles size={16} className="text-accent" />
              </div>

              <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
                {tmpl.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {tmpl.description}
              </p>

              <div className="mt-6 space-y-2 border-t border-border/60 pt-4">
                <p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Included Exercises ({tmpl.exercises.length})
                </p>
                {tmpl.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-foreground/85">{ex.name}</span>
                    <span className="font-mono-ui text-muted-foreground">
                      {ex.defaultSets} sets × {ex.targetReps} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Link
                href="/workouts/new"
                className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Launch this Routine <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};