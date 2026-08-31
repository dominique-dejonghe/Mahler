import { AppLayout } from '../components/layout';
import { Badge, Button, Card, ProgressBar } from '../components/ui';
import {
  getStops,
  getContacts,
  getChecklist,
  getAudioRecordings,
  getActivityFeed,
  getDashboardStats,
} from '../lib/data';

function fmtDateNL(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/* --------------------------------- Login --------------------------------- */

export function LoginPage() {
  return (
    <AppLayout title="Inloggen · Mahler Reise" pathname="/app/login">
      <Card class="p-8 max-w-md w-full">
        <div class="text-center mb-6">
          <i class="fas fa-music text-3xl text-accent"></i>
          <h1 class="font-display text-2xl font-bold text-primary-700 mt-2">Mahler Reise</h1>
          <p class="text-sm text-primary-700/70 mt-1">Toegang voor het prospectie-team</p>
        </div>
        <form id="login-form" class="grid gap-4">
          <label class="block">
            <span class="text-xs uppercase tracking-widest text-primary-700/70">E-mail</span>
            <div class="relative mt-1">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-primary-700/40"></i>
              <input
                type="email"
                name="email"
                required
                placeholder="naam@iutum.be"
                class="w-full rounded-md border border-primary-200 pl-10 pr-3 py-2 bg-white"
              />
            </div>
          </label>
          <button type="submit" class="rounded-md bg-accent text-white py-2 font-semibold hover:bg-accent-600">
            <i class="fas fa-paper-plane mr-2"></i>Stuur magic link
          </button>
        </form>
        <p class="mt-5 text-xs text-primary-700/60 leading-relaxed">
          <i class="fas fa-info-circle mr-1"></i>
          Demo: gebruik elk e-mailadres om in te loggen. In productie wordt dit vervangen door Supabase magic-link auth.
        </p>
        <a href="/" class="block mt-6 text-center text-xs text-primary-700/60 hover:text-primary">
          ← Terug naar de website
        </a>
      </Card>
    </AppLayout>
  );
}

/* ------------------------------- Dashboard ------------------------------- */

export function DashboardPage() {
  const stats = getDashboardStats();
  const stops = getStops();
  const activity = getActivityFeed().slice(0, 6);
  const upcoming = stops.find((s) => daysUntil(s.arrivalDate) >= 0) ?? stops[0];

  return (
    <AppLayout title="Dashboard · Mahler Reise" pathname="/app/dashboard">
      <div class="mb-8">
        <h1 class="font-display text-3xl font-bold text-primary-700">Dashboard</h1>
        <p class="text-primary-700/70 mt-1">Welkom terug — overzicht van de prospectiereis 2026.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi icon="fa-map-location-dot" label="Locaties bezocht" value={`${stats.completedStops}/${stats.totalStops}`} />
        <Kpi icon="fa-address-book" label="Contacten bevestigd" value={`${stats.contactsConfirmed}/${stats.totalContacts}`} />
        <Kpi icon="fa-microphone" label="Audio-opnames" value={String(stats.audioRecordings)} />
        <Kpi icon="fa-list-check" label="Checklist" value={`${stats.checklistDone}/${stats.checklistTotal}`} />
      </div>

      <div class="grid lg:grid-cols-3 gap-6 mb-8">
        <Card class="p-6 lg:col-span-2">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Voortgang prospectiereis</h3>
          <Row label="Locaties bezocht" value={stats.completedStops} max={stats.totalStops} />
          <Row label="Checklist afgewerkt" value={stats.checklistDone} max={stats.checklistTotal} />
          <Row label="Contacten bevestigd" value={stats.contactsConfirmed} max={stats.totalContacts} />
        </Card>
        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Volgende halte</h3>
          {upcoming ? (
            <>
              <div class="font-display text-2xl text-primary">{upcoming.name}</div>
              <div class="text-sm text-primary-700/70">{upcoming.country}</div>
              <p class="text-sm mt-3 leading-relaxed">{upcoming.shortDesc.nl}</p>
              <div class="mt-4 text-xs text-primary-700/60">
                <i class="fas fa-calendar mr-2 text-accent"></i>
                {fmtDateNL(upcoming.arrivalDate)}
                <span class="block mt-1 text-accent font-semibold">
                  {daysUntil(upcoming.arrivalDate)} dagen tot aankomst
                </span>
              </div>
            </>
          ) : null}
        </Card>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Recente activiteit</h3>
          <ul class="space-y-3">
            {activity.map((a) => (
              <li class="flex gap-3 pb-3 border-b border-primary-50 last:border-0">
                <div class="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <i class={`fas ${a.type === 'audio' ? 'fa-microphone' : a.type === 'contact' ? 'fa-user' : a.type === 'checklist' ? 'fa-check' : 'fa-pen'} text-accent text-xs`}></i>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-semibold text-primary-700">{a.title}</div>
                  <div class="text-xs text-primary-700/60">
                    {fmtDateNL(a.timestamp)} · {a.actor}
                  </div>
                </div>
                <Badge variant="muted">{a.type}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Snelle acties</h3>
          <div class="grid grid-cols-2 gap-3">
            <Button href="/app/locaties" variant="outline"><i class="fas fa-map-location-dot"></i> Locaties</Button>
            <Button href="/app/contacten" variant="outline"><i class="fas fa-address-book"></i> Contacten</Button>
            <Button href="/app/audio" variant="outline"><i class="fas fa-microphone"></i> Audio</Button>
            <Button href="/app/checklist" variant="outline"><i class="fas fa-list-check"></i> Checklist</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function Kpi({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card class="p-5">
      <div class="flex items-center justify-between mb-2">
        <i class={`fas ${icon} text-accent text-xl`}></i>
      </div>
      <div class="font-display text-3xl font-bold text-primary">{value}</div>
      <div class="text-xs text-primary-700/60 uppercase tracking-widest mt-1">{label}</div>
    </Card>
  );
}

function Row({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div class="mb-4">
      <div class="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span class="text-primary-700/60">{value}/{max} ({pct}%)</span>
      </div>
      <ProgressBar value={value} max={max} />
    </div>
  );
}

/* -------------------------------- Locaties ------------------------------- */

export function LocatiesPage() {
  const stops = getStops();
  return (
    <AppLayout title="Locaties · Mahler Reise" pathname="/app/locaties">
      <div class="mb-6">
        <h1 class="font-display text-3xl font-bold text-primary-700">Locaties</h1>
        <p class="text-primary-700/70 mt-1">11 prospectie-haltes · 21–30 augustus 2026</p>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        {stops.map((s) => (
          <Card class="p-5">
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="text-xs text-primary-700/60">Halte {s.order} · {s.country}</div>
                <h3 class="font-display text-xl font-semibold text-primary-700">
                  <a href={`/app/locaties/${s.id}`}>{s.name}</a>
                </h3>
              </div>
              <Badge variant={s.status === 'completed' ? 'success' : s.status === 'in-progress' ? 'warning' : 'muted'}>
                {s.status}
              </Badge>
            </div>
            <p class="text-sm text-primary-700/80 mt-2 leading-relaxed">{s.shortDesc.nl}</p>
            <div class="mt-3 text-xs text-primary-700/60">
              <i class="fas fa-calendar mr-1 text-accent"></i>{fmtDateNL(s.arrivalDate)}
              <span class="ml-3"><i class="fas fa-clock mr-1 text-accent"></i>{s.mahlerPeriod}</span>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

export function LocatieDetailPage({ id }: { id: number }) {
  const stops = getStops();
  const stop = stops.find((s) => s.id === id);
  if (!stop) return null;
  return (
    <AppLayout title={`${stop.name} · Mahler Reise`} pathname={`/app/locaties/${id}`}>
      <a href="/app/locaties" class="text-sm text-primary-700/70 hover:text-primary">
        <i class="fas fa-arrow-left mr-2"></i>Terug naar locaties
      </a>
      <div class="mt-4 mb-6">
        <Badge variant="accent">Halte {stop.order} · {stop.country}</Badge>
        <h1 class="font-display text-4xl font-bold text-primary-700 mt-3">{stop.name}</h1>
        <p class="text-sm text-primary-700/60 mt-2">
          <i class="fas fa-calendar mr-2 text-accent"></i>{fmtDateNL(stop.arrivalDate)}
          <span class="ml-4"><i class="fas fa-clock mr-2 text-accent"></i>{stop.mahlerPeriod}</span>
        </p>
      </div>
      <Card class="p-6">
        <h2 class="font-display text-xl font-semibold text-primary-700 mb-2">Beschrijving</h2>
        <p class="leading-relaxed">{stop.shortDesc.nl}</p>
        <p class="leading-relaxed text-primary-700/70 italic mt-3">{stop.shortDesc.en}</p>
      </Card>
      <div class="mt-6 grid md:grid-cols-3 gap-4">
        <Card class="p-5">
          <h3 class="font-semibold text-primary-700 mb-2"><i class="fas fa-microphone mr-2 text-accent"></i>Audio</h3>
          <p class="text-sm text-primary-700/60">Geen opnames yet — voeg toe via /app/audio.</p>
        </Card>
        <Card class="p-5">
          <h3 class="font-semibold text-primary-700 mb-2"><i class="fas fa-pen mr-2 text-accent"></i>Notities</h3>
          <p class="text-sm text-primary-700/60">Geen private journal entries voor deze halte.</p>
        </Card>
        <Card class="p-5">
          <h3 class="font-semibold text-primary-700 mb-2"><i class="fas fa-address-book mr-2 text-accent"></i>Contacten</h3>
          <p class="text-sm text-primary-700/60">Zie /app/contacten voor de volledige lijst.</p>
        </Card>
      </div>
    </AppLayout>
  );
}

/* -------------------------------- Contacten ------------------------------ */

export function ContactenPage() {
  const contacts = getContacts();
  return (
    <AppLayout title="Contacten · Mahler Reise" pathname="/app/contacten">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h1 class="font-display text-3xl font-bold text-primary-700">Contacten</h1>
          <p class="text-primary-700/70 mt-1">{contacts.length} contacten in archieven, theaters en musea</p>
        </div>
        <Button variant="accent"><i class="fas fa-plus"></i> Contact toevoegen</Button>
      </div>
      <Card class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-primary-50 text-left text-xs uppercase tracking-widest text-primary-700/70">
              <tr>
                <th class="px-4 py-3">Naam</th>
                <th class="px-4 py-3">Rol / Org</th>
                <th class="px-4 py-3">Stad</th>
                <th class="px-4 py-3">E-mail</th>
                <th class="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary-100">
              {contacts.map((c) => (
                <tr class="hover:bg-cream-100/60">
                  <td class="px-4 py-3 font-semibold text-primary-700">{c.name}</td>
                  <td class="px-4 py-3 text-primary-700/70">
                    <div>{c.role}</div>
                    <div class="text-xs">{c.organization}</div>
                  </td>
                  <td class="px-4 py-3">{c.city}</td>
                  <td class="px-4 py-3">
                    {c.email ? <a href={`mailto:${c.email}`} class="text-primary hover:text-accent">{c.email}</a> : '—'}
                  </td>
                  <td class="px-4 py-3">
                    <Badge
                      variant={
                        c.status === 'confirmed' ? 'success'
                        : c.status === 'declined' ? 'warning'
                        : c.status === 'meeting-scheduled' ? 'accent'
                        : 'muted'
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}

/* -------------------------------- Checklist ------------------------------ */

export function ChecklistPage() {
  const items = getChecklist();
  const categories = ['admin', 'travel', 'archive', 'media', 'logistics'] as const;
  return (
    <AppLayout title="Checklist · Mahler Reise" pathname="/app/checklist">
      <div class="mb-6">
        <h1 class="font-display text-3xl font-bold text-primary-700">Checklist</h1>
        <p class="text-primary-700/70 mt-1">
          {items.filter((i) => i.done).length} van {items.length} afgewerkt
        </p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (!catItems.length) return null;
          const done = catItems.filter((i) => i.done).length;
          return (
            <Card class="p-5">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-display text-lg font-semibold text-primary-700 capitalize">{cat}</h3>
                <Badge variant="muted">{done}/{catItems.length}</Badge>
              </div>
              <ProgressBar value={done} max={catItems.length} />
              <ul class="mt-4 space-y-2">
                {catItems.map((i) => (
                  <li class="flex items-start gap-3">
                    <input type="checkbox" checked={i.done} class="mt-1 accent-primary" disabled />
                    <span class={i.done ? 'line-through text-primary-700/50' : 'text-primary-900'}>
                      {i.title.nl}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}

/* ---------------------------------- Audio -------------------------------- */

export function AudioPage() {
  const recs = getAudioRecordings();
  return (
    <AppLayout title="Audio · Mahler Reise" pathname="/app/audio">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h1 class="font-display text-3xl font-bold text-primary-700">Audio-opnames</h1>
          <p class="text-primary-700/70 mt-1">{recs.length} opnames van interviews, ambient en lezingen</p>
        </div>
        <Button variant="accent"><i class="fas fa-upload"></i> Audio uploaden</Button>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        {recs.map((r) => (
          <Card class="p-5">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-display text-lg font-semibold text-primary-700">{r.title}</h3>
                <p class="text-xs text-primary-700/60 mt-1">
                  <i class="fas fa-map-marker-alt mr-1 text-accent"></i>{r.location}
                  <span class="ml-3"><i class="fas fa-calendar mr-1 text-accent"></i>{fmtDateNL(r.date)}</span>
                </p>
              </div>
              <Badge variant="muted">
                {Math.floor(r.duration / 60)}:{String(r.duration % 60).padStart(2, '0')}
              </Badge>
            </div>
            {r.speaker ? <p class="text-sm text-primary-700/70 mt-3"><strong>Spreker:</strong> {r.speaker}</p> : null}
            {r.transcription ? <p class="text-sm mt-3 italic text-primary-700/80 line-clamp-3">"{r.transcription}"</p> : null}
            <div class="mt-3 flex gap-2">
              <Button variant="outline"><i class="fas fa-play"></i> Beluister</Button>
              <Button variant="ghost"><i class="fas fa-download"></i></Button>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

/* ----------------------------- Instellingen ------------------------------ */

export function InstellingenPage() {
  return (
    <AppLayout title="Instellingen · Mahler Reise" pathname="/app/instellingen">
      <h1 class="font-display text-3xl font-bold text-primary-700 mb-6">Instellingen</h1>
      <div class="grid md:grid-cols-2 gap-6">
        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Profiel</h3>
          <div class="grid gap-3 text-sm">
            <label class="block">
              <span class="text-xs uppercase tracking-widest text-primary-700/60">Naam</span>
              <input class="mt-1 w-full rounded-md border border-primary-200 px-3 py-2 bg-white" placeholder="Dominique Dejonghe" />
            </label>
            <label class="block">
              <span class="text-xs uppercase tracking-widest text-primary-700/60">E-mail</span>
              <input class="mt-1 w-full rounded-md border border-primary-200 px-3 py-2 bg-white" placeholder="dominique.dejonghe@iutum.be" />
            </label>
            <Button variant="primary" class="self-start mt-2">Opslaan</Button>
          </div>
        </Card>

        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Notificaties</h3>
          <label class="flex items-center justify-between py-2 border-b border-primary-50">
            <span>E-mail bij nieuwe entry</span>
            <input type="checkbox" checked class="accent-primary" />
          </label>
          <label class="flex items-center justify-between py-2 border-b border-primary-50">
            <span>Push-notificaties</span>
            <input type="checkbox" class="accent-primary" />
          </label>
          <label class="flex items-center justify-between py-2">
            <span>Wekelijkse samenvatting</span>
            <input type="checkbox" checked class="accent-primary" />
          </label>
        </Card>

        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Offline</h3>
          <p class="text-sm text-primary-700/70 mb-3">PWA-installatie en offline cache.</p>
          <Button variant="outline"><i class="fas fa-download"></i> Cache vernieuwen</Button>
        </Card>

        <Card class="p-6">
          <h3 class="font-display text-lg font-semibold text-primary-700 mb-4">Data export</h3>
          <p class="text-sm text-primary-700/70 mb-3">Download alle private data als JSON.</p>
          <a href="/app/api/export" class="inline-flex items-center gap-2 rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50">
            <i class="fas fa-file-export"></i> Exporteer JSON
          </a>
        </Card>

        <Card class="p-6 md:col-span-2 bg-amber-50 border-amber-200">
          <h3 class="font-display text-lg font-semibold text-amber-800 mb-2">Uitloggen</h3>
          <p class="text-sm text-amber-700 mb-3">Wis de lokale sessie en keer terug naar de website.</p>
          <button id="logout-btn-page" class="rounded-md bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700">
            <i class="fas fa-right-from-bracket mr-2"></i>Uitloggen
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
