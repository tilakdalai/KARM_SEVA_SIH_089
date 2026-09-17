import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProfileCompletionBarProps {
  percentage: number;
}

export const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  percentage,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-2">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-gov-navy">
            Profile & Trust Passport Strength
          </span>
        </div>
        <span className="font-black text-gov-green">{percentage}% Complete</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gov-green to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage < 100 && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>Add emergency nominee & family welfare details to reach 100%</span>
          <Link
            to="/worker/profile"
            className="font-bold text-gov-green hover:underline inline-flex items-center gap-0.5"
          >
            <span>Complete Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};
