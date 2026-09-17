import React, { useState } from 'react';
import { TradePolicy } from '@/services/workerService';
import { 
  Award, 
  Plus, 
  Check 
} from 'lucide-react';

interface Step4Props {
  tradePolicy?: TradePolicy;
  experienceYears: number;
  skills: string[];
  bio?: string;
  onChange: (fields: { experience_years?: number; skills?: string[]; bio?: string }) => void;
}

export const Step4SkillsExperience: React.FC<Step4Props> = ({
  tradePolicy,
  experienceYears,
  skills,
  bio,
  onChange,
}) => {
  const [customSkill, setCustomSkill] = useState('');

  const suggested = tradePolicy?.suggested_skills || [
    'Fault Diagnosis',
    'Wiring & Conduit',
    'Component Repair',
    'Safety Standards Compliance',
  ];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      onChange({ skills: skills.filter((s) => s !== skill) });
    } else {
      onChange({ skills: [...skills, skill] });
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      onChange({ skills: [...skills, customSkill.trim()] });
      setCustomSkill('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-gov-green" />
          <span>Step 4: Trade Experience & Competencies</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Highlight your years on the job and select specific trade skills you perform
        </p>
      </div>

      {/* Experience Years Selector */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">
            Total Trade Experience: <strong className="text-gov-green text-sm">{experienceYears} Years</strong>
          </label>
        </div>

        {/* Quick Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          {[1, 2, 3, 5, 8, 12].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => onChange({ experience_years: yr })}
              className={`p-2.5 rounded-xl font-bold border transition-all ${
                experienceYears === yr
                  ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
              }`}
            >
              {yr}+ {yr === 1 ? 'Year' : 'Years'}
            </button>
          ))}
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0.5"
          max="30"
          step="0.5"
          value={experienceYears}
          onChange={(e) => onChange({ experience_years: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-green mt-2"
        />
      </div>

      {/* Suggested Trade Skills */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Select Verified Trade Skills ({skills.length} selected) *</span>
          <span className="text-[11px] text-gov-muted">Tap to toggle</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {suggested.map((skill) => {
            const isSelected = skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 text-gov-green" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>

        {/* Add Custom Skill */}
        <div className="pt-2 flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add another specialized skill..."
            className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green flex-1"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="px-4 py-2 rounded-xl bg-gov-navy text-white text-xs font-bold hover:bg-blue-900 transition-colors shrink-0"
          >
            Add Skill
          </button>
        </div>
      </div>

      {/* Work Bio / Summary */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs text-xs">
        <label className="block font-bold text-slate-700">
          Professional Bio / Work Background (Visible to Citizens)
        </label>
        <textarea
          rows={3}
          value={bio || ''}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="e.g. Master electrician specializing in residential circuit diagnostics, 3-phase wiring, inverter setups, and cooperative government safety audits."
          className="w-full font-medium border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green leading-relaxed"
        />
      </div>

    </div>
  );
};
