# Mahler Reise

> In de voetsporen van Gustav Mahler — een culturele reis door zestien locaties uit het leven van de componist.

A production-ready Next.js 14 web platform for the Mahler Reise project — a guided cultural travel concept following the life of Gustav Mahler. Owners: **Dominique Dejonghe** and violinist **Tom Devaere**. Live deadline: **1 August 2026**.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + custom shadcn-style component library
- **next-intl** for Dutch (default at `/`) and English (at `/en/*`) with locale routing
- **Mapbox GL JS** for interactive maps (graceful placeholder when no token)
- **next-pwa** for offline support + manifest
- **React Hook Form** + **Zod** for form validation
- **Lucide React** icon library
- **date-fns** for date formatting

## Design system

- **Primary**: dark green `#2C5F4D`
- **Accent**: gold `#B8860B`
- **Body font**: Crimson Text (serif), via `next/font/google`
- **Heading font**: Playfair Display, via `next/font/google`
- Generous whitespace, elegant cultural-travel aesthetic
- Mobile-first, fully responsive
- Subtle fade-in animations on scroll (Intersection Observer)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Mapbox token from https://account.mapbox.com/access-tokens
# (without it, the maps render an elegant placeholder fallback)

# 3. Run the dev server
npm run dev
# → http://localhost:3000  (Dutch homepage)
# → http://localhost:3000/en  (English homepage)
# → http://localhost:3000/app/login  (private team app)
```

For production builds:

```bash
npm run build
npm start
```

---

## Project structure

```
src/
├── app/
│   ├── [locale]/           # Public, internationalised routes
│   │   ├── page.tsx        # Homepage
│   │   ├── reis/           # Commercial bus tour
│   │   ├── dagboek/        # Public travel journal
│   │   ├── encyclopedie/   # Mahler encyclopedia (16 locations)
│   │   ├── concerten/      # Concert agenda
│   │   ├── over/           # About the founders
│   │   └── contact/        # Contact form
│   ├── app/                # Private team app (NOT internationalised)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── locaties/       # 11 prospection stops
│   │   ├── contacten/      # Contacts CRM
│   │   ├── checklist/      # Shared checklist
│   │   ├── audio/          # Audio recordings + transcription
│   │   └── instellingen/   # Settings
│   ├── globals.css
│   └── layout.tsx          # Root layout with fonts
├── components/
│   ├── ui/                 # shadcn-style primitives (button, card, tabs, etc.)
│   ├── layout/             # Header, Footer, LocaleSwitcher, Map, FadeIn
│   ├── home/               # Homepage-specific
│   └── app/                # Private app shell
├── lib/
│   ├── data.ts             # ⭐ Centralised data layer — swap to Supabase here
│   ├── data/               # Mock data sources (stops, encyclopedia, journal, …)
│   ├── auth.ts             # Mock auth (localStorage); becomes Supabase Auth
│   └── utils.ts            # cn(), date helpers
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── messages/
│   ├── nl.json             # Dutch translations
│   └── en.json             # English translations
├── types/
│   └── index.ts            # All TS types — 1:1 mapping to future Supabase tables
└── middleware.ts           # next-intl + private app exemption
```

---

## Routes

### Public (NL default at `/`, EN at `/en/*`)

| Path | Description |
| --- | --- |
| `/` | Homepage — hero, four feature columns, Mahler quote, newsletter |
| `/reis` | Commercial tour 2027: route map, 10-day program, three pricing tiers (€2.995 / €3.295 / €3.950), departure dates (May + Aug 2027), signup form, FAQ |
| `/dagboek` | Public travel journal: Mapbox map + filterable feed of entries |
| `/dagboek/[slug]` | Single journal entry detail |
| `/encyclopedie` | Hub: timeline 1860–1911 + world map + category tabs |
| `/encyclopedie/[locatie]` | Per-location detail — chronology, works, manuscripts, bibliography, prev/next nav |
| `/concerten` | Concert agenda 2026 — Toblach, Bolzano, Jihlava |
| `/over` | About the founders Tom Devaere + Dominique Dejonghe |
| `/contact` | Contact form |

### Private (under `/app/*`)

| Path | Description |
| --- | --- |
| `/app/login` | Magic-link login UI (mock auth — any email works) |
| `/app/dashboard` | KPI cards, progress, recent activity, next-stop countdown, quick actions |
| `/app/locaties` | List of 11 prospection stops |
| `/app/locaties/[id]` | Detail with tabs: Info / Entries / Checklist / Contacts + entry-creation modal |
| `/app/contacten` | Contacts table with inline status dropdown + notes |
| `/app/checklist` | Shared checklist grouped by category, progress bar |
| `/app/audio` | Audio recordings with HTML5 player + transcription field |
| `/app/instellingen` | Profile, notifications toggle, offline mode, JSON export, logout |

---

## Data flow & Supabase migration path

All data access is centralised in **`src/lib/data.ts`**. Every function is `async` and returns the same TypeScript types defined in `src/types/index.ts`. To migrate to Supabase in prompt 2, replace each function body with a Supabase query — no UI changes required.

**Persistence today (mock):**
- Form submissions → `localStorage` (`mahler.signups`, `mahler.contact`, `mahler.newsletter`)
- Private journal entries → `localStorage` (`mahler.entries`)
- Checklist toggles → `localStorage` (`mahler.checklistOverrides`)
- Contact status/notes → `localStorage` (`mahler.contactOverrides`)
- Audio transcriptions → `localStorage` (`mahler.transcripts`)
- User preferences → `localStorage` (`mahler.prefs`)
- Session → `localStorage` (`mahler.session`)

**Migration map (prompt 2 — Supabase tables):**

| Today | Will become |
| --- | --- |
| `PROSPECTION_STOPS` (constant) | `stops` table |
| `ENCYCLOPEDIA` (constant) | `encyclopedia_locations` + `works` + `manuscripts` + `bibliography` |
| `JOURNAL_ENTRIES` (constant) | `journal_entries` table (RLS: public read) |
| `CONCERTS_2026` (constant) | `concerts` table |
| `CONTACTS` (constant) | `contacts` table (RLS: team only) |
| `CHECKLIST_ITEMS` (constant) | `checklist_items` table |
| `AUDIO_RECORDINGS` (constant) | `audio_recordings` (metadata) + Supabase Storage (files) |
| `MockSession` (localStorage) | `auth.users` via Supabase Auth magic links |

---

## 11 prospection stops · 21–30 August 2026

| # | Stop | Country | Date | Mahler period |
| - | --- | --- | --- | --- |
| 1 | Kassel | DE | Vr 21/8 | 1883–1885 (2nd Kapellmeister) |
| 2 | Leipzig | DE | Za 22/8 | 1886–1888 (Symphony 1) |
| 3 | Praag | CZ | Zo+Ma 23–24/8 | 1885–1886 (Estates Theatre) |
| 4 | Kaliště | CZ | Di 25/8 | 1860 (birthplace) |
| 5 | Jihlava | CZ | Di 25/8 | 1860–1875 (childhood) |
| 6 | Steinbach am Attersee | AT | Di+Wo 25–26/8 | 1893–1896 (1st composing hut) |
| 7 | Bad Hall | AT | Wo 26/8 | 1880 (first post) |
| 8 | Wenen | AT | Wo+Do 26–27/8 | Hofoper, grave, deathplace |
| 9 | Budapest | HU | Do+Vr 27–28/8 | 1888–1891 (Royal Opera) |
| 10 | Maiernigg | AT | Vr+Za 28–29/8 | 1900–1907 (2nd hut) |
| 11 | Toblach | IT | Za+Zo 29–30/8 | 1908–1910 (3rd hut) |

## 16 encyclopedia locations

The 11 stops above + 5 additional:
- **Wenen Konservatorium** (1875–1881)
- **Ljubljana** (1881–1882)
- **Olomouc** (1883)
- **Hamburg** (1891–1897 — VERY IMPORTANT formative period)
- **New York** (1907–1911)
- **Parijs** (1911 — death journey)

**Full content** (chronology, works, manuscripts, bibliography): Kaliště · Wenen Hofoper 1897–1907 · Steinbach am Attersee · Maiernigg · Toblach. The other 11 are stubs marked "Wordt uitgebreid".

---

## What's NOT in this prompt (intentionally)

The following are explicitly deferred to **prompt 2** (Supabase backend) and **prompt 3**:
- Supabase project, schema, RLS policies, migrations
- Real authentication (magic links)
- File uploads to Supabase Storage
- Live audio recording (MediaRecorder API)
- Realtime sync between team members
- Email sending (SendGrid / Resend)

Today's mock layer demonstrates the full UX flow. The structure (centralised `data.ts`, typed in `/types`) cleanly supports plugging Supabase in without touching UI code.

---

## Deployment

This project is configured for **Vercel**. Push to GitHub and import the repo in Vercel — it will auto-detect Next.js and deploy.

Required environment variables in Vercel:
- `NEXT_PUBLIC_MAPBOX_TOKEN` (optional — falls back to placeholder)
- `NEXT_PUBLIC_SITE_URL`

To deploy from CLI:
```bash
npm i -g vercel
vercel
```

---

## Naming convention

**Always "Tom Devaere" — never "Tom de Varen".** This is a hard rule throughout the codebase, content, and translations.

## License & ownership

© 2026 Mahler Reise — Dominique Dejonghe (`dominique.dejonghe@iutum.be`) and Tom Devaere. All rights reserved.
