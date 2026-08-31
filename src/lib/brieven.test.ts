import { describe, expect, it } from 'vitest';
import { brieven, bronnen, correspondenten } from '../data/brieven/load';
import type { Brief, Correspondent } from '../types';
import {
  filterBrieven,
  filterCorrespondenten,
  formatLetterDate,
  hasQuote,
  sortBrieven,
  uniqueTags,
  uniqueYears,
  validateBrieven,
  validateBronnen,
  validateCorrespondenten,
} from './brieven';
import { pathFromView, viewFromPath } from './views';

const samplePeople: Correspondent[] = [
  {
    id: 'alma-mahler',
    name: 'Alma Mahler',
    periodFrom: 1901,
    periodTo: 1911,
    whyNl: 'Testdata, geen biografie.',
    tags: ['familie'],
  },
  {
    id: 'bruno-walter',
    name: 'Bruno Walter',
    periodFrom: 1894,
    periodTo: 1911,
    whyNl: 'Testdata, geen biografie.',
    tags: ['dirigent'],
  },
];

const sampleLetters: Brief[] = [
  {
    id: '1908-09-19-alma',
    date: '1908-09-19',
    place: 'Praag',
    correspondentId: 'alma-mahler',
    summaryNl: 'Filtertest. Geen citaat.',
    whyNl: 'Filtertest.',
    sourceId: 'blaukopf-1996',
    quoteDE: null,
    quoteNL: '',
  },
  {
    id: '1909-wenen-walter',
    date: '1909',
    place: 'Wenen',
    correspondentId: 'bruno-walter',
    summaryNl: 'Tweede filtertest.',
    whyNl: 'Filtertest.',
    sourceId: 'blaukopf-1996',
  },
];

describe('published Brieven JSON', () => {
  it('ships 25 correspondenten, 28 brieven, 10 bronnen', () => {
    expect(correspondenten).toHaveLength(25);
    expect(brieven).toHaveLength(28);
    expect(bronnen).toHaveLength(10);
  });

  it('validates live rows and cross-references', () => {
    const peopleIds = new Set(correspondenten.map((c) => c.id));
    const sourceIds = new Set(bronnen.map((b) => b.id));
    expect(validateCorrespondenten(correspondenten)).toEqual([]);
    expect(validateBronnen(bronnen)).toEqual([]);
    expect(validateBrieven(brieven, peopleIds, sourceIds)).toEqual([]);
  });

  it('sorts letters by ISO-ish date, month-only as that month', () => {
    const dates = brieven.map((row) => row.date);
    expect(dates).toEqual([...dates].sort((a, b) => a.localeCompare(b)));
    expect(brieven[0].id).toBe('c-000025');
    expect(brieven[brieven.length - 1].id).toBe('c-002499');
    const strauss = brieven.find((row) => row.id === 'c-001900');
    const hamburg = brieven.find((row) => row.id === 'c-000826');
    expect(strauss && hamburg && strauss.date < hamburg.date).toBe(true);
  });

  it('gives every letter a Mahler-Online url', () => {
    expect(brieven.every((row) => row.mahlerOnlineUrl?.startsWith('https://www.mahler-online.at/'))).toBe(true);
  });

  it('omits quotes on c-001876 and keeps toblach-pdf year null', () => {
    const letter = brieven.find((row) => row.id === 'c-001876');
    expect(letter).toBeTruthy();
    expect(letter && 'quoteDE' in letter ? hasQuote(letter.quoteDE) : false).toBe(false);
    expect(letter && 'quoteNL' in letter ? hasQuote(letter.quoteNL) : false).toBe(false);
    const toblach = bronnen.find((row) => row.id === 'toblach-pdf');
    expect(toblach?.year ?? null).toBeNull();
  });
});

describe('quote gate', () => {
  it('hides empty, null, and whitespace', () => {
    expect(hasQuote(undefined)).toBe(false);
    expect(hasQuote(null)).toBe(false);
    expect(hasQuote('')).toBe(false);
    expect(hasQuote('   ')).toBe(false);
  });

  it('shows only a non-empty field', () => {
    expect(hasQuote('Ein belegtes Zitat.')).toBe(true);
  });
});

