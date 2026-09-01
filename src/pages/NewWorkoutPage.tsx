import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Save, Dumbbell, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTodayDateString, formatFullDate, createEmptySetDraft } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { SetDraft } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SetDraftCard } from '@/components/SetDraftCard';
import { useToast } from '@/components/ui/Toast';
import { sound } from '@/lib/audio';
import { ROUTINE_TEMPLATES } from '@/lib/seedData';

export const NewWorkoutPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { showToast } = useToast();

  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetDraft[]>([createEmptySetDraft()]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateSet = (index: number, field: keyof SetDraft, val: string) => {
    setSets((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveSet = (index: number) => {
    setSets((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddSet = () => {
    sound.playClick();
    const last = sets[sets.length - 1];
    setSets((prev) => [
      ...prev,
      {
        exerciseName: last ? last.exerciseName : '',
        reps: last ? last.reps : '',
        weightKg: last ? last.weightKg : '',
        notes: '',
      },
    ]);
  };

  const applyTemplate = (templateId: string) => {
    const template = ROUTINE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    sound.playClick();
    setWorkoutName(template.title.split('/')[0].trim());
    const generatedSets: SetDraft[] = [];
    template.exercises.forEach((ex) => {
      for (let i = 0; i < ex.defaultSets; i++) {
        generatedSets.push({
          exerciseName: ex.name,
          reps: String(ex.targetReps),
          weightKg: ex.suggestedWeightKg ? String(ex.suggestedWeightKg) : '',
          notes: i === 0 ? 'Target set' : '',
        });
      }
    });
    setSets(generatedSets);
    showToast(`Loaded template: ${template.title}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workoutName.trim()) {
      setError('Give this workout a name before saving.');
      return;
    }

    const validSets = sets.filter((s) => s.exerciseName.trim() && Number(s.reps) > 0);
    if (validSets.length === 0) {
      setError('Add at least one exercise with valid reps (>0).');
      return;
    }

    setIsSaving(true);
    try {
      const newWorkout = storage.createWorkout({
        name: workoutName.trim(),
        workoutDate,
        notes: notes.trim(),
      });

      validSets.forEach((s, idx) => {
        storage.addSet(newWorkout.id, {
          exerciseName: s.exerciseName.trim(),
          setNumber: idx + 1,
          reps: Number(s.reps),
          weightKg: s.weightKg === '' ? null : Number(s.weightKg),
          notes: s.notes.trim(),
        });
      });

      sound.playCelebration();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast('Workout logged successfully!', 'success');
      setLocation(`/workouts/${newWorkout.id}`);
    } catch {
      setError('We could not save this entry. Check the details and try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-rise-in text-left">
      {/* Back navigation */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
        data-testid="link-back-dashboard"
      >
        <ArrowLeft size={15} /> Back to today
      </Link>

      {/* Header */}
      <div className="max-w-3xl">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          New page / {formatFullDate(workoutDate)}
        </p>
        <h1
          className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl text-foreground"
          data-testid="heading-new-workout"
        >
          Log the work<span className="text-primary">.</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Capture enough to remember the session. Nothing more, nothing less.
        </p>
      </div>

      {/* Routine Quick Loaders */}
      <div className="mt-6 max-w-3xl flex flex-wrap items-center gap-2">
        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground font-bold mr-1">
          Quick Routine:
        </span>
        {ROUTINE_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => applyTemplate(tmpl.id)}
            className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
          >
            {tmpl.title.split('/')[0].trim()}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-5" data-testid="form-new-workout">
        {/* Session Details Card */}
        <section className="rounded-2xl border border-card-border bg-card p-5 ink-shadow sm:p-7">
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Dumbbell size={16} />
            </span>
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Session details
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">Name this session</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_.8fr]">
            <Input
              label="Workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g. Lower body / strength & posture"
              required
              testId="input-workout-name"
            />
            <Input
              label="Date"
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
              testId="input-workout-date"
            />
          </div>

          <div className="mt-4">
            <label className="block text-left">
              <span className="mb-2 block text-xs font-bold text-foreground/75">
                Session note
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A short note for future you..."
                className="min-h-24 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
                data-testid="input-workout-notes"
              />
            </label>
          </div>
        </section>

        {/* Exercises & Sets Card */}
        <section className="rounded-2xl border border-card-border bg-card p-5 ink-shadow sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                What you did
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">Exercises & sets</h2>
            </div>
            <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {sets.length} {sets.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {sets.map((draft, idx) => (
              <SetDraftCard
                key={idx}
                draft={draft}
                index={idx}
                onChange={(field, val) => handleUpdateSet(idx, field, val)}
                onRemove={() => handleRemoveSet(idx)}
                canRemove={sets.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSet}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-secondary/40 px-4 text-xs font-bold text-secondary transition-colors hover:border-secondary hover:bg-secondary/5 cursor-pointer"
            data-testid="button-add-set"
          >
            <Plus size={15} /> Add another set
          </button>
        </section>

        {/* Error message */}
        {error && (
          <p
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive"
            data-testid="status-form-error"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row pt-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            data-testid="link-cancel-workout"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSaving}
            className="min-h-12 px-6"
            testId="button-save-workout"
          >
            <Save size={17} /> {isSaving ? 'Saving page…' : 'Finish & save workout'}
          </Button>
        </div>
      </form>
    </div>
  );
};