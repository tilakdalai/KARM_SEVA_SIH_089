import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Scale, Users, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export const WhatIsKarmSeva: React.FC = () => {
  const pillars = [
    {
      icon: <Award className="w-5 h-5 text-gov-saffron" />,
      title: 'Digital KARM ID Passport',
      description: 'Portable, tamper-proof digital credential verifying trade certifications, police verification, and verified job history.'
    },
    {
      icon: <Scale className="w-5 h-5 text-gov-green" />,
      title: 'Fair Wage & 100% Direct Payouts',
      description: 'Zero predatory aggregator commissions. Cooperative-benchmarked pricing where 100% of the service fee reaches the Seva Partner.'
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
      title: 'Cooperative Safety Net',
      description: 'Institutional backing ensuring continuous worker welfare, dispute mediation, sick leave auto-dispatch, and family social security.'
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600" />,
      title: 'Transparent Multi-Stakeholder Governance',
      description: 'Uniting Citizens, Seva Partners, Cooperatives, Enterprise Institutions, and Government Administrators under one unified platform.'
    }
  ];

  return (
    <section id="what-is-karm-seva" className="py-16 bg-gradient-to-b from-white to-slate-50 border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            National Digital Public Infrastructure
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
            What is <span className="text-gov-greenDark">KARM SEVA</span>?
          </h2>
          <p className="text-sm sm:text-base text-gov-muted leading-relaxed">
            <strong>KARM SEVA</strong> (कर्म सेवा) is India's next-generation cooperative workforce platform. We connect certified local tradespersons (<strong>Seva Partners</strong>) directly with households, enterprises, and government departments — transforming informal work through dignity, verified digital identities, and cooperative protection.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-gov-green/50 hover:shadow-lg transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-50 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-gov-navy group-hover:text-gov-green transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-gov-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Difference Callout */}
        <div className="rounded-2xl bg-gov-navy p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Service Commitment</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Built on Trust, Backed by Cooperative Law
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike commercial gig aggregators that penalize workers and charge inflated commissions, KARM SEVA is built on democratic cooperative principles. Workers retain their full dignity, set their own travel radius, and build verified lifelong credentials.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="#services-section"
              className="px-5 py-2.5 bg-gov-green hover:bg-gov-greenDark text-white text-xs font-bold rounded-xl shadow-md transition-all text-center"
            >
              Find a Service
            </a>
            <a
              href="#/register/worker"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all text-center"
            >
              Join as Seva Partner
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
