/**
 * Times Mahler himself conducted his own symphonies (1–8).
 *
 * Encoded as given from Mahler Foundation / Martner–Banks (mahlercat).
 * Do not pad this list to hit a target.
 *
 * Check after encoding (not a quota):
 *   8 works (1–8)
 *   71 complete public performances by him
 *   4 fragments, marked separately, not counted as complete
 *   6th: 3   7th: 5   8th: only 12 + 13 Sep 1910 Munich
 *   New York: 2 (1908, NY Symphony), 1 (1909, two nights), 4 (1911, two nights)
 *   Belgium complete: exactly 2 (Liège 1899-01-22 Second; Antwerp 1906-03-05 Fifth). No Brussels.
 *
 * Hall only when the source list names one. City pin otherwise.
 */
import { formatDate } from '../lib/dates';
import type { AtlasEvent, Localized, Source, WorkId } from '../types';
import { placeById } from './places';
import { workById } from './works';

const MF = 'https://mahlerfoundation.org/';
const SRC_LABEL = 'Mahler Foundation / Martner–Banks (mahlercat)';

export type SelfWorkId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export interface SelfNight {
  id: string;
  workId: SelfWorkId;
  date: string;
  placeId: string;
  completeness: 'complete' | 'fragment';
  premiere?: boolean;
  halfPremiere?: boolean;
  hall?: Localized;
  fragmentScope?: Localized;
  formNote?: Localized;
  extra?: Localized;
  orchestra?: Localized;
  belgium?: boolean;
  source: Source;
}

function L(name: string): Localized {
  return { nl: name, en: name, de: name, cs: name };
}

function src(work: SelfWorkId): Source {
  return {
    label: `${SRC_LABEL} — Symphony No. ${work}`,
    url: `${MF}mahler/compositions/symphony-no-${work}/symphony-no-${work}-history/`,
  };
}

const MOV_13: Localized = { nl: 'delen 1–3', en: 'movements 1–3', de: 'Sätze 1–3', cs: 'věty 1–3' };
const MOV_12: Localized = { nl: 'delen 1–2', en: 'movements 1–2', de: 'Sätze 1–2', cs: 'věty 1–2' };
const MOV_2: Localized = { nl: 'alleen deel 2', en: 'movement 2 only', de: 'nur Satz 2', cs: 'jen 2. věta' };
const ADAGIETTO: Localized = { nl: 'alleen het Adagietto', en: 'Adagietto only', de: 'nur das Adagietto', cs: 'jen Adagietto' };

const BE_EXTRA: Localized = {
  nl: 'Een van de twee complete Belgische avonden. Geen Brussel.',
  en: 'One of the two complete Belgian nights. No Brussels.',
  de: 'Einer der zwei vollständigen belgischen Abende. Kein Brüssel.',
  cs: 'Jeden ze dvou úplných belgických večerů. Žádný Brusel.',
};

/**
 * One row per public night. Flags: P premiere, H half-premiere, F fragment, B Belgium.
 * Optional hall is the only hall we will show.
 */
