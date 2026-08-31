import { describe, expect, it } from 'vitest';
import { brieven, bronnen, correspondenten } from '../data/brieven/load';
import type { Brief, Correspondent } from '../types';
import {
  filterBrieven,
  filterCorrespondenten,
  formatLetterDate,
  hasQuote,
  uniquePlaces,
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
    periodFrom: '1901',
    periodTo: '1911',
    whyNl: 'Testdata, geen biografie.',
    tags: ['familie'],
  },
  {
    id: 'bruno-walter',
    name: 'Bruno Walter',
    periodFrom: '1894',
    periodTo: '1911',
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
    sourceId: 'blaukopf-1982',
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
    sourceId: 'blaukopf-1982',
  },
];

describe('published Brieven JSON', () => {
  it('ships empty correspondenten and brieven', () => {
    expect(correspondenten).toEqual([]);
    expect(brieven).toEqual([]);
  });

  it('accepts the empty arrays and seeded bronnen', () => {
    const peopleIds = new Set(correspondenten.map((c) => c.id));
    const sourceIds = new Set(bronnen.map((b) => b.id));
    expect(validateCorrespondenten(correspondenten)).toEqual([]);
    expect(validateBronnen(bronnen)).toEqual([]);
    expect(validateBrieven(brieven, peopleIds, sourceIds)).toEqual([]);
    expect(bronnen.length).toBeGreaterThan(0);
    expect(bronnen.every((b) => b.id && b.labelNl && b.noteNl)).toBe(true);
  });

  it('publishes no quotes', () => {
    expect(brieven.every((row) => !hasQuote(row.quoteDE) && !hasQuote(row.quoteNL))).toBe(true);
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
  it('returns empty lists when the published data is empty', () => {
    expect(filterCorrespondenten(correspondenten, { text: 'alma' })).toEqual([]);
    expect(filterBrieven(brieven, { year: '1908', place: 'Praag', correspondentId: 'alma-mahler' })).toEqual([]);
    expect(uniqueYears(brieven)).toEqual([]);
    expect(uniquePlaces(brieven)).toEqual([]);
    expect(uniqueTags(correspondenten)).toEqual([]);
  });

  it('filters correspondents by text and tag (fixture only)', () => {
    expect(filterCorrespondenten(samplePeople, { text: 'bruno' }).map((c) => c.id)).toEqual(['bruno-walter']);
    expect(filterCorrespondenten(samplePeople, { tag: 'familie' }).map((c) => c.id)).toEqual(['alma-mahler']);
  });

  it('filters letters by recipient, year, and place (fixture only)', () => {
    expect(filterBrieven(sampleLetters, { correspondentId: 'alma-mahler' }).map((b) => b.id)).toEqual([
      '1908-09-19-alma',
    ]);
    expect(filterBrieven(sampleLetters, { year: '1909' }).map((b) => b.id)).toEqual(['1909-wenen-walter']);
    expect(filterBrieven(sampleLetters, { place: 'Praag' }).map((b) => b.id)).toEqual(['1908-09-19-alma']);
    expect(uniqueYears(sampleLetters)).toEqual(['1908', '1909']);
    expect(uniquePlaces(sampleLetters)).toEqual(['Praag', 'Wenen']);
  });
});

describe('letter dates', () => {
  it('formats year, month, and day without inventing a day', () => {
    expect(formatLetterDate('1909', 'nl')).toBe('1909');
    expect(formatLetterDate('1908-09', 'nl')).toMatch(/1908/);
    expect(formatLetterDate('1908-09-19', 'nl')).toMatch(/19/);
  });
});

describe('validator', () => {
  it('rejects a non-kebab id', () => {
    expect(validateCorrespondenten([{ ...samplePeople[0], id: 'Alma Mahler' }])).not.toEqual([]);
  });

  it('rejects a letter pointing at a missing correspondent', () => {
    const errors = validateBrieven(
      sampleLetters,
      new Set(['alma-mahler']),
      new Set(['blaukopf-1982']),
    );
    expect(errors.some((e) => e.includes('bruno-walter'))).toBe(true);
  });
});

describe('/brieven path', () => {
  it('maps /brieven to the letters view and back', () => {
    expect(viewFromPath('/brieven')).toBe('letters');
    expect(viewFromPath('/brieven/')).toBe('letters');
    expect(viewFromPath('/')).toBe('atlas');
    expect(pathFromView('letters')).toBe('/brieven');
    expect(pathFromView('atlas')).toBe('/');
    expect(pathFromView('houses')).toBe('/');
  });
});
