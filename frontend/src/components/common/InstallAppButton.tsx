import React from 'react';
import { Download, Smartphone, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { InstallAppModal } from './InstallAppModal';

interface InstallAppButtonProps {
  variant?: 'header' | 'hero' | 'drawer' | 'compact';
  className?: string;
  showInstalledBadge?: boolean;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  variant = 'header',
  className = '',
  showInstalledBadge = false,
}) => {
  const {
    canInstall,
    isInstalled,
    platform,
    promptInstall,
    isIOSModalOpen,
    closeIOSModal,
  } = usePWAInstall();

  if (isInstalled) {
    if (!showInstalledBadge) return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Installed</span>
      </span>
    );
  }

  if (!canInstall) return null;

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={() => promptInstall()}
          className={`px-3 py-1.5 rounded-lg bg-gov-green/10 hover:bg-gov-green/20 text-gov-green dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-all border border-gov-green/30 hover:border-gov-green/50 shadow-sm ${className}`}
          title="Install KARM SEVA Progressive Web App"
          aria-label="Install KARM SEVA"
        >
          <Download className="w-3.5 h-3.5 text-gov-green" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'hero' && (
        <button
          onClick={() => promptInstall()}
          className={`px-6 py-3 rounded-2xl bg-white/90 hover:bg-white text-gov-navy font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 border border-slate-200 group ${className}`}
        >
          <Smartphone className="w-4 h-4 text-gov-green group-hover:scale-110 transition-transform" />
          <span>Install KARM SEVA</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          onClick={() => promptInstall()}
          className={`w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between border border-emerald-200 dark:border-emerald-800 transition-colors ${className}`}
        >
          <div className="flex items-center space-x-2.5">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Install KARM SEVA PWA</span>
          </div>
          <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded">
            Free
          </span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={() => promptInstall()}
          className={`p-1.5 rounded-lg text-slate-600 hover:text-gov-green hover:bg-slate-100 transition-colors ${className}`}
          title="Install KARM SEVA App"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* Instructional Modal */}
      <InstallAppModal
        isOpen={isIOSModalOpen}
        onClose={closeIOSModal}
        platform={platform}
      />
    </>
  );
};
