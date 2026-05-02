import type { ChecklistItem, Contact, AudioRecording, PrivateJournalEntry, ActivityEvent } from '../types';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Admin
  { id: 'ck-1', title: { nl: 'Reisverzekering bevestigen', en: 'Confirm travel insurance' }, category: 'admin', done: true },
  { id: 'ck-2', title: { nl: 'BTW-formulieren samenstellen', en: 'Prepare VAT forms' }, category: 'admin', done: true },
  { id: 'ck-3', title: { nl: 'Persaccreditatie Wenen aanvragen', en: 'Apply for press accreditation Vienna' }, category: 'admin', done: false },
  { id: 'ck-4', title: { nl: 'Algemene voorwaarden update 2027', en: 'Update terms 2027' }, category: 'admin', done: false },

  // Travel
  { id: 'ck-5', title: { nl: 'Touringcar boeken (Vlaamse Reizen)', en: 'Book coach (Vlaamse Reizen)' }, category: 'travel', done: true },
  { id: 'ck-6', title: { nl: 'Hotels reserveren — alle 11 locaties', en: 'Book hotels — all 11 locations' }, category: 'travel', done: false },
  { id: 'ck-7', title: { nl: 'Privébus Kaliště ↔ Jihlava', en: 'Private shuttle Kaliště ↔ Jihlava' }, category: 'travel', done: false },
  { id: 'ck-8', title: { nl: 'Treintickets terugreis Italië', en: 'Train tickets return Italy' }, category: 'travel', done: false },

  // Archive
  { id: 'ck-9', title: { nl: 'Toegang Mendelssohn-Haus Leipzig', en: 'Access Mendelssohn-Haus Leipzig' }, category: 'archive', done: true },
  { id: 'ck-10', title: { nl: 'Wienbibliothek im Rathaus — afspraak', en: 'Wienbibliothek im Rathaus — appointment' }, category: 'archive', done: false },
  { id: 'ck-11', title: { nl: 'Pierpont Morgan — digitale scans', en: 'Pierpont Morgan — digital scans' }, category: 'archive', done: false },
  { id: 'ck-12', title: { nl: 'Mahler-Haus Steinbach — privatour', en: 'Mahler-Haus Steinbach — private tour' }, category: 'archive', done: true },

  // Media
  { id: 'ck-13', title: { nl: 'Audiorecorder + microfoons aanschaffen', en: 'Buy audio recorder + microphones' }, category: 'media', done: true },
  { id: 'ck-14', title: { nl: 'Foto-uitrusting controleren', en: 'Check photo equipment' }, category: 'media', done: true },
  { id: 'ck-15', title: { nl: 'Toestemmingsformulieren interviews', en: 'Interview consent forms' }, category: 'media', done: false },

  // Concert
  { id: 'ck-16', title: { nl: 'Tickets Mahler 4 — Bolzano 4/9', en: 'Tickets Mahler 4 — Bolzano 4/9' }, category: 'concert', done: true },
  { id: 'ck-17', title: { nl: 'Tickets Mahler 4 — Toblach 5/9', en: 'Tickets Mahler 4 — Toblach 5/9' }, category: 'concert', done: true },
  { id: 'ck-18', title: { nl: 'Tickets Mahler 9 — Toblach 9/9', en: 'Tickets Mahler 9 — Toblach 9/9' }, category: 'concert', done: false },

  // Logistics
  { id: 'ck-19', title: { nl: 'Visa & paspoort check teamleden', en: 'Visa & passport check team' }, category: 'logistics', done: true },
  { id: 'ck-20', title: { nl: 'Roaming en data EU/CH', en: 'Roaming and data EU/CH' }, category: 'logistics', done: false },
  { id: 'ck-21', title: { nl: 'EHBO-kit + medicatie', en: 'First aid kit + medication' }, category: 'logistics', done: false },
];

