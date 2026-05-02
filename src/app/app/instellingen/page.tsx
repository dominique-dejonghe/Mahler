'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, WifiOff, Download, LogOut, User } from 'lucide-react';
import { getSession, logout, type MockSession } from '@/lib/auth';

export default function InstellingenPage() {
  const router = useRouter();
  const [session, setSession] = useState<MockSession | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setSession(getSession());
    if (typeof window !== 'undefined') {
      const prefs = JSON.parse(localStorage.getItem('mahler.prefs') || '{}');
      setNotifications(prefs.notifications ?? true);
      setOffline(prefs.offline ?? false);
    }
  }, []);

  const savePref = (k: string, v: boolean) => {
    const prefs = JSON.parse(localStorage.getItem('mahler.prefs') || '{}');
    prefs[k] = v;
    localStorage.setItem('mahler.prefs', JSON.stringify(prefs));
  };

  const handleExport = () => {
    if (typeof window === 'undefined') return;
    const data = {
      session: getSession(),
      entries: JSON.parse(localStorage.getItem('mahler.entries') || '[]'),
      checklistOverrides: JSON.parse(localStorage.getItem('mahler.checklistOverrides') || '{}'),
      contactOverrides: JSON.parse(localStorage.getItem('mahler.contactOverrides') || '{}'),
      transcripts: JSON.parse(localStorage.getItem('mahler.transcripts') || '{}'),
      prefs: JSON.parse(localStorage.getItem('mahler.prefs') || '{}'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahler-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    router.replace('/app/login');
  };

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Instellingen</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account, voorkeuren en data.</p>
      </header>

      <div className="space-y-5">
        {/* Profile */}
        <Card className="border-primary/10">
          <CardContent className="p-6">
            <h2 className="mb-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-primary">
              <User className="h-4 w-4 text-accent" /> Profiel
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Naam</Label>
                <Input id="name" defaultValue={session?.name || ''} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue={session?.email || ''} className="mt-1.5" disabled />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">In prompt 2 wordt dit gekoppeld aan Supabase user metadata.</p>
          </CardContent>
        </Card>

        {/* Toggles */}
        <Card className="border-primary/10">
          <CardContent className="p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-primary">Voorkeuren</h2>

            <ToggleRow
              icon={Bell}
              label="Notificaties"
              desc="E-mail bij nieuwe entries en checklist-updates"
              value={notifications}
              onChange={(v) => { setNotifications(v); savePref('notifications', v); }}
            />

            <ToggleRow
              icon={WifiOff}
              label="Offline modus"
              desc="Werk offline tijdens de prospectiereis (PWA cache)"
              value={offline}
              onChange={(v) => { setOffline(v); savePref('offline', v); }}
            />
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="border-primary/10">
          <CardContent className="p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-primary">Data</h2>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" /> Exporteer als JSON
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Bevat al je lokale entries, transcripties, checklist-aanpassingen en voorkeuren.
            </p>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Uitloggen
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border-b py-4 last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 text-accent" />
        <div>
          <div className="text-sm font-medium text-primary">{label}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}
