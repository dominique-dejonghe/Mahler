import { useMemo, useState } from 'react';
import { brieven, bronnen, correspondentById, correspondenten } from '../data/brieven/load';
import { filterBrieven, filterCorrespondenten, formatLetterDate, hasQuote, uniqueTags, uniqueYears } from '../lib/brieven';
import { t, ui } from '../lib/i18n';
import type { Locale } from '../types';

const INDEX_TABLE = 'https://www.mahler-online.at/letters_table.html';
const INDEX_SEARCH = 'https://www.mahler-online.at/letters_search.html';

export function BrievenView({ locale }: { locale: Locale }) {
  const [correspondentId, setCorrespondentId] = useState('');
  const [year, setYear] = useState('');
  const [tag, setTag] = useState('');

  const people = useMemo(
    () => filterCorrespondenten(correspondenten, { id: correspondentId, tag }),
    [correspondentId, tag],
  );
  const letters = useMemo(
    () => filterBrieven(brieven, { correspondentId, year, tag }, correspondenten),
    [correspondentId, year, tag],
  );

  const years = uniqueYears(brieven);
  const tags = uniqueTags(correspondenten);

  return (
    <div className="list-view brieven-view">
      <h2>{ui.views.letters[locale]}</h2>
      <p className="meta">{t('lettersIntro', locale)}</p>
      <div className="warn">{t('lettersCopyright', locale)}</div>

      <div className="brieven-filters">
        <label>
          <span className="kicker">{t('lettersFilterRecipient', locale)}</span>
          <select
            value={correspondentId}
            onChange={(e) => setCorrespondentId(e.target.value)}
            aria-label={t('lettersFilterRecipient', locale)}
          >
            <option value="">{t('lettersFilterAll', locale)}</option>
            {correspondenten.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="kicker">{t('lettersFilterYear', locale)}</span>
          <select value={year} onChange={(e) => setYear(e.target.value)} aria-label={t('lettersFilterYear', locale)}>
            <option value="">{t('lettersFilterAll', locale)}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="kicker">{t('lettersFilterTag', locale)}</span>
          <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label={t('lettersFilterTag', locale)}>
            <option value="">{t('lettersFilterAll', locale)}</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="brieven-section" aria-labelledby="brieven-correspondenten">
        <h3 id="brieven-correspondenten">{t('lettersCorrespondents', locale)}</h3>
        {people.length === 0 ? (
          <Empty locale={locale} people />
        ) : (
          people.map((c) => (
            <article key={c.id} className="card">
              <div className="kicker">
                {t('lettersPeriod', locale)} · {c.periodFrom}–{c.periodTo}
              </div>
              <h3>{c.name}</h3>
              <p>{c.whyNl}</p>
              {c.tags?.length ? <p className="meta">{c.tags.join(' · ')}</p> : null}
            </article>
          ))
        )}
      </section>

      <section className="brieven-section" aria-labelledby="brieven-sleutel">
        <h3 id="brieven-sleutel">{t('lettersKey', locale)}</h3>
        {letters.length === 0 ? (
          <Empty locale={locale} />
        ) : (
          letters.map((letter) => {
            const whoTo = correspondentById[letter.correspondentId];
            const source = bronnen.find((b) => b.id === letter.sourceId);
            return (
              <article key={letter.id} className="card" id={letter.id}>
                <div className="kicker">
                  {formatLetterDate(letter.date, locale)}
                  {letter.place ? ` · ${letter.place}` : ''}
                  {whoTo ? ` · ${whoTo.name}` : ''}
                </div>
                <h3>{whoTo?.name ?? letter.correspondentId}</h3>
                <p>{letter.summaryNl}</p>
                <p className="extra">{letter.whyNl}</p>
                {hasQuote(letter.quoteDE) ? <blockquote className="quote">„{letter.quoteDE!.trim()}”</blockquote> : null}
                {hasQuote(letter.quoteNL) ? <blockquote className="quote">{letter.quoteNL!.trim()}</blockquote> : null}
                <p className="source meta">
                  {t('source', locale)}: {source?.labelNl ?? letter.sourceId}
                </p>
                {letter.mahlerOnlineUrl ? (
                  <p className="meta">
                    <a href={letter.mahlerOnlineUrl} target="_blank" rel="noreferrer">
                      {t('lettersMahlerOnline', locale)}
                    </a>
                  </p>
                ) : null}
              </article>
            );
          })
        )}
      </section>

      <section className="brieven-section" aria-labelledby="brieven-bronnen">
        <h3 id="brieven-bronnen">{t('lettersSources', locale)}</h3>
        {bronnen.map((b) => (
          <article key={b.id} className="card" id={b.id}>
            {b.year != null ? <div className="kicker">{b.year}</div> : null}
            <h3>{b.labelNl}</h3>
            <p className="meta">{b.noteNl}</p>
          </article>
        ))}
      </section>

      <footer className="brieven-footer">
        <a href={INDEX_TABLE} target="_blank" rel="noreferrer">
          mahler-online.at/letters_table.html
        </a>
        <a href={INDEX_SEARCH} target="_blank" rel="noreferrer">
          mahler-online.at/letters_search.html
        </a>
      </footer>
    </div>
  );
}

function Empty({ locale, people }: { locale: Locale; people?: boolean }) {
  return (
    <p className="empty">
      {t(people ? 'lettersEmptyPeople' : 'lettersEmpty', locale)}{' '}
      <a href={INDEX_TABLE} target="_blank" rel="noreferrer">
        mahler-online.at
      </a>
    </p>
  );
}
