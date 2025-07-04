
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
                transition: 'opacity 0.2s ease, transform 0.2s ease',
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
    { name: userALabel, messages: data.userA, fill: "hsl(var(--chart-1))" },
    { name: userBLabel, messages: data.userB, fill: "hsl(var(--chart-2))" },
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
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke={tickColor} fontSize={12} />
        <YAxis stroke={tickColor} fontSize={12} />
        <Bar dataKey="messages" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={entry.fill}
              key={`cell-${index}`}
              onMouseEnter={() => handleMouseEnter(entry, index)}
              style={{
                filter: activeIndex === index ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))' : 'none',
                transition: 'filter 0.2s ease',
              }}
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
