import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.slice(0, 10);
  const date = new Date(`${clean}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.slice(0, 10);
  const date = new Date(`${clean}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthDay(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export function createEmptySetDraft() {
  return {
    exerciseName: '',
    reps: '',
    weightKg: '',
    notes: '',
  };
}

/**
 * Calculates Estimated 1-Rep Max (1RM) using Epley & Brzycki formula
 */
export function calculate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  // Brzycki formula: weight / (1.0278 - (0.0278 * reps))
  const brzycki = weightKg / (1.0278 - 0.0278 * reps);
  // Epley formula: weight * (1 + reps / 30)
  const epley = weightKg * (1 + reps / 30);
  return Math.round(((brzycki + epley) / 2) * 10) / 10;
}

/**
 * Barbell Plate Loading Calculator
 * Given a total target weight in kg, calculates plates per side for standard 20kg bar
 */
export function calculatePlates(targetWeightKg: number, barWeightKg: number = 20) {
  if (targetWeightKg < barWeightKg) {
    return { perSideWeight: 0, plates: [], remaining: 0 };
  }
  
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  let perSideNeeded = (targetWeightKg - barWeightKg) / 2;
  const plateCount: { plate: number; count: number }[] = [];
  
  for (const p of availablePlates) {
    if (perSideNeeded >= p) {
      const count = Math.floor(perSideNeeded / p);
      if (count > 0) {
        plateCount.push({ plate: p, count });
        perSideNeeded = Math.round((perSideNeeded - count * p) * 100) / 100;
      }
    }
  }
  
  return {
    perSideWeight: (targetWeightKg - barWeightKg) / 2,
    plates: plateCount,
    remaining: perSideNeeded,
  };
}