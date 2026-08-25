import { DivIcon } from 'leaflet';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import type { SeasonFilter } from '../App';
import { coordsFor, eventPlace, placeById, trip2026 } from '../data';
import { t } from '../lib/i18n';
import type { AtlasEvent, Locale } from '../types';

function pinIcon(type: AtlasEvent['type'], active: boolean) {
  return new DivIcon({
    className: '',
    html: `<div class="pin ${type}${active ? ' active' : ''}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const tripIcon = new DivIcon({
  className: '',
  html: '<div class="trip-pin"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 6), { duration: 0.7 });
  }, [lat, lng, map]);
  return null;
}

export function MapPane({
  locale,
  events: atlasEvents,
  focusId,
  showTrip,
  season,
  deep,
  onSeason,
  onTrip,
  onDeep,
  onSelect,
}: {
  locale: Locale;
  events: AtlasEvent[];
  focusId: string | null;
  showTrip: boolean;
  season: SeasonFilter;
  deep: boolean;
  onSeason: (s: SeasonFilter) => void;
  onTrip: (v: boolean) => void;
  onDeep: (v: boolean) => void;
  onSelect: (e: AtlasEvent) => void;
}) {
  const markers = useMemo(() => {
    const seen = new Set<string>();
    return atlasEvents.flatMap((e) => {
      const c = coordsFor(e);
      if (!c) return [];
      const key = `${e.placeId}-${e.type}`;
      if (seen.has(key) && e.id !== focusId) return [];
      seen.add(key);
      return [{ event: e, ...c }];
    });
  }, [atlasEvents, focusId]);

  const focus = atlasEvents.find((e) => e.id === focusId);
  const focusCoords = focus ? coordsFor(focus) : null;

  const tripLine = trip2026
    .map((s) => placeById[s.placeId])
    .filter(Boolean)
    .map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <>
      <div className="layers">
        <button className={`chip${season === 'winter' ? ' on' : ''}`} type="button" onClick={() => onSeason(season === 'winter' ? 'both' : 'winter')}>
          {t('winter', locale)}
        </button>
        <button className={`chip${season === 'summer' ? ' on' : ''}`} type="button" onClick={() => onSeason(season === 'summer' ? 'both' : 'summer')}>
          {t('summer', locale)}
        </button>
        <button className={`chip${showTrip ? ' on' : ''}`} type="button" onClick={() => onTrip(!showTrip)}>
          {t('here', locale)}
        </button>
        <button className={`chip${deep ? ' on' : ''}`} type="button" onClick={() => onDeep(!deep)}>
          {t('deeper', locale)}
        </button>
      </div>
      <div className="map-root">
        <MapContainer center={[49.2, 12.8]} zoom={4} minZoom={3} maxZoom={12} scrollWheelZoom>
          <TileLayer
            attribution='&copy; OSM &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {markers.map(({ event, lat, lng }) => {
            const place = eventPlace(event);
            return (
              <Marker
                key={event.id}
                position={[lat, lng]}
                icon={pinIcon(event.type, event.id === focusId)}
                eventHandlers={{ click: () => onSelect(event) }}
                title={place ? `${place.city[locale]} — ${event.title[locale]}` : event.title[locale]}
              />
            );
          })}
          {showTrip &&
            trip2026.map((stop) => {
              const p = placeById[stop.placeId];
              if (!p) return null;
              return (
                <Marker
                  key={stop.id}
                  position={[p.lat, p.lng]}
                  icon={tripIcon}
                  title={`${stop.order}. ${stop.label[locale]}`}
                />
              );
            })}
          {showTrip && <Polyline positions={tripLine} pathOptions={{ color: '#e8d6b8', weight: 1.4, opacity: 0.7, dashArray: '4 7' }} />}
          {focusCoords && <FlyTo lat={focusCoords.lat} lng={focusCoords.lng} />}
        </MapContainer>
      </div>
    </>
  );
}
