import { allEvents, affiliations, eventPlace, placeById, residences } from '../data';
import type { AtlasEvent, Locale, Localized, Residence } from '../types';
import { dayNumber, inRange } from './dates';

export interface LocationHit {
  kind: 'event' | 'residence' | 'nearest';
  event?: AtlasEvent;
  residence?: Residence;
  inferred: boolean;
  distanceDays?: number;
}

const EVENT_PRIORITY: Record<AtlasEvent['type'], number> = {
  premiere: 0,
  death: 1,
  grave: 2,
  guest_night: 3,
  performance: 4,
  summer_hut: 5,
  conducting_post: 6,
  childhood: 7,
  residence: 8,
  life: 9,
};

export function eventsOnDate(iso: string, opts?: { deep?: boolean }): AtlasEvent[] {
  return allEvents
    .filter((e) => (opts?.deep ? true : !e.deep))
    .filter((e) => inRange(iso, e.dateStart, e.dateEnd))
    .sort((a, b) => EVENT_PRIORITY[a.type] - EVENT_PRIORITY[b.type]);
}

export function residencesOnDate(iso: string, opts?: { deep?: boolean }): Residence[] {
  return residences
    .filter((r) => (opts?.deep ? true : !r.deep))
    .filter((r) => inRange(iso, r.dateStart, r.dateEnd))
    .sort((a, b) => Number(a.inferredFromPost) - Number(b.inferredFromPost));
}

export function nearestEvent(iso: string, opts?: { deep?: boolean }): { event: AtlasEvent; distanceDays: number } | null {
  const t = dayNumber(iso);
  let best: { event: AtlasEvent; distanceDays: number } | null = null;
  for (const e of allEvents) {
    if (!opts?.deep && e.deep) continue;
    const a = dayNumber(e.dateStart);
    const b = dayNumber(e.dateEnd ?? e.dateStart);
    const dist = t < a ? a - t : t > b ? t - b : 0;
    if (!best || dist < best.distanceDays) best = { event: e, distanceDays: dist };
  }
  return best;
}

export function locateOnDate(iso: string, opts?: { deep?: boolean }): LocationHit {
  const exact = eventsOnDate(iso, opts).filter((e) => !e.dateEnd || e.dateStart === e.dateEnd || e.datePrecision === 'day');
  const dayHits = exact.filter((e) => e.datePrecision === 'day' && (!e.dateEnd || e.dateEnd === e.dateStart));
  if (dayHits.length) {
    return { kind: 'event', event: dayHits[0], inferred: false };
  }

  const covering = eventsOnDate(iso, opts);
  const tight = covering.find((e) => e.type === 'guest_night' || e.type === 'summer_hut' || e.type === 'death');
  if (tight) {
    return { kind: 'event', event: tight, inferred: eInferred(tight) };
  }

  const res = residencesOnDate(iso, opts)[0];
  if (res) {
    return { kind: 'residence', residence: res, inferred: res.inferredFromPost };
  }

  if (covering[0]) {
    return { kind: 'event', event: covering[0], inferred: true };
  }

  const near = nearestEvent(iso, opts);
  if (near) {
    return { kind: 'nearest', event: near.event, inferred: true, distanceDays: near.distanceDays };
  }

  return { kind: 'nearest', inferred: true };
}

function eInferred(event: AtlasEvent): boolean {
  const place = eventPlace(event);
  return place?.pinPrecision === 'city' || place?.pinPrecision === 'unknown';
}

export function describeHit(hit: LocationHit, locale: Locale): { title: string; body: Localized; extra?: Localized; inferred: boolean; eventIds: string[] } {
  if (hit.kind === 'event' && hit.event) {
    const e = hit.event;
    const place = eventPlace(e);
    const venue = place?.venue?.[locale] ?? place?.city[locale] ?? '';
    return {
      title: e.title[locale],
      body: {
        nl: `${e.summary.nl}${venue ? ` — ${venue}` : ''}${hit.inferred ? ' Best gedocumenteerde post of stad; geen straat verzonnen.' : ''}`,
        en: `${e.summary.en}${venue ? ` — ${venue}` : ''}${hit.inferred ? ' Best documented post or city; no street invented.' : ''}`,
        de: `${e.summary.de}${venue ? ` — ${venue}` : ''}${hit.inferred ? ' Best dokumentierte Stelle oder Stadt; keine Straße erfunden.' : ''}`,
        cs: `${e.summary.cs}${venue ? ` — ${venue}` : ''}${hit.inferred ? ' Nejlépe doložené místo nebo město; žádná ulice není vymyšlená.' : ''}`,
      },
      extra: e.extra,
      inferred: hit.inferred,
      eventIds: [e.id],
    };
  }

  if (hit.kind === 'residence' && hit.residence) {
    const r = hit.residence;
    const place = placeById[r.placeId];
    const aff = affiliations.find((a) => a.placeId === r.placeId && inRange(r.dateStart, a.dateStart, a.dateEnd));
    return {
      title: r.title[locale],
      body: {
        nl: `Geen exacte pin voor die dag. Best gedocumenteerd: ${r.title.nl}${place?.venue ? `, ${place.venue.nl}` : ''}. ${r.note.nl}`,
        en: `No exact pin for that day. Best documented: ${r.title.en}${place?.venue ? `, ${place.venue.en}` : ''}. ${r.note.en}`,
        de: `Kein genauer Pin für diesen Tag. Best dokumentiert: ${r.title.de}${place?.venue ? `, ${place.venue.de}` : ''}. ${r.note.de}`,
        cs: `Žádný přesný pin pro ten den. Nejlépe doloženo: ${r.title.cs}${place?.venue ? `, ${place.venue.cs}` : ''}. ${r.note.cs}`,
      },
      extra: aff?.extra,
      inferred: true,
      eventIds: [`res:${r.id}`],
    };
  }

  if (hit.event) {
    const e = hit.event;
    const days = hit.distanceDays ?? 0;
    return {
      title: e.title[locale],
      body: {
        nl: `Onbekend voor die exacte dag. Dichtstbijzijnde gedocumenteerde venster: ${e.title.nl} (${e.dateStart}${e.dateEnd ? `–${e.dateEnd}` : ''}, ${days} dagen).`,
        en: `Unknown for that exact day. Nearest documented window: ${e.title.en} (${e.dateStart}${e.dateEnd ? `–${e.dateEnd}` : ''}, ${days} days).`,
        de: `Unbekannt für genau diesen Tag. Nächstes belegtes Fenster: ${e.title.de} (${e.dateStart}${e.dateEnd ? `–${e.dateEnd}` : ''}, ${days} Tage).`,
        cs: `Neznámé pro ten přesný den. Nejblíže doložené okno: ${e.title.cs} (${e.dateStart}${e.dateEnd ? `–${e.dateEnd}` : ''}, ${days} dní).`,
      },
      extra: e.extra,
      inferred: true,
      eventIds: [e.id],
    };
  }

  return {
    title: '',
    body: {
      nl: 'Geen gedocumenteerd venster in deze dataset.',
      en: 'No documented window in this dataset.',
      de: 'Kein belegtes Fenster in diesem Datensatz.',
      cs: 'V těchto datech není doložené okno.',
    },
    inferred: true,
    eventIds: [],
  };
}
