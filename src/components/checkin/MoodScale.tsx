'use client';

import { MOOD_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodScaleProps {
  label: string | null;
  onChange: (label: string, score: number) => void;
}

export function MoodScale({ label: selected, onChange }: MoodScaleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Mood</label>
      <div className="flex gap-2 justify-between">
        {MOOD_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label, opt.score)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border p-3 flex-1 transition-all',
              selected === opt.label
                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
