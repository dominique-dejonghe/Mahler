'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function AppRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getSession() ? '/app/dashboard' : '/app/login');
  }, [router]);
  return null;
}
