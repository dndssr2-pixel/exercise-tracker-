import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Calendar,
  PlusCircle,
  Dumbbell,
  Layers,
  ChevronRight,
  Timer,
  Calculator,
  Settings,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';
import { RestTimerDrawer } from './RestTimer';
import { PlateCalculatorModal } from './PlateCalculatorModal';

export const Logo: React.FC = () => {
  return (
    <Link href="/" className="group flex items-center gap-3" data-testid="link-logo">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-ink-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        <Dumbbell size={19} strokeWidth={2.4} />
      </span>
      <span className="text-left">
        <span className="block font-display text-lg leading-none tracking-tight font-bold">Lift Log</span>
        <span className="mt-1 block font-mono-ui text-[9px] uppercase tracking-[0.22em] text-sidebar-foreground/55 font-medium">
          private training journal
        </span>
      </span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const [timerOpen, setTimerOpen] = useState(false);
  const [plateCalcOpen, setPlateCalcOpen] = useState(false);

  const mainNav = [
    { href: '/', label: 'Today', icon: Calendar },
    { href: '/workouts/new', label: 'Log workout', icon: PlusCircle },
    { href: '/exercises', label: 'Exercises & PRs', icon: Dumbbell },
    { href: '/templates', label: 'Routines', icon: Layers },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-[100dvh] w-[248px] shrink-0 flex-col bg-sidebar px-6 py-7 text-sidebar-foreground md:flex">
        <Logo />

        <div className="mt-12 text-left">
          <p className="mb-3 px-3 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/45 font-medium">
            Your training
          </p>
          <nav className="space-y-1" aria-label="Main navigation">
            {mainNav.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? location === '/' : location.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                    active
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
                  )}
                  data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-lg transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-sidebar-foreground/8 text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                    )}
                  >
                    <Icon size={15} strokeWidth={2.3} />
                  </span>
                  {label}
                  {active && <ChevronRight className="ml-auto opacity-70" size={14} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools */}
        <div className="mt-8 text-left">
          <p className="mb-3 px-3 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/45 font-medium">
            Gym Utilities
          </p>
          <div className="space-y-1">
            <button
              onClick={() => {
                sound.playClick();
                setTimerOpen(true);
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-sidebar-foreground/8 text-accent">
                <Timer size={13} />
              </span>
              Rest Timer
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setPlateCalcOpen(true);
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-sidebar-foreground/8 text-secondary">
                <Calculator size={13} />
              </span>
              Plate Calculator
            </button>
          </div>
        </div>

        {/* Daily Note Quote Card */}
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50 font-medium">
              Daily note
            </span>
            <Flame size={15} className="text-accent" />
          </div>
          <p className="font-display text-sm leading-relaxed text-sidebar-foreground/85 italic">
            "Small, honest progress adds up."
          </p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-sidebar-foreground/10">
            <div className="h-full w-[78%] rounded-full bg-accent transition-all duration-500" />
          </div>
          <p className="mt-2 font-mono-ui text-[10px] text-sidebar-foreground/45">show up / keep count</p>
        </div>
      </aside>

      {/* Mobile Sleek Top Navigation */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setTimerOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/70 px-3 py-1.5 text-xs font-bold text-foreground active:bg-border transition-colors cursor-pointer"
            aria-label="Open rest timer"
          >
            <Timer size={15} className="text-primary" />
            <span>Timer</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setPlateCalcOpen(true);
            }}
            className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-muted/70 text-foreground active:bg-border transition-colors cursor-pointer"
            aria-label="Open plate calculator"
          >
            <Calculator size={15} className="text-secondary" />
          </button>
        </div>
      </div>

      {/* Modals / Drawers */}
      <RestTimerDrawer open={timerOpen} onClose={() => setTimerOpen(false)} />
      <PlateCalculatorModal open={plateCalcOpen} onClose={() => setPlateCalcOpen(false)} />
    </>
  );
};