import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  UserPlus2,
  ClipboardList,
  Users2,
  CalendarDays,
  CheckSquare,
  FileText,
  FileCheck2,
  Building,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const InstitutionLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      group: 'Enterprise Portal',
      items: [
        { label: 'Overview', path: '/institution', icon: LayoutDashboard },
        { label: 'Request Workforce', path: '/institution/request', icon: UserPlus2, badge: 'New' },
        { label: 'Requisitions Tracker', path: '/institution/requests', icon: ClipboardList },
        { label: 'Assigned Personnel', path: '/institution/workforce', icon: Users2, badge: '28' },
      ],
    },
    {
      group: 'Shift & Compliance',
      items: [
        { label: 'Schedules & Rosters', path: '/institution/schedules', icon: CalendarDays },
        { label: 'Daily Attendance', path: '/institution/attendance', icon: CheckSquare, badge: '96.4%' },
      ],
    },
    {
      group: 'Procurement & Billing',
      items: [
        { label: 'GST Invoices', path: '/institution/invoices', icon: FileText, badge: '1 Due' },
        { label: 'SLA Contracts', path: '/institution/contracts', icon: FileCheck2 },
        { label: 'Institution Profile', path: '/institution/profile', icon: Building },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top B2B Enterprise Authority Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand and Organization Identity */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/institution" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-500 transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-white">KARM SEVA</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      B2B / B2G Enterprise
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                    {user?.organizationName || user?.name || 'AIIMS Bhubaneswar Facility Directorate'}
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Actions & Nodal Officer Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search workers, SLAs, invoices..."
                  className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-48"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-slate-300 font-medium">Nodal Officer:</span>
                <span className="font-bold text-white">{user?.name || 'Dr. M. Mohanty'}</span>
              </div>

              <button
                title="Notifications"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-900/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24 space-y-6">
            {/* Institutional Account Card */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facility Node</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">AIIMS Bhubaneswar</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span>GST:</span>
                <span className="font-mono font-semibold text-slate-700">21AAAGA0000A1Z5</span>
              </div>
            </div>

            {/* Nav Groups */}
            <div className="space-y-5">
              {navItems.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/institution'}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Procurement SLA Guarantee Box */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1.5">
              <div className="font-bold text-emerald-900 flex items-center justify-between">
                <span>Direct Union SLA</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">0% Comm</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Direct cooperative billing under State Labour Department guidelines. No private middlemen markups.
              </p>
              <Link to="/institution/contracts" className="text-emerald-800 font-bold text-[11px] flex items-center gap-1 hover:underline pt-0.5">
                <span>View SLA Framework</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full p-5 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">KARM SEVA</div>
                      <div className="text-[10px] text-slate-500 font-medium">B2B / B2G Portal</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1">
                      {group.group}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === '/institution'}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                              isActive
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Routed Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
