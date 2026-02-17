'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { CorrelationResult } from '@/lib/types';

interface CorrelationCardProps {
  correlation: CorrelationResult;
}

export function CorrelationCard({ correlation }: CorrelationCardProps) {
  const { metric1, metric2, correlation: r, sampleSize, insight } = correlation;
  const abs = Math.abs(r);
  const isPositive = r > 0;

  let strength: string;
  let bgColor: string;

  if (abs < 0.2) {
    strength = 'Weak';
    bgColor = 'bg-muted';
  } else if (abs < 0.4) {
    strength = 'Mild';
    bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  } else if (abs < 0.6) {
    strength = 'Moderate';
    bgColor = isPositive ? 'bg-green-100' : 'bg-red-100';
  } else {
    strength = 'Strong';
    bgColor = isPositive ? 'bg-green-200' : 'bg-red-200';
  }

  return (
    <Card className={bgColor}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-sm font-medium capitalize">
            <span>{metric1}</span>
            <span className="text-muted-foreground">↔</span>
            <span>{metric2}</span>
          </div>
          <span className="text-xs text-muted-foreground">{strength}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${abs * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono w-12 text-right">
            {r > 0 ? '+' : ''}{r.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{insight}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Based on {sampleSize} entries
        </p>
      </CardContent>
    </Card>
  );
}
