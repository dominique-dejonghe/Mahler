// Leaflet map bootstrap for the /routeplan page.
// Reads window.__ROUTE_DATA__ (injected server-side) and paints:
//   - numbered day markers with full dagoverzicht popups
//   - a green polyline per driving leg (clickable)
//   - red dot markers for Tesla Superchargers with popups
//   - rest-day pins at overnight locations
//   - table-row ↔ map sync
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
  const labels = data.labels || {
    day: 'Dag',
    overnight: 'Overnachting',
    rest: 'rustdag',
    time: 'Rijtijd',
    tesla: 'Tesla Supercharger',
  };

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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  function cleanName(name) {
    return String(name || '')
      .split(' →')[0]
      .split(' /')[0]
      .split(' (')[0]
      .split(' —')[0]
      .trim();
  }

  function coordKey(coords) {
    return coords[0].toFixed(3) + ',' + coords[1].toFixed(3);
  }

  function dayPopupHtml(seg) {
    const isRest = seg.km === 0 || seg.time === '—';
    const teslaHtml = (seg.teslaStops || [])
      .map(
        (ts) =>
          `<div class="rp-popup-tesla">⚡ ${escapeHtml(ts.name)} · ${ts.kW} kW · ${ts.minutes} min</div>`
      )
      .join('');

    return `<div class="rp-popup">
      <div class="rp-popup-kicker">${escapeHtml(labels.day)} ${seg.day}</div>
      <div class="rp-popup-date">${escapeHtml(seg.dateLabel || seg.date)}</div>
      <div class="rp-popup-leg">${escapeHtml(seg.from)} → ${escapeHtml(seg.to)}</div>
      ${seg.note ? `<p class="rp-popup-note">${escapeHtml(seg.note)}</p>` : ''}
      <div class="rp-popup-meta">
        ${
          isRest
            ? `<span class="rp-popup-rest">${escapeHtml(labels.rest)}</span>`
            : `<span>${seg.km} km</span><span>${escapeHtml(seg.time)}</span>`
        }
        ${seg.overnight ? `<span>${escapeHtml(labels.overnight)}: ${escapeHtml(seg.overnight)}</span>` : ''}
      </div>
      ${teslaHtml}
    </div>`;
  }

  function locationPopupHtml(loc) {
    const daysHtml = loc.days.map(dayPopupHtml).join('<hr class="rp-popup-hr">');
    return `<div class="rp-popup-stack">
      <strong class="rp-popup-place">${escapeHtml(loc.name)}</strong>
      ${daysHtml}
    </div>`;
  }

  // Group overnight / destination locations, collecting every day that ends there
  const locations = new Map();

  function upsertLocation(name, coords, isHome) {
    const key = coordKey(coords);
    if (!locations.has(key)) {
      locations.set(key, { name: cleanName(name), coords, days: [], isHome: !!isHome });
    }
    const loc = locations.get(key);
    if (isHome) loc.isHome = true;
    return loc;
  }

  const first = data.segments[0];
  if (first) upsertLocation(first.from, first.fromCoords, true);

  data.segments.forEach((seg) => {
    const loc = upsertLocation(seg.to, seg.toCoords, false);
    loc.days.push(seg);
    if (seg.overnight && /thuis|home|sint-amands/i.test(seg.overnight)) loc.isHome = true;
  });

  // Assemble per-leg polylines (clickable) and the combined bounds path
  const allPolylineCoords = [];
  const dayLayers = {}; // day number → { line?, marker, label? }

  data.segments.forEach((seg) => {
    if (seg.km === 0) return;
    const coords = [];
    coords.push([seg.fromCoords[1], seg.fromCoords[0]]);
    (seg.waypoints || []).forEach((wp) => coords.push([wp[1], wp[0]]));
    coords.push([seg.toCoords[1], seg.toCoords[0]]);
    coords.forEach((c) => allPolylineCoords.push(c));

    const line = L.polyline(coords, {
      color: '#2C5F4D',
      weight: 4,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    line.bindPopup(dayPopupHtml(seg), { maxWidth: 320 });
    line.on('popupopen', () => highlightDay(seg.day, false));
    if (!dayLayers[seg.day]) dayLayers[seg.day] = {};
    dayLayers[seg.day].line = line;
    dayLayers[seg.day].latlngs = coords;
  });

  // Numbered location markers with full dagoverzicht popups
  locations.forEach((loc) => {
    const days = loc.days;
    const numbers = days.map((d) => d.day);
    const badge =
      numbers.length === 0
        ? '•'
        : numbers.length === 1
          ? String(numbers[0])
          : numbers[0] + '–' + numbers[numbers.length - 1];
    const isHome = loc.isHome || numbers.length === 0;
    const bg = isHome ? '#B8860B' : '#2C5F4D';
    const html = days.length ? locationPopupHtml(loc) : `<div class="rp-popup"><strong class="rp-popup-place">${escapeHtml(loc.name)}</strong></div>`;

    const marker = L.marker([loc.coords[1], loc.coords[0]], {
      icon: L.divIcon({
        className: 'rp-day-icon',
        html: `<div class="rp-day-badge" style="background:${bg}">${escapeHtml(badge)}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      }),
      keyboard: true,
      title: loc.name,
    }).addTo(map);

    marker.bindPopup(html, { maxWidth: 320 });
    marker.on('popupopen', () => {
      if (days.length) highlightDay(days[days.length - 1].day, false);
    });

    days.forEach((seg) => {
      if (!dayLayers[seg.day]) dayLayers[seg.day] = {};
      dayLayers[seg.day].marker = marker;
      dayLayers[seg.day].latlng = [loc.coords[1], loc.coords[0]];
    });

    if (numbers.length === 0) {
      // Start/home pin with no overnight-day of its own still needs a focus point
      dayLayers._home = { marker, latlng: [loc.coords[1], loc.coords[0]] };
    }
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
        `<div class="rp-popup">
           <div class="rp-popup-tesla">${escapeHtml(labels.tesla)}</div>
           <strong class="rp-popup-place">${escapeHtml(ts.name)}</strong>
           <div class="rp-popup-meta">
             <span>${ts.kW} kW</span>
             <span>${ts.minutes} min</span>
             <span>${escapeHtml(labels.day)} ${seg.day} — ${seg.km} km</span>
           </div>
           ${seg.dateLabel ? `<div class="rp-popup-date" style="margin-top:6px">${escapeHtml(seg.dateLabel)}</div>` : ''}
         </div>`,
        { maxWidth: 280 }
      );
      marker.on('popupopen', () => highlightDay(seg.day, false));
    });
  });

  // Distance / rest labels along each leg — clickable, with full day popup
  const restOffset = {};
  data.segments.forEach((seg) => {
    const isRest = seg.km === 0 || seg.time === '—';
    let lat;
    let lng;
    if (isRest) {
      const key = coordKey(seg.toCoords);
      const n = restOffset[key] || 0;
      restOffset[key] = n + 1;
      lat = seg.toCoords[1] + 0.18 + n * 0.22;
      lng = seg.toCoords[0];
    } else {
      lat = (seg.fromCoords[1] + seg.toCoords[1]) / 2;
      lng = (seg.fromCoords[0] + seg.toCoords[0]) / 2;
    }

    const labelText = isRest
      ? `${labels.day} ${seg.day} · ${labels.rest}`
      : `${labels.day} ${seg.day} · ${seg.km} km · ${seg.time}`;

    const label = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'km-label',
        html: `<span class="rp-km-chip${isRest ? ' rp-km-chip--rest' : ''}">${escapeHtml(labelText)}</span>`,
        iconSize: [190, 24],
        iconAnchor: [95, 12],
      }),
      keyboard: true,
      title: labelText,
    }).addTo(map);

    label.bindPopup(dayPopupHtml(seg), { maxWidth: 320 });
    label.on('popupopen', () => highlightDay(seg.day, false));
    if (!dayLayers[seg.day]) dayLayers[seg.day] = {};
    dayLayers[seg.day].label = label;
    if (!dayLayers[seg.day].latlng) dayLayers[seg.day].latlng = [lat, lng];
  });

  // Fit map bounds to the full route
  if (allPolylineCoords.length > 0) {
    map.fitBounds(L.latLngBounds(allPolylineCoords), { padding: [40, 40] });
  }

  function highlightDay(day, pan) {
    document.querySelectorAll('[data-route-day]').forEach((el) => {
      el.classList.toggle('route-day-active', Number(el.getAttribute('data-route-day')) === Number(day));
    });
    if (!pan) return;
    const layer = dayLayers[day];
    if (!layer) return;
    if (layer.line) {
      map.fitBounds(layer.line.getBounds(), { padding: [60, 60], maxZoom: 8 });
    } else if (layer.latlng) {
      map.setView(layer.latlng, 8, { animate: true });
    }
  }

  function focusDay(day) {
    highlightDay(day, true);
    const layer = dayLayers[day];
    if (!layer) return;
    const opener = layer.label || layer.marker || layer.line;
    if (opener && opener.openPopup) {
      // Open after pan so Leaflet positions the popup correctly
      setTimeout(() => opener.openPopup(), 280);
    }
  }

  document.querySelectorAll('[data-route-day]').forEach((row) => {
    row.addEventListener('click', () => {
      const day = Number(row.getAttribute('data-route-day'));
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusDay(day);
    });
    row.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        row.click();
      }
    });
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
  });
})();
