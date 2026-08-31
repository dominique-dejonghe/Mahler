import {
  allEvents,
  neverSelfConducted,
  placeById,
  premiereNight,
  selfNights,
  selfStats,
  venueOf,
  works,
} from '../data';
import { worksByYear } from '../data/works';
import { formatDate } from '../lib/dates';
import { t, ui } from '../lib/i18n';
import type { AtlasEvent, Locale, WorkId } from '../types';

const SELF_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export function SymphoniesView({
  locale,
  onJump,
  selfOnly,
  onSelfOnly,
}: {
  locale: Locale;
  onJump: (e: AtlasEvent) => void;
  selfOnly: boolean;
  onSelfOnly: (v: boolean) => void;
}) {
  const later = allEvents.filter((e) => e.workId && !e.selfConducted && (e.type === 'premiere' || e.type === 'performance'));

  return (
    <div className="list-view">
      <h2>{ui.views.symphonies[locale]}</h2>
      <section className="card catalog-card" aria-label={t('catalog', locale)}>
        <h3>{t('catalog', locale)}</h3>
        <p className="meta">{t('catalogIntro', locale)}</p>
        {worksByYear().map((w) => (
          <div key={w.id} className="catalog-row">
            <div className="kicker">
              {w.composed}
              {w.unfinished ? ` · ${t('unfinished', locale)}` : ''}
            </div>
            <p>
              <strong>{w.title[locale]}</strong>
            </p>
            <div className="catalog-links">
              <a className="chip" href={w.listen.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('listen', locale)} · ${w.title[locale]}`}>
                {t('spotifyAll', locale)}
              </a>
              <a className="chip" href={w.watch.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('watch', locale)} · ${w.title[locale]}`}>
                {t('youtubeAll', locale)}
              </a>
            </div>
          </div>
        ))}
      </section>
      <div className="layers" style={{ position: 'static', margin: '8px 0 12px' }}>
        <button className={`chip${selfOnly ? ' on' : ''}`} type="button" onClick={() => onSelfOnly(!selfOnly)}>
          {t('selfOnPodium', locale)}
        </button>
      </div>
      <div className="warn">
        {t('selfCounts', locale)} {t('belgiumNights', locale)}
      </div>
      <div className="self-overview" aria-label={t('selfOnPodium', locale)}>
        {(['1', '2', '3', '4', '5', '6', '7', '8'] as const).map((id) => {
          const prem = premiereNight(id);
          const place = prem ? placeById[prem.placeId] : undefined;
          const event = prem ? allEvents.find((e) => e.id === prem.id) : undefined;
          return (
            <button
              key={id}
              type="button"
              className="self-cell"
              disabled={!event}
              onClick={() => event && onJump(event)}
            >
              <strong>{id}</strong>
              <span>{place?.city[locale] ?? '—'}</span>
              <em>{prem ? prem.date.slice(0, 4) : '—'}</em>
            </button>
          );
        })}
      </div>

      {works
        .filter((w) => (SELF_IDS as readonly string[]).includes(w.id))
        .map((w) => {
          const nights = selfNights.filter((n) => n.workId === w.id);
          const counts = selfStats.byWork[w.id as '1'];
          return (
            <section key={w.id} className="card">
              <h3>{w.title[locale]}</h3>
              <p className="meta">
                {w.composed}
                {counts ? ` · ${counts.complete} ${t('complete', locale).toLowerCase()}` : ''}
                {counts && counts.fragments ? ` · ${counts.fragments} ${t('fragment', locale).toLowerCase()}` : ''}
              </p>
              {nights.map((n) => {
                const event = allEvents.find((e) => e.id === n.id);
                if (!event) return null;
                return <NightRow key={n.id} locale={locale} event={event} onJump={onJump} />;
              })}
            </section>
          );
        })}

      <section className="card never-card">
        <h3>{t('neverSelf', locale)}</h3>
        {neverSelfConducted.map((row) => {
          const work = works.find((w) => w.id === row.workId);
          const event = row.eventId ? allEvents.find((e) => e.id === row.eventId) : undefined;
          const place = row.placeId ? placeById[row.placeId] : undefined;
          return (
            <div key={row.workId} style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(196,163,90,0.15)' }}>
              <div className="kicker">
                {t('neverSelf', locale)}
                {row.unfinished ? ` · ${t('unfinished', locale)}` : ''}
              </div>
              <p>
                <strong>{work?.title[locale]}</strong>
                {row.unfinished ? ` · ${t('unfinished', locale)}` : ''}
                {row.conductor ? ` · ${row.conductor}` : ''}
                {row.date ? ` · ${formatDate(row.date, locale)}` : ''}
                {place ? ` · ${place.city[locale]}` : ''}
              </p>
              {event && (
                <button className="chip" type="button" onClick={() => onJump(event)} style={{ marginTop: 6 }}>
                  Atlas
                </button>
              )}
            </div>
          );
        })}
      </section>

      {!selfOnly && (
        <>
          <div className="warn">{t('after1911', locale)}</div>
          {(['9', 'lied', '10'] as WorkId[]).map((id) => {
            const w = works.find((x) => x.id === id);
            const rows = later.filter((p) => p.workId === id);
            if (!w) return null;
            return (
              <section key={id} className="card">
                <h3>{w.title[locale]}</h3>
                <p className="meta">
                  {w.composed}
                  {w.unfinished ? ` · ${t('unfinished', locale)}` : ''}
                </p>
                {rows.map((p) => (
                  <Row key={p.id} locale={locale} event={p} onJump={onJump} />
                ))}
              </section>
            );
          })}
          {works
            .filter((w) => (SELF_IDS as readonly string[]).includes(w.id))
            .map((w) => {
              const rows = later.filter((p) => p.workId === w.id);
              if (!rows.length) return null;
              return (
                <section key={`later-${w.id}`} className="card">
                  <h3>
                    {w.title[locale]} <span className="meta">· 1911–1921</span>
                  </h3>
                  {rows.map((p) => (
                    <Row key={p.id} locale={locale} event={p} onJump={onJump} />
                  ))}
                </section>
              );
            })}
        </>
      )}
    </div>
  );
}

function NightRow({ locale, event, onJump }: { locale: Locale; event: AtlasEvent; onJump: (e: AtlasEvent) => void }) {
  const place = placeById[event.placeId];
  const hall = venueOf(event);
  return (
    <button type="button" className="night-row" onClick={() => onJump(event)}>
      <span className="kicker">
        {event.type === 'premiere' ? ui.types.premiere[locale] : ui.types.performance[locale]}
        {event.completeness === 'fragment' ? ` · ${t('fragment', locale)}` : ` · ${t('complete', locale)}`}
        {event.belgium ? ' · België' : ''}
      </span>
      <span>
        <strong>{formatDate(event.dateStart, locale)}</strong>
        {place ? ` · ${place.city[locale]}` : ''}
        {hall ? ` · ${hall[locale]}` : ''}
      </span>
    </button>
  );
}

function Row({ locale, event, onJump }: { locale: Locale; event: AtlasEvent; onJump: (e: AtlasEvent) => void }) {
  const place = placeById[event.placeId];
  const hall = venueOf(event);
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
        {hall ? ` · ${hall[locale]}` : ''}
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
