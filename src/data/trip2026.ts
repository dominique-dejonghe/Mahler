import type { TripStop } from '../types';

/** Dominique’s 2026 road-trip cities. Dates only where given (window 22 Aug–7 Sep). No hotels. */
export const trip2026: TripStop[] = [
  {
    id: 'trip-tongeren',
    order: 1,
    placeId: 'tongeren',
    date: '2026-08-22',
    label: { nl: 'Tongeren', en: 'Tongeren', de: 'Tongern', cs: 'Tongeren' },
    note: {
      nl: 'Start van de rit, 22 augustus 2026. Stadspin. Geen hotel verzonnen.',
      en: 'Start of the drive, 22 August 2026. City pin. No hotel invented.',
      de: 'Start der Fahrt, 22. August 2026. Stadtpin. Kein Hotel erfunden.',
      cs: 'Začátek cesty, 22. srpna 2026. Pin města. Žádný hotel není vymyšlený.',
    },
  },
  {
    id: 'trip-kassel',
    order: 2,
    placeId: 'kassel',
    label: { nl: 'Kassel', en: 'Kassel', de: 'Kassel', cs: 'Kassel' },
    note: {
      nl: 'Mahler-post 1883–1885. Geen overnachtingsadres in deze laag.',
      en: 'Mahler post 1883–1885. No lodging address in this layer.',
      de: 'Mahler-Stelle 1883–1885. Keine Übernachtungsadresse in dieser Schicht.',
      cs: 'Mahlerovo místo 1883–1885. V této vrstvě není adresa noclehu.',
    },
  },
  {
    id: 'trip-leipzig',
    order: 3,
    placeId: 'leipzig',
    label: { nl: 'Leipzig', en: 'Leipzig', de: 'Leipzig', cs: 'Lipsko' },
    note: {
      nl: 'Stadttheater 1886–1888. Geen hotel.',
      en: 'Municipal theatre 1886–1888. No hotel.',
      de: 'Stadttheater 1886–1888. Kein Hotel.',
      cs: 'Městské divadlo 1886–1888. Žádný hotel.',
    },
  },
  {
    id: 'trip-prague',
    order: 4,
    placeId: 'prague',
    label: { nl: 'Praag', en: 'Prague', de: 'Prag', cs: 'Praha' },
    note: {
      nl: 'Stavovské, NDT, Výstaviště. Stedenpin voor de rit; Mahler-huizen staan apart.',
      en: 'Estates, NDT, Výstaviště. City pin for the drive; Mahler houses sit separately.',
      de: 'Ständetheater, NDT, Výstaviště. Stadtpin für die Fahrt; Mahler-Häuser liegen extra.',
      cs: 'Stavovské, NDT, Výstaviště. Pin města pro cestu; Mahlerovy domy jsou zvlášť.',
    },
  },
  {
    id: 'trip-steinbach',
    order: 5,
    placeId: 'steinbach',
    label: { nl: 'Steinbach am Attersee', en: 'Steinbach am Attersee', de: 'Steinbach am Attersee', cs: 'Steinbach am Attersee' },
    note: {
      nl: 'Eerste hut. Geen pension verzonnen.',
      en: 'First hut. No inn invented.',
      de: 'Erste Hütte. Kein Gasthof erfunden.',
      cs: 'První chata. Žádný hostinec není vymyšlený.',
    },
  },
  {
    id: 'trip-vienna',
    order: 6,
    placeId: 'vienna',
    label: { nl: 'Wenen', en: 'Vienna', de: 'Wien', cs: 'Vídeň' },
    note: {
      nl: 'Hofoper, Löw, Grinzing. Geen hotel.',
      en: 'Hofoper, Löw, Grinzing. No hotel.',
      de: 'Hofoper, Löw, Grinzing. Kein Hotel.',
      cs: 'Dvorní opera, Löw, Grinzing. Žádný hotel.',
    },
  },
  {
    id: 'trip-budapest',
    order: 7,
    placeId: 'budapest_opera',
    label: { nl: 'Boedapest', en: 'Budapest', de: 'Budapest', cs: 'Budapešť' },
    note: {
      nl: 'Opera 1888–1891. Pin: huis, geen logement.',
      en: 'Opera 1888–1891. Pin: the house, not a lodging.',
      de: 'Oper 1888–1891. Pin: das Haus, keine Herberge.',
      cs: 'Opera 1888–1891. Pin: dům, ne nocleh.',
    },
  },
  {
    id: 'trip-maiernigg',
    order: 8,
    placeId: 'maiernigg',
    label: { nl: 'Maria Wörth / Maiernigg', en: 'Maria Wörth / Maiernigg', de: 'Maria Wörth / Maiernigg', cs: 'Maria Wörth / Maiernigg' },
    note: {
      nl: 'Wörthersee. Hut in Maiernigg; dorp Maria Wörth ernaast. Geen hotel.',
      en: 'Wörthersee. Hut in Maiernigg; village Maria Wörth beside it. No hotel.',
      de: 'Wörthersee. Hütte in Maiernigg; Ort Maria Wörth daneben. Kein Hotel.',
      cs: 'Wörthersee. Chata v Maierniggu; obec Maria Wörth vedle. Žádný hotel.',
    },
  },
  {
    id: 'trip-toblach',
    order: 9,
    placeId: 'toblach',
    label: { nl: 'Toblach', en: 'Toblach', de: 'Toblach', cs: 'Dobbiaco' },
    note: {
      nl: 'Derde hut. Geen Grand Hotel als feitelijke overnachting hier.',
      en: 'Third hut. No Grand Hotel claimed as a night here.',
      de: 'Dritte Hütte. Kein Grand Hotel als Nacht hier behauptet.',
      cs: 'Třetí chata. Žádný Grand Hotel tu není tvrzen jako nocleh.',
    },
  },
  {
    id: 'trip-venice',
    order: 10,
    placeId: 'venice',
    label: { nl: 'Venetië', en: 'Venice', de: 'Venedig', cs: 'Benátky' },
    note: {
      nl: 'Doorreis. Geen Mahler-woning, geen hotel.',
      en: 'Transit. No Mahler dwelling, no hotel.',
      de: 'Durchreise. Keine Mahler-Wohnung, kein Hotel.',
      cs: 'Průjezd. Žádný Mahlerův byt, žádný hotel.',
    },
  },
  {
    id: 'trip-bolzano',
    order: 11,
    placeId: 'bolzano',
    label: { nl: 'Bolzano', en: 'Bolzano', de: 'Bozen', cs: 'Bolzano' },
    note: {
      nl: 'Doorreis. Stadspin.',
      en: 'Transit. City pin.',
      de: 'Durchreise. Stadtpin.',
      cs: 'Průjezd. Pin města.',
    },
  },
  {
    id: 'trip-fuessen',
    order: 12,
    placeId: 'fuessen',
    label: { nl: 'Füssen', en: 'Füssen', de: 'Füssen', cs: 'Füssen' },
    note: {
      nl: 'Doorreis. Geen Ludwig-mythe als Mahler-feit.',
      en: 'Transit. No Ludwig myth as a Mahler fact.',
      de: 'Durchreise. Kein Ludwig-Mythos als Mahler-Fakt.',
      cs: 'Průjezd. Žádný mýtus o Ludwigovi jako Mahlerův fakt.',
    },
  },
  {
    id: 'trip-metz',
    order: 13,
    placeId: 'metz',
    label: { nl: 'Metz', en: 'Metz', de: 'Metz', cs: 'Mety' },
    note: {
      nl: 'Doorreis. Geen hotel.',
      en: 'Transit. No hotel.',
      de: 'Durchreise. Kein Hotel.',
      cs: 'Průjezd. Žádný hotel.',
    },
  },
  {
    id: 'trip-sint-amands',
    order: 14,
    placeId: 'sint_amands',
    date: '2026-09-07',
    label: { nl: 'Sint-Amands', en: 'Sint-Amands', de: 'Sint-Amands', cs: 'Sint-Amands' },
    note: {
      nl: 'Einde van de rit, 7 september 2026. Stadspin. Geen hotel.',
      en: 'End of the drive, 7 September 2026. City pin. No hotel.',
      de: 'Ende der Fahrt, 7. September 2026. Stadtpin. Kein Hotel.',
      cs: 'Konec cesty, 7. září 2026. Pin města. Žádný hotel.',
    },
  },
];

export const tripWindow = { start: '2026-08-22', end: '2026-09-07' };
