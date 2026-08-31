import type { AtlasEvent } from '../types';

/** Alma / family / conversion — only visible when “dieper” is on. */
export const deepEvents: AtlasEvent[] = [
  {
    id: 'deep-conversion-1897',
    dateStart: '1897-02-23',
    datePrecision: 'day',
    placeId: 'vienna',
    type: 'life',
    deep: true,
    season: 'winter',
    title: {
      nl: 'Doop (Kleine Michaelerkirche)',
      en: 'Baptism (Kleine Michaelerkirche)',
      de: 'Taufe (Kleine Michaelerkirche)',
      cs: 'Křest (Kleine Michaelerkirche)',
    },
    summary: {
      nl: '23 februari 1897, Wenen. Formele overgang tot het katholicisme, voor de Hofoper.',
      en: '23 February 1897, Vienna. Formal conversion to Catholicism, ahead of the Hofoper.',
      de: '23. Februar 1897, Wien. Formeller Übertritt zum Katholizismus, vor der Hofoper.',
      cs: '23. února 1897, Vídeň. Formální přestup ke katolictví, před dvorní operou.',
    },
    extra: {
      nl: 'Geen geloofstraktaat hier. Wel een voorwaarde van het huis.',
      en: 'No tract on faith here. A condition of the house.',
      de: 'Keine Glaubensschrift hier. Eine Bedingung des Hauses.',
      cs: 'Žádný traktát o víře. Podmínka domu.',
    },
    source: {
      label: 'Standard biographies (conversion 23 Feb 1897, Vienna); mahler.cz career note',
      url: 'https://www.mahler.cz/en/about-gustav-mahler/conductor-and-opera-director',
    },
  },
  {
    id: 'deep-alma-1902',
    dateStart: '1902-03-09',
    datePrecision: 'day',
    placeId: 'vienna',
    type: 'life',
    deep: true,
    title: {
      nl: 'Huwelijk met Alma Schindler',
      en: 'Marriage to Alma Schindler',
      de: 'Hochzeit mit Alma Schindler',
      cs: 'Sňatek s Almou Schindlerovou',
    },
    summary: {
      nl: '9 maart 1902, Wenen. Karlskirche.',
      en: '9 March 1902, Vienna. Karlskirche.',
      de: '9. März 1902, Wien. Karlskirche.',
      cs: '9. března 1902, Vídeň. Karlskirche.',
    },
    extra: {
      nl: 'Niet de defaultvertelling. Zet “dieper” uit als je alleen de posten wilt.',
      en: 'Not the default narration. Turn “deeper” off if you only want the posts.',
      de: 'Nicht die Standarderzählung. „Tiefer“ aus, wenn Sie nur die Stellen wollen.',
      cs: 'Ne výchozí vyprávění. Vypněte „hlouběji“, chcete-li jen místa.',
    },
    source: { label: 'Standard biographies (wedding 9 March 1902, Karlskirche)', url: 'https://mahlerfoundation.org/' },
  },
  {
    id: 'deep-maria-1907',
    dateStart: '1907-07-12',
    datePrecision: 'day',
    placeId: 'maiernigg',
    type: 'life',
    deep: true,
    season: 'summer',
    title: {
      nl: 'Dood van Maria Anna',
      en: 'Death of Maria Anna',
      de: 'Tod Maria Annas',
      cs: 'Smrt Marie Anny',
    },
    summary: {
      nl: '12 juli 1907, Maiernigg. Dochter Maria (“Putzi”), vier jaar, difterie.',
      en: '12 July 1907, Maiernigg. Daughter Maria (“Putzi”), four, diphtheria.',
      de: '12. Juli 1907, Maiernigg. Tochter Maria („Putzi“), vier, Diphtherie.',
      cs: '12. července 1907, Maiernigg. Dcera Marie („Putzi“), čtyři roky, záškrt.',
    },
    extra: {
      nl: 'Daarna verlaat het gezin de villa. Geen terugkeer naar deze hut.',
      en: 'Afterwards the family leaves the villa. No return to this hut.',
      de: 'Danach verlässt die Familie die Villa. Keine Rückkehr in diese Hütte.',
      cs: 'Poté rodina vilu opouští. Do této chaty se nevrací.',
    },
    source: { label: 'Mahler Foundation — Maiernigg / Year 1907', url: 'https://mahlerfoundation.org/' },
  },
];
