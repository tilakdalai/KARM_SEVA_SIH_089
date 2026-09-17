import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GovHeader } from '@/components/common/GovHeader';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { PhoneCall } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gov-text">
      {/* Top Gov Indian Tricolor & Helpline Strip */}
      <GovHeader />

      {/* Modern Consumer App Header */}
      <CustomerHeader />

      {/* Main Consumer Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        <Outlet />
      </main>

      {/* Desktop Simple Consumer Footer */}
      <footer className="hidden lg:block bg-white border-t border-gov-border py-6 text-xs text-gov-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-gov-navy text-white font-black text-xs flex items-center justify-center">
                K
              </div>
              <span className="font-bold text-gov-navy">KARM SEVA Citizen Portal</span>
              <span>·</span>
              <span>Government of India &amp; State Labour Federations</span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-700">
                <PhoneCall className="w-3.5 h-3.5 text-gov-green" />
                <span>National Toll-Free: 1800-KARM-00</span>
              </span>
              <span>·</span>
              <Link to="/customer/profile" className="text-gov-navy hover:underline">
                Grievances &amp; Support
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © 2026 KARM SEVA (कर्म सेवा) · Smart India Hackathon PS26089
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span>Designed, Planned &amp; Developed by</span>
              <a
                href="https://tilak-portfolio-wine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Tilak Dalai's portfolio"
                className="group inline-flex items-center gap-0.5 font-semibold text-gov-navy hover:text-gov-green transition-colors underline decoration-slate-300 hover:decoration-gov-green underline-offset-2"
              >
                <span>Tilak Dalai</span>
                <span className="text-[10px] text-gov-green transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
              <span className="text-slate-400">· Full Stack Developer · Team ARTARS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Consumer Bottom Navigation Bar (5 tabs) */}
      <CustomerBottomNav />
    </div>
  );
};
