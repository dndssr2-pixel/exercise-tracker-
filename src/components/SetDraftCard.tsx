import React from 'react';
import { X } from 'lucide-react';
import { SetDraft } from '@/types';
import { Input } from '@/components/ui/Input';
import { EXERCISE_LIBRARY } from '@/lib/seedData';

interface SetDraftCardProps {
  draft: SetDraft;
  index: number;
  onChange: (field: keyof SetDraft, val: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const SetDraftCard: React.FC<SetDraftCardProps> = ({
  draft,
  index,
  onChange,
  onRemove,
  canRemove,
}) => {
  return (
    <div
      className="group relative rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:p-5 ink-shadow"
      data-testid={`card-set-${index}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
          Set {String(index + 1).padStart(2, '0')}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center rounded-xl bg-destructive/10 text-destructive active:scale-95 transition-transform"
            data-testid={`button-remove-set-${index}`}
            aria-label={`Remove set ${index + 1}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.6fr_.6fr_.8fr]">
        <div>
          <label className="block text-left">
            <span className="mb-2 block text-xs font-bold text-foreground/75">
              Exercise <span className="text-primary">*</span>
            </span>
            <input
              list="exercise-suggestions"
              value={draft.exerciseName}
              onChange={(e) => onChange('exerciseName', e.target.value)}
              placeholder="e.g. Barbell Squat"
              required
              data-testid={`input-exercise-${index}`}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:contents">
          <Input
            label="Reps"
            value={draft.reps}
            onChange={(e) => onChange('reps', e.target.value)}
            placeholder="8"
            type="number"
            inputMode="numeric"
            min="1"
            required
            testId={`input-reps-${index}`}
          />

          <Input
            label="Weight (kg)"
            value={draft.weightKg}
            onChange={(e) => onChange('weightKg', e.target.value)}
            placeholder="Optional"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            testId={`input-weight-${index}`}
          />
        </div>
      </div>

      <div className="mt-3">
        <Input
          label="Set note"
          value={draft.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="How did it feel? (e.g. RPE 8, smooth bar speed)"
          testId={`input-set-note-${index}`}
        />
      </div>

      <datalist id="exercise-suggestions">
        {EXERCISE_LIBRARY.map((ex) => (
          <option key={ex.id} value={ex.name} />
        ))}
      </datalist>
    </div>
  );
};