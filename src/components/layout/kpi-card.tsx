import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}

const trendColor = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
};

export function KpiCard({ label, value, icon: Icon, trend }: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-body-s text-muted-foreground font-medium">{label}</CardTitle>
                <Icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
                <div className="text-h3">{value}</div>
                {trend && (
                    <p className={cn('text-caption mt-1', trendColor[trend.direction])}>{trend.value}</p>
                )}
            </CardContent>
        </Card>
    );
}