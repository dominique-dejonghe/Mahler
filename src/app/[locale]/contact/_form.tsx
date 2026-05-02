'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations('contact');
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (typeof window !== 'undefined') {
      const list = JSON.parse(localStorage.getItem('mahler.contact') || '[]');
      list.push({ ...data, ts: new Date().toISOString() });
      localStorage.setItem('mahler.contact', JSON.stringify(list));
    }
    await new Promise((r) => setTimeout(r, 500));
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/10 p-8 text-center">
        <Check className="mx-auto mb-3 h-10 w-10 text-accent" />
        <p className="font-display text-lg text-primary">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-md border bg-card p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">{t('name')}</Label>
          <Input id="name" {...register('name')} className="mt-1.5" aria-invalid={!!errors.name} />
        </div>
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1.5" aria-invalid={!!errors.email} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">{t('subject')}</Label>
        <Input id="subject" {...register('subject')} className="mt-1.5" aria-invalid={!!errors.subject} />
      </div>
      <div>
        <Label htmlFor="message">{t('message')}</Label>
        <Textarea id="message" rows={6} {...register('message')} className="mt-1.5" aria-invalid={!!errors.message} />
      </div>
      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
        {t('send')}
      </Button>
    </form>
  );
}
