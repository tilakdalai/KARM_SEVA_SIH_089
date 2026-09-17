import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ADDRESSES, SavedAddressMock } from '@/services/customerMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase, 
  Heart, 
  Trash2, 
  ArrowLeft, 
  X 
} from 'lucide-react';

export const SavedAddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<SavedAddressMock[]>(MOCK_ADDRESSES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New address form state
  const [label, setLabel] = useState<'Home' | 'Office' | 'Parents' | 'Other'>('Home');
  const [recipientName, setRecipientName] = useState('Ananya Patnaik');
  const [phone, setPhone] = useState('+91 9876543210');
  const [flatPlot, setFlatPlot] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [district, setDistrict] = useState('Bhubaneswar');
  const [pincode, setPincode] = useState('751012');

  const getAddressIcon = (lbl: string) => {
    switch (lbl) {
      case 'Home': return <Home className="w-5 h-5 text-blue-600" />;
      case 'Office': return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'Parents': return <Heart className="w-5 h-5 text-rose-600" />;
      default: return <MapPin className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddressMock = {
      id: `addr-${Date.now()}`,
      label,
      recipientName,
      phone,
      flatPlot,
      areaLocality,
      district,
      pincode,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setIsAddModalOpen(false);
    setFlatPlot('');
    setAreaLocality('');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-bold shadow-xs"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Address
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <MapPin className="w-6 h-6 text-gov-green" />
          <span>Saved Service Addresses</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Fast 1-click delivery location selection for household repairs and caregiver shifts
        </p>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <Card
            key={addr.id}
            className={`p-5 border transition-all bg-white flex flex-col justify-between ${
              addr.isDefault ? 'border-gov-green shadow-xs' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {getAddressIcon(addr.label)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gov-navy">
                      {addr.label}
                    </h3>
                    <p className="text-[11px] text-gov-muted">
                      {addr.recipientName} ({addr.phone})
                    </p>
                  </div>
                </div>

                {addr.isDefault && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-gov-green bg-emerald-100 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-700 font-medium leading-relaxed pl-1">
                <p>{addr.flatPlot}</p>
                <p>{addr.areaLocality}</p>
                <p className="text-gov-muted text-[11px]">{addr.district} - {addr.pincode}</p>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] font-bold text-gov-greenDark hover:underline"
                >
                  Make Default
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Primary Address</span>
              )}

              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gov-border shadow-2xl max-w-md w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-gov-navy flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gov-green" />
                <span>Add New Service Address</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Office', 'Parents'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLabel(lbl)}
                      className={`p-2 rounded-lg font-bold border text-center transition-all ${
                        label === lbl
                          ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Ananya Patnaik"
                    className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Flat / Plot / House Number *</label>
                <input
                  type="text"
                  value={flatPlot}
                  onChange={(e) => setFlatPlot(e.target.value)}
                  placeholder="e.g. Plot 204, Ground Floor"
                  className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Locality / Street *</label>
                <input
                  type="text"
                  value={areaLocality}
                  onChange={(e) => setAreaLocality(e.target.value)}
                  placeholder="e.g. IRC Village, Nayapalli"
                  className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District / City *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button type="submit" variant="primary" className="flex-1 text-xs font-bold py-2.5">
                  Save Address
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
