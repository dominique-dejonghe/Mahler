import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getDayProgram, getPricingTiers, getTourIncluded, getDepartureDates, getFAQ, getStops } from '@/lib/data';
import { FadeIn } from '@/components/layout/fade-in';
import { MahlerMap } from '@/components/layout/map';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Calendar, MapPin, Star } from 'lucide-react';
import { ReisSignupForm } from './_signup-form';

export default async function ReisPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('reis');
  const isEn = locale === 'en';

  const [program, tiers, included, departures, faq, stops] = await Promise.all([
    getDayProgram(),
    getPricingTiers(),
    getTourIncluded(),
    getDepartureDates(),
    getFAQ(),
    getStops(),
  ]);

  const mapPins = stops.map((s) => ({
    id: s.id,
    coordinates: s.coordinates,
    title: s.name,
    subtitle: s.mahlerPeriod,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground md:py-28">
        <div className="container-wide">
          <FadeIn className="max-w-3xl">
            <Badge variant="accent" className="mb-4">2027</Badge>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">{t('title')}</h1>
            <p className="mt-4 text-xl text-primary-foreground/90">{t('subtitle')}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
              {t('intro')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Map + departures */}
      <section className="py-16 md:py-20">
        <div className="container-wide grid gap-10 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <h2 className="mb-4 font-display text-2xl font-bold text-primary">
              {isEn ? 'Route' : 'Route'}
            </h2>
            <MahlerMap pins={mapPins} height="450px" />
          </FadeIn>
          <FadeIn delay={150}>
            <h2 className="mb-4 font-display text-2xl font-bold text-primary">{t('departuresTitle')}</h2>
            <div className="space-y-4">
              {departures.map((d) => (
                <Card key={d.date} className="border-accent/20">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded bg-accent/10 p-3 text-accent">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold text-primary">
                        {isEn ? d.label.en : d.label.nl}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(d.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'long' })} —{' '}
                        {new Date(d.endDate).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Day program */}
      <section className="bg-cream-200/50 py-16 md:py-20">
        <div className="container-wide">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('programTitle')}</h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-accent" />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {program.map((d, i) => (
              <FadeIn key={d.day} delay={i * 50}>
                <Card className="h-full border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-3xl font-bold text-accent">
                        {isEn ? d.date.en : d.date.nl}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {d.location}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                      {isEn ? d.title.en : d.title.nl}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {isEn ? d.description.en : d.description.nl}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {(isEn ? d.highlights.en : d.highlights.nl).map((h) => (
                        <li key={h} className="flex items-center gap-2 text-primary/80">
                          <Star className="h-3 w-3 fill-accent text-accent" /> {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="py-16 md:py-20">
        <div className="container-wide">
          <FadeIn className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-primary">{t('includedTitle')}</h2>
            <div className="mt-3 h-0.5 w-16 bg-accent" />
          </FadeIn>
          <ul className="grid gap-3 md:grid-cols-2">
            {(isEn ? included.en : included.nl).map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-primary/85">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-cream-200/50 py-16 md:py-20">
        <div className="container-wide">
          <FadeIn className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('pricingTitle')}</h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-accent" />
          </FadeIn>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {tiers.map((tier, i) => (
              <FadeIn key={tier.id} delay={i * 100}>
                <Card
                  className={`h-full transition-all ${
                    tier.highlighted
                      ? 'border-accent shadow-lg ring-2 ring-accent/30 md:scale-[1.04]'
                      : 'border-primary/10'
                  }`}
                >
                  <CardContent className="p-7">
                    {tier.highlighted && (
                      <Badge variant="accent" className="mb-3">
                        {isEn ? 'Most popular' : 'Meest gekozen'}
                      </Badge>
                    )}
                    <h3 className="font-display text-2xl font-bold text-primary">
                      {tier.id === 'standaard' ? t('standard') : tier.id === 'comfort' ? t('comfort') : t('premium')}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-primary">€{tier.price.toLocaleString(isEn ? 'en-GB' : 'nl-NL')}</span>
                      <span className="text-sm text-muted-foreground">/ {t('perPerson')}</span>
                    </div>
                    <ul className="mt-6 space-y-2">
                      {(isEn ? tier.features.en : tier.features.nl).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-primary/85">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={tier.highlighted ? 'accent' : 'outline'}
                      className="mt-7 w-full"
                    >
                      <a href="#signup">{isEn ? 'Choose' : 'Kies dit pakket'}</a>
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="py-16 md:py-20">
        <div className="container-prose">
          <FadeIn className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('signupTitle')}</h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-accent" />
          </FadeIn>
          <ReisSignupForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-200/50 py-16 md:py-20">
        <div className="container-prose">
          <FadeIn className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('faqTitle')}</h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-accent" />
          </FadeIn>
          <Accordion type="single" collapsible className="rounded-md border bg-card px-4">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left text-primary">
                  {isEn ? item.q.en : item.q.nl}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {isEn ? item.a.en : item.a.nl}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
