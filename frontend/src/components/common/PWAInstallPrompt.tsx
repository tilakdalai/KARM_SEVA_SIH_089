import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed recently
      const dismissedUntil =
        localStorage.getItem('karmseva_pwa_dismissed_until') ||
        localStorage.getItem('shramsetu_pwa_dismissed_until');
      if (!dismissedUntil || parseInt(dismissedUntil, 10) < Date.now()) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('[PWA] KARM SEVA App was successfully installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('[PWA] Installation prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 7 days
    localStorage.setItem(
      'karmseva_pwa_dismissed_until',
      (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
    );
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl p-4 z-50 border border-slate-700 animate-in slide-in-from-bottom-5">
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gov-saffron via-white to-gov-green flex items-center justify-center font-black text-gov-navy text-sm shadow-md shrink-0">
          KS
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-white">Install KARM SEVA App</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Install on your home screen for quick 1-tap booking, offline fallback, and real-time dispatch alerts.
          </p>

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
          aria-label="Close install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
