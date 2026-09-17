import React from 'react';
import { WorkerOnboardingPayload } from '@/services/workerService';
import { 
  CheckCircle2, 
  Building2, 
  Wrench, 
  Award, 
  ShieldCheck, 
  Compass, 
  Edit3 
} from 'lucide-react';

interface Step8Props {
  data: WorkerOnboardingPayload;
  declarationConfirmed: boolean;
  onDeclarationChange: (confirmed: boolean) => void;
  onJumpToStep: (step: number) => void;
}

export const Step8ReviewSubmit: React.FC<Step8Props> = ({
  data,
  declarationConfirmed,
  onDeclarationChange,
  onJumpToStep,
}) => {
  const maskPreview = (_docType: string, num: string) => {
    if (!num) return 'XXXX-XXXX-XXXX';
    const clean = num.replace(/\s+/g, '');
    if (clean.length <= 4) return `XXXX-XXXX-${clean}`;
    return `XXXX-XXXX-${clean.slice(-4)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-gov-green" />
          <span>Step 8: Final Review & Digital Declaration</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Review your onboarding details before digital KARM ID generation and cooperative approval
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4 text-xs">
        
        {/* 1. Personal & Cooperative */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-3.5">
            <img
              src={data.profile_photo_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
              alt={data.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-gov-green"
            />
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm text-gov-navy">{data.name}</h3>
              <p className="text-gov-muted">
                {data.gender || 'Male'} · {data.age || 32} yrs · {data.district}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {data.address_line || 'Bhubaneswar, Odisha'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="text-gov-green font-bold flex items-center gap-1 hover:underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* 2. Cooperative & Trade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>Assigned Cooperative</span>
              </span>
              <h4 className="font-bold text-gov-navy">{data.cooperative_name}</h4>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {data.cooperative_id}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-gov-green font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-slate-400" />
                <span>Occupation & Policy</span>
              </span>
              <h4 className="font-bold text-gov-navy">{data.trade}</h4>
              <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {data.trade_group}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-gov-green font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 3. Skills & Verification */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-bold text-gov-navy flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gov-green" />
              <span>Skills ({data.skills.length}) & Experience ({data.experience_years} yrs)</span>
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(4)}
              className="text-gov-green font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">
                ⚡ {s}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Verification & Shielded Docs */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-bold text-gov-navy flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Identity Document & Certifications</span>
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(5)}
              className="text-gov-green font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs pt-1">
            <div className="space-y-0.5">
              <span className="text-slate-500">{data.identity_document.document_type}:</span>
              <p className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block ml-2">
                {maskPreview(data.identity_document.document_type, data.identity_document.document_number)}
              </p>
            </div>
            <div className="text-slate-600">
              Certifications Attached: <strong>{data.certifications.length}</strong>
            </div>
          </div>
        </div>

        {/* 5. Work Radius & Shift */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="font-bold text-gov-navy flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-gov-green" />
              <span>Work Radius: {data.preferences.preferred_radius_km} km (Max {data.preferences.max_radius_km} km)</span>
            </span>
            <p className="text-[11px] text-gov-muted">
              Shift: <strong>{data.preferences.preferred_shift}</strong> · Outside Suggestions: <strong>{data.preferences.allow_outside_suggestions ? 'Enabled' : 'Disabled'}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(6)}
            className="text-gov-green font-bold flex items-center gap-1 hover:underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

      </div>

      {/* Digital Legal Declaration */}
      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs space-y-2">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declarationConfirmed}
            onChange={(e) => onDeclarationChange(e.target.checked)}
            className="mt-0.5 rounded border-emerald-400 text-gov-green focus:ring-gov-green"
          />
          <div className="space-y-1">
            <span className="font-black text-emerald-950 block">
              Digital Declaration & Terms of Public Service Vow *
            </span>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              I hereby declare that all information, trade experience, and credentials submitted are authentic. I agree to uphold cooperative safety benchmarks, quality standards, and ethical citizen service on the KARM SEVA Digital Public Platform.
            </p>
          </div>
        </label>
      </div>

    </div>
  );
};
