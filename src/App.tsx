import React from 'react';
import { Route, Switch } from 'wouter';
import { Sidebar } from '@/components/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { DashboardPage } from '@/pages/DashboardPage';
import { NewWorkoutPage } from '@/pages/NewWorkoutPage';
import { WorkoutDetailPage } from '@/pages/WorkoutDetailPage';
import { ExerciseLibraryPage } from '@/pages/ExerciseLibraryPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <ToastProvider>
      <div className="app-noise flex min-h-[100dvh] bg-background text-foreground">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
            {/* Top Breadcrumb Bar */}
            <div className="mb-6 hidden items-center justify-between md:flex">
              <p
                className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold"
                data-testid="text-breadcrumb"
              >
                Training / Journal
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Private by design
              </div>
            </div>

            {/* Routes */}
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/workouts/new" component={NewWorkoutPage} />
              <Route path="/workouts/:id" component={WorkoutDetailPage} />
              <Route path="/exercises" component={ExerciseLibraryPage} />
              <Route path="/templates" component={TemplatesPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;