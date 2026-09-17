import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { X, ShieldCheck, MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  location: string;
  timing?: string;
}

export const ServiceSearchModal: React.FC<ServiceSearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  location,
}) => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Mock search results representing explainable matching
  const mockMatches = [
    {
      id: 'worker-1',
      name: 'Gopal Nayak',
      trade: searchQuery || 'Master Electrician',
      rating: 4.8,
      jobsCompleted: 92,
      distance: 2.1,
      matchScore: 96,
      shramId: 'KS-OD-2024-8841',
      cooperative: 'Bhubaneswar Multi-Purpose Labour Cooperative',
      price: '₹350',
      skills: ['Wiring & Inverter', 'Safety Audits', 'Lighting Fixtures'],
      verifiedBadges: ['ITI License Verified', 'Police Verified', 'Top Review Score'],
    },
    {
      id: 'worker-2',
      name: 'Bhabani Shankar Das',
      trade: searchQuery || 'Senior Electrician',
      rating: 4.9,
      jobsCompleted: 140,
      distance: 3.4,
      matchScore: 92,
      shramId: 'KS-OD-2024-3329',
      cooperative: 'Khurda District Labour Cooperative Union',
      price: '₹399',
      skills: ['Appliance Repair', 'Switchboards', 'Industrial Wiring'],
      verifiedBadges: ['Cooperative Verified', 'Experienced (8 Yrs)'],
    },
    {
      id: 'worker-3',
      name: 'Priyabrata Jena',
      trade: searchQuery || 'Certified Technician',
      rating: 4.7,
      jobsCompleted: 64,
      distance: 3.8,
      matchScore: 89,
      shramId: 'KS-OD-2024-1102',
      cooperative: 'Bhubaneswar Multi-Purpose Labour Cooperative',
      price: '₹299',
      skills: ['Residential Wiring', 'Emergency Repair'],
      verifiedBadges: ['Trade Certified', 'High On-Time Rate'],
    },
  ];

  const handleBookNow = () => {
    switchRole('CUSTOMER');
    onClose();
    navigate('/customer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gov-border shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-gov-border flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-gov-green animate-ping" />
              <h3 className="font-extrabold text-base text-gov-navy">
                Matched Verified Seva Partners
              </h3>
            </div>
            <p className="text-xs text-gov-muted mt-0.5 flex items-center gap-1">
              <span>Service: <strong>{searchQuery || 'All Services'}</strong></span>
              <span>·</span>
              <MapPin className="w-3 h-3 text-gov-muted" />
              <span>{location}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainable Match Scoring Callout */}
        <div className="px-6 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-gov-green shrink-0" />
            <span>Explainable Match: Ranked by Skill (35%) + Radius (25%) + Availability (20%) + Rating (10%)</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 font-bold hidden sm:inline">
            100% Cooperative Verified
          </span>
        </div>

        {/* Results List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {mockMatches.map((worker) => (
            <div
              key={worker.id}
              className="p-4 rounded-xl border border-gov-border hover:border-gov-green/60 hover:shadow-md transition-all space-y-3 bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-gov-navy">{worker.name}</h4>
                    <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-gov-greenDark font-semibold">{worker.trade}</p>
                  <p className="text-[10px] text-gov-muted font-mono">
                    {worker.cooperative} · KARM ID: {worker.shramId}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span>{worker.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({worker.jobsCompleted} shifts)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-gov-navy">{worker.price}</span>
                    <span className="text-[10px] text-slate-500"> est.</span>
                  </div>
                </div>
              </div>

              {/* Skills and Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {worker.verifiedBadges.map((badge, bidx) => (
                    <span
                      key={bidx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] font-bold text-gov-navy flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gov-green" />
                  <span>{worker.distance} km away</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleBookNow}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Book with Cooperative Guarantee
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-gov-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gov-muted">
          <span>Post-shift payment protected by Razorpay. 100% pay disbursed directly to Seva Partner.</span>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};
