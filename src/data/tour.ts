import type { DayProgram, PricingTier } from '../types';

export const DAY_PROGRAM: DayProgram[] = [
  {
    day: 1,
    date: { nl: 'Dag 1', en: 'Day 1' },
    title: { nl: 'Vertrek België → Kassel', en: 'Departure Belgium → Kassel' },
    location: 'Kassel',
    description: {
      nl: 'Vertrek per luxetouringcar uit Brussel. Welkomstdiner in Kassel. Avondwandeling langs de plekken waar Mahler in 1883–1885 als 2e Kapellmeister werkte.',
      en: 'Departure by luxury coach from Brussels. Welcome dinner in Kassel. Evening walk past the places where Mahler worked as 2nd Kapellmeister in 1883–1885.',
    },
    highlights: {
      nl: ['Welkomstdiner', 'Site Hoftheater', 'Memorial Wolfsschlucht'],
      en: ['Welcome dinner', 'Hoftheater site', 'Wolfsschlucht memorial'],
    },
  },
  {
    day: 2,
    date: { nl: 'Dag 2', en: 'Day 2' },
    title: { nl: 'Kassel → Leipzig', en: 'Kassel → Leipzig' },
    location: 'Leipzig',
    description: {
      nl: 'Bezoek aan het Mendelssohn-Haus en de Thomaskirche. Lezing over Mahlers tijd in Leipzig (1886–1888) en de spectaculaire première van Die drei Pintos.',
      en: 'Visit to the Mendelssohn-Haus and the Thomaskirche. Lecture on Mahler\'s years in Leipzig (1886–1888) and the spectacular premiere of Die drei Pintos.',
    },
    highlights: {
      nl: ['Mendelssohn-Haus', 'Thomaskirche', 'Stadttheater Leipzig'],
      en: ['Mendelssohn-Haus', 'Thomaskirche', 'Stadttheater Leipzig'],
    },
  },
  {
    day: 3,
    date: { nl: 'Dag 3', en: 'Day 3' },
    title: { nl: 'Leipzig → Praag', en: 'Leipzig → Prague' },
    location: 'Praag',
    description: {
      nl: 'Bezoek aan het Estates Theatre, waar Mozart de Don Giovanni op de planken bracht en waar Mahler in 1885–1886 dirigeerde. Avond vrij in de oude stad.',
      en: 'Visit to the Estates Theatre, where Mozart premiered Don Giovanni and Mahler conducted in 1885–1886. Free evening in the old town.',
    },
    highlights: {
      nl: ['Estates Theatre', 'Karelsbrug', 'Joods kwartier'],
      en: ['Estates Theatre', 'Charles Bridge', 'Jewish Quarter'],
    },
  },
  {
    day: 4,
    date: { nl: 'Dag 4', en: 'Day 4' },
    title: { nl: 'Praag → Kaliště → Jihlava', en: 'Prague → Kaliště → Jihlava' },
    location: 'Kaliště / Jihlava',
    description: {
      nl: 'Privébezoek aan het geboortehuis in Kaliště, met kamermuziekrecital. \'s Middags door naar Jihlava — kindertijd, kerken, militaire kazerne. Diner in Iglau.',
      en: 'Private visit to the birthplace in Kaliště, with a chamber music recital. In the afternoon onwards to Jihlava — childhood, churches, military barracks. Dinner in Iglau.',
    },
    highlights: {
      nl: ['Geboortehuis Kaliště', 'Mahler-Park Jihlava', 'St. Jakobskerk'],
      en: ['Kaliště birthplace', 'Mahler Park Jihlava', 'St. James Church'],
    },
  },
  {
    day: 5,
    date: { nl: 'Dag 5', en: 'Day 5' },
    title: { nl: 'Jihlava → Steinbach am Attersee', en: 'Jihlava → Steinbach am Attersee' },
    location: 'Steinbach am Attersee',
    description: {
      nl: 'Reisdag door het Boheemse Woud naar Oostenrijk. Aankomst in Steinbach. Wandeling naar het Komponierhäuschen waar Symfonieën 2 & 3 ontstonden.',
      en: 'Travel day through the Bohemian Forest to Austria. Arrival in Steinbach. Walk to the Komponierhäuschen where Symphonies 2 & 3 were born.',
    },
    highlights: {
      nl: ['Eerste componeerhutje', 'Attersee bij zonsondergang', 'Lokaal Oostenrijks diner'],
      en: ['First composing hut', 'Attersee at sunset', 'Local Austrian dinner'],
    },
  },
  {
    day: 6,
    date: { nl: 'Dag 6', en: 'Day 6' },
    title: { nl: 'Steinbach → Bad Hall → Wenen', en: 'Steinbach → Bad Hall → Vienna' },
    location: 'Wenen',
    description: {
      nl: 'Bezoek aan Bad Hall, Mahlers eerste professionele aanstelling (1880). Aankomst in Wenen tegen avondvallen. Welkomstdiner in een traditioneel Beisl.',
      en: 'Visit to Bad Hall, Mahler\'s first professional post (1880). Arrival in Vienna by nightfall. Welcome dinner in a traditional Beisl.',
    },
    highlights: {
      nl: ['Kuurkapellmeister Bad Hall', 'Aankomst Wenen', 'Wiener Beisl'],
      en: ['Spa Kapellmeister Bad Hall', 'Arrival in Vienna', 'Wiener Beisl'],
    },
  },
  {
    day: 7,
    date: { nl: 'Dag 7', en: 'Day 7' },
    title: { nl: 'Wenen — een dag voor Mahler', en: 'Vienna — a day for Mahler' },
    location: 'Wenen',
    description: {
      nl: 'Hofoper (Wiener Staatsoper), Konservatorium, sterfplaats Sanatorium Loew, en het graf in Grinzing. Avondconcert (optioneel).',
      en: 'Hofoper (Wiener Staatsoper), Conservatoire, place of death at Sanatorium Loew, and the grave in Grinzing. Optional evening concert.',
    },
    highlights: {
      nl: ['Wiener Staatsoper', 'Graf Grinzing', 'Belvedere'],
      en: ['Wiener Staatsoper', 'Grinzing grave', 'Belvedere'],
    },
  },
  {
    day: 8,
    date: { nl: 'Dag 8', en: 'Day 8' },
    title: { nl: 'Wenen → Budapest', en: 'Vienna → Budapest' },
    location: 'Budapest',
    description: {
      nl: 'Magyar Állami Operaház — directie Mahler 1888–1891 en wereldpremière van zijn Eerste symfonie. Cruise op de Donau bij avond.',
      en: 'Magyar Állami Operaház — Mahler\'s directorship 1888–1891 and world premiere of his First symphony. Danube cruise at dusk.',
    },
    highlights: {
      nl: ['Royal Opera Budapest', 'Donau-cruise', 'Café Gerbeaud'],
      en: ['Royal Opera Budapest', 'Danube cruise', 'Café Gerbeaud'],
    },
  },
  {
    day: 9,
    date: { nl: 'Dag 9', en: 'Day 9' },
    title: { nl: 'Budapest → Maiernigg', en: 'Budapest → Maiernigg' },
    location: 'Maiernigg',
    description: {
      nl: 'Lange reisdag naar Karinthië. Aankomst aan het Wörthersee. Privébezoek aan het tweede componeerhutje en de villa van de familie Mahler.',
      en: 'Long travel day to Carinthia. Arrival at Lake Wörthersee. Private visit to the second composing hut and the Mahler family villa.',
    },
    highlights: {
      nl: ['Tweede componeerhutje', 'Mahler-villa', 'Wörthersee'],
      en: ['Second composing hut', 'Mahler villa', 'Wörthersee'],
    },
  },
  {
    day: 10,
    date: { nl: 'Dag 10', en: 'Day 10' },
    title: { nl: 'Maiernigg → Toblach → terugreis', en: 'Maiernigg → Toblach → return journey' },
    location: 'Toblach',
    description: {
      nl: 'Slotdag in Alt-Schluderbach, het derde en laatste componeerhutje, waar Das Lied von der Erde en de Negende symfonie werden geschreven. Afscheidsconcert. Terugreis naar België via overnachting.',
      en: 'Final day in Alt-Schluderbach, the third and last composing hut, where Das Lied von der Erde and the Ninth symphony were written. Farewell concert. Return journey to Belgium with overnight stop.',
    },
    highlights: {
      nl: ['Komponierhäuschen Toblach', 'Afscheidsconcert', 'Terugreis'],
      en: ['Komponierhäuschen Toblach', 'Farewell concert', 'Return journey'],
    },
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'standaard',
    name: 'Standaard',
    price: 2995,
    features: {
      nl: [
        '10 dagen luxetouringcar',
        '4-sterren hotels (kamer met douche)',
        'Volledig dagprogramma met gids',
        'Ontbijt + 5 diners inbegrepen',
        'Alle museumtickets en archieftoegang',
        'Reisdocumentatie en Mahler-bibliotheek',
      ],
      en: [
        '10 days luxury coach',
        '4-star hotels (room with shower)',
        'Full day programme with guide',
        'Breakfast + 5 dinners included',
        'All museum tickets and archive access',
        'Travel documentation and Mahler library',
      ],
    },
  },
  {
    id: 'comfort',
    name: 'Comfort',
    price: 3295,
    highlighted: true,
    features: {
      nl: [
        'Alles uit Standaard',
        '4★ Superior hotels (ruimere kamers)',
        '8 diners inbegrepen i.p.v. 5',
        '1 privéconcert in een componeerhutje',
        'Welkoms- en afscheidsapéritief',
        'Persoonlijke notitie-set + USB-stick met opnames',
      ],
      en: [
        'Everything in Standard',
        '4★ Superior hotels (larger rooms)',
        '8 dinners included instead of 5',
        '1 private concert in a composing hut',
        'Welcome and farewell aperitif',
        'Personal notebook set + USB with recordings',
      ],
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 3950,
    features: {
      nl: [
        'Alles uit Comfort',
        '5-sterren hotels (suite waar mogelijk)',
        'Alle diners inbegrepen — gastronomisch',
        '2 privéconcerten met Tom Devaere',
        'Privé-archieftoegang in Wenen en Toblach',
        'Limited edition bibliofiel boek over de reis',
        'Eersteklasplaatsen bij alle concerten',
      ],
      en: [
        'Everything in Comfort',
        '5-star hotels (suites where possible)',
        'All dinners included — gastronomic',
        '2 private concerts with Tom Devaere',
        'Private archive access in Vienna and Toblach',
        'Limited edition bibliophile book about the journey',
        'First-class seats at all concerts',
      ],
    },
  },
];

export const TOUR_INCLUDED = {
  nl: [
    'Luxetouringcar met chauffeur en gids',
    'Hotelovernachtingen (afhankelijk van pakket)',
    'Dagelijks ontbijt + diners (afhankelijk van pakket)',
    'Alle museumtoegangen, rondleidingen en archief­toegang',
    'Reizen tussen de elf locaties',
    'Mahler-handleiding (300 pagina\'s, NL of EN)',
    'Concertprogramma\'s en privébezoeken',
    'Reis- en annuleringsverzekering',
  ],
  en: [
    'Luxury coach with driver and guide',
    'Hotel accommodation (depending on package)',
    'Daily breakfast + dinners (depending on package)',
    'All museum entries, guided tours and archive access',
    'Travel between the eleven locations',
    'Mahler companion (300 pages, NL or EN)',
    'Concert programmes and private visits',
    'Travel and cancellation insurance',
  ],
};

export const DEPARTURE_DATES = [
  { date: '2027-05-08', endDate: '2027-05-17', label: { nl: 'Mei 2027', en: 'May 2027' } },
  { date: '2027-08-21', endDate: '2027-08-30', label: { nl: 'Augustus 2027', en: 'August 2027' } },
];

export const FAQ_ITEMS = [
  {
    q: { nl: 'Hoe groot is de groep?', en: 'How large is the group?' },
    a: {
      nl: 'Maximaal 28 personen — bewust beperkt voor een persoonlijke ervaring en privé-toegang tot kleine archieven.',
      en: 'Maximum 28 people — deliberately limited for a personal experience and private access to small archives.',
    },
  },
  {
    q: { nl: 'Is muzikale voorkennis vereist?', en: 'Is prior musical knowledge required?' },
    a: {
      nl: 'Neen. De gids en Tom Devaere bouwen het verhaal stap voor stap op. Wel raden we aan vooraf de Eerste, Vierde en Negende symfonie te beluisteren.',
      en: 'No. The guide and Tom Devaere build the story step by step. We do recommend listening in advance to the First, Fourth and Ninth symphonies.',
    },
  },
  {
    q: { nl: 'In welke taal verloopt de reis?', en: 'In which language is the tour conducted?' },
    a: {
      nl: 'Nederlands en Engels. Het reisgezelschap wordt zo samengesteld dat beide talen vloeiend gehanteerd worden door de gids.',
      en: 'Dutch and English. The travel party is composed so that both languages are handled fluently by the guide.',
    },
  },
  {
    q: { nl: 'Kan ik annuleren?', en: 'Can I cancel?' },
    a: {
      nl: 'Tot 90 dagen voor vertrek 100% terugbetaling minus €250 administratie. Daarna oplopende kosten conform algemene voorwaarden.',
      en: 'Up to 90 days before departure 100% refund minus €250 administration. After that, increasing fees per terms and conditions.',
    },
  },
  {
    q: { nl: 'Hoeveel beweging op een dag?', en: 'How much physical activity per day?' },
    a: {
      nl: 'Gemiddeld 4–6 km wandelen per dag. De wandelingen naar de componeerhutjes (steile paden van 5–10 minuten) zijn optioneel.',
      en: 'On average 4–6 km of walking per day. Walks up to the composing huts (steep paths of 5–10 minutes) are optional.',
    },
  },
];
