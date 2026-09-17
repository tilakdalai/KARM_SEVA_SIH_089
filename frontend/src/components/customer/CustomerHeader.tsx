import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LocationPickerModal } from './LocationPickerModal';
import { EmergencyHelpModal } from './EmergencyHelpModal';
import { 
  MapPin, 
  Heart, 
  AlertTriangle, 
  User, 
  LogOut, 
  Home, 
  Wrench, 
  Calendar, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { NotificationBell } from '@/components/common/NotificationBell';

export const CustomerHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [locationText, setLocationText] = useState('Nayapalli, Bhubaneswar · 751012');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/customer', icon: <Home className="w-4 h-4" /> },
    { label: 'Services', path: '/customer/services', icon: <Wrench className="w-4 h-4" /> },
    { label: 'Verified Seva Partners', path: '/customer/workers', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="bg-white border-b border-gov-border sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Left: Brand + Location Pill */}
            <div className="flex items-center space-x-4">
              <Link to="/customer" className="flex items-center space-x-2.5 group shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gov-saffron via-white to-gov-green border border-gov-border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <span className="font-black text-gov-navy text-base">K</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-gov-navy text-lg tracking-tight">KARM SEVA</span>
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      Citizen
                    </span>
                  </div>
                  <span className="text-[10px] text-gov-muted block leading-none">Public Digital Infrastructure</span>
                </div>
              </Link>

              {/* Location Selector Pill */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors max-w-[200px] sm:max-w-[260px]"
                title="Change service location"
              >
                <MapPin className="w-3.5 h-3.5 text-gov-green shrink-0" />
                <div className="truncate text-xs">
                  <span className="font-extrabold text-gov-navy truncate block">
                    {locationText}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/customer'}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-gov-navy text-white shadow-xs'
                        : 'text-gov-text hover:bg-slate-50 hover:text-gov-navy'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right: Emergency SOS, Favourites, Notifications & Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Emergency SOS Button */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold shadow-xs transition-colors"
                title="24x7 Emergency Helpline"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span className="hidden sm:inline">24x7 SOS</span>
              </button>

              {/* Favourites */}
              <Link
                to="/customer/favourites"
                className="p-2 rounded-lg text-slate-500 hover:text-gov-navy hover:bg-slate-50 transition-colors relative"
                title="Saved Workers"
              >
                <Heart className="w-4 h-4" />
              </Link>

              {/* Live Notification Center Dropdown */}
              <NotificationBell />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gov-navy text-white font-black text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0) : 'A'}
                  </div>
                  <span className="hidden md:inline font-bold text-xs text-gov-navy truncate max-w-[100px]">
                    {user?.name || 'Citizen'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gov-border py-2 text-xs z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-gov-navy truncate">{user?.name || 'Ananya Patnaik'}</p>
                      <p className="text-[11px] text-gov-muted truncate">{user?.phone || '+91 9876543210'}</p>
                    </div>

                    <Link to="/customer/profile" className="flex items-center space-x-2.5 px-4 py-2 hover:bg-slate-50 text-gov-text">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Subsidies</span>
                    </Link>

                    <Link to="/customer/addresses" className="flex items-center space-x-2.5 px-4 py-2 hover:bg-slate-50 text-gov-text">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link to="/customer/favourites" className="flex items-center space-x-2.5 px-4 py-2 hover:bg-slate-50 text-gov-text">
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Favourite Craftsmen</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-left text-red-600 hover:bg-red-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={locationText}
        onSelectAddress={(addr) => setLocationText(addr)}
      />

      <EmergencyHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
};
