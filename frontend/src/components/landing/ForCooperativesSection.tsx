import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Building2,
  FileCheck2,
  Users2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const ForCooperativesSection: React.FC = () => {
  const navigate = useNavigate();

  const coopFeatures = [
    {
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      title: 'Operations Control Room',
      desc: 'Real-time bird’s-eye view of member artisans, district booking dispatch, active shifts, and automated emergency radar broadcasts.',
      tag: 'Control Room',
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-indigo-600" />,
      title: '4-Tier Occupational Verification Desk',
      desc: 'Seamless document auditing for Groups A to D with DigiLocker integration, Aadhaar masking, police clearance, and ITI trade credentials.',
      tag: 'Verification Desk',
    },
    {
      icon: <Users2 className="w-5 h-5 text-blue-600" />,
      title: 'Leave & Replacement Mediation Desk',
      desc: 'When an artisan takes sick leave, intelligent peer-replacement auto-matches standby workers to preserve citizen trust and maintain earnings.',
      tag: 'Continuity Desk',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      title: '10% Statutory Welfare Ledger',
      desc: 'Statutory 10% cooperative share is deposited directly into your welfare fund for artisan health insurance, safety gear, and skill academies.',
      tag: 'Welfare Ledger',
    },
  ];

  return (
    <section id="for-cooperatives-section" className="py-16 bg-slate-50 border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="info" size="md" icon={<Building2 className="w-3.5 h-3.5" />} className="bg-purple-50 text-purple-700 border-purple-200">
                For Seva Cooperatives
              </Badge>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                सेवा सहकारी समिति
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
              Digitize Your Union with Sovereign Public Infrastructure
            </h2>

            <p className="text-xs sm:text-sm text-gov-muted leading-relaxed max-w-2xl">
              Equip your labour cooperative with an enterprise-grade digital control room: manage member verification, monitor district jobs, mediate replacements, and collect transparent statutory welfare dues.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/cooperative')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs sm:text-sm bg-purple-700 hover:bg-purple-800"
            >
              Access Cooperative Desk
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/cooperative/verification')}
              className="font-bold text-xs sm:text-sm border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Verification Queue Desk
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coopFeatures.map((feat, idx) => (
            <Card
              key={idx}
              className="p-5 border-slate-200 hover:border-purple-300 hover:shadow-gov-hover transition-all bg-white flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 shadow-2xs">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-gov-navy leading-snug">
                  {feat.title}
                </h3>

                <p className="text-xs text-gov-muted leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-purple-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span>Cooperative Sovereignty</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
