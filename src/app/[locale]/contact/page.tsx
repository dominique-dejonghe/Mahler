import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/layout/fade-in';
import { ContactForm } from './_form';
import { Mail, MapPin } from 'lucide-react';

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const isEn = locale === 'en';

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

      <section className="py-14 md:py-20">
        <div className="container-wide grid gap-10 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <ContactForm />
          </FadeIn>

          <FadeIn delay={100}>
            <div className="rounded-md border bg-card p-7">
              <h3 className="font-display text-lg font-semibold text-primary">
                {isEn ? 'Direct contact' : 'Direct contact'}
              </h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <div className="font-medium text-primary">Dominique Dejonghe</div>
                  <a href="mailto:dominique.dejonghe@iutum.be" className="mt-1 inline-flex items-center gap-1.5 text-accent hover:underline">
                    <Mail className="h-4 w-4" /> dominique.dejonghe@iutum.be
                  </a>
                </li>
                <li>
                  <div className="font-medium text-primary">Tom Devaere</div>
                  <a href="mailto:tom@mahler-reise.be" className="mt-1 inline-flex items-center gap-1.5 text-accent hover:underline">
                    <Mail className="h-4 w-4" /> tom@mahler-reise.be
                  </a>
                </li>
                <li className="flex items-start gap-1.5 pt-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{isEn ? 'Belgium · responses within 48h' : 'België · antwoord binnen 48u'}</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