const ROWS: Array<{
  id: string;
  workId: SelfWorkId;
  date: string;
  placeId: string;
  flags?: string;
  hall?: string;
}> = [
  /* 1 — 16 complete */
  { id: 'prem-1-1889', workId: '1', date: '1889-11-20', placeId: 'budapest_vigado', flags: 'P', hall: 'Vigadó' },
  { id: 'life-1-hamburg-1893', workId: '1', date: '1893-10-27', placeId: 'hamburg' },
  { id: 'self-1-weimar-1894', workId: '1', date: '1894-06-03', placeId: 'weimar' },
  { id: 'self-1-berlin-1896', workId: '1', date: '1896-03-16', placeId: 'berlin' },
  { id: 'prague-s1-1898', workId: '1', date: '1898-03-03', placeId: 'prague' },
  { id: 'self-1-frankfurt-1899', workId: '1', date: '1899-03-08', placeId: 'frankfurt' },
  { id: 'self-1-vienna-1900', workId: '1', date: '1900-11-18', placeId: 'vienna' },
  { id: 'self-1-lemberg-1903-04-02', workId: '1', date: '1903-04-02', placeId: 'lemberg' },
  { id: 'self-1-lemberg-1903-04-04', workId: '1', date: '1903-04-04', placeId: 'lemberg' },
  { id: 'self-1-amsterdam-1903', workId: '1', date: '1903-10-25', placeId: 'amsterdam' },
  { id: 'self-1-brno-1906', workId: '1', date: '1906-11-11', placeId: 'brno' },
  { id: 'self-1-linz-1907', workId: '1', date: '1907-01-20', placeId: 'linz' },
  { id: 'self-1-trieste-1907', workId: '1', date: '1907-04-04', placeId: 'trieste' },
  { id: 'self-1-wiesbaden-1908', workId: '1', date: '1908-05-08', placeId: 'wiesbaden' },
  { id: 'self-1-ny-1909-12-16', workId: '1', date: '1909-12-16', placeId: 'new_york' },
  { id: 'self-1-ny-1909-12-17', workId: '1', date: '1909-12-17', placeId: 'new_york' },

  /* 2 — 10 complete + 2 fragments */
  { id: 'prem-2-partial-1895', workId: '2', date: '1895-03-04', placeId: 'berlin_philharmonie', flags: 'HF', hall: 'Philharmonie' },
  { id: 'prem-2-1895', workId: '2', date: '1895-12-13', placeId: 'berlin_philharmonie', flags: 'P', hall: 'Philharmonie' },
  { id: 'self-2-leipzig-1896', workId: '2', date: '1896-12-14', placeId: 'leipzig', flags: 'F' },
  { id: 'self-2-liege-1899', workId: '2', date: '1899-01-22', placeId: 'liege', flags: 'B' },
  { id: 'self-2-vienna-1899', workId: '2', date: '1899-04-09', placeId: 'vienna' },
  { id: 'self-2-munich-1900', workId: '2', date: '1900-10-20', placeId: 'munich' },
  { id: 'self-2-basel-1903', workId: '2', date: '1903-06-15', placeId: 'basel' },
  { id: 'life-2-amsterdam-1904', workId: '2', date: '1904-10-26', placeId: 'amsterdam' },
  { id: 'self-2-amsterdam-1904-10-27', workId: '2', date: '1904-10-27', placeId: 'amsterdam' },
  { id: 'self-2-vienna-1907', workId: '2', date: '1907-11-24', placeId: 'vienna' },
  { id: 'life-2-ny-1908', workId: '2', date: '1908-12-08', placeId: 'new_york' },
  { id: 'life-2-paris-1910', workId: '2', date: '1910-04-17', placeId: 'paris' },

  /* 3 — 15 complete + 1 fragment (before the premiere) */
  { id: 'self-3-budapest-1897', workId: '3', date: '1897-03-31', placeId: 'budapest', flags: 'F' },
  { id: 'prem-3-1902', workId: '3', date: '1902-06-09', placeId: 'krefeld', flags: 'P', hall: 'Stadthalle' },
  { id: 'life-3-amsterdam-1903', workId: '3', date: '1903-10-22', placeId: 'amsterdam' },
  { id: 'self-3-amsterdam-1903-10-23', workId: '3', date: '1903-10-23', placeId: 'amsterdam' },
  { id: 'self-3-frankfurt-1903', workId: '3', date: '1903-12-02', placeId: 'frankfurt' },
  { id: 'self-3-heidelberg-1904', workId: '3', date: '1904-02-01', placeId: 'heidelberg' },
  { id: 'self-3-mannheim-1904', workId: '3', date: '1904-02-02', placeId: 'mannheim' },
  { id: 'prague-s3-1904', workId: '3', date: '1904-02-25', placeId: 'prague' },
  { id: 'self-3-cologne-1904', workId: '3', date: '1904-03-27', placeId: 'cologne' },
  { id: 'self-3-leipzig-1904', workId: '3', date: '1904-11-28', placeId: 'leipzig' },
  { id: 'self-3-vienna-1904-12-14', workId: '3', date: '1904-12-14', placeId: 'vienna' },
  { id: 'self-3-vienna-1904-12-22', workId: '3', date: '1904-12-22', placeId: 'vienna' },
  { id: 'self-3-breslau-1906', workId: '3', date: '1906-10-24', placeId: 'breslau' },
  { id: 'self-3-graz-1906-12-03', workId: '3', date: '1906-12-03', placeId: 'graz' },
  { id: 'self-3-graz-1906-12-23', workId: '3', date: '1906-12-23', placeId: 'graz' },
  { id: 'self-3-berlin-1907', workId: '3', date: '1907-01-14', placeId: 'berlin' },

  /* 4 — 11 complete (Amsterdam 23 Oct 1904 twice the same evening) */
  { id: 'prem-4-1901', workId: '4', date: '1901-11-25', placeId: 'munich_kaim', flags: 'P', hall: 'Kaim-Saal' },
  { id: 'self-4-berlin-1901', workId: '4', date: '1901-12-16', placeId: 'berlin' },
  { id: 'self-4-vienna-1902-01-12', workId: '4', date: '1902-01-12', placeId: 'vienna' },
  { id: 'self-4-vienna-1902-01-20', workId: '4', date: '1902-01-20', placeId: 'vienna' },
  { id: 'self-4-wiesbaden-1903', workId: '4', date: '1903-01-23', placeId: 'wiesbaden' },
  { id: 'self-4-mainz-1904', workId: '4', date: '1904-03-23', placeId: 'mainz' },
  { id: 'self-4-amsterdam-1904-a', workId: '4', date: '1904-10-23', placeId: 'amsterdam' },
  { id: 'self-4-amsterdam-1904-b', workId: '4', date: '1904-10-23', placeId: 'amsterdam' },
  { id: 'self-4-frankfurt-1907', workId: '4', date: '1907-01-18', placeId: 'frankfurt' },
  { id: 'life-4-ny-1911', workId: '4', date: '1911-01-17', placeId: 'new_york' },
  { id: 'self-4-ny-1911-01-20', workId: '4', date: '1911-01-20', placeId: 'new_york' },

  /* 5 — 9 complete + 1 fragment */
  { id: 'prem-5-1904', workId: '5', date: '1904-10-18', placeId: 'cologne_gurzenich', flags: 'P', hall: 'Gürzenich' },
  { id: 'self-5-hamburg-1905', workId: '5', date: '1905-03-13', placeId: 'hamburg' },
  { id: 'self-5-strasbourg-1905', workId: '5', date: '1905-05-21', placeId: 'strasbourg' },
  { id: 'self-5-trieste-1905', workId: '5', date: '1905-12-01', placeId: 'trieste' },
  { id: 'self-5-vienna-1905', workId: '5', date: '1905-12-07', placeId: 'vienna' },
  { id: 'self-5-breslau-1905', workId: '5', date: '1905-12-20', placeId: 'breslau' },
  { id: 'self-5-antwerp-1906', workId: '5', date: '1906-03-05', placeId: 'antwerp', flags: 'B' },
  { id: 'self-5-amsterdam-1906', workId: '5', date: '1906-03-08', placeId: 'amsterdam' },
  { id: 'self-5-rome-1907', workId: '5', date: '1907-04-01', placeId: 'rome', flags: 'F' },
  { id: 'self-5-petersburg-1907', workId: '5', date: '1907-11-09', placeId: 'st_petersburg' },

  /* 6 — 3 complete */
  { id: 'prem-6-1906', workId: '6', date: '1906-05-27', placeId: 'essen', flags: 'P', hall: 'Städtischer Saalbau' },
  { id: 'self-6-munich-1906', workId: '6', date: '1906-11-08', placeId: 'munich' },
  { id: 'self-6-vienna-1907', workId: '6', date: '1907-01-04', placeId: 'vienna' },

  /* 7 — 5 complete. No New York. */
  { id: 'prem-7-1908', workId: '7', date: '1908-09-19', placeId: 'prague_vystaviste', flags: 'P', hall: 'Zasche-paviljoen, Výstaviště' },
  { id: 'self-7-munich-1908', workId: '7', date: '1908-10-27', placeId: 'munich' },
  { id: 'self-7-hague-1909', workId: '7', date: '1909-10-02', placeId: 'the_hague' },
  { id: 'life-7-amsterdam-1909', workId: '7', date: '1909-10-03', placeId: 'amsterdam' },
  { id: 'self-7-amsterdam-1909-10-07', workId: '7', date: '1909-10-07', placeId: 'amsterdam' },

  /* 8 — only Munich 12 + 13 Sep 1910 */
  { id: 'prem-8-1910', workId: '8', date: '1910-09-12', placeId: 'munich_festhalle', flags: 'P', hall: 'Neue Musik-Festhalle' },
  { id: 'self-8-munich-1910-09-13', workId: '8', date: '1910-09-13', placeId: 'munich_festhalle', hall: 'Neue Musik-Festhalle' },
];

