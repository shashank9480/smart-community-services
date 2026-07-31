import React from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isIncrease?: boolean;
  dark?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  isIncrease = true,
  dark = false,
}) => {
  return (
    <div className={clsx(dark ? 'ui-panel-dark p-5' : 'ui-card p-5')}>
      <div className="flex items-center justify-between">
        <div>
          <p className={clsx('text-xs font-semibold uppercase tracking-wider', dark ? 'text-slate-400' : 'text-slate-500')}>
            {label}
          </p>
          <h4 className={clsx('text-2xl font-bold mt-1 font-mono', dark ? 'text-white' : 'text-slate-900')}>
            {value}
          </h4>
        </div>
        <div className={clsx('p-3 rounded-xl shrink-0', dark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          <span className={clsx(isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
            {isIncrease ? '↑' : '↓'} {change}
          </span>
          <span className={clsx(dark ? 'text-slate-400' : 'text-slate-500')}>vs last month</span>
        </div>
      )}
    </div>
  );
};
