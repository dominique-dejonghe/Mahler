import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/layout/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Music2, Briefcase } from 'lucide-react';

export default async function OverPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('over');
  const isEn = locale === 'en';

  const tomBio = isEn
    ? 'Belgian violinist and chamber musician with a particular affinity for late-Romantic repertoire. Concertmaster on Mahler 4 in Bolzano (4 September 2026) and Toblach (5 September 2026), regular guest at the Gustav Mahler Musikwochen Toblach. Co-founder of Mahler Reise — the artistic mind behind the project.'
    : 'Belgisch violist en kamermusicus met een bijzondere affiniteit voor laatromantisch repertoire. Concertmeester op Mahler 4 in Bolzano (4 september 2026) en Toblach (5 september 2026), vaste gast op de Gustav Mahler Musikwochen Toblach. Mede-oprichter van Mahler Reise — de artistieke geest achter het project.';

  const dominiqueBio = isEn
    ? 'Senior AI Project & Change Management Leader specialising in digital transformation and organisational excellence. Twenty years of experience driving complex change at VDAB, Equans, Colruyt, Brussels Airport and Euroclear. Co-founder of Andre Devaere VZW (honouring his grand-uncle, a WWI-era pianist) and board member of the internationally renowned Anima Eterna Brugge orchestra. Bridges business and art seamlessly.'
    : 'Senior AI Project & Change Management Leader, gespecialiseerd in digitale transformatie en organisatorische excellentie. Twintig jaar ervaring met complexe verandering bij VDAB, Equans, Colruyt, Brussels Airport en Euroclear. Mede-oprichter van Andre Devaere VZW (ter ere van zijn oud-oom, een WO I-pianist) en bestuurslid van het internationaal vermaarde Anima Eterna Brugge. Bouwt naadloos bruggen tussen business en kunst.';

  const visionText = isEn
    ? 'Mahler Reise is more than a luxury tour. It is a slow attempt — across ten days, eleven cities and three countries — to listen to a composer the way he wanted to be heard: in the places where he lived, in the silences he sought, in the bells he heard, the meadows he walked, the rooms in which he died. The world does not really need another biography of Gustav Mahler. It might, however, need a journey.'
    : 'Mahler Reise is meer dan een luxereis. Het is een traag opzet — tien dagen, elf steden, drie landen — om naar een componist te luisteren zoals hij zelf gehoord wilde worden: op de plekken waar hij leefde, in de stiltes die hij zocht, bij de klokken die hij hoorde, op de weilanden die hij bewandelde, in de kamers waarin hij stierf. De wereld heeft eigenlijk geen biografie meer nodig over Gustav Mahler. Wel misschien een reis.';

  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container-wide">
          <FadeIn className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
          </FadeIn>
        </div>
      </section>

      {/* Profiles */}
      <section className="py-14 md:py-20">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          {/* Tom Devaere */}
          <FadeIn>
            <Card className="h-full border-primary/10">
              <CardContent className="p-8">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
                    <Music2 className="h-9 w-9 text-accent" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary">Tom Devaere</h2>
                    <p className="text-sm text-muted-foreground">
                      {isEn ? 'Violinist · Co-founder' : 'Violist · Mede-oprichter'}
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-primary/85">{tomBio}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent">
                  <Mail className="h-4 w-4" /> tom@mahler-reise.be
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Dominique Dejonghe */}
          <FadeIn delay={100}>
            <Card className="h-full border-primary/10">
              <CardContent className="p-8">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
                    <Briefcase className="h-9 w-9 text-primary" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary">Dominique Dejonghe</h2>
                    <p className="text-sm text-muted-foreground">
                      {isEn ? 'Project lead · Co-founder' : 'Projectleider · Mede-oprichter'}
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-primary/85">{dominiqueBio}</p>
                <a
                  href="mailto:dominique.dejonghe@iutum.be"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  <Mail className="h-4 w-4" /> dominique.dejonghe@iutum.be
                </a>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-cream-200/50 py-14 md:py-20">
        <div className="container-prose">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('vision')}</h2>
            <div className="mt-3 h-0.5 w-16 bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-primary/85">{visionText}</p>
          </FadeIn>
        </div>
      </section>

      {/* Supporters */}
      <section className="py-14 md:py-20">
        <div className="container-wide">
          <FadeIn className="text-center">
            <h2 className="font-display text-2xl font-bold text-primary">{t('supporters')}</h2>
            <div className="mx-auto mt-3 h-0.5 w-12 bg-accent" />
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 items-center gap-8 md:grid-cols-4">
              {['Anima Eterna Brugge', 'Gustav Mahler Musikwochen', 'Andre Devaere VZW', 'Iutum'].map((name) => (
                <div
                  key={name}
                  className="flex h-20 items-center justify-center rounded-md border border-dashed border-primary/20 px-4 text-center font-display text-sm text-primary/60 transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {name}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
