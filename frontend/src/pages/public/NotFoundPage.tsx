import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-gov-navy">Page Not Found</h1>
      <p className="text-xs text-gov-muted max-w-sm mt-2 mb-6">
        The requested digital service portal page could not be located or may have been updated.
      </p>
      <Link to="/">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Return to National Portal
        </Button>
      </Link>
    </div>
  );
};
