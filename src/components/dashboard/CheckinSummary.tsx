import { Badge } from '@/components/ui/badge';
import { MOOD_OPTIONS, MOOD_TAG_COLORS } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import type { CheckIn } from '@/lib/types';

export function getMoodEmoji(label: string | null): string {
  if (!label) return '';
  return MOOD_OPTIONS.find((o) => o.label === label)?.emoji ?? '';
}

export function CheckinSummary({ checkin }: { checkin: CheckIn }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="text-center min-w-[3rem]">
        <div className="text-xs text-muted-foreground">
          {format(parseISO(checkin.date), 'EEE')}
        </div>
        <div className="text-lg font-semibold">
          {format(parseISO(checkin.date), 'd')}
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {checkin.mood_label && (
            <span className="text-sm">
              {getMoodEmoji(checkin.mood_label)} {checkin.mood_label}
            </span>
          )}
          {checkin.energy_label && (
            <span className="text-sm text-muted-foreground">
              · Energy: {checkin.energy_label}
            </span>
          )}
          {checkin.sleep_hours && (
            <span className="text-sm text-muted-foreground">
              · {checkin.sleep_hours}h sleep
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {checkin.mood_tags?.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 capitalize"
              style={{
                backgroundColor: `${MOOD_TAG_COLORS[tag] || '#d1d5db'}25`,
              }}
            >
              {tag}
            </Badge>
          ))}
          {checkin.exercised && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {checkin.exercise_type || 'Exercise'}
            </Badge>
          )}
          {checkin.period && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Period
            </Badge>
          )}
          {checkin.sick && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Sick
            </Badge>
          )}
        </div>
        {checkin.note && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {checkin.note}
          </p>
        )}
      </div>
    </div>
  );
}
