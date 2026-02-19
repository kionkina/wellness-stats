'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FLOW_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PeriodInputProps {
  period: boolean;
  flowLevel: number | null;
  periodStart: boolean;
  onPeriodChange: (v: boolean) => void;
  onFlowChange: (v: number) => void;
  onPeriodStartChange: (v: boolean) => void;
}

export function PeriodInput({
  period,
  flowLevel,
  periodStart,
  onPeriodChange,
  onFlowChange,
  onPeriodStartChange,
}: PeriodInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="period">Period</Label>
        <Switch id="period" checked={period} onCheckedChange={onPeriodChange} />
      </div>
      {period && (
        <>
          <div className="flex gap-2">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => onFlowChange(level)}
                className={cn(
                  'flex-1 rounded-md border px-3 py-2 text-sm transition-all',
                  flowLevel === level
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {FLOW_LABELS[level]}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="period-start" className="text-sm text-muted-foreground">
              First day of period?
            </Label>
            <Switch
              id="period-start"
              checked={periodStart}
              onCheckedChange={onPeriodStartChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