const NOTES: Record<string, { formNote?: Localized; extra?: Localized; orchestra?: Localized; fragmentScope?: Localized; hall?: Localized }> = {
  'prem-1-1889': {
    formNote: {
      nl: 'Toen Symphonische Dichtung, vijf delen.',
      en: 'Then a Symphonische Dichtung, five movements.',
      de: 'Damals Symphonische Dichtung, fünf Sätze.',
      cs: 'Tehdy Symphonische Dichtung, pět vět.',
    },
    extra: {
      nl: 'Mislukt. Hamburg 27 oktober 1893 is de herziene “Titan”.',
      en: 'It failed. Hamburg 27 October 1893 is the revised “Titan”.',
      de: 'Durchgefallen. Hamburg 27. Oktober 1893 ist der überarbeitete „Titan“.',
      cs: 'Neuspěla. Hamburk 27. října 1893 je revidovaný „Titan“.',
    },
  },
  'life-1-hamburg-1893': {
    extra: {
      nl: 'Herziene Titan-versie, nog mét Blumine.',
      en: 'Revised Titan version, still with Blumine.',
      de: 'Überarbeitete Titan-Fassung, noch mit Blumine.',
      cs: 'Revidovaná verze Titan, stále s Blumine.',
    },
  },
  'self-1-berlin-1896': {
    formNote: {
      nl: 'Eerste vierdelige vorm.',
      en: 'First four-movement form.',
      de: 'Erste viersätzige Form.',
      cs: 'První čtyřvětá podoba.',
    },
  },
  'self-1-linz-1907': {
    extra: {
      nl: 'Linz. Niet Lienz.',
      en: 'Linz. Not Lienz.',
      de: 'Linz. Nicht Lienz.',
      cs: 'Linec. Ne Lienz.',
    },
  },
  'prem-2-partial-1895': {
    fragmentScope: MOV_13,
    extra: {
      nl: 'Halfpremière. De complete avond volgt 13 december 1895, dezelfde Philharmonie.',
      en: 'Half-premiere. The complete night follows on 13 December 1895, same Philharmonie.',
      de: 'Halbpremiere. Der vollständige Abend folgt am 13. Dezember 1895, dieselbe Philharmonie.',
      cs: 'Poloviční premiéra. Úplný večer následuje 13. prosince 1895, stejná Philharmonie.',
    },
  },
  'self-2-leipzig-1896': {
    fragmentScope: MOV_12,
    extra: {
      nl: 'Alleen delen 1–2. Telt niet als complete Tweede.',
      en: 'Movements 1–2 only. Not counted as a complete Second.',
      de: 'Nur Sätze 1–2. Zählt nicht als vollständige Zweite.',
      cs: 'Jen věty 1–2. Nepočítá se jako celá Druhá.',
    },
  },
  'self-2-liege-1899': { extra: BE_EXTRA },
  'life-2-ny-1908': {
    orchestra: L('New York Symphony'),
    extra: {
      nl: 'New York Symphony. Zijn enige Tweede in New York. Geen zaal in de bronlijst.',
      en: 'New York Symphony. His only Second in New York. No hall in the source list.',
      de: 'New York Symphony. Seine einzige Zweite in New York. Kein Saal in der Quellenliste.',
      cs: 'New York Symphony. Jeho jediná Druhá v New Yorku. Ve zdroji není sál.',
    },
  },
  'life-2-paris-1910': {
    extra: {
      nl: 'Laatste Tweede onder hem. Stadspin.',
      en: 'His last Second. City pin.',
      de: 'Seine letzte Zweite. Stadtpin.',
      cs: 'Jeho poslední Druhá. Pin města.',
    },
  },
  'self-3-budapest-1897': {
    fragmentScope: MOV_2,
    extra: {
      nl: 'Vóór Krefeld. Alleen deel 2. Telt niet als complete Derde.',
      en: 'Before Krefeld. Movement 2 only. Not counted as a complete Third.',
      de: 'Vor Krefeld. Nur Satz 2. Zählt nicht als vollständige Dritte.',
      cs: 'Před Krefeldem. Jen 2. věta. Nepočítá se jako celá Třetí.',
    },
  },
  'prem-3-1902': {
    extra: {
      nl: 'Na de Vierde. Tonkünstlerversammlung des Allgemeinen Deutschen Musikvereins.',
      en: 'After the Fourth. Tonkünstlerversammlung of the Allgemeiner Deutscher Musikverein.',
      de: 'Nach der Vierten. Tonkünstlerversammlung des Allgemeinen Deutschen Musikvereins.',
      cs: 'Po Čtvrté. Tonkünstlerversammlung Allgemeiner Deutscher Musikverein.',
    },
  },
  'prem-4-1901': {
    extra: {
      nl: 'Kaim-Saal/Tonhalle is verdwenen. Pin is stadsniveau.',
      en: 'Kaim Hall/Tonhalle is gone. Pin is city-level.',
      de: 'Kaim-Saal/Tonhalle ist weg. Pin auf Stadtebene.',
      cs: 'Kaimův sál/Tonhalle zanikl. Pin na úrovni města.',
    },
    orchestra: { nl: 'Kaim-Orchester', en: 'Kaim Orchestra', de: 'Kaim-Orchester', cs: 'Kaimův orchestr' },
  },
  'self-4-amsterdam-1904-a': {
    extra: {
      nl: 'Eerste van twee complete Vierdes dezelfde avond. Telt als twee.',
      en: 'First of two complete Fourths the same evening. Counts as two.',
      de: 'Erste von zwei vollständigen Vierten am selben Abend. Zählt als zwei.',
      cs: 'První ze dvou úplných Čtvrtých téhož večera. Počítá se jako dvě.',
    },
  },
  'self-4-amsterdam-1904-b': {
    extra: {
      nl: 'Tweede van twee complete Vierdes dezelfde avond. Telt als twee.',
      en: 'Second of two complete Fourths the same evening. Counts as two.',
      de: 'Zweite von zwei vollständigen Vierten am selben Abend. Zählt als zwei.',
      cs: 'Druhá ze dvou úplných Čtvrtých téhož večera. Počítá se jako dvě.',
    },
  },
  'prem-5-1904': {
    orchestra: { nl: 'Gürzenich-Orchester', en: 'Gürzenich Orchestra', de: 'Gürzenich-Orchester', cs: 'Gürzenichův orchestr' },
    extra: {
      nl: 'Mengelberg erft later de Adagietto-aantekeningen. Dat is receptie, geen première.',
      en: 'Mengelberg later inherits the Adagietto markings. That is reception, not premiere.',
      de: 'Mengelberg erbt später die Adagietto-Einträge. Das ist Rezeption, keine Premiere.',
      cs: 'Mengelberg později dědí značky Adagietta. To je recepce, ne premiéra.',
    },
  },
  'self-5-antwerp-1906': { extra: BE_EXTRA },
  'self-5-rome-1907': {
    fragmentScope: ADAGIETTO,
    extra: {
      nl: 'Alleen het Adagietto. Telt niet als complete Vijfde.',
      en: 'Adagietto only. Not counted as a complete Fifth.',
      de: 'Nur das Adagietto. Zählt nicht als vollständige Fünfte.',
      cs: 'Jen Adagietto. Nepočítá se jako celá Pátá.',
    },
  },
  'prem-6-1906': {
    extra: {
      nl: 'Tijdens repetities wisselt hij de binnenste delen. Andante/Scherzo is wat hij zelf daarna speelt.',
      en: 'In rehearsal he swaps the inner movements. Andante/Scherzo is what he himself plays thereafter.',
      de: 'In den Proben tauscht er die Innensätze. Andante/Scherzo ist, was er selbst danach spielt.',
      cs: 'Na zkouškách mění vnitřní věty. Andante/Scherzo je to, co pak sám hraje.',
    },
  },
  'prem-7-1908': {
    hall: {
      nl: 'Zasche-paviljoen, Výstaviště (afgebroken; niet de Průmyslový palác)',
      en: 'Zasche pavilion, Výstaviště (demolished; not the Průmyslový palác)',
      de: 'Zasche-Pavillon, Výstaviště (abgerissen; nicht der Průmyslový palác)',
      cs: 'Zascheho pavilon, Výstaviště (zbořen; ne Průmyslový palác)',
    },
    orchestra: {
      nl: 'Česká filharmonie + leden Neues Deutsches Theater',
      en: 'Czech Philharmonic + players from the New German Theatre',
      de: 'Tschechische Philharmonie + Mitglieder des Neuen Deutschen Theaters',
      cs: 'Česká filharmonie + hráči Nového německého divadla',
    },
    extra: {
      nl: 'Aankomst 5 september. Generale 18 september 12u. Trams stil tijdens de première. Logies: hotel Modrá hvězda (bestaande bron; geen nieuw hotel).',
      en: 'Arrival 5 September. General rehearsal 18 September at noon. Trams stopped during the premiere. Lodging: Hotel Modrá hvězda (existing source; no new hotel).',
      de: 'Ankunft 5. September. Generalprobe 18. September mittags. Straßenbahnen standen während der Premiere. Quartier: Hotel Modrá hvězda (bestehende Quelle; kein neues Hotel).',
      cs: 'Příjezd 5. září. Generálka 18. září v poledne. Tramvaje stály během premiéry. Ubytování: hotel Modrá hvězda (existující zdroj; žádný nový hotel).',
    },
  },
  'prem-8-1910': {
    extra: {
      nl: 'Gutmanns bijnaam “der Tausend” — hij lustte die niet. In de zaal o.a. Strauss, Saint-Saëns, Webern, Thomas Mann, Stokowski.',
      en: 'Gutmann’s nickname “of a Thousand” — he disliked it. In the hall: Strauss, Saint-Saëns, Webern, Thomas Mann, Stokowski, among others.',
      de: 'Gutmanns Beiname „der Tausend“ — er mochte ihn nicht. Im Saal u. a. Strauss, Saint-Saëns, Webern, Thomas Mann, Stokowski.',
      cs: 'Gutmannova přezdívka „Tisíců“ — nelíbila se mu. V sále mj. Strauss, Saint-Saëns, Webern, Thomas Mann, Stokowski.',
    },
    orchestra: {
      nl: 'Vergroot Konzertverein München (~170)',
      en: 'Enlarged Munich Konzertverein (~170)',
      de: 'Vergrößerter Münchner Konzertverein (~170)',
      cs: 'Rozšířený mnichovský Konzertverein (~170)',
    },
  },
  'self-8-munich-1910-09-13': {
    extra: {
      nl: 'De enige reprise. Geen derde avond.',
      en: 'The only reprise. No third night.',
      de: 'Die einzige Wiederholung. Kein dritter Abend.',
      cs: 'Jediná repríza. Žádný třetí večer.',
    },
  },
};

