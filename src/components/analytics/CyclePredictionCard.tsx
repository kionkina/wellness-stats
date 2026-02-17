'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import type { CyclePrediction } from '@/lib/types';

interface CyclePredictionCardProps {
  prediction: CyclePrediction;
}

export function CyclePredictionCard({ prediction }: CyclePredictionCardProps) {
  const daysUntil = differenceInDays(prediction.nextPeriodStart, new Date());
  const isPast = daysUntil < 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          Cycle Prediction
          <Badge
            variant={
              prediction.confidence === 'high'
                ? 'default'
                : prediction.confidence === 'medium'
                ? 'secondary'
                : 'outline'
            }
          >
            {prediction.confidence} confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Avg cycle length</p>
            <p className="text-lg font-semibold">{prediction.averageCycleLength} days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {isPast ? 'Expected' : 'Next period'}
            </p>
            <p className="text-lg font-semibold">
              {isPast ? 'Overdue' : `${daysUntil} days`}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Expected: {format(prediction.nextPeriodStart, 'MMM d')} -{' '}
          {format(prediction.nextPeriodEnd, 'MMM d')}
        </div>
        <p className="text-xs text-muted-foreground">
          Based on {prediction.cyclesUsed} recent cycle{prediction.cyclesUsed > 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
}
