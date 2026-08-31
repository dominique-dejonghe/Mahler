import type { Brief, Bron, Correspondent } from '../types';

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

export function hasQuote(value?: string | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function yearOf(date: string): string {
  return date.slice(0, 4);
}

export function formatLetterDate(date: string, locale: string): string {
  const loc =
    locale === 'nl' ? 'nl-BE' : locale === 'de' ? 'de-DE' : locale === 'cs' ? 'cs-CZ' : 'en-GB';
  if (/^\d{4}$/.test(date)) return date;
  if (/^\d{4}-\d{2}$/.test(date)) {
    const [y, m] = date.split('-').map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, 1)).toLocaleDateString(loc, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString(loc, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  return date;
}

export function filterCorrespondenten(
  rows: Correspondent[],
  q: { text?: string; tag?: string; id?: string },
): Correspondent[] {
  const text = q.text?.trim().toLowerCase() ?? '';
  const tag = q.tag?.trim().toLowerCase() ?? '';
  const id = q.id?.trim() ?? '';
  return rows.filter((row) => {
    if (id && row.id !== id) return false;
    if (tag && !(row.tags ?? []).some((t) => t.toLowerCase() === tag)) return false;
    if (!text) return true;
    const hay = `${row.name} ${row.whyNl} ${(row.tags ?? []).join(' ')}`.toLowerCase();
    return hay.includes(text);
  });
}

export function sortBrieven(rows: Brief[]): Brief[] {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date));
}

export function filterBrieven(
  rows: Brief[],
  q: { correspondentId?: string; year?: string; tag?: string },
  people: Correspondent[] = [],
): Brief[] {
  const correspondentId = q.correspondentId?.trim() ?? '';
  const year = q.year?.trim() ?? '';
  const tag = q.tag?.trim().toLowerCase() ?? '';
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));
  return rows.filter((row) => {
    if (correspondentId && row.correspondentId !== correspondentId) return false;
    if (year && yearOf(row.date) !== year) return false;
    if (tag) {
      const person = byId[row.correspondentId];
      if (!(person?.tags ?? []).some((item) => item.toLowerCase() === tag)) return false;
    }
    return true;
  });
}

export function uniqueYears(rows: Brief[]): string[] {
  return [...new Set(rows.map((r) => yearOf(r.date)))].filter(Boolean).sort();
}

export function uniquePlaces(rows: Brief[]): string[] {
  return [...new Set(rows.map((r) => r.place).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'nl'),
  );
}

export function uniqueTags(rows: Correspondent[]): string[] {
  return [...new Set(rows.flatMap((r) => r.tags ?? []))].sort((a, b) => a.localeCompare(b, 'nl'));
}

export function isKebabId(id: string): boolean {
  return KEBAB.test(id);
}

export function validateCorrespondenten(data: unknown): string[] {
  if (!Array.isArray(data)) return ['correspondenten must be an array'];
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, row] of data.entries()) {
    const at = `correspondenten[${i}]`;
    if (!row || typeof row !== 'object') {
      errors.push(`${at} must be an object`);
      continue;
    }
    const r = row as Partial<Correspondent>;
    if (!r.id || !isKebabId(r.id)) errors.push(`${at}.id must be kebab-case`);
    else if (seen.has(r.id)) errors.push(`${at}.id duplicate: ${r.id}`);
    else seen.add(r.id);
    if (!r.name?.trim()) errors.push(`${at}.name required`);
    if (!hasPeriod(r.periodFrom)) errors.push(`${at}.periodFrom required`);
    if (!hasPeriod(r.periodTo)) errors.push(`${at}.periodTo required`);
    if (!r.whyNl?.trim()) errors.push(`${at}.whyNl required`);
  }
  return errors;
}

export function validateBrieven(
  data: unknown,
  correspondentIds: Set<string>,
  sourceIds: Set<string>,
): string[] {
  if (!Array.isArray(data)) return ['brieven must be an array'];
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, row] of data.entries()) {
    const at = `brieven[${i}]`;
    if (!row || typeof row !== 'object') {
      errors.push(`${at} must be an object`);
      continue;
    }
    const r = row as Partial<Brief>;
    if (!r.id || !isKebabId(r.id)) errors.push(`${at}.id must be kebab-case`);
    else if (seen.has(r.id)) errors.push(`${at}.id duplicate: ${r.id}`);
    else seen.add(r.id);
    if (!r.date || !DATE.test(r.date)) errors.push(`${at}.date must be YYYY, YYYY-MM, or YYYY-MM-DD`);
    if (!r.place?.trim()) errors.push(`${at}.place required`);
    if (!r.correspondentId || !isKebabId(r.correspondentId)) errors.push(`${at}.correspondentId must be kebab-case`);
    else if (correspondentIds.size && !correspondentIds.has(r.correspondentId)) {
      errors.push(`${at}.correspondentId unknown: ${r.correspondentId}`);
    }
    if (!r.summaryNl?.trim()) errors.push(`${at}.summaryNl required`);
    if (!r.whyNl?.trim()) errors.push(`${at}.whyNl required`);
    if (!r.sourceId || !isKebabId(r.sourceId)) errors.push(`${at}.sourceId must be kebab-case`);
    else if (sourceIds.size && !sourceIds.has(r.sourceId)) {
      errors.push(`${at}.sourceId unknown: ${r.sourceId}`);
    }
    if (r.quoteDE != null && typeof r.quoteDE !== 'string') errors.push(`${at}.quoteDE must be string or null`);
    if (r.quoteNL != null && typeof r.quoteNL !== 'string') errors.push(`${at}.quoteNL must be string or null`);
  }
  return errors;
}

export function validateBronnen(data: unknown): string[] {
  if (!Array.isArray(data)) return ['bronnen must be an array'];
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, row] of data.entries()) {
    const at = `bronnen[${i}]`;
    if (!row || typeof row !== 'object') {
      errors.push(`${at} must be an object`);
      continue;
    }
    const r = row as Partial<Bron>;
    if (!r.id || !isKebabId(r.id)) errors.push(`${at}.id must be kebab-case`);
    else if (seen.has(r.id)) errors.push(`${at}.id duplicate: ${r.id}`);
    else seen.add(r.id);
    if (!r.labelNl?.trim()) errors.push(`${at}.labelNl required`);
    if (!r.noteNl?.trim()) errors.push(`${at}.noteNl required`);
    if (r.year != null && !Number.isInteger(r.year)) errors.push(`${at}.year must be an integer or null`);
  }
  return errors;
}

function hasPeriod(value: unknown): boolean {
  if (typeof value === 'number') return Number.isInteger(value);
  return typeof value === 'string' && value.trim().length > 0;
}
