import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarCheck,
  Radio,
  UserX,
  Tag,
  IndianRupee,
  Receipt,
  Star,
  AlertTriangle,
  GraduationCap,
  HeartHandshake,
  BarChart3,
  Bell,
  Settings,
  FileText,
  LogOut,
  Building2,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const CooperativeLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'Core Operations',
      items: [
        { label: 'Overview', path: '/cooperative', icon: LayoutDashboard, badge: undefined },
        { label: 'Seva Partner Roster', path: '/cooperative/workers', icon: Users, badge: '248' },
        { label: 'Verification Queue', path: '/cooperative/verification', icon: ShieldCheck, badge: '14 Pending', badgeColor: 'bg-amber-100 text-amber-800' },
        { label: 'Live Bookings', path: '/cooperative/bookings', icon: CalendarCheck, badge: '58' },
        { label: 'Live Operations Map', path: '/cooperative/live-operations', icon: Radio, badge: '21 Active', badgeColor: 'bg-emerald-100 text-emerald-800' },
        { label: 'Leave & Replacement', path: '/cooperative/leaves', icon: UserX, badge: '3 Alerts', badgeColor: 'bg-rose-100 text-rose-800' },
      ],
    },
    {
      group: 'Services & Financials',
      items: [
        { label: 'Services & Pricing', path: '/cooperative/services', icon: Tag },
        { label: 'Revenue & Escrow', path: '/cooperative/revenue', icon: IndianRupee },
        { label: 'Partner Settlements', path: '/cooperative/settlements', icon: Receipt },
        { label: 'Member Ratings', path: '/cooperative/ratings', icon: Star },
        { label: 'Disputes & Complaints', path: '/cooperative/complaints', icon: AlertTriangle, badge: '1', badgeColor: 'bg-orange-100 text-orange-800' },
      ],
    },
    {
      group: 'Empowerment & Analytics',
      items: [
        { label: 'Skill Training', path: '/cooperative/training', icon: GraduationCap },
        { label: 'Welfare & Benefits', path: '/cooperative/welfare', icon: HeartHandshake },
        { label: 'District Analytics', path: '/cooperative/analytics', icon: BarChart3 },
        { label: 'Broadcasts', path: '/cooperative/notifications', icon: Bell },
        { label: 'Audit Trail', path: '/cooperative/audit-logs', icon: FileText },
        { label: 'Union Settings', path: '/cooperative/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Top Bar - Government Authority Banner */}
      <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Brand & Cooperative Identity */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-base">KARM SEVA</span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wide">
                    Seva Cooperative Operations
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                  Khurda District Seva Cooperative Union (Reg. OD-KHR-COOP-041)
                </div>
              </div>
            </div>
          </div>

          {/* Quick Search & User Profile Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search KARM ID, partner, service..."
                className="bg-slate-800 text-xs text-slate-200 placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 border border-slate-700 w-64 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Officer Status */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm">
                {(user?.name || 'CO')[0]}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">{user?.name || 'Cooperative Officer'}</div>
                <div className="text-[10px] text-emerald-400 font-mono">OD-KHR-OFFICER-01 (ACTIVE)</div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out of Cooperative Control Room"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Fixed Desktop Sidebar + Scrollable View */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 shrink-0 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/cooperative'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Compliance Card */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Labour Act Audited</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              All wage payouts conform to Odisha State Minimum Wage Gazette 2024. Audit logs are preserved cryptographically.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-80 bg-white h-full p-4 overflow-y-auto space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="font-bold text-slate-900">Cooperative Navigation</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/cooperative'}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                            isActive
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* View Outlet Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
