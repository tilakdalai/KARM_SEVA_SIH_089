import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import en from '@/i18n/locales/en.json';
import hi from '@/i18n/locales/hi.json';
import or from '@/i18n/locales/or.json';
import bn from '@/i18n/locales/bn.json';
import te from '@/i18n/locales/te.json';
import ta from '@/i18n/locales/ta.json';
import mr from '@/i18n/locales/mr.json';
import gu from '@/i18n/locales/gu.json';
import kn from '@/i18n/locales/kn.json';

export type SupportedLanguage = 'en' | 'hi' | 'or' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
];

const dictionaries: Record<SupportedLanguage, any> = {
  en,
  hi,
  or,
  bn,
  te,
  ta,
  mr,
  gu,
  kn,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageInfo[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'karmseva_preferred_language';

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved =
      localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
      localStorage.getItem('shramsetu_preferred_language');
    if (saved && saved in dictionaries) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = dictionaries[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    // Fallback to English if missing in selected language
    if (current === undefined) {
      let fallback: any = dictionaries.en;
      for (const key of keys) {
        if (fallback && typeof fallback === 'object' && key in fallback) {
          fallback = fallback[key];
        } else {
          fallback = undefined;
          break;
        }
      }
      current = fallback !== undefined ? fallback : path;
    }

    if (typeof current !== 'string') {
      return path;
    }

    // Replace interpolations e.g. {name} or {count}
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
      }, current);
    }

    return current;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
