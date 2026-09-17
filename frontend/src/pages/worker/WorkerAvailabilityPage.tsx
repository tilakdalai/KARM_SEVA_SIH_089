import React, { useState } from 'react';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Compass, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export const WorkerAvailabilityPage: React.FC = () => {
  const [preferredRadius, setPreferredRadius] = useState(MOCK_WORKER_PROFILE.preferredRadiusKm);
  const [maxRadius, setMaxRadius] = useState(MOCK_WORKER_PROFILE.maxRadiusKm);
  const [allowOutside, setAllowOutside] = useState(true);
  const [preferredShift, setPreferredShift] = useState('FULL_DAY');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-gov-green" />
          <span>Work Radius & Availability Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Configure how far you are willing to travel for service shifts and your operational hours
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-gov-green" />
          <span>Availability preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Preferred Radius */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><MapPin className="w-4 h-4 text-gov-green" /> Preferred Service Travel Radius</span>}>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">Daily Travel Radius:</span>
              <span className="text-lg font-black text-gov-green">{preferredRadius} km</span>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={preferredRadius}
              onChange={(e) => setPreferredRadius(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-green"
            />

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Covered Localities within {preferredRadius} km:</span>
              <p className="text-slate-600">
                Nayapalli, IRC Village, Saheed Nagar, Jayadev Vihar, Acharya Vihar, Rasulgarh.
              </p>
            </div>
          </div>
        </Card>

        {/* Max Radius & Outside Area */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-blue-600" /> Extended Emergency & Commercial Radius</span>}>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">Maximum Acceptable Distance:</span>
              <span className="text-lg font-black text-blue-800">{maxRadius} km</span>
            </div>

            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={maxRadius}
              onChange={(e) => setMaxRadius(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                checked={allowOutside}
                onChange={(e) => setAllowOutside(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-gov-green focus:ring-gov-green"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-gov-navy block">
                  Allow KARM SEVA to suggest jobs outside my preferred area
                </span>
                <p className="text-[11px] text-gov-muted">
                  Receive notifications for high-wage commercial or urgent government facility shifts.
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Preferred Shift Selection */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Clock className="w-4 h-4 text-purple-600" /> Working Shift Timings</span>}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { id: 'MORNING', label: '🌅 Morning (8 AM - 1 PM)' },
              { id: 'AFTERNOON', label: '☀️ Afternoon (1 PM - 6 PM)' },
              { id: 'FULL_DAY', label: '⏱️ Full Day (8 AM - 6 PM)' },
              { id: 'EMERGENCY_STANDBY', label: '🚨 24x7 SOS Standby' },
            ].map((shift) => (
              <button
                key={shift.id}
                type="button"
                onClick={() => setPreferredShift(shift.id)}
                className={`p-3 rounded-xl font-bold border text-left transition-all ${
                  preferredShift === shift.id
                    ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                {shift.label}
              </button>
            ))}
          </div>
        </Card>

        <Button type="submit" variant="primary" className="py-2.5 px-8 text-xs font-bold shadow-md">
          Save Availability Settings
        </Button>
      </form>

    </div>
  );
};
