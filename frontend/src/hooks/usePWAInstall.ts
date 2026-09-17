import { useState, useEffect, useCallback } from 'react';

export type PWAUserPlatform = 'ANDROID' | 'IOS' | 'WINDOWS' | 'MAC' | 'OTHER';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global cached prompt to prevent losing the event across re-renders/page changes
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent('karmseva_pwa_ready'));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    window.dispatchEvent(new CustomEvent('karmseva_pwa_installed'));
    console.log('[PWA] KARM SEVA successfully installed on device');
  });
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    globalDeferredPrompt
  );
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);
  const [platform, setPlatform] = useState<PWAUserPlatform>('OTHER');

  // Detect Platform
  const detectPlatform = useCallback((): PWAUserPlatform => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'OTHER';
    const ua = navigator.userAgent || '';
    const isIOSDevice =
      (/iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !(window as any).MSStream;

    if (isIOSDevice) return 'IOS';
    if (/android/i.test(ua)) return 'ANDROID';
    if (/windows/i.test(ua)) return 'WINDOWS';
    if (/macintosh|mac os x/i.test(ua)) return 'MAC';
    return 'OTHER';
  }, []);

  // Check if running in standalone display mode
  const checkIsInstalled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const isReferrerInstalled = document.referrer.startsWith('android-app://');
    return isStandaloneDisplay || isIOSStandalone || isReferrerInstalled;
  }, []);

  useEffect(() => {
    const currentPlatform = detectPlatform();
    setPlatform(currentPlatform);
    setIsInstalled(checkIsInstalled());

    const handlePromptReady = () => {
      setDeferredPrompt(globalDeferredPrompt);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsIOSModalOpen(false);
    };

    window.addEventListener('karmseva_pwa_ready', handlePromptReady);
    window.addEventListener('karmseva_pwa_installed', handleAppInstalled);

    // Watch for display-mode change in real-time
    const matchMediaObj = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    matchMediaObj.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('karmseva_pwa_ready', handlePromptReady);
      window.removeEventListener('karmseva_pwa_installed', handleAppInstalled);
      matchMediaObj.removeEventListener('change', handleDisplayModeChange);
    };
  }, [detectPlatform, checkIsInstalled]);

  // Main Install Action
  const promptInstall = async (): Promise<{ outcome: 'accepted' | 'dismissed' | 'modal_opened' | 'unsupported' }> => {
    if (isInstalled) {
      return { outcome: 'accepted' };
    }

    // On iOS Safari, beforeinstallprompt does not exist, so show instructions modal
    if (platform === 'IOS') {
      setIsIOSModalOpen(true);
      return { outcome: 'modal_opened' };
    }

    // On Android/Windows/macOS Chrome/Edge where native event was captured
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
        return { outcome: choice.outcome };
      } catch (err) {
        console.warn('[PWA] prompt error:', err);
        // Fallback to manual instruction modal
        setIsIOSModalOpen(true);
        return { outcome: 'modal_opened' };
      }
    }

    // When no prompt event was fired (e.g. desktop Safari or Firefox), open guidance modal
    setIsIOSModalOpen(true);
    return { outcome: 'modal_opened' };
  };

  const closeIOSModal = () => setIsIOSModalOpen(false);

  const canInstall = !isInstalled;

  return {
    canInstall,
    isInstalled,
    platform,
    promptInstall,
    isIOSModalOpen,
    closeIOSModal,
    hasNativePrompt: !!deferredPrompt,
  };
};
