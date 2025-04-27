import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className,
}: DashboardCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-500',
    secondary: 'bg-secondary-50 text-secondary-600',
    accent: 'bg-accent-50 text-accent-500',
    success: 'bg-success-50 text-success-500',
    warning: 'bg-warning-50 text-warning-600',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-2xl p-5 shadow-soft-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl", colorClasses[color])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium px-2 py-1 rounded-lg flex items-center gap-1",
            trend.isPositive ? "text-success-600 bg-success-50" : "text-destructive-600 bg-destructive-50"
          )}>
            <span>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="text-sm text-neutral-500 mb-1">{title}</h3>
        <p className="text-2xl font-montserrat font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}