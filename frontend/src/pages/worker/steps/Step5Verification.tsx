import React, { useState } from 'react';
import { TradePolicy } from '@/services/workerService';
import { 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  Trash2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface Step5Props {
  tradePolicy?: TradePolicy;
  identityDoc: {
    document_type: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'BPL_CARD';
    document_number: string;
    document_ref?: string;
  };
  certifications: Array<{
    certificate_name: string;
    issuing_authority: string;
    certificate_number?: string;
    issue_year?: number;
    document_url?: string;
  }>;
  isPoliceCleared: boolean;
  onIdentityDocChange: (doc: Step5Props['identityDoc']) => void;
  onCertificationsChange: (certs: Step5Props['certifications']) => void;
  onPoliceClearanceChange: (cleared: boolean) => void;
}

export const Step5Verification: React.FC<Step5Props> = ({
  tradePolicy,
  identityDoc,
  certifications,
  isPoliceCleared,
  onIdentityDocChange,
  onCertificationsChange,
  onPoliceClearanceChange,
}) => {
  const [showDocNum, setShowDocNum] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState<number>(2022);

  const group = tradePolicy?.group || 'GROUP_A';
  const isGroupA = group === 'GROUP_A';
  const isGroupD = group === 'GROUP_D';

  const maskPreview = (_docType: string, num: string) => {
    if (!num) return 'XXXX-XXXX-XXXX';
    const clean = num.replace(/\s+/g, '');
    if (clean.length <= 4) return `XXXX-XXXX-${clean}`;
    return `XXXX-XXXX-${clean.slice(-4)}`;
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertName.trim() && newCertIssuer.trim()) {
      onCertificationsChange([
        ...certifications,
        {
          certificate_name: newCertName.trim(),
          issuing_authority: newCertIssuer.trim(),
          issue_year: newCertYear,
          document_url: 'https://karmseva.gov.in/vault/cert-sample.pdf',
        },
      ]);
      setNewCertName('');
      setNewCertIssuer('');
    }
  };

  const handleRemoveCert = (index: number) => {
    onCertificationsChange(certifications.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-gov-green" />
          <span>Step 5: Identity &amp; Credential Verification</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Government identity documents and occupation accreditation verification
        </p>
      </div>

      {/* Zero Raw ID Privacy Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-bold">
          <Lock className="w-4 h-4 text-gov-green" />
          <span>High Security &amp; Data Masking Guarantee</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          KARM SEVA complies with National Digital Identity Privacy protocols. Your raw document number is encrypted in state trust vaults and never displayed to citizens or employers.
        </p>
      </div>

      {/* 1. Identity Document Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
          <span>1. Official Identity Document *</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Document Type Picker */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Document Type *
            </label>
            <select
              value={identityDoc.document_type}
              onChange={(e) => onIdentityDocChange({ ...identityDoc, document_type: e.target.value as any })}
              className="w-full font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              <option value="AADHAAR">Aadhaar Card (12 Digits)</option>
              <option value="PAN">PAN Card (10 Digits)</option>
              <option value="VOTER_ID">Voter Election ID Card</option>
              <option value="BPL_CARD">BPL / Ration Card</option>
            </select>
          </div>

          {/* Document Number with Masking */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">
                Document Number *
              </label>
              <button
                type="button"
                onClick={() => setShowDocNum(!showDocNum)}
                className="text-[11px] font-bold text-slate-500 hover:text-gov-navy flex items-center gap-1"
              >
                {showDocNum ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showDocNum ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <input
              type={showDocNum ? 'text' : 'password'}
              value={identityDoc.document_number}
              onChange={(e) => onIdentityDocChange({ ...identityDoc, document_number: e.target.value })}
              placeholder="Enter official document number"
              className="w-full font-mono text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              required
            />
          </div>

        </div>

        {/* Live Public Display Preview */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Public Shielded Representation:</span>
          <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            {maskPreview(identityDoc.document_type, identityDoc.document_number)}
          </span>
        </div>
      </div>

      {/* 2. Trade Certifications & Licences */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>2. Trade Accreditation & Certificates</span>
            </h3>
            <p className="text-[11px] text-gov-muted">
              {isGroupA && (
                <strong className="text-red-700">
                  ⚠️ Group A Policy: At least 1 formal trade certificate / licence is MANDATORY for {tradePolicy?.trade}.
                </strong>
              )}
              {isGroupD && (
                <span className="text-emerald-700 font-bold">
                  ✓ Group D Policy: No formal certificates required. You may proceed directly.
                </span>
              )}
              {!isGroupA && !isGroupD && (
                <span>Upload optional ITI, NCVT, or trade licenses to earn the Verified Craftsman badge.</span>
              )}
            </p>
          </div>
        </div>

        {/* Existing Certificates List */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gov-navy block">{cert.certificate_name}</span>
                  <span className="text-[11px] text-gov-muted">
                    Issuer: {cert.issuing_authority} · Year: {cert.issue_year || '2022'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Certificate Form */}
        {(!isGroupD || certifications.length === 0) && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-700 block">
              + Add Trade Certificate or Licence
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                placeholder={isGroupA ? "e.g. ITI National Trade Certificate" : "e.g. Skill India Certificate"}
                className="font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              />

              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="e.g. NCVT / State Technical Board"
                className="font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1990"
                  max="2026"
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(parseInt(e.target.value) || 2022)}
                  className="w-24 font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="flex-1 px-3 py-2 rounded-lg bg-gov-navy text-white font-bold hover:bg-blue-900 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Police Clearance & Integrity Self-Declaration */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPoliceCleared}
            onChange={(e) => onPoliceClearanceChange(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-gov-green focus:ring-gov-green"
          />
          <div className="space-y-0.5">
            <span className="font-bold text-gov-navy block">
              Integrity & Police Verification Declaration *
            </span>
            <p className="text-[11px] text-gov-muted leading-relaxed">
              I certify that I have no criminal record, active warrants, or disciplinary suspensions, and I consent to background validation by the designated Seva Cooperative.
            </p>
          </div>
        </label>
      </div>

    </div>
  );
};
