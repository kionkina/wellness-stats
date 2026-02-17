'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EXERCISE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ExerciseInputProps {
  exercised: boolean;
  exerciseType: string | null;
  exerciseMinutes: number | null;
  onExercisedChange: (v: boolean) => void;
  onTypeChange: (v: string) => void;
  onMinutesChange: (v: number | null) => void;
}

export function ExerciseInput({
  exercised,
  exerciseType,
  exerciseMinutes,
  onExercisedChange,
  onTypeChange,
  onMinutesChange,
}: ExerciseInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="exercised">Exercised</Label>
        <Switch id="exercised" checked={exercised} onCheckedChange={onExercisedChange} />
      </div>
      {exercised && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-all',
                  exerciseType === type
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="exercise-minutes" className="shrink-0 text-sm">
              Duration
            </Label>
            <Input
              id="exercise-minutes"
              type="number"
              min={1}
              max={480}
              placeholder="minutes"
              value={exerciseMinutes ?? ''}
              onChange={(e) =>
                onMinutesChange(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">min</span>
          </div>
        </div>
      )}
    </div>
  );
}
