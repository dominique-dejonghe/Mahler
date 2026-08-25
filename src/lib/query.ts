import {
  affiliations,
  allEvents,
  belgiumComplete,
  completeNights,
  eventPlace,
  fragmentNights,
  neverSelfConducted,
  nightsInCity,
  placeById,
  premiereNight,
  selfStats,
  works,
} from '../data';
import type { AtlasEvent, Locale, Localized, QueryAnswer, WorkId } from '../types';
import { formatDate, parseDatesFromText, parseYearFromText } from './dates';
import { describeHit, eventsOnDate, locateOnDate } from './locate';
import type { SelfNight, SelfWorkId } from '../data/mahlerConducted';

const PLACE_ALIASES: Record<string, string[]> = {
  kaliste: ['kaliste', 'kalischt', 'kaliště', 'kalischt'],
  jihlava: ['jihlava', 'iglau'],
  vienna: ['wenen', 'vienna', 'wien', 'videň', 'viden'],
  vienna_hofoper: ['hofoper', 'staatsoper', 'court opera', 'dvorní opera'],
  vienna_grinzing: ['grinzing'],
  vienna_loew: ['löw', 'loew', 'sanatorium'],
  bad_hall: ['bad hall'],
  ljubljana: ['ljubljana', 'laibach', 'lublan', 'lublaň'],
  olomouc: ['olomouc', 'olmütz', 'olmutz'],
  kassel: ['kassel'],
  prague: ['praag', 'prague', 'prag', 'praha'],
  prague_stavovske: ['stavovské', 'stavovske', 'estates', 'ständetheater', 'standetheater'],
  prague_ndt: ['neues deutsches', 'ndt', 'státní opera', 'statni opera', 'state opera'],
  prague_vystaviste: ['výstaviště', 'vystaviste', 'zasche'],
  prague_modra_hvezda: ['modrá hvězda', 'modra hvezda', 'blue star'],
  leipzig: ['leipzig', 'lipsko'],
  budapest_opera: ['boedapest opera', 'hungarian opera', 'koninklijke hongaarse'],
  budapest: ['boedapest', 'budapest', 'budapešť'],
  hamburg: ['hamburg', 'hamburk'],
  steinbach: ['steinbach', 'attersee'],
  maiernigg: ['maiernigg', 'wörthersee', 'worthersee', 'maria wörth', 'maria worth'],
  toblach: ['toblach', 'dobbiaco', 'schluderbach'],
  munich: ['münchen', 'munchen', 'munich', 'mnichov'],
  berlin: ['berlijn', 'berlin', 'berlín'],
  krefeld: ['krefeld'],
  cologne: ['keulen', 'cologne', 'köln', 'koln'],
  essen: ['essen'],
  amsterdam: ['amsterdam', 'concertgebouw'],
  new_york_met: ['metropolitan', 'met opera', 'oude met'],
  new_york: ['new york', 'nieuw-york', 'nieuw york'],
  new_york_carnegie: ['ny phil', 'philharmonic', 'carnegie'],
  london: ['londen', 'london', 'londýn', 'proms'],
  paris: ['parijs', 'paris', 'paříž', 'pariz'],
  weimar: ['weimar', 'výmar', 'vymar'],
  frankfurt: ['frankfurt'],
  lemberg: ['lemberg', 'lviv', 'lwow', 'lwów'],
  brno: ['brno', 'brunn', 'brünn'],
  linz: ['linz', 'linec'],
  trieste: ['triest', 'triëst', 'trieste', 'terst'],
  wiesbaden: ['wiesbaden'],
  liege: ['luik', 'liege', 'liège', 'luttich', 'lüttich'],
  basel: ['basel', 'bazel', 'bale', 'basilej'],
  heidelberg: ['heidelberg'],
  mannheim: ['mannheim'],
  breslau: ['breslau', 'wroclaw', 'wrocław', 'vratislav'],
  graz: ['graz', 'štýrský', 'styrsky'],
  mainz: ['mainz', 'moguntia', 'mohuč'],
  strasbourg: ['straatsburg', 'strasbourg', 'straßburg', 'strassburg', 'štrasburk'],
  antwerp: ['antwerpen', 'antwerp', 'antverpy'],
  rome: ['rome', 'roma', 'rom', 'řím', 'rim'],
  st_petersburg: ['sint-petersburg', 'st petersburg', 'sankt petersburg', 'petrograd', 'petrohrad'],
  the_hague: ['den haag', 'the hague', 'haag', "s-gravenhage"],
  berlin_philharmonie: ['philharmonie'],
  budapest_vigado: ['vigado', 'vigadó'],
  tongeren: ['tongeren', 'tongern'],
  venice: ['venetië', 'venetie', 'venice', 'venedig', 'benátky'],
  bolzano: ['bolzano', 'bozen'],
  fuessen: ['füssen', 'fussen'],
  metz: ['metz', 'mety'],
  sint_amands: ['sint-amands', 'sint amands'],
};

