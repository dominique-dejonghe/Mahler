'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Search, Building2 } from 'lucide-react';
import { getContacts } from '@/lib/data';
import type { Contact } from '@/types';

const STATUSES: Contact['status'][] = ['cold', 'contacted', 'meeting-scheduled', 'confirmed', 'declined'];

export default function ContactenPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [overrides, setOverrides] = useState<Record<string, Partial<Contact>>>({});

  useEffect(() => {
    getContacts().then(setContacts);
    if (typeof window !== 'undefined') {
      setOverrides(JSON.parse(localStorage.getItem('mahler.contactOverrides') || '{}'));
    }
  }, []);

  const merged = contacts.map((c) => ({ ...c, ...overrides[c.id] }));
  const filtered = merged.filter((c) =>
    [c.name, c.organization, c.city, c.role].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const updateContact = (id: string, patch: Partial<Contact>) => {
    const next = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    setOverrides(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahler.contactOverrides', JSON.stringify(next));
    }
  };

  const statusVariant = (s: Contact['status']) =>
    s === 'confirmed' ? 'success' : s === 'declined' ? 'muted' : s === 'meeting-scheduled' ? 'accent' : 'warning';

  const statusLabel = (s: Contact['status']) =>
    ({ cold: 'Cold', contacted: 'Gecontacteerd', 'meeting-scheduled': 'Afspraak gepland', confirmed: 'Bevestigd', declined: 'Afgewezen' }[s]);

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Contacten</h1>
        <p className="mt-1 text-sm text-muted-foreground">Archieven, conservators, hoteldirecteuren, festivalcoördinators.</p>
      </header>

      <div className="mb-5 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Zoeken op naam, organisatie of stad…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="border-primary/10">
            <CardContent className="p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.role}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.organization}</span>
                    <span>·</span>
                    <span>{c.city}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    {c.email && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-accent hover:underline"><Mail className="h-3 w-3" /> {c.email}</a>}
                    {c.phone && <span className="inline-flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone}</span>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select
                    value={c.status}
                    onValueChange={(v: Contact['status']) => updateContact(c.id, { status: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Badge variant={statusVariant(c.status)} className="self-start">
                  {statusLabel(c.status)}
                </Badge>
              </div>

              <div className="mt-3">
                <label className="text-xs font-medium text-muted-foreground">Notities</label>
                <Textarea
                  rows={2}
                  defaultValue={c.notes || ''}
                  onBlur={(e) => updateContact(c.id, { notes: e.target.value })}
                  className="mt-1 text-sm"
                  placeholder="Inline notities…"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