function hallFor(row: (typeof ROWS)[number], note?: (typeof NOTES)[string]): Localized | undefined {
  if (note?.hall) return note.hall;
  if (row.hall) {
    if (row.id === 'prem-7-1908') {
      return {
        nl: 'Zasche-paviljoen, Výstaviště',
        en: 'Zasche pavilion, Výstaviště',
        de: 'Zasche-Pavillon, Výstaviště',
        cs: 'Zascheho pavilon, Výstaviště',
      };
    }
    return L(row.hall);
  }
  return undefined;
}

function fragmentScopeFor(flags: string, note?: (typeof NOTES)[string]): Localized | undefined {
  if (note?.fragmentScope) return note.fragmentScope;
  if (flags.includes('H')) return MOV_13;
  return undefined;
}

export const selfNights: SelfNight[] = ROWS.map((row) => {
  const flags = row.flags ?? '';
  const note = NOTES[row.id];
  const completeness: SelfNight['completeness'] = flags.includes('F') ? 'fragment' : 'complete';
  return {
    id: row.id,
    workId: row.workId,
    date: row.date,
    placeId: row.placeId,
    completeness,
    premiere: flags.includes('P') || undefined,
    halfPremiere: flags.includes('H') || undefined,
    belgium: flags.includes('B') || undefined,
    hall: hallFor(row, note),
    fragmentScope: fragmentScopeFor(flags, note),
    formNote: note?.formNote,
    extra: note?.extra,
    orchestra: note?.orchestra,
    source: row.id === 'prem-7-1908'
      ? {
          label: `${SRC_LABEL} — Exhibition Concert Hall; Symphony No. 7`,
          url: `${MF}mahler/locations/czech-republic/prague/concert-hall/`,
        }
      : row.id === 'prem-8-1910'
        ? {
            label: `${SRC_LABEL} — 1910 Concert Munich 12-09-1910 Symphony No. 8`,
            url: `${MF}mahler/locations/germany/munich/1910-concert-munich-12-09-1910/`,
          }
        : src(row.workId),
  };
});

