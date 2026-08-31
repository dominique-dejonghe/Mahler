# Brieven — data contract

Drop-in JSON. The UI reads these three files as-is. **Do not invent** extra letters, quotes, or correspondent bios. Stafke filled the first set: 25 correspondenten, 28 brieven from Mahler, 10 bronnen.

Live index (metadata, not full text): [mahler-online.at/letters_table.html](https://www.mahler-online.at/letters_table.html) · [letters_search.html](https://www.mahler-online.at/letters_search.html)

## Files

| File | Role |
| --- | --- |
| `correspondenten.json` | People Mahler wrote to. 25 rows in the first delivery. |
| `brieven.json` | Letters **from Mahler only** (not incoming). 28 sleutelbrieven. |
| `bronnen.json` | Bibliographic editions. `year` may be `null` (omit in the UI). No letter bodies. |
| `schema.json` | JSON Schema (`$defs.correspondent`, `$defs.brief`, `$defs.bron`). |

Ids are **stable kebab-case** (`alma-mahler`, `toblach-1908-bruno-walter`). Do not rename an id once it is live.

## Shape

```ts
// correspondenten.json
{ id, name, periodFrom, periodTo, whyNl, tags? }[]

// brieven.json — from Mahler only
{ id, date, place, correspondentId, summaryNl, whyNl, sourceId, quoteDE?, quoteNL?, mahlerOnlineUrl? }[]

// bronnen.json
{ id, labelNl, year?, noteNl }[]
```

- `date`: `YYYY` or `YYYY-MM` or `YYYY-MM-DD`. The UI sorts on this string.
- `periodFrom` / `periodTo`: year as integer (or string).
- `year` on a bron: integer, or `null` (do not print).
- `correspondentId` / `sourceId` must match an `id` in the other files.
- `quoteDE` / `quoteNL`: optional verified excerpt. **Omit or `null` = the UI shows no quote.** Never invent a quote.
- `mahlerOnlineUrl`: optional deep link to one Mahler-Online record.
- Copy in the JSON is **NL**. Later `*En` / `*De` / `*Fr` / `*Cs` fields may be added; the app falls back to NL. Do not fill those until you have real translations — not letter content invented in another language.

## Example (do not copy into the live files unless sourced)

```json
{
  "id": "alma-mahler",
  "name": "Alma Mahler",
  "periodFrom": "1901",
  "periodTo": "1911",
  "whyNl": "Waarom déze correspondentie telt — één of twee zinnen, uit een bron.",
  "tags": ["familie"]
}
```

```json
{
  "id": "1908-09-19-alma",
  "date": "1908-09-19",
  "place": "Praag",
  "correspondentId": "alma-mahler",
  "summaryNl": "Korte NL parafrase. Geen verzonnen citaat.",
  "whyNl": "Waarom deze brief in de gids hoort.",
  "sourceId": "blaukopf-1982",
  "quoteDE": null,
  "quoteNL": null,
  "mahlerOnlineUrl": null
}
```

## Rules

1. Gids, geen piraterij van Blaukopf / Beaumont / andere edities. No full-text dump.
2. Mahlers eigen tekst is in de EU publiek domein (overleden 1911). Moderne edities en apparaat zijn copyright.
3. `bronnen.json` stays bibliographic. Notes about reliability (Alma 1924 censored, etc.) are fine. No letter quotations there.
