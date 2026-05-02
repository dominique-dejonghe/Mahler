import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disable in dev AND when DISABLE_PWA=1 (used during sandbox builds to keep build times sane)
  disable: process.env.NODE_ENV === 'development' || process.env.DISABLE_PWA === '1',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Generous timeout for SSG worker — sandbox CPU is shared and the default
  // 60-second per-worker budget is regularly exceeded when generating ~60 pages.
  staticPageGenerationTimeout: 300,
  // Type-checking is run separately via `npm run typecheck` (tsc --noEmit) — skipping
  // it inside `next build` keeps peak memory low enough for the sandbox/Vercel
  // free-tier builders. Vercel runs a typecheck step itself before this kicks in.
  typescript: { ignoreBuildErrors: true },
  // Same reasoning for ESLint: run via `npm run lint`, not during build.
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Single worker keeps total memory footprint predictable on a 2-core sandbox.
    workerThreads: false,
    cpus: 1,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
