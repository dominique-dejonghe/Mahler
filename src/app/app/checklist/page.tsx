'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getChecklist } from '@/lib/data';
import type { ChecklistItem, ChecklistCategory } from '@/types';

const CAT_LABELS: Record<ChecklistCategory, string> = {
  admin: 'Administratie',
  travel: 'Reizen',
  archive: 'Archieven',
  media: 'Media',
  concert: 'Concerten',
  logistics: 'Logistiek',
};

const CAT_ORDER: ChecklistCategory[] = ['admin', 'travel', 'archive', 'media', 'concert', 'logistics'];

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getChecklist().then(setItems);
    if (typeof window !== 'undefined') {
      setOverrides(JSON.parse(localStorage.getItem('mahler.checklistOverrides') || '{}'));
    }
  }, []);

  const merged = items.map((it) => ({ ...it, done: overrides[it.id] ?? it.done }));

  const toggle = (id: string, value: boolean) => {
    const next = { ...overrides, [id]: value };
    setOverrides(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahler.checklistOverrides', JSON.stringify(next));
    }
  };

  const grouped = useMemo(() => {
    const m: Record<ChecklistCategory, typeof merged> = {} as any;
    CAT_ORDER.forEach((c) => (m[c] = []));
    merged.forEach((it) => m[it.category].push(it));
    return m;
  }, [merged]);

  const total = merged.length;
  const done = merged.filter((m) => m.done).length;
  const pct = total === 0 ? 0 : (done / total) * 100;

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">Checklist</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gedeelde takenlijst voor het prospectie-team.</p>
      </header>

      {/* Overall progress */}
      <Card className="mb-6 border-accent/30 bg-gradient-to-br from-accent/5 to-cream">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-display text-2xl font-bold text-primary">{done} / {total}</div>
              <div className="text-xs text-muted-foreground">items afgewerkt</div>
            </div>
            <div className="font-display text-3xl font-bold text-accent">{Math.round(pct)}%</div>
          </div>
          <Progress value={pct} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Grouped */}
      <div className="space-y-5">
        {CAT_ORDER.map((cat) => {
          const list = grouped[cat];
          if (list.length === 0) return null;
          const catDone = list.filter((it) => it.done).length;
          return (
            <Card key={cat} className="border-primary/10">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-primary">{CAT_LABELS[cat]}</h3>
                  <Badge variant="muted">{catDone}/{list.length}</Badge>
                </div>
                <ul className="space-y-2">
                  {list.map((it) => (
                    <li key={it.id} className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50">
                      <Checkbox
                        id={it.id}
                        checked={it.done}
                        onCheckedChange={(v) => toggle(it.id, !!v)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={it.id}
                        className={`flex-1 cursor-pointer text-sm ${it.done ? 'text-muted-foreground line-through' : 'text-primary'}`}
                      >
                        {it.title.nl}
                      </label>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
