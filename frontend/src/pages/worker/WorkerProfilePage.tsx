import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const WorkerProfilePage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [alternatePhone, setAlternatePhone] = useState(MOCK_WORKER_PROFILE.alternatePhone || '');
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
          <User className="w-6 h-6 text-gov-green" />
          <span>Worker Profile & Verification KYC</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Manage your official registered details, cooperative union accreditation & emergency contacts
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-gov-green" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={MOCK_WORKER_PROFILE.profilePhoto}
            alt={MOCK_WORKER_PROFILE.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-gov-green shadow-xs"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-gov-navy">{MOCK_WORKER_PROFILE.name}</h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-gov-green" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-xs text-gov-muted">{MOCK_WORKER_PROFILE.trade} · {MOCK_WORKER_PROFILE.experienceYears} Years Experience</p>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-1">
              {MOCK_WORKER_PROFILE.shramId}
            </span>
          </div>
        </div>

        <Link
          to="/worker/onboard"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Update via Wizard</span>
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Cooperative Union Card */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> Registered Labour Cooperative Affiliation</span>}>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-gov-navy text-sm">{MOCK_WORKER_PROFILE.cooperativeName}</span>
              <p className="text-slate-600">Union Registration Code: <strong className="font-mono">{MOCK_WORKER_PROFILE.cooperativeCode}</strong></p>
              <p className="text-[11px] text-gov-muted">Jurisdiction: {MOCK_WORKER_PROFILE.district} District, Odisha</p>
            </div>
          </div>
        </Card>

        {/* Masked KYC & Police Clearance */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gov-green" /> Masked Identity & Security Clearance</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gov-green" />
                <span>Masked Aadhaar KYC</span>
              </span>
              <p className="font-mono text-base font-black text-gov-navy">XXXX-XXXX-8841</p>
              <span className="text-[10px] text-emerald-700 font-bold block">✓ UIDAI Encrypted Token</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500">Police Background Verification</span>
              <p className="text-base font-black text-emerald-800">Clear Record</p>
              <span className="text-[10px] text-slate-500 block">Verified by Bhubaneswar Urban Police</span>
            </div>
          </div>
        </Card>

        {/* Contact & Emergency Nominee */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Phone className="w-4 h-4 text-purple-600" /> Contact & Emergency Family Contacts</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Phone Number</label>
              <input
                type="text"
                value={MOCK_WORKER_PROFILE.phone}
                disabled
                className="w-full font-mono font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-100 text-slate-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Nominee / Family Contact</label>
              <input
                type="text"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                placeholder="+91 94370-XXXXX (Spouse / Parent)"
                className="w-full font-mono font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              />
            </div>
          </div>
        </Card>

        {/* App Language Preference */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" /> App Language Preference</span>}>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {['English', 'हिंदी (Hindi)', 'ଓଡ଼ିଆ (Odia)'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`p-3 rounded-xl font-bold border text-center transition-all ${
                  selectedLanguage === lang
                    ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </Card>

        <Button type="submit" variant="primary" className="py-2.5 px-8 text-xs font-bold shadow-md">
          Save Profile Updates
        </Button>
      </form>

    </div>
  );
};
