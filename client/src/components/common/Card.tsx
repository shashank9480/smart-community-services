import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  dark?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  dark = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        dark ? 'ui-panel-dark p-6' : 'ui-card p-6',
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3 dark:border-slate-800">
          <div>
            {title && <h3 className={clsx('font-semibold text-base', dark ? 'text-white' : 'text-slate-900')}>{title}</h3>}
            {subtitle && <p className={clsx('text-xs mt-0.5', dark ? 'text-slate-400' : 'text-slate-500')}>{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
