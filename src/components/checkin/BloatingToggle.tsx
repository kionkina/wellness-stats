'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BLOATING_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BloatingToggleProps {
  bloating: boolean;
  severity: number | null;
  onBloatingChange: (v: boolean) => void;
  onSeverityChange: (v: number) => void;
}

export function BloatingToggle({
  bloating,
  severity,
  onBloatingChange,
  onSeverityChange,
}: BloatingToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="bloating">Bloating</Label>
        <Switch id="bloating" checked={bloating} onCheckedChange={onBloatingChange} />
      </div>
      {bloating && (
        <div className="flex gap-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => onSeverityChange(level)}
              className={cn(
                'flex-1 rounded-md border px-3 py-2 text-sm transition-all',
                severity === level
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {BLOATING_LABELS[level]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
