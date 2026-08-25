import type { EventType, Locale } from '../types';

export const locales: Locale[] = ['nl', 'en', 'de', 'cs'];

export const localeLabel: Record<Locale, string> = {
  nl: 'NL',
  en: 'EN',
  de: 'DE',
  cs: 'CS',
};

export const ui = {
  brand: { nl: 'Gustaaf', en: 'Gustaaf', de: 'Gustaaf', cs: 'Gustaaf' },
  tag: {
    nl: 'Atlas van Mahler. Geen brochure.',
    en: 'Mahler atlas. Not a brochure.',
    de: 'Mahler-Atlas. Keine Broschüre.',
    cs: 'Mahlerův atlas. Žádná brožura.',
  },
  views: {
    atlas: { nl: 'Atlas', en: 'Atlas', de: 'Atlas', cs: 'Atlas' },
    houses: { nl: 'Huizen', en: 'Houses', de: 'Häuser', cs: 'Domy' },
    symphonies: { nl: 'Symfonieën', en: 'Symphonies', de: 'Sinfonien', cs: 'Symfonie' },
  },
  winter: { nl: 'Opera-winter', en: 'Opera winter', de: 'Opernwinter', cs: 'Operní zima' },
  summer: { nl: 'Componeerzomer', en: 'Composing summer', de: 'Komponiersommer', cs: 'Skladebné léto' },
  bothSeasons: { nl: 'Beide seizoenen', en: 'Both seasons', de: 'Beide Zeiten', cs: 'Obě období' },
  here: { nl: 'Jij staat hier', en: 'You are here', de: 'Du bist hier', cs: 'Jsi tady' },
  deeper: { nl: 'Dieper', en: 'Deeper', de: 'Tiefer', cs: 'Hlouběji' },
  chatTitle: { nl: 'Gustaaf', en: 'Gustaaf', de: 'Gustaaf', cs: 'Gustaaf' },
  chatHint: {
    nl: 'Vraag een datum, een stad, een huis of een symfonie. Ik haal rijen op. Ik verzin niets.',
    en: 'Ask a date, a city, a house or a symphony. I retrieve rows. I invent nothing.',
    de: 'Fragen Sie nach Datum, Stadt, Haus oder Sinfonie. Ich hole Zeilen. Ich erfinde nichts.',
    cs: 'Zeptejte se na datum, město, dům nebo symfonii. Beru řádky. Nic si nevymýšlím.',
  },
  chatPlaceholder: {
    nl: 'Waar was Mahler op 19 september 1908?',
    en: 'Where was Mahler on 19 September 1908?',
    de: 'Wo war Mahler am 19. September 1908?',
    cs: 'Kde byl Mahler 19. září 1908?',
  },
  send: { nl: 'Vraag', en: 'Ask', de: 'Fragen', cs: 'Zeptat se' },
  inferred: {
    nl: 'Geen exacte pin. Best gedocumenteerde post of woonplaats.',
    en: 'No exact pin. Best documented post or residence.',
    de: 'Kein genauer Pin. Best dokumentierte Stelle oder Wohnung.',
    cs: 'Žádný přesný pin. Nejlépe doložené místo nebo bydliště.',
  },
  source: { nl: 'Bron', en: 'Source', de: 'Quelle', cs: 'Zdroj' },
  notMartner: {
    nl: 'Geen complete Martner. Eindige, geciteerde set.',
    en: 'Not a complete Martner. A finite, cited set.',
    de: 'Kein vollständiger Martner. Endliche, belegte Menge.',
    cs: 'Ne úplný Martner. Konečná, citovaná sada.',
  },
  firstDecade: {
    nl: 'Eerste decennium na de dood: 18 mei 1911 – 18 mei 1921.',
    en: 'First decade after death: 18 May 1911 – 18 May 1921.',
    de: 'Erstes Jahrzehnt nach dem Tod: 18. Mai 1911 – 18. Mai 1921.',
    cs: 'První desetiletí po smrti: 18. května 1911 – 18. května 1921.',
  },
  posthumous: { nl: 'Postuum', en: 'Posthumous', de: 'Postum', cs: 'Posmrtně' },
  kapellmeister: { nl: 'Kapellmeister', en: 'Kapellmeister', de: 'Kapellmeister', cs: 'Kapelník' },
  director: { nl: 'Directeur', en: 'Director', de: 'Direktor', cs: 'Ředitel' },
  guest: { nl: 'Gast', en: 'Guest', de: 'Gast', cs: 'Host' },
  composer: { nl: 'Componist', en: 'Composer', de: 'Komponist', cs: 'Skladatel' },
  tripNote: {
    nl: 'Rit 22 aug–7 sep 2026. Steden in volgorde. Geen hotels verzonnen.',
    en: 'Drive 22 Aug–7 Sep 2026. Cities in order. No hotels invented.',
    de: 'Fahrt 22. Aug.–7. Sep. 2026. Städte der Reihe nach. Keine Hotels erfunden.',
    cs: 'Cesta 22. srp.–7. zář. 2026. Města v pořadí. Žádné hotely nejsou vymyšlené.',
  },
  close: { nl: 'Sluit', en: 'Close', de: 'Schließen', cs: 'Zavřít' },
  year: { nl: 'Jaar', en: 'Year', de: 'Jahr', cs: 'Rok' },
  examples: {
    nl: ['19 september 1908', 'Zevende première', 'Hamburg', 'Hofoper'],
    en: ['19 September 1908', 'Seventh premiere', 'Hamburg', 'Hofoper'],
    de: ['19. September 1908', 'Siebte Premiere', 'Hamburg', 'Hofoper'],
    cs: ['19. září 1908', 'Premiéra Sedmé', 'Hamburk', 'Hofoper'],
  },
  types: {
    childhood: { nl: 'Kindertijd', en: 'Childhood', de: 'Kindheit', cs: 'Dětství' },
    conducting_post: { nl: 'Dirigentenpost', en: 'Conducting post', de: 'Dirigentenstelle', cs: 'Dirigentské místo' },
    guest_night: { nl: 'Gastavond', en: 'Guest night', de: 'Gastabend', cs: 'Hostující večer' },
    summer_hut: { nl: 'Zomerhut', en: 'Summer hut', de: 'Sommerhütte', cs: 'Letní chata' },
    death: { nl: 'Dood', en: 'Death', de: 'Tod', cs: 'Smrt' },
    grave: { nl: 'Graf', en: 'Grave', de: 'Grab', cs: 'Hrob' },
    premiere: { nl: 'Première', en: 'Premiere', de: 'Uraufführung', cs: 'Premiéra' },
    performance: { nl: 'Uitvoering', en: 'Performance', de: 'Aufführung', cs: 'Provedení' },
    residence: { nl: 'Verblijf', en: 'Residence', de: 'Aufenthalt', cs: 'Pobyt' },
    life: { nl: 'Leven', en: 'Life', de: 'Leben', cs: 'Život' },
  } satisfies Record<EventType, Record<Locale, string>>,
  welcome: {
    nl: 'Ik ben Gustaaf. Gids over Mahler, niet Mahler zelf. Kort antwoord, één extra feit, altijd een bron.',
    en: 'I am Gustaaf. A guide about Mahler, not Mahler himself. Short answer, one extra fact, always a source.',
    de: 'Ich bin Gustaaf. Führer über Mahler, nicht Mahler selbst. Kurze Antwort, ein Extrafakt, immer eine Quelle.',
    cs: 'Jsem Gustaaf. Průvodce o Mahlerovi, ne Mahler. Krátká odpověď, jeden extra fakt, vždy zdroj.',
  },
} as const;

export function t<K extends keyof typeof ui>(key: K, locale: Locale): (typeof ui)[K] extends Record<Locale, infer V> ? V : never {
  const node = ui[key] as Record<Locale, unknown>;
  return node[locale] as never;
}
