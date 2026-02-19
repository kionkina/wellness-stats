import { sampleCorrelation } from 'simple-statistics';
import type { CheckIn, CorrelationResult, StreakInfo } from './types';
import { differenceInDays, parseISO } from 'date-fns';

export function computeCorrelations(checkins: CheckIn[]): CorrelationResult[] {
  const metrics: { key: string; extract: (c: CheckIn) => number | null }[] = [
    { key: 'mood', extract: (c) => c.mood_score },
    { key: 'energy', extract: (c) => c.energy_score },
    { key: 'appetite', extract: (c) => c.appetite },
    { key: 'sleep', extract: (c) => c.sleep_hours },
    { key: 'exercise', extract: (c) => (c.exercised ? 1 : 0) },
    { key: 'period', extract: (c) => (c.period ? 1 : 0) },
    { key: 'bloating', extract: (c) => (c.bloating ? 1 : 0) },
    { key: 'sick', extract: (c) => (c.sick ? 1 : 0) },
  ];

  const results: CorrelationResult[] = [];

  for (let i = 0; i < metrics.length; i++) {
    for (let j = i + 1; j < metrics.length; j++) {
      const m1 = metrics[i];
      const m2 = metrics[j];

      const pairs: [number, number][] = [];
      for (const c of checkins) {
        const v1 = m1.extract(c);
        const v2 = m2.extract(c);
        if (v1 !== null && v2 !== null) {
          pairs.push([v1, v2]);
        }
      }

      if (pairs.length < 5) continue;

      const arr1 = pairs.map((p) => p[0]);
      const arr2 = pairs.map((p) => p[1]);

      // Check if either array has zero variance
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);
      if (set1.size < 2 || set2.size < 2) continue;

      try {
        const correlation = sampleCorrelation(arr1, arr2);
        if (isNaN(correlation)) continue;

        results.push({
          metric1: m1.key,
          metric2: m2.key,
          correlation,
          sampleSize: pairs.length,
          insight: generateInsight(m1.key, m2.key, correlation),
        });
      } catch {
        continue;
      }
    }
  }

  return results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

function generateInsight(m1: string, m2: string, r: number): string {
  const abs = Math.abs(r);
  const direction = r > 0 ? 'positively' : 'negatively';

  const labels: Record<string, string> = {
    mood: 'mood',
    energy: 'energy levels',
    appetite: 'appetite',
    sleep: 'sleep hours',
    exercise: 'exercising',
    period: 'your period',
    bloating: 'bloating',
    sick: 'feeling sick',
  };

  const l1 = labels[m1] || m1;
  const l2 = labels[m2] || m2;

  if (abs < 0.2) return `Little connection between ${l1} and ${l2}.`;
  if (abs < 0.4) return `Mild ${direction} link between ${l1} and ${l2}.`;
  if (abs < 0.6) return `Moderate ${direction} correlation between ${l1} and ${l2}.`;
  return `Strong ${direction} correlation between ${l1} and ${l2}.`;
}

export function calculateStreaks(checkins: CheckIn[]): StreakInfo {
  if (checkins.length === 0) {
    return { current: 0, longest: 0, lastCheckinDate: null };
  }

  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  const lastCheckinDate = sorted[0].date;

  // Check if today or yesterday was checked in for current streak
  const today = new Date();
  const lastDate = parseISO(sorted[0].date);
  const daysSinceLast = differenceInDays(today, lastDate);

  let current = 0;
  let longest = 0;
  let streak = 1;

  if (daysSinceLast <= 1) {
    current = 1;
  }

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1].date);
    const curr = parseISO(sorted[i].date);
    const diff = differenceInDays(prev, curr);

    if (diff === 1) {
      streak++;
      if (daysSinceLast <= 1 && i <= streak) {
        current = streak;
      }
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }

  longest = Math.max(longest, streak);
  if (current === 0 && daysSinceLast <= 1) {
    current = 1;
  }

  return { current, longest, lastCheckinDate };
}

export function calculateMovingAverage(
  data: { date: string; value: number }[],
  window: number
): { date: string; value: number; average: number }[] {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return sorted.map((point, i) => {
    const start = Math.max(0, i - window + 1);
    const windowSlice = sorted.slice(start, i + 1);
    const avg = windowSlice.reduce((sum, p) => sum + p.value, 0) / windowSlice.length;

    return { ...point, average: Math.round(avg * 100) / 100 };
  });
}
