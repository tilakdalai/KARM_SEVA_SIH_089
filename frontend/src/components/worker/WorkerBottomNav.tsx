import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  Wallet, 
  User 
} from 'lucide-react';

export const WorkerBottomNav: React.FC = () => {
  const navItems = [
    { to: '/worker', label: 'Home', icon: Home, end: true },
    { to: '/worker/jobs', label: 'Jobs', icon: Briefcase, badge: '1' },
    { to: '/worker/schedule', label: 'Schedule', icon: Calendar },
    { to: '/worker/earnings', label: 'Earnings', icon: Wallet },
    { to: '/worker/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gov-border shadow-lg px-2 py-1.5"
      aria-label="Worker Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-gov-green font-black'
                    : 'text-slate-500 hover:text-gov-navy font-bold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-gov-green' : ''} transition-transform`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-green mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
