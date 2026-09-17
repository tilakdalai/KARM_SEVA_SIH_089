export type UserRole = 
  | 'CUSTOMER'
  | 'WORKER'
  | 'COOPERATIVE_ADMIN'
  | 'INSTITUTION'
  | 'SYSTEM_ADMIN';

export interface RoleConfig {
  id: UserRole;
  label: string;
  hindiLabel: string;
  odiaLabel: string;
  description: string;
  badgeColor: string;
  dashboardPath: string;
}
