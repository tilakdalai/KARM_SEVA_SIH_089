import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerProfileData } from '@/services/workerService';
import { Button } from '@/components/common/Button';
import { 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  Download, 
  Building2, 
  MapPin 
} from 'lucide-react';

interface SuccessProps {
  profile: WorkerProfileData;
}

export const OnboardingSuccessCard: React.FC<SuccessProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-300 max-w-2xl mx-auto text-center pb-12">
      
      {/* Celebration Header */}
      <div className="space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-gov-green flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
          Congratulations, {profile.name}!
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted max-w-md mx-auto">
          Your onboarding has been submitted and verified. Your unique **Digital KARM ID Passport** has been provisioned.
        </p>
      </div>

      {/* Official Digital KARM ID Card */}
      <div className="rounded-3xl bg-white border-2 border-gov-green shadow-xl overflow-hidden text-left relative">
        
        {/* Top Gov Tricolor Bar */}
        <div className="h-2.5 flex w-full">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        {/* Card Header */}
        <div className="p-5 bg-gradient-to-r from-gov-navy to-blue-950 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">
              K
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">
                Government of India · Ministry of Labour
              </span>
              <h3 className="font-black text-base tracking-tight">
                KARM SEVA TRUST PASSPORT
              </h3>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase text-emerald-950 bg-emerald-300 px-2.5 py-0.5 rounded-full">
            Active Verified
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            
            {/* Avatar & KARM ID */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
                <img
                  src={profile.profile_photo_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gov-green text-white p-1 rounded-full border-2 border-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Credentials details */}
            <div className="space-y-1 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-gov-navy">
                  {profile.name}
                </h2>
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {profile.trade_group}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-700">
                {profile.trade} · <strong>{profile.experience_years} Years Experience</strong>
              </p>

              <div className="pt-1.5 flex flex-wrap gap-2 justify-center sm:justify-start text-[11px]">
                <span className="text-slate-600 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gov-green" />
                  <span>{profile.cooperative_name}</span>
                </span>
                <span>·</span>
                <span className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Radius: {profile.preferred_radius_km} km</span>
                </span>
              </div>
            </div>

            {/* QR Code preview block */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shrink-0 mx-auto sm:mx-0">
              <QrCode className="w-16 h-16 text-gov-navy" />
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                SCAN TO VERIFY
              </span>
            </div>

          </div>

          {/* Golden KARM ID Ribbon */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                Digital KARM Identification Number
              </span>
              <span className="font-mono font-black text-base text-amber-950 tracking-widest">
                {profile.shram_id}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-gov-green" />
              <span>Cooperative Backed</span>
            </div>
          </div>

          {/* Verified Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Skill Competencies:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          size="lg"
          variant="primary"
          onClick={() => navigate('/worker')}
          className="text-xs sm:text-sm font-black shadow-lg py-3 px-8"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Enter Seva Partner Dashboard
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => alert(`Official Digital ID Card PDF downloaded for ${profile.shram_id}`)}
          className="text-xs font-bold py-3"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download PDF Passport
        </Button>
      </div>

    </div>
  );
};
