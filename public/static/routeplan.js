// Leaflet map bootstrap for the /routeplan page.
// Reads window.__ROUTE_DATA__ (injected server-side) and paints:
//   - green circle markers for each segment endpoint
//   - a green polyline for the full route
//   - red dot markers for Tesla Superchargers with popups
//   - fits bounds to show the whole trip

(function () {
  'use strict';

  const data = window.__ROUTE_DATA__;
  const container = document.getElementById('route-map');
  if (!data || !container || !window.L) {
    if (container) container.innerHTML = '<div style="padding:2rem;color:#8b6f00">Kaart kon niet geladen worden.</div>';
    return;
  }

  const L = window.L;

  // Init map centered on Central Europe
  const map = L.map(container, {
    center: [48.5, 12.0],
    zoom: 5,
    scrollWheelZoom: false, // avoid accidental scroll-hijack; user can enable via click
  });

  // Base layer: clean, muted map that matches our cream palette
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // Re-enable scroll-zoom on click (accessibility)
  map.on('click', () => map.scrollWheelZoom.enable());

  // Collect unique location pins from all segments
  const seen = new Set();
  const locationPins = [];

  data.segments.forEach((seg) => {
    // Add fromCoords and toCoords as pins if unseen
    [
      { name: seg.from.split(' →')[0].split(' /')[0].split(' (')[0], coords: seg.fromCoords, day: seg.day, date: seg.date },
      { name: seg.to.split(' /')[0].split(' (')[0], coords: seg.toCoords, day: seg.day, date: seg.date, overnight: seg.overnight },
    ].forEach((pt) => {
      const key = pt.coords.join(',');
      if (!seen.has(key)) {
        seen.add(key);
        locationPins.push(pt);
      }
    });
  });

  // Assemble the full polyline coordinate list, honoring waypoints
  const polylineCoords = [];
  data.segments.forEach((seg, idx) => {
    // Skip rest days (fromCoords === toCoords)
    if (seg.km === 0) return;
    if (idx === 0 || polylineCoords.length === 0) {
      polylineCoords.push([seg.fromCoords[1], seg.fromCoords[0]]); // Leaflet uses [lat, lng]
    }
    if (seg.waypoints && seg.waypoints.length) {
      seg.waypoints.forEach((wp) => polylineCoords.push([wp[1], wp[0]]));
    }
    polylineCoords.push([seg.toCoords[1], seg.toCoords[0]]);
  });

  // Draw the route polyline (Mahler Reise brand green)
  const polyline = L.polyline(polylineCoords, {
    color: '#2C5F4D',
    weight: 4,
    opacity: 0.85,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: null,
  }).addTo(map);

  // Custom colored circle marker helper
  function circleMarker(latlng, color, radius) {
    return L.circleMarker(latlng, {
      radius: radius,
      color: 'white',
      weight: 2,
      fillColor: color,
      fillOpacity: 1,
    });
  }

  // Add location pins
  locationPins.forEach((pt, i) => {
    // First and last locations = terra-cotta accent, others = primary green
    const isEndpoint = i === 0 || i === locationPins.length - 1;
    const color = isEndpoint ? '#B8860B' : '#2C5F4D';
    const marker = circleMarker([pt.coords[1], pt.coords[0]], color, 8).addTo(map);
    marker.bindPopup(
      `<div style="font-family:'Playfair Display',serif;">
         <strong style="font-size:1.05em;color:#2C5F4D">${escape(pt.name)}</strong>
         ${pt.overnight ? `<div style="font-size:0.85em;color:#666;margin-top:4px"><i>Overnachting</i></div>` : ''}
       </div>`
    );
  });

  // Add Tesla Supercharger markers
  data.segments.forEach((seg) => {
    (seg.teslaStops || []).forEach((ts) => {
      const marker = L.circleMarker([ts.coords[1], ts.coords[0]], {
        radius: 6,
        color: 'white',
        weight: 2,
        fillColor: '#DC2626',
        fillOpacity: 1,
      }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'Crimson Text',serif;">
           <div style="color:#DC2626;font-weight:bold;font-size:0.85em"><i>⚡ Tesla V3 Supercharger</i></div>
           <strong style="font-size:1em;color:#2C5F4D">${escape(ts.name)}</strong>
           <div style="font-size:0.85em;margin-top:4px">${ts.kW} kW · ${ts.minutes} min stop</div>
           <div style="font-size:0.8em;color:#666;margin-top:2px">Dag ${seg.day} — ${seg.km} km</div>
         </div>`
      );
    });
  });

  // Fit map bounds to the full route
  if (polylineCoords.length > 0) {
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }

  // Add distance labels along each leg (small floating text at midpoint)
  data.segments.forEach((seg) => {
    if (seg.km === 0) return;
    const midLat = (seg.fromCoords[1] + seg.toCoords[1]) / 2;
    const midLng = (seg.fromCoords[0] + seg.toCoords[0]) / 2;
    L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: 'km-label',
        html: `<div style="background:#B8860B;color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;box-shadow:0 2px 4px rgba(0,0,0,0.3);white-space:nowrap;font-family:'Crimson Text',serif">Dag ${seg.day} · ${seg.km} km</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, 10],
      }),
      interactive: false,
      keyboard: false,
    }).addTo(map);
  });

  function escape(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }
})();