const WORK_ALIASES: { id: WorkId; keys: string[] }[] = [
  { id: '1', keys: ['eerste', 'first', 'ersten', 'erste', 'první', 'prvni', 'symfonie 1', 'symphony 1', 'sinfonie 1', 'nr. 1', 'no. 1', 'no 1'] },
  { id: '2', keys: ['tweede', 'second', 'zweiten', 'zweite', 'druhá', 'druha', 'symfonie 2', 'symphony 2', 'nr. 2', 'no. 2'] },
  { id: '3', keys: ['derde', 'third', 'dritten', 'dritte', 'třetí', 'treti', 'symfonie 3', 'symphony 3', 'nr. 3', 'no. 3'] },
  { id: '4', keys: ['vierde', 'fourth', 'vierten', 'vierte', 'čtvrté', 'ctvrte', 'symfonie 4', 'symphony 4', 'nr. 4', 'no. 4'] },
  { id: '5', keys: ['vijfde', 'fifth', 'fünften', 'funften', 'páté', 'pate', 'symfonie 5', 'symphony 5', 'nr. 5', 'no. 5'] },
  { id: '6', keys: ['zesde', 'sixth', 'sechsten', 'sechste', 'šesté', 'seste', 'symfonie 6', 'symphony 6', 'nr. 6', 'no. 6'] },
  { id: '7', keys: ['zevende', 'seventh', 'siebten', 'siebte', 'sedmé', 'sedme', 'symfonie 7', 'symphony 7', 'nr. 7', 'no. 7'] },
  { id: '8', keys: ['achtste', 'eighth', 'achten', 'achte', 'osmé', 'osme', 'symfonie 8', 'symphony 8', 'nr. 8', 'no. 8', 'tausend', 'thousand'] },
  { id: '9', keys: ['negende', 'ninth', 'neunten', 'neunte', 'deváté', 'devate', 'symfonie 9', 'symphony 9', 'nr. 9', 'no. 9'] },
  { id: '10', keys: ['tiende', 'tenth', 'zehnten', 'zehnte', 'desáté', 'desate', 'cooke', 'symfonie 10', 'symphony 10', 'nr. 10', 'no. 10'] },
  { id: 'lied', keys: ['lied von der erde', 'lied van de aarde', 'das lied', 'píseň o zemi', 'pisen o zemi', 'song of the earth'] },
];

function norm(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function parsePlaces(text: string): string[] {
  const q = norm(text);
  const ids: string[] = [];
  for (const [id, keys] of Object.entries(PLACE_ALIASES)) {
    if (keys.some((k) => q.includes(norm(k)))) ids.push(id);
  }
  return ids;
}

export function parseWorks(text: string): WorkId[] {
  const q = norm(text);
  const fromWords = WORK_ALIASES.filter((w) => w.keys.some((k) => q.includes(norm(k)))).map((w) => w.id);
  const ord = q.match(/\b(?:(?:de|die|the)\s+)?(?:nr\.?|no\.?)?\s*([1-9]|10)\s*(?:e|de|ste|te|th|nd|rd|st)\b/)
    ?? q.match(/\b(?:nr\.?|no\.?)\s*([1-9]|10)\b/);
  if (ord) {
    const id = (ord[1] === '10' ? '10' : ord[1]) as WorkId;
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(id) && !fromWords.includes(id)) {
      fromWords.push(id);
    }
  }
  return fromWords;
}

function wantsCount(q: string): boolean {
  return /\b(hoe vaak|how often|how many|wie oft|wie oft|kolik|aantal|keer|times|maal|only|enkel|jednou)\b/i.test(q);
}

