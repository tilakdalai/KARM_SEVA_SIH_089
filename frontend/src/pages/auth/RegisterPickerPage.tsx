import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { 
  Users, 
  Wrench, 
  Building2, 
  ArrowRight, 
  Info 
} from 'lucide-react';

export const RegisterPickerPage: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Citizen / Customer',
      hindi: 'नागरिक / उपभोक्ता',
      desc: 'Book verified Seva Partners for your home, schedule recurring visits, and pay securely.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      path: '/register/customer',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      title: 'Seva Partner / Worker',
      hindi: 'सेवा साथी',
      desc: 'Join with your trade skills, set your preferred work radius, get daily jobs, and earn fair wages.',
      icon: <Wrench className="w-6 h-6 text-emerald-600" />,
      path: '/register/worker',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Institution (B2B / B2G)',
      hindi: 'संस्थान / संगठन',
      desc: 'Schools, hospitals, and commercial organizations requesting bulk workforce teams and maintenance.',
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      path: '/register/institution',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-gov-navy tracking-tight">
          What are you joining KARM SEVA as?
        </h1>
        <p className="text-xs text-gov-muted">
          Select your registration category to proceed with tailored verification
        </p>
      </div>

      {/* 3 Registration Category Cards */}
      <div className="space-y-3">
        {options.map((opt) => (
          <Card
            key={opt.path}
            onClick={() => navigate(opt.path)}
            className="p-4 border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer group bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 group-hover:scale-105 group-hover:bg-emerald-50 transition-all shrink-0">
                  {opt.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-sm text-gov-navy group-hover:text-gov-green transition-colors">
                      {opt.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${opt.badgeColor}`}>
                      {opt.hindi}
                    </span>
                  </div>
                  <p className="text-xs text-gov-muted leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gov-green group-hover:translate-x-1 transition-all shrink-0 mt-2" />
            </div>
          </Card>
        ))}
      </div>

      {/* Controlled Cooperative & Admin Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-gov-navy text-[11px]">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Are you a Labour Cooperative Official or State Administrator?</span>
        </div>
        <p className="text-[11px] text-gov-muted leading-relaxed">
          Cooperative Society registration and Government administrative privileges require state accreditation. Please contact your District Cooperative Department or use your official credentials to sign in.
        </p>
      </div>

      {/* Already Registered */}
      <div className="text-center text-xs text-gov-muted pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-gov-navy hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
