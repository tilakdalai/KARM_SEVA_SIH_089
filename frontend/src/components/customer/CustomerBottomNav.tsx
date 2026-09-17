import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  Calendar, 
  Bell, 
  User 
} from 'lucide-react';

export const CustomerBottomNav: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/customer', icon: <Home className="w-5 h-5" />, end: true },
    { label: 'Services', path: '/customer/services', icon: <Wrench className="w-5 h-5" />, end: false },
    { label: 'Bookings', path: '/customer/bookings', icon: <Calendar className="w-5 h-5" />, end: false, badge: 1 },
    { label: 'Alerts', path: '/customer/notifications', icon: <Bell className="w-5 h-5" />, end: false, badge: 2 },
    { label: 'Profile', path: '/customer/profile', icon: <User className="w-5 h-5" />, end: false },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gov-border shadow-lg px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-gov-green font-extrabold scale-105'
                  : 'text-slate-500 hover:text-gov-navy font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon}
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-gov-green mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