function wantsSelf(q: string): boolean {
  return /\b(zelf|bok|dirigeerde|dirigeren|conducted|himself|selbst|sam)\b/i.test(q);
}

function wantsBelgium(q: string): boolean {
  return /\b(belgie|belgium|belgien|belgie|luik|liege|antwerp|antwerpen|brussel|brussels|brusel|brussel)\b/i.test(norm(q));
}

function isSelfWork(id: WorkId): id is SelfWorkId {
  return ['1', '2', '3', '4', '5', '6', '7', '8'].includes(id);
}

function listNights(nights: SelfNight[], locale: Locale, limit = 8): string {
  return nights
    .slice(0, limit)
    .map((n) => {
      const city = placeById[n.placeId]?.city[locale] ?? n.placeId;
      return `${formatDate(n.date, locale)}, ${city}`;
    })
    .join('; ');
}

function answerNever(workId: WorkId, locale: Locale): QueryAnswer {
  const work = works.find((w) => w.id === workId);
  const row = neverSelfConducted.find((n) => n.workId === workId);
  const place = row?.placeId ? placeById[row.placeId] : undefined;
  const date = row?.date ? formatDate(row.date, locale) : '';
  const text: Localized = row?.unfinished
    ? {
        nl: `${work?.title.nl ?? 'Tiende'}: onvoltooid. Hij heeft haar nooit gedirigeerd. Geen complete uitvoering door hem.`,
        en: `${work?.title.en ?? 'Tenth'}: unfinished. He never conducted it. No complete performance by him.`,
        de: `${work?.title.de ?? 'Zehnte'}: unvollendet. Er hat sie nie dirigiert. Keine vollständige Aufführung durch ihn.`,
        cs: `${work?.title.cs ?? 'Desátá'}: nedokončena. Nikdy ji nedirigoval. Žádné úplné provedení jím.`,
      }
    : {
        nl: `${work?.title.nl}: nooit door hem. Première ${row?.conductor ?? 'Walter'}, ${date}${place ? `, ${place.city.nl}` : ''}.`,
        en: `${work?.title.en}: never by him. Premiere ${row?.conductor ?? 'Walter'}, ${date}${place ? `, ${place.city.en}` : ''}.`,
        de: `${work?.title.de}: nie durch ihn. Uraufführung ${row?.conductor ?? 'Walter'}, ${date}${place ? `, ${place.city.de}` : ''}.`,
        cs: `${work?.title.cs}: nikdy jím. Premiéra ${row?.conductor ?? 'Walter'}, ${date}${place ? `, ${place.city.cs}` : ''}.`,
      };
  return {
    text,
    extra: {
      nl: 'Fragmenten of later werk van anderen tellen hier niet.',
      en: 'Fragments or later work by others do not count here.',
      de: 'Fragmente oder spätere Arbeit anderer zählen hier nicht.',
      cs: 'Fragmenty nebo pozdější práce jiných se tu nepočítají.',
    },
    eventIds: row?.eventId ? [row.eventId] : [],
    unknown: false,
    inferred: false,
  };
}

function answerSelfCount(workId: SelfWorkId, locale: Locale): QueryAnswer {
  const complete = completeNights(workId);
  const fragments = fragmentNights(workId);
  const work = works.find((w) => w.id === workId);
  const prem = premiereNight(workId);
  const text: Localized = {
    nl: `${work?.title.nl}: ${complete.length} complete keren door hem. ${listNights(complete, 'nl')}.`,
    en: `${work?.title.en}: ${complete.length} complete times by him. ${listNights(complete, 'en')}.`,
    de: `${work?.title.de}: ${complete.length} vollständige Male durch ihn. ${listNights(complete, 'de')}.`,
    cs: `${work?.title.cs}: ${complete.length} úplných provedení jím. ${listNights(complete, 'cs')}.`,
  };
  void locale;
  const extra: Localized = fragments.length
    ? {
        nl: `${fragments.length} fragment${fragments.length === 1 ? '' : 'en'}, niet meegeteld: ${listNights(fragments, 'nl')}.`,
        en: `${fragments.length} fragment${fragments.length === 1 ? '' : 's'}, not counted: ${listNights(fragments, 'en')}.`,
        de: `${fragments.length} Fragment${fragments.length === 1 ? '' : 'e'}, nicht mitgezählt: ${listNights(fragments, 'de')}.`,
        cs: `${fragments.length} fragment${fragments.length === 1 ? '' : 'y'}, nepočítají se: ${listNights(fragments, 'cs')}.`,
      }
    : {
        nl: prem ? `Eerste keer dat hij haar dirigeerde: ${formatDate(prem.date, 'nl')}, ${placeById[prem.placeId]?.city.nl}.` : '',
        en: prem ? `First time he conducted it: ${formatDate(prem.date, 'en')}, ${placeById[prem.placeId]?.city.en}.` : '',
        de: prem ? `Zum ersten Mal unter ihm: ${formatDate(prem.date, 'de')}, ${placeById[prem.placeId]?.city.de}.` : '',
        cs: prem ? `Poprvé pod ním: ${formatDate(prem.date, 'cs')}, ${placeById[prem.placeId]?.city.cs}.` : '',
      };
  return {
    text,
    extra,
    eventIds: complete.map((n) => n.id),
    unknown: false,
    inferred: false,
  };
}

