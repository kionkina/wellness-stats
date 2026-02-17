'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { subDays, format } from 'date-fns';
import { computeCorrelations, calculateStreaks, calculateMovingAverage } from '@/lib/analytics';
import { predictCycle } from '@/lib/cycle';
import type { CheckIn, CorrelationResult, CyclePrediction, StreakInfo } from '@/lib/types';

export type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

function rangeToDate(range: DateRange): string | null {
  const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365, all: 0 };
  const d = days[range];
  if (d === 0) return null;
  return format(subDays(new Date(), d), 'yyyy-MM-dd');
}

export function useAnalytics(range: DateRange = '30d') {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      let query = supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      const startDate = rangeToDate(range);
      if (startDate) {
        query = query.gte('date', startDate);
      }

      const { data } = await query;
      setCheckins((data as CheckIn[]) || []);
      setLoading(false);
    }

    load();
  }, [range, supabase]);

  const correlations = useMemo<CorrelationResult[]>(
    () => computeCorrelations(checkins),
    [checkins]
  );

  const streaks = useMemo<StreakInfo>(
    () => calculateStreaks(checkins),
    [checkins]
  );

  const cyclePrediction = useMemo<CyclePrediction | null>(
    () => predictCycle(checkins),
    [checkins]
  );

  const moodData = useMemo(
    () =>
      calculateMovingAverage(
        checkins
          .filter((c) => c.mood !== null)
          .map((c) => ({ date: c.date, value: c.mood! })),
        7
      ),
    [checkins]
  );

  const energyData = useMemo(
    () =>
      calculateMovingAverage(
        checkins
          .filter((c) => c.energy !== null)
          .map((c) => ({ date: c.date, value: c.energy! })),
        7
      ),
    [checkins]
  );

  const appetiteData = useMemo(
    () =>
      calculateMovingAverage(
        checkins
          .filter((c) => c.appetite !== null)
          .map((c) => ({ date: c.date, value: c.appetite! })),
        7
      ),
    [checkins]
  );

  const heatmapData = useMemo(
    () =>
      checkins.map((c) => ({
        date: c.date,
        count: c.mood || 0,
      })),
    [checkins]
  );

  return {
    checkins,
    loading,
    correlations,
    streaks,
    cyclePrediction,
    moodData,
    energyData,
    appetiteData,
    heatmapData,
  };
}