describe('filters', () => {
  it('filters published letters by correspondent, year, and correspondent tag', () => {
    expect(filterBrieven(brieven, { correspondentId: 'alma-mahler' }, correspondenten)).toHaveLength(5);
    expect(filterBrieven(brieven, { year: '1908' }, correspondenten).map((row) => row.id)).toEqual([
      'c-002437',
      'c-002444',
      'c-002450',
    ]);
    expect(filterCorrespondenten(correspondenten, { tag: 'familie' }).map((c) => c.id)).toEqual([
      'justine-mahler',
      'alma-mahler',
      'emil-freund',
      'marie-bernhard-mahler',
      'emma-mahler',
    ]);
    const familyLetters = filterBrieven(brieven, { tag: 'familie' }, correspondenten);
    expect(familyLetters.every((row) => correspondenten.find((c) => c.id === row.correspondentId)?.tags?.includes('familie'))).toBe(
      true,
    );
    expect(uniqueYears(brieven).length).toBeGreaterThan(0);
    expect(uniqueTags(correspondenten)).toEqual(
      expect.arrayContaining(['familie', 'dirigent', 'compositie', 'opera']),
    );
  });

  it('filters fixture rows by id, tag, year', () => {
    expect(filterCorrespondenten(samplePeople, { id: 'bruno-walter' }).map((c) => c.id)).toEqual(['bruno-walter']);
    expect(filterCorrespondenten(samplePeople, { tag: 'familie' }).map((c) => c.id)).toEqual(['alma-mahler']);
    expect(filterBrieven(sampleLetters, { correspondentId: 'alma-mahler' }, samplePeople).map((b) => b.id)).toEqual([
      '1908-09-19-alma',
    ]);
    expect(filterBrieven(sampleLetters, { year: '1909' }, samplePeople).map((b) => b.id)).toEqual(['1909-wenen-walter']);
    expect(filterBrieven(sampleLetters, { tag: 'dirigent' }, samplePeople).map((b) => b.id)).toEqual(['1909-wenen-walter']);
  });
});

describe('letter dates', () => {
  it('formats year, month, and day without inventing a day', () => {
    expect(formatLetterDate('1909', 'nl')).toBe('1909');
    expect(formatLetterDate('1908-09', 'nl')).toMatch(/1908/);
    expect(formatLetterDate('1908-09-19', 'nl')).toMatch(/19/);
  });

  it('sorts month-only dates as that month', () => {
    const mixed: Brief[] = [
      { ...sampleLetters[0], id: 'day', date: '1907-07-08' },
      { ...sampleLetters[0], id: 'month', date: '1907-07' },
      { ...sampleLetters[0], id: 'before', date: '1907-06-08' },
    ];
    expect(sortBrieven(mixed).map((row) => row.id)).toEqual(['before', 'month', 'day']);
  });
});

describe('validator', () => {
  it('rejects a non-kebab id', () => {
    expect(validateCorrespondenten([{ ...samplePeople[0], id: 'Alma Mahler' }])).not.toEqual([]);
  });

  it('rejects a letter pointing at a missing correspondent', () => {
    const errors = validateBrieven(sampleLetters, new Set(['alma-mahler']), new Set(['blaukopf-1996']));
    expect(errors.some((e) => e.includes('bruno-walter'))).toBe(true);
  });
});

describe('PDF download control', () => {
  it('points at the exact public PDF path and label', async () => {
    const src = await import('node:fs/promises').then((fs) =>
      fs.readFile(new URL('../components/BrievenView.tsx', import.meta.url), 'utf8'),
    );
    expect(src).toContain('PDF — 28 sleutelbrieven');
    expect(src).toContain('href="/static/Mahler-28-sleutelbrieven.pdf"');
    expect(src).toContain('download="Mahler-28-sleutelbrieven.pdf"');
  });
});

describe('/brieven path', () => {
  it('maps /brieven to the letters view and back', () => {
    expect(viewFromPath('/brieven')).toBe('letters');
    expect(viewFromPath('/brieven/')).toBe('letters');
    expect(viewFromPath('/')).toBe('atlas');
    expect(pathFromView('letters')).toBe('/brieven/');
    expect(pathFromView('atlas')).toBe('/');
    expect(pathFromView('houses')).toBe('/');
  });
});
