import { describe, expect, it } from 'vitest';
import { cartoDarkTileUrl, cartoTileKey } from './carto';

describe('Carto dark tiles', () => {
  it('appends a key query so raster tiles are not watermarked', () => {
    const url = cartoDarkTileUrl();
    expect(url).toMatch(/^https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png\?key=/);
    expect(url.includes(cartoTileKey())).toBe(true);
    expect(url.endsWith(`?key=${cartoTileKey()}`)).toBe(true);
  });
});
