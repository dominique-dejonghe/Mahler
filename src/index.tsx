import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { serveStatic } from 'hono/cloudflare-workers';

import type { Locale } from './lib/data';
import { isLocale } from './lib/data';

import { HomePage } from './routes/home';
import {
  ReisPage,
  DagboekPage,
  DagboekDetailPage,
  EncyclopediePage,
  EncyclopedieDetailPage,
  ConcertenPage,
  OverPage,
  ContactPage,
} from './routes/public';
import {
  LoginPage,
  DashboardPage,
  LocatiesPage,
  LocatieDetailPage,
  ContactenPage,
  ChecklistPage,
  AudioPage,
  InstellingenPage,
} from './routes/app';

import {
  getJournalEntryBySlug,
  getEncyclopediaBySlug,
} from './lib/data';

type Variables = { locale: Locale };
const app = new Hono<{ Variables: Variables }>();

app.use('*', logger());

/* ------------------------------ Static files ----------------------------- */
app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }));
app.use('/manifest.json', serveStatic({ path: './static/manifest.json' }));

/* ------------------------------ Helpers ---------------------------------- */

function notFound(c: any, locale: Locale = 'nl') {
  return c.html(
    `<!DOCTYPE html><html lang="${locale}"><head><meta charset="UTF-8"><title>404</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>body{font-family:'Playfair Display',serif;background:#FAF7F0;color:#2C5F4D;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}h1{font-size:4rem;margin:0}a{color:#B8860B}</style>
    </head><body><div><h1>404</h1><p>${locale === 'nl' ? 'Pagina niet gevonden' : 'Page not found'}</p><p><a href="/">${locale === 'nl' ? '← Terug naar home' : '← Back home'}</a></p></div></body></html>`,
    404
  );
}

/* --------------------------- Public NL routes ---------------------------- */
// NL is default — no prefix.

app.get('/', (c) => c.html(<HomePage locale="nl" />));
app.get('/reis', (c) => c.html(<ReisPage locale="nl" />));
app.get('/dagboek', (c) => c.html(<DagboekPage locale="nl" />));
app.get('/dagboek/:slug', (c) => {
  const slug = c.req.param('slug');
  if (!getJournalEntryBySlug(slug)) return notFound(c, 'nl');
  return c.html(<DagboekDetailPage locale="nl" slug={slug} />);
});
app.get('/encyclopedie', (c) => c.html(<EncyclopediePage locale="nl" />));
app.get('/encyclopedie/:slug', (c) => {
  const slug = c.req.param('slug');
  if (!getEncyclopediaBySlug(slug)) return notFound(c, 'nl');
  return c.html(<EncyclopedieDetailPage locale="nl" slug={slug} />);
});
app.get('/concerten', (c) => c.html(<ConcertenPage locale="nl" />));
app.get('/over', (c) => c.html(<OverPage locale="nl" />));
app.get('/contact', (c) => c.html(<ContactPage locale="nl" />));
app.post('/contact', async (c) => {
  await c.req.parseBody().catch(() => null);
  return c.html(<ContactPage locale="nl" sent />);
});

/* --------------------------- Public EN routes ---------------------------- */

const en = new Hono<{ Variables: Variables }>();
en.use('*', async (c, next) => {
  c.set('locale', 'en');
  await next();
});

en.get('/', (c) => c.html(<HomePage locale="en" />));
en.get('/reis', (c) => c.html(<ReisPage locale="en" />));
en.get('/dagboek', (c) => c.html(<DagboekPage locale="en" />));
en.get('/dagboek/:slug', (c) => {
  const slug = c.req.param('slug');
  if (!getJournalEntryBySlug(slug)) return notFound(c, 'en');
  return c.html(<DagboekDetailPage locale="en" slug={slug} />);
});
en.get('/encyclopedie', (c) => c.html(<EncyclopediePage locale="en" />));
en.get('/encyclopedie/:slug', (c) => {
  const slug = c.req.param('slug');
  if (!getEncyclopediaBySlug(slug)) return notFound(c, 'en');
  return c.html(<EncyclopedieDetailPage locale="en" slug={slug} />);
});
en.get('/concerten', (c) => c.html(<ConcertenPage locale="en" />));
en.get('/over', (c) => c.html(<OverPage locale="en" />));
en.get('/contact', (c) => c.html(<ContactPage locale="en" />));
en.post('/contact', async (c) => {
  await c.req.parseBody().catch(() => null);
  return c.html(<ContactPage locale="en" sent />);
});

app.route('/en', en);

/* ------------------------------ Mock auth -------------------------------- */
// Cookie-based: set on POST /api/auth/login, cleared on POST /api/auth/logout.
// In production this is replaced by Supabase magic-link auth.

const SESSION_COOKIE = 'mr_session';

function isAuthed(c: any): boolean {
  return Boolean(getCookie(c, SESSION_COOKIE));
}

app.post('/api/auth/login', async (c) => {
  const body = await c.req.parseBody().catch(() => ({} as any));
  const email = String(body.email ?? '').trim();
  if (!email || !email.includes('@')) {
    return c.json({ ok: false, error: 'Invalid email' }, 400);
  }
  setCookie(c, SESSION_COOKIE, encodeURIComponent(email), {
    path: '/',
    httpOnly: false, // client JS reads it for "logged in as" UI
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  return c.redirect('/app/dashboard');
});

app.post('/api/auth/logout', (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
  return c.redirect('/app/login');
});

/* ------------------------------- /app/* ---------------------------------- */
// Auth gate for everything except /app/login.

app.use('/app/*', async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path === '/app/login' || path.startsWith('/api/')) return next();
  if (!isAuthed(c)) return c.redirect('/app/login');
  await next();
});

app.get('/app', (c) => c.redirect(isAuthed(c) ? '/app/dashboard' : '/app/login'));
app.get('/app/login', (c) =>
  isAuthed(c) ? c.redirect('/app/dashboard') : c.html(<LoginPage />)
);
app.get('/app/dashboard', (c) => c.html(<DashboardPage />));
app.get('/app/locaties', (c) => c.html(<LocatiesPage />));
app.get('/app/locaties/:id', (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (!id) return notFound(c);
  return c.html(<LocatieDetailPage id={id} />);
});
app.get('/app/contacten', (c) => c.html(<ContactenPage />));
app.get('/app/checklist', (c) => c.html(<ChecklistPage />));
app.get('/app/audio', (c) => c.html(<AudioPage />));
app.get('/app/instellingen', (c) => c.html(<InstellingenPage />));

/* ----------------------------- API stubs --------------------------------- */

app.post('/api/newsletter', async (c) => {
  const body = await c.req.parseBody().catch(() => ({} as any));
  const email = String(body.email ?? '');
  if (!email.includes('@')) return c.json({ ok: false }, 400);
  // TODO: persist to KV / Supabase
  return c.redirect('/?newsletter=ok');
});

app.post('/api/signup', async (c) => {
  await c.req.parseBody().catch(() => null);
  // TODO: persist signups
  return c.redirect('/reis?signup=ok');
});

app.get('/app/api/export', (c) => {
  if (!isAuthed(c)) return c.redirect('/app/login');
  const data = {
    exportedAt: new Date().toISOString(),
    note: 'Mock export — Supabase integration pending.',
  };
  return c.json(data, 200, {
    'Content-Disposition': 'attachment; filename="mahler-reise-export.json"',
  });
});

/* ------------------------------ 404 fallback ----------------------------- */

app.notFound((c) => {
  const path = new URL(c.req.url).pathname;
  const locale: Locale = path.startsWith('/en') ? 'en' : 'nl';
  return notFound(c, locale);
});

export default app;
