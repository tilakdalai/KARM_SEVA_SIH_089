import { create } from 'zustand';
import { APP_CONFIG } from '@/constants/config';

export type SupportedLanguage = 'en' | 'hi' | 'or';
export type FontSizeScale = 'normal' | 'large' | 'extra-large';

interface UIStore {
  language: SupportedLanguage;
  isSidebarOpen: boolean;
  fontSize: FontSizeScale;
  isHighContrast: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFontSize: (scale: FontSizeScale) => void;
  toggleHighContrast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  language: (localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE) as SupportedLanguage) || 'en',
  isSidebarOpen: true,
  fontSize: 'normal',
  isHighContrast: false,
  setLanguage: (lang) => {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    set({ language: lang });
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setFontSize: (scale) => {
    document.documentElement.classList.remove('text-scale-large', 'text-scale-xl');
    if (scale === 'large') document.documentElement.classList.add('text-scale-large');
    if (scale === 'extra-large') document.documentElement.classList.add('text-scale-xl');
    set({ fontSize: scale });
  },
  toggleHighContrast: () => {
    set((state) => {
      const nextVal = !state.isHighContrast;
      if (nextVal) {
        document.documentElement.classList.add('high-contrast-mode');
      } else {
        document.documentElement.classList.remove('high-contrast-mode');
      }
      return { isHighContrast: nextVal };
    });
  },
}));
