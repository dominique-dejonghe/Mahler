import type { Work } from '../types';

export const works: Work[] = [
  { id: '1', title: { nl: 'Symfonie nr. 1', en: 'Symphony No. 1', de: 'Sinfonie Nr. 1', cs: 'Symfonie č. 1' }, composed: '1887–1888, rev. tot 1910' },
  { id: '2', title: { nl: 'Symfonie nr. 2', en: 'Symphony No. 2', de: 'Sinfonie Nr. 2', cs: 'Symfonie č. 2' }, composed: '1888–1894' },
  { id: '3', title: { nl: 'Symfonie nr. 3', en: 'Symphony No. 3', de: 'Sinfonie Nr. 3', cs: 'Symfonie č. 3' }, composed: '1893–1896' },
  { id: '4', title: { nl: 'Symfonie nr. 4', en: 'Symphony No. 4', de: 'Sinfonie Nr. 4', cs: 'Symfonie č. 4' }, composed: '1899–1901' },
  { id: '5', title: { nl: 'Symfonie nr. 5', en: 'Symphony No. 5', de: 'Sinfonie Nr. 5', cs: 'Symfonie č. 5' }, composed: '1901–1902' },
  { id: '6', title: { nl: 'Symfonie nr. 6', en: 'Symphony No. 6', de: 'Sinfonie Nr. 6', cs: 'Symfonie č. 6' }, composed: '1903–1905' },
  { id: '7', title: { nl: 'Symfonie nr. 7', en: 'Symphony No. 7', de: 'Sinfonie Nr. 7', cs: 'Symfonie č. 7' }, composed: '1904–1905' },
  { id: '8', title: { nl: 'Symfonie nr. 8', en: 'Symphony No. 8', de: 'Sinfonie Nr. 8', cs: 'Symfonie č. 8' }, composed: '1906–1907' },
  { id: 'lied', title: { nl: 'Das Lied von der Erde', en: 'Das Lied von der Erde', de: 'Das Lied von der Erde', cs: 'Píseň o zemi' }, composed: '1908–1909' },
  { id: '9', title: { nl: 'Symfonie nr. 9', en: 'Symphony No. 9', de: 'Sinfonie Nr. 9', cs: 'Symfonie č. 9' }, composed: '1909–1910' },
  { id: '10', title: { nl: 'Symfonie nr. 10', en: 'Symphony No. 10', de: 'Sinfonie Nr. 10', cs: 'Symfonie č. 10' }, composed: '1910 (onvoltooid)', unfinished: true },
];

export const workById = Object.fromEntries(works.map((w) => [w.id, w]));
