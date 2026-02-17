'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { CorrelationCard } from '@/components/analytics/CorrelationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CorrelationsPage() {
  const { correlations, loading } = useAnalytics('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Correlations</h2>
        <p className="text-sm text-muted-foreground">
          Connections between your wellness metrics
        </p>
      </div>

      {correlations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Not enough data to find correlations. Keep checking in!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {correlations.map((c, i) => (
            <CorrelationCard key={i} correlation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
