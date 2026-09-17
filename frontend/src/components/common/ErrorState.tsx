import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  minHeight?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Information',
  message = 'A temporary connection error occurred while reaching the cooperative service cluster. Please try refreshing.',
  onRetry,
  minHeight = 'min-h-[260px]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${minHeight} bg-rose-50/50 rounded-2xl border border-rose-100 shadow-sm`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-slate-600 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="border-rose-200 text-rose-700 hover:bg-rose-100/70 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
};
