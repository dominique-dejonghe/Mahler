import type { MediaLink, Work } from '../types';

function spotifyAlbum(id: string, conductor: string): MediaLink {
  return { url: `https://open.spotify.com/album/${id}`, label: `Spotify · ${conductor}` };
}

function spotifySearch(query: string, conductor: string): MediaLink {
  return {
    url: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
    label: `Spotify · zoeken · ${conductor}`,
  };
}

function youtubeSearch(query: string, conductor: string): MediaLink {
  return {
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    label: `YouTube · zoeken · ${conductor}`,
  };
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
 * Spotify album IDs were checked live; YouTube IDs were not, so those chips are search URLs.
 */
export const works: Work[] = [
  {
    id: 'klagende',
    title: {
      nl: 'Das klagende Lied',
      en: 'Das klagende Lied',
      de: 'Das klagende Lied',
      cs: 'Das klagende Lied',
    },
    composed: '1878–1880',
    listen: spotifyAlbum('6wroBOCYmubAhwCb3yigIK', 'Boulez'),
    watch: youtubeSearch('Mahler Das klagende Lied Boulez', 'Boulez'),
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
    listen: spotifyAlbum('42Dxrb16gZsiK6gP7Ji3Kj', 'Bernstein'),
    watch: youtubeSearch('Mahler Lieder eines fahrenden Gesellen Bernstein Hampson', 'Bernstein'),
  },
  {
    id: '1',
    title: { nl: 'Symfonie nr. 1', en: 'Symphony No. 1', de: 'Sinfonie Nr. 1', cs: 'Symfonie č. 1' },
    composed: '1887–1888, rev. tot 1910',
    listen: spotifyAlbum('1VAuN0xjAVzb4KluNxIyq1', 'Bernstein'),
    watch: youtubeSearch('Mahler Symphony No. 1 Bernstein Concertgebouw', 'Bernstein'),
  },
  {
    id: '2',
    title: { nl: 'Symfonie nr. 2', en: 'Symphony No. 2', de: 'Sinfonie Nr. 2', cs: 'Symfonie č. 2' },
    composed: '1888–1894',
    listen: spotifyAlbum('2SVkyvRyCXIZ8WsGe8j0xc', 'Bernstein'),
    watch: youtubeSearch('Mahler Symphony No. 2 Bernstein New York Philharmonic', 'Bernstein'),
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
    listen: spotifyAlbum('7fhcRk4TpZkdDE7t5ddy1h', 'Chailly'),
    watch: youtubeSearch('Mahler Des Knaben Wunderhorn Chailly Concertgebouw', 'Chailly'),
  },
  {
    id: '3',
    title: { nl: 'Symfonie nr. 3', en: 'Symphony No. 3', de: 'Sinfonie Nr. 3', cs: 'Symfonie č. 3' },
    composed: '1893–1896',
    listen: spotifyAlbum('4RvVQ968WriWyWv37Aa99q', 'Bernstein'),
    watch: youtubeSearch('Mahler Symphony No. 3 Bernstein New York Philharmonic', 'Bernstein'),
  },
  {
    id: '4',
    title: { nl: 'Symfonie nr. 4', en: 'Symphony No. 4', de: 'Sinfonie Nr. 4', cs: 'Symfonie č. 4' },
    composed: '1899–1901',
    listen: spotifyAlbum('7Dz5wgqwgpirUx90OeqP3n', 'Karajan'),
    watch: youtubeSearch('Mahler Symphony No. 4 Karajan Berliner Philharmoniker', 'Karajan'),
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
    listen: spotifyAlbum('42Dxrb16gZsiK6gP7Ji3Kj', 'Bernstein'),
    watch: youtubeSearch('Mahler Kindertotenlieder Bernstein Hampson', 'Bernstein'),
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
    listen: spotifyAlbum('42Dxrb16gZsiK6gP7Ji3Kj', 'Bernstein'),
    watch: youtubeSearch('Mahler Rückert-Lieder Bernstein Hampson', 'Bernstein'),
  },
  {
    id: '5',
    title: { nl: 'Symfonie nr. 5', en: 'Symphony No. 5', de: 'Sinfonie Nr. 5', cs: 'Symfonie č. 5' },
    composed: '1901–1902',
    listen: spotifyAlbum('1zib7RshiCQ6Dg1zyvwYuk', 'Haitink'),
    watch: youtubeSearch('Mahler Symphony No. 5 Haitink Berliner Philharmoniker', 'Haitink'),
  },
  {
    id: '6',
    title: { nl: 'Symfonie nr. 6', en: 'Symphony No. 6', de: 'Sinfonie Nr. 6', cs: 'Symfonie č. 6' },
    composed: '1903–1905',
    listen: spotifyAlbum('1FKZr0qG8A0cd6ZS521zgU', 'Bernstein'),
    watch: youtubeSearch('Mahler Symphony No. 6 Bernstein New York Philharmonic', 'Bernstein'),
  },
  {
    id: '7',
    title: { nl: 'Symfonie nr. 7', en: 'Symphony No. 7', de: 'Sinfonie Nr. 7', cs: 'Symfonie č. 7' },
    composed: '1904–1905',
    listen: spotifyAlbum('2OC9JP24JsTBGvPoinMNB1', 'Bernstein'),
    watch: youtubeSearch('Mahler Symphony No. 7 Bernstein New York Philharmonic', 'Bernstein'),
  },
  {
    id: '8',
    title: { nl: 'Symfonie nr. 8', en: 'Symphony No. 8', de: 'Sinfonie Nr. 8', cs: 'Symfonie č. 8' },
    composed: '1906–1907',
    listen: spotifyAlbum('4y5c2HeVg0YOf7ZRzFrIFk', 'Boulez'),
    watch: youtubeSearch('Mahler Symphony No. 8 Boulez Staatskapelle Berlin', 'Boulez'),
  },
  {
    id: 'lied',
    title: { nl: 'Das Lied von der Erde', en: 'Das Lied von der Erde', de: 'Das Lied von der Erde', cs: 'Píseň o zemi' },
    composed: '1908–1909',
    listen: spotifyAlbum('6WjnS8zXWk7bIQIuMzyqnm', 'Boulez'),
    watch: youtubeSearch('Mahler Das Lied von der Erde Boulez Wiener Philharmoniker', 'Boulez'),
  },
  {
    id: '9',
    title: { nl: 'Symfonie nr. 9', en: 'Symphony No. 9', de: 'Sinfonie Nr. 9', cs: 'Symfonie č. 9' },
    composed: '1909–1910',
    listen: spotifyAlbum('5qWY0uUyUAY7VT1Q5AcY8J', 'Jansons'),
    watch: youtubeSearch('Mahler Symphony No. 9 Jansons Bavarian Radio', 'Jansons'),
  },
  {
    id: '10',
    title: { nl: 'Symfonie nr. 10', en: 'Symphony No. 10', de: 'Sinfonie Nr. 10', cs: 'Symfonie č. 10' },
    composed: '1910 (onvoltooid)',
    unfinished: true,
    listen: spotifySearch('Mahler Symphony No. 10 Cooke Rattle', 'Rattle'),
    watch: youtubeSearch('Mahler Symphony No. 10 Cooke Rattle', 'Rattle'),
  },
];

export const workById = Object.fromEntries(works.map((w) => [w.id, w]));
