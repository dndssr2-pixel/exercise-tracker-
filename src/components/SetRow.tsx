import React, { useState } from 'react';
import { Edit3, Trash2, Check, X } from 'lucide-react';
import { WorkoutSet } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

interface SetRowProps {
  set: WorkoutSet;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export const SetRow: React.FC<SetRowProps> = ({ set, onSaved, onDeleted }) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [exerciseName, setExerciseName] = useState(set.exerciseName);
  const [reps, setReps] = useState(String(set.reps));
  const [weightKg, setWeightKg] = useState(set.weightKg != null ? String(set.weightKg) : '');
  const [notes, setNotes] = useState(set.notes ?? '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!exerciseName.trim() || Number(reps) < 1) {
      setError('Exercise and reps (>0) are required.');
      return;
    }
    setError('');
    const updated = storage.updateSet(set.id, {
      exerciseName: exerciseName.trim(),
      setNumber: set.setNumber,
      reps: Number(reps),
      weightKg: weightKg === '' ? null : Number(weightKg),
      notes: notes.trim(),
    });

    if (updated) {
      setIsEditing(false);
      showToast('Set updated', 'success');
      if (onSaved) onSaved();
    } else {
      setError('Could not update this set.');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Remove set ${set.setNumber} (${set.exerciseName}) from this workout?`)) {
      storage.deleteSet(set.id);
      showToast('Set deleted', 'info');
      if (onDeleted) onDeleted();
    }
  };

  return (
    <div
      className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/25"
      data-testid={`row-set-${set.id}`}
    >
      {isEditing ? (
        <div className="animate-pop-in space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1.5fr_.6fr_.8fr]">
            <Input
              label="Exercise"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
              testId={`input-edit-exercise-${set.id}`}
            />
            <Input
              label="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              type="number"
              min="1"
              required
              testId={`input-edit-reps-${set.id}`}
            />
            <Input
              label="Weight (kg)"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              type="number"
              min="0"
              step="0.5"
              placeholder="Optional"
              testId={`input-edit-weight-${set.id}`}
            />
          </div>
          <Input
            label="Set note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional note"
            testId={`input-edit-note-${set.id}`}
          />
          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="quiet"
              size="sm"
              onClick={() => setIsEditing(false)}
              testId={`button-cancel-edit-set-${set.id}`}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              testId={`button-save-set-${set.id}`}
            >
              <Check size={14} /> Save set
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted font-mono-ui text-xs font-bold text-secondary">
            {String(set.setNumber).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground" data-testid={`text-set-exercise-${set.id}`}>
              {set.exerciseName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">{set.reps} reps</span>
              {set.weightKg != null && (
                <>
                  <span className="mx-1.5 text-border">/</span>
                  <span className="font-semibold text-foreground/80">{set.weightKg} kg</span>
                </>
              )}
              {set.notes && <span className="ml-2 italic text-muted-foreground">· "{set.notes}"</span>}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            data-testid={`button-edit-set-${set.id}`}
            aria-label={`Edit ${set.exerciseName} set`}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            data-testid={`button-delete-set-${set.id}`}
            aria-label={`Delete ${set.exerciseName} set`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};