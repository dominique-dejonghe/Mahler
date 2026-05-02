import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Music2, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-display text-xl font-semibold">Mahler Reise</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80">
            {t('tagline')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/80">
            <Mail className="h-4 w-4" />
            <a href="mailto:dominique.dejonghe@iutum.be" className="hover:text-accent">
              dominique.dejonghe@iutum.be
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Navigatie
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/reis" className="text-primary-foreground/80 hover:text-accent">{tNav('reis')}</Link></li>
            <li><Link href="/dagboek" className="text-primary-foreground/80 hover:text-accent">{tNav('dagboek')}</Link></li>
            <li><Link href="/encyclopedie" className="text-primary-foreground/80 hover:text-accent">{tNav('encyclopedie')}</Link></li>
            <li><Link href="/concerten" className="text-primary-foreground/80 hover:text-accent">{tNav('concerten')}</Link></li>
            <li><Link href="/over" className="text-primary-foreground/80 hover:text-accent">{tNav('over')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
            {t('legal')}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="text-primary-foreground/80 hover:text-accent">{t('privacy')}</a></li>
            <li><a href="#" className="text-primary-foreground/80 hover:text-accent">{t('terms')}</a></li>
            <li><a href="#" className="text-primary-foreground/80 hover:text-accent">{t('cookies')}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {year} Mahler Reise — {t('rights')}.</span>
          <span>Tom Devaere · Dominique Dejonghe</span>
        </div>
      </div>
    </footer>
  );
}
