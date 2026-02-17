'use client';

import { useState } from 'react';
import { useAnalytics, type DateRange } from '@/hooks/useAnalytics';
import { TrendChart } from '@/components/analytics/TrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function TrendsPage() {
  const [range, setRange] = useState<DateRange>('30d');
  const { moodData, energyData, appetiteData, loading } = useAnalytics(range);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trends</h2>
        <Tabs value={range} onValueChange={(v) => setRange(v as DateRange)}>
          <TabsList className="h-8">
            <TabsTrigger value="7d" className="text-xs px-2">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-2">30d</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-2">90d</TabsTrigger>
            <TabsTrigger value="1y" className="text-xs px-2">1y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {moodData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={moodData} label="Mood" color="hsl(var(--chart-1))" />
          </CardContent>
        </Card>
      )}

      {energyData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={energyData} label="Energy" color="hsl(var(--chart-2))" />
          </CardContent>
        </Card>
      )}

      {appetiteData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Appetite</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={appetiteData} label="Appetite" color="hsl(var(--chart-4))" />
          </CardContent>
        </Card>
      )}

      {moodData.length > 0 && energyData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mood vs Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={moodData}
              label="Mood"
              color="hsl(var(--chart-1))"
              secondaryData={energyData}
              secondaryLabel="Energy"
              secondaryColor="hsl(var(--chart-2))"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
