import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { EXERCISE_LIBRARY } from '@/lib/seedData';
import { sound } from '@/lib/audio';

interface QuickAddSetFormProps {
  workoutId: number;
  defaultExerciseName?: string;
  onSetAdded?: () => void;
}

export const QuickAddSetForm: React.FC<QuickAddSetFormProps> = ({
  workoutId,
  defaultExerciseName = '',
  onSetAdded,
}) => {
  const { showToast } = useToast();
  const [exerciseName, setExerciseName] = useState(defaultExerciseName);
  const [reps, setReps] = useState('8');
  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) {
      setError('Please choose or enter an exercise name.');
      return;
    }
    if (Number(reps) < 1) {
      setError('Reps must be at least 1.');
      return;
    }
    setError('');

    storage.addSet(workoutId, {
      exerciseName: exerciseName.trim(),
      reps: Number(reps),
      weightKg: weightKg === '' ? null : Number(weightKg),
      notes: notes.trim(),
    });

    sound.playClick();
    showToast(`Added set of ${exerciseName.trim()}`, 'success');
    setNotes('');
    if (onSetAdded) onSetAdded();
  };

  return (
    <section className="h-fit rounded-2xl border border-secondary/20 bg-secondary p-5 text-secondary-foreground sm:p-7 ink-shadow">
      <div className="flex items-center justify-between">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary-foreground/60 font-semibold">
          Add to this page
        </p>
        <Sparkles size={17} className="text-accent" />
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold">One more set?</h2>
      <p className="mt-2 text-sm leading-6 text-secondary-foreground/65">
        Keep the rhythm going. Add a set while it’s fresh in your muscles.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3" data-testid="form-add-set">
        <label className="block text-left">
          <span className="mb-2 block text-xs font-bold text-secondary-foreground/75">
            Exercise
          </span>
          <input
            list="quick-exercise-options"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="e.g. Barbell Squat"
            required
            className="h-11 w-full rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-3 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/45 focus:border-accent"
            data-testid="input-add-exercise"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-left">
            <span className="mb-2 block text-xs font-bold text-secondary-foreground/75">
              Reps
            </span>
            <input
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="8"
              required
              className="h-11 w-full rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-3 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/45 focus:border-accent"
              data-testid="input-add-reps"
            />
          </label>

          <label className="block text-left">
            <span className="mb-2 block text-xs font-bold text-secondary-foreground/75">
              Weight (kg)
            </span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="Optional"
              className="h-11 w-full rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-3 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/45 focus:border-accent"
              data-testid="input-add-weight"
            />
          </label>
        </div>

        <label className="block text-left">
          <span className="mb-2 block text-xs font-bold text-secondary-foreground/75">
            Note
          </span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional feel or RPE"
            className="h-11 w-full rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-3 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/45 focus:border-accent"
            data-testid="input-add-note"
          />
        </label>

        {error && <p className="text-xs font-semibold text-accent">{error}</p>}

        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-ink-dark transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          data-testid="button-submit-set"
        >
          <Plus size={16} /> Add set
        </button>
      </form>

      <datalist id="quick-exercise-options">
        {EXERCISE_LIBRARY.map((ex) => (
          <option key={ex.id} value={ex.name} />
        ))}
      </datalist>
    </section>
  );
};