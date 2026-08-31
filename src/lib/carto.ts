/** Carto raster tiles need `?key=` or they stamp API KEY REQUIRED. */

const CARTO_FALLBACK_KEY = 'cb1_2naf_1_5d8ef32bbb46cf30a9b6f0c3';

export function cartoTileKey(): string {
  const fromEnv = import.meta.env.VITE_CARTO_API_KEY;
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : CARTO_FALLBACK_KEY;
}

export function cartoDarkTileUrl(): string {
  return `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoTileKey()}`;
}
