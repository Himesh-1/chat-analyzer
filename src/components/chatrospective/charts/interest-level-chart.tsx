
"use client";

import { RadialBar, RadialBarChart, Legend, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { useTheme } from 'next-themes';

interface InterestLevelChartProps {
  data: CommunicationAnalysisOutput['interestLevel'];
  userALabel: string;
  userBLabel: string;
}

export function InterestLevelChart({ data, userALabel, userBLabel }: InterestLevelChartProps) {
  const { resolvedTheme } = useTheme();
  
  // Recharts expects an array of data. We'll transform our object.
  const chartData = [
    { name: userBLabel, value: data.userB, fill: 'hsl(var(--chart-2))' },
    { name: userALabel, value: data.userA, fill: 'hsl(var(--chart-1))' },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        innerRadius="25%"
        outerRadius="80%"
        data={chartData}
        startAngle={180}
        endAngle={0}
        barSize={15}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          angleAxisId={0}
          className="[&_.recharts-radial-bar-background-sector]:fill-muted/50"
        />
        <Legend
          iconSize={10}
          wrapperStyle={{ fontSize: '12px', bottom: -10 }}
        />
        <Tooltip
          cursor={{
            fill: 'hsl(var(--accent) / 0.1)'
          }}
          contentStyle={{ 
            fontSize: '12px',
            borderRadius: 'var(--radius)', 
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--background))',
          }}
          formatter={(value) => [`${(value as number).toFixed(0)}%`, "Interest"]}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

    