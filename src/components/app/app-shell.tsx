'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, MapPinned, Users, CheckSquare, Mic, Settings, LogOut, Music2, Menu, X } from 'lucide-react';
import { getSession, logout, type MockSession } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/locaties', label: 'Locaties', icon: MapPinned },
  { href: '/app/contacten', label: 'Contacten', icon: Users },
  { href: '/app/checklist', label: 'Checklist', icon: CheckSquare },
  { href: '/app/audio', label: 'Audio', icon: Mic },
  { href: '/app/instellingen', label: 'Instellingen', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<MockSession | null>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const s = getSession();
    if (!s) {
      router.replace('/app/login');
    } else {
      setSession(s);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace('/app/login');
  };

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-sm text-muted-foreground">…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-100">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-primary/10 bg-primary text-primary-foreground lg:block">
        <SidebarContent pathname={pathname} session={session} onLogout={handleLogout} onLink={() => {}} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-primary text-primary-foreground">
            <SidebarContent pathname={pathname} session={session} onLogout={handleLogout} onLink={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-primary/10 bg-cream px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded p-2 text-primary" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/app/dashboard" className="flex items-center gap-2 text-primary">
            <Music2 className="h-4 w-4 text-accent" /> <span className="font-display font-semibold">Mahler Reise</span>
          </Link>
          <span className="w-9" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  session,
  onLogout,
  onLink,
}: {
  pathname: string;
  session: MockSession;
  onLogout: () => void;
  onLink: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-primary-foreground/10 p-5">
        <Link href="/app/dashboard" onClick={onLink} className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-semibold">Mahler Reise</span>
        </Link>
        <p className="mt-1 text-xs text-primary-foreground/60">Prospectie-team</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onLink}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-primary-foreground/85 hover:bg-primary-foreground/10'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-primary-foreground/10 p-3">
        <div className="mb-2 px-2 py-2">
          <div className="text-sm font-medium text-primary-foreground">{session.name}</div>
          <div className="truncate text-xs text-primary-foreground/60">{session.email}</div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10"
        >
          <LogOut className="h-4 w-4" /> Uitloggen
        </button>
      </div>
    </div>
  );
}
