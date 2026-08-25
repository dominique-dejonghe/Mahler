import { affiliations, allEvents, eventPlace, placeById, works } from '../data';
import type { AtlasEvent, Locale, QueryAnswer, WorkId } from '../types';
import { parseDatesFromText, parseYearFromText } from './dates';
import { describeHit, eventsOnDate, locateOnDate } from './locate';

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
  budapest_opera: ['boedapest', 'budapest', 'budapešť', 'budapest'],
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
  new_york_carnegie: ['new york', 'nieuw-york', 'ny phil', 'philharmonic', 'carnegie'],
  london: ['londen', 'london', 'londýn', 'proms'],
  paris: ['parijs', 'paris', 'paříž', 'pariz'],
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
  return WORK_ALIASES.filter((w) => w.keys.some((k) => q.includes(norm(k)))).map((w) => w.id);
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
    const list = allEvents.filter((e) => e.workId === worksFound[0] && e.type !== 'life').slice(0, 4);
    const prem = premiereOf(worksFound[0]);
    if (prem) {
      return {
        text: prem.summary,
        extra: {
          nl: `In deze dataset ${list.length} gedocumenteerde rijen. Geen complete Martner.`,
          en: `${list.length} documented rows in this dataset. Not a complete Martner.`,
          de: `${list.length} belegte Zeilen in diesem Datensatz. Kein vollständiger Martner.`,
          cs: `${list.length} doložených řádků v těchto datech. Ne úplný Martner.`,
        },
        eventIds: list.map((e) => e.id),
        unknown: false,
        inferred: false,
      };
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
