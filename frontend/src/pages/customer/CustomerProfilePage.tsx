import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Heart, 
  FileText, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || 'Ananya Patnaik');
  const [email, setEmail] = useState(user?.email || 'ananya.patnaik@karmseva.gov.in');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [district, setDistrict] = useState(user?.district || 'Bhubaneswar');
  const [preferredLang, setPreferredLang] = useState('English');
  const [emergencyContact, setEmergencyContact] = useState('+91 9437012345 (Father)');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-gov-green" />
          <span>Citizen Account & Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Manage your verified contact info, regional language, and public subsidy entitlements
        </p>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-gov-green" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      {/* Main Profile Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Edit Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card header={<span className="font-extrabold text-sm text-gov-navy">Personal Details</span>}>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Mobile Number (OTP Verified)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (for GST Invoices)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Home District
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred App Language
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Relative / SOS Contact
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                />
              </div>

              <Button type="submit" variant="primary" className="text-xs font-bold py-2 px-6">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Quick Links & Entitlements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Entitlement & Subsidy Badge Card */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Public Scheme Entitlements</span>}>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">Khurda District Resident</span>
                  <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Eligible for state-subsidized seasonal domestic electrical safety audits.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Digital KARM Citizen ID</span>
                <p className="font-mono text-xs font-bold text-gov-navy">CIT-OD-751012-9841</p>
              </div>
            </div>
          </Card>

          {/* Quick Nav Card */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy">Account Navigation</span>}>
            <div className="space-y-1 text-xs">
              <Link 
                to="/customer/addresses" 
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Manage Saved Addresses</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </Link>

              <Link 
                to="/customer/favourites" 
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Saved Seva Partner Favourites</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </Link>

              <Link 
                to="/customer/bookings" 
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 font-bold transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Tax Invoices & Receipts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </Link>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 p-2.5 rounded-lg hover:bg-red-50 text-red-600 font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of KARM SEVA</span>
                </button>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
