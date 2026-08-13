import type { Locale } from '../lib/data';
import { messages } from '../lib/i18n';
import { Layout } from '../components/layout';
import { Badge, Card, Section } from '../components/ui';
import { ROUTE_SEGMENTS, totalKm, drivingDaysCount, restDaysCount, totalDays } from '../data/routeplan';

function fmtDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === 'nl' ? 'nl-BE' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function RouteplanPage({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const km = totalKm();
  const drivingDays = drivingDaysCount();
  const restDays = restDaysCount();
  const days = totalDays();

  // Prep data for the client-side Leaflet script as a plain JSON payload
  const mapPayload = {
    locale,
    labels: {
      day: locale === 'nl' ? 'Dag' : 'Day',
      overnight: locale === 'nl' ? 'Overnachting' : 'Overnight',
      rest: locale === 'nl' ? 'rustdag' : 'rest day',
      time: locale === 'nl' ? 'Rijtijd' : 'Driving time',
      tesla: 'Tesla Supercharger',
    },
    segments: ROUTE_SEGMENTS.map((s) => ({
      day: s.day,
      date: s.date,
      dateLabel: fmtDate(s.date, locale),
      from: s.from,
      to: s.to,
      fromCoords: s.fromCoords,
      toCoords: s.toCoords,
      km: s.km,
      time: s.drivingTime,
      note: s.note ?? '',
      waypoints: s.waypoints ?? [],
      teslaStops: (s.teslaStops ?? []).map((ts) => ({
        name: ts.name,
        coords: ts.coords,
        kW: ts.kW,
        minutes: ts.minutes,
      })),
      overnight: s.overnight ?? '',
    })),
  };

  return (
    <Layout
      locale={locale}
      pathname="/routeplan"
      title={`${locale === 'nl' ? 'Routeplan 2026' : 'Route plan 2026'} · Mahler Reise`}
    >
      {/* Leaflet CSS + JS (CDN) — only loaded on this page */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <Section>
        <span class="inline-block uppercase tracking-[0.25em] text-accent text-xs mb-3">
          {locale === 'nl' ? 'Prospectiereis · 22 aug → 7 sep 2026' : 'Prospection tour · 22 Aug → 7 Sep 2026'}
        </span>
        <h1 class="font-display text-4xl md:text-5xl font-bold text-primary-700">
          {locale === 'nl' ? 'Routeplan' : 'Route plan'}
        </h1>
        <p class="mt-3 text-primary-700/70 max-w-3xl leading-relaxed">
          {locale === 'nl'
            ? '17 dagen, 11 Mahler-locaties + 6 doorreis-haltes, dwars door 6 landen. Terugreis met Tesla Superchargers, geen dag boven 5u30 rijden.'
            : '17 days, 11 Mahler locations + 6 transit stops, across 6 countries. Return via Tesla Superchargers, no day above 5h30 driving.'}
        </p>

        <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon="fa-road" label={locale === 'nl' ? 'Totaal km' : 'Total km'} value={km.toLocaleString(locale === 'nl' ? 'nl-BE' : 'en-GB')} />
          <Kpi icon="fa-calendar" label={locale === 'nl' ? 'Dagen totaal' : 'Days total'} value={String(days)} />
          <Kpi icon="fa-car" label={locale === 'nl' ? 'Rijdagen' : 'Driving days'} value={String(drivingDays)} />
          <Kpi icon="fa-mug-hot" label={locale === 'nl' ? 'Rustdagen' : 'Rest days'} value={String(restDays)} />
        </div>
      </Section>

      {/* Interactive Leaflet map */}
      <Section>
        <div class="mb-3 flex flex-wrap gap-3 text-xs">
          <Legend color="#2C5F4D" label={locale === 'nl' ? 'Mahler-locatie' : 'Mahler location'} />
          <Legend color="#B8860B" label={locale === 'nl' ? 'Doorreis / thuis' : 'Transit / home'} />
          <Legend color="#DC2626" label="Tesla Supercharger" isDot />
          <Legend color="#2C5F4D" label={locale === 'nl' ? 'Route' : 'Route'} isLine />
        </div>
        <p class="mb-4 text-xs text-primary-700/60">
          {locale === 'nl'
            ? 'Klik een dagnummer, etappe of tabelrij om datum, traject, km, rijtijd, Tesla-stop en overnachting te zien.'
            : 'Click a day number, leg or table row to see date, route, km, driving time, Tesla stop and overnight.'}
        </p>
        <div id="route-map" style="height:600px" class="rounded-lg border-2 border-primary-100 shadow-lg overflow-hidden bg-cream-100"></div>
      </Section>

      {/* Day-by-day table */}
      <Section title={locale === 'nl' ? 'Dagoverzicht' : 'Day-by-day'}>
        <Card class="overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-primary-50 text-left text-xs uppercase tracking-widest text-primary-700/70">
                <tr>
                  <th class="px-4 py-3">{locale === 'nl' ? 'Dag' : 'Day'}</th>
                  <th class="px-4 py-3">{locale === 'nl' ? 'Datum' : 'Date'}</th>
                  <th class="px-4 py-3">{locale === 'nl' ? 'Traject' : 'Leg'}</th>
                  <th class="px-4 py-3 text-right">Km</th>
                  <th class="px-4 py-3">{locale === 'nl' ? 'Rijtijd' : 'Time'}</th>
                  <th class="px-4 py-3">Tesla</th>
                  <th class="px-4 py-3">{locale === 'nl' ? 'Overnachting' : 'Overnight'}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary-100">
                {ROUTE_SEGMENTS.map((s) => (
                  <tr
                    data-route-day={s.day}
                    class={`route-day-row cursor-pointer ${s.km === 0 ? 'bg-cream-200/60' : ''}`}
                    title={locale === 'nl' ? 'Toon op kaart' : 'Show on map'}
                  >
                    <td class="px-4 py-3 font-display font-bold text-primary">{s.day}</td>
                    <td class="px-4 py-3">
                      <div class="font-semibold">{fmtDate(s.date, locale)}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-semibold text-primary-700">{s.from} → {s.to}</div>
                      {s.note ? <div class="text-xs text-primary-700/70 mt-1 leading-relaxed">{s.note}</div> : null}
                    </td>
                    <td class="px-4 py-3 text-right font-mono font-semibold">
                      {s.km === 0 ? <span class="text-primary-700/40">—</span> : s.km}
                    </td>
                    <td class="px-4 py-3 text-xs">
                      {s.drivingTime === '—' ? (
                        <Badge variant="success">
                          <i class="fas fa-mug-hot mr-1"></i>{locale === 'nl' ? 'rust' : 'rest'}
                        </Badge>
                      ) : s.drivingTime}
                    </td>
                    <td class="px-4 py-3 text-xs">
                      {s.teslaStops && s.teslaStops.length ? (
                        <div class="space-y-1">
                          {s.teslaStops.map((ts) => (
                            <div class="flex items-center gap-1 text-red-700">
                              <i class="fas fa-bolt"></i>
                              <span>{ts.minutes} min</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span class="text-primary-700/30">—</span>
                      )}
                    </td>
                    <td class="px-4 py-3 text-xs">{s.overnight ?? '—'}</td>
                  </tr>
                ))}
                <tr class="bg-primary-700 text-cream-100 font-semibold">
                  <td class="px-4 py-3" colspan={3}>Totaal</td>
                  <td class="px-4 py-3 text-right font-mono">{km.toLocaleString(locale === 'nl' ? 'nl-BE' : 'en-GB')}</td>
                  <td class="px-4 py-3" colspan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* Tesla Supercharger details */}
      <Section title={locale === 'nl' ? 'Tesla Supercharger-plan' : 'Tesla Supercharger plan'}>
        <p class="mb-6 text-primary-700/70 max-w-2xl">
          {locale === 'nl'
            ? 'Alle laadstops zijn Tesla V3 Superchargers (250 kW) direct langs de autoroute. Laadtijd 20-30 min per stop — perfect voor lunch of koffiepauze.'
            : 'All charging stops are Tesla V3 Superchargers (250 kW) directly along the motorway. Charging time 20-30 min per stop — perfect for lunch or coffee break.'}
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          {ROUTE_SEGMENTS.filter((s) => s.teslaStops && s.teslaStops.length > 0).flatMap((s) =>
            s.teslaStops!.map((ts) => (
              <Card class="p-5 border-red-100">
                <div class="flex items-start gap-3">
                  <div class="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-bolt text-lg"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-primary-700/60 mb-1">
                      {locale === 'nl' ? 'Dag' : 'Day'} {s.day} · {fmtDate(s.date, locale)}
                    </div>
                    <h3 class="font-display font-semibold text-primary-700">{ts.name}</h3>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <Badge variant="accent">{ts.kW} kW</Badge>
                      <Badge variant="primary">{ts.minutes} min</Badge>
                    </div>
                    {ts.note ? <p class="text-xs text-primary-700/70 mt-2">{ts.note}</p> : null}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Section>

      {/* Belangrijke opmerkingen */}
      <Section title={locale === 'nl' ? 'Belangrijke aandachtspunten' : 'Important notes'} class="max-w-3xl">
        <ul class="space-y-3">
          <li class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <i class="fas fa-triangle-exclamation text-amber-600 mt-1"></i>
            <div>
              <strong class="text-amber-800">Neuschwanstein tickets</strong>
              <p class="text-sm text-amber-700 mt-1">
                {locale === 'nl'
                  ? 'Reserveer 8u30-slot voor 6 sept 2026 nu al via hohenschwangau.de — september is hoogseizoen.'
                  : 'Book the 8:30 slot for 6 Sep 2026 now via hohenschwangau.de — September is peak season.'}
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
            <i class="fas fa-check-circle text-emerald-600 mt-1"></i>
            <div>
              <strong class="text-emerald-800">
                {locale === 'nl' ? 'Nismes-deadline: 7 sep 14u' : 'Nismes deadline: 7 Sep 14:00'}
              </strong>
              <p class="text-sm text-emerald-700 mt-1">
                {locale === 'nl'
                  ? 'Vertrek Metz 9u → 1 laadstop Wasserbillig (20 min) → aankomst Nismes 12u-12u30. Ruim binnen deadline.'
                  : 'Depart Metz 9:00 → 1 charging stop Wasserbillig (20 min) → arrive Nismes 12:00-12:30. Well within deadline.'}
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3 p-4 bg-primary-50 border border-primary-200 rounded-md">
            <i class="fas fa-info-circle text-primary-700 mt-1"></i>
            <div>
              <strong class="text-primary-800">MG370 range</strong>
              <p class="text-sm text-primary-700/80 mt-1">
                {locale === 'nl'
                  ? 'Bij autoroute-tempo (120 km/u) reken op ~280 km effectief bereik. Alle plannen respecteren dit met marge.'
                  : 'At motorway speed (120 km/h) count on ~280 km effective range. All plans respect this with margin.'}
              </p>
            </div>
          </li>
        </ul>
      </Section>

      {/* Client-side map bootstrap */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__ROUTE_DATA__ = ${JSON.stringify(mapPayload)};`,
        }}
      ></script>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="/static/routeplan.js" defer></script>
    </Layout>
  );
}

function Kpi({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card class="p-5">
      <i class={`fas ${icon} text-accent text-xl mb-2`}></i>
      <div class="font-display text-3xl font-bold text-primary">{value}</div>
      <div class="text-xs text-primary-700/60 uppercase tracking-widest mt-1">{label}</div>
    </Card>
  );
}

function Legend({ color, label, isDot, isLine }: { color: string; label: string; isDot?: boolean; isLine?: boolean }) {
  return (
    <div class="flex items-center gap-2">
      {isLine ? (
        <div style={`width:24px;height:3px;background:${color}`}></div>
      ) : (
        <div
          style={`width:14px;height:14px;background:${color};border-radius:${isDot ? '50%' : '3px'};border:2px solid white;box-shadow:0 0 0 1px ${color}`}
        ></div>
      )}
      <span class="text-primary-700/80">{label}</span>
    </div>
  );
}
