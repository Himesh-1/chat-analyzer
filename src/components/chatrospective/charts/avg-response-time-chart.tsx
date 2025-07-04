
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, LabelList, Cell } from 'recharts';
import type { CommunicationAnalysisOutput } from '@/ai/flows/communication-analysis';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface AvgResponseTimeChartProps {
  data: CommunicationAnalysisOutput['averageResponseTime'];
  userALabel: string;
  userBLabel: string;
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return 'N/A';
  if (seconds === 0) return '0s';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${remainingMinutes}m`;
}

const CustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index, activeIndex } = props;
    const isActive = index === activeIndex;

    if (value === undefined || value === null || height < 20) return null;

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
                transition: 'opacity 0.2s ease-in-out, transform 0.3s ease-in-out',
                pointerEvents: 'none'
            }}
        >
            {formatDuration(value)}
        </text>
    );
};

export function AvgResponseTimeChart({ data, userALabel, userBLabel }: AvgResponseTimeChartProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || 'dark';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = [
    { name: userALabel, time: data.userA, fill: "hsl(var(--chart-3))" },
    { name: userBLabel, time: data.userB, fill: "hsl(var(--chart-4))" },
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
        <YAxis 
            label={{ value: 'Time', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 10 }} 
            stroke={tickColor} 
            fontSize={12}
            tickFormatter={(value) => {
              if (value < 60) return `${value}s`;
              if (value < 3600) return `${Math.round(value/60)}m`;
              return `${Math.round(value/3600)}h`;
            }}
         />
        <Bar dataKey="time" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
                <Cell 
                  cursor="pointer" 
                  fill={entry.fill} 
                  key={`cell-${index}`} 
                  onMouseEnter={() => handleMouseEnter(entry, index)} 
                />
            ))}
            <LabelList 
                dataKey="time" 
                content={<CustomizedLabel activeIndex={activeIndex} />} 
            />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
