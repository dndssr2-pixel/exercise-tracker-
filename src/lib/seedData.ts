import { Workout, WorkoutSet, ExerciseDefinition, RoutineTemplate } from '../types';
import { getTodayDateString } from './utils';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // Chest
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'Chest', primaryMuscle: 'Pectorals', equipment: 'Barbell', description: 'Compound push movement for chest, triceps, and front delts.' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', category: 'Chest', primaryMuscle: 'Upper Pectorals', equipment: 'Dumbbell', description: 'Targets clavicular upper chest fibers.' },
  { id: 'dips', name: 'Bodyweight / Weighted Dips', category: 'Chest', primaryMuscle: 'Lower Chest & Triceps', equipment: 'Bodyweight', description: 'Deep chest and tricep compound movement.' },
  { id: 'cable-flyes', name: 'Cable Chest Flyes', category: 'Chest', primaryMuscle: 'Pectorals', equipment: 'Cable', description: 'Constant tension chest isolation.' },
  { id: 'push-ups', name: 'Push-Ups', category: 'Chest', primaryMuscle: 'Chest & Core', equipment: 'Bodyweight', description: 'Classic functional horizontal push.' },

  // Back
  { id: 'barbell-deadlift', name: 'Barbell Conventional Deadlift', category: 'Back', primaryMuscle: 'Posterior Chain', equipment: 'Barbell', description: 'Full body strength builder for back, glutes, and hamstrings.' },
  { id: 'barbell-row', name: 'Bent-Over Barbell Row', category: 'Back', primaryMuscle: 'Lats & Rhomboids', equipment: 'Barbell', description: 'Heavy horizontal pulling for back thickness.' },
  { id: 'pull-ups', name: 'Pull-Ups / Chin-Ups', category: 'Back', primaryMuscle: 'Latissimus Dorsi', equipment: 'Bodyweight', description: 'Vertical pulling fundamental.' },
  { id: 'lat-pulldown', name: 'Cable Lat Pulldown', category: 'Back', primaryMuscle: 'Latissimus Dorsi', equipment: 'Cable', description: 'Vertical cable pull with controlled eccentric.' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'Back', primaryMuscle: 'Mid-Back', equipment: 'Cable', description: 'Horizontal cable pull for mid-back and posture.' },
  { id: 'face-pulls', name: 'Rope Face Pulls', category: 'Back', primaryMuscle: 'Rear Delts & Rotator Cuff', equipment: 'Cable', description: 'Crucial shoulder health and posture exercise.' },

  // Legs
  { id: 'barbell-squat', name: 'Barbell Back Squat', category: 'Legs', primaryMuscle: 'Quadriceps & Glutes', equipment: 'Barbell', description: 'The king of lower body compound exercises.' },
  { id: 'front-squat', name: 'Barbell Front Squat', category: 'Legs', primaryMuscle: 'Quads & Upper Back', equipment: 'Barbell', description: 'Upright squat emphasis on quads and core rigidity.' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', category: 'Legs', primaryMuscle: 'Hamstrings & Glutes', equipment: 'Barbell', description: 'Hip hinge movement building hamstring length & power.' },
  { id: 'leg-press', name: '45° Leg Press', category: 'Legs', primaryMuscle: 'Quadriceps', equipment: 'Machine', description: 'High volume leg hypertrophy with fixed path.' },
  { id: 'walking-lunges', name: 'Dumbbell Walking Lunges', category: 'Legs', primaryMuscle: 'Quads & Glutes', equipment: 'Dumbbell', description: 'Unilateral leg strength, balance, and stabilizer work.' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', category: 'Legs', primaryMuscle: 'Gastrocnemius', equipment: 'Machine', description: 'Full stretch and contraction calf builder.' },

  // Shoulders
  { id: 'overhead-press', name: 'Standing Barbell Overhead Press (OHP)', category: 'Shoulders', primaryMuscle: 'Anterior Deltoids', equipment: 'Barbell', description: 'Strict vertical press for full shoulder strength.' },
  { id: 'db-shoulder-press', name: 'Seated Dumbbell Shoulder Press', category: 'Shoulders', primaryMuscle: 'Deltoids', equipment: 'Dumbbell', description: 'Hypertrophy vertical press with independent arms.' },
  { id: 'lateral-raises', name: 'Dumbbell Lateral Raises', category: 'Shoulders', primaryMuscle: 'Lateral Deltoids', equipment: 'Dumbbell', description: 'Side delt isolation for width and shoulder cap.' },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Bicep Curl', category: 'Arms', primaryMuscle: 'Biceps Brachii', equipment: 'Barbell', description: 'Heavy bicep mass builder.' },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Curl', category: 'Arms', primaryMuscle: 'Long Head Biceps', equipment: 'Dumbbell', description: 'Deep stretch bicep curl.' },
  { id: 'skull-crushers', name: 'EZ-Bar Skull Crushers (Lying Triceps Extension)', category: 'Arms', primaryMuscle: 'Triceps', equipment: 'Barbell', description: 'Overhead tricep long-head builder.' },
  { id: 'tricep-pushdown', name: 'Cable Tricep Pushdown', category: 'Arms', primaryMuscle: 'Triceps Lateral Head', equipment: 'Cable', description: 'Isolated tricep lockout pump.' },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raises', category: 'Core', primaryMuscle: 'Rectus Abdominis', equipment: 'Bodyweight', description: 'Lower ab and hip flexor development.' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', category: 'Core', primaryMuscle: 'Core & Anti-Extension', equipment: 'Other', description: 'Intense anti-extension abdominal builder.' },
  { id: 'plank', name: 'Forearm Plank', category: 'Core', primaryMuscle: 'Transverse Abdominis', equipment: 'Bodyweight', description: 'Isometric core stability hold.' },
];

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'push-strength',
    title: 'Push Day / Strength & Hypertrophy',
    tag: 'Chest, Shoulders & Triceps',
    description: 'Heavy pressing foundation followed by shoulder and tricep volume.',
    exercises: [
      { name: 'Barbell Bench Press', defaultSets: 4, targetReps: 6, suggestedWeightKg: 80 },
      { name: 'Standing Barbell Overhead Press (OHP)', defaultSets: 3, targetReps: 8, suggestedWeightKg: 50 },
      { name: 'Incline Dumbbell Press', defaultSets: 3, targetReps: 10, suggestedWeightKg: 28 },
      { name: 'Dumbbell Lateral Raises', defaultSets: 4, targetReps: 12, suggestedWeightKg: 12 },
      { name: 'Cable Tricep Pushdown', defaultSets: 3, targetReps: 12, suggestedWeightKg: 30 },
    ],
  },
  {
    id: 'pull-power',
    title: 'Pull Day / Back & Biceps',
    tag: 'Back, Rear Delts & Arms',
    description: 'Deadlifts, heavy rows, vertical pulls, and targeted arm finishers.',
    exercises: [
      { name: 'Barbell Conventional Deadlift', defaultSets: 3, targetReps: 5, suggestedWeightKg: 140 },
      { name: 'Pull-Ups / Chin-Ups', defaultSets: 4, targetReps: 8, suggestedWeightKg: 0 },
      { name: 'Bent-Over Barbell Row', defaultSets: 3, targetReps: 8, suggestedWeightKg: 70 },
      { name: 'Rope Face Pulls', defaultSets: 4, targetReps: 15, suggestedWeightKg: 25 },
      { name: 'Barbell Bicep Curl', defaultSets: 3, targetReps: 10, suggestedWeightKg: 35 },
    ],
  },
  {
    id: 'leg-day-foundations',
    title: 'Leg Day / Quad & Posterior',
    tag: 'Quads, Hamstrings & Calves',
    description: 'Barbell squats, Romanian deadlifts, and unilateral leg accessories.',
    exercises: [
      { name: 'Barbell Back Squat', defaultSets: 4, targetReps: 6, suggestedWeightKg: 105 },
      { name: 'Romanian Deadlift (RDL)', defaultSets: 3, targetReps: 8, suggestedWeightKg: 90 },
      { name: '45° Leg Press', defaultSets: 3, targetReps: 12, suggestedWeightKg: 180 },
      { name: 'Dumbbell Walking Lunges', defaultSets: 3, targetReps: 10, suggestedWeightKg: 20 },
      { name: 'Standing Calf Raise', defaultSets: 4, targetReps: 15, suggestedWeightKg: 60 },
    ],
  },
  {
    id: 'upper-body-balanced',
    title: 'Upper Body / Balanced Pump',
    tag: 'Chest, Back, Arms',
    description: 'Great for 4-day Upper/Lower splits, alternating agonist/antagonist supersets.',
    exercises: [
      { name: 'Incline Dumbbell Press', defaultSets: 4, targetReps: 8, suggestedWeightKg: 32 },
      { name: 'Bent-Over Barbell Row', defaultSets: 4, targetReps: 8, suggestedWeightKg: 75 },
      { name: 'Seated Dumbbell Shoulder Press', defaultSets: 3, targetReps: 10, suggestedWeightKg: 24 },
      { name: 'Cable Lat Pulldown', defaultSets: 3, targetReps: 10, suggestedWeightKg: 65 },
      { name: 'Incline Dumbbell Curl', defaultSets: 3, targetReps: 12, suggestedWeightKg: 14 },
      { name: 'EZ-Bar Skull Crushers (Lying Triceps Extension)', defaultSets: 3, targetReps: 12, suggestedWeightKg: 30 },
    ],
  },
];

