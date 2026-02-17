'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NotableEventsProps {
  value: string | null;
  onChange: (v: string) => void;
}

export function NotableEvents({ value, onChange }: NotableEventsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notable-events">Notable events</Label>
      <Textarea
        id="notable-events"
        placeholder="Anything noteworthy about today?"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}
