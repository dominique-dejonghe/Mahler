import type { Affiliation, AtlasEvent, Place, Residence, Work } from '../types';
import { affiliations } from './affiliations';
import { deepEvents } from './deep';
import { lifeEvents } from './events';
import { performances } from './performances';
import { placeById, places } from './places';
import { residences } from './residences';
import { works } from './works';

export { affiliations, deepEvents, lifeEvents, performances, placeById, places, residences, works };
export { trip2026, tripWindow } from './trip2026';

function affiliationEvents(): AtlasEvent[] {
  return affiliations.map((a) => ({
    id: `aff-${a.id}`,
    dateStart: a.dateStart,
    dateEnd: a.dateEnd,
    datePrecision: 'range' as const,
    placeId: a.placeId,
    type: a.kind === 'hut' ? 'summer_hut' : a.guest ? 'guest_night' : 'conducting_post',
    title: a.name,
    summary: a.summary,
    extra: a.extra,
    source: a.source,
    role: a.role,
    affiliationId: a.id,
    season: a.kind === 'hut' ? 'summer' : 'winter',
  }));
}

export const allEvents: AtlasEvent[] = [
  ...lifeEvents,
  ...affiliationEvents(),
  ...performances,
  ...deepEvents,
];

export function eventPlace(event: AtlasEvent): Place | undefined {
  return placeById[event.placeId];
}

export function coordsFor(event: AtlasEvent): { lat: number; lng: number; precision: Place['pinPrecision'] } | null {
  if (event.pinOverride) {
    return { lat: event.pinOverride.lat, lng: event.pinOverride.lng, precision: event.pinOverride.precision };
  }
  const place = eventPlace(event);
  if (!place) return null;
  return { lat: place.lat, lng: place.lng, precision: place.pinPrecision };
}

export function eventsNeedingSource(): AtlasEvent[] {
  return allEvents.filter((e) => !e.source?.label);
}

export type Dataset = {
  events: AtlasEvent[];
  places: Place[];
  affiliations: Affiliation[];
  residences: Residence[];
  works: Work[];
};
