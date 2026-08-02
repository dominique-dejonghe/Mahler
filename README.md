# Mahler Reise

> Een culturele reis in de voetsporen van Gustav Mahler — zestien locaties, drie landen, één componist.

## Project Overview
- **Naam**: Mahler Reise
- **Eigenaars**: Dominique Dejonghe (dominique.dejonghe@iutum.be) & Tom Devaere (tom@mahler-reise.be)
- **Lanceringsdeadline**: 1 augustus 2026
- **Doel**: Publiekssite + privé prospectie-app voor een 10-daagse Mahler-tour (2027) met bijhorend reisdagboek (prospectiereis **22 augustus – 7 september 2026**, 17 dagen, MG electric via Tesla V3 Superchargers), encyclopedie (16 locaties, 1860–1911), en concertagenda 2026.

## Tech Stack
- **Framework**: Hono 4 op Cloudflare Workers / Pages
- **Build**: Vite 5 + `@hono/vite-cloudflare-pages`
- **JSX**: server-side `hono/jsx` (geen React-runtime in productie)
- **Styling**: Tailwind CSS via CDN (brand-config inline) + custom `styles.css`
- **Icons**: Font Awesome 6 (CDN)
- **Fonts**: Crimson Text (serif) + Playfair Display (display) via Google Fonts
- **i18n**: lichte custom helper (NL default, `/en/*` prefix), 0 dependencies
- **Auth (mock)**: Hono cookies + localStorage — Supabase magic-link in productie
- **Dev/runtime**: Wrangler Pages dev server (PM2-managed)

## URLs
- **Productie**: https://mahler-reise.pages.dev
- **Laatste deploy**: https://16d848d3.mahler-reise.pages.dev
- **GitHub**: https://github.com/dominique-dejonghe/Mahler

## Routes — publiek (Nederlands, default)
| Route | Inhoud |
|---|---|
| `/` | Homepage met hero (lokale Mahler-portretfoto), 4 feature-kaarten, citaat, nieuwsbrief |
| `/reis` | Bus-tour 2027 — vertrekdata, dagprogramma, inclusief, 3 prijspakketten (Standaard €2 995 / Comfort €3 295 / Premium €3 950), voorinschrijfformulier, FAQ |
| `/routeplan` | **Prospectiereis 2026** — interactieve Leaflet-kaart (OpenStreetMap), 17 dag-etappes Sint-Amands → Kassel → Toblach → Venetië → Neuschwanstein → Nismes, km/dag, 4 Tesla V3 Superchargers, hard deadline Nismes 14:00 op 7 sep |
| `/dagboek` | Reisdagboek-overzicht (prospectiereis aug 2026) met cover-images van Unsplash |
| `/dagboek/:slug` | Dagboek-detail met cover, datum-/locatie-badges en lange tekst |
| `/encyclopedie` | 16 locaties + horizontale tijdlijn 1860–1911 |
| `/encyclopedie/:slug` | Locatie-detail met typografische hero, chronologie, werken, manuscripten, bibliografie, prev/next-navigatie |
| `/concerten` | Agenda 2026 (Toblach, Bolzano, Jihlava — met Tom Devaere) |
| `/over` | Bios Tom & Dominique, visie, supporters |
| `/contact` | Formulier (POST `/contact`) + directe e-mail-adressen |

## Routes — Engels
Iedere publieke route is ook bereikbaar onder `/en/...` (bv. `/en/reis`, `/en/encyclopedie/kaliste`). De NL-default heeft géén prefix (mirroring van next-intl `localePrefix: 'as-needed'`).

## Routes — privé `/app/*`
Auth-gate: alle `/app/*` paden behalve `/app/login` redirecten naar `/app/login` zonder cookie `mr_session`.

| Route | Inhoud |
|---|---|
| `/app/login` | Mock magic-link form (elk geldig e-mail werkt) |
| `/app/dashboard` | KPIs, voortgang, volgende halte, recente activiteit, snelle acties |
| `/app/locaties` | 11 prospectie-haltes (21–30 aug 2026) als kaarten |
| `/app/locaties/:id` | Halte-detail |
| `/app/contacten` | Tabel met archivarissen, theaters, musea + status |
| `/app/checklist` | Checklist per categorie (admin / travel / archive / media / logistics) met progress bars |
| `/app/audio` | Audio-opnames (interviews, ambient, lezingen) — placeholders |
| `/app/instellingen` | Profiel, notificaties, offline cache, JSON-export, uitlogknop |

## API endpoints
| Methode | Pad | Functie |
|---|---|---|
| `POST` | `/api/auth/login` | Zet `mr_session` cookie + redirect naar dashboard |
| `POST` | `/api/auth/logout` | Wist cookie + redirect naar login |
| `POST` | `/api/newsletter` | Mock newsletter-signup |
| `POST` | `/api/signup` | Mock tour-voorinschrijving |
| `POST` | `/contact` (& `/en/contact`) | Mock contact-formulier (server-side) |
| `GET`  | `/app/api/export` | JSON-export (auth required) |

## Data Architecture
- **Locatie**: `src/data/*.ts` — 6 in-memory bestanden, edge-runtime safe
- **Modellen** (`src/types/index.ts`): `ProspectionStop`, `EncyclopediaLocation`, `JournalEntry`, `Concert`, `PricingTier`, `DayProgram`, `ChecklistItem`, `Contact`, `AudioRecording`, `PrivateJournalEntry`, `DashboardStats`, `ActivityEvent`
- **Toegangslaag**: `src/lib/data.ts` exposeert pure getters (`getStops`, `getEncyclopediaBySlug`, `getDashboardStats`, …) — 1:1 vervangbaar door Supabase REST calls in prompt 2
- **i18n-strings**: `src/lib/i18n.ts` (NL + EN als typed constants)

