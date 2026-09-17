import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin 
} from 'lucide-react';

export const RegisterCustomerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Bhubaneswar');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('751012');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the terms and privacy policy.');
      return;
    }

    clearError();
    try {
      await register({
        name,
        phone,
        email: email || undefined,
        password,
        role: 'CUSTOMER',
        district,
        address,
        pincode,
      });
      navigate('/customer', { replace: true });
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          Citizen / Customer Registration
        </div>
        <h1 className="text-2xl font-black text-gov-navy tracking-tight">
          Create Citizen Account
        </h1>
        <p className="text-xs text-gov-muted">
          Access verified cooperative Seva Partners with transparent fair rates
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smita Mohapatra"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Mobile Number (for OTP & Job Updates) *
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

        {/* Email Address (Optional) */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Email Address (Optional for GST Invoices)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. smita@gmail.com"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            />
          </div>
        </div>

        {/* District and PIN Code */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-gov-text mb-1">
              District / City *
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Bhubaneswar"
              className="w-full text-xs font-medium border border-gov-border rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gov-text mb-1">
              PIN Code *
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 751012"
              className="w-full text-xs font-medium border border-gov-border rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            House / Flat & Locality
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 104, IRC Village, Nayapalli"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Set Account Password *
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
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start space-x-2 pt-1">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-gov-green focus:ring-gov-green"
            required
          />
          <label htmlFor="agreeTerms" className="text-[11px] text-gov-muted leading-tight">
            I agree to the KARM SEVA public service terms and fair wage policies.
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 text-xs font-bold shadow-sm"
          isLoading={isLoading}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Complete Citizen Registration
        </Button>
      </form>

      {/* Back and Sign In */}
      <div className="text-center text-xs text-gov-muted border-t border-slate-100 pt-3">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-gov-navy hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
