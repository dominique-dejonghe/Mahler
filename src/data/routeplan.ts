// Prospectiereis 2026 — dagelijkse route-segmenten met afstanden en Tesla-laadstops.
// Bron: Google Maps schattingen, Tesla Supercharger locaties officieel.

export interface RouteSegment {
  day: number;
  date: string; // ISO
  weekday: string;
  from: string;
  to: string;
  fromCoords: [number, number]; // [lng, lat]
  toCoords: [number, number];
  km: number;
  drivingTime: string; // "2u30"
  note?: string;
  teslaStops?: TeslaStop[];
  overnight?: string;
  waypoints?: [number, number][]; // extra pins along the route for the polyline realism
}

export interface TeslaStop {
  name: string;
  coords: [number, number];
  kW: number;
  minutes: number;
  note?: string;
}

export const ROUTE_SEGMENTS: RouteSegment[] = [
  {
    day: 1,
    date: '2026-08-22',
    weekday: 'zaterdag',
    from: 'Sint-Amands / Nismes (B)',
    to: 'Kassel',
    fromCoords: [4.2003, 51.0472],
    toCoords: [9.4979, 51.3127],
    km: 480,
    drivingTime: '5u30',
    note: 'Vertrek België, aankomst Kassel voor welkomstdiner. Avondwandeling langs Wolfsschlucht.',
    overnight: 'Kassel',
  },
  {
    day: 2,
    date: '2026-08-23',
    weekday: 'zondag',
    from: 'Kassel',
    to: 'Leipzig',
    fromCoords: [9.4979, 51.3127],
    toCoords: [12.3731, 51.3397],
    km: 300,
    drivingTime: '3u',
    note: 'Mendelssohn-Haus, Thomaskirche, site Stadttheater.',
    overnight: 'Leipzig',
  },
  {
    day: 3,
    date: '2026-08-24',
    weekday: 'maandag',
    from: 'Leipzig',
    to: 'Praag',
    fromCoords: [12.3731, 51.3397],
    toCoords: [14.4378, 50.0755],
    km: 260,
    drivingTime: '3u',
    note: 'Estates Theatre, Karlsbrug, Kleinseite.',
    overnight: 'Praag',
  },
  {
    day: 4,
    date: '2026-08-25',
    weekday: 'dinsdag',
    from: 'Praag',
    to: 'Praag',
    fromCoords: [14.4378, 50.0755],
    toCoords: [14.4378, 50.0755],
    km: 0,
    drivingTime: '—',
    note: 'Volle dag Praag: Nationaal Museum, Mahler-locaties, wandeling langs de Moldau.',
    overnight: 'Praag',
  },
  {
    day: 5,
    date: '2026-08-26',
    weekday: 'woensdag',
    from: 'Praag',
    to: 'Steinbach am Attersee (via Kaliště + Jihlava)',
    fromCoords: [14.4378, 50.0755],
    toCoords: [13.5526, 47.8064],
    km: 480,
    drivingTime: '5u30',
    note: 'Ochtend Kaliště (geboortehuis nr. 9), lunch Jihlava, doorrit naar Attersee.',
    waypoints: [[15.2333, 49.4567], [15.5912, 49.3961]],
    overnight: 'Steinbach am Attersee',
  },
  {
    day: 6,
    date: '2026-08-27',
    weekday: 'donderdag',
    from: 'Steinbach → Bad Hall → Wenen',
    to: 'Wenen',
    fromCoords: [13.5526, 47.8064],
    toCoords: [16.3738, 48.2082],
    km: 320,
    drivingTime: '4u',
    note: 'Ochtend componeerhutje Steinbach, tussenstop Bad Hall (kuurkapellmeister 1880).',
    waypoints: [[14.2167, 48.05]],
    overnight: 'Wenen',
  },
  {
    day: 7,
    date: '2026-08-28',
    weekday: 'vrijdag',
    from: 'Wenen',
    to: 'Budapest',
    fromCoords: [16.3738, 48.2082],
    toCoords: [19.0402, 47.4979],
    km: 245,
    drivingTime: '2u45',
    note: 'Ochtend Hofoper + Karlskirche + Grinzing graf. Namiddag naar Boedapest.',
    overnight: 'Budapest',
  },
  {
    day: 8,
    date: '2026-08-29',
    weekday: 'zaterdag',
    from: 'Budapest → Maiernigg',
    to: 'Maiernigg (Wörthersee)',
    fromCoords: [19.0402, 47.4979],
    toCoords: [14.2667, 46.6167],
    km: 450,
    drivingTime: '5u',
    note: 'Royal Opera Boedapest ochtend, doorreis naar Karinthië. Aankomst Wörthersee laat namiddag.',
    overnight: 'Maiernigg',
  },
  {
    day: 9,
    date: '2026-08-30',
    weekday: 'zondag',
    from: 'Maiernigg → Toblach',
    to: 'Toblach',
    fromCoords: [14.2667, 46.6167],
    toCoords: [12.2167, 46.7333],
    km: 220,
    drivingTime: '3u',
    note: 'Ochtend componeerhutje Maiernigg. Doorreis via Alpen. Late aankomst Toblach.',
    overnight: 'Toblach',
  },
  {
    day: 10,
    date: '2026-08-31',
    weekday: 'maandag',
    from: 'Toblach',
    to: 'Toblach',
    fromCoords: [12.2167, 46.7333],
    toCoords: [12.2167, 46.7333],
    km: 0,
    drivingTime: '—',
    note: 'Volle dag Toblach: Komponierhäuschen aan het Toblachermeer + Kulturzentrum Grand Hotel.',
    overnight: 'Toblach',
  },
  {
    day: 11,
    date: '2026-09-01',
    weekday: 'dinsdag',
    from: 'Toblach → Venetië',
    to: 'Venetië',
    fromCoords: [12.2167, 46.7333],
    toCoords: [12.3155, 45.4408],
    km: 175,
    drivingTime: '2u30',
    note: 'Vertrek Toblach 15u. Aankomst Venetië avond, welkomstdiner in Cannaregio.',
    overnight: 'Venetië',
  },
  {
    day: 12,
    date: '2026-09-02',
    weekday: 'woensdag',
    from: 'Venetië — Lido-dag',
    to: 'Venetië',
    fromCoords: [12.3155, 45.4408],
    toCoords: [12.3155, 45.4408],
    km: 0,
    drivingTime: '—',
    note: 'Lido: Hotel des Bains (Aschenbach), Villa Nora (Thomas Mann), strand, Adagietto in de oren.',
    overnight: 'Venetië',
  },
  {
    day: 13,
    date: '2026-09-03',
    weekday: 'donderdag',
    from: 'Venetië — Peggy Guggenheim',
    to: 'Venetië',
    fromCoords: [12.3155, 45.4408],
    toCoords: [12.3155, 45.4408],
    km: 0,
    drivingTime: '—',
    note: 'Peggy Guggenheim ochtend, La Fenice namiddag, gondeltocht bij zonsondergang.',
    overnight: 'Venetië',
  },
  {
    day: 14,
    date: '2026-09-04',
    weekday: 'vrijdag',
    from: 'Venetië → Bolzano',
    to: 'Bolzano',
    fromCoords: [12.3155, 45.4408],
    toCoords: [11.3548, 46.4983],
    km: 220,
    drivingTime: '2u45',
    note: 'Vertrek Venetië 12u, aankomst Bolzano 17u. Diner in Zuid-Tiroolse Altstadt.',
    teslaStops: [
      {
        name: 'Tesla Supercharger Verona-Est',
        coords: [11.0537, 45.4384],
        kW: 250,
        minutes: 20,
        note: 'V3 langs A4, lunchpauze mogelijk',
      },
    ],
    overnight: 'Bolzano',
  },
  {
    day: 15,
    date: '2026-09-05',
    weekday: 'zaterdag',
    from: 'Bolzano → Füssen',
    to: 'Füssen (Neuschwanstein)',
    fromCoords: [11.3548, 46.4983],
    toCoords: [10.7386, 47.5581],
    km: 346,
    drivingTime: '4u',
    note: 'Via Brenner + Innsbruck + Fernpass. Scenic Alpenvallei. Aankomst Füssen namiddag.',
    teslaStops: [
      {
        name: 'Tesla Supercharger Innsbruck-Kranebitten',
        coords: [11.3450, 47.2597],
        kW: 250,
        minutes: 25,
        note: 'V3 langs A12, koffiepauze',
      },
    ],
    waypoints: [[11.5081, 47.0000], [11.3450, 47.2597]], // Brenner + Innsbruck
    overnight: 'Füssen',
  },
  {
    day: 16,
    date: '2026-09-06',
    weekday: 'zondag',
    from: 'Neuschwanstein → Metz',
    to: 'Metz',
    fromCoords: [10.7386, 47.5581],
    toCoords: [6.1757, 49.1193],
    km: 480,
    drivingTime: '5u',
    note: 'Ochtend Neuschwanstein (ticket 8u30-slot), vertrek 11u. Aankomst Metz 17u-17u30. Diner in stadscentrum.',
    teslaStops: [
      {
        name: 'Tesla Supercharger Stuttgart-Vaihingen',
        coords: [9.1112, 48.7255],
        kW: 250,
        minutes: 30,
        note: 'V3 langs A8, lunch onderweg',
      },
    ],
    waypoints: [[11.5820, 48.1351]], // München bypass
    overnight: 'Metz',
  },
  {
    day: 17,
    date: '2026-09-07',
    weekday: 'maandag',
    from: 'Metz → Nismes → Sint-Amands',
    to: 'Sint-Amands',
    fromCoords: [6.1757, 49.1193],
    toCoords: [4.2003, 51.0472],
    km: 420,
    drivingTime: '4u30',
    note: 'Vertrek Metz 9u. Nismes uiterlijk 14u (reiziger 1 blijft). Sint-Amands 17u-18u.',
    teslaStops: [
      {
        name: 'Tesla Supercharger Wasserbillig (LU)',
        coords: [6.4986, 49.7211],
        kW: 250,
        minutes: 20,
        note: 'V3 aan A1/E44, top-up naar 90%',
      },
    ],
    waypoints: [[4.5578, 50.0803]], // Nismes tussenstop
    overnight: 'Sint-Amands (thuis)',
  },
];

export function totalKm(): number {
  return ROUTE_SEGMENTS.reduce((sum, s) => sum + s.km, 0);
}

export function drivingDaysCount(): number {
  return ROUTE_SEGMENTS.filter((s) => s.km > 0).length;
}

export function restDaysCount(): number {
  return ROUTE_SEGMENTS.filter((s) => s.km === 0).length;
}

export function totalDays(): number {
  return ROUTE_SEGMENTS.length;
}
