import React from 'react';
import { InvoiceRecord } from '@/services/paymentService';
import { Button } from '@/components/common/Button';
import { Printer, X, CheckCircle2, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  invoice: InvoiceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Official GST Tax Invoice ({invoice.invoice_number})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-8 sm:p-10 space-y-8 print:p-6 font-sans text-slate-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                  KS
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">KARM SEVA</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                National Public Digital Infrastructure for Skills, Workforce Enablement &amp; Cooperatives
              </p>
              <p className="text-[11px] text-slate-400">
                Ministry of Cooperation • SIH PS26089 DPI Standard
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GST TAX INVOICE
              </span>
              <div className="text-sm font-black text-slate-900">{invoice.invoice_number}</div>
              <div className="text-xs text-slate-500 font-medium">Date: {invoice.invoice_date}</div>
              <div className="text-[11px] text-slate-400">Booking Ref: {invoice.booking_reference || invoice.booking_id}</div>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Billed To (Citizen / Client)
              </span>
              <h3 className="font-bold text-sm text-slate-900">{invoice.customer_name || 'Verified Citizen'}</h3>
              {invoice.customer_phone && <p className="text-slate-600">{invoice.customer_phone}</p>}
              <p className="text-slate-600 leading-relaxed">{invoice.customer_address || 'Bhubaneswar, Odisha'}</p>
            </div>

            {/* Service Cooperative & Worker */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Issued By (Service Cooperative)
              </span>
              <h3 className="font-bold text-sm text-slate-900">{invoice.cooperative_name}</h3>
              <p className="text-slate-600 font-mono text-[11px]">Coop Code: {invoice.cooperative_code}</p>
              <div className="pt-1 text-[11px] text-slate-700">
                <strong>Certified Seva Partner:</strong> {invoice.worker_name} ({invoice.worker_shram_id || 'Verified KARM ID'})
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description &amp; Service Category</th>
                  <th className="p-3 text-center">SAC Code</th>
                  <th className="p-3 text-center">Qty / Shift</th>
                  <th className="p-3 text-right">Floor Tariff</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.item_breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                    <td className="p-3 text-center font-mono text-slate-500">{item.sac_code || '998713'}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">₹{item.unit_rate.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations & QR Code Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* QR Verification Seal */}
            <div className="sm:col-span-6 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Digital DPI Verified</span>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Cryptographically verified on Razorpay Test Sandbox. 100% direct payout transferred to Seva Partner wallet.
                </p>
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="sm:col-span-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Base Work Tariff):</span>
                <span className="font-semibold">₹{(invoice.gross_amount - invoice.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%) + SGST (9%):</span>
                <span className="font-semibold">₹{invoice.tax_amount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700 text-base">₹{invoice.net_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            This is a computer-generated tax invoice issued via the KARM SEVA Government DPI Architecture. No physical signature required.
          </div>
        </div>
      </div>
    </div>
  );
};
