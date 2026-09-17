import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface Step6Props {
  preferences: {
    preferred_radius_km: number;
    max_radius_km: number;
    allow_outside_suggestions: boolean;
    preferred_shift: string;
    is_available_for_emergency: boolean;
  };
  onChange: (fields: Partial<Step6Props['preferences']>) => void;
}

const PRESET_RADII = [2, 5, 10, 15];

export const Step6WorkPreferences: React.FC<Step6Props> = ({
  preferences,
  onChange,
}) => {
  const [isCustomRadius, setIsCustomRadius] = useState(!PRESET_RADII.includes(preferences.preferred_radius_km));

  const handleSelectPreset = (radius: number) => {
    setIsCustomRadius(false);
    onChange({ 
      preferred_radius_km: radius,
      max_radius_km: Math.max(radius * 1.5, 10)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-gov-green" />
          <span>Step 6: Work Radius & Shift Availability</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Define your preferred service travel distance and working shifts
        </p>
      </div>

      {/* Preferred Radius Selection */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">
            Preferred Service Work Radius: <strong className="text-gov-green text-sm">{preferences.preferred_radius_km} km</strong>
          </label>
        </div>

        {/* Quick Radius Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {PRESET_RADII.map((r) => {
            const isSelected = !isCustomRadius && preferences.preferred_radius_km === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectPreset(r)}
                className={`p-3 rounded-xl font-bold border transition-all ${
                  isSelected
                    ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-gov-green/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                📍 {r} km Radius
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsCustomRadius(true)}
            className={`p-3 rounded-xl font-bold border transition-all ${
              isCustomRadius
                ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-gov-green/20'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
            }`}
          >
            ⚙️ Custom
          </button>
        </div>

        {/* Custom Slider */}
        {isCustomRadius && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Custom Distance:</span>
              <span className="text-gov-green">{preferences.preferred_radius_km} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={preferences.preferred_radius_km}
              onChange={(e) => onChange({ preferred_radius_km: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-green"
            />
          </div>
        )}
      </div>

      {/* Maximum Acceptable Radius */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs text-xs">
        <div className="flex justify-between items-center">
          <label className="font-bold text-slate-700">
            Maximum Acceptable Extended Travel Radius: <strong className="text-blue-700 text-sm">{preferences.max_radius_km} km</strong>
          </label>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={preferences.max_radius_km}
          onChange={(e) => onChange({ max_radius_km: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <p className="text-[11px] text-gov-muted">
          For emergency dispatches or high-value contracts outside your usual zone.
        </p>
      </div>

      {/* Allow Outside Area Suggestions Checkbox */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.allow_outside_suggestions}
            onChange={(e) => onChange({ allow_outside_suggestions: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-gov-green focus:ring-gov-green"
          />
          <div className="space-y-0.5">
            <span className="font-bold text-gov-navy block">
              Allow KARM SEVA to suggest jobs outside my preferred area
            </span>
            <p className="text-[11px] text-gov-muted leading-relaxed">
              When enabled, our cooperative AI will notify you of high-paying institutional or urgent neighborhood shifts nearby.
            </p>
          </div>
        </label>
      </div>

      {/* Shift Preference */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs text-xs">
        <label className="block font-bold text-slate-700">
          Preferred Working Shift
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'MORNING', label: '🌅 Morning (8 AM - 1 PM)' },
            { id: 'AFTERNOON', label: '☀️ Afternoon (1 PM - 6 PM)' },
            { id: 'FULL_DAY', label: '⏱️ Full Day (8 AM - 6 PM)' },
            { id: 'EMERGENCY_STANDBY', label: '🚨 24x7 SOS Standby' },
          ].map((shift) => (
            <button
              key={shift.id}
              type="button"
              onClick={() => onChange({ preferred_shift: shift.id })}
              className={`p-2.5 rounded-xl font-bold border text-left transition-all ${
                preferences.preferred_shift === shift.id
                  ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
              }`}
            >
              {shift.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
