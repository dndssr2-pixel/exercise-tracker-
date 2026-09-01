import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell } from 'lucide-react';
import { sound } from '@/lib/audio';
import { cn } from '@/lib/utils';

export const RestTimerDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [duration, setDuration] = useState(90); // seconds
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sound.playTimerBell();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  if (!open) return null;

  const setTimerPreset = (secs: number) => {
    sound.playClick();
    setDuration(secs);
    setTimeLeft(secs);
    setIsRunning(true);
  };

  const toggleRun = () => {
    sound.playClick();
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-rise-in">
      <div className="w-full max-w-sm rounded-3xl border border-card-border bg-card p-6 shadow-2xl ink-shadow text-center">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h3 className="font-display text-lg font-bold">Rest Timer</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Circular Clock Display */}
        <div className="my-8 flex flex-col items-center">
          <div className="relative grid h-44 w-44 place-items-center rounded-full border-4 border-muted">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-primary transition-all duration-300"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="font-mono-ui text-4xl font-bold tracking-tight text-foreground">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono-ui text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {isRunning ? 'Resting...' : timeLeft === 0 ? 'Ready to lift!' : 'Paused'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={resetTimer}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-muted text-foreground hover:bg-border transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={toggleRun}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-ink-sm hover:-translate-y-0.5 transition-transform"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-2">
          {[30, 60, 90, 120].map((s) => (
            <button
              key={s}
              onClick={() => setTimerPreset(s)}
              className={cn(
                'rounded-xl py-2 font-mono-ui text-xs font-bold border transition-colors',
                duration === s
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground/80 hover:bg-muted'
              )}
            >
              {s < 60 ? `${s}s` : `${s / 60}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};