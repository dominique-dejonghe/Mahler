// Centralized type definitions — these will map 1:1 to Supabase tables in prompt 2.

export type LocaleCode = 'nl' | 'en';

export interface ProspectionStop {
  id: number;
  slug: string;
  name: string;
  country: string;
  arrivalDate: string; // ISO
  departureDate: string; // ISO
  coordinates: [number, number]; // [lng, lat]
  shortDesc: { nl: string; en: string };
  mahlerPeriod: string;
  status: 'planned' | 'in-progress' | 'completed';
  order: number;
}

export interface EncyclopediaLocation {
  id: string;
  slug: string;
  name: string;
  country: string;
  coordinates: [number, number];
  mahlerPeriod: string;
  durationLabel: { nl: string; en: string };
  category: 'birth' | 'youth' | 'early-career' | 'opera-director' | 'composing-hut' | 'late-career' | 'death';
  isFullContent: boolean;
  shortDesc: { nl: string; en: string };
  // Full content (only for 5 detailed locations)
  hero?: {
    image: string;
    caption: { nl: string; en: string };
  };
  chronology?: { nl: string[]; en: string[] };
  works?: WorkEntry[];
  manuscripts?: ManuscriptEntry[];
  bibliography?: BibliographyEntry[];
  gallery?: { src: string; caption: { nl: string; en: string } }[];
}

export interface WorkEntry {
  title: string;
  type: 'composed' | 'conducted' | 'premiered';
  year?: string;
  note?: { nl: string; en: string };
}

export interface ManuscriptEntry {
  title: string;
  archive: string;
  archiveUrl?: string;
  note?: { nl: string; en: string };
}

export interface BibliographyEntry {
  author: string;
  title: string;
  year: number;
  publisher?: string;
}

export interface JournalEntry {
  id: string;
  slug: string;
  title: { nl: string; en: string };
  excerpt: { nl: string; en: string };
  body: { nl: string; en: string };
  date: string; // ISO
  location: string;
  country: string;
  coordinates: [number, number];
  author: 'Tom Devaere' | 'Dominique Dejonghe';
  coverImage: string;
  type: 'observation' | 'archive' | 'concert' | 'meeting' | 'travel';
}

export interface Concert {
  id: string;
  title: string;
  date: string; // ISO
  endDate?: string;
  venue: string;
  city: string;
  country: string;
  composer?: string;
  programme: string;
  performers: string[];
  ticketsUrl?: string;
  infoUrl?: string;
  isTomDevaere: boolean;
}

export interface PricingTier {
  id: 'standaard' | 'comfort' | 'premium';
  name: string;
  price: number;
  features: { nl: string[]; en: string[] };
  highlighted?: boolean;
}

export interface DayProgram {
  day: number;
  date: { nl: string; en: string };
  title: { nl: string; en: string };
  location: string;
  description: { nl: string; en: string };
  highlights: { nl: string[]; en: string[] };
}

// Private app types
export type ChecklistCategory = 'admin' | 'travel' | 'archive' | 'media' | 'concert' | 'logistics';

export interface ChecklistItem {
  id: string;
  title: { nl: string; en: string };
  category: ChecklistCategory;
  done: boolean;
  assignee?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  city: string;
  email?: string;
  phone?: string;
  status: 'cold' | 'contacted' | 'meeting-scheduled' | 'confirmed' | 'declined';
  notes?: string;
  linkedStopId?: number;
}

export interface AudioRecording {
  id: string;
  title: string;
  date: string;
  location: string;
  duration: number; // seconds
  url: string; // mock url for now
  transcription?: string;
  speaker?: string;
}

export interface PrivateJournalEntry {
  id: string;
  stopId: number;
  date: string;
  title: string;
  body: string;
  authorEmail: string;
  photos?: string[];
}

export interface DashboardStats {
  totalStops: number;
  completedStops: number;
  totalContacts: number;
  contactsConfirmed: number;
  audioRecordings: number;
  journalEntries: number;
  checklistDone: number;
  checklistTotal: number;
}

export interface ActivityEvent {
  id: string;
  type: 'entry' | 'contact' | 'audio' | 'checklist';
  title: string;
  timestamp: string;
  actor: string;
}
