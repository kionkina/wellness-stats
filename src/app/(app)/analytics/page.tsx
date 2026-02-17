'use client';

import { useState } from 'react';
import { useAnalytics, type DateRange } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendChart } from '@/components/analytics/TrendChart';
import { CalendarHeatmap } from '@/components/analytics/CalendarHeatmap';
import { CorrelationCard } from '@/components/analytics/CorrelationCard';
import { CyclePredictionCard } from '@/components/analytics/CyclePredictionCard';
import { Loader2, Flame, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('30d');
  const {
    loading,
    checkins,
    correlations,
    streaks,
    cyclePrediction,
    moodData,
    energyData,
    heatmapData,
  } = useAnalytics(range);

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
        <h2 className="text-xl font-semibold">Analytics</h2>
        <Tabs value={range} onValueChange={(v) => setRange(v as DateRange)}>
          <TabsList className="h-8">
            <TabsTrigger value="7d" className="text-xs px-2">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-2">30d</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-2">90d</TabsTrigger>
            <TabsTrigger value="1y" className="text-xs px-2">1y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {checkins.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            <p>Not enough data yet. Start checking in daily!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                <p className="text-xl font-bold">{streaks.current}</p>
                <p className="text-[10px] text-muted-foreground">Day streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="text-xl font-bold">{checkins.length}</p>
                <p className="text-[10px] text-muted-foreground">Check-ins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <Activity className="h-4 w-4 mx-auto mb-1 text-green-500" />
                <p className="text-xl font-bold">
                  {checkins.filter((c) => c.exercised).length}
                </p>
                <p className="text-[10px] text-muted-foreground">Exercise days</p>
              </CardContent>
            </Card>
          </div>

          {/* Mood & energy trends */}
          {moodData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mood & Energy Trends</CardTitle>
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

          {/* Heatmap preview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Mood Heatmap</CardTitle>
                <Link href="/analytics/heatmap" className="text-xs text-primary">
                  Full view →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarHeatmap data={heatmapData} />
            </CardContent>
          </Card>

          {/* Top correlations */}
          {correlations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Top Correlations</h3>
                <Link href="/analytics/correlations" className="text-xs text-primary">
                  View all →
                </Link>
              </div>
              <div className="space-y-2">
                {correlations.slice(0, 3).map((c, i) => (
                  <CorrelationCard key={i} correlation={c} />
                ))}
              </div>
            </div>
          )}

          {/* Cycle prediction */}
          {cyclePrediction && <CyclePredictionCard prediction={cyclePrediction} />}
        </>
      )}
    </div>
  );
}
