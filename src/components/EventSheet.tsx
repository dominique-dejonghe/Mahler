import { eventPlace } from '../data';
import { formatDate } from '../lib/dates';
import { t, ui } from '../lib/i18n';
import type { AtlasEvent, Locale } from '../types';

export function EventSheet({
  locale,
  event,
  inferred,
  onClose,
}: {
  locale: Locale;
  event: AtlasEvent;
  inferred: boolean;
  onClose: () => void;
}) {
  const place = eventPlace(event);
  return (
    <aside className="sheet" aria-live="polite">
      <div className="kicker">
        {ui.types[event.type][locale]}
        {event.posthumous ? ` · ${t('posthumous', locale)}` : ''}
      </div>
      <h2>{event.title[locale]}</h2>
      <p className="meta">
        {formatDate(event.dateStart, locale)}
        {event.dateEnd && event.dateEnd !== event.dateStart ? ` – ${formatDate(event.dateEnd, locale)}` : ''}
        {place ? ` · ${place.city[locale]}` : ''}
        {place?.venue ? ` · ${place.venue[locale]}` : ''}
      </p>
      <p>{event.summary[locale]}</p>
      <p className="extra">{event.extra[locale]}</p>
      {inferred && <p className="meta">{t('inferred', locale)}</p>}
      {place?.note && <p className="meta">{place.note[locale]}</p>}
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
      <button className="chip" type="button" onClick={onClose} style={{ marginTop: 8 }}>
        {t('close', locale)}
      </button>
    </aside>
  );
}
