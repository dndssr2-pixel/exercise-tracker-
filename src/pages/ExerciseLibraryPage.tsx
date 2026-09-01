import React, { useState } from 'react';
import { Dumbbell, Trophy, Search, Flame, Award, Filter } from 'lucide-react';
import { EXERCISE_LIBRARY } from '@/lib/seedData';
import { storage } from '@/lib/storage';
import { PersonalRecord } from '@/types';
import { formatShortDate } from '@/lib/utils';
import { StatCard } from '@/components/StatCard';

export const ExerciseLibraryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [personalRecords] = useState<PersonalRecord[]>(() => storage.getPersonalRecords());

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPRForExercise = (name: string) => {
    return personalRecords.find((pr) => pr.exerciseName.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="animate-rise-in text-left">
      <header>
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          Database & Records
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Exercise Library & PRs<span className="text-primary">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Track personal records, estimated 1-rep maximums, and target specific muscle groups.
        </p>
      </header>

      {/* Top PR Highlights */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="PRs Recorded"
          value={personalRecords.length}
          icon={Trophy}
          accent="orange"
        />
        <StatCard
          label="Movements in Library"
          value={EXERCISE_LIBRARY.length}
          icon={Dumbbell}
          accent="teal"
        />
        <StatCard
          label="Muscle Groups"
          value={6}
          icon={Flame}
          accent="yellow"
        />
      </div>

      {/* Search & Category Filter */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises or muscles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-ink-sm'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((ex) => {
          const pr = getPRForExercise(ex.name);
          return (
            <div
              key={ex.id}
              className="rounded-2xl border border-card-border bg-card p-5 ink-shadow transition-transform duration-200 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-md bg-secondary/10 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-secondary uppercase tracking-wider">
                    {ex.category}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {ex.equipment}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-foreground">{ex.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ex.description}</p>
                <p className="mt-2 text-xs font-medium text-foreground/75">
                  <span className="text-muted-foreground">Target:</span> {ex.primaryMuscle}
                </p>
              </div>

              {/* PR Badge */}
              <div className="mt-4 pt-3 border-t border-border/60">
                {pr ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Award size={15} />
                      <span>PR: {pr.maxWeightKg} kg × {pr.maxRepsAtMaxWeight}</span>
                    </div>
                    <span className="font-mono-ui text-[11px] font-semibold text-muted-foreground">
                      Est. 1RM: {pr.bestEstimated1RM} kg
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">No sets logged yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};