import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, colorClass }) {
  return (
    <Card className="relative overflow-hidden p-5 hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-heading font-bold">{value}</p>
          {subtitle && (
            <div className="flex items-center gap-1.5">
              {trend && (
                <span className={cn(
                  "text-xs font-semibold",
                  trendUp ? "text-emerald-600" : "text-destructive"
                )}>
                  {trend}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          colorClass || "bg-primary/10"
        )}>
          <Icon className={cn("w-5 h-5", colorClass ? "text-white" : "text-primary")} />
        </div>
      </div>
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity",
        colorClass || "bg-primary"
      )} />
    </Card>
  );
}