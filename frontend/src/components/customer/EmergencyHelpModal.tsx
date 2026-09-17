import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  PhoneCall, 
  X, 
  Zap, 
  Droplet, 
  HeartHandshake, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';


interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const emergencyServices = [
    {
      title: 'Emergency Electrical Short Circuit',
      desc: 'Immediate dispatch for sparking, MCB trip, fire hazard, or main power outage.',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      eta: '15 - 25 mins',
      trade: 'electrician',
    },
    {
      title: 'Burst Pipe & Flood Leakage',
      desc: 'Urgent plumber for water tank burst, main line fracture, or indoor flooding.',
      icon: <Droplet className="w-5 h-5 text-blue-600" />,
      eta: '20 - 30 mins',
      trade: 'plumber',
    },
    {
      title: 'Emergency Patient Nursing SOS',
      desc: 'Immediate bedside caregiver dispatch for elderly fall or medical oversight.',
      icon: <HeartHandshake className="w-5 h-5 text-rose-600" />,
      eta: '30 - 45 mins',
      trade: 'patient-caregiver',
    },
  ];

  const handleRequestEmergency = (tradeSlug: string) => {
    onClose();
    navigate(`/customer/workers?trade=${tradeSlug}&emergency=true`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded-full">
                  Priority 1 Dispatch
                </span>
                <span className="text-xs text-red-100 font-bold">24x7 Cooperative Hotline</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Emergency Worker Assistance
              </h2>
              <p className="text-xs text-red-100 mt-0.5">
                Standby cooperative teams prioritized for immediate household emergencies
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Trade Buttons */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold text-slate-700">
            Select emergency category for instant proximity dispatch:
          </p>

          <div className="space-y-2.5">
            {emergencyServices.map((item) => (
              <div
                key={item.title}
                onClick={() => handleRequestEmergency(item.trade)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gov-navy group-hover:text-red-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gov-muted mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{item.eta}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* National & Cooperative Helpline Phone Bar */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-gov-green" />
              <div>
                <p className="text-xs font-bold text-gov-navy">National Toll-Free Control Room</p>
                <p className="text-[11px] text-gov-muted">1800-KARM-00 (1800-5276-00)</p>
              </div>
            </div>
            <a
              href="tel:18007472600"
              className="text-xs font-bold text-white bg-gov-navy hover:bg-gov-green px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-gov-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
            <span>Zero surge pricing on cooperative emergency calls</span>
          </span>
          <button onClick={onClose} className="font-bold text-slate-600 hover:text-gov-navy">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
