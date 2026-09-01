export interface WorkoutSet {
  id: number;
  workoutId: number;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number | null;
  notes?: string | null;
  rpe?: number | null;
  createdAt: string;
}

export interface Workout {
  id: number;
  name: string;
  workoutDate: string; // YYYY-MM-DD
  notes?: string | null;
  setCount: number;
  totalReps: number;
  totalVolumeKg?: number;
  createdAt: string;
  sets?: WorkoutSet[];
}

export interface SetDraft {
  exerciseName: string;
  reps: string;
  weightKg: string;
  notes: string;
  rpe?: string;
}

export interface DashboardStats {
  workoutCount: number;
  weekCount: number;
  totalSets: number;
  totalReps: number;
  exerciseCount: number;
  totalVolumeKg: number;
  recentWorkouts: Workout[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  primaryMuscle: string;
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Other';
  description?: string;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  description: string;
  tag: string;
  exercises: {
    name: string;
    defaultSets: number;
    targetReps: number;
    suggestedWeightKg?: number;
  }[];
}

export interface PersonalRecord {
  exerciseName: string;
  maxWeightKg: number;
  maxRepsAtMaxWeight: number;
  bestEstimated1RM: number;
  achievedDate: string;
  workoutId: number;
}