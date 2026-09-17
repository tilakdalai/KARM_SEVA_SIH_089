import React, { useState } from 'react';
import { MOCK_ADDRESSES, SavedAddressMock } from '@/services/customerMockData';
import { 
  MapPin, 
  X, 
  Check, 
  Home, 
  Briefcase, 
  Heart, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/common/Button';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (addressText: string) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [selectedId, setSelectedId] = useState('addr-1');
  const [customLocality, setCustomLocality] = useState('');

  if (!isOpen) return null;

  const getAddressIcon = (label: string) => {
    switch (label) {
      case 'Home': return <Home className="w-4 h-4 text-blue-600" />;
      case 'Office': return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Parents': return <Heart className="w-4 h-4 text-rose-600" />;
      default: return <MapPin className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleSelect = (addr: SavedAddressMock) => {
    setSelectedId(addr.id);
    const fullText = `${addr.areaLocality}, ${addr.district} (${addr.pincode})`;
    onSelectAddress(fullText);
    onClose();
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocality.trim()) {
      onSelectAddress(customLocality.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gov-border shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-gov-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gov-green/10 text-gov-green rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gov-navy">
                Select Service Location
              </h3>
              <p className="text-[11px] text-gov-muted">
                Workers within your local cooperative radius will be matched
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Custom Search Locality Input */}
          <form onSubmit={handleCustomApply} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Enter Area, Sector or PIN Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder={`Current: ${currentAddress}`}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                />
              </div>
              <Button type="submit" size="sm" variant="primary" className="text-xs font-bold">
                Set
              </Button>
            </div>
          </form>

          {/* Saved Addresses List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Saved Addresses</span>
            </div>

            <div className="space-y-2">
              {MOCK_ADDRESSES.map((addr) => {
                const isSelected = selectedId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'border-gov-green bg-emerald-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                        {getAddressIcon(addr.label)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-gov-navy">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold text-gov-green bg-emerald-100 px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium leading-tight">
                          {addr.flatPlot}, {addr.areaLocality}
                        </p>
                        <p className="text-[10px] text-gov-muted">
                          {addr.district} - {addr.pincode}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gov-green text-white flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
};
