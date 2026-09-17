import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService';

export const InstitutionProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState('');
  const [instType, setInstType] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [nodalName, setNodalName] = useState('');
  const [nodalPhone, setNodalPhone] = useState('');
  const [nodalEmail, setNodalEmail] = useState('');
  const [nodalDesignation, setNodalDesignation] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await institutionService.getProfile();
        setOrgName(data.organization_name);
        setInstType(data.institution_type);
        setGstin(data.gstin || '');
        setPan(data.pan_number || '');
        setNodalName(data.nodal_officer_name);
        setNodalPhone(data.nodal_officer_phone);
        setNodalEmail(data.nodal_officer_email || '');
        setNodalDesignation(data.nodal_officer_designation || '');
        setAddress(data.address);
        setDistrict(data.district);
        setPincode(data.pincode);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await institutionService.updateProfile({
        organization_name: orgName,
        institution_type: instType,
        gstin,
        pan_number: pan,
        nodal_officer_name: nodalName,
        nodal_officer_phone: nodalPhone,
        nodal_officer_email: nodalEmail,
        nodal_officer_designation: nodalDesignation,
        address,
        district,
        pincode,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Institutional Master Record
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Institution & Nodal Officer Profile</h1>
          <p className="text-xs text-slate-500">
            Organizational identity, GST registration, facility campus address, and authorized procurement signatory.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified Institutional Entity</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Institutional profile details updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Organization Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            1. Organization & Tax Identifiers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Organization / Directorate Name
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institution Type
              </label>
              <select
                value={instType}
                onChange={(e) => setInstType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Autonomous Government Hospital & Medical College">Autonomous Government Hospital & Medical College</option>
                <option value="Public University / School Board">Public University / School Board</option>
                <option value="Government Office / PSU">Government Office / PSU</option>
                <option value="Private Corporate Enterprise">Private Corporate Enterprise</option>
                <option value="Residential Housing Society">Residential Housing Society</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GSTIN (Goods and Services Tax ID)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold text-slate-800 focus:outline-none"
                  placeholder="21AAAGA0000A1Z5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold text-slate-800 focus:outline-none"
                placeholder="AAAGA0000A"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District / Region
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facility Campus Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Authorized Nodal Officer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2.5">
            <User className="w-4 h-4 text-indigo-600" />
            2. Authorized Nodal Procurement Officer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nodal Officer Full Name
              </label>
              <input
                type="text"
                required
                value={nodalName}
                onChange={(e) => setNodalName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Designation
              </label>
              <input
                type="text"
                value={nodalDesignation}
                onChange={(e) => setNodalDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={nodalPhone}
                  onChange={(e) => setNodalPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Government Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={nodalEmail}
                  onChange={(e) => setNodalEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
