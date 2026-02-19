'use client';

import HeatMap from '@uiw/react-heat-map';
import { subDays } from 'date-fns';

interface CalendarHeatmapProps {
  data: { date: string; count: number }[];
  metric?: string;
}

export function CalendarHeatmap({ data, metric = 'mood' }: CalendarHeatmapProps) {
  const endDate = new Date();
  const startDate = subDays(endDate, 365);

  // Mood/energy use -2 to 2 range, others keep original scales
  const panelColors: Record<string, Record<number, string>> = {
    mood: {
      0: '#ebedf0',    // no data
      '-2': '#fecaca',  // Awful
      '-1': '#fdba74',  // Bad
      1: '#fde047',     // Okay (mapped from 0 score)
      2: '#86efac',     // Good
      3: '#4ade80',     // Great
    },
    energy: {
      0: '#ebedf0',
      '-2': '#e0e7ff',
      '-1': '#c7d2fe',
      1: '#a5b4fc',
      2: '#818cf8',
      3: '#6366f1',
    },
    appetite: {
      0: '#ebedf0',
      1: '#fef3c7',
      2: '#fde68a',
      3: '#fbbf24',
      4: '#f59e0b',
      5: '#d97706',
    },
    sleep: {
      0: '#ebedf0',
      2: '#fecaca',
      4: '#fdba74',
      6: '#fde047',
      8: '#86efac',
      10: '#4ade80',
    },
  };

  // For mood/energy, shift score from [-2,2] to [1,5] for the heatmap color mapping
  const shiftedData = (metric === 'mood' || metric === 'energy')
    ? data.map((d) => ({ date: d.date, count: d.count === 0 ? 0 : d.count + 3 }))
    : data;

  // Use shifted color keys for mood/energy
  const shiftedColors: Record<string, Record<number, string>> = {
    mood: {
      0: '#ebedf0',
      1: '#fecaca',
      2: '#fdba74',
      3: '#fde047',
      4: '#86efac',
      5: '#4ade80',
    },
    energy: {
      0: '#ebedf0',
      1: '#e0e7ff',
      2: '#c7d2fe',
      3: '#a5b4fc',
      4: '#818cf8',
      5: '#6366f1',
    },
  };

  const colors = (metric === 'mood' || metric === 'energy')
    ? shiftedColors[metric]
    : panelColors[metric] || panelColors.mood;

  const scoreLabels: Record<number, string> = metric === 'mood' || metric === 'energy'
    ? { 1: '-2', 2: '-1', 3: '0', 4: '+1', 5: '+2' }
    : {};

  return (
    <div className="overflow-x-auto">
      <HeatMap
        value={shiftedData.map((d) => ({ date: d.date, count: d.count }))}
        startDate={startDate}
        endDate={endDate}
        width={720}
        rectSize={12}
        space={3}
        style={{ color: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        legendCellSize={0}
        panelColors={colors}
        rectProps={{
          rx: 2,
        }}
        rectRender={(props, data) => {
          const displayValue = scoreLabels[data.count ?? 0]
            ? `${metric} ${scoreLabels[data.count ?? 0]}`
            : `${metric} ${data.count || 'N/A'}`;
          return (
            <rect
              {...props}
              rx={2}
              ry={2}
            >
              <title>{`${data.date}: ${displayValue}`}</title>
            </rect>
          );
        }}
      />
    </div>
  );
}
