import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  bookingService,
  BookingRecord,
  BookingStatus,
} from '../../services/bookingService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Calendar,
  Clock,
  MapPin,
  KeyRound,
  ChevronRight,
  PlusCircle,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

export const BookingsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') {
      return ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.status);
    }
    if (filterTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (filterTab === 'CANCELLED') return ['CANCELLED', 'DECLINED', 'DISPUTED'].includes(b.status);
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
            AWAITING CONFIRMATION
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
            WORKER CONFIRMED
          </span>
        );
      case 'ON_THE_WAY':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 animate-pulse">
            ON THE WAY (IN TRANSIT)
          </span>
        );
      case 'ARRIVED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800">
            ARRIVED AT LOCATION
          </span>
        );
      case 'STARTED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
            WORK IN PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
            CANCELLED
          </span>
        );
      case 'DECLINED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
            WORKER DECLINED
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-amber-600" />
            IN CONCILIATION
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-14 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Citizen Bookings Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">Odisha State Public Rail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Track active technician shifts, upcoming visits, and completed service invoices
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/customer/book')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Service Booking</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Bookings' },
          { id: 'ACTIVE', label: 'Active & In-Transit' },
          { id: 'COMPLETED', label: 'Completed Jobs' },
          { id: 'CANCELLED', label: 'Cancelled / Disputed' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterTab === tab.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-navy"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-gov-navy text-base">No bookings found in this category</h3>
          <p className="text-xs text-gov-muted">Book a verified artisan from your local cooperative.</p>
          <Button size="sm" variant="primary" onClick={() => navigate('/customer/book')} className="text-xs">
            Start New Booking
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isActive = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.status);
            return (
              <Card
                key={b.id}
                onClick={() => navigate(`/customer/bookings/${b.id}`)}
                className="p-5 border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
                  {/* Left: Service & Worker Info */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {b.booking_reference}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-gov-navy truncate">
                        {b.service_title}
                      </h3>
                      {getStatusBadge(b.status)}
                    </div>

                    <p className="text-xs text-gov-muted flex flex-wrap items-center gap-x-2">
                      <span className="font-bold text-slate-800">{b.worker_name}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-500">{b.worker_shram_id || 'Verified KARM ID'}</span>
                      <span>·</span>
                      <span className="text-[11px]">{b.cooperative_name}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-gov-green" />
                        <span>{b.scheduled_date} ({b.time_slot})</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 truncate max-w-[260px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{b.address_line}, {b.district}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: OTP, Price & Action */}
                  <div className="w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3 shrink-0">
                    {/* Active OTP Chip */}
                    {isActive && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        <KeyRound className="w-3.5 h-3.5 text-gov-green" />
                        <span className="text-[11px] text-emerald-800 font-bold">Start OTP:</span>
                        <span className="font-mono font-black text-xs text-emerald-900 tracking-wider">
                          {b.otp_code}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-gov-muted uppercase block">Total Tariff</span>
                      <span className="font-black text-lg text-gov-navy">₹{b.total_amount}.00</span>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isActive ? 'primary' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/bookings/${b.id}`);
                        }}
                        className="text-xs font-bold shadow-xs"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        {isActive ? 'Track Live Shift' : 'View Timeline'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
