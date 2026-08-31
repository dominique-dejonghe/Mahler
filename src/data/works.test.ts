import { describe, expect, it } from 'vitest';
import { composedStartYear, works, worksByYear, workSearchQuery } from './works';

const REQUIRED = [
  'klagende',
  'gesellen',
  'wunderhorn',
  'kindertoten',
  'ruckert',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'lied',
  '10',
];

const STAR_PICKS =
  /Bernstein|Boulez|Chailly|Karajan|Haitink|Jansons|Rattle|Hampson|Cooke/i;

function searchQueryFrom(url: string, prefix: string): string {
  expect(url.startsWith(prefix)).toBe(true);
  return decodeURIComponent(url.slice(prefix.length));
}

describe('works catalog', () => {
  it('includes the required symphonies and cycles', () => {
    expect(works.map((w) => w.id)).toEqual(expect.arrayContaining(REQUIRED));
    expect(works.find((w) => w.id === '10')?.unfinished).toBe(true);
  });

  it('sorts by start composition year then Dutch title', () => {
    const ids = worksByYear().map((w) => w.id);
    expect(ids[0]).toBe('klagende');
    expect(ids[ids.length - 1]).toBe('10');
    const years = worksByYear().map((w) => composedStartYear(w.composed));
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('gives every work a work-level search URL, not a pinned album or conductor', () => {
    for (const w of works) {
      const query = workSearchQuery(w.title.en);
      const spotify = searchQueryFrom(w.listen.url, 'https://open.spotify.com/search/');
      const youtube = searchQueryFrom(w.watch.url, 'https://www.youtube.com/results?search_query=');
      expect(spotify).toBe(query);
      expect(youtube).toBe(query);
      expect(query).toMatch(/^Mahler /);
      expect(query).not.toMatch(STAR_PICKS);
      expect(w.listen.url).not.toMatch(/\/album\//);
      expect(w.watch.url).not.toMatch(/watch\?v=/);
    }
    expect(works.find((w) => w.id === 'klagende')?.listen.url).toContain(
      encodeURIComponent('Mahler Das klagende Lied'),
    );
    expect(works.find((w) => w.id === '5')?.listen.url).toContain(encodeURIComponent('Mahler Symphony No. 5'));
  });
});
