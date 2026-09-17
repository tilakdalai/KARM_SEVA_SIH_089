import React from 'react';
import {
  Award,
  Users,
  Plus,
} from 'lucide-react';

export const CooperativeTrainingPage: React.FC = () => {
  const trainingPrograms = [
    {
      id: 'TRN-101',
      title: 'Solar Inverter, Rooftop PV & Hybrid Wiring Certification',
      institution: 'Skill India / PMKVY 4.0 Bhubaneswar Hub',
      targetTrade: 'Master Electrician',
      enrolledCount: 38,
      capacity: 50,
      duration: '4 Weeks (Weekends)',
      certificationBadge: 'Certified Solar PV Technician',
      status: 'ADMISSIONS_OPEN',
    },
    {
      id: 'TRN-102',
      title: 'Advanced Geriatric & Post-Chemo Home Caregiving',
      institution: 'AIIMS Bhubaneswar & St. John Ambulance',
      targetTrade: 'Patient Caregiver',
      enrolledCount: 24,
      capacity: 30,
      duration: '3 Weeks (Hands-on Clinical)',
      certificationBadge: 'Certified Clinical Home Nurse',
      status: 'IN_PROGRESS',
    },
    {
      id: 'TRN-103',
      title: 'Automated Pressure Hydro-Pneumatic Plumbing',
      institution: 'Odisha Skill Development Authority (OSDA)',
      targetTrade: 'Master Plumber',
      enrolledCount: 42,
      capacity: 45,
      duration: '2 Weeks (Evening Batches)',
      certificationBadge: 'Hydro-Pneumatic Master',
      status: 'ADMISSIONS_OPEN',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Skill India & Cooperative Training Desk
            </h1>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              PMKVY & OSDA Partnered
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Up-skilling programs, state government trade certifications, and digital badge accreditations.
          </p>
        </div>

        <button
          onClick={() => alert('Cooperative Officer: New Training Batch Setup Wizard opening...')}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Propose New Batch
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingPrograms.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">{p.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'ADMISSIONS_OPEN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{p.title}</h3>
              <div className="text-xs text-slate-500 font-medium">Conducted by: <strong className="text-slate-700">{p.institution}</strong></div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-blue-900">Awarded Accreditation</div>
                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  {p.certificationBadge}
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div>Target Trade: <strong>{p.targetTrade}</strong></div>
                <div>Duration: <strong>{p.duration}</strong></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{p.enrolledCount} / {p.capacity} Enrolled</span>
              </div>

              <button
                onClick={() => alert(`Viewing enrolled member roster for batch ${p.id}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Manage Batch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
