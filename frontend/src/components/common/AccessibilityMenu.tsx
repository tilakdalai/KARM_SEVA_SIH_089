import React, { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  Contrast,
  Sliders,
  RotateCcw,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAccessibility, FontSizeOption } from '@/context/AccessibilityContext';
import { useTranslation } from '@/context/I18nContext';

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    dyslexicFont,
    toggleDyslexicFont,
    speak,
    stopSpeaking,
    resetAccessibility,
  } = useAccessibility();

  const { t, language } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Global Keyboard Shortcut: Alt + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleReadPageAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
      const snippet = mainContent.slice(0, 500); // Read first chunk
      speak(snippet, language);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Accessibility Menu (Shortcut: Alt + Shift + A)"
        aria-haspopup="dialog"
        className="fixed bottom-5 left-5 z-40 p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-2xl border-2 border-emerald-400 transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-emerald-400 flex items-center justify-center"
      >
        <Eye className="w-5 h-5 text-emerald-300" />
        <span className="sr-only">Accessibility Settings</span>
      </button>

      {/* Accessible Dialog Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-dialog-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h2 id="a11y-dialog-title" className="font-black text-base text-slate-900">
                    {t('a11y.title')}
                  </h2>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {t('a11y.shortcutHint')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t('a11y.closeMenu')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4 text-xs">
              {/* 1. Font Sizing */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-indigo-600" />
                    {t('a11y.fontSize')}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '120%' : '140%'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'large', 'xlarge'] as FontSizeOption[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFontSize(size)}
                      className={`py-2 px-3 rounded-xl font-black text-xs transition border ${
                        fontSize === size
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size === 'normal' ? 'A (Normal)' : size === 'large' ? 'A+ (Large)' : 'A++ (Extra)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. High Contrast */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Contrast className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">{t('a11y.highContrast')}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Deep contrast & high-visibility yellow borders
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={highContrast}
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    highContrast ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Reduced Motion */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">{t('a11y.reducedMotion')}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Disable animated pulses and transitions
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={toggleReducedMotion}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Dyslexic / High Legibility Typography */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">{t('a11y.dyslexicFont')}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Expanded letter-spacing for low-literacy artisans
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dyslexicFont}
                  onClick={toggleDyslexicFont}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    dyslexicFont ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      dyslexicFont ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 5. Voice Assist / Read Page Aloud */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-extrabold text-emerald-950">{t('a11y.voiceAssist')}</div>
                      <div className="text-[10px] text-emerald-800/80">{t('a11y.voiceAssistDesc')}</div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReadPageAloud}
                  className={`w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    isSpeaking
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 animate-pulse" />
                      Stop Reading
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      {t('a11y.speakPage')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={resetAccessibility}
                className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('a11y.resetDefaults')}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                {t('common.done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
