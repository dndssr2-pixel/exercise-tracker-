import { Workout, WorkoutSet, DashboardStats, PersonalRecord } from '../types';
import { calculate1RM } from './utils';

const WORKOUTS_KEY = 'liftlog_workouts_v1';
const SETS_KEY = 'liftlog_sets_v1';
const SETTINGS_KEY = 'liftlog_settings_v1';

export interface AppSettings {
  weightUnit: 'kg' | 'lbs';
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'kg',
  soundEnabled: true,
  theme: 'light',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // Ensures storage exists but starts completely empty for the user
  private ensureInitialized() {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(WORKOUTS_KEY) === null) {
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify([]));
      }
      if (localStorage.getItem(SETS_KEY) === null) {
        localStorage.setItem(SETS_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
    }
  }

  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: Partial<AppSettings>): AppSettings {
    const updated = { ...this.getSettings(), ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      this.notify();
    } catch (e) {
      console.error('Failed to save settings', e);
    }
    return updated;
  }

  public getWorkouts(): Workout[] {
    try {
      const data = localStorage.getItem(WORKOUTS_KEY);
      const workouts: Workout[] = data ? JSON.parse(data) : [];
      return workouts.sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime());
    } catch {
      return [];
    }
  }

  public getSets(): WorkoutSet[] {
    try {
      const data = localStorage.getItem(SETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getWorkoutById(id: number): Workout | null {
    const workouts = this.getWorkouts();
    const workout = workouts.find((w) => w.id === id);
    if (!workout) return null;

    const allSets = this.getSets();
    const workoutSets = allSets
      .filter((s) => s.workoutId === id)
      .sort((a, b) => a.setNumber - b.setNumber);

    const totalReps = workoutSets.reduce((sum, s) => sum + (s.reps || 0), 0);
    const totalVolume = workoutSets.reduce((sum, s) => sum + (s.weightKg ? s.weightKg * s.reps : 0), 0);

    return {
      ...workout,
      setCount: workoutSets.length,
      totalReps,
      totalVolumeKg: totalVolume,
      sets: workoutSets,
    };
  }

  public getDashboardStats(): DashboardStats {
    const workouts = this.getWorkouts();
    const sets = this.getSets();

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const weekCount = workouts.filter((w) => {
      const wDate = new Date(`${w.workoutDate.slice(0, 10)}T12:00:00`);
      return wDate >= oneWeekAgo && wDate <= now;
    }).length;

    const totalSets = sets.length;
    const totalReps = sets.reduce((sum, s) => sum + (s.reps || 0), 0);
    const totalVolumeKg = sets.reduce((sum, s) => sum + (s.weightKg ? s.weightKg * s.reps : 0), 0);

    const distinctExercises = new Set(sets.map((s) => s.exerciseName.trim().toLowerCase())).size;

    return {
      workoutCount: workouts.length,
      weekCount,
      totalSets,
      totalReps,
      exerciseCount: distinctExercises,
      totalVolumeKg,
      recentWorkouts: workouts.slice(0, 15),
    };
  }

  public createWorkout(data: { name: string; workoutDate: string; notes?: string }): Workout {
    const workouts = this.getWorkouts();
    const newId = workouts.length > 0 ? Math.max(...workouts.map((w) => w.id)) + 1 : 1;
    
    const newWorkout: Workout = {
      id: newId,
      name: data.name.trim(),
      workoutDate: data.workoutDate,
      notes: data.notes?.trim() || null,
      setCount: 0,
      totalReps: 0,
      totalVolumeKg: 0,
      createdAt: new Date().toISOString(),
      sets: [],
    };

    workouts.unshift(newWorkout);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    this.notify();
    return newWorkout;
  }

  public updateWorkout(id: number, data: { name?: string; workoutDate?: string; notes?: string }): Workout | null {
    const workouts = this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) return null;

    workouts[index] = {
      ...workouts[index],
      name: data.name !== undefined ? data.name.trim() : workouts[index].name,
      workoutDate: data.workoutDate !== undefined ? data.workoutDate : workouts[index].workoutDate,
      notes: data.notes !== undefined ? (data.notes.trim() || null) : workouts[index].notes,
    };

    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    this.notify();
    return this.getWorkoutById(id);
  }

  public deleteWorkout(id: number): boolean {
    const workouts = this.getWorkouts().filter((w) => w.id !== id);
    const sets = this.getSets().filter((s) => s.workoutId !== id);
    
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    localStorage.setItem(SETS_KEY, JSON.stringify(sets));
    this.notify();
    return true;
  }

  public addSet(workoutId: number, set: { exerciseName: string; setNumber?: number; reps: number; weightKg?: number | null; notes?: string }): WorkoutSet {
    const sets = this.getSets();
    const newId = sets.length > 0 ? Math.max(...sets.map((s) => s.id)) + 1 : 1;
    
    const existingForExercise = sets.filter(
      (s) => s.workoutId === workoutId && s.exerciseName.trim().toLowerCase() === set.exerciseName.trim().toLowerCase()
    );
    const setNumber = set.setNumber ?? (existingForExercise.length + 1);

    const newSet: WorkoutSet = {
      id: newId,
      workoutId,
      exerciseName: set.exerciseName.trim(),
      setNumber,
      reps: Number(set.reps),
      weightKg: set.weightKg != null && !isNaN(Number(set.weightKg)) ? Number(set.weightKg) : null,
      notes: set.notes?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    sets.push(newSet);
    localStorage.setItem(SETS_KEY, JSON.stringify(sets));

    this.recalculateWorkoutTotals(workoutId);
    this.notify();
    return newSet;
  }

  public updateSet(id: number, data: { exerciseName?: string; setNumber?: number; reps?: number; weightKg?: number | null; notes?: string }): WorkoutSet | null {
    const sets = this.getSets();
    const index = sets.findIndex((s) => s.id === id);
    if (index === -1) return null;

    sets[index] = {
      ...sets[index],
      exerciseName: data.exerciseName !== undefined ? data.exerciseName.trim() : sets[index].exerciseName,
      setNumber: data.setNumber !== undefined ? data.setNumber : sets[index].setNumber,
      reps: data.reps !== undefined ? Number(data.reps) : sets[index].reps,
      weightKg: data.weightKg !== undefined ? (data.weightKg !== null ? Number(data.weightKg) : null) : sets[index].weightKg,
      notes: data.notes !== undefined ? (data.notes.trim() || null) : sets[index].notes,
    };

    localStorage.setItem(SETS_KEY, JSON.stringify(sets));
    this.recalculateWorkoutTotals(sets[index].workoutId);
    this.notify();
    return sets[index];
  }

  public deleteSet(id: number): boolean {
    const sets = this.getSets();
    const set = sets.find((s) => s.id === id);
    if (!set) return false;

    const workoutId = set.workoutId;
    const remaining = sets.filter((s) => s.id !== id);
    localStorage.setItem(SETS_KEY, JSON.stringify(remaining));

    this.recalculateWorkoutTotals(workoutId);
    this.notify();
    return true;
  }

  private recalculateWorkoutTotals(workoutId: number) {
    const workouts = this.getWorkouts();
    const sets = this.getSets().filter((s) => s.workoutId === workoutId);
    const index = workouts.findIndex((w) => w.id === workoutId);
    if (index === -1) return;

    const totalReps = sets.reduce((sum, s) => sum + (s.reps || 0), 0);
    const totalVolume = sets.reduce((sum, s) => sum + (s.weightKg ? s.weightKg * s.reps : 0), 0);

    workouts[index].setCount = sets.length;
    workouts[index].totalReps = totalReps;
    workouts[index].totalVolumeKg = totalVolume;

    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  }

  public getPersonalRecords(): PersonalRecord[] {
    const sets = this.getSets();
    const workouts = this.getWorkouts();
    const prMap = new Map<string, PersonalRecord>();

    sets.forEach((set) => {
      if (!set.weightKg || set.weightKg <= 0 || !set.reps || set.reps <= 0) return;
      const key = set.exerciseName.trim().toLowerCase();
      const est1RM = calculate1RM(set.weightKg, set.reps);
      const workout = workouts.find((w) => w.id === set.workoutId);
      const date = workout ? workout.workoutDate : set.createdAt.slice(0, 10);

      const existing = prMap.get(key);
      if (!existing || est1RM > existing.bestEstimated1RM) {
        prMap.set(key, {
          exerciseName: set.exerciseName,
          maxWeightKg: set.weightKg,
          maxRepsAtMaxWeight: set.reps,
          bestEstimated1RM: est1RM,
          achievedDate: date,
          workoutId: set.workoutId,
        });
      }
    });

    return Array.from(prMap.values()).sort((a, b) => b.bestEstimated1RM - a.bestEstimated1RM);
  }

  public exportDataJSON(): string {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      workouts: this.getWorkouts(),
      sets: this.getSets(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importDataJSON(jsonStr: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed.workouts) || !Array.isArray(parsed.sets)) {
        return { success: false, message: 'Invalid file format. Workouts or sets data missing.' };
      }
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(parsed.workouts));
      localStorage.setItem(SETS_KEY, JSON.stringify(parsed.sets));
      if (parsed.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.settings));
      }
      this.notify();
      return { success: true, message: `Successfully restored ${parsed.workouts.length} workouts and ${parsed.sets.length} sets.` };
    } catch (e) {
      return { success: false, message: 'JSON parsing failed. Please check the backup file.' };
    }
  }

  public clearAllData() {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify([]));
    localStorage.setItem(SETS_KEY, JSON.stringify([]));
    this.notify();
  }
}

export const storage = new StorageService();