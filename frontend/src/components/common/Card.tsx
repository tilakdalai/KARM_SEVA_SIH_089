import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  footer,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-gov-border rounded-gov shadow-gov-card overflow-hidden transition-all ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-gov-border bg-slate-50/70 font-semibold text-gov-text text-sm">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-gov-border bg-slate-50/50 text-xs text-gov-muted">
          {footer}
        </div>
      )}
    </div>
  );
};
