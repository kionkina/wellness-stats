'use client';

import { useCheckin } from '@/hooks/useCheckin';
import { FeelingsWheel } from '@/components/checkin/FeelingsWheel';
import { MoodScale } from '@/components/checkin/MoodScale';
import { EnergyScale } from '@/components/checkin/EnergyScale';
import { AppetiteScale } from '@/components/checkin/AppetiteScale';
import { BloatingToggle } from '@/components/checkin/BloatingToggle';
import { ExerciseInput } from '@/components/checkin/ExerciseInput';
import { PeriodInput } from '@/components/checkin/PeriodInput';
import { SickInput } from '@/components/checkin/SickInput';
import { NotableEvents } from '@/components/checkin/NotableEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Loader2, Check } from 'lucide-react';

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date') || undefined;
  const { state, update, save, loading, saving, isEdit } = useCheckin(dateParam);
  const { toast } = useToast();

  const handleSave = async () => {
    const success = await save();
    if (success) {
      toast({
        title: isEdit ? 'Check-in updated!' : 'Check-in saved!',
        description: `Your wellness data for ${format(new Date(), 'MMM d')} has been recorded.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save check-in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h2 className="text-xl font-semibold">
          {isEdit ? 'Update' : 'Daily'} Check-in
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <MoodScale
            value={state.mood}
            onChange={(v) => update('mood', v)}
          />

          <Separator />

          <EnergyScale
            value={state.energy}
            onChange={(v) => update('energy', v)}
          />

          <Separator />

          <AppetiteScale
            value={state.appetite}
            onChange={(v) => update('appetite', v)}
          />

          <Separator />

          <FeelingsWheel
            value={state.feelings}
            onChange={(v) => update('feelings', v)}
          />

          <Separator />

          <BloatingToggle
            bloating={state.bloating}
            severity={state.bloating_severity}
            onBloatingChange={(v) => update('bloating', v)}
            onSeverityChange={(v) => update('bloating_severity', v)}
          />

          <Separator />

          <ExerciseInput
            exercised={state.exercised}
            exerciseType={state.exercise_type}
            exerciseMinutes={state.exercise_minutes}
            onExercisedChange={(v) => update('exercised', v)}
            onTypeChange={(v) => update('exercise_type', v)}
            onMinutesChange={(v) => update('exercise_minutes', v)}
          />

          <Separator />

          <PeriodInput
            period={state.period}
            flowLevel={state.flow_level}
            onPeriodChange={(v) => update('period', v)}
            onFlowChange={(v) => update('flow_level', v)}
          />

          <Separator />

          <SickInput
            sick={state.sick}
            painAreas={state.pain_areas}
            sickNotes={state.sick_notes}
            onSickChange={(v) => update('sick', v)}
            onPainAreasChange={(v) => update('pain_areas', v)}
            onSickNotesChange={(v) => update('sick_notes', v)}
          />

          <Separator />

          <NotableEvents
            value={state.notable_events}
            onChange={(v) => update('notable_events', v)}
          />
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
