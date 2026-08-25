export type Locale = 'nl' | 'en' | 'de' | 'cs';

export type Localized = Record<Locale, string>;

export type EventType =
  | 'childhood'
  | 'conducting_post'
  | 'guest_night'
  | 'summer_hut'
  | 'death'
  | 'grave'
  | 'premiere'
  | 'performance'
  | 'residence'
  | 'life';

export type DatePrecision = 'day' | 'month' | 'year' | 'range' | 'season';
export type PinPrecision = 'venue' | 'city' | 'residence' | 'unknown';
export type Role = 'kapellmeister' | 'director' | 'guest' | 'composer' | 'student';
export type Season = 'winter' | 'summer';
export type AffiliationKind = 'opera' | 'orchestra' | 'hut' | 'other';
export type WorkId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'lied' | '10';

export interface Source {
  label: string;
  url?: string;
  citation?: string;
}

export interface Place {
  id: string;
  city: Localized;
  country: Localized;
  venue?: Localized;
  lat: number;
  lng: number;
  pinPrecision: PinPrecision;
  note?: Localized;
}

export interface Affiliation {
  id: string;
  placeId: string;
  name: Localized;
  kind: AffiliationKind;
  role: Role;
  dateStart: string;
  dateEnd: string;
  summary: Localized;
  extra: Localized;
  source: Source;
  guest?: boolean;
}

export interface Residence {
  id: string;
  placeId: string;
  dateStart: string;
  dateEnd: string;
  type: EventType;
  title: Localized;
  inferredFromPost: boolean;
  note: Localized;
  source: Source;
  season?: Season;
  deep?: boolean;
}

export interface AtlasEvent {
  id: string;
  dateStart: string;
  dateEnd?: string;
  datePrecision: DatePrecision;
  placeId: string;
  type: EventType;
  title: Localized;
  summary: Localized;
  extra: Localized;
  source: Source;
  role?: Role;
  workId?: WorkId;
  affiliationId?: string;
  season?: Season;
  deep?: boolean;
  conductor?: string;
  orchestra?: Localized;
  posthumous?: boolean;
  firstDecade?: boolean;
  pinOverride?: { lat: number; lng: number; precision: PinPrecision };
}

export interface Work {
  id: WorkId;
  title: Localized;
  composed: string;
  unfinished?: boolean;
}

export interface TripStop {
  id: string;
  order: number;
  placeId: string;
  date?: string;
  label: Localized;
  note: Localized;
}

export interface QueryAnswer {
  text: Localized;
  extra?: Localized;
  eventIds: string[];
  unknown: boolean;
  inferred: boolean;
}
