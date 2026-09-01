import React, { useState } from 'react';
import { Settings, Download, Upload, Trash2, Volume2, VolumeX, ShieldCheck, Database, Smartphone, Github } from 'lucide-react';
import { storage } from '@/lib/storage';
import { sound } from '@/lib/audio';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    storage.saveSettings({ soundEnabled: next });
    if (next) sound.playClick();
    showToast(`Sound effects ${next ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleExportJSON = () => {
    sound.playClick();
    const jsonStr = storage.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liftlog-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data backup exported successfully!', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = storage.importDataJSON(content);
      if (res.success) {
        sound.playCelebration();
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Clear all your logged workouts and sets? This gives you a 100% clean log.')) {
      storage.clearAllData();
      sound.playClick();
      showToast('All workout logs cleared', 'info');
    }
  };

  return (
    <div className="animate-rise-in text-left">
      <header>
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          Preferences & Data
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          App Settings<span className="text-primary">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Manage sound feedback, backup your workout history, and verify local device storage.
        </p>
      </header>

      <div className="mt-8 max-w-3xl space-y-6">
        {/* Persistence Notice */}
        <section className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6 ink-shadow">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground shrink-0">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Automatic Local Storage (Permanent)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Every workout, exercise, set, and rep you enter is <strong>automatically saved directly into your browser's persistent LocalStorage</strong>. Even if you refresh the page, close your browser, or restart your device, your logbook will remain intact.
              </p>
            </div>
          </div>
        </section>

        {/* Install as App / PWA */}
        <section className="rounded-2xl border border-card-border bg-card p-6 ink-shadow">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Smartphone size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Install as Mobile App (PWA)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You can install this website directly onto your phone's home screen as a standalone app without an app store:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-foreground/80 list-disc list-inside">
                <li><strong>iPhone / iPad (Safari)</strong>: Tap the Share button ➔ select <em>"Add to Home Screen"</em>.</li>
                <li><strong>Android (Chrome)</strong>: Tap the 3-dots menu ➔ select <em>"Install App"</em> or <em>"Add to Home Screen"</em>.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Audio & Feedback */}
        <section className="rounded-2xl border border-card-border bg-card p-6 ink-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">Tactile Sound Effects</h3>
                <p className="text-xs text-muted-foreground">Audio clicks on button taps and rest timer bell chimes.</p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`min-h-10 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                soundEnabled ? 'bg-primary text-primary-foreground shadow-ink-sm' : 'bg-muted text-foreground'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </section>

        {/* Data Export & Backup */}
        <section className="rounded-2xl border border-card-border bg-card p-6 ink-shadow">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/30 text-foreground">
              <Database size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold">Backup & Restore</h3>
              <p className="text-xs text-muted-foreground">Export your training history to a JSON file to transfer between devices.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={handleExportJSON} className="w-full">
              <Download size={16} /> Export JSON Backup
            </Button>

            <label className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <Upload size={16} /> Restore Backup
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-destructive">Clear All Workout Logs</p>
              <p className="text-xs text-muted-foreground">Removes all entries so you can start completely from scratch.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearAllData}>
              <Trash2 size={14} /> Clear All
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};