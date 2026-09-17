import React from 'react';
import { X, Share2, PlusSquare, Smartphone, Laptop, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PWAUserPlatform } from '@/hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PWAUserPlatform;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  platform,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
      >
        {/* Tricolor Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gov-saffron via-white to-gov-green" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gov-navy to-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg border border-slate-700 shrink-0">
              <span className="text-gov-saffron">कर्म</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="pwa-install-title" className="font-black text-lg text-gov-navy dark:text-white">
                  Install KARM SEVA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                  <Sparkles className="w-3 h-3" /> PWA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                National Sovereign Labour Cooperative Digital Public Infrastructure
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close installation dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Platform Guidance */}
        <div className="p-6 space-y-5">
          {platform === 'IOS' ? (
            /* iOS Safari Instructions */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
                  Follow these 3 quick steps in <strong>Safari</strong> on your iPhone / iPad to install:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-1" /> located at the bottom toolbar in Safari.
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Scroll down and select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 dark:text-slate-300 mx-1" />.
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Tap <strong>"Add"</strong> in the top-right corner. KARM SEVA will launch like a native app with offline caching!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop / Android / Other Instructions */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-center gap-3">
                <Laptop className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs text-blue-900 dark:text-blue-300 font-medium">
                  Install KARM SEVA for standalone window launching, offline dispatch cache, and instant desktop access.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Works seamlessly on <strong>Chrome</strong>, <strong>Edge</strong>, <strong>Safari</strong>, and <strong>Brave</strong>.</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Click the <strong>Install</strong> icon in the address bar (or browser settings menu ➔ "Install App").</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <ShieldCheck className="w-4 h-4 text-gov-green shrink-0" />
                  <span>Zero storage footprint, high security, and 100% verified cooperative worker tracking.</span>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>✓ 100% Free & Open Public DPI</span>
            <span>✓ Offline Resilience Shell</span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