function seasonOf(iso: string): AtlasEvent['season'] {
  const m = Number(iso.slice(5, 7));
  return m >= 5 && m <= 9 ? 'summer' : 'winter';
}

function workWord(id: SelfWorkId, locale: keyof Localized): string {
  return workById[id].title[locale];
}

function titleFor(n: SelfNight): Localized {
  const locales = ['nl', 'en', 'de', 'cs'] as const;
  const out = {} as Localized;
  for (const loc of locales) {
    const city = placeById[n.placeId]?.city[loc] ?? n.placeId;
    const work = workWord(n.workId, loc);
    if (n.halfPremiere) {
      out[loc] = loc === 'nl' ? `${work}, ${n.fragmentScope?.[loc] ?? ''} (${city})` : `${work}, ${n.fragmentScope?.[loc] ?? ''} (${city})`;
    } else if (n.premiere) {
      out[loc] =
        loc === 'nl' ? `Première ${work}` :
        loc === 'de' ? `Uraufführung ${work}` :
        loc === 'cs' ? `Premiéra ${work}` :
        `Premiere of ${work}`;
    } else if (n.completeness === 'fragment') {
      out[loc] = `${work}, ${n.fragmentScope?.[loc] ?? (loc === 'nl' ? 'fragment' : 'fragment')} (${city})`;
    } else {
      out[loc] = `${work}, ${city}`;
    }
  }
  return out;
}

