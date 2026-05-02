'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { JournalEntry } from '@/types';
import { MahlerMap } from '@/components/layout/map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, ArrowRight, Filter } from 'lucide-react';

export function DagboekClient({ entries, locale }: { entries: JournalEntry[]; locale: string }) {
  const t = useTranslations('dagboek');
  const isEn = locale === 'en';

  const [country, setCountry] = useState<string>('all');
  const [type, setType] = useState<string>('all');
  const [month, setMonth] = useState<string>('all');

  const countries = useMemo(() => Array.from(new Set(entries.map((e) => e.country))), [entries]);
  const types = ['observation', 'archive', 'concert', 'meeting', 'travel'];
  const months = useMemo(
    () => Array.from(new Set(entries.map((e) => new Date(e.date).toISOString().slice(0, 7)))).sort(),
    [entries]
  );

  const filtered = entries.filter((e) => {
    if (country !== 'all' && e.country !== country) return false;
    if (type !== 'all' && e.type !== type) return false;
    if (month !== 'all' && new Date(e.date).toISOString().slice(0, 7) !== month) return false;
    return true;
  });

  const pins = filtered.map((e) => ({
    id: e.id,
    coordinates: e.coordinates,
    title: e.location,
    subtitle: new Date(e.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL'),
    href: `/dagboek/${e.slug}`,
  }));

  const typeLabel = (s: string) =>
    isEn
      ? { observation: 'Observation', archive: 'Archive', concert: 'Concert', meeting: 'Meeting', travel: 'Travel' }[s] || s
      : { observation: 'Observatie', archive: 'Archief', concert: 'Concert', meeting: 'Ontmoeting', travel: 'Reis' }[s] || s;

  return (
    <section className="py-12 md:py-16">
      <div className="container-wide grid gap-8 lg:grid-cols-5">
        {/* Map (left) */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <MahlerMap pins={pins} height="600px" />
          </div>
        </div>

        {/* Feed (right) */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="mb-6 rounded-md border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Filter className="h-4 w-4 text-accent" /> {t('filters')}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder={t('country')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')} — {t('country')}</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger><SelectValue placeholder={t('month')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')} — {t('month')}</SelectItem>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {new Date(m + '-01').toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { month: 'long', year: 'numeric' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder={t('type')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')} — {t('type')}</SelectItem>
                  {types.map((tp) => (
                    <SelectItem key={tp} value={tp}>{typeLabel(tp)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entries */}
          <div className="space-y-5">
            {filtered.length === 0 && (
              <p className="rounded-md border bg-card p-6 text-center text-sm text-muted-foreground">
                {isEn ? 'No entries match these filters.' : 'Geen entries gevonden voor deze filters.'}
              </p>
            )}
            {filtered.map((e) => (
              <Card key={e.id} className="overflow-hidden border-primary/10 transition-shadow hover:shadow-md">
                <Link href={`/dagboek/${e.slug}`} className="grid gap-0 sm:grid-cols-[200px_1fr]">
                  <div className="aspect-[4/3] sm:aspect-auto bg-muted">
                    <img src={e.coverImage} alt="" className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="flex flex-col justify-between p-5">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                        <Badge variant="muted" className="font-normal">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(e.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          <MapPin className="mr-1 h-3 w-3" />
                          {e.location}
                        </Badge>
                        <Badge variant="accent" className="font-normal">{typeLabel(e.type)}</Badge>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-primary group-hover:text-accent">
                        {isEn ? e.title.en : e.title.nl}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {isEn ? e.excerpt.en : e.excerpt.nl}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {t('by')} {e.author}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                        {t('readMore')} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
