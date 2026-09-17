import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Building,
  Users,
  Building2,
  Tag,
  CalendarCheck,
  CreditCard,
  AlertOctagon,
  ShieldCheck,
  BarChart3,
  FileCode2,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  SlidersHorizontal,
  Landmark,
} from 'lucide-react';
import {
  INDIAN_STATES_AND_UTS,
  getDistrictsForState,
} from '@/constants/indianLocations';
import { useAuthStore } from '../store/authStore';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(true);

  // Universal Filter states
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('FY 2026-27');
  const [selectedTrade, setSelectedTrade] = useState('ALL');
  const [selectedCooperative, setSelectedCooperative] = useState('ALL');

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      group: 'Macro Governance',
      items: [
        { label: 'National/State Overview', path: '/admin', icon: Landmark },
        { label: 'Cooperative Registry', path: '/admin/cooperatives', icon: Building, badge: '48 Active' },
        { label: 'Seva Partners', path: '/admin/workers', icon: Users, badge: '14.8K' },
        { label: 'Institutions (B2B/B2G)', path: '/admin/institutions', icon: Building2 },
      ],
    },
    {
      group: 'Operations & Tariff',
      items: [
        { label: 'State Services & Floor Tariff', path: '/admin/services', icon: Tag },
        { label: 'Live Bookings Telemetry', path: '/admin/bookings', icon: CalendarCheck },
        { label: 'Payments & Escrow Flow', path: '/admin/payments', icon: CreditCard, badge: '0% Comm' },
        { label: 'Disputes & Conciliation', path: '/admin/complaints', icon: AlertOctagon, badge: '2 Open' },
      ],
    },
    {
      group: 'Oversight & Analytics',
      items: [
        { label: 'Verification Oversight', path: '/admin/verification', icon: ShieldCheck },
        { label: 'Multi-District Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Immutable Audit Trail', path: '/admin/audit-logs', icon: FileCode2 },
        { label: 'System DPI Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top National / State Governance Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand and Governance Badge */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-500 transition">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-white">KARM SEVA</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-900/80 text-rose-300 px-2 py-0.5 rounded border border-rose-700">
                      Platform Administrator / Command Center
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                    Odisha Directorate of Cooperatives & Public Labour DPI Framework (PS26089)
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Actions & Officer Details */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterBar(!showFilterBar)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  showFilterBar
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {showFilterBar ? 'Active' : 'Off'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-md border border-slate-800 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-slate-400 font-medium">Principal Secretary:</span>
                <span className="font-bold text-slate-200">{user?.name || 'Dr. P. K. Jena (IAS)'}</span>
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

        {/* Universal Multi-Tier Filter Bar */}
        {showFilterBar && (
          <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>State Jurisdiction:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-start md:justify-end">
                {/* State */}
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('ALL');
                  }}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">🇮🇳 All India (National DPI)</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>

                {/* District */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Districts</option>
                  {(selectedState !== 'ALL' ? getDistrictsForState(selectedState) : [
                    'New Delhi', 'Mumbai City', 'Bengaluru Urban', 'Chennai', 'Kolkata', 'Hyderabad',
                    'Khordha (Bhubaneswar)', 'Cuttack', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
                  ]).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>

                {/* Date */}
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="FY 2024-25">FY 2024-25 (Current Year)</option>
                  <option value="Q2 2024">Q2 2024 (Jul - Sep)</option>
                  <option value="LAST_30_DAYS">Last 30 Days</option>
                  <option value="TODAY">Today (Live Shifts)</option>
                </select>

                {/* Trade */}
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Trades</option>
                  <option value="Electrician">Electricians (Group A)</option>
                  <option value="Caregiver">Caregivers (Group A)</option>
                  <option value="Plumber">Plumbers (Group B)</option>
                  <option value="Housekeeping">Housekeeping (Group D)</option>
                </select>

                {/* Cooperative */}
                <select
                  value={selectedCooperative}
                  onChange={(e) => setSelectedCooperative(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All 48 Cooperatives</option>
                  <option value="OD-KHR-COOP-041">Khurda District Union (041)</option>
                  <option value="OD-CTC-COOP-019">Cuttack Municipal Union (019)</option>
                  <option value="OD-PUR-COOP-007">Puri Pilgrim Union (007)</option>
                  <option value="OD-GNJ-COOP-033">Ganjam Artisan Society (033)</option>
                  <option value="OD-SBP-COOP-012">Sambalpur Union (012)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-36 space-y-6">
            {/* Oversight Status Card */}
            <div className="p-3.5 rounded-lg bg-slate-900 text-white space-y-1 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DPI Live Heartbeat
              </div>
              <div className="font-extrabold text-sm">State Monitoring Center</div>
              <div className="text-[11px] text-slate-400">48 Cooperatives • 14.8K Roster</div>
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
                        end={item.path === '/admin'}
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

            {/* Governance Escrow Compliance Seal */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="font-bold text-slate-900 flex items-center justify-between text-[11px]">
                <span>State Escrow Standard</span>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">100% DBT</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Automated 90% worker bank credit + 10% cooperative welfare fund allocation with immutable cryptographic audit logging.
              </p>
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
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">KARM SEVA</div>
                      <div className="text-[10px] text-slate-500 font-medium">State Governance DPI</div>
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
                          end={item.path === '/admin'}
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

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