### Inhoud volume (mock)
- 11 prospectie-haltes (21–30 aug 2026)
- 16 encyclopedie-locaties (5 met volledige inhoud, 11 stubs met "Wordt uitgebreid")
- 5 dagboek-entries
- 4 concerten 2026
- 10 dag-programma's (tour 2027)
- 3 prijspakketten + 5 FAQ's
- ~30 contacten, ~20 checklist-items, ~6 audio-opnames

## Project Structure
```
webapp/
├── src/
│   ├── index.tsx                # Hono entry: routes, locale, mock-auth, static
│   ├── components/
│   │   ├── layout.tsx           # Layout (publiek) + AppLayout (privé) + Header + Footer
│   │   └── ui.tsx               # Badge, Button, Card, Section, ProgressBar, TypographicHero
│   ├── routes/
│   │   ├── home.tsx             # Homepage
│   │   ├── public.tsx           # /reis /dagboek /encyclopedie /concerten /over /contact
│   │   └── app.tsx              # /app/* (login, dashboard, …)
│   ├── lib/
│   │   ├── data.ts              # Data-access layer (pure functions)
│   │   └── i18n.ts              # NL + EN messages, localePath()
│   ├── data/                    # In-memory data: stops, encyclopedia, journal, concerts, tour, private
│   └── types/index.ts
├── public/
│   ├── static/                  # Served at /static/*
│   │   ├── styles.css
│   │   ├── app.js               # Mobile menu + toasts
│   │   ├── auth.js              # Login/logout helpers
│   │   ├── images/mahler-portrait.jpg
│   │   ├── icons/
│   │   ├── manifest.json
│   │   └── favicon{,-32}.{ico,png}
│   ├── images/  icons/  manifest.json  favicon.{ico,png}    # legacy locations
├── ecosystem.config.cjs         # PM2 config (wrangler pages dev)
├── vite.config.ts               # Vite + Hono Cloudflare Pages plugin
├── wrangler.jsonc               # Cloudflare Pages config
├── tsconfig.json
└── package.json
```

## User Guide

### Publieke site
1. Open de homepage — Mahler-portret, hero-CTA, vier feature-tegels.
2. Klik op **De Reis** voor het programma + voorinschrijven, **Encyclopedie** voor de tijdlijn, **Reisdagboek** voor de blog.
3. Taalwisselaar (NL ⇄ EN) staat rechtsboven; route-pad blijft behouden.
4. Op mobiel: hamburgermenu rechtsboven.

### Privé app (prospectie-team)
1. Ga naar `/app/login`.
2. Geef elk geldig e-mailadres in (demo accepteert alles) → magic link wordt "verstuurd" → automatische redirect naar dashboard.
3. Bekijk KPI's, locatieslijst, contacten, checklist, audio-opnames, instellingen.
4. Uitloggen via de zijbalk-link of via Instellingen → Uitloggen.

## Development

```bash
# Installeer
cd /home/user/webapp && npm install

# Build
npm run build       # Vite bouwt dist/_worker.js (~170 KB) in <1s

# Lokaal draaien (PM2)
pm2 start ecosystem.config.cjs
curl http://localhost:3000

# Logs
pm2 logs mahler-reise --nostream
```

## Deployment

- **Platform**: Cloudflare Pages (via Wrangler)
- **Status**: lokaal volledig werkend, productie-deploy pending
- **Stappen**: `setup_cloudflare_api_key` → `npx wrangler pages project create mahler-reise --production-branch main` → `npm run build && npx wrangler pages deploy dist --project-name mahler-reise`
- **Voordelen t.o.v. Next.js**: build van 5+ min OOM-kill → 1 sec, response-tijden < 10 ms, één Worker-bundle van 170 KB ipv 60+ pre-rendered pages

## Wat is verloren gegaan in de Hono-rewrite?
- `next-intl` middleware → vervangen door simpele `/en/*` Hono-subapp
- `next/font` Google Fonts → nu `<link>` naar fonts.googleapis.com
- `next/image` optimalisatie → vervangen door direct `<img>` (Mahler-portret is al lokaal en geoptimaliseerd, dagboek-images van Unsplash met `?w=1200`)
- `next-pwa` workbox → manifest is er, service worker komt in een latere stap (manueel via `workbox-cli`)
- Server Components → in Hono is alle JSX gewoon edge-side gerenderd, dus dit verschil is conceptueel maar niet functioneel
- `react-hook-form` + `zod` → formulieren posten nu naar de Hono-server; client-side validatie volgt later via een lichtere helper

## Wat is gewonnen?
- **Build**: 1 sec ipv timeouts/OOM-kills
- **Bundle**: 171 KB ipv ~600 KB shared chunks
- **Response**: 4–15 ms per route (lokaal)
- **Deploy**: 1-klik op Cloudflare Pages — geen Vercel-dependency
- **D1/KV/R2** klaar voor gebruik in productie (Supabase blijft optie)

## Volgende stappen
1. **Mapbox**: kaart-component voor `/dagboek` en `/encyclopedie` (Mapbox GL JS via CDN, lazy-loaded client-side)
2. **Service worker** voor `/app/*` (offline-first, IndexedDB cache)
3. **Real auth**: Supabase magic-link integratie i.p.v. cookie-based mock
4. **Cloudflare D1**: schema voor stops, encyclopedie, dagboek, contacten + migratie van mock-data
5. **Lighthouse > 90** + a11y-pass (focus rings, ARIA-labels, skip-link)
6. **Productie-deploy** op Cloudflare Pages (`mahler-reise.pages.dev`)
7. **Custom domein** koppelen na lancering (1 aug 2026)

---

© 2026 Mahler Reise · Tom Devaere & Dominique Dejonghe