function answerBelgium(): QueryAnswer {
  const nights = belgiumComplete();
  return {
    text: {
      nl: `België: precies twee complete avonden. ${listNights(nights, 'nl')} (Tweede in Luik; Vijfde in Antwerpen). Geen Brussel.`,
      en: `Belgium: exactly two complete nights. ${listNights(nights, 'en')} (Second in Liège; Fifth in Antwerp). No Brussels.`,
      de: `Belgien: genau zwei vollständige Abende. ${listNights(nights, 'de')} (Zweite in Lüttich; Fünfte in Antwerpen). Kein Brüssel.`,
      cs: `Belgie: přesně dva úplné večery. ${listNights(nights, 'cs')} (Druhá v Lutychu; Pátá v Antverpách). Žádný Brusel.`,
    },
    extra: {
      nl: 'Fragmenten tellen niet. Bron: Mahler Foundation / Martner–Banks (mahlercat).',
      en: 'Fragments are not counted. Source: Mahler Foundation / Martner–Banks (mahlercat).',
      de: 'Fragmente zählen nicht. Quelle: Mahler Foundation / Martner–Banks (mahlercat).',
      cs: 'Fragmenty se nepočítají. Zdroj: Mahler Foundation / Martner–Banks (mahlercat).',
    },
    eventIds: nights.map((n) => n.id),
    unknown: false,
    inferred: false,
  };
}

function answerNewYork(): QueryAnswer {
  const all = nightsInCity('New York').filter((n) => n.completeness === 'complete');
  const y1908 = selfStats.newYork[1908];
  const y1909 = selfStats.newYork[1909];
  const y1911 = selfStats.newYork[1911];
  return {
    text: {
      nl: `New York onder hem: ${all.length} complete avonden. 1908 de Tweede (${y1908.length}, New York Symphony); 1909 de Eerste (${y1909.length} avonden); 1911 de Vierde (${y1911.length} avonden). Geen Zevende.`,
      en: `New York under him: ${all.length} complete nights. 1908 the Second (${y1908.length}, New York Symphony); 1909 the First (${y1909.length} nights); 1911 the Fourth (${y1911.length} nights). No Seventh.`,
      de: `New York unter ihm: ${all.length} vollständige Abende. 1908 die Zweite (${y1908.length}, New York Symphony); 1909 die Erste (${y1909.length} Abende); 1911 die Vierte (${y1911.length} Abende). Keine Siebte.`,
      cs: `New York pod ním: ${all.length} úplných večerů. 1908 Druhá (${y1908.length}, New York Symphony); 1909 První (${y1909.length} večery); 1911 Čtvrtá (${y1911.length} večery). Žádná Sedmá.`,
    },
    extra: {
      nl: 'Geen zaal in de bronlijst. Stadspin.',
      en: 'No hall in the source list. City pin.',
      de: 'Kein Saal in der Quellenliste. Stadtpin.',
      cs: 'Ve zdrojovém seznamu není sál. Pin města.',
    },
    eventIds: all.map((n) => n.id),
    unknown: false,
    inferred: false,
  };
}

