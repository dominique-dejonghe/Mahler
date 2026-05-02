'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Calendar, MapPin, User } from 'lucide-react';
import { getAudioRecordings } from '@/lib/data';
import type { AudioRecording } from '@/types';
import { formatDateNL } from '@/lib/utils';

export default function AudioPage() {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});

  useEffect(() => {
    getAudioRecordings().then(setRecordings);
    if (typeof window !== 'undefined') {
      setTranscripts(JSON.parse(localStorage.getItem('mahler.transcripts') || '{}'));
    }
  }, []);

  const updateTranscription = (id: string, value: string) => {
    const next = { ...transcripts, [id]: value };
    setTranscripts(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahler.transcripts', JSON.stringify(next));
    }
  };

  const fmtDur = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">Audio-opnames</h1>
        <p className="mt-1 text-sm text-muted-foreground">{recordings.length} bestanden · interviews, recitals, veldopnames</p>
      </header>

      <div className="space-y-4">
        {recordings.map((r) => {
          const localTr = transcripts[r.id] ?? r.transcription ?? '';
          return (
            <Card key={r.id} className="border-primary/10">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary inline-flex items-center gap-2">
                      <Mic className="h-4 w-4 text-accent" />
                      {r.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateNL(r.date)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.location}</span>
                      {r.speaker && <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {r.speaker}</span>}
                    </div>
                  </div>
                  <Badge variant="muted">{fmtDur(r.duration)}</Badge>
                </div>

                {/* HTML5 audio player */}
                <audio controls preload="none" className="mt-4 w-full">
                  <source src={r.url} type="audio/mpeg" />
                  Je browser ondersteunt geen audio.
                </audio>
                <p className="mt-1 text-xs italic text-muted-foreground">
                  Demo player — echte audiobestanden worden in prompt 2 opgeslagen in Supabase Storage.
                </p>

                <div className="mt-4">
                  <label className="text-xs font-medium text-muted-foreground">Transcriptie</label>
                  <Textarea
                    rows={3}
                    defaultValue={localTr}
                    onBlur={(e) => updateTranscription(r.id, e.target.value)}
                    className="mt-1 text-sm"
                    placeholder="Tik of plak hier de transcriptie…"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
