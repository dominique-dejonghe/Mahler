// Centralized data access layer.
// In prompt 2, replace the mock implementations below with Supabase queries.
// All functions are async to make that swap drop-in.

import { PROSPECTION_STOPS } from './data/stops';
import { ENCYCLOPEDIA, ENCYCLOPEDIA_CATEGORIES } from './data/encyclopedia';
import { JOURNAL_ENTRIES } from './data/journal';
import { CONCERTS_2026 } from './data/concerts';
import { DAY_PROGRAM, PRICING_TIERS, TOUR_INCLUDED, DEPARTURE_DATES, FAQ_ITEMS } from './data/tour';
import { CHECKLIST_ITEMS, CONTACTS, AUDIO_RECORDINGS, PRIVATE_JOURNAL, ACTIVITY_FEED } from './data/private';

import type {
  ProspectionStop,
  EncyclopediaLocation,
  JournalEntry,
  Concert,
  ChecklistItem,
  Contact,
  AudioRecording,
  PrivateJournalEntry,
  ActivityEvent,
  DashboardStats,
} from '@/types';

// ============ PUBLIC DATA ============

export async function getStops(): Promise<ProspectionStop[]> {
  return PROSPECTION_STOPS;
}

export async function getStopBySlug(slug: string): Promise<ProspectionStop | undefined> {
  return PROSPECTION_STOPS.find((s) => s.slug === slug);
}

export async function getStopById(id: number): Promise<ProspectionStop | undefined> {
  return PROSPECTION_STOPS.find((s) => s.id === id);
}

export async function getEncyclopedia(): Promise<EncyclopediaLocation[]> {
  return ENCYCLOPEDIA;
}

export async function getEncyclopediaBySlug(slug: string): Promise<EncyclopediaLocation | undefined> {
  return ENCYCLOPEDIA.find((l) => l.slug === slug);
}

export async function getEncyclopediaNeighbors(slug: string): Promise<{
  prev?: EncyclopediaLocation;
  next?: EncyclopediaLocation;
}> {
  const idx = ENCYCLOPEDIA.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? ENCYCLOPEDIA[idx - 1] : undefined,
    next: idx >= 0 && idx < ENCYCLOPEDIA.length - 1 ? ENCYCLOPEDIA[idx + 1] : undefined,
  };
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  return [...JOURNAL_ENTRIES].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | undefined> {
  return JOURNAL_ENTRIES.find((j) => j.slug === slug);
}

export async function getConcerts(): Promise<Concert[]> {
  return [...CONCERTS_2026].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getDayProgram() {
  return DAY_PROGRAM;
}

export async function getPricingTiers() {
  return PRICING_TIERS;
}

export async function getTourIncluded() {
  return TOUR_INCLUDED;
}

export async function getDepartureDates() {
  return DEPARTURE_DATES;
}

export async function getFAQ() {
  return FAQ_ITEMS;
}

export { ENCYCLOPEDIA_CATEGORIES };

// ============ PRIVATE DATA ============

export async function getChecklist(): Promise<ChecklistItem[]> {
  return CHECKLIST_ITEMS;
}

export async function getContacts(): Promise<Contact[]> {
  return CONTACTS;
}

export async function getAudioRecordings(): Promise<AudioRecording[]> {
  return AUDIO_RECORDINGS;
}

export async function getPrivateJournal(): Promise<PrivateJournalEntry[]> {
  return PRIVATE_JOURNAL;
}

export async function getActivityFeed(): Promise<ActivityEvent[]> {
  return ACTIVITY_FEED;
}

export async function getDashboardStats(): Promise<DashboardStats> {
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

// ============ CONSTANTS ============

export const SITE_CONFIG = {
  name: 'Mahler Reise',
  tagline: { nl: 'In de voetsporen van Gustav Mahler', en: 'In the footsteps of Gustav Mahler' },
  owners: [
    { name: 'Dominique Dejonghe', email: 'dominique.dejonghe@iutum.be' },
    { name: 'Tom Devaere', email: 'tom@mahler-reise.be' },
  ],
  liveDate: '2026-08-01',
  prospectionDates: { start: '2026-08-21', end: '2026-08-30' },
  tourYear: 2027,
};
