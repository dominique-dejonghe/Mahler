import { useMemo, useState } from 'react';
import { brieven, bronnen, correspondentById, correspondenten } from '../data/brieven/load';
import {
  filterBrieven,
  filterCorrespondenten,
  formatLetterDate,
  hasQuote,
  uniquePlaces,
  uniqueTags,
  uniqueYears,
} from '../lib/brieven';
import { t, ui } from '../lib/i18n';
import type { Locale } from '../types';

const INDEX_TABLE = 'https://www.mahler-online.at/letters_table.html';
const INDEX_SEARCH = 'https://www.mahler-online.at/letters_search.html';

export function BrievenView({ locale }: { locale: Locale }) {
  const [who, setWho] = useState('');
  const [tag, setTag] = useState('');
  const [recipient, setRecipient] = useState('');
  const [year, setYear] = useState('');
  const [place, setPlace] = useState('');

  const people = useMemo(
    () => filterCorrespondenten(correspondenten, { text: who, tag }),
    [who, tag],
  );
  const letters = useMemo(
    () => filterBrieven(brieven, { correspondentId: recipient, year, place }),
    [recipient, year, place],
  );

  const years = uniqueYears(brieven);
  const places = uniquePlaces(brieven);
  const tags = uniqueTags(correspondenten);

  return (
    <div className="list-view brieven-view">
      <h2>{ui.views.letters[locale]}</h2>
      <p className="meta">{t('lettersIntro', locale)}</p>
      <p className="meta">
        {t('lettersIndex', locale)}{' '}
        <a href={INDEX_TABLE} target="_blank" rel="noreferrer">
          mahler-online.at/letters_table.html
        </a>
        {' · '}
        <a href={INDEX_SEARCH} target="_blank" rel="noreferrer">
          letters_search.html
        </a>
      </p>
      <div className="warn">{t('lettersCopyright', locale)}</div>

      <section className="brieven-section" aria-labelledby="brieven-correspondenten">
        <h3 id="brieven-correspondenten">{t('lettersCorrespondents', locale)}</h3>
        <div className="brieven-filters">
          <label>
            <span className="kicker">{t('lettersFilterSearch', locale)}</span>
            <input
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder={t('lettersFilterSearch', locale)}
              aria-label={t('lettersFilterSearch', locale)}
            />
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
        {people.length === 0 ? (
          <Empty locale={locale} />
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
        <div className="brieven-filters">
          <label>
            <span className="kicker">{t('lettersFilterRecipient', locale)}</span>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
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
            <span className="kicker">{t('lettersFilterPlace', locale)}</span>
            <select value={place} onChange={(e) => setPlace(e.target.value)} aria-label={t('lettersFilterPlace', locale)}>
              <option value="">{t('lettersFilterAll', locale)}</option>
              {places.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
        {letters.length === 0 ? (
          <Empty locale={locale} />
        ) : (
          letters.map((letter) => {
            const whoTo = correspondentById[letter.correspondentId];
            const source = bronnen.find((b) => b.id === letter.sourceId);
            return (
              <article key={letter.id} className="card">
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
        {bronnen.length === 0 ? (
          <Empty locale={locale} />
        ) : (
          bronnen.map((b) => (
            <article key={b.id} className="card">
              <div className="kicker">{b.year ?? t('source', locale)}</div>
              <h3>{b.labelNl}</h3>
              <p className="meta">{b.noteNl}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function Empty({ locale }: { locale: Locale }) {
  return (
    <p className="empty">
      {t('lettersEmpty', locale)}{' '}
      <a href={INDEX_TABLE} target="_blank" rel="noreferrer">
        mahler-online.at
      </a>
    </p>
  );
}
