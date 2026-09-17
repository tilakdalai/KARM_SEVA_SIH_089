import React from 'react';
import { useTranslation } from '@/i18n';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  ShieldCheck,
  FileCheck2,
  Wallet,
  HeartHandshake,
  Lock,
  Zap,
  CheckCircle2,
  QrCode,
  Award
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { t } = useTranslation();

  const trustFeatures = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-gov-green" />,
      title: t('trust.feature_1_title'),
      desc: t('trust.feature_1_desc'),
      tag: 'State Cooperative Reg.',
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-blue-600" />,
      title: t('trust.feature_2_title'),
      desc: t('trust.feature_2_desc'),
      tag: 'Tamper-Proof ID',
    },
    {
      icon: <Wallet className="w-5 h-5 text-purple-600" />,
      title: t('trust.feature_3_title'),
      desc: t('trust.feature_3_desc'),
      tag: '100% Payout Accuracy',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-amber-600" />,
      title: t('trust.feature_4_title'),
      desc: t('trust.feature_4_desc'),
      tag: 'Zero Disruption',
    },
    {
      icon: <Lock className="w-5 h-5 text-red-600" />,
      title: t('trust.feature_5_title'),
      desc: t('trust.feature_5_desc'),
      tag: 'Private & Encrypted',
    },
    {
      icon: <Zap className="w-5 h-5 text-orange-600" />,
      title: t('trust.feature_6_title'),
      desc: t('trust.feature_6_desc'),
      tag: 'Emergency Fast Track',
    },
  ];

  return (
    <section id="trust-section" className="py-14 bg-gov-bg border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="success" size="md" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Institutional Credibility & Worker Dignity
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            {t('trust.section_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted">
            {t('trust.section_subtitle')}
          </p>
        </div>

        {/* Interactive Trust Grid & Mock KARM ID Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 6 Features */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustFeatures.map((feat, idx) => (
              <Card
                key={idx}
                className="p-4 border-slate-200 hover:border-gov-green/60 hover:shadow-gov-card transition-all space-y-2 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {feat.icon}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-gov-navy">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-gov-muted leading-relaxed">
                  {feat.desc}
                </p>
              </Card>
            ))}
          </div>

          {/* Right Column: Visual Mock Digital KARM ID Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-gov-navy/20 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
              {/* Card Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gov-saffron via-white to-gov-green" />

              {/* ID Card Header */}
              <div className="flex justify-between items-start pt-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gov-navy text-white flex items-center justify-center font-black text-base shadow-xs">
                    K
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-gov-navy leading-none">DIGITAL KARM ID</h4>
                    <span className="text-[10px] text-gov-greenDark font-bold">Government-Backed Credential</span>
                  </div>
                </div>
                <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Cooperative Verified
                </Badge>
              </div>

              {/* Worker Profile Details */}
              <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xl shrink-0">
                  GN
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="font-black text-sm text-gov-navy truncate">Gopal Nayak</p>
                  <p className="text-xs font-semibold text-emerald-700">Master Electrician (ITI License)</p>
                  <p className="text-[10px] font-mono text-gov-muted">ID: KS-OD-2024-8841</p>
                </div>
              </div>

              {/* Trust Badges on Card */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-gov-muted block">Rating Score</span>
                  <strong className="text-emerald-800 font-extrabold text-sm flex items-center justify-center gap-0.5">
                    ★ 4.8
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-gov-muted block">On-Time Rate</span>
                  <strong className="text-blue-800 font-extrabold text-sm">94%</strong>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-gov-muted block">Shifts Done</span>
                  <strong className="text-purple-800 font-extrabold text-sm">92</strong>
                </div>
              </div>

              {/* QR Verification Mock */}
              <div className="flex items-center justify-between pt-2 text-xs text-gov-muted border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-8 h-8 text-gov-navy shrink-0" />
                  <span className="text-[10px] leading-tight">
                    Scan with any UPI / Gov Scanner to verify official credentials.
                  </span>
                </div>
                <Award className="w-6 h-6 text-gov-saffron shrink-0" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
