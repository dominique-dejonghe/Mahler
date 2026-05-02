'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, Music2 } from 'lucide-react';
import { LocaleSwitcher } from './locale-switcher';
import { cn } from '@/lib/utils';

const NAV_KEYS = [
  { key: 'reis', href: '/reis' },
  { key: 'dagboek', href: '/dagboek' },
  { key: 'encyclopedie', href: '/encyclopedie' },
  { key: 'concerten', href: '/concerten' },
  { key: 'over', href: '/over' },
  { key: 'contact', href: '/contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setOpen(false)}>
          <Music2 className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <span className="font-display text-xl font-semibold tracking-tight">Mahler Reise</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_KEYS.map(({ key, href }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  'rounded px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-accent' : 'text-primary hover:text-accent'
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LocaleSwitcher />
          </div>
          <Link
            href="/app/login"
            className="hidden rounded-md border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground lg:inline-flex"
          >
            {t('login')}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded p-2 text-primary"
            aria-label={t('menu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-primary/10 bg-cream">
          <nav className="container-wide flex flex-col py-4">
            {NAV_KEYS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="py-2 font-medium text-primary"
              >
                {t(key)}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-primary/10 pt-3 mt-2">
              <LocaleSwitcher />
              <Link
                href="/app/login"
                onClick={() => setOpen(false)}
                className="rounded-md border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {t('login')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
