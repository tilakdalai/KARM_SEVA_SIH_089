import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  bookingService,
  BookingRecord,
  BookingStatus,
} from '../../services/bookingService';
import {
  paymentService,
  OrderRecord,
  InvoiceRecord,
  PaymentVerifyRecord,
} from '@/services/paymentService';
import { reviewService } from '@/services/reviewService';
import { complaintService, ComplaintCategory } from '@/services/complaintService';
import { RazorpayTestModal } from '@/components/common/RazorpayTestModal';
import { InvoiceModal } from '@/components/common/InvoiceModal';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import {
  ArrowLeft,
  Clock,
  MapPin,
  KeyRound,
  ShieldCheck,
  PhoneCall,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Star,
  X,
  AlertOctagon,
  Check,
  Printer,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { LiveWorkerTrackingMap } from '@/components/customer/LiveWorkerTrackingMap';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment & Invoice state
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [orderRecord, setOrderRecord] = useState<OrderRecord | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceRecord, setInvoiceRecord] = useState<InvoiceRecord | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Modals state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState<ComplaintCategory>('SERVICE_QUALITY');
  const [disputeTitle, setDisputeTitle] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await bookingService.getBookingDetail(id);
      setBooking(data);
      if (data?.rating) {
        setRatingSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionLoading(true);
    try {
      await bookingService.updateStatus(booking.id, 'CANCELLED', undefined, cancelReason);
      setCancelModalOpen(false);
      fetchDetail();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisputeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionLoading(true);
    try {
      await complaintService.fileComplaint({
        booking_id: booking.id,
        category: disputeCategory,
        title: disputeTitle || `${disputeCategory.replace('_', ' ')} Dispute`,
        description: disputeReason,
        evidence: disputeEvidence ? [disputeEvidence] : [],
        cooperative_code: booking.cooperative_code,
      });
      setDisputeModalOpen(false);
      setDisputeReason('');
      setDisputeTitle('');
      setDisputeEvidence('');
      fetchDetail();
      alert('Grievance lodged successfully. The Cooperative Conciliation Officer has been notified under 48h SLA.');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to file grievance.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionLoading(true);
    try {
      await reviewService.submitCustomerRating({
        booking_id: booking.id,
        overall_rating: selectedRating,
        service_quality: serviceQuality,
        professionalism: professionalism,
        punctuality: punctuality,
        communication: communication,
        comment: reviewText,
      });
      setRatingSubmitted(true);
      setRatingModalOpen(false);
      fetchDetail();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const order = await paymentService.createOrder({
        booking_id: booking.id,
        amount: booking.total_amount,
        currency: 'INR',
      });
      setOrderRecord(order);
      setRazorpayModalOpen(true);
    } catch (err) {
      console.error('Failed to create payment order:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentSuccess = async (verifyRecord: PaymentVerifyRecord) => {
    setIsPaid(true);
    try {
      const inv = await paymentService.getInvoice(verifyRecord.booking_id);
      setInvoiceRecord(inv);
      setInvoiceModalOpen(true);
    } catch (err) {
      console.error('Failed to load invoice:', err);
    }
  };

  const handleOpenInvoice = async () => {
    if (!booking) return;
    try {
      const inv = await paymentService.getInvoice(booking.id);
      setInvoiceRecord(inv);
      setInvoiceModalOpen(true);
    } catch (err) {
      console.error('Failed to load invoice:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-navy"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Record Not Found</h2>
        <Button onClick={() => navigate('/customer/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  // 6 Lifecycle Steps Definition
  const lifecycleSteps: { status: BookingStatus; title: string; desc: string }[] = [
    {
      status: 'REQUESTED',
      title: 'Booking Placed by Citizen',
      desc: 'Dispatched to local cooperative registry; awaiting artisan acceptance.',
    },
    {
      status: 'ACCEPTED',
      title: 'Tradesperson Assigned & Confirmed',
      desc: 'Artisan confirmed shift schedule and verified tool requirements.',
    },
    {
      status: 'ON_THE_WAY',
      title: 'Tradesperson In Transit',
      desc: 'Technician is en route to your service address via cooperative navigation.',
    },
    {
      status: 'ARRIVED',
      title: 'Arrived at Destination',
      desc: 'Tradesperson has reached your gate/doorstep; share OTP to commence.',
    },
    {
      status: 'STARTED',
      title: 'Work in Progress',
      desc: 'Active diagnostic & repair underway under statutory safety guidelines.',
    },
    {
      status: 'COMPLETED',
      title: 'Service Completed & Verified',
      desc: 'Job finished, verified by citizen, and queued for same-day direct bank settlement.',
    },
  ];

  const statusOrder: Record<BookingStatus, number> = {
    REQUESTED: 1,
    ACCEPTED: 2,
    ON_THE_WAY: 3,
    ARRIVED: 4,
    STARTED: 5,
    COMPLETED: 6,
    DECLINED: 0,
    CANCELLED: 0,
    DISPUTED: 5,
  };

  const currentStepNum = statusOrder[booking.status] || 1;
  const isException = ['CANCELLED', 'DECLINED', 'DISPUTED'].includes(booking.status);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/customer/bookings')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <Button
            size="sm"
            variant="primary"
            className="text-xs font-bold shadow-sm"
            leftIcon={<Navigation className="w-3.5 h-3.5 text-white" />}
            onClick={() => navigate(`/customer/bookings/${booking.id}/track`)}
          >
            Track Live Route & ETA
          </Button>

          <span className="text-xs text-gov-muted hidden sm:inline">Reference:</span>
          <span className="font-mono font-bold text-xs bg-slate-100 text-gov-navy px-2.5 py-1 rounded border border-slate-200">
            {booking.booking_reference}
          </span>
        </div>
      </div>

      {/* Main Status & Hero Overview */}
      <div className="rounded-3xl bg-white border border-gov-border shadow-sm p-6 sm:p-8 space-y-6">
        {/* Service Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {booking.service_category}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {booking.booking_type}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gov-navy">
              {booking.service_title}
            </h1>
            <p className="text-xs text-gov-muted">
              Scheduled for <strong>{booking.scheduled_date} ({booking.time_slot})</strong>
            </p>
          </div>

          {/* OTP Code Box (if active) */}
          {!['COMPLETED', 'CANCELLED', 'DECLINED'].includes(booking.status) && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center justify-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-gov-green" />
                <span>Verification OTP</span>
              </span>
              <div className="font-mono font-black text-2xl text-emerald-950 tracking-widest mt-1">
                {booking.otp_code}
              </div>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                Share with artisan upon arrival
              </span>
            </div>
          )}
        </div>

        {/* Exception State Banner (if cancelled/disputed) */}
        {isException && (
          <div className="p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-900 space-y-1 text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Status Notice: {booking.status}</span>
            </div>
            <p className="text-[11px] text-rose-800">
              Reason: {booking.cancellation_reason || booking.decline_reason || booking.dispute_reason || 'Administrative status transition.'}
            </p>
          </div>
        )}

        {/* 6-Step Visual Lifecycle Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gov-navy flex items-center gap-2">
              <Clock className="w-4 h-4 text-gov-green" />
              <span>Real-Time Service Lifecycle & Dispatch Timeline</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Current: {booking.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-3">
            {lifecycleSteps.map((step, idx) => {
              const stepIndex = idx + 1;
              const isCompleted = currentStepNum > stepIndex;
              const isActive = currentStepNum === stepIndex && !isException;

              return (
                <div key={step.status} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-gov-green border-gov-green text-white'
                        : isActive
                        ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{stepIndex}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={`font-extrabold text-xs sm:text-sm ${
                          isCompleted || isActive ? 'text-gov-navy' : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.2 rounded">
                          ACTIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gov-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Worker Info, Live Tracking Map & Price Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Tracking Map & Assigned Craftsman Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Dispatch Map Tracking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gov-navy flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-gov-green" />
                <span>Live Cooperative Dispatch Radar & Route</span>
              </span>
              <button
                onClick={() => navigate(`/customer/bookings/${booking.id}/track`)}
                className="text-[11px] font-bold text-gov-green hover:text-gov-greenDark flex items-center gap-1 hover:underline"
              >
                Full Screen Map ↗
              </button>
            </div>
            <LiveWorkerTrackingMap
              bookingId={booking.id}
              height="340px"
              showCardOverlay={false}
            />
          </div>

          {/* Replacement Transparency Alert Card */}
          {booking.is_replacement && (
            <div className="p-4 rounded-xl border bg-amber-50/90 border-amber-300 text-amber-950 space-y-1.5 text-xs shadow-sm">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Notice: Original Artisan Unavailable • Verified Standby Replacement Assigned</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                The original scheduled artisan was placed on statutory leave ({booking.replacement_reason || 'Medical / Emergency Leave'}).
                Your cooperative has dispatched verified standby artisan <strong>{booking.worker_name}</strong> with 100% background clearance, active warranty, and cooperative satisfaction guarantee.
              </p>
            </div>
          )}

          <Card
            header={
              <span className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gov-green" /> {booking.is_replacement ? 'Assigned Replacement Craftsman' : 'Assigned Verified Craftsman'}
              </span>
            }
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150"
                  alt={booking.worker_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h3 className="font-black text-base text-gov-navy">{booking.worker_name}</h3>
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {booking.worker_shram_id || 'KS-OD-2024-8841'}
                    </span>
                  </div>

                  <p className="text-xs text-gov-muted">
                    {booking.worker_trade || booking.service_title} · <strong>{booking.cooperative_name}</strong>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <span className="font-bold text-emerald-700">✓ Police Cleared</span>
                    <span>·</span>
                    <span className="font-bold text-blue-700">✓ ITI Certified</span>
                  </div>
                </div>
              </div>

              {/* Masked Contact & Call Action */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gov-muted block">Cooperative Helpline Dispatch:</span>
                  <span className="font-mono font-bold text-gov-navy">+91 98765-XXXXX</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold"
                  leftIcon={<PhoneCall className="w-3.5 h-3.5 text-gov-green" />}
                  onClick={() => alert(`Calling cooperative dispatch bridge for ${booking.worker_name}...`)}
                >
                  Call Worker
                </Button>
              </div>

              {/* Service Address */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Service Destination</span>
                </span>
                <p className="font-bold text-gov-navy">{booking.address_line}, {booking.district} - {booking.pincode}</p>
                {booking.description && (
                  <p className="text-[11px] text-gov-muted italic mt-1">
                    Problem notes: "{booking.description}"
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Replacement Guard Guarantee */}
          <Card
            header={
              <span className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gov-green" /> Cooperative Replacement Guard
              </span>
            }
          >
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Replacement Guard Status:</span>
                <span className="font-black text-emerald-800 text-xs uppercase bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Active & Guaranteed
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                If the assigned craftsman encounters a transport delay or medical emergency, the local Labour Cooperative automatically dispatches a verified standby worker within 15 minutes at zero extra cost.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Payment Breakdown & Action Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            header={
              <span className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" /> Transparent Bill Breakdown
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Craftsman Base Wage (90%):</span>
                <span className="font-bold text-emerald-700">₹{(booking.base_rate * 0.9).toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Cooperative Welfare & Insurance (10%):</span>
                <span className="font-bold text-blue-700">₹{(booking.base_rate * 0.1).toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Platform Middleware Commission (0%):</span>
                <span className="font-bold text-slate-800">₹0.00 (0.0%)</span>
              </div>

              <div className="flex justify-between pt-2 font-black text-base text-gov-navy">
                <span>Total Amount:</span>
                <span className="text-emerald-700 font-black">₹{booking.total_amount}.00</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2 border-t border-slate-100">
                {/* Razorpay Test Mode Payment Action */}
                {['STARTED', 'COMPLETED'].includes(booking.status) && (
                  <div className="space-y-2 pb-2">
                    {isPaid ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Payment Verified & Settled to Worker</span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleOpenInvoice}
                          className="w-full text-xs font-bold bg-white border-emerald-300 text-emerald-900 flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-700" />
                          <span>View & Print GST Tax Invoice</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleInitiatePayment}
                          className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay ₹{booking.total_amount}.00 via Razorpay</span>
                        </Button>
                        <span className="text-[10px] text-center block text-slate-400 font-medium">
                          Test Mode Sandbox • Zero Platform Cut • 90% Direct to Artisan
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Rating Button if Completed */}
                {booking.status === 'COMPLETED' && (
                  <div className="space-y-1">
                    {ratingSubmitted || booking.rating ? (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1 text-emerald-800 font-extrabold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Rated {booking.rating || selectedRating} ★ (Feedback Recorded)</span>
                        </div>
                        <p className="text-[10px] text-emerald-600">
                          Thank you for rating! Badges and performance metrics have been recalculated.
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full text-xs font-bold py-2.5 bg-amber-600 hover:bg-amber-700"
                        leftIcon={<Star className="w-4 h-4" />}
                        onClick={() => setRatingModalOpen(true)}
                      >
                        Rate & Review Service (5 Dimensions)
                      </Button>
                    )}
                  </div>
                )}

                {/* Cancel Booking Button */}
                {['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Dispute Button */}
                {['STARTED', 'COMPLETED'].includes(booking.status) && (
                  <button
                    type="button"
                    onClick={() => setDisputeModalOpen(true)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition flex items-center justify-center gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Raise Grievance / Dispute</span>
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Cancel Booking</h3>
              <button onClick={() => setCancelModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelBooking} className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Are you sure you want to cancel booking <strong>{booking.booking_reference}</strong>?
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Cancellation</label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please state why you are cancelling..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-600">Statutory Redressal</span>
                <h3 className="font-extrabold text-base text-slate-900">Lodge Conciliation Grievance</h3>
              </div>
              <button onClick={() => setDisputeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisputeBooking} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                Your dispute will be forwarded to the <strong>{booking.cooperative_name}</strong> Conciliation Desk under 48-hour mandatory SLA resolution.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispute Category <span className="text-rose-500">*</span></label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value as ComplaintCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  <option value="SERVICE_QUALITY">Service Quality & Workmanship</option>
                  <option value="WORKER_BEHAVIOUR">Worker Conduct & Professionalism</option>
                  <option value="PAYMENT">Payment & Escrow Tariff Dispute</option>
                  <option value="NO_SHOW">No Show / Unscheduled Absence</option>
                  <option value="DAMAGE">Property Damage & Breakage</option>
                  <option value="SAFETY">Safety Protocol & Hazardous Work</option>
                  <option value="INCORRECT_CHARGE">Incorrect Material or Rate Surcharge</option>
                  <option value="OTHER">Other Grievance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grievance Summary / Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={disputeTitle}
                  onChange={(e) => setDisputeTitle(e.target.value)}
                  placeholder="e.g. Switchboard casing cracked, unexpected material surcharge..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Detail what went wrong and what resolution you are requesting..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo / Document Evidence URL (Optional)</label>
                <input
                  type="url"
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  placeholder="https://storage.karmseva.gov.in/evidence/damage.jpg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Lodging Grievance...' : 'Submit to Conciliation Desk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5-Dimension Rate & Review Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Citizen Quality Feedback</span>
                <h3 className="font-extrabold text-lg text-slate-900">Rate & Review Artisan</h3>
              </div>
              <button onClick={() => setRatingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRateBooking} className="space-y-5 text-xs">
              {/* Star Dimension 1: Overall */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-center space-y-1.5">
                <div className="font-black text-sm text-slate-900">Overall Satisfaction</div>
                <p className="text-[11px] text-slate-500">How would you rate the overall service experience?</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= selectedRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Multi-Dimensional Criteria Sliders */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Detailed Performance Categories
                </div>

                {/* 1. Service Quality */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-800">Workmanship & Craft Quality</div>
                    <div className="text-[10px] text-slate-400">Technical precision & durability</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServiceQuality(s)}
                        className={`w-6 h-6 text-xs font-bold rounded-full transition ${
                          s <= serviceQuality ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Professionalism */}
                <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <div className="font-bold text-slate-800">Professionalism & Cleanliness</div>
                    <div className="text-[10px] text-slate-400">Neat attire & clean workspace</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setProfessionalism(s)}
                        className={`w-6 h-6 text-xs font-bold rounded-full transition ${
                          s <= professionalism ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Punctuality */}
                <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <div className="font-bold text-slate-800">Arrival Timing & Punctuality</div>
                    <div className="text-[10px] text-slate-400">Arrived within slot timeframe</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPunctuality(s)}
                        className={`w-6 h-6 text-xs font-bold rounded-full transition ${
                          s <= punctuality ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Communication */}
                <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <div className="font-bold text-slate-800">Communication & Politeness</div>
                    <div className="text-[10px] text-slate-400">Respectful conduct & clarity</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCommunication(s)}
                        className={`w-6 h-6 text-xs font-bold rounded-full transition ${
                          s <= communication ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Written Review & Feedback (Optional)</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details of the repair, speed, or recommendations..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Recording...' : 'Submit 5-Dimension Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Razorpay Test Modal */}
      <RazorpayTestModal
        order={orderRecord}
        isOpen={razorpayModalOpen}
        onClose={() => setRazorpayModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Printable / Downloadable GST Invoice Modal */}
      <InvoiceModal
        invoice={invoiceRecord}
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />
    </div>
  );
};
