import React, { useState } from 'react';
import { X, Tag, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import { cooperativeService, CooperativeServiceItem } from '../../services/cooperativeService';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (service: CooperativeServiceItem) => void;
}

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [trade, setTrade] = useState('Master Electrician');
  const [basePrice, setBasePrice] = useState<number>(350);
  const [durationMins, setDurationMins] = useState<number>(60);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || basePrice <= 0) {
      setError('Please provide a valid service title and base floor price.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await cooperativeService.createService({
        title,
        category,
        trade,
        base_price: basePrice,
        duration_mins: durationMins,
        description,
        is_enabled: true,
      });
      onSuccess(res.data.service);
      onClose();
    } catch {
      setError('Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Create Standardized Service</h3>
              <p className="text-xs text-slate-400">Cooperative Union Rate & Trade Catalog Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3-Phase Inverter & Battery Installation"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Caregiving">Caregiving</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleaning">Cleaning & Sanitation</option>
                <option value="Driving">Transport & Driving</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designated Trade *
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="Master Electrician">Master Electrician</option>
                <option value="Master Plumber">Master Plumber</option>
                <option value="Senior Patient Caregiver">Senior Patient Caregiver</option>
                <option value="Carpenter & Wood Specialist">Carpenter</option>
                <option value="Housekeeping Specialist">Housekeeping Specialist</option>
                <option value="Commercial Driver">Commercial Driver</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Floor Standard Rate (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Standard Duration *
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="15"
                  step="15"
                  required
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value))}
                  placeholder="Minutes"
                  className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Scope & Standards
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included under this union standard rate..."
              className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800">
            <strong>Audit Notice:</strong> Publishing this service will log a permanent entry on the state cooperative registry under your officer ID.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {isSubmitting ? 'Publishing...' : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
