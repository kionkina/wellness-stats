'use client';

import { useState } from 'react';
import { useCheckin } from '@/hooks/useCheckin';
import { useProfile } from '@/hooks/useProfile';
import { MoodScale } from '@/components/checkin/MoodScale';
import { EnergyScale } from '@/components/checkin/EnergyScale';
import { AppetiteScale } from '@/components/checkin/AppetiteScale';
import { SleepInput } from '@/components/checkin/SleepInput';
import { DayDescription } from '@/components/checkin/DayDescription';
import { BloatingToggle } from '@/components/checkin/BloatingToggle';
import { ExerciseInput } from '@/components/checkin/ExerciseInput';
import { PeriodInput } from '@/components/checkin/PeriodInput';
import { SickInput } from '@/components/checkin/SickInput';
import { NotableEvents } from '@/components/checkin/NotableEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { format, parseISO, subDays, addDays, isToday } from 'date-fns';
import { Loader2, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const { state, update, save, loading, saving, isEdit } = useCheckin(selectedDate);
  const { tracked, loading: profileLoading } = useProfile();
  const { toast } = useToast();

  const parsedDate = parseISO(selectedDate);
  const isTodaySelected = isToday(parsedDate);
  const isFuture = parsedDate > new Date();

  const goToPreviousDay = () => {
    setSelectedDate(format(subDays(parsedDate, 1), 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const next = addDays(parsedDate, 1);
    if (next <= new Date()) {
      setSelectedDate(format(next, 'yyyy-MM-dd'));
    }
  };

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleSave = async () => {
    const success = await save();
    if (success) {
      toast({
        title: isEdit ? 'Check-in updated!' : 'Check-in saved!',
        description: `Your wellness data for ${format(parsedDate, 'MMM d')} has been recorded.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save check-in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Date navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            max={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="w-auto text-center"
          />
          {!isTodaySelected && (
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          disabled={isTodaySelected || isFuture}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          {isEdit ? 'Update' : isTodaySelected ? 'Daily' : 'Backfill'} Check-in
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(parsedDate, 'EEEE, MMMM d, yyyy')}
          {!isTodaySelected && ' (past date)'}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <MoodScale
            label={state.mood_label}
            onChange={(label, score) => {
              update('mood_label', label);
              update('mood_score', score);
            }}
          />

          <Separator />

          <EnergyScale
            label={state.energy_label}
            onChange={(label, score) => {
              update('energy_label', label);
              update('energy_score', score);
            }}
          />

          {/* Show tags only after mood is selected */}
          {state.mood_label && (
            <>
              <Separator />

              <DayDescription
                note={state.note}
                moodTags={state.mood_tags}
                onNoteChange={(v) => update('note', v)}
                onMoodTagsChange={(v) => update('mood_tags', v)}
              />
            </>
          )}

          <Separator />

          <SleepInput
            value={state.sleep_hours}
            onChange={(v) => update('sleep_hours', v)}
          />

          {tracked.has('appetite') && (
            <>
              <Separator />
              <AppetiteScale
                value={state.appetite}
                onChange={(v) => update('appetite', v)}
              />
            </>
          )}

          {tracked.has('bloating') && (
            <>
              <Separator />
              <BloatingToggle
                bloating={state.bloating}
                severity={state.bloating_severity}
                onBloatingChange={(v) => update('bloating', v)}
                onSeverityChange={(v) => update('bloating_severity', v)}
              />
            </>
          )}

          {tracked.has('exercise') && (
            <>
              <Separator />
              <ExerciseInput
                exercised={state.exercised}
                exerciseType={state.exercise_type}
                exerciseMinutes={state.exercise_minutes}
                onExercisedChange={(v) => update('exercised', v)}
                onTypeChange={(v) => update('exercise_type', v)}
                onMinutesChange={(v) => update('exercise_minutes', v)}
              />
            </>
          )}

          {tracked.has('period') && (
            <>
              <Separator />
              <PeriodInput
                period={state.period}
                flowLevel={state.flow_level}
                periodStart={state.period_start}
                onPeriodChange={(v) => update('period', v)}
                onFlowChange={(v) => update('flow_level', v)}
                onPeriodStartChange={(v) => update('period_start', v)}
              />
            </>
          )}

          {tracked.has('sick') && (
            <>
              <Separator />
              <SickInput
                sick={state.sick}
                painAreas={state.pain_areas}
                sickNotes={state.sick_notes}
                onSickChange={(v) => update('sick', v)}
                onPainAreasChange={(v) => update('pain_areas', v)}
                onSickNotesChange={(v) => update('sick_notes', v)}
              />
            </>
          )}

          {tracked.has('notable_events') && (
            <>
              <Separator />
              <NotableEvents
                value={state.notable_events}
                onChange={(v) => update('notable_events', v)}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating save button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full shadow-lg"
            size="lg"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : isEdit ? 'Update Check-in' : 'Save Check-in'}
          </Button>
        </div>
      </div>
    </div>
  );
}
