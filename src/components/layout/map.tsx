'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

export interface MapPin {
  id: string | number;
  coordinates: [number, number];
  title: string;
  subtitle?: string;
  href?: string;
  color?: string;
}

interface MahlerMapProps {
  pins: MapPin[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  fitToPins?: boolean;
}

export function MahlerMap({
  pins,
  center = [13.5, 48.5],
  zoom = 4.2,
  height = '500px',
  className = '',
  fitToPins = true,
}: MahlerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hasToken, setHasToken] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token || token.startsWith('pk.placeholder')) {
      setHasToken(false);
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom,
      attributionControl: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      pins.forEach((pin) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="background:${pin.color || '#B8860B'};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
          `<div style="font-family:'Crimson Text',serif;padding:6px 8px;min-width:160px;">
            <div style="font-weight:600;color:#2C5F4D;font-size:14px;">${pin.title}</div>
            ${pin.subtitle ? `<div style="color:#666;font-size:12px;margin-top:2px;">${pin.subtitle}</div>` : ''}
            ${pin.href ? `<a href="${pin.href}" style="color:#B8860B;font-size:12px;margin-top:4px;display:inline-block;text-decoration:underline;">→ Meer</a>` : ''}
          </div>`
        );

        new mapboxgl.Marker(el).setLngLat(pin.coordinates).setPopup(popup).addTo(map);
      });

      if (fitToPins && pins.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        pins.forEach((p) => bounds.extend(p.coordinates));
        map.fitBounds(bounds, { padding: 60, maxZoom: 7, duration: 0 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasToken) {
    return (
      <div
        className={`relative overflow-hidden rounded-md border bg-gradient-to-br from-primary-50 to-cream ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <MapPin className="h-10 w-10 text-accent" strokeWidth={1.5} />
          <p className="font-display text-lg text-primary">Kaart placeholder</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Voeg een Mapbox-token toe in <code className="rounded bg-primary/10 px-1.5 py-0.5 text-xs">.env.local</code> om de interactieve kaart met {pins.length} locatie{pins.length === 1 ? '' : 's'} te zien.
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-primary/80">
            {pins.slice(0, 8).map((p) => (
              <li key={p.id} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> {p.title}
              </li>
            ))}
            {pins.length > 8 && <li className="col-span-2 text-muted-foreground">…en {pins.length - 8} meer</li>}
          </ul>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={`rounded-md overflow-hidden border ${className}`} style={{ height }} />;
}
