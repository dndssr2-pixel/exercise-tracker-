import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { ArrowLeft, Trash2, Check, Edit3, Save, Dumbbell, Layers } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Workout, WorkoutSet } from '@/types';
import { formatFullDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SetRow } from '@/components/SetRow';
import { QuickAddSetForm } from '@/components/QuickAddSetForm';
import { useToast } from '@/components/ui/Toast';

export const WorkoutDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { showToast } = useToast();

  const workoutId = Number(params.id);
  const [workout, setWorkout] = useState<Workout | null>(() => storage.getWorkoutById(workoutId));

  // Inline edit state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [name, setName] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const refreshWorkout = () => {
    const updated = storage.getWorkoutById(workoutId);
    setWorkout(updated);
    if (updated) {
      setName(updated.name);
      setWorkoutDate(updated.workoutDate.slice(0, 10));
      setNotes(updated.notes ?? '');
    }
  };

  useEffect(() => {
    refreshWorkout();
    const unsubscribe = storage.subscribe(refreshWorkout);
    return () => unsubscribe();
  }, [workoutId]);

  // Group sets by exercise name
  const groupedSets = useMemo(() => {
    if (!workout?.sets) return [];
    const map = new Map<string, WorkoutSet[]>();
    workout.sets.forEach((set) => {
      const list = map.get(set.exerciseName) || [];
      list.push(set);
      map.set(set.exerciseName, list);
    });
    return Array.from(map.entries());
  }, [workout?.sets]);

  const handleSaveDetails = () => {
    if (!name.trim() || !workoutDate) {
      setError('Name and date are required.');
      return;
    }
    setError('');
    storage.updateWorkout(workoutId, {
      name: name.trim(),
      workoutDate,
      notes: notes.trim(),
    });
    setIsEditingTitle(false);
    showToast('Workout details updated', 'success');
  };

  const handleDeleteWorkout = () => {
    if (window.confirm('Delete this workout and all of its logged sets?')) {
      storage.deleteWorkout(workoutId);
      showToast('Workout deleted', 'info');
      setLocation('/');
    }
  };

  if (!workout) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center" data-testid="state-error">
        <h2 className="font-display text-lg font-bold">That workout could not be found.</h2>
        <p className="mt-1 text-sm text-muted-foreground">It may have been deleted or moved.</p>
        <Link href="/" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-card border px-4 text-xs font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-rise-in text-left">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
          data-testid="link-back-detail"
        >
          <ArrowLeft size={15} /> Back to today
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteWorkout}
            testId="button-delete-workout"
          >
            <Trash2 size={15} /> Delete
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setLocation('/')}
            testId="button-complete-workout"
          >
            <Check size={15} /> Done for today
          </Button>
        </div>
      </div>

      {/* Header & Title Editor */}
      <div className="mt-8 flex max-w-4xl flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Saved workout / {formatFullDate(workout.workoutDate)}
          </p>

          {isEditingTitle ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 min-w-[260px] rounded-xl border border-primary bg-card px-3 font-display text-2xl font-bold outline-none"
                data-testid="input-edit-workout-name"
              />
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="h-12 rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary"
                data-testid="input-edit-workout-date"
              />
            </div>
          ) : (
            <h1
              className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl text-foreground"
              data-testid="heading-workout-detail"
            >
              {workout.name}
              <span className="text-primary">.</span>
            </h1>
          )}
        </div>

        {isEditingTitle ? (
          <div className="flex gap-2">
            <Button variant="quiet" size="sm" onClick={() => setIsEditingTitle(false)} testId="button-cancel-edit-workout">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveDetails} testId="button-save-workout-details">
              <Save size={15} /> Save
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingTitle(true)}
            testId="button-edit-workout"
          >
            <Edit3 size={15} /> Edit details
          </Button>
        )}
      </div>

      {/* Session Notes */}
      {isEditingTitle && (
        <label className="mt-4 block max-w-2xl text-left">
          <span className="mb-2 block text-xs font-bold text-foreground/75">Session note</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:border-primary"
            data-testid="input-edit-workout-notes"
          />
        </label>
      )}

      {!isEditingTitle && workout.notes && (
        <p className="mt-3 max-w-2xl text-sm italic leading-6 text-muted-foreground" data-testid="text-workout-notes">
          “{workout.notes}”
        </p>
      )}

      {error && (
        <p className="mt-4 max-w-2xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      {/* Main 2-Column Content */}
      <div className="mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* Left Column: Grouped Sets */}
        <section className="rounded-2xl border border-card-border bg-card p-5 ink-shadow sm:p-7 text-left">
          <div className="flex items-end justify-between border-b border-border/60 pb-4">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Session log
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold">Every set counts</h2>
            </div>
            <span className="font-mono-ui text-xs font-bold text-muted-foreground" data-testid="text-set-count">
              {workout.setCount} sets / {workout.totalReps} reps
              {workout.totalVolumeKg ? ` / ${workout.totalVolumeKg.toLocaleString()} kg` : ''}
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {groupedSets.length > 0 ? (
              groupedSets.map(([exerciseName, setsList]) => (
                <div key={exerciseName}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/85">
                      {exerciseName}
                    </h3>
                    <span className="font-mono-ui text-[10px] text-muted-foreground font-semibold">
                      {setsList.length} {setsList.length === 1 ? 'set' : 'sets'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {setsList.map((s) => (
                      <SetRow
                        key={s.id}
                        set={s}
                        onSaved={refreshWorkout}
                        onDeleted={refreshWorkout}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No sets in this workout yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: "One more set?" quick add form */}
        <QuickAddSetForm
          workoutId={workoutId}
          defaultExerciseName={groupedSets.length > 0 ? groupedSets[groupedSets.length - 1][0] : ''}
          onSetAdded={refreshWorkout}
        />
      </div>
    </div>
  );
};