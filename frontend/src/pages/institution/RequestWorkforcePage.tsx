import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Building2,
  Clock,
  Calendar,
  MapPin,
  FileText,
  ShieldCheck,
  IndianRupee,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { institutionService, WorkforceItemRequirement } from '../../services/institutionService';

const AVAILABLE_TRADES = [
  { trade: 'Cleaner', defaultRate: 450, group: 'GROUP_D', description: 'Deep sanitization, bio-waste & housekeeping' },
  { trade: 'Electrician', defaultRate: 550, group: 'GROUP_A', description: 'Certified power distribution, wiring & maintenance' },
  { trade: 'Plumber', defaultRate: 500, group: 'GROUP_B', description: 'Sanitary fixtures, pumps & drainage network' },
  { trade: 'Patient Caregiver', defaultRate: 650, group: 'GROUP_A', description: 'Certified patient assistance & nursing support' },
  { trade: 'Driver', defaultRate: 600, group: 'GROUP_A', description: 'Commercial heavy/light vehicle licensed driver' },
  { trade: 'Carpenter', defaultRate: 500, group: 'GROUP_C', description: 'Furniture repair & fixture installation' },
  { trade: 'Gardener', defaultRate: 450, group: 'GROUP_C', description: 'Horticulture, landscaping & campus maintenance' },
  { trade: 'HVAC / AC Technician', defaultRate: 600, group: 'GROUP_C', description: 'Chiller, split AC servicing & air filter cleaning' },
];

