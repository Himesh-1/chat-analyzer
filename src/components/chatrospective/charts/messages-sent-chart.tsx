
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { useTheme } from 'next-themes'; 

interface MessagesSentChartProps {
  data: CommunicationAnalysisOutput['totalMessagesSent'];
  userALabel: string;
  userBLabel: string;
}

export function MessagesSentChart({ data, userALabel, userBLabel }: MessagesSentChartProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || 'dark';


  const chartData = [
    { name: userALabel, messages: data.userA, fill: "hsl(var(--chart-1))" },
    { name: userBLabel, messages: data.userB, fill: "hsl(var(--chart-2))" },
  ];
  
  const tickColor = currentTheme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
        <YAxis stroke={tickColor} fontSize={12} />
        <Tooltip
          cursor={{ fill: 'hsla(var(--muted), 0.5)' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar dataKey="messages" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