export function generateSeedWorkouts(): { workouts: Workout[]; sets: WorkoutSet[] } {
  const today = new Date();
  
  const formatDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const seedWorkouts: Workout[] = [
    {
      id: 1,
      name: 'Lower body / strength & posture',
      workoutDate: formatDate(1),
      notes: 'Felt solid on squats today. Added 2.5kg to top set with clean depth.',
      setCount: 6,
      totalReps: 44,
      totalVolumeKg: 4320,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 2,
      name: 'Upper body / push & shoulder focus',
      workoutDate: formatDate(3),
      notes: 'Paused reps on bench press. Great mind-muscle connection.',
      setCount: 8,
      totalReps: 68,
      totalVolumeKg: 4620,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 3,
      name: 'Heavy Pull / Deadlift & Lats',
      workoutDate: formatDate(5),
      notes: 'Hook grip feeling very strong. High energy session.',
      setCount: 7,
      totalReps: 52,
      totalVolumeKg: 5880,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  const seedSets: WorkoutSet[] = [
    // Workout 1: Lower body
    { id: 101, workoutId: 1, exerciseName: 'Barbell Back Squat', setNumber: 1, reps: 8, weightKg: 90, notes: 'Warm up feeler', createdAt: new Date().toISOString() },
    { id: 102, workoutId: 1, exerciseName: 'Barbell Back Squat', setNumber: 2, reps: 6, weightKg: 105, notes: 'Crisp bar speed', createdAt: new Date().toISOString() },
    { id: 103, workoutId: 1, exerciseName: 'Barbell Back Squat', setNumber: 3, reps: 6, weightKg: 105, notes: 'Hard last rep, good depth', createdAt: new Date().toISOString() },
    { id: 104, workoutId: 1, exerciseName: 'Romanian Deadlift (RDL)', setNumber: 1, reps: 8, weightKg: 85, notes: 'Focus on deep hamstring stretch', createdAt: new Date().toISOString() },
    { id: 105, workoutId: 1, exerciseName: 'Romanian Deadlift (RDL)', setNumber: 2, reps: 8, weightKg: 85, notes: null, createdAt: new Date().toISOString() },
    { id: 106, workoutId: 1, exerciseName: 'Standing Calf Raise', setNumber: 1, reps: 16, weightKg: 60, notes: '2s pause at top', createdAt: new Date().toISOString() },

    // Workout 2: Upper body
    { id: 201, workoutId: 2, exerciseName: 'Barbell Bench Press', setNumber: 1, reps: 8, weightKg: 75, notes: 'Smooth touch and go', createdAt: new Date().toISOString() },
    { id: 202, workoutId: 2, exerciseName: 'Barbell Bench Press', setNumber: 2, reps: 8, weightKg: 82.5, notes: 'Top set', createdAt: new Date().toISOString() },
    { id: 203, workoutId: 2, exerciseName: 'Barbell Bench Press', setNumber: 3, reps: 7, weightKg: 82.5, notes: 'RPE 9', createdAt: new Date().toISOString() },
    { id: 204, workoutId: 2, exerciseName: 'Standing Barbell Overhead Press (OHP)', setNumber: 1, reps: 8, weightKg: 45, notes: null, createdAt: new Date().toISOString() },
    { id: 205, workoutId: 2, exerciseName: 'Standing Barbell Overhead Press (OHP)', setNumber: 2, reps: 7, weightKg: 50, notes: 'Tight core', createdAt: new Date().toISOString() },
    { id: 206, workoutId: 2, exerciseName: 'Dumbbell Lateral Raises', setNumber: 1, reps: 14, weightKg: 12, notes: 'Controlled eccentric', createdAt: new Date().toISOString() },
    { id: 207, workoutId: 2, exerciseName: 'Dumbbell Lateral Raises', setNumber: 2, reps: 12, weightKg: 12, notes: null, createdAt: new Date().toISOString() },
    { id: 208, workoutId: 2, exerciseName: 'Cable Tricep Pushdown', setNumber: 1, reps: 14, weightKg: 30, notes: 'Full extension', createdAt: new Date().toISOString() },

    // Workout 3: Heavy Pull
    { id: 301, workoutId: 3, exerciseName: 'Barbell Conventional Deadlift', setNumber: 1, reps: 5, weightKg: 130, notes: 'Double overhand', createdAt: new Date().toISOString() },
    { id: 302, workoutId: 3, exerciseName: 'Barbell Conventional Deadlift', setNumber: 2, reps: 5, weightKg: 145, notes: 'Top working set', createdAt: new Date().toISOString() },
    { id: 303, workoutId: 3, exerciseName: 'Barbell Conventional Deadlift', setNumber: 3, reps: 5, weightKg: 145, notes: 'Solid lockouts', createdAt: new Date().toISOString() },
    { id: 304, workoutId: 3, exerciseName: 'Pull-Ups / Chin-Ups', setNumber: 1, reps: 10, weightKg: null, notes: 'Bodyweight', createdAt: new Date().toISOString() },
    { id: 305, workoutId: 3, exerciseName: 'Pull-Ups / Chin-Ups', setNumber: 2, reps: 9, weightKg: null, notes: 'Dead hang each rep', createdAt: new Date().toISOString() },
    { id: 306, workoutId: 3, exerciseName: 'Bent-Over Barbell Row', setNumber: 1, reps: 8, weightKg: 70, notes: null, createdAt: new Date().toISOString() },
    { id: 307, workoutId: 3, exerciseName: 'Barbell Bicep Curl', setNumber: 1, reps: 10, weightKg: 35, notes: 'Strict form, no swinging', createdAt: new Date().toISOString() },
  ];

  return { workouts: seedWorkouts, sets: seedSets };
}