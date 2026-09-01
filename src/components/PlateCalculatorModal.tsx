import React, { useState } from 'react';
import { Calculator, X, Disc } from 'lucide-react';
import { calculatePlates } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

export const PlateCalculatorModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [targetWeight, setTargetWeight] = useState('100');
  const [barWeight, setBarWeight] = useState('20');

  if (!open) return null;

  const total = Number(targetWeight) || 0;
  const bar = Number(barWeight) || 20;
  const { perSideWeight, plates, remaining } = calculatePlates(total, bar);

  const plateColors: Record<number, string> = {
    25: 'bg-red-500 text-white border-red-600',
    20: 'bg-blue-600 text-white border-blue-700',
    15: 'bg-yellow-500 text-black border-yellow-600',
    10: 'bg-green-600 text-white border-green-700',
    5: 'bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-neutral-700 dark:text-white',
    2.5: 'bg-neutral-800 text-white border-neutral-900',
    1.25: 'bg-neutral-400 text-black border-neutral-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-rise-in">
      <div className="w-full max-w-md rounded-3xl border border-card-border bg-card p-6 shadow-2xl ink-shadow">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-secondary" />
            <h3 className="font-display text-lg font-bold">Barbell Plate Calculator</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-5 grid grid-cols-2 gap-3">
          <Input
            label="Target Weight (kg)"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            type="number"
            min="20"
            step="2.5"
            suffix="kg"
          />
          <Input
            label="Bar Weight (kg)"
            value={barWeight}
            onChange={(e) => setBarWeight(e.target.value)}
            type="number"
            min="10"
            suffix="kg"
          />
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-card-border bg-background p-4 mb-5 text-left">
          <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
            <span className="font-mono-ui text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Load Per Side:
            </span>
            <span className="font-display text-2xl font-bold text-foreground">
              {perSideWeight > 0 ? `${perSideWeight} kg` : '0 kg'}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {plates.length > 0 ? (
              plates.map(({ plate, count }) => (
                <div key={plate} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center font-mono-ui text-xs font-bold px-2 py-0.5 rounded-md border ${plateColors[plate] || 'bg-muted'}`}
                    >
                      {plate} kg
                    </span>
                    <span className="text-xs text-muted-foreground">plate</span>
                  </div>
                  <span className="font-mono-ui text-sm font-bold text-foreground">
                    × {count} <span className="text-xs text-muted-foreground font-normal">per side</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {total < bar ? 'Weight is lighter than the bar itself.' : 'No plates needed (empty bar).'}
              </p>
            )}

            {remaining > 0 && (
              <p className="mt-2 text-xs font-semibold text-primary">
                Remaining unobtainable with standard plates: {remaining} kg
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-11 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </div>
  );
};