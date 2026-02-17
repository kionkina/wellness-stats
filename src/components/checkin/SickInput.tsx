'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PAIN_AREAS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SickInputProps {
  sick: boolean;
  painAreas: string[];
  sickNotes: string | null;
  onSickChange: (v: boolean) => void;
  onPainAreasChange: (v: string[]) => void;
  onSickNotesChange: (v: string) => void;
}

export function SickInput({
  sick,
  painAreas,
  sickNotes,
  onSickChange,
  onPainAreasChange,
  onSickNotesChange,
}: SickInputProps) {
  const togglePainArea = (area: string) => {
    if (painAreas.includes(area)) {
      onPainAreasChange(painAreas.filter((a) => a !== area));
    } else {
      onPainAreasChange([...painAreas, area]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="sick">Feeling sick / Pain</Label>
        <Switch id="sick" checked={sick} onCheckedChange={onSickChange} />
      </div>
      {sick && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PAIN_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => togglePainArea(area)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-all',
                  painAreas.includes(area)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {area}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Notes (symptoms, etc.)"
            value={sickNotes ?? ''}
            onChange={(e) => onSickNotesChange(e.target.value)}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
