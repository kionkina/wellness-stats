'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface DataPoint {
  date: string;
  value: number;
  average: number;
}

interface TrendChartProps {
  data: DataPoint[];
  dataKey?: string;
  color?: string;
  label: string;
  secondaryData?: DataPoint[];
  secondaryLabel?: string;
  secondaryColor?: string;
}

export function TrendChart({
  data,
  color = 'hsl(var(--primary))',
  label,
  secondaryData,
  secondaryLabel,
  secondaryColor = 'hsl(var(--chart-2))',
}: TrendChartProps) {
  // Merge datasets if secondary provided
  const mergedData = data.map((d) => {
    const secondary = secondaryData?.find((s) => s.date === d.date);
    return {
      date: d.date,
      [label]: d.value,
      [`${label} avg`]: d.average,
      ...(secondary
        ? {
            [secondaryLabel || 'Secondary']: secondary.value,
            [`${secondaryLabel || 'Secondary'} avg`]: secondary.average,
          }
        : {}),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={mergedData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'MMM d')}
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(d as string), 'EEE, MMM d')}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey={label}
          stroke={color}
          strokeWidth={1.5}
          dot={{ r: 2 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey={`${label} avg`}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          connectNulls
        />
        {secondaryData && secondaryLabel && (
          <>
            <Line
              type="monotone"
              dataKey={secondaryLabel}
              stroke={secondaryColor}
              strokeWidth={1.5}
              dot={{ r: 2 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey={`${secondaryLabel} avg`}
              stroke={secondaryColor}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
