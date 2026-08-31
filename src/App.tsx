import { useEffect, useMemo, useState } from 'react';
import { AffiliationsView } from './components/AffiliationsView';
import { BrievenView } from './components/BrievenView';
import { ChatDock } from './components/ChatDock';
import { EventSheet } from './components/EventSheet';
import { MahlerAvatar } from './components/MahlerAvatar';
import { Header } from './components/Header';
import { MapPane } from './components/MapPane';
import { SymphoniesView } from './components/SymphoniesView';
import { Timeline } from './components/Timeline';
import { allEvents } from './data';
import { isoToSlider, sliderToIso } from './lib/dates';
import { t } from './lib/i18n';
import { eventsOnDate, locateOnDate, nearestAmong } from './lib/locate';
import { pathFromView, viewFromPath, type View } from './lib/views';
import type { AtlasEvent, Locale } from './types';

export type { View };
export type SeasonFilter = 'both' | 'winter' | 'summer';

const START = isoToSlider('1908-09-19');

export function App() {
  const [locale, setLocale] = useState<Locale>(() => readLocale());
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname));
  const [yearFrac, setYearFrac] = useState(START);
  const [season, setSeason] = useState<SeasonFilter>('both');
  const [showTrip, setShowTrip] = useState(false);
  const [deep, setDeep] = useState(false);
  const [selfOnly, setSelfOnly] = useState(false);
  const [chatOpen, setChatOpen] = useState(() => readChatOpen());
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
    localStorage.setItem('gustaaf-chat-open', chatOpen ? '1' : '0');
  }, [chatOpen]);

  useEffect(() => {
    function onPop() {
      setView(viewFromPath(window.location.pathname));
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function changeView(next: View) {
    setView(next);
    const path = pathFromView(next);
    if (window.location.pathname !== path) {
      history.pushState({ view: next }, '', path);
    }
  }

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
    changeView('atlas');
    setYearFrac(isoToSlider(event.dateStart));
    setFocusId(event.id);
    setFocusEvent(event);
  }

  return (
    <div className="app">
      <Header locale={locale} onLocale={setLocale} view={view} onView={changeView} />
      <div className={`stage${chatOpen ? ' chat-open' : ''}`}>
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
        {view === 'letters' && <BrievenView locale={locale} />}
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
        {!chatOpen && (
          <button
            className="chat-launch pulse"
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label={t('openChat', locale)}
          >
            <MahlerAvatar size={64} />
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

function readChatOpen(): boolean {
  const stored = localStorage.getItem('gustaaf-chat-open');
  if (stored === '1' || stored === 'true') return true;
  if (stored === '0' || stored === 'false') return false;
  return false;
}
