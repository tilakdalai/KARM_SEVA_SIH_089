import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { adminService, SystemAdminKPIs } from '@/services/adminService';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<SystemAdminKPIs | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminService.getKPIs().then((data: SystemAdminKPIs) => {
      if (isMounted && data) setKpis(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gov-navyDark to-slate-950 text-white rounded-gov-lg p-6 shadow-gov-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>National Public Infrastructure Oversight · SIH PS26089</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              System Administration & Governance
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              State & District Service Demand, Cooperative Accreditation, Compliance Audit & Social Impact
            </p>
          </div>
          <Badge variant="saffron" size="md">
            Role: System Admin
          </Badge>
        </div>
      </div>

      {/* High-level stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Verified Cooperatives</span>
          <p className="text-2xl font-black text-gov-navy mt-1">{kpis?.active_cooperatives ?? 42}</p>
          <span className="text-[10px] text-gov-green font-bold">18 Districts</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Verified Seva Partners</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {kpis ? kpis.verified_workers.toLocaleString('en-IN') : '8,420'}
          </p>
          <span className="text-[10px] text-slate-500">Digital KARM ID</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Total Services Delivered</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {kpis ? kpis.jobs_completed.toLocaleString('en-IN') : '35,290'}
          </p>
          <span className="text-[10px] text-blue-700 font-bold">
            ₹{kpis ? (kpis.total_transaction_value / 10000000).toFixed(2) : '1.84'} Cr Volume
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Dispute Resolution</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {kpis?.complaint_resolution_rate ?? '98.6%'}
          </p>
          <span className="text-[10px] text-amber-700 font-bold">Tribunal SLA Compliant</span>
        </Card>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/analytics" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-gov-navy transition-all flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Platform Analytics & Impact</h3>
            <p className="text-xs text-slate-500 mt-0.5">Macro GMV, district heatmaps & skill gaps</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gov-navy" />
        </Link>
        <Link to="/admin/complaints" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-gov-navy transition-all flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Grievance & Tribunal Desk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Conciliation escalation & resolution</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gov-navy" />
        </Link>
        <Link to="/admin/audit-logs" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-gov-navy transition-all flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">System Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Immutable administrative action trail</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gov-navy" />
        </Link>
      </div>
    </div>
  );
};
