import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Zap,
  Droplets,
  HeartHandshake,
  Sparkles,
  Hammer,
  Paintbrush,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Camera,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  Star,
  Repeat,
  Info,
  Check,
  Plus,
  Trash2,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import { bookingService, BookingType } from '../../services/bookingService';
import { recurringService, CustomSlotItem, RecurrenceType } from '../../services/recurringService';
import { matchingService } from '../../services/matchingService';

interface ServiceOption {
  id: string;
  title: string;
  category: string;
  icon: any;
  baseRate: number;
  description: string;
}

interface WorkerOption {
  id: string;
  name: string;
  trade: string;
  shram_id: string;
  cooperative_code: string;
  cooperative_name: string;
  rating: number;
  jobsCompleted: number;
  photo: string;
  rate: number;
  distanceKm?: number;
  etaMins?: number;
  matchScore?: number;
  explanations?: string[];
}

const serviceOptions: ServiceOption[] = [
  { id: 'srv-elec-01', title: 'Master Electrician Diagnostic & Wiring', category: 'Electrician', icon: Zap, baseRate: 550, description: 'Circuit inspection, switchboard rewiring, appliance tripping' },
  { id: 'srv-plumb-01', title: 'Certified Plumbing & Pipe Repair', category: 'Plumber', icon: Droplets, baseRate: 500, description: 'Leakage fixing, overhead tank lines, fixture installation' },
  { id: 'srv-care-01', title: 'Elderly / Patient Caregiver Attendance', category: 'Caregiver', icon: HeartHandshake, baseRate: 650, description: 'Vitals monitoring, medication management, mobility support' },
  { id: 'srv-clean-01', title: 'Sanitation & Deep Scrubbing', category: 'Cleaner', icon: Sparkles, baseRate: 450, description: 'Kitchen degreasing, bathroom scrubbing, floor buffing' },
  { id: 'srv-carp-01', title: 'Woodcraft & Door / Furniture Fix', category: 'Carpenter', icon: Hammer, baseRate: 550, description: 'Hinge repair, lock replacement, modular furniture fitting' },
  { id: 'srv-paint-01', title: 'Interior Emulsion & Touch-up Painting', category: 'Painter', icon: Paintbrush, baseRate: 600, description: 'Wall damp proofing, primer, roller painting, ceiling touch-ups' },
  { id: 'srv-driver-01', title: 'Licensed Professional Heavy / Light Driver', category: 'Driver', icon: Truck, baseRate: 700, description: 'Commercial logistics, local transit, defensive driving certified' },
];

const defaultWorkers: WorkerOption[] = [
  {
    id: 'w-01',
    name: 'Ramesh Chandra Behera',
    trade: 'Master Electrician',
    shram_id: 'KS-OD-2024-8841',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    rating: 4.88,
    jobsCompleted: 142,
    photo: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
    rate: 550,
    distanceKm: 1.8,
    etaMins: 15,
    matchScore: 96.8,
  },
  {
    id: 'w-02',
    name: 'Tapan Kumar Das',
    trade: 'Senior Plumber',
    shram_id: 'KS-OD-2024-1044',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    rating: 4.75,
    jobsCompleted: 89,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rate: 500,
    distanceKm: 2.4,
    etaMins: 20,
    matchScore: 92.4,
  },
  {
    id: 'w-03',
    name: 'Sunita Majhi',
    trade: 'Patient Caregiver',
    shram_id: 'KS-OD-2024-3912',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    rating: 4.95,
    jobsCompleted: 98,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    rate: 650,
    distanceKm: 3.1,
    etaMins: 25,
    matchScore: 89.5,
  },
];

