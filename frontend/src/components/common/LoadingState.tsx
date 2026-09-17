import React from 'react';
import { Loader2 } from 'lucide-react';

export type LoadingVariant = 'spinner' | 'skeleton-cards' | 'skeleton-table' | 'skeleton-metrics' | 'skeleton-text';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  minHeight?: string;
  variant?: LoadingVariant;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading verified platform data...',
  subMessage = 'Connecting with Odisha Labour Cooperative database',
  minHeight = 'min-h-[260px]',
  variant = 'spinner',
  count = 3,
}) => {
  if (variant === 'skeleton-metrics') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
            </div>
            <div className="h-7 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'skeleton-cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-slate-200 rounded-full w-20" />
              <div className="h-8 bg-slate-200 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
          <div className="h-4 bg-slate-200 rounded w-32" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-20 ml-auto" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/4" />
              </div>
              <div className="h-3.5 bg-slate-100 rounded w-24" />
              <div className="h-3.5 bg-slate-100 rounded w-20" />
              <div className="h-7 bg-slate-200 rounded-lg w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'skeleton-text') {
    return (
      <div className="space-y-2.5 animate-pulse py-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3.5 bg-slate-100 rounded w-full" />
        <div className="h-3.5 bg-slate-100 rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${minHeight} bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gov-navy/10 border-t-gov-navy animate-spin" />
        <Loader2 className="w-5 h-5 text-gov-navy absolute inset-0 m-auto animate-pulse" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-gov-navy tracking-tight">{message}</h3>
      {subMessage && <p className="mt-1 text-xs text-slate-500 max-w-sm">{subMessage}</p>}
    </div>
  );
};
