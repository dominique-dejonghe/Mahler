import type { Locale } from '../lib/data';
import { messages, localePath } from '../lib/i18n';
import { Layout } from '../components/layout';
import { Badge, Button, Card, Section, TypographicHero } from '../components/ui';
import {
  getEncyclopedia,
  getEncyclopediaBySlug,
  getEncyclopediaNeighbors,
  getJournalEntries,
  getJournalEntryBySlug,
  getConcerts,
  getDayProgram,
  getPricingTiers,
  getTourIncluded,
  getDepartureDates,
  getFAQ,
  ENCYCLOPEDIA_CATEGORIES,
} from '../lib/data';

function fmtDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === 'nl' ? 'nl-BE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* --------------------------------- /reis --------------------------------- */

export function ReisPage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const days = getDayProgram();
  const tiers = getPricingTiers();
  const included = getTourIncluded();
  const departures = getDepartureDates();
  const faq = getFAQ();

  return (
    <Layout
      locale={locale}
      pathname="/reis"
      title={`${t.reis.title} · Mahler Reise`}
    >
      <Section>
        <span class="inline-block uppercase tracking-[0.25em] text-accent text-xs mb-3">2027</span>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.reis.title}</h1>
        <p class="mt-3 text-primary-700/70 max-w-2xl">{t.reis.subtitle}</p>
        <p class="mt-6 max-w-3xl leading-relaxed">{t.reis.intro}</p>
      </Section>

      {/* Departures */}
      <Section title={t.reis.departuresTitle}>
        <div class="grid md:grid-cols-2 gap-6">
          {departures.map((d: any) => (
            <Card class="p-6">
              <div class="text-accent uppercase tracking-widest text-xs">{d.label?.[locale] ?? d.label?.nl}</div>
              <div class="font-display text-2xl text-primary-700 mt-1">
                {fmtDate(d.date, locale)} → {fmtDate(d.endDate, locale)}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Day program */}
      <Section title={t.reis.programTitle}>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {days.map((d: any) => (
            <Card class="p-5">
              <div class="flex items-center justify-between mb-2">
                <Badge variant="accent">{d.date?.[locale] ?? d.date?.nl}</Badge>
                <span class="text-xs text-primary-700/60">{d.location}</span>
              </div>
              <h3 class="font-display text-lg font-semibold text-primary-700">
                {d.title?.[locale] ?? d.title?.nl}
              </h3>
              <p class="text-sm text-primary-700/80 mt-2 leading-relaxed">
                {d.description?.[locale] ?? d.description?.nl}
              </p>
              {Array.isArray(d.highlights?.[locale]) ? (
                <ul class="mt-3 space-y-1 text-xs text-primary-700/70">
                  {(d.highlights[locale] as string[]).map((h) => (
                    <li><i class="fas fa-check text-accent mr-2"></i>{h}</li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      </Section>

      {/* Included */}
      <Section title={t.reis.includedTitle}>
        <ul class="grid sm:grid-cols-2 gap-3 max-w-3xl">
          {(included[locale] ?? included.nl ?? []).map((i: string) => (
            <li class="flex items-start gap-3 p-3 rounded-md bg-white border border-primary-100">
              <i class="fas fa-circle-check text-accent mt-1"></i>
              <span class="text-sm">{i}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Pricing */}
      <Section title={t.reis.pricingTitle}>
        <div class="grid md:grid-cols-3 gap-6">
          {tiers.map((tier: any) => {
            const name = tier.name?.[locale] ?? tier.name;
            const popular = tier.id === 'comfort';
            return (
              <Card class={`p-6 relative ${popular ? 'ring-2 ring-accent' : ''}`}>
                {popular ? (
                  <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-3 py-1 rounded-full">
                    {t.reis.mostPopular}
                  </span>
                ) : null}
                <h3 class="font-display text-2xl font-bold text-primary-700">{typeof name === 'string' ? name : tier.id}</h3>
                <div class="mt-3 flex items-baseline gap-2">
                  <span class="font-display text-4xl font-bold text-primary">€{tier.price.toLocaleString(locale === 'nl' ? 'nl-BE' : 'en-GB')}</span>
                  <span class="text-xs text-primary-700/60">{t.reis.perPerson}</span>
                </div>
                <ul class="mt-5 space-y-2 text-sm">
                  {(tier.features?.[locale] ?? tier.features?.nl ?? tier.features ?? []).map((f: string) => (
                    <li class="flex gap-2">
                      <i class="fas fa-check text-accent mt-1"></i>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button class="w-full mt-6" variant={popular ? 'accent' : 'primary'} href="#signup">
                  {t.reis.choose}
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Signup */}
      <Section title={t.reis.signupTitle} class="max-w-2xl">
        <form id="signup" method="POST" action="/api/signup" class="grid gap-4">
          <input name="name" required placeholder={t.contact.name} class="rounded-md border border-primary-200 px-4 py-2 bg-white" />
          <input name="email" type="email" required placeholder={t.contact.email} class="rounded-md border border-primary-200 px-4 py-2 bg-white" />
          <select name="tier" class="rounded-md border border-primary-200 px-4 py-2 bg-white">
            {tiers.map((t: any) => (
              <option value={t.id}>{t.name?.[locale] ?? t.name} — €{t.price}</option>
            ))}
          </select>
          <textarea name="message" rows={3} placeholder={t.contact.message} class="rounded-md border border-primary-200 px-4 py-2 bg-white"></textarea>
          <Button type="submit" variant="accent" class="self-start">{t.contact.send}</Button>
        </form>
      </Section>

      {/* FAQ */}
      <Section title={t.reis.faqTitle} class="max-w-3xl">
        <div class="divide-y divide-primary-100 border border-primary-100 rounded-md bg-white">
          {faq.map((item: any) => (
            <details class="group p-5">
              <summary class="cursor-pointer flex justify-between items-center font-semibold text-primary-700">
                <span>{item.q?.[locale] ?? item.q?.nl}</span>
                <i class="fas fa-chevron-down transition group-open:rotate-180"></i>
              </summary>
              <p class="mt-3 text-sm text-primary-700/80 leading-relaxed">
                {item.a?.[locale] ?? item.a?.nl}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

/* ------------------------------- /dagboek -------------------------------- */

export function DagboekPage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const entries = getJournalEntries();
  const countries = Array.from(new Set(entries.map((e) => e.country)));
  const types = Array.from(new Set(entries.map((e) => e.type)));

  return (
    <Layout locale={locale} pathname="/dagboek" title={`${t.dagboek.title} · Mahler Reise`}>
      <Section>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.dagboek.title}</h1>
        <p class="mt-3 text-primary-700/70 max-w-2xl">{t.dagboek.subtitle}</p>

        <div class="mt-8 flex flex-wrap gap-2 text-xs">
          <Badge variant="muted">{entries.length} entries</Badge>
          {countries.map((c) => <Badge variant="primary">{c}</Badge>)}
          {types.map((tp) => <Badge variant="accent">{tp}</Badge>)}
        </div>
      </Section>

      <Section>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((e) => (
            <Card class="overflow-hidden">
              <a href={localePath(locale, `/dagboek/${e.slug}`)}>
                <div class="aspect-[16/10] bg-cream-200 overflow-hidden">
                  <img src={e.coverImage} alt="" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition" />
                </div>
              </a>
              <div class="p-5">
                <div class="flex items-center gap-2 text-xs text-primary-700/60 mb-2">
                  <i class="fas fa-calendar"></i>
                  <span>{fmtDate(e.date, locale)}</span>
                  <span>·</span>
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{e.location}</span>
                </div>
                <h3 class="font-display text-xl font-semibold text-primary-700">
                  <a href={localePath(locale, `/dagboek/${e.slug}`)}>{e.title[locale]}</a>
                </h3>
                <p class="mt-2 text-sm text-primary-700/80 line-clamp-3">{e.excerpt[locale]}</p>
                <div class="mt-4 flex justify-between items-center text-xs">
                  <span class="text-primary-700/60">{t.dagboek.by} {e.author}</span>
                  <a href={localePath(locale, `/dagboek/${e.slug}`)} class="font-semibold text-primary hover:text-accent">
                    {t.dagboek.readMore} <i class="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export function DagboekDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = messages[locale];
  const entry = getJournalEntryBySlug(slug);
  if (!entry) return null;
  const paragraphs = entry.body[locale].split(/\n+/).filter(Boolean);

  return (
    <Layout locale={locale} pathname={`/dagboek/${slug}`} title={`${entry.title[locale]} · Mahler Reise`}>
      <article>
        <div class="relative h-[50vh] min-h-[300px] overflow-hidden">
          <img src={entry.coverImage} alt="" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-8 text-cream-100">
            <div class="flex flex-wrap gap-2 mb-3 text-xs">
              <Badge variant="accent">{fmtDate(entry.date, locale)}</Badge>
              <Badge variant="muted">{entry.location}, {entry.country}</Badge>
              <Badge variant="primary">{entry.type}</Badge>
            </div>
            <h1 class="font-display text-3xl md:text-5xl font-bold leading-tight">{entry.title[locale]}</h1>
            <p class="mt-2 text-cream-100/90 text-sm">{t.dagboek.by} {entry.author}</p>
          </div>
        </div>
        <Section class="max-w-3xl">
          <a href={localePath(locale, '/dagboek')} class="text-sm text-primary-700/70 hover:text-primary">
            <i class="fas fa-arrow-left mr-2"></i>{t.dagboek.backToList}
          </a>
          <p class="mt-6 text-lg text-primary-700/80 italic leading-relaxed">{entry.excerpt[locale]}</p>
          <div class="mt-6 space-y-5 text-base leading-relaxed">
            {paragraphs.map((p) => <p>{p}</p>)}
          </div>
        </Section>
      </article>
    </Layout>
  );
}

/* ----------------------------- /encyclopedie ----------------------------- */

export function EncyclopediePage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const all = getEncyclopedia();

  return (
    <Layout locale={locale} pathname="/encyclopedie" title={`${t.encyclopedie.title} · Mahler Reise`}>
      <Section>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.encyclopedie.title}</h1>
        <p class="mt-3 text-primary-700/70 max-w-2xl">{t.encyclopedie.subtitle}</p>
      </Section>

      <Section title={t.encyclopedie.timeline}>
        <div class="overflow-x-auto pb-4">
          <div class="flex gap-3 min-w-max">
            {[...all]
              .sort((a, b) => parseInt(a.mahlerPeriod) - parseInt(b.mahlerPeriod))
              .map((loc) => (
                <a
                  href={localePath(locale, `/encyclopedie/${loc.slug}`)}
                  class={`flex-shrink-0 w-44 p-3 rounded-md border ${loc.isFullContent ? 'border-accent bg-accent-100/40' : 'border-primary-100 bg-white'} hover:shadow-md transition`}
                >
                  <div class="text-xs text-accent font-bold tracking-wider">{loc.mahlerPeriod}</div>
                  <div class="font-display font-semibold text-primary-700 mt-1">{loc.name}</div>
                  <div class="text-xs text-primary-700/60 mt-1">{loc.country}</div>
                </a>
              ))}
          </div>
        </div>
      </Section>

      <Section>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {all.map((loc) => (
            <Card class="p-5">
              <div class="flex justify-between items-start mb-3">
                <Badge variant={loc.isFullContent ? 'accent' : 'muted'}>
                  {loc.isFullContent ? t.encyclopedie.fullContent : t.encyclopedie.comingSoon}
                </Badge>
                <span class="text-xs text-primary-700/60">{loc.country}</span>
              </div>
              <h3 class="font-display text-xl font-semibold text-primary-700">
                <a href={localePath(locale, `/encyclopedie/${loc.slug}`)}>{loc.name}</a>
              </h3>
              <div class="text-xs text-accent mt-1">{loc.mahlerPeriod} · {loc.durationLabel[locale]}</div>
              <p class="mt-3 text-sm text-primary-700/80 leading-relaxed line-clamp-3">{loc.shortDesc[locale]}</p>
              <a
                href={localePath(locale, `/encyclopedie/${loc.slug}`)}
                class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
              >
                {t.encyclopedie.readMore} <i class="fas fa-arrow-right"></i>
              </a>
            </Card>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export function EncyclopedieDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = messages[locale];
  const loc = getEncyclopediaBySlug(slug);
  if (!loc) return null;
  const { prev, next } = getEncyclopediaNeighbors(slug);
  const initial = loc.name.charAt(0).toUpperCase();

  return (
    <Layout locale={locale} pathname={`/encyclopedie/${slug}`} title={`${loc.name} · Mahler Reise`}>
      <Section>
        <a href={localePath(locale, '/encyclopedie')} class="text-sm text-primary-700/70 hover:text-primary">
          <i class="fas fa-arrow-left mr-2"></i>{t.encyclopedie.backToList}
        </a>
        <div class="mt-4">
          <TypographicHero
            title={loc.name}
            subtitle={loc.shortDesc[locale]}
            badge={`${loc.country} · ${loc.mahlerPeriod}`}
            initial={initial}
          />
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <Badge variant="primary">{loc.country}</Badge>
          <Badge variant="accent">{loc.mahlerPeriod}</Badge>
          <Badge variant="muted">{loc.durationLabel[locale]}</Badge>
          <Badge variant="muted">{loc.category}</Badge>
        </div>
      </Section>

      {!loc.isFullContent ? (
        <Section class="max-w-3xl">
          <Card class="p-6 bg-accent-100/40 border-accent/30">
            <i class="fas fa-feather text-accent text-2xl mb-3"></i>
            <h3 class="font-display text-xl text-primary-700 font-semibold">
              {t.encyclopedie.comingSoon}
            </h3>
            <p class="text-sm text-primary-700/80 mt-2">
              {locale === 'nl'
                ? 'Deze locatie wordt verder uitgewerkt na de prospectiereis (augustus 2026). Voorlopig vind je hier de korte beschrijving.'
                : 'This location will be expanded after the prospection tour (August 2026). For now you find the short description here.'}
            </p>
          </Card>
        </Section>
      ) : null}

      {loc.chronology ? (
        <Section class="max-w-3xl">
          <h2 class="font-display text-2xl font-bold text-primary-700 mb-4">
            {locale === 'nl' ? 'Chronologie' : 'Chronology'}
          </h2>
          <div class="space-y-4 leading-relaxed">
            {loc.chronology[locale].map((p) => <p>{p}</p>)}
          </div>
        </Section>
      ) : null}

      {loc.works && loc.works.length ? (
        <Section title={t.encyclopedie.works} class="max-w-3xl">
          <ul class="divide-y divide-primary-100 border border-primary-100 rounded-md bg-white">
            {loc.works.map((w) => (
              <li class="p-4">
                <div class="flex justify-between gap-3">
                  <div>
                    <strong class="font-display text-primary-700">{w.title}</strong>
                    {w.year ? <span class="text-xs text-primary-700/60 ml-2">({w.year})</span> : null}
                  </div>
                  <Badge variant="accent">{w.type}</Badge>
                </div>
                {w.note ? <p class="text-sm text-primary-700/70 mt-1">{w.note[locale]}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {loc.manuscripts && loc.manuscripts.length ? (
        <Section title={t.encyclopedie.manuscripts} class="max-w-3xl">
          <ul class="space-y-3">
            {loc.manuscripts.map((m) => (
              <li class="p-4 bg-white rounded-md border border-primary-100">
                <strong class="font-display text-primary-700">{m.title}</strong>
                <div class="text-sm text-primary-700/70 mt-1">
                  <i class="fas fa-archive mr-2 text-accent"></i>{m.archive}
                  {m.archiveUrl ? <a href={m.archiveUrl} target="_blank" rel="noopener" class="ml-2 text-primary hover:text-accent text-xs">↗</a> : null}
                </div>
                {m.note ? <p class="text-sm text-primary-700/70 mt-2">{m.note[locale]}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {loc.bibliography && loc.bibliography.length ? (
        <Section title={t.encyclopedie.bibliography} class="max-w-3xl">
          <ul class="space-y-2 text-sm">
            {loc.bibliography.map((b) => (
              <li>
                <span class="font-semibold">{b.author}</span> — <em>{b.title}</em> ({b.year})
                {b.publisher ? <span class="text-primary-700/60">, {b.publisher}</span> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section class="max-w-3xl">
        <div class="grid sm:grid-cols-2 gap-4">
          {prev ? (
            <a href={localePath(locale, `/encyclopedie/${prev.slug}`)} class="p-4 border border-primary-100 rounded-md bg-white hover:shadow-md transition">
              <div class="text-xs text-primary-700/60"><i class="fas fa-arrow-left mr-2"></i>{t.encyclopedie.previous}</div>
              <div class="font-display font-semibold text-primary-700 mt-1">{prev.name}</div>
            </a>
          ) : <div></div>}
          {next ? (
            <a href={localePath(locale, `/encyclopedie/${next.slug}`)} class="p-4 border border-primary-100 rounded-md bg-white hover:shadow-md transition text-right">
              <div class="text-xs text-primary-700/60">{t.encyclopedie.next}<i class="fas fa-arrow-right ml-2"></i></div>
              <div class="font-display font-semibold text-primary-700 mt-1">{next.name}</div>
            </a>
          ) : <div></div>}
        </div>
      </Section>
    </Layout>
  );
}

/* ------------------------------ /concerten ------------------------------- */

export function ConcertenPage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const concerts = getConcerts();

  return (
    <Layout locale={locale} pathname="/concerten" title={`${t.concerten.title} · Mahler Reise`}>
      <Section>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.concerten.title}</h1>
        <p class="mt-3 text-primary-700/70 max-w-2xl">{t.concerten.subtitle}</p>
      </Section>
      <Section>
        <div class="grid md:grid-cols-2 gap-6">
          {concerts.map((c: any) => {
            const d = new Date(c.date);
            const day = d.getDate();
            const month = d.toLocaleDateString(locale === 'nl' ? 'nl-BE' : 'en-GB', { month: 'short' });
            const year = d.getFullYear();
            return (
              <Card class="p-5 flex gap-5">
                <div class="flex-shrink-0 text-center w-20">
                  <div class="font-display text-3xl font-bold text-primary">{day}</div>
                  <div class="uppercase text-xs tracking-widest text-accent">{month}</div>
                  <div class="text-xs text-primary-700/60">{year}</div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap gap-2 mb-2">
                    {c.isTomDevaere ? <Badge variant="accent"><i class="fas fa-violin mr-1"></i>Tom Devaere</Badge> : null}
                    <Badge variant="primary">{c.composer ?? 'Mahler'}</Badge>
                  </div>
                  <h3 class="font-display text-lg font-semibold text-primary-700">{c.title}</h3>
                  <p class="text-sm text-primary-700/70 mt-1">
                    <i class="fas fa-map-marker-alt mr-1"></i>{c.venue}, {c.city} ({c.country})
                  </p>
                  <p class="text-sm mt-3 leading-relaxed">{c.programme}</p>
                  {Array.isArray(c.performers) ? (
                    <p class="text-xs text-primary-700/60 mt-2">
                      <strong>{t.concerten.performers}:</strong> {c.performers.join(', ')}
                    </p>
                  ) : null}
                  <div class="mt-3 flex gap-2">
                    {c.ticketsUrl ? <Button href={c.ticketsUrl} variant="accent">{t.concerten.tickets}</Button> : null}
                    {c.infoUrl ? <Button href={c.infoUrl} variant="outline">{t.concerten.moreInfo}</Button> : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </Layout>
  );
}

/* --------------------------------- /over --------------------------------- */

export function OverPage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const tom = {
    nl: 'Belgisch violist, concertmeester bij de uitvoering van Mahler 4 (4–5 september 2026), mede-oprichter van Mahler Reise.',
    en: 'Belgian violinist, concertmaster on Mahler 4 (4–5 September 2026), co-founder of Mahler Reise.',
  };
  const dom = {
    nl: 'Senior AI project- & changemanager met 20+ jaar ervaring in digitale transformatie. Mede-oprichter van Andre Devaere VZW en bestuurslid van Anima Eterna Brugge.',
    en: 'Senior AI project & change manager with 20+ years experience in digital transformation. Co-founder of Andre Devaere VZW and board member of Anima Eterna Brugge.',
  };
  const vision = {
    nl: 'Mahler Reise is geen biografie maar een reis. Tien dagen, elf steden, drie landen — om Mahler te ervaren waar hij leefde, componeerde en dirigeerde. Voor een klein gezelschap dat van muziek, geschiedenis en de stilte tussen noten houdt.',
    en: 'Mahler Reise is not a biography but a journey. Ten days, eleven cities, three countries — to experience Mahler where he lived, composed and conducted. For a small group that loves music, history and the silence between the notes.',
  };
  const supporters = ['Anima Eterna Brugge', 'Gustav Mahler Musikwochen', 'Andre Devaere VZW', 'Iutum'];

  return (
    <Layout locale={locale} pathname="/over" title={`${t.over.title} · Mahler Reise`}>
      <Section>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.over.title}</h1>
      </Section>

      <Section>
        <div class="grid md:grid-cols-2 gap-6">
          <Card class="p-6">
            <i class="fas fa-violin text-3xl text-accent mb-3"></i>
            <h3 class="font-display text-2xl font-semibold text-primary-700">Tom Devaere</h3>
            <p class="text-xs uppercase tracking-widest text-primary-700/60 mb-3">{t.over.violinistCofounder}</p>
            <p class="leading-relaxed">{tom[locale]}</p>
            <a href="mailto:tom@mahler-reise.be" class="mt-3 inline-block text-sm text-primary hover:text-accent">
              <i class="fas fa-envelope mr-2"></i>tom@mahler-reise.be
            </a>
          </Card>
          <Card class="p-6">
            <i class="fas fa-compass text-3xl text-accent mb-3"></i>
            <h3 class="font-display text-2xl font-semibold text-primary-700">Dominique Dejonghe</h3>
            <p class="text-xs uppercase tracking-widest text-primary-700/60 mb-3">{t.over.projectLeadCofounder}</p>
            <p class="leading-relaxed">{dom[locale]}</p>
            <a href="mailto:dominique.dejonghe@iutum.be" class="mt-3 inline-block text-sm text-primary hover:text-accent">
              <i class="fas fa-envelope mr-2"></i>dominique.dejonghe@iutum.be
            </a>
          </Card>
        </div>
      </Section>

      <Section title={t.over.vision} class="max-w-3xl">
        <p class="text-lg leading-relaxed text-primary-700/90 italic">{vision[locale]}</p>
      </Section>

      <Section title={t.over.supporters}>
        <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {supporters.map((s) => (
            <Card class="p-5 text-center">
              <i class="fas fa-music text-accent text-xl mb-2"></i>
              <div class="font-display text-primary-700">{s}</div>
            </Card>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

/* -------------------------------- /contact ------------------------------- */

export function ContactPage({ locale, sent }: { locale: Locale; sent?: boolean }) {
  const t = messages[locale];
  return (
    <Layout locale={locale} pathname="/contact" title={`${t.contact.title} · Mahler Reise`}>
      <Section>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">{t.contact.title}</h1>
        <p class="mt-3 text-primary-700/70 max-w-2xl">{t.contact.subtitle}</p>
      </Section>

      <Section class="max-w-2xl">
        {sent ? (
          <Card class="p-5 mb-6 bg-emerald-50 border-emerald-200 text-emerald-800">
            <i class="fas fa-check-circle mr-2"></i>{t.contact.success}
          </Card>
        ) : null}
        <form method="POST" action={localePath(locale, '/contact')} class="grid gap-4">
          <input name="name" required placeholder={t.contact.name} class="rounded-md border border-primary-200 px-4 py-2 bg-white" />
          <input name="email" type="email" required placeholder={t.contact.email} class="rounded-md border border-primary-200 px-4 py-2 bg-white" />
          <input name="subject" required placeholder={t.contact.subject} class="rounded-md border border-primary-200 px-4 py-2 bg-white" />
          <textarea name="message" rows={5} required placeholder={t.contact.message} class="rounded-md border border-primary-200 px-4 py-2 bg-white"></textarea>
          <Button type="submit" variant="accent" class="self-start">{t.contact.send}</Button>
        </form>
      </Section>

      <Section class="max-w-2xl">
        <h3 class="font-display text-xl font-bold text-primary-700 mb-4">{t.contact.directContact}</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <Card class="p-4">
            <strong class="text-primary-700">Dominique Dejonghe</strong>
            <a href="mailto:dominique.dejonghe@iutum.be" class="block text-sm mt-1 text-primary hover:text-accent">
              dominique.dejonghe@iutum.be
            </a>
          </Card>
          <Card class="p-4">
            <strong class="text-primary-700">Tom Devaere</strong>
            <a href="mailto:tom@mahler-reise.be" class="block text-sm mt-1 text-primary hover:text-accent">
              tom@mahler-reise.be
            </a>
          </Card>
        </div>
      </Section>
    </Layout>
  );
}
