'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { getStops } from '@/lib/data';
import type { ProspectionStop } from '@/types';
import { formatDateNL } from '@/lib/utils';

export default function LocatiesPage() {
  const [stops, setStops] = useState<ProspectionStop[]>([]);

  useEffect(() => {
    getStops().then(setStops);
  }, []);

  const statusVariant = (s: ProspectionStop['status']) =>
    s === 'completed' ? 'success' : s === 'in-progress' ? 'warning' : 'muted';

  const statusLabel = (s: ProspectionStop['status']) =>
    s === 'completed' ? 'Bezocht' : s === 'in-progress' ? 'Bezig' : 'Gepland';

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Locaties</h1>
        <p className="mt-1 text-sm text-muted-foreground">Elf prospectiestops · 21–30 augustus 2026</p>
      </header>

      <div className="space-y-3">
        {stops.map((s) => (
          <Link key={s.id} href={`/app/locaties/${s.id}`} className="block">
            <Card className="border-primary/10 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
              <CardContent className="grid gap-4 p-5 md:grid-cols-[60px_1fr_auto] md:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="font-display text-xl font-bold">{s.order}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-primary">{s.name}</h3>
                    <Badge variant={statusVariant(s.status)}>{statusLabel(s.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.shortDesc.nl}</p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.country}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDateNL(s.arrivalDate)}
                      {s.arrivalDate !== s.departureDate && ` → ${formatDateNL(s.departureDate)}`}
                    </span>
                    <span className="text-accent">{s.mahlerPeriod}</span>
                  </div>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-accent md:block" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
