import React, { useState, useEffect } from 'react';
import {
  Plus,
  IndianRupee,
  Clock,
  Edit2,
} from 'lucide-react';
import { cooperativeService, CooperativeServiceItem } from '../../services/cooperativeService';
import { CreateServiceModal } from '../../components/cooperative/CreateServiceModal';

export const CooperativeServicesPage: React.FC = () => {
  const [services, setServices] = useState<CooperativeServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await cooperativeService.getServices();
      setServices(data);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggle = async (service: CooperativeServiceItem) => {
    try {
      const updated = !service.is_enabled;
      await cooperativeService.updateService(service.id, { is_enabled: updated });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_enabled: updated } : s))
      );
    } catch {
      alert('Failed to update service status.');
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Standardized Services & Pricing Catalog
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              Cooperative Floor Rates
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Configure approved union trade offerings, minimum floor prices, standard duration brackets, and live visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">Loading union service catalog...</div>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between shadow-sm ${
                s.is_enabled ? 'border-slate-200 hover:border-slate-400' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 uppercase tracking-wider">
                    {s.category}
                  </span>
                  <button
                    onClick={() => handleToggle(s)}
                    className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
                      s.is_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.is_enabled ? 'LIVE ON PLATFORM' : 'DISABLED'}
                  </button>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{s.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">{s.trade}</span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {s.duration_mins} mins
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Union Floor Rate</div>
                  <div className="text-xl font-extrabold text-slate-900 flex items-center">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    {s.base_price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Editing rate & SLA config for ${s.title}`)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                    title="Edit Rate Standard"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <CreateServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(newSrv) => {
          setServices((prev) => [newSrv, ...prev]);
        }}
      />
    </div>
  );
};
