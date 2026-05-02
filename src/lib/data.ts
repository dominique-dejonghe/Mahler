// Centralized data access layer — pure functions, edge-runtime safe.
// All data is in-memory mock data; ready to swap for Supabase REST calls later.

import { PROSPECTION_STOPS } from '../data/stops';
import { ENCYCLOPEDIA, ENCYCLOPEDIA_CATEGORIES } from '../data/encyclopedia';
import { JOURNAL_ENTRIES } from '../data/journal';
import { CONCERTS_2026 } from '../data/concerts';
import {
  DAY_PROGRAM,
  PRICING_TIERS,
  TOUR_INCLUDED,
  DEPARTURE_DATES,
  FAQ_ITEMS,
} from '../data/tour';
import {
  CHECKLIST_ITEMS,
  CONTACTS,
  AUDIO_RECORDINGS,
  PRIVATE_JOURNAL,
  ACTIVITY_FEED,
} from '../data/private';

import type {
  ProspectionStop,
  EncyclopediaLocation,
  JournalEntry,
  Concert,
} from '../types';

export function getStops(): ProspectionStop[] {
  return PROSPECTION_STOPS;
}

export function getEncyclopedia(): EncyclopediaLocation[] {
  return ENCYCLOPEDIA;
}

export function getEncyclopediaBySlug(slug: string): EncyclopediaLocation | undefined {
  return ENCYCLOPEDIA.find((l) => l.slug === slug);
}

export function getEncyclopediaNeighbors(slug: string): {
  prev?: EncyclopediaLocation;
  next?: EncyclopediaLocation;
} {
  const idx = ENCYCLOPEDIA.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? ENCYCLOPEDIA[idx - 1] : undefined,
    next: idx >= 0 && idx < ENCYCLOPEDIA.length - 1 ? ENCYCLOPEDIA[idx + 1] : undefined,
  };
}

export function getJournalEntries(): JournalEntry[] {
  return [...JOURNAL_ENTRIES].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getJournalEntryBySlug(slug: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find((j) => j.slug === slug);
}

export function getConcerts(): Concert[] {
  return [...CONCERTS_2026].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getDayProgram() {
  return DAY_PROGRAM;
}

export function getPricingTiers() {
  return PRICING_TIERS;
}

export function getTourIncluded() {
  return TOUR_INCLUDED;
}

export function getDepartureDates() {
  return DEPARTURE_DATES;
}

export function getFAQ() {
  return FAQ_ITEMS;
}

export function getChecklist() {
  return CHECKLIST_ITEMS;
}

export function getContacts() {
  return CONTACTS;
}

export function getAudioRecordings() {
  return AUDIO_RECORDINGS;
}

export function getPrivateJournal() {
  return PRIVATE_JOURNAL;
}

export function getActivityFeed() {
  return ACTIVITY_FEED;
}

export function getDashboardStats() {
  return {
    totalStops: PROSPECTION_STOPS.length,
    completedStops: PROSPECTION_STOPS.filter((s) => s.status === 'completed').length,
    totalContacts: CONTACTS.length,
    contactsConfirmed: CONTACTS.filter((c) => c.status === 'confirmed').length,
    audioRecordings: AUDIO_RECORDINGS.length,
    journalEntries: PRIVATE_JOURNAL.length,
    checklistDone: CHECKLIST_ITEMS.filter((c) => c.done).length,
    checklistTotal: CHECKLIST_ITEMS.length,
  };
}

export { ENCYCLOPEDIA_CATEGORIES };

export const SITE_CONFIG = {
  name: 'Mahler Reise',
  tagline: {
    nl: 'In de voetsporen van Gustav Mahler',
    en: 'In the footsteps of Gustav Mahler',
  },
  liveDate: '2026-08-01',
  prospectionDates: { start: '2026-08-21', end: '2026-08-30' },
  tourYear: 2027,
};

export type Locale = 'nl' | 'en';

export function isLocale(s: string): s is Locale {
  return s === 'nl' || s === 'en';
}
