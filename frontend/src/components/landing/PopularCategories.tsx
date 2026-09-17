import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Car,
  HeartPulse,
  HeartHandshake,
  Baby,
  Sparkles,
  Home,
  Flower2,
  Tv,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CategoryConfig {
  key: string;
  icon: React.ReactNode;
  badge: string;
  isPopular?: boolean;
}

interface PopularCategoriesProps {
  onSelectCategory: (categoryKey: string, categoryTitle: string) => void;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ onSelectCategory }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'maintenance' | 'caregiving' | 'household'>('all');

  const categories: CategoryConfig[] = [
    { key: 'electrician', icon: <Zap className="w-5 h-5 text-amber-600" />, badge: 'Licensed ITI', isPopular: true },
    { key: 'plumber', icon: <Droplets className="w-5 h-5 text-blue-600" />, badge: 'Experience Verified', isPopular: true },
    { key: 'carpenter', icon: <Hammer className="w-5 h-5 text-amber-700" />, badge: 'Certified Guild' },
    { key: 'painter', icon: <Paintbrush className="w-5 h-5 text-purple-600" />, badge: 'Surface Certified' },
    { key: 'driver', icon: <Car className="w-5 h-5 text-indigo-600" />, badge: 'Commercial License', isPopular: true },
    { key: 'patient_caregiver', icon: <HeartPulse className="w-5 h-5 text-red-600" />, badge: 'Nursing Certified', isPopular: true },
    { key: 'elderly_caregiver', icon: <HeartHandshake className="w-5 h-5 text-rose-600" />, badge: 'Elderly Care Certified', isPopular: true },
    { key: 'child_caregiver', icon: <Baby className="w-5 h-5 text-pink-600" />, badge: 'Child Care Verified' },
    { key: 'cleaner', icon: <Sparkles className="w-5 h-5 text-emerald-600" />, badge: 'Deep Clean Trained', isPopular: true },
    { key: 'domestic_helper', icon: <Home className="w-5 h-5 text-teal-600" />, badge: 'Police Verified' },
    { key: 'gardener', icon: <Flower2 className="w-5 h-5 text-green-600" />, badge: 'Horticulture Trained' },
    { key: 'technician', icon: <Tv className="w-5 h-5 text-cyan-600" />, badge: 'OEM Certified' },
  ];

  const getFilteredCategories = () => {
    if (activeFilter === 'caregiving') {
      return categories.filter((c) => ['patient_caregiver', 'elderly_caregiver', 'child_caregiver'].includes(c.key));
    }
    if (activeFilter === 'maintenance') {
      return categories.filter((c) => ['electrician', 'plumber', 'carpenter', 'painter', 'technician'].includes(c.key));
    }
    if (activeFilter === 'household') {
      return categories.filter((c) => ['cleaner', 'domestic_helper', 'gardener', 'driver'].includes(c.key));
    }
    return categories;
  };

  return (
    <section id="services-section" className="py-14 bg-gov-bg border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header and Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gov-green">
                Public Service Roster
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gov-green" />
              <span className="text-[11px] font-semibold text-gov-muted">12 Registered Trades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
              {t('categories.section_title')}
            </h2>
            <p className="text-xs sm:text-sm text-gov-muted mt-1 max-w-2xl">
              {t('categories.section_subtitle')}
            </p>
          </div>

          {/* Trade Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gov-border self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-gov-text hover:bg-slate-100'
              }`}
            >
              All Trades (12)
            </button>
            <button
              onClick={() => setActiveFilter('maintenance')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeFilter === 'maintenance'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-gov-text hover:bg-slate-100'
              }`}
            >
              Home Maintenance
            </button>
            <button
              onClick={() => setActiveFilter('caregiving')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeFilter === 'caregiving'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-gov-text hover:bg-slate-100'
              }`}
            >
              Caregiving & Nursing
            </button>
            <button
              onClick={() => setActiveFilter('household')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeFilter === 'household'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-gov-text hover:bg-slate-100'
              }`}
            >
              Household & Transport
            </button>
          </div>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getFilteredCategories().map((cat) => {
            const title = t(`categories.items.${cat.key}.title`);
            const vernacular = t(`categories.items.${cat.key}.vernacular`);
            const description = t(`categories.items.${cat.key}.description`);
            const rate = t(`categories.items.${cat.key}.rate`);

            return (
              <Card
                key={cat.key}
                className="hover:border-gov-green/60 hover:shadow-gov-hover transition-all flex flex-col justify-between group cursor-pointer border-slate-200"
                onClick={() => onSelectCategory(cat.key, title)}
              >
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-50 transition-all">
                      {cat.icon}
                    </div>
                    {cat.isPopular && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        High Demand
                      </span>
                    )}
                  </div>

                  {/* Title & Vernacular Name */}
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-gov-navy group-hover:text-gov-green transition-colors flex items-center justify-between">
                      <span>{title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gov-green group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-[11px] font-semibold text-gov-greenDark mt-0.5">
                      {vernacular}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gov-muted line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Card Footer: Rate & Trust Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gov-muted block leading-none">
                      {t('categories.starting_from')}
                    </span>
                    <span className="font-black text-sm text-gov-navy">
                      {rate}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        {t('categories.unit_shift')}
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gov-green" />
                    <span>{cat.badge}</span>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-4 rounded-xl bg-white border border-gov-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-gov-green shrink-0" />
            <span>
              <strong>Zero Hidden Charges:</strong> All prices are established transparently by certified Labour Cooperatives under fair wage benchmarks.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectCategory('all', 'All Services')}
          >
            {t('categories.view_all')}
          </Button>
        </div>

      </div>
    </section>
  );
};
