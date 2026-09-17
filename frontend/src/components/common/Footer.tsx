import React from 'react';
import { useTranslation } from '@/i18n';
import { ShieldCheck, PhoneCall, Globe, Mail } from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';
import { BrandLogo } from '@/components/common/BrandLogo';

export const Footer: React.FC = () => {
  const { t, setLanguage } = useTranslation();

  return (
    <footer className="bg-gov-navyDark text-slate-300 text-xs border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Overview */}
          <div className="space-y-3.5 md:col-span-1">
            <BrandLogo variant="dark" size="sm" showTagline={false} to="/" />
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {t('app.subtitle')}
            </p>
            <div className="flex items-center space-x-1.5 text-gov-saffron text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Service Digital Infrastructure</span>
            </div>
          </div>

          {/* Col 2: Public Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Role Workspaces
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li><a href="#/customer/dashboard" className="hover:text-white transition-colors">Citizen Household Services</a></li>
              <li><a href="#/worker/dashboard" className="hover:text-white transition-colors">Seva Partner Portal &amp; KARM ID</a></li>
              <li><a href="#/cooperative/dashboard" className="hover:text-white transition-colors">Seva Cooperative Operations</a></li>
              <li><a href="#/institution/dashboard" className="hover:text-white transition-colors">Institutional B2B / B2G Contracts</a></li>
              <li><a href="#/admin/dashboard" className="hover:text-white transition-colors">National &amp; District Administration</a></li>
            </ul>
          </div>

          {/* Col 3: Key Policies */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Fairness & Compliance
            </h4>
            <ul className="space-y-2 text-[12px] text-slate-400">
              <li><span className="text-slate-300 font-medium">100% Direct Payout to Seva Partner</span></li>
              <li><span>Encrypted Identity &amp; Document Privacy</span></li>
              <li><span>Leave &amp; Replacement Auto-Dispatch</span></li>
              <li><span>Seva Partner Preferred Radius Matching</span></li>
              <li><span>Review-Based Performance Badges</span></li>
            </ul>
          </div>

          {/* Col 4: Hackathon & Helpline */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Support & Information
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-gov-saffron font-bold text-[11px]">Smart India Hackathon 2026</div>
              <div className="text-slate-300 text-[11px]">Problem Statement: <strong>PS26089</strong></div>
              <div className="text-slate-400 text-[10px]">Ministry of Labour &amp; Employment / Cooperative Dept.</div>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-gov-green" />
              <span>Helpline: <strong>1800-KARM-00</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>grievance@karmseva.gov.in</span>
            </div>
          </div>

        </div>

        {/* Language quick switcher in footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px]">Available Languages:</span>
            {APP_CONFIG.LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'or')}
                className="px-2 py-0.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {lang.native}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">Web Accessibility Statement</span>
          </div>
        </div>

        {/* Copyright notice & Developer Credit */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-400">
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-300 font-medium">
              © 2026 KARM SEVA (कर्म सेवा)
            </div>
            <p className="text-[10px] text-slate-500 max-w-md">
              Digital Public Infrastructure for Skills, Workforce Enablement &amp; Cooperative Governance · Smart India Hackathon PS26089
            </p>
          </div>

          {/* Developer Credit */}
          <div className="flex flex-col items-center sm:items-end text-[11px] text-slate-400 space-y-0.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1">
              <span className="text-slate-400">Designed, Planned &amp; Developed by</span>
              <a
                href="https://tilak-portfolio-wine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Tilak Dalai's portfolio"
                className="group inline-flex items-center gap-0.5 font-semibold text-slate-200 hover:text-gov-saffron transition-colors duration-200 underline decoration-slate-600 hover:decoration-gov-saffron underline-offset-2"
              >
                <span>Tilak Dalai</span>
                <span className="text-[11px] text-gov-saffron transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Full Stack Developer — Team ARTARS
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
