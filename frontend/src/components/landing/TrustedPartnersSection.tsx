import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Award,
  CalendarCheck
} from 'lucide-react';

interface VerifiedPartner {
  id: string;
  name: string;
  trade: string;
  tradeGroup: string;
  karmId: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  district: string;
  cooperativeName: string;
  ratePerHour: number;
  avatarUrl: string;
  badges: string[];
  isAvailableNow: boolean;
}

export const TrustedPartnersSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');

  const partners: VerifiedPartner[] = [
    {
      id: 'p-1',
      name: 'Gopal Nayak',
      trade: 'Master Electrician',
      tradeGroup: 'GROUP_A',
      karmId: 'KS-OD-2024-8841',
      rating: 4.9,
      reviewCount: 142,
      experienceYears: 8.5,
      district: 'Bhubaneswar, Khordha',
      cooperativeName: 'Bhubaneswar Urban Seva Cooperative Federation',
      ratePerHour: 249,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
      badges: ['Licensed ITI', 'Police Cleared', 'Top Rated'],
      isAvailableNow: true,
    },
    {
      id: 'p-2',
      name: 'Sunita Majhi',
      trade: 'Senior Patient Caregiver',
      tradeGroup: 'GROUP_A',
      karmId: 'KS-OD-2024-3912',
      rating: 4.95,
      reviewCount: 88,
      experienceYears: 6.0,
      district: 'Cuttack Sadar',
      cooperativeName: 'Cuttack Seva Karmik Union',
      ratePerHour: 499,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      badges: ['Nursing Certified', 'Elderly Care', 'Police Cleared'],
      isAvailableNow: true,
    },
    {
      id: 'p-3',
      name: 'Ramesh Chandra Behera',
      trade: 'Master Plumber',
      tradeGroup: 'GROUP_B',
      karmId: 'KS-OD-2024-1044',
      rating: 4.85,
      reviewCount: 215,
      experienceYears: 11.0,
      district: 'Bhubaneswar, Khordha',
      cooperativeName: 'Bhubaneswar Urban Seva Cooperative Federation',
      ratePerHour: 299,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      badges: ['Pipeline Specialist', 'Cooperative Verified'],
      isAvailableNow: false,
    },
    {
      id: 'p-4',
      name: 'Balaram Sahoo',
      trade: 'Master Carpenter',
      tradeGroup: 'GROUP_C',
      karmId: 'KS-OD-2024-8847',
      rating: 4.88,
      reviewCount: 96,
      experienceYears: 10.0,
      district: 'Puri District',
      cooperativeName: 'Puri Craft & Artisan Cooperative',
      ratePerHour: 349,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      badges: ['Guild Master', 'Wood Turning', 'Police Cleared'],
      isAvailableNow: true,
    },
    {
      id: 'p-5',
      name: 'Surya Narayan Tripathy',
      trade: 'Commercial Driver & Chauffeur',
      tradeGroup: 'GROUP_A',
      karmId: 'KS-OD-2024-8849',
      rating: 4.92,
      reviewCount: 164,
      experienceYears: 8.0,
      district: 'Bhubaneswar, Khordha',
      cooperativeName: 'Bhubaneswar Urban Seva Cooperative Federation',
      ratePerHour: 399,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      badges: ['Commercial HMV', 'Zero Accident Record'],
      isAvailableNow: true,
    },
    {
      id: 'p-6',
      name: 'Savitri Sahoo',
      trade: 'Deep Sanitization Specialist',
      tradeGroup: 'GROUP_D',
      karmId: 'KS-OD-2024-8845',
      rating: 4.9,
      reviewCount: 180,
      experienceYears: 5.0,
      district: 'Cuttack Central',
      cooperativeName: 'Cuttack Seva Karmik Union',
      ratePerHour: 299,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      badges: ['Machine Scrub Trained', 'Cooperative Star'],
      isAvailableNow: true,
    },
  ];

  const filterOptions = [
    { label: 'All Partners', value: 'ALL' },
    { label: 'Electrical', value: 'Electrician' },
    { label: 'Caregiving', value: 'Caregiver' },
    { label: 'Plumbing', value: 'Plumber' },
    { label: 'Carpentry', value: 'Carpenter' },
    { label: 'Transport', value: 'Driver' },
    { label: 'Sanitization', value: 'Sanitization' },
  ];

  const filteredPartners = selectedTrade === 'ALL'
    ? partners
    : partners.filter((p) => p.trade.toLowerCase().includes(selectedTrade.toLowerCase()));

  return (
    <section id="trusted-partners-section" className="py-16 bg-slate-50 border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="success" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              100% Cooperative Verified
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
              Trusted Seva Partners with Digital KARM ID
            </h2>
            <p className="text-xs sm:text-sm text-gov-muted leading-relaxed">
              Every Seva Partner carries a government-recognized digital KARM ID credential, trade licenses, police verification, and the backing of their local Seva Cooperative.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/customer/workers')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="self-start md:self-auto shrink-0"
          >
            View All 12,500+ Seva Partners
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedTrade(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTrade === opt.value
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <Card
              key={partner.id}
              className="p-5 flex flex-col justify-between hover:shadow-gov-hover hover:border-gov-green/50 transition-all border border-slate-200 bg-white group"
            >
              <div className="space-y-4">
                {/* Top Row: Avatar, KARM ID Chip & Availability */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={partner.avatarUrl}
                        alt={partner.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      {partner.isAvailableNow && (
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                          title="Available for immediate booking"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-extrabold text-sm text-gov-navy truncate">
                          {partner.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-gov-green shrink-0" />
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 truncate">
                        {partner.trade}
                      </p>
                      <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <span>ID:</span>
                        <span className="text-gov-navy">{partner.karmId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-900 font-extrabold text-xs shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{partner.rating}</span>
                    <span className="text-[10px] text-amber-700">({partner.reviewCount})</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {partner.badges.map((b, bidx) => (
                    <span
                      key={bidx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                    >
                      <Award className="w-3 h-3 text-emerald-600" />
                      {b}
                    </span>
                  ))}
                </div>

                {/* Meta details */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Experience:</span>
                    <span className="font-bold text-slate-800">{partner.experienceYears} Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Location:
                    </span>
                    <span className="font-medium text-slate-700 text-[11px] truncate max-w-[180px]">
                      {partner.district}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 italic truncate">
                    Affiliated with {partner.cooperativeName}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Floor Rate
                  </div>
                  <div className="text-base font-black text-gov-navy">
                    ₹{partner.ratePerHour}
                    <span className="text-[11px] font-normal text-slate-500"> / hr</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/customer/book')}
                  leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  Book Seva Partner
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
