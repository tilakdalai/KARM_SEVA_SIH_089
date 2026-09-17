import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Building2
} from 'lucide-react';
import { InstallAppButton } from '@/components/common/InstallAppButton';

interface HeroSectionProps {
  onSearch: (trade: string, location: string, timing: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedTrade, setSelectedTrade] = useState('');
  const [location, setLocation] = useState('Bhubaneswar, Odisha (751012)');
  const [timing, setTiming] = useState('today');

  const popularTrades = [
    'Electrician',
    'Plumber',
    'Caregiver',
    'Deep Cleaner',
    'Carpenter',
    'Painter',
    'Technician'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedTrade || 'All Services', location, timing);
  };

  const handleWorkerRegister = () => {
    navigate('/register/worker');
  };

  const handleFindServiceClick = () => {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/customer/services');
  };

  return (
    <section className="relative bg-white border-b border-gov-border pt-10 pb-14 overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gov-saffron/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-green/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-5">
            {/* National Initiative Badge */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                {t('hero.badge')}
              </Badge>
              <span className="text-[11px] font-bold text-gov-greenDark bg-gov-green/10 px-2.5 py-0.5 rounded-full border border-gov-green/20">
                100% Cooperative Verified
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gov-navy leading-[1.15] tracking-tight">
              {t('hero.heading_main')}{' '}
              <span className="text-gov-greenDark underline decoration-gov-saffron decoration-4 underline-offset-4">
                {t('hero.heading_highlight')}
              </span>
            </h1>

            {/* Understandable Explanation */}
            <p className="text-sm sm:text-base text-gov-muted leading-relaxed max-w-2xl">
              {t('hero.subtext')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleFindServiceClick}
                leftIcon={<Search className="w-4 h-4" />}
              >
                {t('hero.cta_find')}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleWorkerRegister}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t('hero.cta_worker')}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/institution')}
                leftIcon={<Building2 className="w-4 h-4 text-purple-600" />}
              >
                For Institutions
              </Button>

              <InstallAppButton variant="hero" />
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-700 font-semibold border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gov-green" />
                <span>{t('hero.trust_tag_1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gov-green" />
                <span>{t('hero.trust_tag_2')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gov-green" />
                <span>{t('hero.trust_tag_3')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Service Search Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gov-border rounded-xl shadow-lg p-5 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-sm sm:text-base text-gov-navy flex items-center gap-2">
                    <Search className="w-4 h-4 text-gov-green" />
                    <span>Quick Service Discovery</span>
                  </h2>
                  <span className="text-[10px] font-bold text-gov-greenDark bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Portal
                  </span>
                </div>
                <p className="text-[11px] text-gov-muted mt-0.5">
                  Instant matching with nearby verified cooperative tradespersons
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-3.5">
                {/* 1. Trade Selector */}
                <div>
                  <label className="block text-xs font-bold text-gov-text mb-1">
                    Select Required Trade / Service
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedTrade}
                      onChange={(e) => setSelectedTrade(e.target.value)}
                      placeholder={t('hero.search_placeholder')}
                      className="w-full text-xs font-medium border border-gov-border rounded-lg pl-3 pr-8 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    />
                    <Zap className="absolute right-2.5 top-3 w-4 h-4 text-amber-500 pointer-events-none" />
                  </div>
                </div>

                {/* Popular Trade Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {popularTrades.slice(0, 5).map((trade) => (
                    <button
                      key={trade}
                      type="button"
                      onClick={() => setSelectedTrade(trade)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-colors ${
                        selectedTrade === trade
                          ? 'bg-gov-navy text-white border-gov-navy'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {trade}
                    </button>
                  ))}
                </div>

                {/* 2. Location Input */}
                <div>
                  <label className="block text-xs font-bold text-gov-text mb-1">
                    Service Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gov-muted pointer-events-none" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('hero.location_placeholder')}
                      className="w-full text-xs font-medium border border-gov-border rounded-lg pl-8 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                      required
                    />
                  </div>
                </div>

                {/* 3. Timing / Urgency */}
                <div>
                  <label className="block text-xs font-bold text-gov-text mb-1">
                    {t('hero.timing_label')}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTiming('immediate')}
                      className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        timing === 'immediate'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ⚡ Immediate (1h)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTiming('today')}
                      className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        timing === 'today'
                          ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      📅 Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setTiming('scheduled')}
                      className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border text-center transition-all ${
                        timing === 'scheduled'
                          ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🕒 Later / Recurring
                    </button>
                  </div>
                </div>

                {/* Submit Search Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 text-xs font-bold"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  {t('hero.btn_search')}
                </Button>
              </form>

              {/* Bottom Assurance Note */}
              <div className="pt-2 text-[10px] text-gov-muted flex items-center justify-between border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
                  <span>Aadhaar/Skill Verified Seva Partners Only</span>
                </span>
                <span className="font-semibold text-gov-navy">Zero Commission Cuts</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
