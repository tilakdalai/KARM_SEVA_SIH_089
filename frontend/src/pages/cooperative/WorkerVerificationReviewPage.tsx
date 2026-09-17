import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  Send,
  Building2,
  FileCheck,
} from 'lucide-react';
import { cooperativeService } from '../../services/cooperativeService';

export const WorkerVerificationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION' | 'SUSPEND'>('APPROVE');
  const [reason, setReason] = useState('All trade credentials, identity documents, and skill qualifications verified against registry.');
  const [notes, setNotes] = useState('Approved by Sub-Divisional Cooperative Officer upon physical & digital check.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Demo candidate dossier
  const workerDossier = {
    id: id || 'wq-101',
    shram_id: 'KS-OD-2024-9102',
    name: 'Bhabani Shankar Rout',
    phone: '+91 94370 88219',
    gender: 'Male',
    age: 36,
    address: 'Plot 42, Saheed Nagar, Bhubaneswar, Odisha - 751007',
    trade: 'Commercial Driver & Ambulance Pilot',
    trade_group: 'GROUP_A',
    experience_years: 7.0,
    cooperative_unit: 'Khurda District Urban Workers Cooperative Union',
    bio: 'Professional heavy vehicle and emergency transport driver with 7 years of accident-free service.',
    submitted_at: '2024-09-01T10:30:00Z',
    identity_docs: [
      {
        type: 'Aadhaar Card',
        number_masked: 'XXXX-XXXX-9912',
        status: 'VERIFIED_UIDAI',
        issued_by: 'UIDAI',
      },
      {
        type: 'Heavy Transport Driving Licence',
        number_masked: 'OD-02-XXXX-8821',
        status: 'SARATHI_PORTAL_CONFIRMED',
        issued_by: 'RTO Bhubaneswar II',
      },
    ],
    certifications: [
      {
        title: 'Emergency Medical Vehicle & Defibrillator Response Training',
        issuer: 'St. John Ambulance & Red Cross Odisha',
        year: 2022,
        valid_until: '2027',
      },
      {
        title: 'Defensive Driving & Road Safety Certificate',
        issuer: 'Institute of Driving and Traffic Research (IDTR)',
        year: 2021,
        valid_until: 'Lifetime',
      },
    ],
    skills: ['Emergency Blue-Light Driving', 'Basic Life Support (BLS)', 'Oxygen Cylinder Handling', 'Vehicle Telematics'],
    work_preferences: {
      preferred_radius: '10 km',
      emergency_shift: 'Enabled (24x7 Available)',
      shift_preference: 'Night & Day Rotational',
    },
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please specify the official reasoning for this administrative decision.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMsg(null);
      await cooperativeService.executeVerificationAction(workerDossier.id, {
        action: actionType,
        reason,
        notes,
      });

      setFeedbackMsg({
        type: 'success',
        text: `Action '${actionType}' executed successfully! Immutable audit log entry has been registered.`,
      });

      setTimeout(() => {
        navigate('/cooperative/verification');
      }, 1500);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to record action. Please check permissions.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/cooperative/verification"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verification Queue
        </Link>
        <span className="text-xs font-mono bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold">
          DOSSIER REF: {workerDossier.shram_id}
        </span>
      </div>

      {/* Candidate Profile Dossier Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xl shadow-md">
            {workerDossier.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{workerDossier.name}</h1>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                {workerDossier.trade_group}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-semibold mb-1">
              {workerDossier.trade} • {workerDossier.experience_years} Years Experience
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-3">
              <span>{workerDossier.gender}, Age {workerDossier.age}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {workerDossier.cooperative_unit}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Submission Timestamp</div>
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {new Date(workerDossier.submitted_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Dossier Tabs / Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Identity & Certifications */}
        <div className="space-y-6">
          {/* Identity Verification Documents */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Identity & Legal KYC</h3>
            </div>
            <div className="space-y-3">
              {workerDossier.identity_docs.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{doc.type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      {doc.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-600">Masked ID: {doc.number_masked}</div>
                  <div className="text-[11px] text-slate-400">Issuing Authority: {doc.issued_by}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Certifications (Group A Mandatory) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Trade Certifications (Mandatory for Group A)</h3>
            </div>
            <div className="space-y-3">
              {workerDossier.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">{cert.title}</div>
                  <div className="text-[11px] text-slate-600">Issued by: {cert.issuer}</div>
                  <div className="text-[10px] text-amber-800 font-semibold">
                    Year: {cert.year} • Validity: {cert.valid_until}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Preferences, and Decision Desk */}
        <div className="space-y-6">
          {/* Skills & Preferences */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">Skills & Operational Preferences</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Claimed Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {workerDossier.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Work Radius:</span> {workerDossier.work_preferences.preferred_radius}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Emergency 24x7:</span> {workerDossier.work_preferences.emergency_shift}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Preferred Shift:</span> {workerDossier.work_preferences.shift_preference}
                </div>
              </div>
            </div>
          </div>

          {/* Officer Decision Form */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Administrative Decision Desk</h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                AUDITED ACTION
              </span>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  feedbackMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950 border border-rose-500/50 text-rose-200'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleExecuteAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Officer Action *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionType('APPROVE');
                      setReason('All trade credentials, identity documents, and skill qualifications verified against registry.');
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      actionType === 'APPROVE'
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Verify
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionType('REQUEST_CORRECTION');
                      setReason('Driving license copy is blurry. Please upload high-resolution scan of DL front & back.');
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      actionType === 'REQUEST_CORRECTION'
                        ? 'bg-amber-600 border-amber-500 text-white shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Request Correction
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionType('REJECT');
                      setReason('Document failed authentication check or applicant does not meet trade prerequisites.');
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      actionType === 'REJECT'
                        ? 'bg-rose-600 border-rose-500 text-white shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionType('SUSPEND');
                      setReason('Temporary administrative suspension pending disciplinary or compliance inquiry.');
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      actionType === 'SUSPEND'
                        ? 'bg-purple-600 border-purple-500 text-white shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Suspend Profile
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Official Decision Reason (Recorded on Audit Trail) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Internal Officer Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Recording Audit Transaction...' : `Confirm Action: ${actionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
