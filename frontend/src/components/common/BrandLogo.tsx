import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '@/constants/config';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'header';
  showText?: boolean;
  showTagline?: boolean;
  showHindiBadge?: boolean;
  to?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
  showTagline = false,
  showHindiBadge = true,
  to = '/',
  className = '',
}) => {
  const iconSizes = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isDark = variant === 'dark';

  const logoIcon = (
    <div
      className={`${iconSizes[size]} bg-gradient-to-br from-[#0f294a] via-[#1a3d68] to-[#0f294a] border border-slate-700/60 flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden transition-transform group-hover:scale-105`}
      title={APP_CONFIG.NAME}
    >
      {/* Mini tricolor accent on badge */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff9933] via-white to-[#10b981]" />

      {/* Stylized K Mark */}
      <svg
        viewBox="0 0 40 40"
        className="w-3/5 h-3/5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left vertical pillar */}
        <rect x="8" y="7" width="5.5" height="26" rx="2.5" fill="#ffffff" />
        {/* Upper dynamic saffron arm */}
        <path
          d="M17 21 L27.5 9.5 C28.5 8.4 30.2 8.4 31.3 9.5 C32.4 10.6 32.4 12.3 31.3 13.4 L22.5 23 Z"
          fill="#ff9933"
        />
        {/* Lower dynamic green arm */}
        <path
          d="M17 19 L28 30.5 C29.1 31.6 30.8 31.6 31.9 30.5 C33 29.4 33 27.7 31.9 26.6 L23 17 Z"
          fill="#10b981"
        />
        {/* Public digital infrastructure central node */}
        <circle cx="19.5" cy="20" r="2.2" fill="#ffffff" />
      </svg>
    </div>
  );

  const content = (
    <div className={`flex items-center space-x-3 group select-none ${className}`}>
      {logoIcon}

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center space-x-1.5">
            <span
              className={`font-black tracking-tight ${textSizes[size]} ${
                isDark ? 'text-white' : 'text-gov-navy'
              }`}
            >
              KARM SEVA
            </span>
            {showHindiBadge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold border leading-none ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-gov-green/10 text-gov-greenDark border-gov-green/20'
                }`}
              >
                कर्म सेवा
              </span>
            )}
          </div>
          {showTagline ? (
            <p
              className={`text-[10px] mt-0.5 truncate max-w-xs sm:max-w-md ${
                isDark ? 'text-slate-400' : 'text-gov-muted'
              }`}
            >
              {APP_CONFIG.TAGLINE}
            </p>
          ) : (
            <p
              className={`text-[10px] mt-0.5 hidden sm:block ${
                isDark ? 'text-slate-400' : 'text-gov-muted'
              }`}
            >
              Connecting Skills. Creating Opportunities.
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="inline-flex">
      {content}
    </Link>
  );
};
