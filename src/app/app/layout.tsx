import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mahler Reise — Privé team',
  description: 'Privé toepassing voor het prospectie-team.',
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
