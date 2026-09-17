import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export const CommunityImpactSection: React.FC = () => {
  const metrics = [
    {
      label: 'Direct Artisan Earnings Distributed',
      value: '₹4.82 Cr+',
      subtext: '100% statutory pay transferred directly via UPI/DBT',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    },
    {
      label: 'Verified Seva Partners Onboarded',
      value: '12,500+',
      subtext: 'Across 12 standardized occupational trade guilds',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/40 text-blue-900',
    },
    {
      label: 'Federated Seva Cooperatives',
      value: '42 Unions',
      subtext: 'Autonomous district unions governing fair local floor rates',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/40 text-purple-900',
    },
    {
      label: 'Aggregator Exploitation Avoided',
      value: '₹1.35 Cr+',
      subtext: 'Retained by local artisan households & welfare funds',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/40 text-amber-900',
    },
  ];

  const impactHighlights = [
    {
      stat: '98.4%',
      title: 'On-Time Job Completion Rate',
      desc: 'High reliability powered by proximity-based matching and standby cooperative replacement workers.',
    },
    {
      stat: '0%',
      title: 'Platform Extractive Commission',
      desc: 'KARM SEVA operates on non-profit digital public rails, eliminating speculative investor returns.',
    },
    {
      stat: '36',
      title: 'States & Union Territories Ready',
      desc: 'Pan-India location directory covering 700+ districts with geocoded cooperative boundary maps.',
    },
    {
      stat: '15 Min',
      title: 'Emergency SOS Response Benchmark',
      desc: 'Rapid emergency radial dispatch connecting citizens to immediate verified nearby standby partners.',
    },
  ];

  return (
    <section id="community-impact-section" className="py-16 bg-slate-50 border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Measurable Socio-Economic Outcomes
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
            Transforming Informal Labor into Dignified Livelihoods
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted leading-relaxed">
            Every booking through KARM SEVA strengthens local economies, funds artisan healthcare, and builds verifiable digital credit histories for micro-lending.
          </p>
        </div>

        {/* 4 Large Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <Card
              key={idx}
              className={`p-6 border ${m.color} hover:shadow-gov-hover transition-all flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  {m.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  SIH Impact
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
                  {m.value}
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 mt-1">
                  {m.label}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {m.subtext}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* 4 Bottom Benchmark Columns */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {impactHighlights.map((h, i) => (
              <div key={i} className={`space-y-1.5 ${i > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}>
                <div className="text-3xl font-black text-emerald-700 tracking-tight">
                  {h.stat}
                </div>
                <h4 className="font-extrabold text-sm text-gov-navy">
                  {h.title}
                </h4>
                <p className="text-xs text-gov-muted leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
