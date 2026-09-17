import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sparkles,
  Zap,
  Phone,
  X,
  Radio,
} from 'lucide-react';
import { LiveWorkerTrackingMap } from '@/components/customer/LiveWorkerTrackingMap';
import { bookingService, BookingRecord } from '@/services/bookingService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export const CustomerWorkerTrackingPage: React.FC = () => {
  const { bookingId, id } = useParams<{ bookingId?: string; id?: string }>();
  const activeBookingId = bookingId || id;
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStatus, setCurrentStatus] = useState<string>('ON_THE_WAY');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    if (!activeBookingId) return;
    bookingService
      .getBookingDetail(activeBookingId)
      .then((b: BookingRecord | null) => {
        if (b) {
          setBooking(b);
          if (b.status) setCurrentStatus(b.status);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeBookingId]);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    if (booking && booking.status !== newStatus) {
      setBooking((prev) => (prev ? { ...prev, status: newStatus as any } : prev));
    }
  };

  // Determine stage progression for 5-stage lifecycle
  const getStageIndex = (st: string): number => {
    switch (st) {
      case 'REQUESTED':
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 1;
      case 'ON_THE_WAY':
        return 2;
      case 'ARRIVED':
        return 3;
      case 'STARTED':
      case 'IN_PROGRESS':
        return 4;
      case 'COMPLETED':
        return 5;
      default:
        return 2;
    }
  };

  const activeStage = getStageIndex(currentStatus);

  if (loading && !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-gov-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-700">
          Initializing Live Dispatch GPS Telemetry...
        </p>
      </div>
    );
  }

  const bookingRef =
    booking?.booking_reference ||
    (activeBookingId === '5e8dff0f-25a5-4e34-946e-49d4e3776cdf'
      ? 'BK-2026-8801'
      : `BK-${(activeBookingId || 'LIVE').slice(0, 8).toUpperCase()}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-900">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() =>
              navigate(activeBookingId ? `/customer/bookings/${activeBookingId}` : '/customer/bookings')
            }
            className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            aria-label="Back to Booking Details"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Live Dispatch Tracking
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-950 font-mono font-black text-xs border border-blue-300">
                {bookingRef}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
              <Radio className="w-3.5 h-3.5 text-gov-green animate-pulse" />
              Real-time road transit telemetry via Sovereign Labour Cooperative Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-black text-slate-800 border-slate-300 bg-white hover:bg-slate-100 shadow-xs"
            leftIcon={<HelpCircle className="w-4 h-4 text-gov-green" />}
            onClick={() => setShowHelpModal(true)}
          >
            Dispatch Help
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="text-xs font-black bg-gov-navy hover:bg-gov-navyDark text-white shadow-xs"
            leftIcon={<FileText className="w-4 h-4 text-white" />}
            onClick={() => navigate(activeBookingId ? `/customer/bookings/${activeBookingId}` : '/customer/bookings')}
          >
            View Full Bill
          </Button>
        </div>
      </div>

      {/* Main Grid: Live Map Tracking + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 space-y-6">
          <LiveWorkerTrackingMap
            bookingId={activeBookingId || '5e8dff0f-25a5-4e34-946e-49d4e3776cdf'}
            height="560px"
            showCardOverlay={true}
            onStatusChange={handleStatusChange}
          />

          {/* Dynamic 5-Stage Lifecycle Timeline */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gov-green" /> Service Progress Milestones
                </span>
                <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  Live Status: {currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {/* Step 1: Confirmed */}
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  activeStage > 1
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : activeStage === 1
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/40 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 opacity-70'
                } space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">Step 1</span>
                  {activeStage > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : activeStage === 1 ? (
                    <Zap className="w-4 h-4 text-blue-600 animate-bounce" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h5 className="font-black text-xs text-slate-900">Confirmed</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  Cooperative assigned verified artisan
                </p>
              </div>

              {/* Step 2: On The Way */}
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  activeStage > 2
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : activeStage === 2
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/40 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 opacity-70'
                } space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">Step 2</span>
                  {activeStage > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : activeStage === 2 ? (
                    <Zap className="w-4 h-4 text-blue-600 animate-bounce" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h5 className="font-black text-xs text-slate-900">On The Way</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  En route via city road network
                </p>
              </div>

              {/* Step 3: Arrival */}
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  activeStage > 3
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : activeStage === 3
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/40 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 opacity-70'
                } space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">Step 3</span>
                  {activeStage > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : activeStage === 3 ? (
                    <MapPin className="w-4 h-4 text-blue-600 animate-bounce" />
                  ) : (
                    <MapPin className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h5 className="font-black text-xs text-slate-900">Arrival</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  Reaches doorstep & verifies OTP
                </p>
              </div>

              {/* Step 4: In Progress */}
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  activeStage > 4
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : activeStage === 4
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/40 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 opacity-70'
                } space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">Step 4</span>
                  {activeStage > 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : activeStage === 4 ? (
                    <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h5 className="font-black text-xs text-slate-900">In Progress</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  Work done under safety protocols
                </p>
              </div>

              {/* Step 5: Completed */}
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  activeStage === 5
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 opacity-70'
                } space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">Step 5</span>
                  <CheckCircle2
                    className={`w-4 h-4 ${activeStage === 5 ? 'text-emerald-600' : 'text-slate-400'}`}
                  />
                </div>
                <h5 className="font-black text-xs text-slate-900">Completed</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  Verified & direct DBT settled
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Service & Cooperative Verification Specs */}
        <div className="lg:col-span-4 space-y-5">
          {/* Cooperative Guarantee Card */}
          <Card
            header={
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gov-green" /> Sovereign Protection
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-950">Cooperative Union:</span>
                <span className="font-black text-emerald-900 text-xs">
                  {booking?.cooperative_name || 'Bhubaneswar Urban Craftsmen Federation'}
                </span>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed font-medium">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">15-Minute Replacement Guarantee:</strong> If the worker faces
                    transport trouble, standby backup is auto-dispatched.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">0% Platform Commission:</strong> 90% goes directly to craftsman,
                    10% to cooperative welfare corpus.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Police & ITI Cleared:</strong> 100% background-checked verified
                    guild members.
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Destination & Scheduled Timing */}
          <Card
            header={
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Destination & Schedule
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Service Type:</span>
                <p className="font-black text-slate-900 text-sm">
                  {booking?.service_title || 'Master Electrician Diagnostic & Wiring'}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Destination Address:</span>
                <p className="font-bold text-slate-800">
                  {booking?.address_line || 'Plot 412, Saheed Nagar'}, {booking?.district || 'Khordha'} -{' '}
                  {booking?.pincode || '751007'}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Scheduled Time Slot:</span>
                <p className="font-black text-emerald-700">
                  {booking?.scheduled_date || 'Today'} · {booking?.time_slot || '09:00 AM - 11:00 AM'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Cooperative Dispatch Control</h3>
                  <p className="text-[11px] text-slate-500">24/7 Rapid Assistance & Transit Hotline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Toll-Free Control Room:</span>
                  <a
                    href="tel:1800527600"
                    className="font-mono font-black text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> 1800-KARM-00
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">District Dispatch Cell:</span>
                  <span className="font-mono font-bold text-slate-800">+91 (0674) 254-8841</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Active Booking:</span>
                  <span className="font-mono font-bold text-slate-900">{bookingRef}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-medium">
                <p>• If your assigned artisan has not moved in 10 minutes, our dispatch officer auto-calls them.</p>
                <p>• In case of transit breakdown, an alternate verified guild worker is auto-dispatched within 15 minutes.</p>
                <p>• Your address details remain protected under sovereign privacy protocols.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-bold text-slate-800 border-slate-300"
                onClick={() => setShowHelpModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs font-bold bg-gov-green hover:bg-gov-greenDark text-white"
                onClick={() => {
                  window.location.href = 'tel:1800527600';
                  setShowHelpModal(false);
                }}
              >
                Call Control Desk
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
