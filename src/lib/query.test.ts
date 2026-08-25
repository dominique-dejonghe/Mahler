import { describe, expect, it } from 'vitest';
import { allEvents, eventsNeedingSource, performances } from '../data';
import { parseDatesFromText } from './dates';
import { locateOnDate } from './locate';
import { answerQuery } from './query';

describe('data integrity', () => {
  it('every event has a source label', () => {
    expect(eventsNeedingSource()).toEqual([]);
    expect(allEvents.length).toBeGreaterThan(40);
  });

  it('every performance row has a source', () => {
    expect(performances.every((p) => p.source.label.length > 0)).toBe(true);
  });

  it('includes required Prague seed dates', () => {
    const dates = allEvents.map((e) => e.dateStart);
    expect(dates).toContain('1888-08-18');
    expect(dates).toContain('1898-03-03');
    expect(dates).toContain('1904-02-25');
    expect(dates).toContain('1908-05-23');
    expect(dates).toContain('1908-09-19');
  });

  it('includes all symphony premieres including Das Lied and 10th posthumous', () => {
    const prem = performances.filter((p) => p.type === 'premiere');
    for (const id of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'lied', '10'] as const) {
      expect(prem.some((p) => p.workId === id)).toBe(true);
    }
    const tenth = prem.filter((p) => p.workId === '10');
    expect(tenth.every((p) => p.posthumous)).toBe(true);
  });
});

describe('date parsing', () => {
  it('parses Dutch, English, German, dotted', () => {
    expect(parseDatesFromText('Waar was Mahler op 19 september 1908?')).toEqual(['1908-09-19']);
    expect(parseDatesFromText('Where was Mahler on September 19, 1908?')).toEqual(['1908-09-19']);
    expect(parseDatesFromText('19. September 1908')).toEqual(['1908-09-19']);
    expect(parseDatesFromText('19/9/1908')).toEqual(['1908-09-19']);
  });
});

describe('locateOnDate', () => {
  it('finds the Seventh premiere in Prague on 19 Sep 1908', () => {
    const hit = locateOnDate('1908-09-19');
    expect(hit.event?.id).toBe('prem-7-1908');
    expect(hit.event?.placeId).toBe('prague_vystaviste');
    expect(hit.inferred).toBe(false);
  });

  it('finds birth and death', () => {
    expect(locateOnDate('1860-07-07').event?.id).toBe('birth-1860');
    expect(locateOnDate('1911-05-18').event?.id).toBe('death-1911');
  });

  it('uses a documented post when a day has no exact pin', () => {
    const hit = locateOnDate('1892-11-03');
    expect(hit.kind === 'residence' || hit.inferred).toBe(true);
    expect(hit.residence?.placeId === 'hamburg' || hit.event?.placeId === 'hamburg').toBe(true);
  });

  it('offers a nearest window for a gap year', () => {
    const hit = locateOnDate('1882-08-01');
    expect(hit.inferred).toBe(true);
    expect(hit.event || hit.residence).toBeTruthy();
  });
});

describe('Gustaaf retrieval', () => {
  it('answers the Prague 1908 example in Dutch', () => {
    const ans = answerQuery('Waar was Mahler op 19 september 1908?', 'nl');
    expect(ans.unknown).toBe(false);
    expect(ans.eventIds).toContain('prem-7-1908');
    expect(ans.text.nl.toLowerCase()).toMatch(/praag|výstaviště|vystaviste|zevende/);
  });

  it('answers when the Seventh was first played', () => {
    const ans = answerQuery('Wanneer werd de Zevende voor het eerst gespeeld?', 'nl');
    expect(ans.eventIds).toContain('prem-7-1908');
  });

  it('answers Hamburg house/orchestra', () => {
    const ans = answerQuery('Welk huis in Hamburg?', 'nl');
    expect(ans.unknown).toBe(false);
    expect(ans.text.nl.toLowerCase()).toMatch(/hamburg|stadttheater/);
  });

  it('does not invent an unknown concert', () => {
    const ans = answerQuery('Speelde Mahler in Tongeren in 1903?', 'nl');
    expect(ans.unknown).toBe(true);
    expect(ans.text.nl.toLowerCase()).toMatch(/niet in deze dataset|geen verzinsel/);
  });

  it('keeps Alma behind the deeper flag by default', () => {
    const open = answerQuery('Waar was Mahler op 9 maart 1902?', 'nl', { deep: false });
    expect(open.eventIds.includes('deep-alma-1902')).toBe(false);
    const deep = answerQuery('Waar was Mahler op 9 maart 1902?', 'nl', { deep: true });
    expect(deep.eventIds.includes('deep-alma-1902') || deep.text.nl.toLowerCase().includes('alma')).toBe(true);
  });
});
