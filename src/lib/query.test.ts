import { describe, expect, it } from 'vitest';
import { allEvents, eventsNeedingSource, performances, placeById, selfNights, selfStats } from '../data';
import { parseDatesFromText } from './dates';
import { locateOnDate } from './locate';
import { answerQuery, parseWorks } from './query';

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
    const prem = allEvents.filter((p) => p.type === 'premiere');
    for (const id of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'lied', '10'] as const) {
      expect(prem.some((p) => p.workId === id)).toBe(true);
    }
    const tenth = prem.filter((p) => p.workId === '10');
    expect(tenth.every((p) => p.posthumous)).toBe(true);
  });

  it('encodes Mahler-conducted nights without padding', () => {
    const ids = selfNights.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(selfNights.every((n) => placeById[n.placeId])).toBe(true);
    expect(selfNights.every((n) => n.source.label.length > 0)).toBe(true);
    expect(selfStats.complete).toBe(71);
    expect(selfStats.fragments).toBe(4);
    expect(selfStats.byWork['6'].complete).toBe(3);
    expect(selfStats.byWork['7'].complete).toBe(5);
    expect(selfStats.byWork['8'].complete).toBe(2);
    expect(selfStats.belgiumComplete).toBe(2);
    expect(selfStats.newYork[1908].every((n) => n.workId === '2')).toBe(true);
    expect(selfStats.newYork[1908]).toHaveLength(1);
    expect(selfStats.newYork[1909].every((n) => n.workId === '1')).toBe(true);
    expect(selfStats.newYork[1909]).toHaveLength(2);
    expect(selfStats.newYork[1911].every((n) => n.workId === '4')).toBe(true);
    expect(selfStats.newYork[1911]).toHaveLength(2);
    expect(selfNights.filter((n) => n.placeId === 'new_york' && n.workId === '7')).toHaveLength(0);
    expect(selfNights.some((n) => n.placeId === 'brussels')).toBe(false);
    expect(selfNights.filter((n) => n.completeness === 'fragment').every((n) => n.fragmentScope)).toBe(true);
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

  it('counts the Sixth from the self-conducted set', () => {
    expect(parseWorks('hoe vaak de 6e')).toContain('6');
    const ans = answerQuery('hoe vaak de 6e', 'nl');
    expect(ans.unknown).toBe(false);
    expect(ans.text.nl).toMatch(/3/);
    expect(ans.eventIds).toEqual(expect.arrayContaining(['prem-6-1906', 'self-6-munich-1906', 'self-6-vienna-1907']));
    expect(ans.eventIds).toHaveLength(3);
  });

  it('answers Belgium as two complete nights and no Brussels', () => {
    const ans = answerQuery('België', 'nl');
    expect(ans.unknown).toBe(false);
    expect(ans.text.nl.toLowerCase()).toMatch(/luik/);
    expect(ans.text.nl.toLowerCase()).toMatch(/antwerpen/);
    expect(ans.text.nl.toLowerCase()).toMatch(/geen brussel/);
    expect(ans.eventIds).toEqual(expect.arrayContaining(['self-2-liege-1899', 'self-5-antwerp-1906']));
    expect(ans.eventIds).toHaveLength(2);
  });

  it('answers New York from the self-conducted set', () => {
    const ans = answerQuery('New York', 'nl');
    expect(ans.unknown).toBe(false);
    expect(ans.text.nl).toMatch(/1908/);
    expect(ans.text.nl).toMatch(/1909/);
    expect(ans.text.nl).toMatch(/1911/);
    expect(ans.text.nl.toLowerCase()).toMatch(/geen zevende/);
    expect(ans.eventIds.length).toBe(5);
  });

  it('says he never conducted the Ninth, Das Lied, or the Tenth', () => {
    const ninth = answerQuery('hoe vaak de 9e', 'nl');
    expect(ninth.text.nl.toLowerCase()).toMatch(/nooit/);
    expect(ninth.eventIds).toContain('prem-9-1912');
    const lied = answerQuery('Das Lied', 'nl');
    expect(lied.text.nl.toLowerCase()).toMatch(/nooit/);
    expect(lied.eventIds).toContain('prem-lied-1911');
    const tenth = answerQuery('tiende', 'nl');
    expect(tenth.text.nl.toLowerCase()).toMatch(/onvoltooid|nooit/);
  });

  it('does not answer about the chat panel being open or closed', () => {
    for (const q of ['sluit de chat', 'is de chat open', 'close the chat', 'De chat is open']) {
      const ans = answerQuery(q, 'nl');
      const blob = `${ans.text.nl} ${ans.extra?.nl ?? ''}`.toLowerCase();
      expect(blob).not.toMatch(/de chat is open|moet ik hem ook kunnen sluiten/);
    }
  });

  it('keeps Alma behind the deeper flag by default', () => {
    const open = answerQuery('Waar was Mahler op 9 maart 1902?', 'nl', { deep: false });
    expect(open.eventIds.includes('deep-alma-1902')).toBe(false);
    const deep = answerQuery('Waar was Mahler op 9 maart 1902?', 'nl', { deep: true });
    expect(deep.eventIds.includes('deep-alma-1902') || deep.text.nl.toLowerCase().includes('alma')).toBe(true);
  });
});
