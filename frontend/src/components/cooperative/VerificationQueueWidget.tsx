import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Clock, FileCheck, Award } from 'lucide-react';
import { VerificationQueueItem } from '../../services/cooperativeService';

interface VerificationQueueWidgetProps {
  queue: VerificationQueueItem[];
  isLoading?: boolean;
}

export const VerificationQueueWidget: React.FC<VerificationQueueWidgetProps> = ({ queue, isLoading }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Worker Verification Queue</h3>
            <p className="text-xs text-slate-500">Applications awaiting cooperative officer vetting</p>
          </div>
        </div>
        <Link
          to="/cooperative/verification"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          View All ({queue.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto max-h-80">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading pending verification requests...</div>
        ) : queue.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">All submissions verified. No pending items.</div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-sm transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {item.shram_id}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    {item.trade_group}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mb-1.5">{item.trade} • {item.experience_years} yrs exp</div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    {item.documents_count} ID Docs
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    {item.certifications_count} Certs
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Pending 25m
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/cooperative/verification/${item.id}`}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-sm text-center"
                >
                  Review Dossier
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
