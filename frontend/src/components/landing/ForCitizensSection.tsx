import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Users,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Coins,
  CheckCircle2
} from 'lucide-react';

export const ForCitizensSection: React.FC = () => {
  const navigate = useNavigate();

  const citizenFeatures = [
    {
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      title: 'Explainable Smart Matching',
      desc: 'Our 5-factor matching algorithm evaluates skills, distance, floor rates, ratings, and workload balance with complete transparency ("Recommended because...").',
      tag: 'AI Powered',
    },
    {
      icon: <Coins className="w-5 h-5 text-emerald-600" />,
      title: 'Standardized Statutory Floor Rates',
      desc: 'Zero algorithm surge pricing. Standardized cooperative floor rates protect your household budget while guaranteeing fair compensation to artisans.',
      tag: 'Fair Pricing',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      title: '15-Minute Emergency SOS Radar',
      desc: 'Urgent pipeline bursts or electrical hazards trigger real-time radial GPS broadcast to nearby verified standby Seva Partners for swift assistance.',
      tag: 'SOS Radar',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      title: 'Consumer Grievance Conciliation',
      desc: 'Escrow protection holds funds until OTP shift completion. Any discrepancy is escalated directly to the local Seva Cooperative mediation desk.',
      tag: 'Escrow Safe',
    },
  ];

  return (
    <section id="for-citizens-section" className="py-16 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="info" size="md" icon={<Users className="w-3.5 h-3.5" />}>
                For Citizens & Households
              </Badge>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                नागरिक सेवा
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
              Reliable Local Services with Total Peace of Mind
            </h2>

            <p className="text-xs sm:text-sm text-gov-muted leading-relaxed max-w-2xl">
              Book skilled, cooperative-verified artisans with transparent rates, zero commission markups, live telemetry, and government-backed escrow security.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/customer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs sm:text-sm shadow-sm"
            >
              Enter Citizen Portal
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/customer/emergency')}
              leftIcon={<Zap className="w-4 h-4 text-red-500" />}
              className="font-bold text-xs sm:text-sm border-red-200 text-red-700 hover:bg-red-50"
            >
              15-Min Emergency SOS
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {citizenFeatures.map((feat, idx) => (
            <Card
              key={idx}
              className="p-5 border-slate-200 hover:border-blue-300 hover:shadow-gov-hover transition-all bg-slate-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-gov-navy leading-snug">
                  {feat.title}
                </h3>

                <p className="text-xs text-gov-muted leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center text-[11px] font-bold text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                <span>Verified Guarantee</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
