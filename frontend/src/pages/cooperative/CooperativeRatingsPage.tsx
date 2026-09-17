import React from 'react';
import { Star } from 'lucide-react';

export const CooperativeRatingsPage: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      workerName: 'Ramesh Chandra Behera',
      shramId: 'KS-OD-2024-8841',
      trade: 'Master Electrician',
      rating: 5.0,
      customerName: 'Amiya Patnaik (Saheed Nagar)',
      comment: 'Very professional, diagnosed the tripping MCB in 15 minutes. Replaced the fuse safely with rubber gloves and standard safety gear.',
      date: 'Today, 11:45 AM',
      tags: ['Punctual', 'Clean Work', 'Polite'],
    },
    {
      id: 'rev-2',
      workerName: 'Sunita Majhi',
      shramId: 'KS-OD-2024-3912',
      trade: 'Senior Patient Caregiver',
      rating: 5.0,
      customerName: 'Dr. Smita Mishra (Nayapalli)',
      comment: 'Excellent care for my elderly mother post surgery. Checked vitals and administered insulin strictly on schedule.',
      date: 'Yesterday, 07:30 PM',
      tags: ['Caring', 'Experienced', 'Hygiene Standard'],
    },
    {
      id: 'rev-3',
      workerName: 'Tapan Kumar Das',
      shramId: 'KS-OD-2024-1044',
      trade: 'Master Plumber',
      rating: 4.5,
      customerName: 'Debabrata Das (Chandrasekharpur)',
      comment: 'Fixed the overhead tank leak cleanly. Standard rate was clear up-front without haggling.',
      date: 'Yesterday, 04:00 PM',
      tags: ['No Hidden Charges', 'Fast Service'],
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Member Quality & Citizen Ratings
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              4.88 Union Aggregate
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Citizen service feedback, skill badges, punctuality metrics, and quality improvement coaching triggers.
          </p>
        </div>
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{r.workerName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{r.shramId}</div>
                  <div className="text-xs text-slate-600 font-semibold">{r.trade}</div>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {r.rating.toFixed(1)}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{r.comment}"
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {r.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{r.customerName}</span>
              <span>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
