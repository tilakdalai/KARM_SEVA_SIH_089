import React, { useState } from 'react';
import { BadgeRecord } from '@/services/reviewService';
import {
  ShieldCheck,
  FileCheck,
  Award,
  GraduationCap,
  Crown,
  Medal,
  Star,
  ThumbsUp,
  TrendingUp,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface BadgePillProps {
  badge: BadgeRecord;
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
}

const getBadgeIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'FileCheck':
      return <FileCheck className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Medal':
      return <Medal className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'ThumbsUp':
      return <ThumbsUp className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    default:
      return <Award className={className} />;
  }
};

export const BadgePill: React.FC<BadgePillProps> = ({
  badge,
  size = 'md',
  showDetailsOnClick = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const isVerification = badge.badge_category === 'VERIFICATION';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const styleClasses = isVerification
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80'
    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100/80';

  return (
    <>
      <button
        type="button"
        onClick={() => showDetailsOnClick && setModalOpen(true)}
        className={`inline-flex items-center rounded-full border font-extrabold transition shadow-2xs ${sizeClasses} ${styleClasses}`}
        title={`Click to view criteria proof for ${badge.title}`}
      >
        {getBadgeIcon(badge.icon, `${iconSizes} shrink-0`)}
        <span>{badge.title}</span>
        {showDetailsOnClick && <Info className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />}
      </button>

      {/* Criteria Proof Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div
              className={`p-6 text-white ${
                isVerification
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-900'
                  : 'bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900'
              } space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-white/20">
                  {isVerification ? 'Statutory Verification Indicator' : 'Verified Performance Badge'}
                </span>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                  {getBadgeIcon(badge.icon, 'w-6 h-6 text-white')}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{badge.title}</h3>
                  <p className="text-xs text-white/80 leading-snug">{badge.description}</p>
                </div>
              </div>
            </div>

            {/* Criteria Checklist Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Why Worker Qualified for this Badge
                </span>
                <p className="text-[11px] text-slate-500">
                  Calculated deterministically by the KARM SEVA verification engine. Zero subjective claims.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                {badge.criteria_met.map((criterion, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{criterion.replace(/^✓\s*/, '')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Awarded: {new Date(badge.awarded_at).toLocaleDateString()}</span>
                <span className="text-emerald-700 font-bold">✓ Active & Re-verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
