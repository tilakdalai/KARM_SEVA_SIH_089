import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { adminService, SystemSettingsData } from '../../services/adminService';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>({
    platform_commission_percent: 0.0,
    welfare_allocation_percent: 10.0,
    worker_takehome_percent: 90.0,
    state_gazette_sync_enabled: true,
    audit_strict_mode: true,
    replacement_sla_minutes: 45,
    jurisdiction_state: 'Odisha',
    nodal_authority: 'Directorate of Cooperative Societies & Odisha State Labour Directorate',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      setMessage('System DPI Settings updated successfully. Cryptographic audit entry created.');
      setTimeout(() => setMessage(null), 3500);
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
              Platform Configuration
            </span>
            <span className="text-xs text-slate-500 font-medium">Digital Public Infrastructure Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">System DPI Governance & Escrow Settings</h1>
          <p className="text-xs text-slate-500">
            Configure state-wide escrow splits, SLA timers, audit policies, and gazette synchronization rules.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Statutory 90/10 Split Enforced</span>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Escrow & Commission Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Escrow Revenue Split Formula</h2>
              <p className="text-xs text-slate-500">Mandated statutory revenue disbursement percentages</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Zero Platform Commission
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Worker Take-Home (%):
              </label>
              <input
                type="number"
                disabled
                value={settings.worker_takehome_percent}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Locked at 90.0% by State Regulation</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cooperative Welfare Trust (%):
              </label>
              <input
                type="number"
                disabled
                value={settings.welfare_allocation_percent}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 font-extrabold text-slate-900 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Locked at 10.0% for worker insurance & training</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Commission (%):
              </label>
              <input
                type="number"
                disabled
                value={settings.platform_commission_percent}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 font-extrabold text-emerald-700 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">0.00% Zero Deduction Guarantee</span>
            </div>
          </div>
        </div>

        {/* Section 2: SLA & Gazette Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-bold text-slate-900 text-base">Operational SLAs & State Gazette Integration</h2>
            <p className="text-xs text-slate-500">Thresholds for emergency replacements and minimum wage benchmarks</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Worker Replacement SLA (Minutes):
              </label>
              <input
                type="number"
                value={settings.replacement_sla_minutes}
                onChange={(e) =>
                  setSettings({ ...settings, replacement_sla_minutes: parseInt(e.target.value) || 45 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Time limit for Cooperative to dispatch backup worker before auto-escalation
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jurisdiction State:
              </label>
              <input
                type="text"
                value={settings.jurisdiction_state}
                onChange={(e) => setSettings({ ...settings, jurisdiction_state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={settings.state_gazette_sync_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, state_gazette_sync_enabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-slate-900 focus:ring-0"
              />
              <span>Enable automated bi-annual State Gazette Minimum Floor Wage synchronization</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={settings.audit_strict_mode}
                onChange={(e) => setSettings({ ...settings, audit_strict_mode: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-0"
              />
              <span>Enforce Strict Cryptographic Audit Mode on all administrative state transitions</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration & Update Audit Trail'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
