import type { Locale } from '../lib/data';
import { messages, localePath } from '../lib/i18n';
import { Layout } from '../components/layout';
import { Button, Card, Section } from '../components/ui';

export function HomePage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const features: { key: 'reis' | 'dagboek' | 'encyclopedie' | 'concerten'; href: string; icon: string }[] = [
    { key: 'reis', href: '/reis', icon: 'fa-bus' },
    { key: 'dagboek', href: '/dagboek', icon: 'fa-book-open' },
    { key: 'encyclopedie', href: '/encyclopedie', icon: 'fa-landmark' },
    { key: 'concerten', href: '/concerten', icon: 'fa-music' },
  ];

  return (
    <Layout
      locale={locale}
      pathname="/"
      title="Mahler Reise — In de voetsporen van Gustav Mahler"
      ogImage="/static/images/mahler-portrait.jpg"
    >
      {/* Hero */}
      <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-cream-100">
        <div class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]"></div>
        <div class="container mx-auto px-4 py-20 md:py-28 relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span class="inline-block uppercase tracking-[0.25em] text-accent text-xs mb-4">
              {t.home.heroTagline}
            </span>
            <h1 class="font-display text-4xl md:text-6xl font-bold leading-tight">
              {t.home.heroTitle}
            </h1>
            <p class="mt-6 text-lg text-cream-100/90 max-w-xl leading-relaxed">
              {t.home.heroSubtitle}
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <Button href={localePath(locale, '/reis')} variant="accent">
                <i class="fas fa-bus"></i> {t.home.ctaJoin}
              </Button>
              <Button href={localePath(locale, '/encyclopedie')} variant="outline" class="border-cream-100/40 text-cream-100 hover:bg-cream-100/10">
                <i class="fas fa-compass"></i> {t.home.ctaExplore}
              </Button>
            </div>
          </div>
          <div class="hidden md:flex justify-center">
            <div class="relative">
              <div class="absolute -inset-4 rounded-full bg-accent/20 blur-2xl"></div>
              <img
                src="/static/images/mahler-portrait.jpg"
                alt="Gustav Mahler"
                width="320"
                height="427"
                class="relative rounded-md shadow-2xl ring-4 ring-accent/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section title={t.home.featuresTitle}>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card class="p-6 group">
              <div class="h-12 w-12 rounded-md bg-primary-50 text-primary flex items-center justify-center mb-4">
                <i class={`fas ${f.icon} text-xl`}></i>
              </div>
              <h3 class="font-display text-xl font-semibold text-primary-700 mb-2">
                {t.home.features[f.key].title}
              </h3>
              <p class="text-sm text-primary-700/70 leading-relaxed">
                {t.home.features[f.key].desc}
              </p>
              <a
                href={localePath(locale, f.href)}
                class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-accent"
              >
                {locale === 'nl' ? 'Ontdek' : 'Discover'} <i class="fas fa-arrow-right"></i>
              </a>
            </Card>
          ))}
        </div>
      </Section>

      {/* Quote */}
      <section class="bg-cream-200 py-16">
        <div class="container mx-auto px-4 max-w-3xl text-center">
          <i class="fas fa-quote-left text-4xl text-accent/60 mb-4"></i>
          <blockquote class="font-display text-2xl md:text-3xl italic text-primary-700 leading-snug">
            “{t.home.quote}”
          </blockquote>
          <p class="mt-4 text-sm uppercase tracking-widest text-primary-700/60">
            — {t.home.quoteAttribution}
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <Section class="text-center max-w-2xl">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-primary-700 mb-3">
          {t.home.newsletterTitle}
        </h2>
        <p class="text-primary-700/70 mb-6">{t.home.newsletterDesc}</p>
        <form
          method="POST"
          action="/api/newsletter"
          class="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input
            type="email"
            name="email"
            required
            placeholder={t.home.newsletterPlaceholder}
            class="flex-1 sm:max-w-sm rounded-md border border-primary-200 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <Button type="submit" variant="accent">
            <i class="fas fa-paper-plane"></i> {t.home.newsletterCta}
          </Button>
        </form>
      </Section>
    </Layout>
  );
}
