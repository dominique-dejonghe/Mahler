import type { Brief, Bron, Correspondent } from '../../types';
import { sortBrieven } from '../../lib/brieven';
import brievenJson from './brieven.json';
import bronnenJson from './bronnen.json';
import correspondentenJson from './correspondenten.json';

export const correspondenten = correspondentenJson as Correspondent[];
export const brieven = sortBrieven(brievenJson as Brief[]);
export const bronnen = bronnenJson as Bron[];

export const correspondentById = Object.fromEntries(correspondenten.map((c) => [c.id, c]));
export const bronById = Object.fromEntries(bronnen.map((b) => [b.id, b]));
