'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Plus, Mail, Phone, X } from 'lucide-react';
import { getStopById, getContacts, getChecklist, getPrivateJournal } from '@/lib/data';
import type { ProspectionStop, Contact, ChecklistItem, PrivateJournalEntry } from '@/types';
import { formatDateNL } from '@/lib/utils';

export default function LocatieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);
  const [stop, setStop] = useState<ProspectionStop | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [entries, setEntries] = useState<PrivateJournalEntry[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [localEntries, setLocalEntries] = useState<PrivateJournalEntry[]>([]);

  useEffect(() => {
    Promise.all([getStopById(id), getContacts(), getChecklist(), getPrivateJournal()]).then(
      ([s, c, ch, e]) => {
        setStop(s || null);
        setContacts(c.filter((x) => x.linkedStopId === id));
        setChecklist(ch);
        setEntries(e.filter((x) => x.stopId === id));
      }
    );
    // Local-storage entries
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(localStorage.getItem('mahler.entries') || '[]') as PrivateJournalEntry[];
      setLocalEntries(raw.filter((x) => x.stopId === id));
    }
  }, [id]);

  const handleAddEntry = (data: { title: string; body: string }) => {
    const newEntry: PrivateJournalEntry = {
      id: `local-${Date.now()}`,
      stopId: id,
      date: new Date().toISOString().slice(0, 10),
      title: data.title,
      body: data.body,
      authorEmail: 'demo@local',
    };
    if (typeof window !== 'undefined') {
      const all = JSON.parse(localStorage.getItem('mahler.entries') || '[]');
      all.push(newEntry);
      localStorage.setItem('mahler.entries', JSON.stringify(all));
    }
    setLocalEntries([newEntry, ...localEntries]);
    setShowEntryModal(false);
  };

  if (!stop) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Laden…</p>
      </AppShell>
    );
  }

  const allEntries = [...localEntries, ...entries];

  return (
    <AppShell>
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Terug naar locaties
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-lg font-bold">
              {stop.order}
            </span>
            <h1 className="font-display text-3xl font-bold text-primary">{stop.name}</h1>
            <Badge variant={stop.status === 'completed' ? 'success' : 'muted'}>
              {stop.status === 'completed' ? 'Bezocht' : 'Gepland'}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {stop.country}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDateNL(stop.arrivalDate)}</span>
            <span className="text-accent">{stop.mahlerPeriod}</span>
          </div>
        </div>
        <Button variant="accent" onClick={() => setShowEntryModal(true)}>
          <Plus className="h-4 w-4" /> Nieuwe entry
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="entries">Entries ({allEntries.length})</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="contacts">Contacten ({contacts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card><CardContent className="p-6">
            <h3 className="font-display text-lg font-semibold text-primary">Beschrijving</h3>
            <p className="mt-2 leading-relaxed text-primary/85">{stop.shortDesc.nl}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Field label="Aankomst" value={formatDateNL(stop.arrivalDate)} />
              <Field label="Vertrek" value={formatDateNL(stop.departureDate)} />
              <Field label="Coördinaten" value={`${stop.coordinates[1].toFixed(4)}, ${stop.coordinates[0].toFixed(4)}`} />
              <Field label="Mahler-periode" value={stop.mahlerPeriod} />
              <Field label="Volgorde" value={`Halte #${stop.order} van 11`} />
              <Field label="Status" value={stop.status} />
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="entries">
          <div className="space-y-3">
            {allEntries.length === 0 && (
              <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">
                Geen entries voor deze locatie. Voeg er een toe via &quot;Nieuwe entry&quot;.
              </CardContent></Card>
            )}
            {allEntries.map((e) => (
              <Card key={e.id}><CardContent className="p-5">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-display text-lg font-semibold text-primary">{e.title}</h4>
                  <span className="text-xs text-muted-foreground">{formatDateNL(e.date)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-primary/80">{e.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">{e.authorEmail}</p>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <Card><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              {checklist.filter((c) => c.done).length} / {checklist.length} items afgevinkt over alle locaties.
            </p>
            <Link href="/app/checklist" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              → Volledige checklist
            </Link>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="space-y-3">
            {contacts.length === 0 && (
              <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">
                Geen contacten gekoppeld aan deze locatie.
              </CardContent></Card>
            )}
            {contacts.map((c) => (
              <Card key={c.id}><CardContent className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base font-semibold text-primary">{c.name}</h4>
                    <p className="text-sm text-muted-foreground">{c.role} · {c.organization}</p>
                  </div>
                  <Badge variant={c.status === 'confirmed' ? 'success' : c.status === 'declined' ? 'muted' : 'warning'}>
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {c.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>}
                  {c.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>}
                </div>
                {c.notes && <p className="mt-2 text-xs italic text-primary/70">{c.notes}</p>}
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Entry modal */}
      {showEntryModal && (
        <EntryModal onClose={() => setShowEntryModal(false)} onSave={handleAddEntry} stopName={stop.name} />
      )}
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-cream-100/40 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-primary">{value}</div>
    </div>
  );
}

function EntryModal({ onClose, onSave, stopName }: { onClose: () => void; onSave: (d: { title: string; body: string }) => void; stopName: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-md bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">Nieuwe entry</h3>
            <p className="text-xs text-muted-foreground">{stopName}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="t-title">Titel</Label>
            <Input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="t-body">Inhoud</Label>
            <Textarea id="t-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Annuleer</Button>
          <Button variant="accent" onClick={() => title && body && onSave({ title, body })} disabled={!title || !body}>
            Opslaan
          </Button>
        </div>
      </div>
    </div>
  );
}
