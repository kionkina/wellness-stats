'use client';

import { useCheckin, useRecentCheckins } from '@/hooks/useCheckin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOOD_OPTIONS, APPETITE_LABELS, MOOD_TAG_COLORS } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Loader2, PenSquare, CheckCircle2 } from 'lucide-react';
import type { CheckIn } from '@/lib/types';

function getMoodEmoji(label: string | null): string {
  if (!label) return '';
  return MOOD_OPTIONS.find((o) => o.label === label)?.emoji ?? '';
}

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
          {checkin.mood_label && (
            <span className="text-sm">
              {getMoodEmoji(checkin.mood_label)} {checkin.mood_label}
            </span>
          )}
          {checkin.energy_label && (
            <span className="text-sm text-muted-foreground">
              · Energy: {checkin.energy_label}
            </span>
          )}
          {checkin.sleep_hours && (
            <span className="text-sm text-muted-foreground">
              · {checkin.sleep_hours}h sleep
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {checkin.mood_tags?.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 capitalize"
              style={{
                backgroundColor: `${MOOD_TAG_COLORS[tag] || '#d1d5db'}25`,
              }}
            >
              {tag}
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
        {checkin.note && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {checkin.note}
          </p>
        )}
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
                {state.mood_label && (
                  <div className="text-center">
                    <span className="text-2xl">{getMoodEmoji(state.mood_label)}</span>
                    <p className="text-xs text-muted-foreground">{state.mood_label}</p>
                  </div>
                )}
                {state.energy_label && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Energy</p>
                    <p className="text-xs text-muted-foreground">{state.energy_label}</p>
                  </div>
                )}
                {state.appetite && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Appetite</p>
                    <p className="text-xs text-muted-foreground">{APPETITE_LABELS[state.appetite]}</p>
                  </div>
                )}
                {state.sleep_hours && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Sleep</p>
                    <p className="text-xs text-muted-foreground">{state.sleep_hours}h</p>
                  </div>
                )}
              </div>
              {state.mood_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {state.mood_tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] capitalize"
                      style={{ backgroundColor: `${MOOD_TAG_COLORS[tag] || '#d1d5db'}25` }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
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
