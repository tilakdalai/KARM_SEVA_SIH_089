import React, { useMemo } from 'react';
import { MapPin, Navigation, Building2 } from 'lucide-react';
import {
  INDIAN_STATES_AND_UTS,
  getDistrictsForState,
  getStateByCodeOrName,
} from '@/constants/indianLocations';

export interface StateDistrictSelectProps {
  selectedState?: string;
  selectedDistrict?: string;
  selectedCity?: string;
  pincode?: string;
  onStateChange: (stateName: string, stateCode: string) => void;
  onDistrictChange: (districtName: string) => void;
  onCityChange?: (cityName: string) => void;
  onPincodeChange?: (pincode: string) => void;
  showCity?: boolean;
  showPincode?: boolean;
  disabled?: boolean;
  stateLabel?: string;
  districtLabel?: string;
  className?: string;
}

export const StateDistrictSelect: React.FC<StateDistrictSelectProps> = ({
  selectedState = '',
  selectedDistrict = '',
  selectedCity = '',
  pincode = '',
  onStateChange,
  onDistrictChange,
  onCityChange,
  onPincodeChange,
  showCity = false,
  showPincode = false,
  disabled = false,
  stateLabel = 'State / Union Territory',
  districtLabel = 'District',
  className = '',
}) => {
  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (!selectedState) return [];
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  // Handle State Selection
  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const stateObj = getStateByCodeOrName(val);
    if (stateObj) {
      onStateChange(stateObj.name, stateObj.code);
      // Reset district when state changes
      onDistrictChange('');
    } else {
      onStateChange('', '');
      onDistrictChange('');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* State / UT Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-gov-green" />
            <span>{stateLabel}</span>
          </label>
          <select
            value={selectedState}
            onChange={handleStateSelect}
            disabled={disabled}
            className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-gov-green focus:border-gov-green disabled:bg-slate-100 transition-colors"
          >
            <option value="">Select State / UT (Pan-India)</option>
            {INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st.code} value={st.name}>
                {st.name} ({st.type === 'UNION_TERRITORY' ? 'UT' : 'State'})
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{districtLabel}</span>
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={disabled || !selectedState}
            className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-gov-green focus:border-gov-green disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
          >
            <option value="">
              {!selectedState ? 'Choose State first' : 'Select District'}
            </option>
            {availableDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional City & PIN Code row */}
      {(showCity || showPincode) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {showCity && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>City / Town / Locality</span>
              </label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => onCityChange && onCityChange(e.target.value)}
                placeholder="e.g. Indiranagar, Shivaji Nagar, Saheed Nagar"
                disabled={disabled}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-gov-green focus:border-gov-green transition-colors"
              />
            </div>
          )}

          {showPincode && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                <span>PIN Code (6 digits)</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  onPincodeChange && onPincodeChange(cleaned);
                }}
                placeholder="e.g. 560038, 411005, 751007"
                disabled={disabled}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-gov-green focus:border-gov-green transition-colors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
