import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { I18nProvider } from '@/context/I18nContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { AccessibilityMenu } from '@/components/common/AccessibilityMenu';
import { PWAInstallPrompt } from '@/components/common/PWAInstallPrompt';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AccessibilityProvider>
          <AppRoutes />
          <AccessibilityMenu />
          <PWAInstallPrompt />
        </AccessibilityProvider>
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;
