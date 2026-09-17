import React, { useState, useEffect } from 'react';
import {
  Download,
  IndianRupee,
  Building2,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { institutionService, InstitutionalInvoiceRecord } from '../../services/institutionService';

export const InstitutionInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InstitutionalInvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await institutionService.getInvoices();
        setInvoices(data);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Financial Clearance
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B / B2G Tax Invoices</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">GST-Compliant Invoices & Billing</h1>
          <p className="text-xs text-slate-500">
            Monthly service billing under direct State Labour Gazette floor tariffs with 0% middleman markups.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-semibold">
          <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>GSTIN: 21AAAGA0000A1Z5</span>
        </div>
      </div>

      {/* Invoices List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 hover:border-slate-300 transition"
            >
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-slate-900">{inv.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status === 'PAID' ? 'PAID & SETTLED' : 'PENDING CLEARANCE'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Contract: <span className="font-semibold text-slate-700">{inv.contract_id}</span> • Billing Period:{' '}
                    <span className="font-semibold text-slate-800">{inv.billing_period}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-xs text-slate-500">Net Payable Amount</div>
                  <div className="text-2xl font-extrabold text-slate-900 flex items-center sm:justify-end gap-1">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    {inv.net_payable.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500">Due: {inv.due_date}</div>
                </div>
              </div>

              {/* Line Items Table */}
              {inv.line_items && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-2">
                    Workforce Breakdown & Tariffs
                  </div>
                  {inv.line_items.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                      <span className="text-slate-700">{line.description}</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{line.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-300 flex items-center justify-between font-bold text-slate-900">
                    <span>GST (0% - Reverse Charge Pure Labour):</span>
                    <span className="font-mono">₹0.00</span>
                  </div>
                </div>
              )}

              {/* Invoice Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Beneficiary: Khurda District Urban Workers Cooperative Union ESCROW A/C</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Downloading signed GST Tax Invoice for ${inv.id}...`)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>

                  {inv.status !== 'PAID' && (
                    <button
                      onClick={() => alert(`Initiating Treasury / Bank RTGS clearance for ${inv.id}...`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Authorize Escrow Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
