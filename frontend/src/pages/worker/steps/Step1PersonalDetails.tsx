import React from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar 
} from 'lucide-react';

interface Step1Props {
  data: {
    name: string;
    alternate_phone?: string;
    gender?: string;
    age?: number;
    preferred_language: string;
    district: string;
    address_line?: string;
    profile_photo_url?: string;
  };
  onChange: (fields: Partial<Step1Props['data']>) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
];

export const Step1PersonalDetails: React.FC<Step1Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-gov-green" />
          <span>Step 1: Basic Personal & Contact Details</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Enter your official name, contact number, and local home address for cooperative allocation
        </p>
      </div>

      {/* Profile Photo Selector */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          Seva Partner Profile Photo (Visible on your Digital KARM ID Passport)
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gov-green shadow-xs shrink-0">
            <img
              src={data.profile_photo_url || SAMPLE_AVATARS[0]}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              Choose an official avatar or paste your photo URL:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ profile_photo_url: url })}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                    data.profile_photo_url === url
                      ? 'border-gov-green scale-105 shadow-xs'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Name & Phone Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Full Name (As per Aadhaar / Official ID) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Ramesh Chandra Behera"
              className="w-full font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Alternate / Family Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={data.alternate_phone || ''}
              onChange={(e) => onChange({ alternate_phone: e.target.value })}
              placeholder="e.g. 9437012345 (Optional)"
              className="w-full font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            />
          </div>
        </div>

      </div>

      {/* Gender, Age & Preferred Language */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Gender *
          </label>
          <select
            value={data.gender || 'Male'}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Age (Years) *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="number"
              min="18"
              max="75"
              value={data.age || 32}
              onChange={(e) => onChange({ age: parseInt(e.target.value) || 30 })}
              className="w-full font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Preferred Language *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select
              value={data.preferred_language}
              onChange={(e) => onChange({ preferred_language: e.target.value })}
              className="w-full font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>
        </div>

      </div>

      {/* District & Full Locality Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Home District *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select
              value={data.district}
              onChange={(e) => onChange({ district: e.target.value })}
              className="w-full font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              <option value="Bhubaneswar">Bhubaneswar (Khurda)</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Puri">Puri</option>
              <option value="Sundargarh">Sundargarh (Rourkela)</option>
              <option value="Ganjam">Ganjam (Berhampur)</option>
              <option value="Sambalpur">Sambalpur</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-slate-700 mb-1">
            Locality Address / Ward / Landmark *
          </label>
          <input
            type="text"
            value={data.address_line || ''}
            onChange={(e) => onChange({ address_line: e.target.value })}
            placeholder="e.g. Plot 104, Near Durga Mandap, Rasulgarh, 751010"
            className="w-full font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            required
          />
        </div>

      </div>

    </div>
  );
};
