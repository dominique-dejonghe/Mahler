import type { MediaLink, Work } from '../types';

function spotifySearch(query: string): MediaLink {
  return { url: `https://open.spotify.com/search/${encodeURIComponent(query)}` };
}

function youtubeSearch(query: string): MediaLink {
  return {
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  };
}

/** Work-level search only. No album IDs, no conductor, no fabricated discography. */
export function workSearchQuery(titleEn: string): string {
  return `Mahler ${titleEn}`;
}

function searchesFor(titleEn: string): Pick<Work, 'listen' | 'watch'> {
  const query = workSearchQuery(titleEn);
  return { listen: spotifySearch(query), watch: youtubeSearch(query) };
}

/** First four-digit year in a `composed` string (Mahler Foundation / existing catalog). */
export function composedStartYear(composed: string): number {
  const match = composed.match(/\d{4}/);
  return match ? Number(match[0]) : 9999;
}

export function worksByYear(list: Work[] = works): Work[] {
  return [...list].sort((a, b) => {
    const year = composedStartYear(a.composed) - composedStartYear(b.composed);
    if (year !== 0) return year;
    return a.title.nl.localeCompare(b.title.nl, 'nl');
  });
}

/**
 * Symphonies and song cycles. Years from Mahler Foundation / the existing catalog.
 * Early fragments (piano quartet, Blumine) omitted — no extra invented rows.
 * Listen/watch chips are search URLs for the work, not a pinned recording.
 */
const catalog: Omit<Work, 'listen' | 'watch'>[] = [
  {
    id: 'klagende',
    title: {
      nl: 'Das klagende Lied',
      en: 'Das klagende Lied',
      de: 'Das klagende Lied',
      cs: 'Das klagende Lied',
    },
    composed: '1878–1880',
  },
  {
    id: 'gesellen',
    title: {
      nl: 'Lieder eines fahrenden Gesellen',
      en: 'Lieder eines fahrenden Gesellen',
      de: 'Lieder eines fahrenden Gesellen',
      cs: 'Lieder eines fahrenden Gesellen',
    },
    composed: '1884–1885',
  },
  {
    id: '1',
    title: { nl: 'Symfonie nr. 1', en: 'Symphony No. 1', de: 'Sinfonie Nr. 1', cs: 'Symfonie č. 1' },
    composed: '1887–1888, rev. tot 1910',
  },
  {
    id: '2',
    title: { nl: 'Symfonie nr. 2', en: 'Symphony No. 2', de: 'Sinfonie Nr. 2', cs: 'Symfonie č. 2' },
    composed: '1888–1894',
  },
  {
    id: 'wunderhorn',
    title: {
      nl: 'Des Knaben Wunderhorn',
      en: 'Des Knaben Wunderhorn',
      de: 'Des Knaben Wunderhorn',
      cs: 'Des Knaben Wunderhorn',
    },
    composed: '1892–1898',
  },
  {
    id: '3',
    title: { nl: 'Symfonie nr. 3', en: 'Symphony No. 3', de: 'Sinfonie Nr. 3', cs: 'Symfonie č. 3' },
    composed: '1893–1896',
  },
  {
    id: '4',
    title: { nl: 'Symfonie nr. 4', en: 'Symphony No. 4', de: 'Sinfonie Nr. 4', cs: 'Symfonie č. 4' },
    composed: '1899–1901',
  },
  {
    id: 'kindertoten',
    title: {
      nl: 'Kindertotenlieder',
      en: 'Kindertotenlieder',
      de: 'Kindertotenlieder',
      cs: 'Kindertotenlieder',
    },
    composed: '1901–1904',
  },
  {
    id: 'ruckert',
    title: {
      nl: 'Rückert-Lieder',
      en: 'Rückert-Lieder',
      de: 'Rückert-Lieder',
      cs: 'Rückert-Lieder',
    },
    composed: '1901–1902',
  },
  {
    id: '5',
    title: { nl: 'Symfonie nr. 5', en: 'Symphony No. 5', de: 'Sinfonie Nr. 5', cs: 'Symfonie č. 5' },
    composed: '1901–1902',
  },
  {
    id: '6',
    title: { nl: 'Symfonie nr. 6', en: 'Symphony No. 6', de: 'Sinfonie Nr. 6', cs: 'Symfonie č. 6' },
    composed: '1903–1905',
  },
  {
    id: '7',
    title: { nl: 'Symfonie nr. 7', en: 'Symphony No. 7', de: 'Sinfonie Nr. 7', cs: 'Symfonie č. 7' },
    composed: '1904–1905',
  },
  {
    id: '8',
    title: { nl: 'Symfonie nr. 8', en: 'Symphony No. 8', de: 'Sinfonie Nr. 8', cs: 'Symfonie č. 8' },
    composed: '1906–1907',
  },
  {
    id: 'lied',
    title: { nl: 'Das Lied von der Erde', en: 'Das Lied von der Erde', de: 'Das Lied von der Erde', cs: 'Píseň o zemi' },
    composed: '1908–1909',
  },
  {
    id: '9',
    title: { nl: 'Symfonie nr. 9', en: 'Symphony No. 9', de: 'Sinfonie Nr. 9', cs: 'Symfonie č. 9' },
    composed: '1909–1910',
  },
  {
    id: '10',
    title: { nl: 'Symfonie nr. 10', en: 'Symphony No. 10', de: 'Sinfonie Nr. 10', cs: 'Symfonie č. 10' },
    composed: '1910 (onvoltooid)',
    unfinished: true,
  },
];

export const works: Work[] = catalog.map((w) => ({
  ...w,
  ...searchesFor(w.title.en),
}));

export const workById = Object.fromEntries(works.map((w) => [w.id, w]));
