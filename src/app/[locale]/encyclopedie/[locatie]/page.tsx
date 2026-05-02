import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getEncyclopedia, getEncyclopediaBySlug, getEncyclopediaNeighbors } from '@/lib/data';
import { FadeIn } from '@/components/layout/fade-in';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Music, FileText, BookOpen, ExternalLink } from 'lucide-react';

// Render on-demand to keep the build's SSG phase fast (16 stops × 2 locales = 32 pages).
// All data is in-memory mock data, so the runtime cost is negligible.
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const locs = await getEncyclopedia();
  return locs.map((l) => ({ locatie: l.slug }));
}

export default async function LocatieDetailPage({
  params,
}: {
  params: { locale: string; locatie: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('encyclopedie');
  const isEn = params.locale === 'en';
  const loc = await getEncyclopediaBySlug(params.locatie);
  if (!loc) notFound();

  const { prev, next } = await getEncyclopediaNeighbors(params.locatie);

  return (
    <article className="pb-16">
      {/* Hero */}
      {loc.hero ? (
        <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
          <img src={loc.hero.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="container-wide relative flex h-full flex-col justify-end pb-10 text-primary-foreground">
            <FadeIn>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  <MapPin className="mr-1 h-3 w-3" /> {loc.country}
                </Badge>
                <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
                  <Calendar className="mr-1 h-3 w-3" /> {loc.mahlerPeriod}
                </Badge>
                <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
                  <Clock className="mr-1 h-3 w-3" /> {isEn ? loc.durationLabel.en : loc.durationLabel.nl}
                </Badge>
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">{loc.name}</h1>
              <p className="mt-3 max-w-2xl text-base text-primary-foreground/90 italic">
                {isEn ? loc.hero.caption.en : loc.hero.caption.nl}
              </p>
            </FadeIn>
          </div>
        </div>
      ) : (
        <div className="bg-primary py-16 text-primary-foreground">
          <div className="container-wide">
            <FadeIn>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="accent">{loc.country}</Badge>
                <Badge variant="outline" className="border-white/40 bg-white/10 text-white">{loc.mahlerPeriod}</Badge>
              </div>
              <h1 className="font-display text-4xl font-bold md:text-5xl">{loc.name}</h1>
            </FadeIn>
          </div>
        </div>
      )}

      <div className="container-prose mt-10">
        <Link href="/encyclopedie" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> {isEn ? 'Back to encyclopedia' : 'Terug naar encyclopedie'}
        </Link>

        {!loc.isFullContent && (
          <div className="mt-8 rounded-md border-2 border-dashed border-accent/40 bg-accent/5 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-primary">{t('comingSoon')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isEn ? loc.shortDesc.en : loc.shortDesc.nl}
            </p>
          </div>
        )}

        {/* Chronology */}
        {loc.chronology && (
          <section className="mt-10">
            <FadeIn>
              <div className="prose prose-lg max-w-none font-serif leading-relaxed text-primary/85">
                {(isEn ? loc.chronology.en : loc.chronology.nl).map((p, i) => (
                  <p key={i} className="mb-5 first:first-letter:font-display first:first-letter:text-5xl first:first-letter:font-bold first:first-letter:text-accent first:first-letter:float-left first:first-letter:mr-2 first:first-letter:leading-none first:first-letter:mt-1">
                    {p}
                  </p>
                ))}
              </div>
            </FadeIn>
          </section>
        )}
      </div>

      {/* Works + Manuscripts grid */}
      {loc.isFullContent && (loc.works || loc.manuscripts) && (
        <section className="mt-12 bg-cream-200/50 py-14">
          <div className="container-wide grid gap-8 md:grid-cols-2">
            {loc.works && (
              <FadeIn>
                <div className="mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-2xl font-bold text-primary">{t('works')}</h2>
                </div>
                <ul className="space-y-2.5">
                  {loc.works.map((w, i) => (
                    <li key={i} className="rounded-md border bg-card p-4 text-sm">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-primary">{w.title}</span>
                        {w.year && <span className="text-xs text-accent">{w.year}</span>}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                        {w.type === 'composed' ? (isEn ? 'composed' : 'gecomponeerd')
                          : w.type === 'conducted' ? (isEn ? 'conducted' : 'gedirigeerd')
                          : (isEn ? 'premiered' : 'première')}
                      </div>
                      {w.note && (
                        <p className="mt-1.5 text-xs italic text-muted-foreground">
                          {isEn ? w.note.en : w.note.nl}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}

            {loc.manuscripts && (
              <FadeIn delay={100}>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-2xl font-bold text-primary">{t('manuscripts')}</h2>
                </div>
                <ul className="space-y-2.5">
                  {loc.manuscripts.map((m, i) => (
                    <li key={i} className="rounded-md border bg-card p-4 text-sm">
                      <div className="font-medium text-primary">{m.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{m.archive}</div>
                      {m.archiveUrl && (
                        <a
                          href={m.archiveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          {isEn ? 'Visit archive' : 'Bezoek archief'} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {m.note && (
                        <p className="mt-1.5 text-xs italic text-muted-foreground">
                          {isEn ? m.note.en : m.note.nl}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* Bibliography */}
      {loc.bibliography && loc.bibliography.length > 0 && (
        <section className="container-prose mt-14">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl font-bold text-primary">{t('bibliography')}</h2>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-primary/80">
            {loc.bibliography.map((b, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-3">
                <strong>{b.author}</strong>, <em>{b.title}</em>{b.publisher ? `, ${b.publisher}` : ''}, {b.year}.
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prev/Next */}
      <section className="container-wide mt-16">
        <div className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link href={`/encyclopedie/${prev.slug}`}>
              <Card className="h-full border-primary/10 transition-colors hover:border-accent/40">
                <CardContent className="p-5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> {t('previous')}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-primary">{prev.name}</h3>
                  <p className="text-xs text-accent">{prev.mahlerPeriod}</p>
                </CardContent>
              </Card>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/encyclopedie/${next.slug}`}>
              <Card className="h-full border-primary/10 transition-colors hover:border-accent/40">
                <CardContent className="p-5 text-right">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                    {t('next')} <ArrowRight className="h-3 w-3" />
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-primary">{next.name}</h3>
                  <p className="text-xs text-accent">{next.mahlerPeriod}</p>
                </CardContent>
              </Card>
            </Link>
          ) : <div />}
        </div>
      </section>
    </article>
  );
}
