'use client';

import { useCheckin, useRecentCheckins } from '@/hooks/useCheckin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOOD_LABELS, ENERGY_LABELS, APPETITE_LABELS, FEELING_COLORS, type PrimaryFeeling } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Loader2, PenSquare, CheckCircle2 } from 'lucide-react';
import type { CheckIn } from '@/lib/types';

const MOOD_EMOJIS = ['', '😞', '😕', '😐', '🙂', '😄'];

function CheckinSummary({ checkin }: { checkin: CheckIn }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="text-center min-w-[3rem]">
        <div className="text-xs text-muted-foreground">
          {format(parseISO(checkin.date), 'EEE')}
        </div>
        <div className="text-lg font-semibold">
          {format(parseISO(checkin.date), 'd')}
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
              · Energy: {ENERGY_LABELS[checkin.energy]}
            </span>
          )}
          {checkin.appetite && (
            <span className="text-sm text-muted-foreground">
              · Appetite: {APPETITE_LABELS[checkin.appetite]}
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
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Period
            </Badge>
          )}
          {checkin.sick && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Sick
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state, loading: todayLoading, isEdit } = useCheckin();
  const { checkins, loading: recentLoading } = useRecentCheckins(7);
  const router = useRouter();

  if (todayLoading || recentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      {/* Today's status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {isEdit ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Today&apos;s Check-in Complete
              </>
            ) : (
              'Today'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEdit ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                {state.mood && (
                  <div className="text-center">
                    <span className="text-2xl">{MOOD_EMOJIS[state.mood]}</span>
                    <p className="text-xs text-muted-foreground">{MOOD_LABELS[state.mood]}</p>
                  </div>
                )}
                {state.energy && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Energy</p>
                    <p className="text-xs text-muted-foreground">{ENERGY_LABELS[state.energy]}</p>
                  </div>
                )}
                {state.appetite && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Appetite</p>
                    <p className="text-xs text-muted-foreground">{APPETITE_LABELS[state.appetite]}</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/checkin')}
              >
                <PenSquare className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push('/checkin')} className="w-full">
              <PenSquare className="mr-2 h-4 w-4" />
              Start Check-in
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent entries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {checkins.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No entries yet. Start your first check-in!
            </p>
          ) : (
            <div className="divide-y">
              {checkins.map((checkin) => (
                <CheckinSummary key={checkin.id} checkin={checkin} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
