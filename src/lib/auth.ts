// Mock authentication using localStorage.
// In prompt 2 this is replaced with Supabase Auth.

'use client';

const KEY = 'mahler.session';

export interface MockSession {
  email: string;
  name: string;
  loggedInAt: string;
}

export function getSession(): MockSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function login(email: string): MockSession {
  const name = email.split('@')[0].split('.').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const session: MockSession = { email, name, loggedInAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  localStorage.removeItem(KEY);
}
