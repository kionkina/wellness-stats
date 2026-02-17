'use client';

import { MOOD_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodScaleProps {
  value: number | null;
  onChange: (mood: number) => void;
}

const MOOD_EMOJIS = ['', '😞', '😕', '😐', '🙂', '😄'];

export function MoodScale({ value, onChange }: MoodScaleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Mood</label>
      <div className="flex gap-2 justify-between">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border p-3 flex-1 transition-all',
              value === level
                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            <span className="text-xl">{MOOD_EMOJIS[level]}</span>
            <span className="text-[10px] text-muted-foreground">{MOOD_LABELS[level]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
