import React from 'react';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Award, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Sparkles 
} from 'lucide-react';

export const WorkerSkillsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-gov-green" />
          <span>Digital Skill Passport & Accreditations</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Government of India verified skill credentials, NCVT trade certifications & upskilling modules
        </p>
      </div>

      {/* Digital Skill Passport Card */}
      <div className="rounded-3xl bg-gradient-to-r from-gov-navy via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
        
        {/* Top Passport Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
              Ministry of Skill Development & Labour
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              National Digital Skill Passport
            </h2>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-gov-green" />
            <span>{MOCK_WORKER_PROFILE.shramId}</span>
          </div>
        </div>

        {/* Passport Content Body */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          <div className="sm:col-span-8 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Registered Craftsman</span>
                <span className="font-black text-sm">{MOCK_WORKER_PROFILE.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Primary Trade</span>
                <span className="font-black text-sm text-emerald-300">{MOCK_WORKER_PROFILE.trade}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Affiliated Cooperative</span>
                <span className="font-bold text-slate-200">{MOCK_WORKER_PROFILE.cooperativeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Classification</span>
                <span className="font-bold text-purple-300">{MOCK_WORKER_PROFILE.tradeGroup} (Technical Safety)</span>
              </div>
            </div>
          </div>

          {/* QR Verification Preview */}
          <div className="sm:col-span-4 bg-white/10 border border-white/20 p-4 rounded-2xl text-center space-y-2">
            <div className="w-20 h-20 bg-white rounded-xl mx-auto flex items-center justify-center text-gov-navy shadow-xs">
              <QrCode className="w-16 h-16 text-slate-900" />
            </div>
            <span className="text-[10px] text-slate-300 font-bold block">
              Scan to verify credentials
            </span>
          </div>

        </div>

      </div>

      {/* Verified Trade Certifications */}
      <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gov-green" /> Verified Trade Diplomas & Licences</span>}>
        <div className="space-y-3 text-xs">
          {MOCK_WORKER_PROFILE.certifications.map((cert, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm text-gov-navy">{cert.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-gov-green" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-gov-muted text-xs">Issued by {cert.issuer} · Year: {cert.year}</p>
              </div>

              <button
                type="button"
                onClick={() => alert(`Opening certificate document for ${cert.name}`)}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Core Verified Competencies */}
      <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Assessed Competency Matrix</span>}>
        <div className="flex flex-wrap gap-2 text-xs">
          {MOCK_WORKER_PROFILE.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* Upskilling & Training Opportunities (Secondary) */}
      <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-600" /> Skill India Training Modules (Secondary)</span>}>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <span className="font-black text-purple-950 text-sm">Solar Rooftop Inverter & Battery Storage Certification</span>
              <p className="text-[11px] text-purple-800">4-day subsidised practical workshop at ITI Bhubaneswar</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert('Enrolled in training interest list.')}
              className="text-xs font-bold shrink-0"
            >
              Express Interest
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
};
