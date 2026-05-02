import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !routing.locales.includes(locale as 'nl' | 'en')) {
    locale = routing.defaultLocale;
  }
  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
