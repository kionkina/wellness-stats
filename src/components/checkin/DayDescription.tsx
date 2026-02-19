'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOOD_TAGS, MOOD_TAG_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DayDescriptionProps {
  note: string | null;
  moodTags: string[];
  onNoteChange: (v: string) => void;
  onMoodTagsChange: (v: string[]) => void;
}

export function DayDescription({
  note,
  moodTags,
  onNoteChange,
  onMoodTagsChange,
}: DayDescriptionProps) {
  const toggleTag = (tag: string) => {
    if (moodTags.includes(tag)) {
      onMoodTagsChange(moodTags.filter((t) => t !== tag));
    } else {
      onMoodTagsChange([...moodTags, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="day-description">How was your day?</Label>
        <Textarea
          id="day-description"
          placeholder="Describe how your day went, what happened, how you're feeling..."
          value={note ?? ''}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
        />
      </div>

      {/* Selected tags */}
      {moodTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {moodTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 pr-1 capitalize cursor-pointer"
              style={{
                backgroundColor: `${MOOD_TAG_COLORS[tag] || '#d1d5db'}30`,
                borderColor: MOOD_TAG_COLORS[tag] || '#d1d5db',
              }}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <span className="ml-0.5 text-[10px] opacity-60">x</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Manual tag picker */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Mood tags (optional)
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {MOOD_TAGS.filter((tag) => !moodTags.includes(tag)).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs capitalize transition-all',
                'border-border hover:border-primary/50 text-muted-foreground'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
