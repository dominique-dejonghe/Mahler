'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Music2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSession, login } from '@/lib/auth';

const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    setHydrated(true);
    if (getSession()) router.replace('/app/dashboard');
  }, [router]);

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 400));
    login(data.email);
    router.replace('/app/dashboard');
  };

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-700 to-primary-900 p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-primary-foreground/90 hover:text-accent">
          <Music2 className="h-5 w-5 text-accent" />
          <span className="font-display text-xl font-semibold">Mahler Reise</span>
        </Link>

        <div className="rounded-lg border border-primary-foreground/10 bg-cream p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-bold text-primary">Inloggen</h1>
          <p className="mt-1 text-sm text-muted-foreground">Toegang voor het prospectie-team</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="dominique.dejonghe@iutum.be"
                  {...register('email')}
                  className="pl-10"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-destructive">Geldig e-mailadres vereist</p>}
            </div>

            <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
              Stuur magic link <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-5 rounded-md bg-accent/10 p-3 text-xs text-primary/80">
            <strong className="font-semibold">Demo:</strong> gebruik elk e-mailadres om in te loggen. In productie wordt dit vervangen door Supabase magic link auth.
          </div>

          <Link href="/" className="mt-6 inline-block text-xs text-muted-foreground hover:text-accent">
            ← Terug naar de website
          </Link>
        </div>
      </div>
    </div>
  );
}
