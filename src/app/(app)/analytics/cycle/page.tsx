'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { CyclePredictionCard } from '@/components/analytics/CyclePredictionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CyclePage() {
  const { cyclePrediction, loading, checkins } = useAnalytics('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const periodDays = checkins.filter((c) => c.period).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Cycle Tracking</h2>
        <p className="text-sm text-muted-foreground">
          Period predictions based on your data
        </p>
      </div>

      {cyclePrediction ? (
        <CyclePredictionCard prediction={cyclePrediction} />
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {periodDays > 0
              ? 'Need at least 2 tracked cycles for predictions. Keep logging!'
              : 'No period data recorded yet. Toggle "Period" in your daily check-ins.'}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
