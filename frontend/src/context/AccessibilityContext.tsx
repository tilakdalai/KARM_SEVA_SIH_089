import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

interface AccessibilityState {
  fontSize: FontSizeOption;
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
  voiceAssist: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  setFontSize: (size: FontSizeOption) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setDyslexicFont: (enabled: boolean) => void;
  setVoiceAssist: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleDyslexicFont: () => void;
  toggleVoiceAssist: () => void;
  speak: (text: string, langCode?: string) => void;
  stopSpeaking: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const A11Y_STORAGE_KEY = 'karmseva_a11y_settings';
const A11Y_LEGACY_KEY = 'shramsetu_a11y_settings';

const defaultState: AccessibilityState = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  dyslexicFont: false,
  voiceAssist: false,
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const saved = localStorage.getItem(A11Y_STORAGE_KEY) || localStorage.getItem(A11Y_LEGACY_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  const saveState = (updater: (prev: AccessibilityState) => AccessibilityState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const setFontSize = (fontSize: FontSizeOption) => saveState((s) => ({ ...s, fontSize }));
  const setHighContrast = (highContrast: boolean) => saveState((s) => ({ ...s, highContrast }));
  const setReducedMotion = (reducedMotion: boolean) => saveState((s) => ({ ...s, reducedMotion }));
  const setDyslexicFont = (dyslexicFont: boolean) => saveState((s) => ({ ...s, dyslexicFont }));
  const setVoiceAssist = (voiceAssist: boolean) => saveState((s) => ({ ...s, voiceAssist }));

  const toggleHighContrast = () => setHighContrast(!state.highContrast);
  const toggleReducedMotion = () => setReducedMotion(!state.reducedMotion);
  const toggleDyslexicFont = () => setDyslexicFont(!state.dyslexicFont);
  const toggleVoiceAssist = () => setVoiceAssist(!state.voiceAssist);

  const resetAccessibility = () => {
    setState(defaultState);
    try {
      localStorage.removeItem(A11Y_STORAGE_KEY);
    } catch {}
  };

  // Text-To-Speech SpeechSynthesis support for low-literacy users
  const speak = (text: string, langCode: string = 'en-IN') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // cancel previous utterance

    const cleanText = text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode === 'hi' ? 'hi-IN' : (langCode === 'or' ? 'or-IN' : 'en-IN');
    utterance.rate = 0.95; // slightly slower for better comprehension
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Apply CSS classes to document root
  useEffect(() => {
    const root = document.documentElement;

    // Font size scaling
    root.classList.remove('font-scaling-normal', 'font-scaling-large', 'font-scaling-xlarge');
    root.classList.add(`font-scaling-${state.fontSize}`);

    // High Contrast
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced Motion
    if (state.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Dyslexic Font
    if (state.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
  }, [state]);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setFontSize,
        setHighContrast,
        setReducedMotion,
        setDyslexicFont,
        setVoiceAssist,
        toggleHighContrast,
        toggleReducedMotion,
        toggleDyslexicFont,
        toggleVoiceAssist,
        speak,
        stopSpeaking,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
