'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { EncyclopediaLocation } from '@/types';
import { MahlerMap } from '@/components/layout/map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, MapPin } from 'lucide-react';

type Category = { id: string; labelNL: string; labelEN: string };

export function EncyclopedieClient({
  locations,
  categories,
  locale,
}: {
  locations: EncyclopediaLocation[];
  categories: Category[];
  locale: string;
}) {
  const t = useTranslations('encyclopedie');
  const isEn = locale === 'en';
  const [active, setActive] = useState<string>('all');

  const filtered = useMemo(
    () => (active === 'all' ? locations : locations.filter((l) => l.category === active)),
    [locations, active]
  );

  // Build timeline data: extract first year from mahlerPeriod for sorting
  const timelineLocs = [...locations]
    .map((l) => ({
      ...l,
      startYear: parseInt(l.mahlerPeriod.match(/\d{4}/)?.[0] || '1860', 10),
    }))
    .sort((a, b) => a.startYear - b.startYear);

  const pins = locations.map((l) => ({
    id: l.id,
    coordinates: l.coordinates,
    title: l.name,
    subtitle: l.mahlerPeriod,
    href: `/encyclopedie/${l.slug}`,
    color: l.isFullContent ? '#B8860B' : '#82B19A',
  }));

  return (
    <>
      {/* Timeline */}
      <section className="py-10 md:py-14">
        <div className="container-wide">
          <h2 className="mb-4 font-display text-2xl font-bold text-primary">{t('timeline')}</h2>
          <p className="mb-5 text-sm text-muted-foreground">1860 — 1911</p>
          <div className="overflow-x-auto pb-3">
            <div className="relative flex min-w-max items-start gap-3 pt-12">
              <div className="absolute left-0 right-0 top-[58px] h-0.5 bg-primary/20" />
              {timelineLocs.map((l) => (
                <Link
                  key={l.id}
                  href={`/encyclopedie/${l.slug}`}
                  className="group relative flex min-w-[140px] max-w-[170px] flex-col items-center text-center"
                >
                  <span className="absolute -top-6 text-xs font-semibold text-accent">{l.startYear}</span>
                  <span
                    className={`relative z-10 mb-3 h-3.5 w-3.5 rounded-full border-2 border-cream transition-transform group-hover:scale-125 ${
                      l.isFullContent ? 'bg-accent' : 'bg-primary-300'
                    }`}
                  />
                  <span className="text-sm font-display font-medium text-primary group-hover:text-accent">
                    {l.name}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{l.mahlerPeriod}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-y border-primary/10 bg-cream-200/40 py-10 md:py-14">
        <div className="container-wide">
          <h2 className="mb-4 font-display text-2xl font-bold text-primary">{t('map')}</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            <span className="mr-3 inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> {isEn ? 'Full content' : 'Volledige content'}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-300" /> {isEn ? 'Stub — expanding' : 'Stub — wordt uitgebreid'}</span>
          </p>
          <MahlerMap pins={pins} height="500px" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          <h2 className="mb-4 font-display text-2xl font-bold text-primary">{t('categories')}</h2>

          <Tabs value={active} onValueChange={setActive} className="mb-8">
            <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-full border border-primary/20 bg-cream data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t('categories')} ({locations.length})
              </TabsTrigger>
              {categories.map((c) => {
                const count = locations.filter((l) => l.category === c.id).length;
                if (count === 0) return null;
                return (
                  <TabsTrigger
                    key={c.id}
                    value={c.id}
                    className="rounded-full border border-primary/20 bg-cream data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {isEn ? c.labelEN : c.labelNL} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <Link key={l.id} href={`/encyclopedie/${l.slug}`} className="group">
                <Card className="h-full border-primary/10 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant={l.isFullContent ? 'accent' : 'muted'}>
                        {l.isFullContent ? (isEn ? 'Full' : 'Volledig') : t('comingSoon')}
                      </Badge>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {l.country}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary group-hover:text-accent">
                      {l.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-accent">{l.mahlerPeriod}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {isEn ? l.shortDesc.en : l.shortDesc.nl}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      {isEn ? 'Read more' : 'Lees meer'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
