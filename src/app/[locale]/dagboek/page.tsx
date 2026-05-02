import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getJournalEntries } from '@/lib/data';
import { FadeIn } from '@/components/layout/fade-in';
import { DagboekClient } from './_client';

export default async function DagboekPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('dagboek');
  const entries = await getJournalEntries();

  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container-wide">
          <FadeIn className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
            <p className="mt-3 text-lg text-primary-foreground/90">{t('subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <DagboekClient entries={entries} locale={locale} />
    </div>
  );
}
