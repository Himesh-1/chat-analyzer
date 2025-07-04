
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from 'next-themes';

interface FrequentWordsChartProps {
  words: string[];
}

export function FrequentWordsChart({ words }: FrequentWordsChartProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || 'dark';

  // Transform the word list into data suitable for the chart, assigning descending values.
  // Reverse the array so the most frequent word (first in the list) appears at the top.
  const chartData = [...words].reverse().map((word, index) => ({
    word,
    // Assign a value based on rank for visualization purposes.
    value: 100 - (index * (90 / (words.length || 1))), 
  }));

  const tickColor = currentTheme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))';

  if (!words || words.length === 0) {
    return <div className="flex items-center justify-center h-[200px]"><p className="text-muted-foreground text-sm">No specific words found.</p></div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
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
        />
        <Bar dataKey="value" fill="url(#gradientWords)" radius={[0, 4, 4, 0]} barSize={20}>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
