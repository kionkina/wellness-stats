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

  const panelColors: Record<string, Record<number, string>> = {
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
    appetite: {
      0: '#ebedf0',
      1: '#fef3c7',
      2: '#fde68a',
      3: '#fbbf24',
      4: '#f59e0b',
      5: '#d97706',
    },
  };

  const colors = panelColors[metric] || panelColors.mood;

  return (
    <div className="overflow-x-auto">
      <HeatMap
        value={data.map((d) => ({ date: d.date, count: d.count }))}
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
          return (
            <rect
              {...props}
              rx={2}
              ry={2}
            >
              <title>{`${data.date}: ${metric} ${data.count || 'N/A'}`}</title>
            </rect>
          );
        }}
      />
    </div>
  );
}
