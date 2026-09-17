import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';
import { ROLE_CONFIGS } from '@/constants/roles';
import { UserRole } from '@/types/role';
import { Button } from '@/components/common/Button';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Users, 
  Wrench, 
  Building2, 
  UserCheck 
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const user = await login({ credential, password });
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      const redirectPath = from || ROLE_CONFIGS[user.role].dashboardPath;
      navigate(redirectPath, { replace: true });
    } catch {
      // Error state handled in store
    }
  };

  const handleQuickDemoLogin = async (phone: string, role: UserRole) => {
    setCredential(phone);
    setPassword('password123');
    clearError();
    try {
      const user = await login({ credential: phone, password: 'password123' });
      navigate(ROLE_CONFIGS[user.role || role].dashboardPath, { replace: true });
    } catch {
      // Handled
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'CUSTOMER': return <Users className="w-3.5 h-3.5 text-blue-600" />;
      case 'WORKER': return <Wrench className="w-3.5 h-3.5 text-emerald-600" />;
      case 'COOPERATIVE_ADMIN': return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'INSTITUTION': return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      case 'SYSTEM_ADMIN': return <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Identity */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-gov-navy tracking-tight">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-xs text-gov-muted">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Credential: Mobile or Email */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            {t('auth.phoneOrEmail')}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="e.g. 9876543210 / email@domain.com"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Password with Show/Hide */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gov-text">
              {t('auth.password')}
            </label>
            <span className="text-[11px] text-gov-navy hover:underline cursor-pointer">
              {t('auth.forgotPassword')}
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-10 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 text-xs font-bold shadow-sm"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          {t('auth.btnSignIn')}
        </Button>
      </form>

      {/* Registration Callout */}
      <div className="text-center text-xs text-gov-muted border-t border-slate-100 pt-4">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-bold text-gov-greenDark hover:underline">
          {t('common.register')}
        </Link>
      </div>

      {/* Evaluator Quick Demo Accounts */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
            <span>SIH Evaluator 1-Click Demo Logins</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">pwd: password123</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('9876543210', 'CUSTOMER')}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
          >
            {getRoleIcon('CUSTOMER')}
            <div>
              <p className="font-bold text-[11px] text-gov-navy">Citizen</p>
              <span className="text-[10px] text-slate-400 font-mono">9876543210</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('9876543211', 'WORKER')}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
          >
            {getRoleIcon('WORKER')}
            <div>
              <p className="font-bold text-[11px] text-gov-navy">Seva Partner (Electrician)</p>
              <span className="text-[10px] text-slate-400 font-mono">9876543211</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('9876543212', 'COOPERATIVE_ADMIN')}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
          >
            {getRoleIcon('COOPERATIVE_ADMIN')}
            <div>
              <p className="font-bold text-[11px] text-gov-navy">Seva Cooperative Admin</p>
              <span className="text-[10px] text-slate-400 font-mono">9876543212</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('9876543213', 'INSTITUTION')}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
          >
            {getRoleIcon('INSTITUTION')}
            <div>
              <p className="font-bold text-[11px] text-gov-navy">DAV Public School</p>
              <span className="text-[10px] text-slate-400 font-mono">9876543213</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('9876543214', 'SYSTEM_ADMIN')}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors sm:col-span-2"
          >
            {getRoleIcon('SYSTEM_ADMIN')}
            <div>
              <p className="font-bold text-[11px] text-gov-navy">Platform Administrator (State / Govt)</p>
              <span className="text-[10px] text-slate-400 font-mono">9876543214</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
