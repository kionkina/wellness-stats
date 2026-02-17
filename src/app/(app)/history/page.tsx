'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOOD_LABELS, ENERGY_LABELS, APPETITE_LABELS, FEELING_COLORS, type PrimaryFeeling } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown } from 'lucide-react';
import type { CheckIn } from '@/lib/types';

const MOOD_EMOJIS = ['', '😞', '😕', '😐', '🙂', '😄'];
const PAGE_SIZE = 20;

export default function HistoryPage() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  const loadMore = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const from = page * PAGE_SIZE;
    const { data } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (data) {
      setCheckins((prev) => (page === 0 ? data as CheckIn[] : [...prev, ...data as CheckIn[]]));
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  }, [page, supabase]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const handleExport = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (!data || data.length === 0) return;

    const headers = [
      'date', 'mood', 'energy', 'appetite', 'feelings', 'bloating', 'bloating_severity',
      'exercised', 'exercise_type', 'exercise_minutes', 'period', 'flow_level',
      'sick', 'pain_areas', 'sick_notes', 'notable_events',
    ];

    const rows = data.map((c: CheckIn) => [
      c.date,
      c.mood ?? '',
      c.energy ?? '',
      c.appetite ?? '',
      c.feelings ? JSON.stringify(c.feelings) : '',
      c.bloating ? 'yes' : 'no',
      c.bloating_severity ?? '',
      c.exercised ? 'yes' : 'no',
      c.exercise_type ?? '',
      c.exercise_minutes ?? '',
      c.period ? 'yes' : 'no',
      c.flow_level ?? '',
      c.sick ? 'yes' : 'no',
      c.pain_areas?.join('; ') ?? '',
      c.sick_notes ?? '',
      c.notable_events ?? '',
    ]);

    const csv = [headers.join(','), ...rows.map((r: (string | number)[]) => r.map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-stats-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">History</h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      {checkins.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No entries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {checkins.map((checkin) => (
            <Card
              key={checkin.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/checkin?date=${checkin.date}`)}
            >
              <CardContent className="py-3">
                <div className="flex items-start gap-3">
                  <div className="text-center min-w-[3.5rem]">
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(checkin.date), 'EEE')}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(parseISO(checkin.date), 'MMM d')}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {checkin.mood && (
                        <span className="text-sm">
                          {MOOD_EMOJIS[checkin.mood]} {MOOD_LABELS[checkin.mood]}
                        </span>
                      )}
                      {checkin.energy && (
                        <span className="text-sm text-muted-foreground">
                          · {ENERGY_LABELS[checkin.energy]}
                        </span>
                      )}
                      {checkin.appetite && (
                        <span className="text-sm text-muted-foreground">
                          · {APPETITE_LABELS[checkin.appetite]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {checkin.feelings?.map((path: string[], i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                          style={{
                            backgroundColor: `${FEELING_COLORS[path[0] as PrimaryFeeling]}25`,
                          }}
                        >
                          {path[path.length - 1]}
                        </Badge>
                      ))}
                      {checkin.exercised && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {checkin.exercise_type || 'Exercise'}
                        </Badge>
                      )}
                      {checkin.period && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Period</Badge>
                      )}
                      {checkin.sick && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sick</Badge>
                      )}
                    </div>
                    {checkin.notable_events && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {checkin.notable_events}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
