import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  MOCK_CATEGORIES, 
  MOCK_WORKERS, 
  MOCK_BOOKINGS,
  ServiceCategoryMock,
  WorkerMock,
  BookingMock,
} from '@/services/customerMockData';
import { customerService } from '@/services/customerService';
import { bookingService, BookingRecord } from '@/services/bookingService';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { ActiveJobBanner } from '@/components/customer/ActiveJobBanner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  Zap 
} from 'lucide-react';

export const CustomerHomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ServiceCategoryMock[]>(MOCK_CATEGORIES);
  const [workers, setWorkers] = useState<WorkerMock[]>(MOCK_WORKERS);
  const [apiBookings, setApiBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    let isMounted = true;
    customerService.getCategories().then((cats) => {
      if (isMounted && cats?.length) setCategories(cats);
    });
    customerService.getWorkers().then((w) => {
      if (isMounted && w?.length) setWorkers(w);
    });
    bookingService.getBookings().then((b) => {
      if (isMounted && b?.length) setApiBookings(b);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Get active booking
  const apiActiveBooking = apiBookings.find((b) => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.status));
  const activeBooking: BookingMock | undefined = apiActiveBooking
    ? {
        id: apiActiveBooking.id,
        bookingNumber: apiActiveBooking.booking_reference,
        serviceTitle: apiActiveBooking.service_title,
        trade: apiActiveBooking.service_category || 'Electrical',
        workerId: 'w-1',
        workerName: apiActiveBooking.worker_name || 'Gopal Nayak',
        workerPhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        workerPhoneMasked: '+91 98765 XXXXX',
        workerShramId: 'OD-BBR-2024-8841',
        cooperativeName: 'Bhubaneswar Urban Craftsmen Federation',
        status: 'ACTIVE',
        scheduledDateTime: `${apiActiveBooking.scheduled_date} · ${apiActiveBooking.time_slot}`,
        bookingAddress: apiActiveBooking.address_line,
        addressType: 'Home',
        totalAmount: apiActiveBooking.total_amount,
        baseFare: apiActiveBooking.total_amount * 0.85,
        cooperativeFee: apiActiveBooking.total_amount * 0.10,
        gstAmount: apiActiveBooking.total_amount * 0.05,
        paymentStatus: 'PAID_ESCROW',
        paymentMethod: 'UPI Escrow (Razorpay)',
        otpCode: apiActiveBooking.otp_code || '4821',
        currentStep: 3,
        etaMinutes: 14,
        distanceKm: 1.8,
        replacementGuardActive: true,
        timeline: [
          { step: 1, title: 'Request Accepted', time: '10:00 AM', completed: true, active: false, description: 'Worker assigned' },
          { step: 2, title: 'On the Way', time: '10:15 AM', completed: true, active: false, description: 'Worker traveling' },
          { step: 3, title: 'In Progress', time: '10:30 AM', completed: false, active: true, description: 'Service ongoing' },
        ],
      }
    : MOCK_BOOKINGS.find((b) => b.status === 'ACTIVE');
  const recentCompletedBookings = MOCK_BOOKINGS.filter((b) => b.status === 'COMPLETED');

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/workers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickSearchTags = [
    'Emergency Electrician',
    'Tap Leakage',
    'Elderly Caregiver',
    'Deep Clean Kitchen',
    'AC Jet Wash',
    'Door Lock Repair',
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Greeting & Search Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-gov-navy via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Background Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gov-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gov-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          
          {/* Greeting Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Ananya'} 👋</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            What service do you need today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Directly connect with 100% background-verified cooperative tradesmen in your local radius.
          </p>

          {/* Large Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex flex-col sm:flex-row gap-2 bg-white p-1.5 rounded-2xl shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 'Master Electrician', 'Plumber', 'Patient Caregiver'..."
                  className="w-full text-xs sm:text-sm font-medium text-gov-navy placeholder-slate-400 pl-11 pr-4 py-3 bg-transparent focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="py-3 px-6 text-xs sm:text-sm font-extrabold shadow-md shrink-0"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Find Verified
              </Button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-slate-400 font-bold">Trending:</span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/customer/workers?search=${encodeURIComponent(tag)}`)}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-full text-slate-200 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. Active Job Tracking Preview (if any active booking) */}
      {activeBooking && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gov-green" />
              <span>Live Service Tracking</span>
            </h2>
            <Link to={`/customer/bookings/${activeBooking.id}`} className="text-xs font-bold text-gov-greenDark hover:underline">
              View Timeline Details →
            </Link>
          </div>
          <ActiveJobBanner booking={activeBooking} />
        </section>
      )}

      {/* 3. Service Categories Grid (12 Categories) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight">
              Explore Verified Services
            </h2>
            <p className="text-xs text-gov-muted">
              Fixed cooperative rate cards · Zero hidden fees · 30-day service warranty
            </p>
          </div>
          <Link 
            to="/customer/services" 
            className="text-xs font-bold text-gov-greenDark hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => (
            <ServiceCard key={cat.id} category={cat} compact />
          ))}
        </div>
      </section>

      {/* 4. Emergency Assistance Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-white/20 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.2 rounded-full">
                24x7 Priority
              </span>
              <span className="text-xs font-bold text-red-100">Zero Surge Price</span>
            </div>
            <h3 className="font-extrabold text-base text-white">
              Need Emergency Home Assistance?
            </h3>
            <p className="text-xs text-red-100 max-w-xl">
              Urgent short circuits, burst pipes, and caregiver support dispatched within 20 mins.
            </p>
          </div>
        </div>

        <Button
          size="md"
          variant="secondary"
          onClick={() => navigate('/customer/workers?emergency=true')}
          className="bg-white text-red-700 hover:bg-slate-100 text-xs font-black shadow-md shrink-0 py-2.5 px-5"
          leftIcon={<Zap className="w-4 h-4 text-red-600" />}
        >
          Request SOS Worker
        </Button>
      </div>

      {/* 5. Recommended Workers Near You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight">
              Recommended Craftsmen Near You
            </h2>
            <p className="text-xs text-gov-muted">
              Within 4.0 km radius · Cooperative verified credentials · Direct wage settlement
            </p>
          </div>
          <Link 
            to="/customer/workers" 
            className="text-xs font-bold text-gov-greenDark hover:underline flex items-center gap-1"
          >
            <span>View All Workers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.slice(0, 4).map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      {/* 6. Book Again / Recent Bookings */}
      {recentCompletedBookings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gov-green" />
                <span>Book Again</span>
              </h2>
              <p className="text-xs text-gov-muted">
                Repeat your frequent services with previously verified trusted craftsmen
              </p>
            </div>
            <Link 
              to="/customer/bookings" 
              className="text-xs font-bold text-gov-greenDark hover:underline"
            >
              All Booking History →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {recentCompletedBookings.map((b) => (
              <Card key={b.id} className="p-4 border-slate-200 bg-white hover:border-slate-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={b.workerPhoto} 
                      alt={b.workerName} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-gov-navy">
                        {b.serviceTitle}
                      </h4>
                      <p className="text-[11px] text-gov-muted">
                        With {b.workerName} ({b.trade})
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Last completed: {b.scheduledDateTime}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/customer/workers/${b.workerId}`)}
                    className="text-xs font-bold shrink-0"
                    leftIcon={<RotateCcw className="w-3 h-3" />}
                  >
                    Rebook
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 7. Government Public Trust Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 text-slate-700">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-gov-green shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-gov-navy text-sm">
              KARM SEVA Public Digital Guarantee
            </h4>
            <p className="text-[11px] text-gov-muted leading-relaxed">
              Every booking is backed by cooperative background verification, post-shift escrow release, and automated replacement standby.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-bold text-gov-navy">100% Fair Wages</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-bold text-gov-navy">Zero Hidden Deductions</span>
        </div>
      </div>

    </div>
  );
};
