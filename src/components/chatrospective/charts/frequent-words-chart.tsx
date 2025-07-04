
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, LabelList } from 'recharts';
import { useTheme } from 'next-themes';

interface FrequentWordsChartProps {
  data: { word: string; count: number }[];
}

export function FrequentWordsChart({ data }: FrequentWordsChartProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || 'dark';

  const tickColor = currentTheme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))';

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[200px]"><p className="text-muted-foreground text-sm">No specific words found.</p></div>;
  }

  // Gracefully handle old data format from localStorage
  if (typeof data[0] === 'string' || data[0].count === undefined) {
    return (
        <div className="flex items-center justify-center h-[200px] p-4 text-center">
            <p className="text-muted-foreground text-sm">
                The data format for this chart has been updated. Please re-analyze your chat log to see word counts.
            </p>
        </div>
    );
  }

  // The data from the service is already sorted descending.
  const chartData = [...(data || [])];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
      >
        <defs>
            <linearGradient id="gradientWords" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={1}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="word"
          stroke={tickColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
          tick={{ dx: -5, fill: tickColor, style: { textAnchor: 'end' } }}
          reversed={true}
        />
        <Bar dataKey="count" fill="url(#gradientWords)" radius={[0, 4, 4, 0]} barSize={20}>
          <LabelList dataKey="count" position="right" offset={5} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
