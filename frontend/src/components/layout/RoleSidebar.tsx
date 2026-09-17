import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_CONFIGS } from '@/constants/roles';
import { 
  Users, 
  Wrench, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  CreditCard, 
  FileSpreadsheet, 
  BarChart3, 
  FileCheck2, 
  Wallet, 
  Search, 
  AlertTriangle, 
  BookOpen, 
  MapPin, 
  Settings, 
  HeartHandshake 
} from 'lucide-react';

export const RoleSidebar: React.FC = () => {
  const { activeRole, user } = useAuth();
  const roleConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.CUSTOMER;

  // Role-specific navigation items mapped to blueprint modules
  const getNavItems = () => {
    switch (activeRole) {
      case 'CUSTOMER':
        return [
          { label: 'Overview & Search', path: '/customer/dashboard', icon: <Search className="w-4 h-4" /> },
          { label: 'My Bookings', path: '/customer/bookings', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Recurring Services', path: '/customer/recurring', icon: <Clock className="w-4 h-4" /> },
          { label: 'Payments & Invoices', path: '/customer/invoices', icon: <CreditCard className="w-4 h-4" /> },
          { label: 'Saved Addresses', path: '/customer/addresses', icon: <MapPin className="w-4 h-4" /> },
        ];
      case 'WORKER':
        return [
          { label: 'Seva Partner Command', path: '/worker/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Job Requests & Active', path: '/worker/jobs', icon: <Wrench className="w-4 h-4" /> },
          { label: 'Radius & Availability', path: '/worker/radius', icon: <MapPin className="w-4 h-4" /> },
          { label: 'Leave & Replacement', path: '/worker/leave', icon: <HeartHandshake className="w-4 h-4" /> },
          { label: 'Earnings & Settlement', path: '/worker/wallet', icon: <Wallet className="w-4 h-4" /> },
          { label: 'Digital KARM ID Passport', path: '/worker/passport', icon: <FileCheck2 className="w-4 h-4" /> },
        ];
      case 'COOPERATIVE_ADMIN':
        return [
          { label: 'Operations Room', path: '/cooperative/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Seva Partner Verification', path: '/cooperative/verification', icon: <UserCheck className="w-4 h-4" /> },
          { label: 'Workforce Roster', path: '/cooperative/workers', icon: <Users className="w-4 h-4" /> },
          { label: 'Live Dispatch & Map', path: '/cooperative/dispatch', icon: <MapPin className="w-4 h-4" /> },
          { label: 'Revenue & Ledger', path: '/cooperative/ledger', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { label: 'Dispute Resolution', path: '/cooperative/complaints', icon: <AlertTriangle className="w-4 h-4" /> },
          { label: 'Training Academy', path: '/cooperative/training', icon: <BookOpen className="w-4 h-4" /> },
        ];
      case 'INSTITUTION':
        return [
          { label: 'Contracts Workspace', path: '/institution/dashboard', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Request Workforce Team', path: '/institution/request', icon: <Users className="w-4 h-4" /> },
          { label: 'Attendance & Shifts', path: '/institution/attendance', icon: <Clock className="w-4 h-4" /> },
          { label: 'Consolidated Invoices', path: '/institution/invoices', icon: <CreditCard className="w-4 h-4" /> },
        ];
      case 'SYSTEM_ADMIN':
        return [
          { label: 'National Overview', path: '/admin/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
          { label: 'Cooperative Approvals', path: '/admin/cooperatives', icon: <ShieldCheck className="w-4 h-4" /> },
          { label: 'District Analytics', path: '/admin/analytics', icon: <MapPin className="w-4 h-4" /> },
          { label: 'System Audit Logs', path: '/admin/audit', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { label: 'Global Configurations', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gov-border min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-sm">
      <div className="space-y-6">
        {/* Role Identity Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-muted">
              Active Workspace
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="font-bold text-sm text-gov-navy leading-tight">
            {roleConfig.label}
          </h3>
          <p className="text-[11px] text-gov-muted mt-1 truncate">
            {user?.name || 'Authorized Member'}
          </p>
          {user?.shramId && activeRole === 'WORKER' && (
            <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
              <span className="text-gov-muted font-mono">KARM ID: {user.shramId}</span>
              <span className="text-emerald-700 font-bold">Verified</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Navigation
          </div>
          {getNavItems().map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gov-navy text-white shadow-xs font-bold'
                    : 'text-gov-text hover:bg-slate-50 hover:text-gov-navy'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Cooperative Federation Badge */}
      <div className="pt-4 border-t border-slate-100 text-[10px] text-gov-muted space-y-1">
        <p className="font-bold text-slate-600">Odisha Labour Federation</p>
        <p className="text-slate-400">Reg: COOP/OD/2024/0981</p>
      </div>
    </aside>
  );
};
