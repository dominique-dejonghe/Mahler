import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getJournalEntries, getJournalEntryBySlug } from '@/lib/data';
import { FadeIn } from '@/components/layout/fade-in';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';

// Render on-demand: avoids per-slug × per-locale SSG fan-out during build.
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const entries = await getJournalEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export default async function DagboekDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const entry = await getJournalEntryBySlug(params.slug);
  if (!entry) notFound();

  return (
    <article>
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <img src={entry.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="container-wide relative flex h-full flex-col justify-end pb-10 text-primary-foreground">
          <FadeIn>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(entry.date).toLocaleDateString(isEn ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                <MapPin className="mr-1 h-3 w-3" /> {entry.location}, {entry.country}
              </Badge>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              {isEn ? entry.title.en : entry.title.nl}
            </h1>
            <p className="mt-3 text-sm text-primary-foreground/90">
              {isEn ? 'by' : 'door'} <strong>{entry.author}</strong>
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container-prose py-12 md:py-16">
        <FadeIn>
          <Link href="/dagboek" className="mb-8 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> {isEn ? 'Back to journal' : 'Terug naar dagboek'}
          </Link>
          <p className="text-xl italic leading-relaxed text-primary/80">
            {isEn ? entry.excerpt.en : entry.excerpt.nl}
          </p>
          <div className="my-6 h-px w-16 bg-accent" />
          <div className="prose prose-lg max-w-none font-serif leading-relaxed text-primary/85">
            {(isEn ? entry.body.en : entry.body.nl).split('\n').map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </article>
  );
}
