import { formatDate, isoToSlider, sliderToIso } from '../lib/dates';
import { t } from '../lib/i18n';
import type { AtlasEvent, Locale } from '../types';

const SLIDER_START = 1860;
const SLIDER_END = 1921;

export function Timeline({
  locale,
  yearFrac,
  iso,
  onChange,
  ticks,
  onTick,
}: {
  locale: Locale;
  yearFrac: number;
  iso: string;
  onChange: (v: number) => void;
  ticks?: AtlasEvent[];
  onTick?: (e: AtlasEvent) => void;
}) {
  return (
    <div className="timeline">
      <div className="timeline-top">
        <div className="timeline-year">{Math.round(Number(sliderToIso(yearFrac).slice(0, 4)))}</div>
        <div className="timeline-date">{formatDate(iso, locale)}</div>
      </div>
      <div className="timeline-track">
        {ticks && ticks.length > 0 && (
          <div className="timeline-ticks" aria-hidden={false}>
            {ticks.map((event) => {
              const pct = ((isoToSlider(event.dateStart) - SLIDER_START) / (SLIDER_END - SLIDER_START)) * 100;
              return (
                <button
                  key={event.id}
                  type="button"
                  className={`tick${event.completeness === 'fragment' ? ' fragment' : ''}${event.belgium ? ' belgium' : ''}`}
                  style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
                  title={`${formatDate(event.dateStart, locale)} · ${event.title[locale]}`}
                  onClick={() => onTick?.(event)}
                />
              );
            })}
          </div>
        )}
        <input
          type="range"
          min={SLIDER_START}
          max={SLIDER_END}
          step={0.002}
          value={yearFrac}
          aria-label={t('year', locale)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
