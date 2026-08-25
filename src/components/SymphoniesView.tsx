import { performances, placeById, works } from '../data';
import { formatDate } from '../lib/dates';
import { t, ui } from '../lib/i18n';
import type { AtlasEvent, Locale } from '../types';

export function SymphoniesView({ locale, onJump }: { locale: Locale; onJump: (e: AtlasEvent) => void }) {
  return (
    <div className="list-view">
      <h2>{ui.views.symphonies[locale]}</h2>
      <div className="warn">
        {t('notMartner', locale)} {t('firstDecade', locale)}
      </div>
      {works.map((w) => {
        const rows = performances.filter((p) => p.workId === w.id);
        const prem = rows.find((p) => p.type === 'premiere' && !p.posthumous) ?? rows.find((p) => p.type === 'premiere');
        return (
          <section key={w.id} className="card">
            <h3>{w.title[locale]}</h3>
            <p className="meta">
              {w.composed}
              {w.unfinished ? ` · ${t('posthumous', locale)}` : ''}
            </p>
            {prem && <Row locale={locale} event={prem} onJump={onJump} />}
            {rows
              .filter((p) => p.id !== prem?.id)
              .map((p) => (
                <Row key={p.id} locale={locale} event={p} onJump={onJump} />
              ))}
          </section>
        );
      })}
    </div>
  );
}

function Row({ locale, event, onJump }: { locale: Locale; event: AtlasEvent; onJump: (e: AtlasEvent) => void }) {
  const place = placeById[event.placeId];
  return (
    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(196,163,90,0.15)' }}>
      <div className="kicker">
        {ui.types[event.type][locale]}
        {event.posthumous ? ` · ${t('posthumous', locale)}` : ''}
        {event.firstDecade ? ' · 1911–1921' : ''}
      </div>
      <p>
        <strong>{formatDate(event.dateStart, locale)}</strong>
        {place ? ` · ${place.city[locale]}` : ''}
        {place?.venue ? ` · ${place.venue[locale]}` : ''}
      </p>
      <p className="meta">
        {event.conductor ?? '—'}
        {event.orchestra ? ` · ${event.orchestra[locale]}` : ''}
      </p>
      <p>{event.summary[locale]}</p>
      <p className="source meta">
        {t('source', locale)}:{' '}
        {event.source.url ? (
          <a href={event.source.url} target="_blank" rel="noreferrer">
            {event.source.label}
          </a>
        ) : (
          event.source.label
        )}
      </p>
      <button className="chip" type="button" onClick={() => onJump(event)} style={{ marginTop: 6 }}>
        Atlas
      </button>
    </div>
  );
}
