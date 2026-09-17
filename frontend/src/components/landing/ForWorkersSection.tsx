import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import {
  Wrench,
  Award,
  MapPin,
  Coins,
  ArrowRight,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

export const ForWorkersSection: React.FC = () => {
  const navigate = useNavigate();

  const workerFeatures = [
    {
      icon: <Coins className="w-5 h-5 text-emerald-600" />,
      title: 'Direct 85% Wage Payout via UPI',
      desc: 'No middleman deductions. 85% of customer payment is credited directly to your bank account via sovereign UPI rails with full settlement transparency.',
      tag: 'Direct Payout',
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600" />,
      title: 'Digital KARM ID & Skill Credential',
      desc: 'A tamper-proof national skill dossier linked to DigiLocker and ITI certifications. Carry your verifiable reputation wherever you work across India.',
      tag: 'KARM ID',
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: 'Custom Commute Radius (1 - 10 km)',
      desc: 'Set your preferred operational radius. Receive jobs near your home so you spend less time commuting and more time earning.',
      tag: 'Your Terms',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-purple-600" />,
      title: 'Leave & Sick Replacement Protection',
      desc: 'Take medical or family leave with dignity. The Seva Cooperative replacement desk handles coverage without penalizing your platform rating.',
      tag: 'Social Security',
    },
  ];

  return (
    <section id="for-workers-section" className="py-16 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                For Seva Partners (Workers & Artisans)
              </span>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                सेवा साथी
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Work with Dignity, Fair Wages & Full Cooperative Support
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Break free from predatory aggregator commissions. Join India's sovereign cooperative platform that guarantees timely direct payments, portable digital credentials, and social security.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/register/worker')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs sm:text-sm shadow-md"
            >
              Become a Seva Partner
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/worker')}
              className="font-bold text-xs sm:text-sm border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Enter Partner Portal
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workerFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xs">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-white leading-snug">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Worker Dignity Guaranteed</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