export const RequestWorkforcePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('Comprehensive Hospital Facility & Maintenance Staffing');
  const [facilityLocation, setFacilityLocation] = useState('AIIMS Bhubaneswar Campus, Sijua, Patrapada, Bhubaneswar');
  const [durationMonths, setDurationMonths] = useState(1);
  const [startDate, setStartDate] = useState('2024-10-01');
  const [endDate, setEndDate] = useState('2024-10-31');
  const [recurringFrequency, setRecurringFrequency] = useState('DAILY');
  const [shiftStartTime, setShiftStartTime] = useState('09:00 AM');
  const [shiftEndTime, setShiftEndTime] = useState('05:00 PM');
  const [additionalInstructions, setAdditionalInstructions] = useState(
    'All personnel must carry verified Aadhaar/KARM ID cards, wear medical-grade sanitization gear in ICU wings, and report to Facility Section at 8:45 AM for muster.'
  );

  // Multi-trade items (default prefilled with user prompt example: 2 Electricians, 3 Cleaners, 1 Plumber)
  const [items, setItems] = useState<WorkforceItemRequirement[]>([
    { trade: 'Electrician', quantity: 2, daily_floor_rate: 550 },
    { trade: 'Cleaner', quantity: 3, daily_floor_rate: 450 },
    { trade: 'Plumber', quantity: 1, daily_floor_rate: 500 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addItem = () => {
    setItems([...items, { trade: 'Cleaner', quantity: 1, daily_floor_rate: 450 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemTrade = (index: number, tradeName: string) => {
    const found = AVAILABLE_TRADES.find((t) => t.trade === tradeName);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      trade: tradeName,
      daily_floor_rate: found?.defaultRate || 450,
    };
    setItems(updated);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], quantity: Math.max(1, quantity) };
    setItems(updated);
  };

  // Cost calculations
  const totalHeadcount = items.reduce((acc, it) => acc + Number(it.quantity), 0);
  const dailyTotal = items.reduce((acc, it) => acc + it.quantity * (it.daily_floor_rate || 450), 0);
  const monthlyTotal = dailyTotal * 26 * durationMonths; // 26 standard working days/month

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await institutionService.createWorkforceRequest({
        title,
        facility_location: facilityLocation,
        duration_months: durationMonths,
        start_date: startDate,
        end_date: endDate,
        recurring_frequency: recurringFrequency,
        shift_start_time: shiftStartTime,
        shift_end_time: shiftEndTime,
        additional_instructions: additionalInstructions,
        items,
      });
      setSuccessMessage('Bulk Workforce Requisition successfully submitted to Khurda Cooperative Union!');
      setTimeout(() => {
        navigate('/institution/requests');
      }, 1500);
    } catch {
      alert('Error submitting request. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Procurement & Requisition
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B / B2G Workflow</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Request Workforce Deployment</h1>
          <p className="text-xs text-slate-500">
            Combine multiple trade requirements (Electricians, Cleaners, Plumbers) into a single SLA agreement.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Direct Union Allocation (Khurda Cooperative Union)</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Request Title & Facility */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              1. Facility & Requisition Summary
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requisition Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="e.g. Monthly Clinical Wing Facility & Power Staffing"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facility Deployment Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={facilityLocation}
                    onChange={(e) => setFacilityLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    placeholder="e.g. Main Hospital Campus, Block B & C"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Multi-Trade Requirements Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  2. Trade Requirements & Headcount
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Specify how many workers you need per trade</p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trade</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Select Service / Trade
                      </label>
                      <select
                        value={item.trade}
                        onChange={(e) => updateItemTrade(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white rounded-md border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        {AVAILABLE_TRADES.map((t) => (
                          <option key={t.trade} value={t.trade}>
                            {t.trade} (Min ₹{t.defaultRate}/day)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Headcount Required
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 1)}
                          className="w-24 px-2.5 py-1.5 bg-white rounded-md border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                        <span className="text-xs text-slate-500 font-medium">Workers</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-900">
                        ₹{((item.daily_floor_rate || 450) * item.quantity).toLocaleString('en-IN')}/day
                      </div>
                      <div className="text-[10px] text-slate-500">Floor Rate: ₹{item.daily_floor_rate}/day</div>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 rounded-md text-rose-500 hover:bg-rose-100 transition"
                        title="Remove Trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-900 flex items-center justify-between">
              <span className="font-semibold">Total Assigned Headcount in this order:</span>
              <span className="font-extrabold text-sm">{totalHeadcount} Verified Union Workers</span>
            </div>
          </div>

          {/* 3. Schedule, Shift & Duration */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              3. Schedule, Shift Timings & Duration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recurring Schedule Pattern
                </label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none font-semibold bg-white"
                >
                  <option value="DAILY">Daily (7 Days / Week)</option>
                  <option value="WEEKDAYS">Monday to Saturday (6 Days / Week)</option>
                  <option value="ROTATIONAL_3_SHIFT">24x7 Rotational (3 Shifts)</option>
                  <option value="WEEKEND_ONLY">Weekend Facility Sanitization (Sat & Sun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contract Duration
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none font-semibold bg-white"
                >
                  <option value={1}>1 Month (Standard Monthly Trial)</option>
                  <option value={3}>3 Months (Quarterly SLA)</option>
                  <option value={6}>6 Months (Half-Yearly SLA)</option>
                  <option value={12}>12 Months (Annual Government SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shift Start Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={shiftStartTime}
                    onChange={(e) => setShiftStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none font-semibold"
                    placeholder="09:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shift End Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={shiftEndTime}
                    onChange={(e) => setShiftEndTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none font-semibold"
                    placeholder="05:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Commencement Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Conclusion Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Additional Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              4. Special Instructions & Safety Protocol
            </h2>
            <textarea
              rows={3}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              placeholder="e.g. PPE equipment, gate pass requirements, emergency muster station..."
            />
          </div>
        </div>

        {/* Right 1 Col: Live Cost Calculator & Submit SLA */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Procurement Estimate</h3>
                <p className="text-[11px] text-slate-500">Odisha State Gazette Floor Standard</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                0% Middleman
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">
                    {it.quantity}x {it.trade}
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹{((it.daily_floor_rate || 450) * it.quantity).toLocaleString('en-IN')}/day
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Totals */}
            <div className="pt-2 space-y-2 border-t border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Daily Composite Floor:</span>
                <span className="font-bold text-slate-900">₹{dailyTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Working Days / Month:</span>
                <span className="font-semibold text-slate-800">26 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Contract Duration:</span>
                <span className="font-semibold text-slate-800">{durationMonths} Month(s)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>Cooperative Welfare (10%):</span>
                <span>Included in floor</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>Platform Commission:</span>
                <span className="font-bold">₹0 (0.00%)</span>
              </div>
            </div>

            {/* Total Monthly Amount */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Total Estimated SLA Value
              </div>
              <div className="text-2xl font-extrabold text-white flex items-center gap-1">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                {monthlyTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400">
                Direct monthly disbursement via State Cooperative Bank Escrow
              </div>
            </div>

            {/* SLA Assurances */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% police & identity verified cooperative roster</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>45-minute backup replacement guarantee on sickness</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>GST-compliant reverse-charge tax invoices</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Routing to Khurda Union...</span>
                </>
              ) : (
                <>
                  <span>Submit Requisition Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
