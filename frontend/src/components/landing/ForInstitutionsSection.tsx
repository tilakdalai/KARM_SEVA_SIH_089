import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Building,
  QrCode,
  ReceiptText,
  ArrowRight,
  CheckCircle2,
  CalendarRange,
  Users
} from 'lucide-react';

export const ForInstitutionsSection: React.FC = () => {
  const navigate = useNavigate();

  const instFeatures = [
    {
      icon: <Users className="w-5 h-5 text-amber-600" />,
      title: 'Bulk Multi-Trade Deployments',
      desc: 'Deploy 5 to 50+ specialized artisans for hospitals, campuses, tech parks, and administrative complexes under a single coordinated request.',
      tag: 'Bulk Teams',
    },
    {
      icon: <CalendarRange className="w-5 h-5 text-blue-600" />,
      title: 'SLA Contracts & Scheduled Shifts',
      desc: 'Define institutional maintenance service level agreements (SLAs), customized shift timings, and guaranteed uptime protocols.',
      tag: 'SLA Contracts',
    },
    {
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
      title: 'Geo-Fenced Campus Attendance',
      desc: 'Supervisors track artisan check-ins, campus entry scans, biometric/QR logs, and real-time headcounts across sprawling institutional facilities.',
      tag: 'Campus Audit',
    },
    {
      icon: <ReceiptText className="w-5 h-5 text-purple-600" />,
      title: 'Consolidated Monthly GST Invoices',
      desc: 'Simplify institutional accounting with consolidated period GST billing compliant with public procurement guidelines and 85/10/5 escrow rules.',
      tag: 'GST Billing',
    },
  ];

  const trustedInstitutions = [
    'AIIMS Bhubaneswar',
    'IIT Bhubaneswar',
    'State Secretariat (Lok Seva Bhawan)',
    'DAV Public School Network',
    'IDCO Industrial Estate',
  ];

  return (
    <section id="for-institutions-section" className="py-16 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="warning" size="md" icon={<Building className="w-3.5 h-3.5" />}>
                For Public & Private Institutions (B2B / B2G)
              </Badge>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                संस्थान / संगठन
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
              Enterprise Workforce Procurement with SLA Transparency
            </h2>

            <p className="text-xs sm:text-sm text-gov-muted leading-relaxed max-w-2xl">
              Procure verified artisan teams at statutory floor rates without predatory contractor markups. Benefit from geo-fenced campus shift tracking, institutional contracts, and consolidated GST invoicing.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/institution/request')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700"
            >
              Request Workforce Team
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/institution')}
              className="font-bold text-xs sm:text-sm border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              Institutional Workspace
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instFeatures.map((feat, idx) => (
            <Card
              key={idx}
              className="p-5 border-slate-200 hover:border-amber-300 hover:shadow-gov-hover transition-all bg-slate-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 shadow-2xs">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
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

              <div className="pt-3 border-t border-slate-200/60 flex items-center text-[11px] font-bold text-amber-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                <span>Govt Procurement Standard</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Institutional Trust Bar */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wider">
            Trusted by Major Public & Academic Bodies:
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-bold text-slate-600 text-xs">
            {trustedInstitutions.map((inst, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                {inst}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
