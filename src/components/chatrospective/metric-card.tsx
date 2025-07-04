import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  chartHeight?: string;
}

export function MetricCard({ title, icon: Icon, children, className, chartHeight }: MetricCardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-primary/30 transition-all ease-in-out duration-300 hover:scale-[1.02]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent style={chartHeight ? { height: chartHeight } : {}}>
        {children}
      </CardContent>
    </Card>
  );
}

// Helper for cn if not globally available in this file scope
// In a real setup, cn would be imported from '@/lib/utils'
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
