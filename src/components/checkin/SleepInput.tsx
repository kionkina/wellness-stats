'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface SleepInputProps {
  value: number | null;
  onChange: (hours: number | null) => void;
}

const MIN = 0;
const MAX = 14;
const STEP = 0.25;

const QUICK_PRESETS = [6, 7, 7.5, 8, 9];

function formatHours(h: number): string {
  const whole = Math.floor(h);
  const frac = h - whole;
  if (frac === 0) return `${whole}h`;
  if (frac === 0.25) return `${whole}¼h`;
  if (frac === 0.5) return `${whole}½h`;
  if (frac === 0.75) return `${whole}¾h`;
  return `${h}h`;
}

export function SleepInput({ value, onChange }: SleepInputProps) {
  const current = value ?? 8;

  const decrement = () => {
    const next = Math.max(MIN, current - STEP);
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(MAX, current + STEP);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Label>Hours of sleep</Label>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={decrement}
          disabled={value !== null && current <= MIN}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => onChange(value === null ? 8 : null)}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 px-6 py-3 min-w-[5.5rem] transition-all',
            value !== null
              ? 'border-primary bg-primary/10'
              : 'border-dashed border-border text-muted-foreground'
          )}
        >
          {value !== null ? (
            <>
              <span className="text-2xl font-semibold tabular-nums">{formatHours(current)}</span>
              <span className="text-[10px] text-muted-foreground">tap to clear</span>
            </>
          ) : (
            <span className="text-sm">Not set</span>
          )}
        </button>
        <button
          onClick={increment}
          disabled={value !== null && current >= MAX}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {QUICK_PRESETS.map((h) => (
          <button
            key={h}
            onClick={() => onChange(value === h ? null : h)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-all',
              value === h
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            )}
          >
            {formatHours(h)}
          </button>
        ))}
      </div>
    </div>
  );
}
