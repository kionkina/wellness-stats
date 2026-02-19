'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CalendarHeatmap } from '@/components/analytics/CalendarHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function HeatmapPage() {
  const [metric, setMetric] = useState('mood');
  const { checkins, loading } = useAnalytics('1y');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const data = checkins.map((c) => ({
    date: c.date,
    count:
      metric === 'mood'
        ? c.mood_score ?? 0
        : metric === 'energy'
        ? c.energy_score ?? 0
        : metric === 'appetite'
        ? c.appetite || 0
        : metric === 'sleep'
        ? c.sleep_hours || 0
        : c.exercised
        ? 1
        : 0,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Heatmap</h2>

      <Tabs value={metric} onValueChange={setMetric}>
        <TabsList>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="appetite">Appetite</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm capitalize">{metric} over the past year</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap data={data} metric={metric} />
        </CardContent>
      </Card>
    </div>
  );
}
