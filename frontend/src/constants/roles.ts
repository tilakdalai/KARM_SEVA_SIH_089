import { RoleConfig, UserRole } from '@/types/role';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  CUSTOMER: {
    id: 'CUSTOMER',
    label: 'Citizen',
    hindiLabel: 'नागरिक',
    odiaLabel: 'ନାଗରିକ',
    description: 'Find trusted local services, connect with verified Seva Partners, book services, live track & pay securely.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    dashboardPath: '/customer',
  },
  WORKER: {
    id: 'WORKER',
    label: 'Seva Partner',
    hindiLabel: 'सेवा साथी',
    odiaLabel: 'ସେବା ସାଥୀ',
    description: 'Manage KARM ID, preferred radius, accept jobs, handle leave/replacements & track daily earnings with dignity.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dashboardPath: '/worker',
  },
  COOPERATIVE_ADMIN: {
    id: 'COOPERATIVE_ADMIN',
    label: 'Seva Cooperative',
    hindiLabel: 'सेवा सहकारी समिति',
    odiaLabel: 'ସେବା ସମବାୟ ସମିତି',
    description: 'Operations control room: worker verification, radius map, job allocation, revenue ledger & settlements.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    dashboardPath: '/cooperative',
  },
  INSTITUTION: {
    id: 'INSTITUTION',
    label: 'Institution',
    hindiLabel: 'संस्थान / संगठन',
    odiaLabel: 'ଅନୁଷ୍ଠାନ / ସଂଗଠନ',
    description: 'Request multi-worker teams, recurring maintenance contracts, attendance logs & consolidated invoices.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    dashboardPath: '/institution',
  },
  SYSTEM_ADMIN: {
    id: 'SYSTEM_ADMIN',
    label: 'Platform Administrator',
    hindiLabel: 'प्लेटफ़ॉर्म प्रशासक',
    odiaLabel: 'ପ୍ଲାଟଫର୍ମ ପ୍ରଶାସକ',
    description: 'Command center: statewide oversight, cooperative trust approvals, audit logs, dispute escalation & impact analytics.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    dashboardPath: '/admin',
  },
};
