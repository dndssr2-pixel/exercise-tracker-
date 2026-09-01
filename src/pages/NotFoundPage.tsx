import React from 'react';
import { Link } from 'wouter';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-rise-in">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-destructive/10 text-destructive mb-4">
        <AlertCircle size={32} />
      </div>
      <h1 className="font-display text-3xl font-bold">404 Page Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-ink-sm hover:-translate-y-0.5 transition-transform"
      >
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
};