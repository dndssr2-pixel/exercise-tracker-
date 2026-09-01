import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Calendar, PlusCircle, Dumbbell, Layers, Settings, Timer, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';
import { RestTimerDrawer } from './RestTimer';
import { PlateCalculatorModal } from './PlateCalculatorModal';

export const BottomNav: React.FC = () => {
  const [location] = useLocation();
  const [timerOpen, setTimerOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const tabs = [
    { href: '/', label: 'Today', icon: Calendar },
    { href: '/workouts/new', label: 'Log', icon: PlusCircle, isPrimary: true },
    { href: '/exercises', label: 'PRs', icon: Dumbbell },
    { href: '/templates', label: 'Routines', icon: Layers },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t border-border bg-card/95 backdrop-blur-lg md:hidden shadow-lg pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-16 items-center justify-around px-2">
          {tabs.map(({ href, label, icon: Icon, isPrimary }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => sound.playClick()}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold transition-all select-none',
                  isPrimary
                    ? 'text-primary font-bold'
                    : active
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isPrimary ? (
                  <span className="grid h-10 w-10 -mt-3 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-ink-sm active:scale-95 transition-transform">
                    <Icon size={20} strokeWidth={2.5} />
                  </span>
                ) : (
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-xl transition-colors',
                      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                  </span>
                )}
                <span className={cn('mt-0.5 tracking-tight', isPrimary && 'text-primary font-bold')}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Utilities Modals */}
      <RestTimerDrawer open={timerOpen} onClose={() => setTimerOpen(false)} />
      <PlateCalculatorModal open={calcOpen} onClose={() => setCalcOpen(false)} />
    </>
  );
};