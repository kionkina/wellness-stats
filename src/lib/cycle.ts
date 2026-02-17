import { addDays, differenceInDays, parseISO } from 'date-fns';
import type { CheckIn, CyclePrediction } from './types';

export function predictCycle(checkins: CheckIn[]): CyclePrediction | null {
  // Find period start dates (first day of each period)
  const periodDays = checkins
    .filter((c) => c.period)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (periodDays.length < 2) return null;

  // Group consecutive period days into cycles
  const cycleStarts: string[] = [periodDays[0].date];

  for (let i = 1; i < periodDays.length; i++) {
    const prev = parseISO(periodDays[i - 1].date);
    const curr = parseISO(periodDays[i].date);
    const diff = differenceInDays(curr, prev);

    if (diff > 5) {
      // New cycle (gap of more than 5 days between period entries)
      cycleStarts.push(periodDays[i].date);
    }
  }

  if (cycleStarts.length < 2) return null;

  // Calculate cycle lengths
  const cycleLengths: number[] = [];
  for (let i = 1; i < cycleStarts.length; i++) {
    const len = differenceInDays(
      parseISO(cycleStarts[i]),
      parseISO(cycleStarts[i - 1])
    );
    if (len >= 18 && len <= 45) {
      // Filter out unreasonable lengths
      cycleLengths.push(len);
    }
  }

  if (cycleLengths.length === 0) return null;

  // Use last 3-6 cycles for average
  const recentCycles = cycleLengths.slice(-6);
  const avgLength = Math.round(
    recentCycles.reduce((sum, l) => sum + l, 0) / recentCycles.length
  );

  // Calculate average period duration
  let periodDuration = 5; // default
  const lastCycleStart = cycleStarts[cycleStarts.length - 1];
  const lastCycleDays = periodDays.filter((d) => {
    const diff = differenceInDays(parseISO(d.date), parseISO(lastCycleStart));
    return diff >= 0 && diff < 10;
  });
  if (lastCycleDays.length > 0) {
    periodDuration = lastCycleDays.length;
  }

  const nextStart = addDays(parseISO(lastCycleStart), avgLength);
  const nextEnd = addDays(nextStart, periodDuration - 1);

  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (recentCycles.length >= 4) confidence = 'high';
  else if (recentCycles.length >= 2) confidence = 'medium';

  return {
    averageCycleLength: avgLength,
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    confidence,
    cyclesUsed: recentCycles.length,
  };
}