function premiereOf(workId: WorkId): AtlasEvent | undefined {
  return allEvents.find((e) => e.workId === workId && e.type === 'premiere' && !e.posthumous)
    ?? allEvents.find((e) => e.workId === workId && e.type === 'premiere');
}

function eventsForPlace(placeId: string): AtlasEvent[] {
  const city = placeById[placeId]?.city.en;
  return allEvents.filter((e) => {
    if (e.placeId === placeId) return true;
    const p = eventPlace(e);
    return city ? p?.city.en === city : false;
  });
}

function wantsWhere(q: string): boolean {
  return /\b(waar|where|wo|kde|was mahler|zat mahler)\b/i.test(q);
}

function wantsHouse(q: string): boolean {
  return /\b(huis|house|theater|theatre|oper|orkest|orchestra|kapellmeister|directeur|director|affiliation|betrekking|poste?)\b/i.test(q);
}

export function answerQuery(raw: string, locale: Locale, opts?: { deep?: boolean }): QueryAnswer {
  const q = raw.trim();
  if (!q) {
    return empty(locale);
  }

  const dates = parseDatesFromText(q);
  const worksFound = parseWorks(q);
  const placesFound = parsePlaces(q);

  if (dates.length) {
    const hit = locateOnDate(dates[0], opts);
    const d = describeHit(hit, locale);
    if (worksFound.length && hit.event?.workId !== worksFound[0]) {
      const prem = premiereOf(worksFound[0]);
      if (prem) {
        return {
          text: merge(d.body, prem.summary, locale),
          extra: prem.extra,
          eventIds: [...d.eventIds, prem.id],
          unknown: false,
          inferred: d.inferred,
        };
      }
    }
    return {
      text: d.body,
      extra: d.extra,
      eventIds: d.eventIds,
      unknown: d.eventIds.length === 0,
      inferred: d.inferred,
    };
  }

  if (wantsBelgium(q) && !wantsHouse(q)) {
    return answerBelgium();
  }

  if (worksFound.length && (worksFound[0] === '9' || worksFound[0] === 'lied' || worksFound[0] === '10')) {
    return answerNever(worksFound[0], locale);
  }

  if (worksFound.length && isSelfWork(worksFound[0]) && (wantsCount(q) || wantsSelf(q))) {
    return answerSelfCount(worksFound[0], locale);
  }

  const asksNy = placesFound.includes('new_york') || /\bnew york|nieuw-york|nieuw york\b/.test(norm(q));
  if (asksNy && !wantsHouse(q) && (wantsCount(q) || wantsSelf(q) || worksFound.length > 0 || /^[\s\w.-]{0,24}$/.test(q))) {
    return answerNewYork();
  }

  if (worksFound.length && isSelfWork(worksFound[0]) && (wantsCount(q) || wantsSelf(q) || /\b(vaak|often|many|keer)\b/i.test(q))) {
    return answerSelfCount(worksFound[0], locale);
  }

  if (worksFound.length && (/\b(premiere|première|premiéra|premiére|eerst|first|erst|poprvé|poprve|wanneer|when|wann|kdy)\b/i.test(q) || wantsWhere(q) || q.length < 40)) {
    const prem = premiereOf(worksFound[0]);
    const work = works.find((w) => w.id === worksFound[0]);
    if (prem) {
      const place = eventPlace(prem);
      return {
        text: {
          nl: `${work?.title.nl ?? 'Werk'}: ${prem.summary.nl}${place?.venue ? ` ${place.venue.nl}.` : ''} Dirigent: ${prem.conductor ?? '—'}.`,
          en: `${work?.title.en ?? 'Work'}: ${prem.summary.en}${place?.venue ? ` ${place.venue.en}.` : ''} Conductor: ${prem.conductor ?? '—'}.`,
          de: `${work?.title.de ?? 'Werk'}: ${prem.summary.de}${place?.venue ? ` ${place.venue.de}.` : ''} Dirigent: ${prem.conductor ?? '—'}.`,
          cs: `${work?.title.cs ?? 'Dílo'}: ${prem.summary.cs}${place?.venue ? ` ${place.venue.cs}.` : ''} Dirigent: ${prem.conductor ?? '—'}.`,
        },
        extra: prem.extra,
        eventIds: [prem.id],
        unknown: false,
        inferred: false,
      };
    }
  }

  if (placesFound.length && (wantsWhere(q) || wantsHouse(q) || worksFound.length === 0)) {
    const id = placesFound[0];
    const aff = affiliations.find((a) => a.placeId === id || placeById[a.placeId]?.city.en === placeById[id]?.city.en);
    const cityEvents = eventsForPlace(id)
      .filter((e) => (opts?.deep ? true : !e.deep))
      .sort((a, b) => a.dateStart.localeCompare(b.dateStart));
    const first = cityEvents[0];
    if (!aff && !first) {
      return {
        text: {
          nl: 'Geen gedocumenteerd Mahler-feit voor die stad in deze dataset. Geen verzinsel.',
          en: 'No documented Mahler fact for that city in this dataset. Nothing invented.',
          de: 'Kein belegter Mahler-Fakt für diese Stadt in diesem Datensatz. Nichts erfunden.',
          cs: 'Pro to město v těchto datech není doložený Mahlerův fakt. Nic si nevymýšlím.',
        },
        eventIds: [],
        unknown: true,
        inferred: false,
      };
    }
    if (aff) {
      return {
        text: {
          nl: `${aff.name.nl}: ${aff.summary.nl}`,
          en: `${aff.name.en}: ${aff.summary.en}`,
          de: `${aff.name.de}: ${aff.summary.de}`,
          cs: `${aff.name.cs}: ${aff.summary.cs}`,
        },
        extra: first?.extra ?? aff.extra,
        eventIds: [first?.id ?? `aff-${aff.id}`],
        unknown: false,
        inferred: false,
      };
    }
    if (first) {
      return {
        text: first.summary,
        extra: first.extra,
        eventIds: [first.id],
        unknown: false,
        inferred: false,
      };
    }
  }

  if (worksFound.length) {
    if (worksFound[0] === '9' || worksFound[0] === 'lied' || worksFound[0] === '10') {
      return answerNever(worksFound[0], locale);
    }
    if (isSelfWork(worksFound[0])) {
      return answerSelfCount(worksFound[0], locale);
    }
  }

  const year = parseYearFromText(q);
  if (year) {
    const iso = `${year}-07-01`;
    const covering = eventsOnDate(iso, opts);
    if (covering[0]) {
      const d = describeHit({ kind: 'event', event: covering[0], inferred: true }, locale);
      return { text: d.body, extra: d.extra, eventIds: d.eventIds, unknown: false, inferred: true };
    }
  }

  return {
    text: {
      nl: 'Dat staat niet in deze dataset. Geen verzinsel. Probeer een datum, een stad of een symfonie.',
      en: 'That is not in this dataset. Nothing invented. Try a date, a city, or a symphony.',
      de: 'Das steht nicht in diesem Datensatz. Nichts erfunden. Versuchen Sie ein Datum, eine Stadt oder eine Sinfonie.',
      cs: 'To v těchto datech není. Nic si nevymýšlím. Zkuste datum, město nebo symfonii.',
    },
    extra: {
      nl: 'Voorbeeld: “Waar was Mahler op 19 september 1908?”',
      en: 'Example: “Where was Mahler on 19 September 1908?”',
      de: 'Beispiel: „Wo war Mahler am 19. September 1908?“',
      cs: 'Příklad: „Kde byl Mahler 19. září 1908?“',
    },
    eventIds: [],
    unknown: true,
    inferred: false,
  };
}

function empty(locale: Locale): QueryAnswer {
  void locale;
  return {
    text: {
      nl: 'Stel een korte vraag. Datum, stad, huis of symfonie.',
      en: 'Ask a short question. Date, city, house or symphony.',
      de: 'Stellen Sie eine kurze Frage. Datum, Stadt, Haus oder Sinfonie.',
      cs: 'Položte krátkou otázku. Datum, město, dům nebo symfonie.',
    },
    eventIds: [],
    unknown: true,
    inferred: false,
  };
}

function merge(a: QueryAnswer['text'], b: QueryAnswer['text'], locale: Locale): QueryAnswer['text'] {
  void locale;
  return {
    nl: `${a.nl} ${b.nl}`,
    en: `${a.en} ${b.en}`,
    de: `${a.de} ${b.de}`,
    cs: `${a.cs} ${b.cs}`,
  };
}
