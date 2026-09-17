import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EmptyAnalyticsStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyAnalyticsState: React.FC<EmptyAnalyticsStateProps> = ({
  title = 'No Data Available For Selected Interval',
  description = 'There are no verified transactions or job records for this duration or selected filters.',
  actionText = 'Reset Filter to 30 Days',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center my-6">
      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3">
        <BarChart3 className="w-6 h-6 text-slate-500 dark:text-slate-400" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
