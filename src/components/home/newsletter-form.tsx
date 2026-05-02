'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export function NewsletterForm() {
  const t = useTranslations('home');
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // mock — Supabase wired in prompt 2
    if (typeof window !== 'undefined') {
      const list = JSON.parse(localStorage.getItem('mahler.newsletter') || '[]');
      list.push({ email: data.email, ts: new Date().toISOString() });
      localStorage.setItem('mahler.newsletter', JSON.stringify(list));
    }
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-md bg-accent/15 px-4 py-3 text-accent-700">
        <Check className="h-5 w-5" />
        <span className="text-sm font-medium">{t('newsletterTitle')} ✓</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
        <Input
          type="email"
          placeholder={t('newsletterPlaceholder')}
          {...register('email')}
          className="pl-10"
          aria-invalid={!!errors.email}
        />
      </div>
      <Button type="submit" variant="accent" disabled={isSubmitting}>
        {t('newsletterCta')}
      </Button>
    </form>
  );
}
