import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_CONFIGS } from '@/constants/roles';
import { UserRole } from '@/types/role';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Users,
  Wrench,
  Building2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

export const RoleJourneys: React.FC = () => {
  const { t } = useTranslation();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLaunchRole = (role: UserRole) => {
    switchRole(role);
    navigate(ROLE_CONFIGS[role].dashboardPath);
  };

  const roleCardsData: {
    role: UserRole;
    icon: React.ReactNode;
    title: string;
    desc: string;
    features: string[];
    accentColor: string;
    btnText: string;
  }[] = [
    {
      role: 'CUSTOMER',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: t('roles_section.citizen_card_title'),
      desc: t('roles_section.citizen_card_desc'),
      features: [
        'AI multi-factor worker matching',
        'Transparent cooperative pricing',
        'Post-shift Razorpay payment',
        'Recurring home maintenance'
      ],
      accentColor: 'border-blue-200 bg-blue-50/30',
      btnText: 'Enter Citizen Portal',
    },
    {
      role: 'WORKER',
      icon: <Wrench className="w-5 h-5 text-emerald-600" />,
      title: t('roles_section.worker_card_title'),
      desc: t('roles_section.worker_card_desc'),
      features: [
        'Define preferred work radius (e.g. 4 km)',
        'Digital KARM ID skill passport',
        'Leave & replacement protection',
        '100% daily earnings directly to Seva Partner'
      ],
      accentColor: 'border-emerald-200 bg-emerald-50/30',
      btnText: 'Enter Seva Partner Portal',
    },
    {
      role: 'COOPERATIVE_ADMIN',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      title: t('roles_section.cooperative_card_title'),
      desc: t('roles_section.cooperative_card_desc'),
      features: [
        'Seva Partner verification queue',
        'Automated replacement dispatch',
        'Transparent cooperative revenue ledger',
        'Local skill training academy'
      ],
      accentColor: 'border-purple-200 bg-purple-50/30',
      btnText: 'Enter Seva Cooperative Operations',
    },
    {
      role: 'INSTITUTION',
      icon: <UserCheck className="w-5 h-5 text-amber-600" />,
      title: t('roles_section.institution_card_title'),
      desc: t('roles_section.institution_card_desc'),
      features: [
        'Bulk workforce team deployment',
        'Multi-day recurring schedules',
        'Campus shift attendance logs',
        'Consolidated period GST billing'
      ],
      accentColor: 'border-amber-200 bg-amber-50/30',
      btnText: 'Enter Institutional Workspace',
    },
    {
      role: 'SYSTEM_ADMIN',
      icon: <ShieldCheck className="w-5 h-5 text-slate-700" />,
      title: t('roles_section.admin_card_title'),
      desc: t('roles_section.admin_card_desc'),
      features: [
        'State & District demand oversight',
        'Cooperative accreditation & compliance',
        'Escalated dispute resolution',
        'Comprehensive system audit logs'
      ],
      accentColor: 'border-slate-300 bg-slate-100/40',
      btnText: 'Enter Administration Portal',
    },
  ];

  return (
    <section id="roles-section" className="py-14 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Tailored Public Ecosystem
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            {t('roles_section.section_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted">
            {t('roles_section.section_subtitle')}
          </p>
        </div>

        {/* 5 Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleCardsData.map((item) => (
            <Card
              key={item.role}
              className={`p-5 flex flex-col justify-between hover:shadow-gov-hover transition-all border ${item.accentColor}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {ROLE_CONFIGS[item.role].hindiLabel}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-base text-gov-navy">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gov-muted mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <ul className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  {item.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center space-x-2 text-[11px] text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-gov-green shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-200/80">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-bold"
                  onClick={() => handleLaunchRole(item.role)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {item.btnText}
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
