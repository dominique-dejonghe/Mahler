# Gustaaf

Mobile-first atlas of Gustav Mahler: time + map, houses, first-decade reception, and a retrieval chatbot. Dutch (Flemish) by default. No API key.

Built for Dominique Dejonghe (Flanders), on the 2026 Mahler road trip. Late-Romantic concert hall at night — warm dark, paper, gold. Not a brochure. Not Wikipedia.

The previous **Mahler Reise** Hono site from `main` is preserved in [`legacy-reise/`](legacy-reise/).

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

```bash
npm test      # retrieval + data-integrity tests
npm run build
```

No environment variables. Chat transcript, chat open/closed, and locale persist in `localStorage`.

Avatar: `public/images/mahler-naehr-1907.jpg` — Gustav Mahler, Vienna 1907, photograph by Moritz Nähr. [Wikimedia Commons, File:Photo of Gustav Mahler by Moritz Nähr 02.jpg](https://commons.wikimedia.org/wiki/File:Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_02.jpg). Public domain (Nähr d. 1945; published 1908).

## What it does

1. **Atlas** — Leaflet map (Europe + New York) and a year slider 1860–1921. Drag the year; Mahler moves to the best documented pin. Click a city or date. Types: childhood, conducting posts, guest nights, summer huts, death, grave, premieres, performances.
2. **Gustaaf** — retrieval chat. Closable right-hand panel; a pulsing 1907 Moritz Nähr photograph of Mahler (Wikimedia Commons, public domain) reopens it. Structured JSON first. If the day has no exact pin, it says so and offers the nearest documented residence or post. It does not invent streets.
3. **Huizen** — opera houses and orchestras (Bad Hall → New York), Kapellmeister vs director vs guest, years, source.
4. **Symfonieën** — nights Mahler himself conducted 1–8, plus premieres of 9, Das Lied, and the unfinished 10th (Schalk 1924 + Cooke 1964, marked posthumous). A finite 1911–1921 set (Walter, Mengelberg, Stokowski) sits under that. Every row has `source`.
5. **Brieven** — `/brieven`. A gids, not an edition: correspondents, key letters *from* Mahler, and bibliographic sources. Drop-in JSON in `src/data/brieven/` (`DATA.md`). Empty until Stafke fills it. No full texts; quotes render only when `quoteDE` / `quoteNL` are non-empty. Scholarly index: [Mahler-Online](https://www.mahler-online.at/letters_table.html).

Toggles: opera-winter / composing-summer; **Mahler zelf op de bok** (map + timeline); optional **Jij staat hier** (Tongeren → … → Sint-Amands, 22 Aug–7 Sep 2026, no hotels); **Dieper** for Alma / family / conversion.

Self-conducted layer (Mahler Foundation / Martner–Banks mahlercat): **71 complete** public performances of 1–8 by him; **4 fragments**, marked separately and not counted. Belgium: exactly two complete nights (Liège 1899 Second, Antwerp 1906 Fifth). No Brussels. 9 / Das Lied / 10: never by him.

## Data schema

Events live in TypeScript modules under `src/data/` and are queried as one list.

```ts
type AtlasEvent = {
  id: string
  dateStart: string          // ISO date
  dateEnd?: string           // inclusive range
  datePrecision: 'day' | 'month' | 'year' | 'range' | 'season'
  placeId: string
  type: 'childhood' | 'conducting_post' | 'guest_night' | 'summer_hut'
       | 'death' | 'grave' | 'premiere' | 'performance' | 'residence' | 'life'
  title / summary / extra: { nl, en, de, cs }
  source: { label: string; url?: string; citation?: string }
  role?: 'kapellmeister' | 'director' | 'guest' | 'composer' | 'student'
  workId?: '1'…'10' | 'lied'
  season?: 'winter' | 'summer'
  deep?: boolean             // hidden unless Dieper is on
  conductor?: string
  orchestra?: Localized
  posthumous?: boolean
  firstDecade?: boolean      // 18 May 1911 – 18 May 1921
  selfConducted?: boolean    // he conducts his own 1–8
  completeness?: 'complete' | 'fragment'
  hall?: Localized           // only when the source list names a hall
}
```

Places have `lat`/`lng` and `pinPrecision`: `venue` | `city` | `residence` | `unknown`. City pins are used when a street is not documented.

`residences` cover “where was he on date X” when no concert exists. `inferredFromPost: true` means the pin is the house/post, not a lodging.

## Chatbot

Hypothesis (kept): one events list queried by date range is more trustworthy than an LLM. Gustaaf never calls a model.

It can answer: where on a date; which house/orchestra; when a symphony was first played and by whom; how often he himself conducted a work; Belgium and New York from the self-conducted set; what is documented in a city. Short answer, one extra fact, Dutch first. Guide *about* Mahler, not a first-person impersonation. It does not invent halls or extra nights.

## Sources (seed)

- [Mahler Foundation](https://mahlerfoundation.org/) concert and composition histories (premieres 1–9, Das Lied, 10th; Prague Výstaviště; Amsterdam 1920 festival day-by-day)
- [mahler.cz](https://www.mahler.cz/en/about-gustav-mahler/conductor-and-opera-director) conducting posts
- [Mahleria chronology](https://onmahler.wordpress.com/biography/chronology-of-the-life-of-gustav-mahler/) for Prague 1885–86 and Leipzig dates
- [Czech Philharmonic — Hotel Modrá hvězda](https://www.ceskafilharmonie.cz/en/3-hotel-modra-hvezda/)
- [gustav-mahler.eu](https://gustav-mahler.eu/index.php/perioden/) period index

## Known gaps

- Self-conducted 1–8: 71 complete + 4 fragments in `src/data/mahlerConducted.ts`. That list is finite and cited (Mahler Foundation / Martner–Banks mahlercat), not a padded Martner.
- Not a complete Knud Martner chronology for opera nights and other people’s performances. Guest nights outside this layer remain a sample.
- Many winter days resolve to a **post**, not a street. That is stated in the UI.
- Between posts (e.g. spring–summer 1882) there is no honest residence; Gustaaf offers the nearest window.
- Exact summer arrival days at Steinbach / Maiernigg / Toblach are often undocumented; those are seasonal windows.
- The 1908 Zasche pavilion and Hotel Modrá hvězda no longer stand; pins are the documented sites.
- New York lodging is unknown here; pins are the old Met and Carnegie Hall.
- Symphony 10 first complete hearings fall **after** 1921 (1924 Schalk; 1964 Cooke). They are included and marked posthumous.
- Audio is omitted: no legally clean public-domain performance is bundled.
- The 2026 overlay is an ordered city list with start/end dates only. No hotels.

## Stack

Vite 5 + React 18 + TypeScript + Leaflet / react-leaflet + Vitest.
