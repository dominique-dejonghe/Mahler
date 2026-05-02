import type { Metadata, Viewport } from 'next';
import './globals.css';

// NOTE: We deliberately load Crimson Text + Playfair Display via plain <link> tags
// instead of next/font/google. The build-time font fetch from Google's servers can
// hang in restricted/sandbox environments. The CSS variables `--font-crimson` and
// `--font-playfair` are still defined (in globals.css) so Tailwind utilities work
// the same way.

export const metadata: Metadata = {
  title: 'Mahler Reise — In de voetsporen van Gustav Mahler',
  description:
    'Een culturele reis langs zestien locaties uit het leven van Gustav Mahler — van Kaliště tot Toblach. Door Tom Devaere en Dominique Dejonghe.',
  manifest: '/manifest.json',
  applicationName: 'Mahler Reise',
  appleWebApp: {
    capable: true,
    title: 'Mahler Reise',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'Mahler Reise',
    description: 'In de voetsporen van Gustav Mahler.',
    type: 'website',
    locale: 'nl_BE',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2C5F4D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
