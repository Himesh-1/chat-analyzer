
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, LabelList, Cell } from 'recharts';
import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface MessagesSentChartProps {
  data: CommunicationAnalysisOutput['totalMessagesSent'];
  userALabel: string;
  userBLabel: string;
}

const CustomizedLabel = (props: any) => {
    const { x, y, width, value, index, activeIndex } = props;
    const isActive = index === activeIndex;

    if (!value || !isActive) return null;

    return (
        <text
            x={x + width / 2}
            y={y + 20}
            fill={"#fff"}
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            style={{
                opacity: isActive ? 1 : 0,
                transform: `translateY(${isActive ? '0px' : '10px'})`,
                transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
                pointerEvents: 'none'
            }}
        >
            {value}
        </text>
    );
};


export function MessagesSentChart({ data, userALabel, userBLabel }: MessagesSentChartProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || 'dark';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = [
    { name: userALabel, messages: data.userA },
    { name: userBLabel, messages: data.userB },
  ];
  
  const tickColor = currentTheme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))';

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
            <linearGradient id="gradientUserA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={1}/>
            </linearGradient>
            <linearGradient id="gradientUserAHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(330, 70%, 60%)" stopOpacity={1}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={1}/>
            </linearGradient>
            
            <linearGradient id="gradientUserB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={1}/>
            </linearGradient>
            <linearGradient id="gradientUserBHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(260, 70%, 65%)" stopOpacity={1}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={1}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
        <YAxis stroke={tickColor} fontSize={12} />
        <Bar dataKey="messages" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={
                index === 0
                  ? activeIndex === index ? 'url(#gradientUserAHover)' : 'url(#gradientUserA)'
                  : activeIndex === index ? 'url(#gradientUserBHover)' : 'url(#gradientUserB)'
              }
              key={`cell-${index}`}
              onMouseEnter={() => handleMouseEnter(entry, index)}
            />
          ))}
          <LabelList
              dataKey="messages"
              content={<CustomizedLabel activeIndex={activeIndex} />}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
