import { useEffect, useMemo, useState } from 'react';
import { AffiliationsView } from './components/AffiliationsView';
import { ChatDock } from './components/ChatDock';
import { EventSheet } from './components/EventSheet';
import { Header } from './components/Header';
import { MapPane } from './components/MapPane';
import { SymphoniesView } from './components/SymphoniesView';
import { Timeline } from './components/Timeline';
import { allEvents } from './data';
import { isoToSlider, sliderToIso } from './lib/dates';
import { eventsOnDate, locateOnDate, nearestAmong } from './lib/locate';
import type { AtlasEvent, Locale } from './types';

export type View = 'atlas' | 'houses' | 'symphonies';
export type SeasonFilter = 'both' | 'winter' | 'summer';

const START = isoToSlider('1908-09-19');

export function App() {
  const [locale, setLocale] = useState<Locale>(() => readLocale());
  const [view, setView] = useState<View>('atlas');
  const [yearFrac, setYearFrac] = useState(START);
  const [season, setSeason] = useState<SeasonFilter>('both');
  const [showTrip, setShowTrip] = useState(false);
  const [deep, setDeep] = useState(false);
  const [selfOnly, setSelfOnly] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [focusId, setFocusId] = useState<string | null>('prem-7-1908');
  const [focusEvent, setFocusEvent] = useState<AtlasEvent | null>(null);

  const iso = sliderToIso(yearFrac);

  const visible = useMemo(() => {
    return allEvents.filter((e) => {
      if (!deep && e.deep) return false;
      if (season !== 'both' && e.season && e.season !== season) return false;
      if (selfOnly && !e.selfConducted) return false;
      return true;
    });
  }, [deep, season, selfOnly]);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('gustaaf-locale', locale);
  }, [locale]);

  useEffect(() => {
    const onDate = eventsOnDate(iso, { deep }).filter((e) => visible.includes(e));
    if (onDate[0]) {
      setFocusEvent(onDate[0]);
      setFocusId(onDate[0].id);
      return;
    }
    if (selfOnly) {
      const near = nearestAmong(iso, visible);
      setFocusEvent(near?.event ?? null);
      setFocusId(near?.event?.id ?? null);
      return;
    }
    const hit = locateOnDate(iso, { deep });
    setFocusEvent(hit.event ?? null);
    setFocusId(hit.event?.id ?? null);
  }, [iso, deep, visible, selfOnly]);

  function jumpToEvent(event: AtlasEvent) {
    if (!event.selfConducted) setSelfOnly(false);
    setView('atlas');
    setYearFrac(isoToSlider(event.dateStart));
    setFocusId(event.id);
    setFocusEvent(event);
  }

  return (
    <div className="app">
      <Header locale={locale} onLocale={setLocale} view={view} onView={setView} />
      <div className="stage">
        {view === 'atlas' && (
          <MapPane
            locale={locale}
            events={visible}
            focusId={focusId}
            showTrip={showTrip}
            season={season}
            deep={deep}
            selfOnly={selfOnly}
            onSeason={setSeason}
            onTrip={setShowTrip}
            onDeep={setDeep}
            onSelfOnly={setSelfOnly}
            onSelect={(e) => {
              setFocusId(e.id);
              setFocusEvent(e);
              setYearFrac(isoToSlider(e.dateStart));
            }}
          />
        )}
        {view === 'houses' && <AffiliationsView locale={locale} onJump={jumpToEvent} />}
        {view === 'symphonies' && (
          <SymphoniesView locale={locale} onJump={jumpToEvent} selfOnly={selfOnly} onSelfOnly={setSelfOnly} />
        )}
        {view === 'atlas' && focusEvent && (
          <EventSheet
            locale={locale}
            event={focusEvent}
            inferred={!eventsOnDate(iso, { deep }).some((e) => e.id === focusEvent.id && e.datePrecision === 'day')}
            onClose={() => setFocusEvent(null)}
          />
        )}
        {view === 'atlas' && (
          <button
            className={`chat-fab${chatOpen ? ' open' : ''}`}
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            aria-label="Gustaaf"
          >
            G
          </button>
        )}
        {chatOpen && (
          <ChatDock
            locale={locale}
            deep={deep}
            onClose={() => setChatOpen(false)}
            onJump={jumpToEvent}
          />
        )}
      </div>
      {view === 'atlas' && (
        <Timeline
            locale={locale}
            yearFrac={yearFrac}
            iso={iso}
            onChange={setYearFrac}
            ticks={selfOnly ? visible : []}
            onTick={(e) => {
              setFocusId(e.id);
              setFocusEvent(e);
              setYearFrac(isoToSlider(e.dateStart));
            }}
          />
      )}
    </div>
  );
}

function readLocale(): Locale {
  const stored = localStorage.getItem('gustaaf-locale');
  if (stored === 'en' || stored === 'de' || stored === 'cs' || stored === 'nl') return stored;
  return 'nl';
}
