import { describe, expect, it } from 'vitest';
import { composedStartYear, works, worksByYear } from './works';

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

  it('gives every work a listen and watch URL that is not a fabricated YouTube video id', () => {
    for (const w of works) {
      expect(w.listen.url).toMatch(/^https:\/\/open\.spotify\.com\/(album|search)\//);
      expect(w.watch.url).toMatch(/^https:\/\/www\.youtube\.com\/results\?search_query=/);
      expect(w.listen.label).toMatch(/^Spotify · /);
      expect(w.watch.label).toMatch(/^YouTube · zoeken · /);
    }
    expect(works.find((w) => w.id === '10')?.listen.label).toMatch(/zoeken/);
  });
});
