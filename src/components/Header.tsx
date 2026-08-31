import { localeLabel, locales, t, ui } from '../lib/i18n';
import type { View } from '../lib/views';
import type { Locale } from '../types';

const NAV: View[] = ['atlas', 'houses', 'symphonies', 'letters'];

export function Header({
  locale,
  onLocale,
  view,
  onView,
}: {
  locale: Locale;
  onLocale: (l: Locale) => void;
  view: View;
  onView: (v: View) => void;
}) {
  return (
    <header className="header">
      <div className="brand">
        <strong>Gustaaf</strong>
        <span>{t('tag', locale)}</span>
      </div>
      <nav className="views" aria-label="views">
        {NAV.map((v) => (
          <button key={v} className={`view-btn${view === v ? ' on' : ''}`} type="button" onClick={() => onView(v)}>
            {ui.views[v][locale]}
          </button>
        ))}
      </nav>
      <div className="langs" aria-label="language">
        {locales.map((l) => (
          <button key={l} className={`lang${locale === l ? ' on' : ''}`} type="button" onClick={() => onLocale(l)}>
            {localeLabel[l]}
          </button>
        ))}
      </div>
    </header>
  );
}