function summaryFor(n: SelfNight): Localized {
  const locales = ['nl', 'en', 'de', 'cs'] as const;
  const he = { nl: 'Mahler dirigeert.', en: 'Mahler conducts.', de: 'Mahler dirigiert.', cs: 'Mahler diriguje.' };
  const out = {} as Localized;
  for (const loc of locales) {
    const city = placeById[n.placeId]?.city[loc] ?? '';
    const bits = [formatDate(n.date, loc), city];
    if (n.hall) bits.push(n.hall[loc]);
    const head = bits.filter(Boolean).join(', ');
    const extraBits = [n.formNote?.[loc], n.fragmentScope?.[loc], he[loc]].filter(Boolean);
    out[loc] = `${head}. ${extraBits.join(' ')}`;
  }
  return out;
}

const EMPTY_EXTRA: Localized = { nl: '', en: '', de: '', cs: '' };

export function toAtlasEvent(n: SelfNight): AtlasEvent {
  return {
    id: n.id,
    dateStart: n.date,
    datePrecision: 'day',
    placeId: n.placeId,
    type: n.premiere || n.halfPremiere ? 'premiere' : 'performance',
    workId: n.workId,
    role: n.id === 'prem-1-1889' ? 'director' : 'guest',
    season: seasonOf(n.date),
    conductor: 'Gustav Mahler',
    orchestra: n.orchestra,
    title: titleFor(n),
    summary: summaryFor(n),
    extra: n.extra ?? EMPTY_EXTRA,
    source: n.source,
    selfConducted: true,
    completeness: n.completeness,
    fragmentScope: n.fragmentScope,
    hall: n.hall,
    belgium: n.belgium,
  };
}

