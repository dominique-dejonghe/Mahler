import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { locales, t } from '../lib/i18n';
import { SymphoniesView } from './SymphoniesView';

const STAR_PICKS =
  /Bernstein|Boulez|Chailly|Karajan|Haitink|Jansons|Rattle|Hampson|Cooke/i;

function catalogHtml(locale: 'nl' | 'en' | 'de' | 'cs'): string {
  const html = renderToStaticMarkup(
    createElement(SymphoniesView, {
      locale,
      onJump: () => undefined,
      selfOnly: false,
      onSelfOnly: () => undefined,
    }),
  );
  const start = html.indexOf('catalog-card');
  expect(start).toBeGreaterThan(-1);
  const end = html.indexOf('</section>', start);
  return html.slice(start, end);
}

describe('SymphoniesView catalog chips', () => {
  it('labels every catalog chip as a work search in all locales, without star conductors', () => {
    for (const locale of locales) {
      expect(t('spotifyAll', locale)).not.toMatch(STAR_PICKS);
      expect(t('youtubeAll', locale)).not.toMatch(STAR_PICKS);
      const section = catalogHtml(locale);
      expect(section).toContain(t('spotifyAll', locale));
      expect(section).toContain(t('youtubeAll', locale));
      expect(section).not.toMatch(STAR_PICKS);
      expect(section).toContain('https://open.spotify.com/search/');
      expect(section).toContain('https://www.youtube.com/results?search_query=');
      expect(section).not.toContain('/album/');
      expect(section).not.toContain('watch?v=');
    }
  });

  it('leaves the Mahler-zelf layer available beside the catalog', () => {
    const html = renderToStaticMarkup(
      createElement(SymphoniesView, {
        locale: 'nl',
        onJump: () => undefined,
        selfOnly: false,
        onSelfOnly: () => undefined,
      }),
    );
    expect(html).toContain('Mahler zelf op de bok');
    expect(html).toContain('Werken op jaartal');
  });
});
