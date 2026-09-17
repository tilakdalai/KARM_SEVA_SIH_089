import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { 
  Building2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export const RegisterInstitutionPage: React.FC = () => {
  const [orgName, setOrgName] = useState('');
  const [institutionType, setInstitutionType] = useState('Educational Institution (School/College)');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Bhubaneswar');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const orgTypes = [
    'Educational Institution (School/College)',
    'Hospital & Healthcare Facility',
    'Commercial Office / Complex',
    'Government Department / PSU',
    'Residential Society / RWA',
    'Industrial & Facility Management',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        name: contactPerson,
        phone,
        email: email || undefined,
        password,
        role: 'INSTITUTION',
        organization_name: orgName,
        institution_type: institutionType,
        district,
      });
      navigate('/institution', { replace: true });
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Institutional B2B / B2G Workspace
        </div>
        <h1 className="text-2xl font-black text-gov-navy tracking-tight">
          Register Organization
        </h1>
        <p className="text-xs text-gov-muted">
          Bulk cooperative workforce teams, campus shifts, recurring maintenance & GST invoicing
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
        {/* Organization Name */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Organization / Campus Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. DAV Public School (Campus Unit 8)"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Institution Type */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Sector / Category *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              {orgTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Person Name */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Authorized Officer / Contact Person *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Admin In-Charge"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Official Mobile Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Official Email Address (for Invoices & Contracts) *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@school.edu.in"
              className="w-full text-xs font-medium border border-gov-border rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-gov-text mb-1">
            Campus District *
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

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 text-xs font-bold shadow-sm"
          isLoading={isLoading}
          leftIcon={<Building2 className="w-4 h-4" />}
        >
          Create Institutional Account
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
