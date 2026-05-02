'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: 'nl' | 'en') => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className="inline-flex items-center gap-1 text-sm">
      <Globe className="mr-1 h-4 w-4 text-primary/60" />
      <button
        onClick={() => switchTo('nl')}
        disabled={isPending}
        className={`rounded px-2 py-0.5 transition-colors ${
          locale === 'nl' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary/10'
        }`}
        aria-label="Nederlands"
      >
        NL
      </button>
      <span className="text-primary/30">·</span>
      <button
        onClick={() => switchTo('en')}
        disabled={isPending}
        className={`rounded px-2 py-0.5 transition-colors ${
          locale === 'en' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary/10'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
