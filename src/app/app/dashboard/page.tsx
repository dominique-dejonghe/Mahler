'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPinned, Users, CheckSquare, Mic, Plus, ArrowRight, Calendar } from 'lucide-react';
import { getDashboardStats, getActivityFeed, getStops } from '@/lib/data';
import type { DashboardStats, ActivityEvent, ProspectionStop } from '@/types';
import { daysUntil, formatDateNL } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [nextStop, setNextStop] = useState<ProspectionStop | null>(null);

  useEffect(() => {
    Promise.all([getDashboardStats(), getActivityFeed(), getStops()]).then(([s, a, st]) => {
      setStats(s);
      setActivity(a);
      const upcoming = st.find((stop) => new Date(stop.arrivalDate) >= new Date('2026-01-01'));
      setNextStop(upcoming || st[0]);
    });
  }, []);

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welkom terug — overzicht van de prospectiereis 2026.</p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={MapPinned} label="Locaties" value={stats ? `${stats.completedStops}/${stats.totalStops}` : '…'} sub="bezocht" />
        <KpiCard icon={Users} label="Contacten bevestigd" value={stats ? `${stats.contactsConfirmed}/${stats.totalContacts}` : '…'} sub="status confirmed" />
        <KpiCard icon={Mic} label="Audio-opnames" value={stats ? `${stats.audioRecordings}` : '…'} sub="bestanden" />
        <KpiCard icon={CheckSquare} label="Checklist" value={stats ? `${stats.checklistDone}/${stats.checklistTotal}` : '…'} sub="afgevinkt" />
      </div>

      {/* Progress + Next stop */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-primary/10">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold text-primary">Voortgang prospectiereis</h2>
            {stats && (
              <>
                <div className="mt-4 space-y-3">
                  <ProgressRow label="Locaties bezocht" value={(stats.completedStops / stats.totalStops) * 100} />
                  <ProgressRow label="Checklist afgewerkt" value={(stats.checklistDone / stats.checklistTotal) * 100} />
                  <ProgressRow label="Contacten bevestigd" value={(stats.contactsConfirmed / stats.totalContacts) * 100} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-cream">
          <CardContent className="p-6">
            <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Calendar className="h-3.5 w-3.5" /> Volgende halte
            </div>
            {nextStop ? (
              <>
                <h3 className="font-display text-2xl font-bold text-primary">{nextStop.name}</h3>
                <p className="text-sm text-muted-foreground">{nextStop.country}</p>
                <p className="mt-3 text-sm text-primary/80">{nextStop.shortDesc.nl}</p>
                <div className="mt-5 rounded-md bg-primary p-4 text-center text-primary-foreground">
                  <div className="font-display text-3xl font-bold">{Math.max(daysUntil(nextStop.arrivalDate), 0)}</div>
                  <div className="text-xs uppercase tracking-wider">dagen tot aankomst</div>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">{formatDateNL(nextStop.arrivalDate)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">…</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity + Quick actions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-primary/10">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold text-primary">Recente activiteit</h2>
            <ul className="mt-4 space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 border-l-2 border-accent/40 pl-3">
                  <div className="flex-1">
                    <p className="text-sm text-primary">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(a.timestamp).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' })} · {a.actor}
                    </p>
                  </div>
                  <Badge variant="muted" className="capitalize">{a.type}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold text-primary">Snelle acties</h2>
            <div className="mt-4 space-y-2">
              <Button asChild variant="accent" className="w-full justify-start">
                <Link href="/app/locaties">
                  <Plus className="h-4 w-4" /> Nieuwe entry
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/app/contacten">
                  <Users className="h-4 w-4" /> Contact toevoegen
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/app/audio">
                  <Mic className="h-4 w-4" /> Audio uploaden
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/app/checklist">
                  <CheckSquare className="h-4 w-4" /> Checklist
                  <ArrowRight className="ml-auto h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="border-primary/10">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="rounded-md bg-accent/10 p-2 text-accent">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="font-display text-3xl font-bold text-primary">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-primary/80">{label}</span>
        <span className="font-medium text-primary">{Math.round(value)}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