export const BookServiceWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard Step (1 to 10)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    serviceOptions.find((s) => s.id === searchParams.get('serviceId')) || serviceOptions[0]
  );
  const [availableWorkers, setAvailableWorkers] = useState<WorkerOption[]>(defaultWorkers);
  const [selectedWorker, setSelectedWorker] = useState<WorkerOption>(
    defaultWorkers.find((w) => w.id === searchParams.get('workerId')) || defaultWorkers[0]
  );
  const [bookingType, setBookingType] = useState<BookingType>('ONE_TIME');
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrenceType>('CUSTOM_SLOT');
  const [customSlots, setCustomSlots] = useState<CustomSlotItem[]>([
    { day_of_week: 'Monday', start_time: '09:00', end_time: '12:00' },
    { day_of_week: 'Wednesday', start_time: '14:00', end_time: '17:00' },
  ]);
  const [totalOccurrences, setTotalOccurrences] = useState(4);
  const [scheduledDate, setScheduledDate] = useState('2026-09-05');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:00 AM');
  const [addressLine, setAddressLine] = useState('Plot 42, Saheed Nagar');
  const [district, setDistrict] = useState('Bhubaneswar');
  const [pincode, setPincode] = useState('751007');
  const [landmark, setLandmark] = useState('Near Rama Devi Women University');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300',
  ]);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingWorkers(true);
    matchingService
      .findMatchingWorkers({
        service_id: selectedService.id,
        service_category: selectedService.category,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
      })
      .then((res) => {
        if (!isMounted) return;
        if (res.candidates && res.candidates.length > 0) {
          const mapped: WorkerOption[] = res.candidates.map((c) => ({
            id: c.worker_id,
            name: c.worker_name,
            trade: c.trade,
            shram_id: c.shram_id || `KS-${c.cooperative_code || 'IN'}-2026`,
            cooperative_code: c.cooperative_code || 'IN-NAT-COOP-001',
            cooperative_name: c.cooperative_name || 'National Labour Cooperative Federation',
            rating: c.rating || 4.85,
            jobsCompleted: c.total_jobs || 50,
            photo: c.photo_url || 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
            rate: c.base_rate || selectedService.baseRate,
            distanceKm: c.distance_km || 2.0,
            etaMins: c.eta_minutes || 15,
            matchScore: c.match_score || 95.0,
            explanations: c.explanations || [],
          }));
          setAvailableWorkers(mapped);
          setSelectedWorker((prev) => {
            const found = mapped.find((w) => w.id === prev?.id);
            return found || mapped[0];
          });
        }
      })
      .catch((err) => {
        console.warn('[BookServiceWizard] Error loading workers from matching engine:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingWorkers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedService.id, selectedService.category, scheduledDate, timeSlot]);

  const timeSlots = [
    '08:00 AM - 10:00 AM (Early Morning)',
    '10:00 AM - 12:00 PM (Morning Slot)',
    '01:00 PM - 03:00 PM (Afternoon Slot)',
    '03:00 PM - 05:00 PM (Late Afternoon)',
    '05:00 PM - 07:00 PM (Evening Shift)',
  ];

  const quickIssueTags = [
    'Main breaker tripping',
    'Switchboard spark / burning smell',
    'Bathroom pipe leaking',
    'Low water pressure',
    'Deep sanitize post-renovation',
    'Door alignment issue',
  ];

  const addCustomSlot = () => {
    setCustomSlots((prev) => [
      ...prev,
      { day_of_week: 'Friday', start_time: '09:00', end_time: '12:00' },
    ]);
  };

  const removeCustomSlot = (index: number) => {
    setCustomSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomSlot = (index: number, field: keyof CustomSlotItem, val: string) => {
    setCustomSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: val } : slot))
    );
  };

  const handleNext = () => {
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      if (bookingType === 'RECURRING') {
        await recurringService.proposeRecurring({
          service_id: selectedService.id,
          service_title: selectedService.title,
          service_category: selectedService.category,
          cooperative_code: selectedWorker.cooperative_code,
          cooperative_name: selectedWorker.cooperative_name,
          worker_id: selectedWorker.id,
          recurrence_type: recurrencePattern,
          custom_slots: recurrencePattern === 'CUSTOM_SLOT' ? customSlots : undefined,
          start_date: scheduledDate,
          total_occurrences: totalOccurrences,
          rate_per_instance: selectedService.baseRate,
          address_line: addressLine,
          district: district,
          pincode: pincode,
          landmark: landmark,
          notes: description,
        });
        navigate('/customer/recurring');
      } else {
        const created = await bookingService.createBooking({
          service_id: selectedService.id,
          service_title: selectedService.title,
          service_category: selectedService.category,
          cooperative_code: selectedWorker.cooperative_code,
          cooperative_name: selectedWorker.cooperative_name,
          scheduled_worker_id: selectedWorker.id,
          booking_type: 'ONE_TIME',
          recurring_frequency: 'NONE',
          scheduled_date: scheduledDate,
          time_slot: timeSlot,
          address_line: addressLine,
          district: district,
          pincode: pincode,
          landmark: landmark,
          description: description,
          media_urls: photos,
          base_rate: selectedService.baseRate,
          extra_charges: 0,
          total_amount: selectedService.baseRate,
        });
        navigate(`/customer/bookings/${created.id}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Could not complete booking request. Please check worker availability and try again.';
      alert(`Booking Notice: ${msg}`);
      navigate(bookingType === 'RECURRING' ? '/customer/recurring' : '/customer/bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              DPI Public Booking Rail
            </span>
            <span className="text-xs text-slate-500 font-medium">0% Commission Guaranteed</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Book Verified Cooperative Service</h1>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold text-slate-500">Step {currentStep} of 10</div>
          <div className="text-xs font-extrabold text-emerald-700">
            {Math.round((currentStep / 10) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gov-navy h-full transition-all duration-300"
          style={{ width: `${(currentStep / 10) * 100}%` }}
        ></div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 min-h-[420px]">
        {/* STEP 1: Select Service */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 1: Select Required Service Trade</h2>
              <p className="text-xs text-slate-500">Choose from cooperative-verified service trades across India</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((srv) => {
                const Icon = srv.icon;
                const isSelected = selectedService.id === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-xl border text-left transition space-y-2 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{srv.title}</div>
                          <span className="text-[10px] font-semibold text-slate-500">{srv.category}</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">{srv.description}</p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Standard Floor Tariff:</span>
                      <span className="text-emerald-700 font-extrabold">₹{srv.baseRate}/day</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Worker */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Step 2: Choose Assigned Tradesperson</h2>
                <p className="text-xs text-slate-500">
                  Ranked by deterministic algorithm: Skill Match (35%), Distance (25%), Availability (20%), Rating (10%), Workload (10%)
                </p>
              </div>
              {isLoadingWorkers && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching live...</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {availableWorkers.map((w, idx) => {
                const isSelected = selectedWorker.id === w.id;
                const matchPct = w.matchScore || (idx === 0 ? 96.8 : idx === 1 ? 92.4 : 89.5);
                const distKm = w.distanceKm || (idx === 0 ? 1.8 : idx === 1 ? 2.4 : 3.1);
                const etaMins = w.etaMins || (idx === 0 ? 15 : idx === 1 ? 20 : 25);

                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWorker(w)}
                    className={`w-full p-4 rounded-xl border text-left transition space-y-2.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={w.photo}
                          alt={w.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-300"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">{w.name}</span>
                            <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                              {w.shram_id}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              {matchPct}% Match
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{w.trade} • {w.cooperative_name}</div>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="flex items-center text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {w.rating}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 font-medium">{w.jobsCompleted} shifts completed</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-blue-700 font-bold">{distKm} km away (~{etaMins}m ETA)</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-extrabold text-slate-900">₹{w.rate}</div>
                        <span className="text-[10px] text-slate-400 font-medium">per shift</span>
                      </div>
                    </div>

                    {/* Explanations Checklist */}
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60 text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {w.explanations && w.explanations.length > 0 ? (
                        w.explanations.map((exp, eIdx) => (
                          <React.Fragment key={eIdx}>
                            {eIdx > 0 && <span className="text-slate-500">•</span>}
                            <span className="text-emerald-700 font-medium">{exp}</span>
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          <span className="text-emerald-700 font-medium">✓ Verified {w.trade}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-700 font-medium">✓ Available for slot</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-700 font-medium">✓ {distKm} km distance</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-700 font-medium">✓ Optimal workload</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Choose One-Time or Recurring with Custom Slot Matrix */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 3: Frequency & Schedule Type</h2>
              <p className="text-xs text-slate-500">Choose single shift, custom day slots, or standing recurring schedule</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setBookingType('ONE_TIME');
                }}
                className={`p-5 rounded-xl border text-left transition space-y-2 ${
                  bookingType === 'ONE_TIME'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  {bookingType === 'ONE_TIME' && <Check className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="font-extrabold text-sm text-slate-900">One-Time Service</div>
                <p className="text-xs text-slate-600">
                  Single on-demand or pre-scheduled visit. Ideal for standard repairs or inspections.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingType('RECURRING');
                  setRecurrencePattern('CUSTOM_SLOT');
                }}
                className={`p-5 rounded-xl border text-left transition space-y-2 ${
                  bookingType === 'RECURRING'
                    ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Repeat className="w-6 h-6 text-purple-600" />
                  {bookingType === 'RECURRING' && <Check className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="font-extrabold text-sm text-slate-900">Recurring Schedule / Contract</div>
                <p className="text-xs text-slate-600">
                  Custom day slots (e.g. Mon 9–12 + Wed 14–17), daily patient caregiver, or weekly cleaning.
                </p>
              </button>
            </div>

            {/* Recurring Settings & Custom Slot Builder */}
            {bookingType === 'RECURRING' && (
              <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-4 text-xs">
                <div>
                  <label className="block font-extrabold text-purple-950 mb-1.5 uppercase tracking-wider text-[11px]">
                    1. Recurrence Pattern:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'CUSTOM_SLOT', label: 'Custom Day Slots (e.g. Mon 9-12, Wed 14-17)' },
                      { id: 'DAILY', label: 'Daily Shifts' },
                      { id: 'WEEKLY', label: 'Weekly' },
                      { id: 'MONTHLY', label: 'Monthly' },
                    ].map((pattern) => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setRecurrencePattern(pattern.id as RecurrenceType)}
                        className={`px-3.5 py-2 rounded-xl font-bold transition text-xs ${
                          recurrencePattern === pattern.id
                            ? 'bg-purple-700 text-white shadow-sm'
                            : 'bg-white text-purple-950 border border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {pattern.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Slot Matrix Builder */}
                {recurrencePattern === 'CUSTOM_SLOT' && (
                  <div className="space-y-3 pt-2 border-t border-purple-200/80">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-purple-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-purple-700" />
                        <span>Define Custom Slot Windows:</span>
                      </label>
                      <button
                        type="button"
                        onClick={addCustomSlot}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-purple-700 hover:text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-300 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Day Slot
                      </button>
                    </div>

                    <div className="space-y-2">
                      {customSlots.map((slot, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-200 shadow-xs">
                          <select
                            value={slot.day_of_week}
                            onChange={(e) => updateCustomSlot(idx, 'day_of_week', e.target.value)}
                            className="font-bold text-xs p-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                          >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1 text-slate-600 font-bold">
                            <span>From:</span>
                            <input
                              type="time"
                              value={slot.start_time}
                              onChange={(e) => updateCustomSlot(idx, 'start_time', e.target.value)}
                              className="p-1 text-xs border rounded-lg font-mono font-bold"
                            />
                            <span>To:</span>
                            <input
                              type="time"
                              value={slot.end_time}
                              onChange={(e) => updateCustomSlot(idx, 'end_time', e.target.value)}
                              className="p-1 text-xs border rounded-lg font-mono font-bold"
                            />
                          </div>

                          {customSlots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCustomSlot(idx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total occurrences */}
                <div className="pt-2 border-t border-purple-200/80 flex items-center justify-between">
                  <span className="font-bold text-purple-950">Number of Planned Shifts:</span>
                  <div className="flex items-center gap-2">
                    {[4, 8, 12, 24].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTotalOccurrences(num)}
                        className={`w-9 h-9 rounded-lg font-extrabold text-xs transition ${
                          totalOccurrences === num
                            ? 'bg-purple-700 text-white'
                            : 'bg-white border border-purple-300 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-purple-300 text-purple-950 text-[11px] leading-relaxed">
                  <strong>Consensual Two-Phase Dispatch:</strong> This schedule will be submitted to <strong>{selectedWorker.name}</strong> as a proposal. Concrete booking dates and OTPs will generate as soon as the artisan accepts!
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Select Date */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 4: Select Starting Service Date</h2>
              <p className="text-xs text-slate-500">Pick preferred shift start date for dispatch</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap gap-2">
                {['2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setScheduledDate(d)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      scheduledDate === d
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{d}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Or choose custom date:</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 font-bold text-slate-800 bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Select Time Slot */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 5: Select Time Slot</h2>
              <p className="text-xs text-slate-500">Preferred arrival time window</p>
            </div>

            <div className="space-y-2">
              {timeSlots.map((slot) => {
                const isSelected = timeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">{slot}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Select Address */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 6: Service Address Details</h2>
              <p className="text-xs text-slate-500">Where should the artisan report for duty?</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Premises / House / Flat Address</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / City</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prominent Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Describe Issue */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 7: Problem Description & Instructions</h2>
              <p className="text-xs text-slate-500">Provide details so the worker arrives with appropriate tooling</p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {quickIssueTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setDescription((prev) => (prev ? `${prev}, ${tag}` : tag))
                    }
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe issue (e.g. circuit tripping in kitchen, leaking pipe under sink, full bathroom scrubbing)..."
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Add Optional Photos */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 8: Attach Photos (Optional)</h2>
              <p className="text-xs text-slate-500">Help the cooperative technician assess parts before arrival</p>
            </div>

            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 bg-slate-50">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Drag & drop photos or tap to take photo</div>
                <div className="text-[11px] text-slate-400">PNG, JPG, HEIC up to 5MB</div>
              </div>

              {photos.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Attached Photos ({photos.length}):</div>
                  <div className="flex gap-3">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300">
                        <img src={p} alt="attached" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos([])}
                          className="absolute top-1 right-1 bg-slate-950/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 9: Review Pricing */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Step 9: Transparent Rate & Escrow Breakdown</h2>
              <p className="text-xs text-slate-500">
                Odisha Gazette certified floor wage with zero middleman deductions
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-600">Base Labor Floor Tariff ({selectedService.title}):</span>
                <span className="font-bold text-slate-900">₹{selectedService.baseRate}.00</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-emerald-800">
                <div className="space-y-0.5">
                  <span className="font-bold">Direct Worker Take-Home (90%):</span>
                  <div className="text-[10px] text-emerald-600">Same-Day DBT to {selectedWorker.name}</div>
                </div>
                <span className="font-extrabold text-emerald-800">₹{(selectedService.baseRate * 0.9).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-blue-800">
                <div className="space-y-0.5">
                  <span className="font-bold">Cooperative Welfare Trust (10%):</span>
                  <div className="text-[10px] text-blue-600">Worker Insurance & Training Reserve</div>
                </div>
                <span className="font-extrabold text-blue-800">₹{(selectedService.baseRate * 0.1).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-500">
                <span className="font-bold">Platform Middleware Commission:</span>
                <span className="font-extrabold text-slate-700">₹0.00 (0.0%)</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount {bookingType === 'RECURRING' ? `(${totalOccurrences} shifts)` : 'Payable'}:</span>
                <span className="text-lg text-emerald-700 font-extrabold flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {bookingType === 'RECURRING' ? selectedService.baseRate * totalOccurrences : selectedService.baseRate}.00
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Payment is settled directly upon job completion after you share the 4-digit verification OTP.
              </span>
            </div>
          </div>
        )}

        {/* STEP 10: Confirm Booking */}
        {currentStep === 10 && (
          <div className="space-y-4">
            <div className="text-center space-y-2 py-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Step 10: Confirm {bookingType === 'RECURRING' ? 'Recurring Proposal' : 'Booking Dispatch'}
              </h2>
              <p className="text-xs text-slate-500">
                Review your summary and submit request to {selectedWorker.name}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div><strong>Service:</strong> {selectedService.title}</div>
              <div><strong>Worker:</strong> {selectedWorker.name} ({selectedWorker.shram_id})</div>
              <div>
                <strong>Type:</strong> {bookingType === 'RECURRING' ? `Recurring (${recurrencePattern.replace('_', ' ')}) • ${totalOccurrences} shifts` : `One-Time • ${scheduledDate} • ${timeSlot}`}
              </div>
              <div><strong>Location:</strong> {addressLine}, {district} - {pincode}</div>
              <div>
                <strong>Total Amount:</strong> ₹
                {bookingType === 'RECURRING' ? selectedService.baseRate * totalOccurrences : selectedService.baseRate}.00 (0% Platform Fee)
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {bookingType === 'RECURRING'
                  ? 'Your recurring schedule will be forwarded to the worker for consent. Shift instances will be added to your calendar once accepted.'
                  : `Your booking reference will be generated and assigned to ${selectedWorker.cooperative_name}.`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {currentStep < 10 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-lg animate-pulse"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : bookingType === 'RECURRING' ? 'Propose Recurring Schedule' : 'Confirm & Track Shift'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
