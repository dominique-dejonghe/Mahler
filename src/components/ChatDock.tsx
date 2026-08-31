import { useEffect, useRef, useState } from 'react';
import { allEvents } from '../data';
import { t, ui } from '../lib/i18n';
import { answerQuery } from '../lib/query';
import type { AtlasEvent, Locale } from '../types';
import { MahlerAvatar } from './MahlerAvatar';

interface Msg {
  role: 'user' | 'bot';
  text: string;
  extra?: string;
  eventIds: string[];
}

const STORAGE = 'gustaaf-chat';

export function ChatDock({
  locale,
  deep,
  onClose,
  onJump,
}: {
  locale: Locale;
  deep: boolean;
  onClose: () => void;
  onJump: (e: AtlasEvent) => void;
}) {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>(() => readMsgs(locale));
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem(STORAGE, JSON.stringify(msgs));
  }, [msgs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    const ans = answerQuery(q, locale, { deep });
    setMsgs((m) => [
      ...m,
      { role: 'user', text: q, eventIds: [] },
      { role: 'bot', text: ans.text[locale], extra: ans.extra?.[locale], eventIds: ans.eventIds },
    ]);
    setInput('');
    const first = allEvents.find((e) => e.id === ans.eventIds[0]);
    if (first) onJump(first);
  }

  return (
    <section className="chat-dock" aria-label="Gustaaf">
      <div className="chat-head">
        <div className="chat-brand">
          <MahlerAvatar size={44} className="chat-head-face" />
          <div>
            <h2>{t('chatTitle', locale)}</h2>
            <p className="meta">{t('chatHint', locale)}</p>
          </div>
        </div>
        <button className="chat-close" type="button" onClick={onClose} aria-label={t('close', locale)}>
          <span aria-hidden="true">×</span>
          {t('close', locale)}
        </button>
      </div>
      <div className="messages">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <div>{m.text}</div>
            {m.extra && <div className="extra">{m.extra}</div>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="examples">
        {ui.examples[locale].map((ex) => (
          <button key={ex} className="chip" type="button" onClick={() => ask(ex)}>
            {ex}
          </button>
        ))}
      </div>
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatPlaceholder', locale)}
          aria-label={t('chatTitle', locale)}
        />
        <button type="submit">{t('send', locale)}</button>
      </form>
    </section>
  );
}

function readMsgs(locale: Locale): Msg[] {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw) as Msg[];
  } catch {
    /* ignore */
  }
  return [{ role: 'bot', text: ui.welcome[locale], eventIds: [] }];
}
