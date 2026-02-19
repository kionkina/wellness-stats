'use client';

import { useState } from 'react';
import { useMonthCheckins } from '@/hooks/useCheckin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MOOD_OPTIONS, MOOD_TAG_COLORS } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, PenSquare, Loader2 } from 'lucide-react';
import type { CheckIn } from '@/lib/types';

function getMoodEmoji(label: string | null): string {
  if (!label) return '';
  return MOOD_OPTIONS.find((o) => o.label === label)?.emoji ?? '';
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MoodCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedCheckin, setSelectedCheckin] = useState<CheckIn | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { checkinMap, loading } = useMonthCheckins(year, month);
  const router = useRouter();

  const todayStr = format(now, 'yyyy-MM-dd');

  // Calendar grid calculations
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  function handleDayClick(day: number) {
    const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
    const checkin = checkinMap.get(dateStr);

    if (checkin) {
      setSelectedCheckin(checkin);
      setDialogOpen(true);
    } else if (dateStr <= todayStr) {
      router.push(`/checkin?date=${dateStr}`);
    }
  }

  const monthLabel = format(new Date(year, month, 1), 'MMMM yyyy');

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Mood Calendar</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">{monthLabel}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {DAY_HEADERS.map((d) => (
                <div key={d} className="text-[10px] text-muted-foreground text-center font-medium py-1">
                  {d}
                </div>
              ))}

              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
                const checkin = checkinMap.get(dateStr);
                const isToday = dateStr === todayStr;
                const isFuture = dateStr > todayStr;
                const emoji = checkin ? getMoodEmoji(checkin.mood_label) : '';

                return (
                  <button
                    key={day}
                    onClick={() => !isFuture && handleDayClick(day)}
                    disabled={isFuture}
                    className={`
                      relative flex flex-col items-center justify-center rounded-md p-1 h-10 text-xs
                      transition-colors
                      ${isFuture ? 'opacity-30 cursor-default' : 'hover:bg-muted cursor-pointer'}
                      ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                    `}
                  >
                    <span className={`text-[10px] leading-none ${isToday ? 'font-bold' : 'text-muted-foreground'}`}>
                      {day}
                    </span>
                    {emoji && <span className="text-sm leading-none mt-0.5">{emoji}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedCheckin && format(parseISO(selectedCheckin.date), 'EEEE, MMMM d')}
            </DialogTitle>
            <DialogDescription>Check-in details</DialogDescription>
          </DialogHeader>
          {selectedCheckin && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {selectedCheckin.mood_label && (
                  <div className="text-center">
                    <span className="text-2xl">{getMoodEmoji(selectedCheckin.mood_label)}</span>
                    <p className="text-xs text-muted-foreground">{selectedCheckin.mood_label}</p>
                  </div>
                )}
                {selectedCheckin.energy_label && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Energy</p>
                    <p className="text-xs text-muted-foreground">{selectedCheckin.energy_label}</p>
                  </div>
                )}
                {selectedCheckin.sleep_hours && (
                  <div className="text-center">
                    <p className="text-sm font-medium">Sleep</p>
                    <p className="text-xs text-muted-foreground">{selectedCheckin.sleep_hours}h</p>
                  </div>
                )}
              </div>

              {selectedCheckin.mood_tags && selectedCheckin.mood_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedCheckin.mood_tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 capitalize"
                      style={{ backgroundColor: `${MOOD_TAG_COLORS[tag] || '#d1d5db'}25` }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {selectedCheckin.exercised && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {selectedCheckin.exercise_type || 'Exercise'}
                  </Badge>
                )}
                {selectedCheckin.period && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Period
                  </Badge>
                )}
                {selectedCheckin.sick && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Sick
                  </Badge>
                )}
              </div>

              {selectedCheckin.note && (
                <p className="text-sm text-muted-foreground">{selectedCheckin.note}</p>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setDialogOpen(false);
                  router.push(`/checkin?date=${selectedCheckin.date}`);
                }}
              >
                <PenSquare className="mr-2 h-3 w-3" />
                Edit Entry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