export const selfConductedEvents: AtlasEvent[] = selfNights.map(toAtlasEvent);

export const neverSelfConducted: Array<{
  workId: WorkId;
  conductor?: string;
  date?: string;
  placeId?: string;
  eventId?: string;
  unfinished?: boolean;
}> = [
  /* MF / Martner: Das Lied 20 Nov 1911 Munich; Ninth 26 Jun 1912 Vienna. Listed here in that documented pairing. */
  { workId: 'lied', conductor: 'Bruno Walter', date: '1911-11-20', placeId: 'munich_kaim', eventId: 'prem-lied-1911' },
  { workId: '9', conductor: 'Bruno Walter', date: '1912-06-26', placeId: 'vienna_musikverein', eventId: 'prem-9-1912' },
  { workId: '10', unfinished: true },
];

export function completeNights(workId?: SelfWorkId): SelfNight[] {
  return selfNights.filter((n) => n.completeness === 'complete' && (!workId || n.workId === workId));
}

export function fragmentNights(workId?: SelfWorkId): SelfNight[] {
  return selfNights.filter((n) => n.completeness === 'fragment' && (!workId || n.workId === workId));
}

export function belgiumComplete(): SelfNight[] {
  return selfNights.filter((n) => n.belgium && n.completeness === 'complete');
}

