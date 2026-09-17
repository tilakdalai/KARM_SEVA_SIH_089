import React, { useState } from 'react';
import { paymentService, PaymentVerifyRecord, OrderRecord } from '@/services/paymentService';
import { Button } from '@/components/common/Button';
import { AlertTriangle, X, CheckCircle2, Lock, Radio } from 'lucide-react';

interface RazorpayTestModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verifyRecord: PaymentVerifyRecord) => void;
}

export const RazorpayTestModal: React.FC<RazorpayTestModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('UPI');

  if (!isOpen || !order) return null;

  // Simple test HMAC SHA-256 helper for test sandbox
  const generateClientTestSignature = async (orderId: string, paymentId: string): Promise<string> => {
    const message = `${orderId}|${paymentId}`;
    const secret = 'rzp_test_secret_key_shramsetu_dpi';
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await window.crypto.subtle.sign('HMAC', key, enc.encode(message));
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSimulatePayment = async (mode: 'SUCCESS' | 'TAMPERED') => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const paymentId = `pay_rzp_test_${Math.floor(100000 + Math.random() * 900000)}`;
      let signature = '';

      if (mode === 'SUCCESS') {
        signature = await generateClientTestSignature(order.order_id, paymentId);
      } else {
        signature = 'tampered_invalid_signature_deadbeef1234';
      }

      // Zero-trust backend verification
      const verifyRecord = await paymentService.verifyPayment({
        booking_id: order.booking_id,
        razorpay_order_id: order.order_id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });

      onSuccess(verifyRecord);
      onClose();
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setErrorMessage(
        err?.response?.data?.message ||
          'Cryptographic signature verification failed on backend. Payment rejected.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-sm shadow">
                R
              </div>
              <span className="font-black text-lg tracking-tight">Razorpay Checkout</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-blue-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            TEST SANDBOX MODE (No Real Money Debited)
          </div>

          <div className="pt-2 flex items-baseline justify-between border-t border-blue-700/50">
            <span className="text-xs text-blue-200">{order.service_title || 'Service Payment'}</span>
            <span className="text-2xl font-black text-white">₹{order.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Select Test Payment Instrument</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  selectedMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('CARD')}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  selectedMethod === 'CARD'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('NETBANKING')}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  selectedMethod === 'NETBANKING'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                NetBanking
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-slate-800 font-bold">{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Key ID:</span>
              <span className="font-mono text-slate-800 font-bold">{order.key_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold text-slate-800">{order.customer_name}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('SUCCESS')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                'Verifying Signature on Backend...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful Payment (Valid HMAC)</span>
                </>
              )}
            </Button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('TAMPERED')}
              className="w-full py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold text-[11px] border border-rose-200 flex items-center justify-center gap-1.5 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Test Tampered Signature (Verify 400 Rejection)</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted Test Sandbox Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
