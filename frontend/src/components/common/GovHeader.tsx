import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useAccessibility, FontSizeOption } from '@/context/AccessibilityContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { healthService } from '@/services/healthService';
import { PhoneCall, Eye, LogIn, UserPlus } from 'lucide-react';
import { InstallAppButton } from '@/components/common/InstallAppButton';

export const GovHeader: React.FC = () => {
  const { t } = useTranslation();
  const { fontSize, setFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    healthService.checkBackendHealth().then((res) => {
      if (isMounted) {
        setIsBackendHealthy(res.database_connected || res.status === 'healthy');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="w-full bg-white border-b border-gov-border">
      {/* Top Tricolor Ribbon */}
      <div className="gov-ribbon w-full" />

      {/* Official Government Metadata Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap justify-between items-center text-xs text-gov-muted border-b border-slate-100 gap-2">
        {/* Left: Initiative & National Helpline */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-full bg-gov-navy text-white flex items-center justify-center font-black text-[9px]">
              GOV
            </div>
            <span className="font-semibold text-gov-text text-[11px]">
              National Digital Labour Cooperative Initiative (Ministry of Labour & Employment)
            </span>
          </div>
          <span className="hidden lg:inline text-slate-300">|</span>
          <div className="hidden sm:flex items-center space-x-1 text-gov-navyDark font-medium text-[11px]">
            <PhoneCall className="w-3 h-3 text-gov-green" />
            <span>1800-KARM-00 (Toll-Free)</span>
          </div>
        </div>

        {/* Right: Accessibility Controls, Language & Auth Links */}
        <div className="flex items-center space-x-2.5">
          {/* Accessibility: Font Scaling */}
          <div className="hidden md:flex items-center space-x-0.5 bg-slate-100/90 rounded-lg border border-slate-200 p-0.5" title="Font Size Adjustment">
            {(['normal', 'large', 'xlarge'] as FontSizeOption[]).map((scale) => (
              <button
                key={scale}
                onClick={() => setFontSize(scale)}
                aria-label={`Set font size to ${scale}`}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  fontSize === scale
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {scale === 'normal' ? 'A' : scale === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          {/* Accessibility: High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${
              highContrast
                ? 'bg-yellow-400 text-slate-950 border-yellow-500 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle High Contrast View"
          >
            <Eye className="w-3 h-3" />
            <span>{highContrast ? 'Standard' : 'Contrast'}</span>
          </button>

          {/* Global Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {/* Install KARM SEVA PWA Button */}
          <InstallAppButton variant="header" />

          {/* Live Status indicator */}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-semibold">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBackendHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isBackendHealthy ? 'DPI Active' : 'Demo Mode'}</span>
          </div>

          {/* Quick Sign In / Register Links */}
          <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-200 text-[11px]">
            <Link
              to="/login"
              className="flex items-center gap-1 font-bold text-slate-800 hover:text-emerald-700 transition-colors px-1 py-0.5"
            >
              <LogIn className="w-3 h-3" />
              <span>{t('common.login')}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              to="/register"
              className="flex items-center gap-1 font-bold text-emerald-700 hover:underline px-1 py-0.5"
            >
              <UserPlus className="w-3 h-3" />
              <span>{t('common.register')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