export function nightsInCity(cityEn: string): SelfNight[] {
  return selfNights.filter((n) => placeById[n.placeId]?.city.en === cityEn);
}

export function premiereNight(workId: SelfWorkId): SelfNight | undefined {
  return selfNights.find((n) => n.workId === workId && n.premiere && n.completeness === 'complete');
}

export const selfStats = {
  works: 8 as const,
  complete: completeNights().length,
  fragments: fragmentNights().length,
  byWork: Object.fromEntries(
    (['1', '2', '3', '4', '5', '6', '7', '8'] as const).map((id) => [
      id,
      { complete: completeNights(id).length, fragments: fragmentNights(id).length },
    ]),
  ) as Record<SelfWorkId, { complete: number; fragments: number }>,
  belgiumComplete: belgiumComplete().length,
  newYork: {
    1908: nightsInCity('New York').filter((n) => n.date.startsWith('1908') && n.completeness === 'complete'),
    1909: nightsInCity('New York').filter((n) => n.date.startsWith('1909') && n.completeness === 'complete'),
    1911: nightsInCity('New York').filter((n) => n.date.startsWith('1911') && n.completeness === 'complete'),
  },
};

export function eventVenue(
  event: Pick<AtlasEvent, 'selfConducted' | 'hall'>,
  placeVenue?: Localized,
): Localized | undefined {
  if (event.hall) return event.hall;
  if (event.selfConducted) return undefined;
  return placeVenue;
}
