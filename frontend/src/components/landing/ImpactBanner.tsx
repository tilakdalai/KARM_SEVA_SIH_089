import React from 'react';
import { useTranslation } from '@/i18n';
import { Users, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const ImpactBanner: React.FC = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      icon: <Users className="w-6 h-6 text-gov-saffron" />,
      count: t('impact.workers_count'),
      label: t('impact.workers_label'),
    },
    {
      icon: <MapPin className="w-6 h-6 text-gov-green" />,
      count: t('impact.districts_count'),
      label: t('impact.districts_label'),
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      count: t('impact.services_count'),
      label: t('impact.services_label'),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      count: t('impact.wage_rate'),
      label: t('impact.wage_label'),
    },
  ];

  return (
    <section className="bg-gradient-to-r from-gov-navyDark via-gov-navy to-slate-900 text-white py-12 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metrics.map((item, idx) => (
            <div key={idx} className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex justify-center">{item.icon}</div>
              <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {item.count}
              </p>
              <p className="text-xs text-slate-300 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
