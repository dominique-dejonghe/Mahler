'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  tier: z.enum(['standaard', 'comfort', 'premium']),
  departure: z.enum(['mei-2027', 'augustus-2027']),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ReisSignupForm() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const t = useTranslations('reis');
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tier: 'comfort', departure: 'augustus-2027' },
  });

  const onSubmit = async (data: FormData) => {
    if (typeof window !== 'undefined') {
      const list = JSON.parse(localStorage.getItem('mahler.signups') || '[]');
      list.push({ ...data, ts: new Date().toISOString() });
      localStorage.setItem('mahler.signups', JSON.stringify(list));
    }
    await new Promise((r) => setTimeout(r, 500));
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/10 p-8 text-center">
        <Check className="mx-auto mb-3 h-10 w-10 text-accent" />
        <h3 className="font-display text-xl font-semibold text-primary">
          {isEn ? 'Thank you for your pre-registration.' : 'Bedankt voor uw voorinschrijving.'}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEn
            ? 'We will be in touch shortly with details and the official booking documents.'
            : 'We nemen spoedig contact op met details en de officiële boekingsdocumenten.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-md border bg-card p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">{isEn ? 'Name' : 'Naam'}</Label>
          <Input id="name" {...register('name')} className="mt-1.5" aria-invalid={!!errors.name} />
        </div>
        <div>
          <Label htmlFor="email">{isEn ? 'Email' : 'E-mail'}</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1.5" aria-invalid={!!errors.email} />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">{isEn ? 'Phone (optional)' : 'Telefoon (optioneel)'}</Label>
        <Input id="phone" {...register('phone')} className="mt-1.5" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>{isEn ? 'Package' : 'Pakket'}</Label>
          <Select defaultValue="comfort" onValueChange={(v: any) => setValue('tier', v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standaard">Standaard — €2.995</SelectItem>
              <SelectItem value="comfort">Comfort — €3.295</SelectItem>
              <SelectItem value="premium">Premium — €3.950</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{isEn ? 'Departure' : 'Vertrek'}</Label>
          <Select defaultValue="augustus-2027" onValueChange={(v: any) => setValue('departure', v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mei-2027">{t('may')}</SelectItem>
              <SelectItem value="augustus-2027">{t('august')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">{isEn ? 'Message (optional)' : 'Bericht (optioneel)'}</Label>
        <Textarea id="message" rows={4} {...register('message')} className="mt-1.5" />
      </div>

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isEn ? 'Send pre-registration' : 'Voorinschrijving versturen'}
      </Button>
      <p className="text-xs text-muted-foreground">
        {isEn
          ? 'No payment yet — we will contact you to confirm and proceed.'
          : 'Nog geen betaling — we nemen contact op om te bevestigen en verder te gaan.'}
      </p>
    </form>
  );
}
