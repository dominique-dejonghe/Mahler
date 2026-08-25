// Shared HTML shell + Header + Footer for every page.
// Edge-runtime safe (pure JSX, no client deps in SSR path).

import type { Locale } from '../lib/data';
import { messages, localePath } from '../lib/i18n';

interface LayoutProps {
  locale: Locale;
  title: string;
  description?: string;
  pathname: string; // e.g. '/reis' (without locale prefix)
  children: any;
  ogImage?: string;
}

export function Layout({ locale, title, description, pathname, children, ogImage }: LayoutProps) {
  const t = messages[locale];
  const desc =
    description ??
    (locale === 'nl'
      ? 'Een culturele reis in de voetsporen van Gustav Mahler — zestien locaties, drie landen, één componist.'
      : 'A cultural journey in the footsteps of Gustav Mahler — sixteen locations, three countries, one composer.');

  return (
    <html lang={locale}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="theme-color" content="#2C5F4D" />
        <link rel="manifest" href="/static/manifest.json" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32.png" />
        <link rel="apple-touch-icon" href="/static/icons/apple-touch-icon.png" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale === 'nl' ? 'nl_BE' : 'en_GB'} />
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Tailwind via CDN with brand config */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: { DEFAULT: '#2C5F4D', 50:'#EAF2EE', 100:'#D5E5DD', 200:'#ABCBBC', 300:'#82B19B', 400:'#58977A', 500:'#2C5F4D', 600:'#234C3E', 700:'#1A392E', 800:'#11261F', 900:'#091410' },
                      accent:  { DEFAULT: '#B8860B', 50:'#FBF3DC', 100:'#F7E8B9', 200:'#EFD173', 300:'#E7BA2D', 400:'#CFA118', 500:'#B8860B', 600:'#936B09', 700:'#6E5106', 800:'#4A3604', 900:'#291E02' },
                      cream:   { DEFAULT: '#FAF7F0', 50:'#FFFFFF', 100:'#FAF7F0', 200:'#F2EBD9' },
                    },
                    fontFamily: {
                      serif: ['"Crimson Text"', 'Georgia', 'serif'],
                      display: ['"Playfair Display"', 'Georgia', 'serif'],
                    },
                  }
                }
              }
            `,
          }}
        ></script>

        {/* Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />

        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body class="min-h-screen bg-cream-100 font-serif text-primary-900 antialiased">
        <Header locale={locale} pathname={pathname} />
        <main class="min-h-[60vh]">{children}</main>
        <Footer locale={locale} />

        {/* Mobile menu + locale switcher behaviour */}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  );
}

function Header({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = messages[locale];
  const navItems: { key: keyof typeof t.nav; href: string }[] = [
    { key: 'reis', href: '/reis' },
    { key: 'routeplan', href: '/routeplan' },
    { key: 'dagboek', href: '/dagboek' },
    { key: 'encyclopedie', href: '/encyclopedie' },
    { key: 'concerten', href: '/concerten' },
    { key: 'over', href: '/over' },
    { key: 'contact', href: '/contact' },
  ];

  // Build the alternate locale URL preserving pathname
  const altLocale: Locale = locale === 'nl' ? 'en' : 'nl';
  const altHref = localePath(altLocale, pathname);

  return (
    <header class="sticky top-0 z-40 border-b border-primary-100 bg-cream-100/85 backdrop-blur supports-[backdrop-filter]:bg-cream-100/70">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <a href={localePath(locale, '/')} class="flex items-center gap-2 font-display text-xl font-bold text-primary-700">
          <i class="fas fa-music text-accent"></i>
          <span>Mahler Reise</span>
        </a>

        <nav class="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => {
            const href = localePath(locale, item.href);
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <a
                href={href}
                class={
                  'transition-colors hover:text-primary ' +
                  (isActive ? 'text-primary font-semibold' : 'text-primary-700/80')
                }
              >
                {t.nav[item.key]}
              </a>
            );
          })}
        </nav>

        <div class="flex items-center gap-3">
          <a
            href={altHref}
            class="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-700/70 hover:text-primary"
            aria-label={`Switch to ${altLocale.toUpperCase()}`}
          >
            <i class="fas fa-globe"></i>
            <span>{altLocale.toUpperCase()}</span>
          </a>
          <a
            href="/app/login"
            class="hidden sm:inline-flex items-center gap-2 rounded-md border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
          >
            <i class="fas fa-lock"></i> {t.nav.login}
          </a>
          <button
            id="mobile-menu-toggle"
            type="button"
            class="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary-200 text-primary-700"
            aria-label={t.nav.menu}
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        class="hidden md:hidden border-t border-primary-100 bg-cream-100"
      >
        <nav class="container mx-auto flex flex-col px-4 py-3 text-sm">
          {navItems.map((item) => (
            <a
              href={localePath(locale, item.href)}
              class="py-2 text-primary-700 hover:text-primary"
            >
              {t.nav[item.key]}
            </a>
          ))}
          <a href={altHref} class="py-2 text-primary-700/70">
            <i class="fas fa-globe mr-2"></i>
            {altLocale.toUpperCase()}
          </a>
          <a href="/app/login" class="py-2 font-semibold text-primary">
            <i class="fas fa-lock mr-2"></i>
            {t.nav.login}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const year = new Date().getFullYear();
  return (
    <footer class="mt-20 border-t border-primary-100 bg-primary-700 text-cream-100">
      <div class="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div class="flex items-center gap-2 font-display text-xl font-bold">
            <i class="fas fa-music text-accent"></i>
            <span>Mahler Reise</span>
          </div>
          <p class="mt-3 text-sm text-cream-100/80">{t.footer.tagline}</p>
          <p class="mt-4 text-sm">
            <a href="mailto:dominique.dejonghe@iutum.be" class="hover:text-accent">
              <i class="fas fa-envelope mr-2"></i>dominique.dejonghe@iutum.be
            </a>
          </p>
        </div>

        <div>
          <h3 class="font-display text-lg font-semibold mb-3">{t.footer.navigation}</h3>
          <ul class="space-y-2 text-sm">
            <li><a class="hover:text-accent" href={localePath(locale, '/reis')}>{t.nav.reis}</a></li>
            <li><a class="hover:text-accent" href={localePath(locale, '/dagboek')}>{t.nav.dagboek}</a></li>
            <li><a class="hover:text-accent" href={localePath(locale, '/encyclopedie')}>{t.nav.encyclopedie}</a></li>
            <li><a class="hover:text-accent" href={localePath(locale, '/concerten')}>{t.nav.concerten}</a></li>
            <li><a class="hover:text-accent" href={localePath(locale, '/over')}>{t.nav.over}</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-lg font-semibold mb-3">{t.footer.legal}</h3>
          <ul class="space-y-2 text-sm">
            <li><a class="hover:text-accent" href="#">{t.footer.privacy}</a></li>
            <li><a class="hover:text-accent" href="#">{t.footer.terms}</a></li>
            <li><a class="hover:text-accent" href="#">{t.footer.cookies}</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-primary-600 py-4 text-center text-xs text-cream-100/70">
        © {year} Mahler Reise · Tom Devaere &amp; Dominique Dejonghe · {t.footer.rights}
      </div>
    </footer>
  );
}

/**
 * Minimal layout for the private /app/* area — no public header, separate styling.
 */
export function AppLayout({
  title,
  pathname,
  children,
}: {
  title: string;
  pathname: string;
  children: any;
}) {
  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: 'fa-gauge' },
    { href: '/app/locaties', label: 'Locaties', icon: 'fa-map-location-dot' },
    { href: '/app/contacten', label: 'Contacten', icon: 'fa-address-book' },
    { href: '/app/checklist', label: 'Checklist', icon: 'fa-list-check' },
    { href: '/app/audio', label: 'Audio', icon: 'fa-microphone' },
    { href: '/app/instellingen', label: 'Instellingen', icon: 'fa-gear' },
  ];

  const isLogin = pathname === '/app/login';

  return (
    <html lang="nl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="theme-color" content="#2C5F4D" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="manifest" href="/static/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: { extend: {
                  colors: {
                    primary: { DEFAULT:'#2C5F4D', 50:'#EAF2EE', 100:'#D5E5DD', 200:'#ABCBBC', 300:'#82B19B', 600:'#234C3E', 700:'#1A392E' },
                    accent:  { DEFAULT:'#B8860B', 100:'#F7E8B9', 500:'#B8860B' },
                    cream:   { 100:'#FAF7F0', 200:'#F2EBD9' },
                  },
                  fontFamily: { serif:['"Crimson Text"','serif'], display:['"Playfair Display"','serif'] },
                } }
              }
            `,
          }}
        ></script>
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body class="min-h-screen bg-cream-100 font-serif text-primary-900">
        {isLogin ? (
          <div class="min-h-screen flex items-center justify-center px-4">{children}</div>
        ) : (
          <div class="min-h-screen flex">
            <aside class="hidden md:flex w-60 flex-col bg-primary-700 text-cream-100 p-4">
              <a href="/app/dashboard" class="flex items-center gap-2 mb-8 font-display text-xl">
                <i class="fas fa-music text-accent"></i>
                <span>Mahler Reise</span>
              </a>
              <nav class="space-y-1 text-sm flex-1">
                {navItems.map((n) => {
                  const active = pathname === n.href || pathname.startsWith(n.href + '/');
                  return (
                    <a
                      href={n.href}
                      class={
                        'flex items-center gap-3 rounded-md px-3 py-2 transition ' +
                        (active
                          ? 'bg-primary-600 text-cream-100'
                          : 'text-cream-100/80 hover:bg-primary-600/60')
                      }
                    >
                      <i class={`fas ${n.icon} w-4`}></i>
                      <span>{n.label}</span>
                    </a>
                  );
                })}
              </nav>
              <div class="text-xs text-cream-100/60 mt-4">
                <a href="/" class="hover:text-accent">← Naar website</a>
              </div>
              <button
                id="logout-btn"
                class="mt-3 text-xs text-cream-100/70 hover:text-accent text-left"
              >
                <i class="fas fa-right-from-bracket mr-2"></i>Uitloggen
              </button>
            </aside>
            <div class="flex-1">
              <header class="md:hidden flex items-center justify-between border-b border-primary-100 bg-cream-100 px-4 py-3">
                <a href="/app/dashboard" class="font-display font-bold text-primary">
                  <i class="fas fa-music mr-2 text-accent"></i>Mahler Reise
                </a>
                <a href="/" class="text-xs text-primary-700/70">← Site</a>
              </header>
              <div class="p-6 md:p-10">{children}</div>
            </div>
          </div>
        )}
        <script src="/static/app.js" defer></script>
        <script src="/static/auth.js" defer></script>
      </body>
    </html>
  );
}
