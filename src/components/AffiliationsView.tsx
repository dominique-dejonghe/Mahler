import { affiliations, allEvents, placeById } from '../data';
import { formatDate } from '../lib/dates';
import { t, ui } from '../lib/i18n';
import type { AtlasEvent, Locale } from '../types';

export function AffiliationsView({ locale, onJump }: { locale: Locale; onJump: (e: AtlasEvent) => void }) {
  return (
    <div className="list-view">
      <h2>{ui.views.houses[locale]}</h2>
      <p className="meta">
        {locale === 'nl'
          ? 'Kapellmeister versus gast. Jaren zoals gedocumenteerd. Geen complete repertoirelijst.'
          : locale === 'de'
            ? 'Kapellmeister gegen Gast. Jahre wie belegt. Keine vollständige Repertoireliste.'
            : locale === 'cs'
              ? 'Kapelník versus host. Roky podle pramenů. Ne úplný repertoár.'
              : 'Kapellmeister versus guest. Years as documented. Not a complete repertoire list.'}
      </p>
      {affiliations.map((a) => {
        const place = placeById[a.placeId];
        const ev = allEvents.find((e) => e.affiliationId === a.id);
        const role =
          a.role === 'director' ? t('director', locale) : a.role === 'guest' ? t('guest', locale) : a.role === 'composer' ? t('composer', locale) : t('kapellmeister', locale);
        return (
          <article key={a.id} className="card">
            <div className="kicker">
              {role} · {formatDate(a.dateStart, locale).replace(/\d+\s/, '')}
              {` ${a.dateStart.slice(0, 4)}–${a.dateEnd.slice(0, 4)}`}
            </div>
            <h3>{a.name[locale]}</h3>
            <p className="meta">
              {place?.city[locale]}
              {place?.venue ? ` · ${place.venue[locale]}` : ''}
            </p>
            <p>{a.summary[locale]}</p>
            <p className="extra">{a.extra[locale]}</p>
            <p className="source meta">
              {t('source', locale)}:{' '}
              {a.source.url ? (
                <a href={a.source.url} target="_blank" rel="noreferrer">
                  {a.source.label}
                </a>
              ) : (
                a.source.label
              )}
            </p>
            {ev && (
              <button className="chip" type="button" onClick={() => onJump(ev)} style={{ marginTop: 8 }}>
                Atlas
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
