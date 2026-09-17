import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';
import { ROLE_CONFIGS } from '@/constants/roles';
import { UserRole } from '@/types/role';
import { 
  Users, 
  Menu, 
  X, 
  ChevronDown, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  UserCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { NotificationBell } from '@/components/common/NotificationBell';
import { InstallAppButton } from '@/components/common/InstallAppButton';
import { BrandLogo } from '@/components/common/BrandLogo';

export const Navbar: React.FC = () => {
  const { activeRole, switchRole } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
    navigate(ROLE_CONFIGS[role].dashboardPath);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'CUSTOMER': return <Users className="w-4 h-4 text-blue-600" />;
      case 'WORKER': return <Wrench className="w-4 h-4 text-emerald-600" />;
      case 'COOPERATIVE_ADMIN': return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'INSTITUTION': return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'SYSTEM_ADMIN': return <ShieldCheck className="w-4 h-4 text-slate-700" />;
    }
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gov-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand Identity */}
          <BrandLogo size="md" showTagline={true} to="/" />

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-gov-text">
            <Link to="/" className="hover:text-gov-green transition-colors">
              {t('nav.home')}
            </Link>
            <button
              onClick={() => scrollToSection('services-section')}
              className="hover:text-gov-green transition-colors text-left"
            >
              {t('nav.find_services')}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works-section')}
              className="hover:text-gov-green transition-colors text-left"
            >
              {t('nav.how_it_works')}
            </button>
            <button
              onClick={() => scrollToSection('trust-section')}
              className="hover:text-gov-green transition-colors text-left"
            >
              {t('nav.trust')}
            </button>
            <button
              onClick={() => scrollToSection('roles-section')}
              className="hover:text-gov-green transition-colors text-left"
            >
              {t('nav.roles')}
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-gov-text transition-all"
                title="Select role view for demo"
              >
                {getRoleIcon(activeRole)}
                <span className="hidden xl:inline">Role:</span>
                <strong className="text-gov-navy">{ROLE_CONFIGS[activeRole].label}</strong>
                <ChevronDown className="w-3.5 h-3.5 text-gov-muted" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gov-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-gov-muted uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>KARM SEVA Portals</span>
                    <Sparkles className="w-3 h-3 text-gov-saffron" />
                  </div>
                  {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                        activeRole === r ? 'bg-gov-green/10 font-bold text-gov-greenDark' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(r)}
                        <span>{ROLE_CONFIGS[r].label}</span>
                      </div>
                      {activeRole === r && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gov-green" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Dashboard CTA */}
            <Link
              to={ROLE_CONFIGS[activeRole].dashboardPath}
              className="px-3.5 py-1.5 bg-gov-green hover:bg-gov-greenDark text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('nav.dashboard')}</span>
            </Link>

            {/* Notification Bell */}
            <NotificationBell />
          </div>

          {/* Mobile Hamburger Button & Mobile Bell */}
          <div className="md:hidden flex items-center space-x-1">
            <NotificationBell />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gov-muted hover:text-gov-text hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gov-border bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-xs font-bold text-gov-navy rounded-md hover:bg-slate-50"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('services-section')}
              className="block w-full text-left px-3 py-2 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50"
            >
              {t('nav.find_services')}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works-section')}
              className="block w-full text-left px-3 py-2 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50"
            >
              {t('nav.how_it_works')}
            </button>
            <button
              onClick={() => scrollToSection('trust-section')}
              className="block w-full text-left px-3 py-2 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50"
            >
              {t('nav.trust')}
            </button>
            <button
              onClick={() => scrollToSection('roles-section')}
              className="block w-full text-left px-3 py-2 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-50"
            >
              {t('nav.roles')}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <InstallAppButton variant="drawer" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-gov-muted uppercase tracking-wider">
                Language (ଭାଷା / भाषा):
              </span>
              <LanguageSwitcher variant="compact" />
            </div>

            <p className="text-[11px] font-bold text-gov-muted uppercase tracking-wider mb-2 pt-2">
              Select Role Workspace:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`p-2 rounded text-[11px] font-semibold text-left border flex items-center gap-1.5 ${
                    activeRole === r
                      ? 'bg-gov-navy text-white border-gov-navy'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {getRoleIcon(r)}
                  <span className="truncate">{ROLE_CONFIGS[r].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