export const CONTACTS: Contact[] = [
  {
    id: 'co-1',
    name: 'Maestro Hartmut Schäfer',
    role: 'Artistiek directeur',
    organization: 'Gustav Mahler Musikwochen Toblach',
    city: 'Toblach',
    email: 'schaefer@gustav-mahler.it',
    status: 'confirmed',
    notes: 'Privé­bezoek Komponierhäuschen bevestigd voor 30/8 ochtend. Sprak NL en DE.',
    linkedStopId: 11,
  },
  {
    id: 'co-2',
    name: 'Mevr. Jana Nováková',
    role: 'Conservatrice',
    organization: 'Geboortehuis-museum Kaliště',
    city: 'Kaliště',
    email: 'novakova@mahler-kaliste.cz',
    phone: '+420 565 123 456',
    status: 'confirmed',
    notes: 'Sleutel voor exclusieve toegang tussen 11u en 13u op 25/8.',
    linkedStopId: 4,
  },
  {
    id: 'co-3',
    name: 'Dr. Wolfgang Schmidt',
    role: 'Archivaris',
    organization: 'Mendelssohn-Haus Leipzig',
    city: 'Leipzig',
    email: 'schmidt@mendelssohn-stiftung.de',
    status: 'meeting-scheduled',
    notes: 'Afspraak 22/8 om 14u. Vraagt vooraf onze interesse: Pintos-correspondentie & première Symfonie 1.',
    linkedStopId: 2,
  },
  {
    id: 'co-4',
    name: 'Dr. András Kovács',
    role: 'Conservator',
    organization: 'Magyar Állami Operaház',
    city: 'Budapest',
    email: 'kovacs@opera.hu',
    status: 'contacted',
    notes: 'Antwoord verwacht volgende week. Vraagt schriftelijke bevestiging vanuit een academische instelling.',
    linkedStopId: 9,
  },
  {
    id: 'co-5',
    name: 'Dr. Erika Müller',
    role: 'Hoofd Mahler-collectie',
    organization: 'Wienbibliothek im Rathaus',
    city: 'Wenen',
    email: 'mueller@wienbibliothek.at',
    status: 'contacted',
    linkedStopId: 8,
  },
  {
    id: 'co-6',
    name: 'Prof. Stefan Trenker',
    role: 'Eigenaar Trenkerhof',
    organization: 'Trenkerhof / Komponierhäuschen Toblach',
    city: 'Alt-Schluderbach',
    phone: '+39 0474 972 123',
    status: 'meeting-scheduled',
    linkedStopId: 11,
  },
  {
    id: 'co-7',
    name: 'Maestro Manfred Honeck',
    role: 'Dirigent',
    organization: 'Gustav Mahler Jugendorchester',
    city: 'Wenen',
    status: 'cold',
    notes: 'Te benaderen via management — Ed Smith Artists.',
  },
  {
    id: 'co-8',
    name: 'Frau Eva Bauer',
    role: 'Hoteldirecteur',
    organization: 'Hotel Sacher Wien',
    city: 'Wenen',
    email: 'bauer@sacher.com',
    status: 'declined',
    notes: 'Geen groepstarieven beschikbaar voor 2027. Alternatief: Hotel Bristol.',
    linkedStopId: 8,
  },
  {
    id: 'co-9',
    name: 'Pavel Černý',
    role: 'Festivalcoördinator',
    organization: 'Mahler Festival Jihlava',
    city: 'Jihlava',
    email: 'cerny@mahler.cz',
    status: 'confirmed',
    linkedStopId: 5,
  },
  {
    id: 'co-10',
    name: 'Dr. Helmut Brunner',
    role: 'Conservator',
    organization: 'Mahler-Villa Maiernigg',
    city: 'Klagenfurt',
    email: 'brunner@mahler-villa.at',
    status: 'meeting-scheduled',
    linkedStopId: 10,
  },
];

export const AUDIO_RECORDINGS: AudioRecording[] = [
  {
    id: 'au-1',
    title: 'Interview Maestro Schäfer',
    date: '2026-08-30',
    location: 'Toblach',
    duration: 2735,
    url: '/audio/sample.mp3',
    speaker: 'Tom Devaere & Hartmut Schäfer',
    transcription: 'TD: Wat betekent het voor jou om in dit hutje te werken? — HS: Voor mij is het de meest concentrische plek van Europa…',
  },
  {
    id: 'au-2',
    title: 'Privérecital Kaliště',
    date: '2026-08-25',
    location: 'Kaliště',
    duration: 1840,
    url: '/audio/sample.mp3',
    speaker: 'Tom Devaere — viool',
    transcription: 'Bach Partita nr. 2 — Sarabande, opname in geboortehuis. Akoestiek opvallend droog door lage plafonds.',
  },
  {
    id: 'au-3',
    title: 'Veldopname Attersee',
    date: '2026-08-26',
    location: 'Steinbach am Attersee',
    duration: 612,
    url: '/audio/sample.mp3',
    speaker: 'Veldopname (omgeving Komponierhäuschen)',
    transcription: 'Wind, koeienbellen, verre boot. Achtergrondruis 36 dB.',
  },
  {
    id: 'au-4',
    title: 'Interview Dr. Nováková',
    date: '2026-08-25',
    location: 'Kaliště',
    duration: 2150,
    url: '/audio/sample.mp3',
    speaker: 'Dominique Dejonghe & Jana Nováková',
    transcription: '',
  },
];

export const PRIVATE_JOURNAL: PrivateJournalEntry[] = [
  {
    id: 'pj-1',
    stopId: 1,
    date: '2026-08-21',
    title: 'Kassel — eerste indrukken',
    body: 'Het Hoftheater is verdwenen. Wel een gedenkplaat. Sprak met conciërge stadsarchief — biedt scans aan voor €120 per uur. Te overwegen voor de definitieve gids.',
    authorEmail: 'tom@example.be',
  },
  {
    id: 'pj-2',
    stopId: 4,
    date: '2026-08-25',
    title: 'Kaliště — toegangsregeling',
    body: 'Nováková heeft sleutel. We krijgen 2u privé-toegang. Recital op zolder mogelijk maar akoestiek zeer droog (lage balken). Tom test Bach Sarabande.',
    authorEmail: 'dominique@iutum.be',
  },
];

export const ACTIVITY_FEED: ActivityEvent[] = [
  { id: 'a-1', type: 'entry', title: 'Nieuwe entry: Kaliště — toegangsregeling', timestamp: '2026-08-25T14:32:00Z', actor: 'Dominique' },
  { id: 'a-2', type: 'audio', title: 'Audio geüpload: Privérecital Kaliště', timestamp: '2026-08-25T16:10:00Z', actor: 'Tom' },
  { id: 'a-3', type: 'contact', title: 'Contact bevestigd: Dr. Nováková', timestamp: '2026-08-25T11:05:00Z', actor: 'Tom' },
  { id: 'a-4', type: 'checklist', title: 'Checklist afgevinkt: Mahler-Haus Steinbach — privatour', timestamp: '2026-08-24T09:15:00Z', actor: 'Dominique' },
  { id: 'a-5', type: 'entry', title: 'Nieuwe entry: Kassel — eerste indrukken', timestamp: '2026-08-21T20:42:00Z', actor: 'Tom' },
];
