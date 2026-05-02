// Small set of reusable presentational components.

interface BadgeProps {
  children: any;
  variant?: 'primary' | 'accent' | 'muted' | 'success' | 'warning';
  class?: string;
}
export function Badge({ children, variant = 'primary', class: className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    accent: 'bg-accent-100 text-accent-700 border-accent/40',
    muted: 'bg-cream-200 text-primary-700/70 border-primary-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span
      class={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, class: className = '' }: { children: any; class?: string }) {
  return (
    <div
      class={`rounded-lg border border-primary-100 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
  class: className = '',
}: {
  children: any;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'accent';
  type?: 'button' | 'submit';
  class?: string;
}) {
  const styles: Record<string, string> = {
    primary: 'bg-primary text-cream-100 hover:bg-primary-600',
    outline: 'border border-primary-300 text-primary-700 hover:bg-primary-50',
    ghost: 'text-primary-700 hover:bg-primary-50',
    accent: 'bg-accent text-white hover:bg-accent-600',
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} class={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} class={cls}>
      {children}
    </button>
  );
}

export function Section({
  title,
  subtitle,
  children,
  class: className = '',
}: {
  title?: string;
  subtitle?: string;
  children: any;
  class?: string;
}) {
  return (
    <section class={`container mx-auto px-4 py-12 md:py-16 ${className}`}>
      {title ? <h2 class="font-display text-3xl md:text-4xl font-bold text-primary-700 mb-2">{title}</h2> : null}
      {subtitle ? <p class="text-primary-700/70 mb-8 max-w-2xl">{subtitle}</p> : null}
      {children}
    </section>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div class="h-2 w-full rounded-full bg-primary-50 overflow-hidden">
      <div
        class="h-full bg-primary transition-all"
        style={`width:${pct}%`}
      ></div>
    </div>
  );
}

export function TypographicHero({
  title,
  subtitle,
  badge,
  initial,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  initial?: string;
}) {
  const letter = initial ?? (title?.charAt(0) ?? '·');
  return (
    <div class="relative overflow-hidden rounded-lg border border-primary-100">
      <div class="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 text-cream-100 px-8 py-16 md:py-24">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]"></div>
        <div class="relative flex items-center gap-6 md:gap-10">
          <div class="hidden md:flex h-28 w-28 items-center justify-center rounded-full border-2 border-accent text-accent font-display text-5xl font-bold">
            {letter}
          </div>
          <div>
            {badge ? (
              <span class="inline-block uppercase tracking-[0.2em] text-accent text-xs mb-3">{badge}</span>
            ) : null}
            <h1 class="font-display text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
            {subtitle ? <p class="mt-2 text-cream-100/85 max-w-2xl">{subtitle}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
