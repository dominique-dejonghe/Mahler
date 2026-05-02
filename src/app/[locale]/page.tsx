import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/layout/fade-in';
import { NewsletterForm } from '@/components/home/newsletter-form';
import { ArrowRight, BookOpen, Map, Music, Compass, Quote } from 'lucide-react';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const features = [
    { key: 'reis', icon: Compass, href: '/reis' },
    { key: 'dagboek', icon: BookOpen, href: '/dagboek' },
    { key: 'encyclopedie', icon: Map, href: '/encyclopedie' },
    { key: 'concerten', icon: Music, href: '/concerten' },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream to-cream-200">
        <div className="absolute inset-0 -z-10 opacity-[0.04]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <pattern id="staff" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 8 H40 M0 14 H40 M0 20 H40 M0 26 H40 M0 32 H40" stroke="#2C5F4D" strokeWidth="0.3" fill="none" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#staff)" />
          </svg>
        </div>

        <div className="container-wide grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:py-32">
          <FadeIn className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t('heroTagline')}
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-primary text-balance md:text-6xl lg:text-7xl">
              {t('heroTitle')}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-primary/80 md:text-xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" variant="accent">
                <Link href="/reis">
                  {t('ctaJoin')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/encyclopedie">{t('ctaExplore')}</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={150} className="relative">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-md shadow-2xl ring-1 ring-primary/10">
              {/* Mahler portrait — Wikimedia Commons */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Gustav-Mahler-Kohut.jpg/800px-Gustav-Mahler-Kohut.jpg"
                alt="Gustav Mahler, ca. 1907"
                className="h-full w-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded bg-cream/90 px-3 py-2 text-xs text-primary backdrop-blur">
                <strong className="font-display">Gustav Mahler</strong> — 1860 · 1911
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Four feature columns */}
      <section className="border-t border-primary/10 py-20 md:py-28">
        <div className="container-wide">
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary md:text-4xl">
              {t('featuresTitle')}
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-accent" />
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ key, icon: Icon, href }, i) => (
              <FadeIn key={key} delay={i * 100}>
                <Link
                  href={href}
                  className="group block h-full rounded-md border border-primary/10 bg-card p-7 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <Icon className="mb-5 h-8 w-8 text-accent" strokeWidth={1.5} />
                  <h3 className="mb-2 font-display text-xl font-semibold text-primary">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {t(`features.${key}.desc`)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                    {tNav(key)} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="bg-primary py-24 text-primary-foreground md:py-32">
        <div className="container-prose text-center">
          <FadeIn>
            <Quote className="mx-auto h-10 w-10 text-accent" strokeWidth={1.2} />
            <blockquote className="mt-6 font-display text-3xl font-medium italic leading-snug text-balance md:text-4xl lg:text-5xl">
              «&nbsp;{t('quote')}&nbsp;»
            </blockquote>
            <cite className="mt-6 block font-serif text-sm not-italic uppercase tracking-[0.25em] text-accent">
              — {t('quoteAttribution')}
            </cite>
          </FadeIn>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-28">
        <div className="container-prose text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary md:text-4xl">
              {t('newsletterTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              {t('newsletterDesc')}
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <NewsletterForm />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
