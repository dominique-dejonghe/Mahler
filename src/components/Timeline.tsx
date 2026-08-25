import { formatDate, sliderToIso } from '../lib/dates';
import { t } from '../lib/i18n';
import type { Locale } from '../types';

export function Timeline({
  locale,
  yearFrac,
  iso,
  onChange,
}: {
  locale: Locale;
  yearFrac: number;
  iso: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="timeline">
      <div className="timeline-top">
        <div className="timeline-year">{Math.round(Number(sliderToIso(yearFrac).slice(0, 4)))}</div>
        <div className="timeline-date">{formatDate(iso, locale)}</div>
      </div>
      <input
        type="range"
        min={1860}
        max={1921}
        step={0.002}
        value={yearFrac}
        aria-label={t('year', locale)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
