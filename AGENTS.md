# AGENTS.md

## Cursor Cloud specific instructions

Mahler Reise is a single Node/TypeScript app: a Hono 4 server (server-side `hono/jsx`) built with Vite 5 and targeting Cloudflare Pages/Workers. It serves a public bilingual site (NL default, `/en/*` mirror) plus a cookie-gated private app under `/app/*`. All content is in-memory mock data (`src/data/*.ts`) — there is **no database, no external service, and no secret/env var required** to run or test locally.

### Running

- Dev server: `npm run dev` (Vite + Hono middleware) serves on `http://localhost:5173`. This is the preferred dev command with hot reload.
- Production-like: `npm run build` (outputs `dist/_worker.js`) then `npm run preview` (== `wrangler pages dev dist --ip 0.0.0.0 --port 3000`). Preview needs a build first.
- `npm test` is only a smoke check (`curl http://localhost:3000`) and assumes the preview/PM2 server is already running on port 3000 — it is not a real test suite. There are no unit/integration tests or lint config in this repo.

### Gotchas

- `ecosystem.config.cjs` (PM2) hardcodes `cwd: '/home/user/webapp'`, which does not exist here. Prefer `npm run dev` (or `npm run build && npm run preview`) over PM2 in the cloud environment.
- The public site relies on CDNs (Tailwind, Font Awesome, Google Fonts, Leaflet/OSM tiles, Unsplash images). Without internet these degrade visually but the app still renders and functions.
- Auth is a mock: any valid email logs in. `POST /api/auth/login` sets an `mr_session` cookie and redirects to `/app/dashboard`; `/app/*` without the cookie redirects to `/app/login`.
