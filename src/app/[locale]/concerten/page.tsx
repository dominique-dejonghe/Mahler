import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getConcerts } from '@/lib/data';
import { FadeIn } from '@/components/layout/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Music, ExternalLink, Star } from 'lucide-react';

export default async function ConcertenPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('concerten');
  const isEn = locale === 'en';
  const concerts = await getConcerts();

  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container-wide">
          <FadeIn className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
            <p className="mt-3 text-lg text-primary-foreground/90">{t('subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-wide">
          <div className="space-y-6">
            {concerts.map((c, i) => (
              <FadeIn key={c.id} delay={i * 75}>
                <Card
                  className={`overflow-hidden border-primary/10 ${
                    c.isTomDevaere ? 'ring-2 ring-accent/40' : ''
                  }`}
                >
                  <CardContent className="grid gap-6 p-6 md:grid-cols-[160px_1fr_auto] md:items-center">
                    {/* Date block */}
                    <div className="flex flex-col items-center justify-center rounded-md bg-primary px-4 py-5 text-primary-foreground">
                      <span className="font-display text-3xl font-bold leading-none">
                        {new Date(c.date).getDate()}
                      </span>
                      <span className="mt-1 text-xs uppercase tracking-wider">
                        {new Date(c.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { month: 'short' })}
                      </span>
                      <span className="mt-1 text-xs">{new Date(c.date).getFullYear()}</span>
                      {c.endDate && (
                        <span className="mt-2 text-[10px] text-accent">
                          → {new Date(c.endDate).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {c.isTomDevaere && (
                          <Badge variant="accent">
                            <Star className="mr-1 h-3 w-3 fill-current" /> Tom Devaere
                          </Badge>
                        )}
                        {c.composer && (
                          <Badge variant="outline">
                            <Music className="mr-1 h-3 w-3" /> {c.composer}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-primary md:text-2xl">{c.title}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {c.venue}, {c.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(c.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-primary/80">{c.programme}</p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        <strong>{isEn ? 'Performers' : 'Uitvoerders'}:</strong> {c.performers.join(' · ')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:items-end">
                      {c.ticketsUrl && (
                        <Button asChild variant="accent" size="sm">
                          <a href={c.ticketsUrl} target="_blank" rel="noopener noreferrer">
                            {t('tickets')} <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {c.infoUrl && (
                        <Button asChild variant="outline" size="sm">
                          <a href={c.infoUrl} target="_blank" rel="noopener noreferrer">
                            {t('moreInfo')} <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
