import React from 'react';
import { Card } from '@/components/common/Card';

interface EarningsStatCardProps {
  label: string;
  amount: number | string;
  subtext: string;
  icon?: React.ReactNode;
  variant?: 'green' | 'blue' | 'purple' | 'amber';
}

export const EarningsStatCard: React.FC<EarningsStatCardProps> = ({
  label,
  amount,
  subtext,
  icon,
  variant = 'green',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'green':
        return { text: 'text-emerald-800', bg: 'bg-emerald-50/60', border: 'border-emerald-200' };
      case 'blue':
        return { text: 'text-blue-900', bg: 'bg-blue-50/60', border: 'border-blue-200' };
      case 'purple':
        return { text: 'text-purple-900', bg: 'bg-purple-50/60', border: 'border-purple-200' };
      case 'amber':
        return { text: 'text-amber-900', bg: 'bg-amber-50/60', border: 'border-amber-200' };
    }
  };

  const style = getColors();

  return (
    <Card className={`p-4 border transition-all ${style.bg} ${style.border} shadow-xs`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon}
      </div>

      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-2xl sm:text-3xl font-black ${style.text}`}>
          {typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount}
        </span>
      </div>

      <span className="text-[11px] text-slate-600 font-medium block mt-1">
        {subtext}
      </span>
    </Card>
  );
};
