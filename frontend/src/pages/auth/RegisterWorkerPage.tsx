import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { 
  Wrench, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Phone, 
  Lock, 
  MapPin, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

export const RegisterWorkerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('Electrician');
  const [workRadiusKm, setWorkRadiusKm] = useState(4.0);
  const [cooperativeName, setCooperativeName] = useState('Bhubaneswar Multi-Purpose Labour Cooperative');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('Bhubaneswar');

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const trades = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Driver',
    'Patient Caregiver',
    'Elderly Caregiver',
    'Child Caregiver',
    'Deep Cleaner',
    'Domestic Helper',
    'Gardener',
    'Appliance Technician',
  ];

  const cooperatives = [
    'Bhubaneswar Multi-Purpose Labour Cooperative',
    'Cuttack City Labour Cooperative Society',
    'Puri Coastal Labour Service Cooperative',
    'Odisha State Federation of Labour Cooperatives',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        name,
        phone,
        password,
        role: 'WORKER',
        trade,
        work_radius_km: Number(workRadiusKm),
        cooperative_name: cooperativeName,
        district,
      });
      navigate('/worker', { replace: true });
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Seva Partner Onboarding
        </div>
        <h1 className="text-2xl font-black text-gov-navy tracking-tight">
          Register as Seva Partner
        </h1>
        <p className="text-xs text-gov-muted">
          Obtain your Digital KARM ID, define your work radius, and receive direct daily fair earnings
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Full Name (as on Aadhaar / Voter ID) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gopal Nayak"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Mobile Number (for instant Job alerts) *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Trade Selection */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Primary Trade / Skill *
          </label>
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="w-full text-xs font-medium border border-gov-border rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
          >
            {trades.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Preferred Work Radius */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gov-text">
              Preferred Work Radius: <strong className="text-gov-greenDark">{workRadiusKm} km</strong>
            </label>
            <span className="text-[10px] text-gov-muted">No jobs forced beyond your radius</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={workRadiusKm}
            onChange={(e) => setWorkRadiusKm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-green"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>1 km (Local)</span>
            <span>5 km</span>
            <span>15 km (Wide Area)</span>
          </div>
        </div>

        {/* Cooperative Affiliation */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Designated Seva Cooperative *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={cooperativeName}
              onChange={(e) => setCooperativeName(e.target.value)}
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              {cooperatives.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Base District *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Set Portal Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-10 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Trust Note */}
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-gov-green shrink-0 mt-0.5" />
          <span>
            Upon registration, a Digital KARM ID is issued immediately. You can upload Aadhaar/ITI licenses to your cooperative for the verified trust badge.
          </span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 text-xs font-bold shadow-sm"
          isLoading={isLoading}
          leftIcon={<Wrench className="w-4 h-4" />}
        >
          Register as Seva Partner
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-gov-muted border-t border-slate-100 pt-3">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-gov-navy hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
