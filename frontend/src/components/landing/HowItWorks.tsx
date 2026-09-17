import React from 'react';
import { useTranslation } from '@/i18n';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  Search,
  UserCheck,
  CalendarCheck,
  Compass,
  CreditCard,
  Star,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      num: '01',
      title: t('how_it_works.step_1_title'),
      desc: t('how_it_works.step_1_desc'),
      icon: <Search className="w-5 h-5 text-blue-600" />,
      badge: 'Quick Discovery',
    },
    {
      num: '02',
      title: t('how_it_works.step_2_title'),
      desc: t('how_it_works.step_2_desc'),
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      badge: 'Explainable AI Match',
    },
    {
      num: '03',
      title: t('how_it_works.step_3_title'),
      desc: t('how_it_works.step_3_desc'),
      icon: <CalendarCheck className="w-5 h-5 text-purple-600" />,
      badge: 'Preferred Radius Match',
    },
    {
      num: '04',
      title: t('how_it_works.step_4_title'),
      desc: t('how_it_works.step_4_desc'),
      icon: <Compass className="w-5 h-5 text-amber-600" />,
      badge: 'Live Status & Backup',
    },
    {
      num: '05',
      title: t('how_it_works.step_5_title'),
      desc: t('how_it_works.step_5_desc'),
      icon: <CreditCard className="w-5 h-5 text-teal-600" />,
      badge: 'Pay Actual Worker',
    },
    {
      num: '06',
      title: t('how_it_works.step_6_title'),
      desc: t('how_it_works.step_6_desc'),
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      badge: 'Digital KARM ID Passport',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-14 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Transparent Public Value Chain
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            {t('how_it_works.section_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted">
            {t('how_it_works.section_subtitle')}
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <Card
              key={idx}
              className="relative p-5 border-slate-200 hover:border-gov-green/50 hover:shadow-gov-hover transition-all space-y-3 bg-slate-50/50"
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-gov-navy text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {step.num}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {step.badge}
                </span>
              </div>

              {/* Step Icon & Title */}
              <div className="flex items-center space-x-2.5 pt-1">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {step.icon}
                </div>
                <h3 className="font-extrabold text-sm text-gov-navy leading-snug">
                  {step.title}
                </h3>
              </div>

              {/* Step Description */}
              <p className="text-xs text-gov-muted leading-relaxed">
                {step.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom Callout: Cooperative Advantage */}
        <div className="bg-gradient-to-r from-gov-navyDark via-gov-navy to-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Digital Infrastructure Guarantee</span>
            </div>
            <h4 className="font-extrabold text-base sm:text-lg">
              No Wage Theft · Guaranteed Continuity · Certified Qualifications
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Unlike private platform algorithms that squeeze worker payouts, KARM SEVA provides transparent transaction ledgers, worker radius freedom, and medical leave backup.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
