const MONTHS: Record<string, number> = {
  januari: 1, january: 1, januar: 1, leden: 1,
  februari: 2, february: 2, februar: 2, únor: 2, unor: 2,
  maart: 3, march: 3, märz: 3, marz: 3, březen: 3, brezen: 3,
  april: 4, duben: 4,
  mei: 5, may: 5, mai: 5, květen: 5, kveten: 5,
  juni: 6, june: 6, červen: 6, cerven: 6,
  juli: 7, july: 7, červenec: 7, cervenec: 7,
  augustus: 8, august: 8, srpen: 8,
  september: 9, září: 9, zari: 9, sep: 9, sept: 9,
  oktober: 10, october: 10, říjen: 10, rijen: 10, okt: 10,
  november: 11, listopad: 11, nov: 11,
  december: 12, dezember: 12, prosinec: 12, dec: 12, dez: 12,
};

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function dayNumber(iso: string): number {
  return Math.floor(parseIso(iso).getTime() / 86400000);
}

export function inRange(iso: string, start: string, end?: string): boolean {
  const t = dayNumber(iso);
  const a = dayNumber(start);
  const b = dayNumber(end ?? start);
  return t >= Math.min(a, b) && t <= Math.max(a, b);
}

export function formatDate(iso: string, locale: string): string {
  const loc =
    locale === 'nl' ? 'nl-BE' : locale === 'de' ? 'de-DE' : locale === 'cs' ? 'cs-CZ' : 'en-GB';
  return parseIso(iso).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function parseDatesFromText(text: string): string[] {
  const q = text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const found = new Set<string>();

  const iso = q.match(/\b(18|19)\d{2}-\d{2}-\d{2}\b/g);
  iso?.forEach((d) => found.add(d));

  const dotted = q.match(/\b(\d{1,2})[./](\d{1,2})[./]((?:18|19)\d{2})\b/g);
  dotted?.forEach((raw) => {
    const m = raw.match(/(\d{1,2})[./](\d{1,2})[./]((?:18|19)\d{2})/);
    if (!m) return;
    found.add(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
  });

  const named = q.match(
    /\b(\d{1,2})\.?\s+(januari|january|januar|leden|februari|february|februar|unor|maart|march|marz|brezen|april|duben|mei|may|mai|kveten|juni|june|cerven|juli|july|cervenec|augustus|august|srpen|september|zari|sep|sept|oktober|october|rijen|okt|november|listopad|nov|december|dezember|prosinec|dec|dez)\s+((?:18|19)\d{2})\b/g,
  );
  named?.forEach((raw) => {
    const m = raw.match(/(\d{1,2})\.?\s+([a-z]+)\s+((?:18|19)\d{2})/);
    if (!m) return;
    const month = MONTHS[m[2]];
    if (!month) return;
    found.add(`${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`);
  });

  const english = q.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+((?:18|19)\d{2})\b/g,
  );
  english?.forEach((raw) => {
    const m = raw.match(/([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+((?:18|19)\d{2})/);
    if (!m) return;
    const month = MONTHS[m[1]];
    if (!month) return;
    found.add(`${m[3]}-${String(month).padStart(2, '0')}-${m[2].padStart(2, '0')}`);
  });

  return [...found];
}

export function parseYearFromText(text: string): number | null {
  const m = text.match(/\b(18[6-9]\d|19[0-2]\d|1964)\b/);
  return m ? Number(m[1]) : null;
}

export function sliderToIso(yearFrac: number): string {
  const year = Math.floor(yearFrac);
  const frac = yearFrac - year;
  const days = Math.round(frac * (isLeap(year) ? 365 : 364));
  const d = new Date(Date.UTC(year, 0, 1 + days));
  return toIso(d);
}

export function isoToSlider(iso: string): number {
  const d = parseIso(iso);
  const year = d.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);
  const t = d.getTime();
  const frac = (t - start) / (end - start);
  return year + Math.min(1, Math.max(0, frac));
}

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
