import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Download,
  Calendar,
} from 'lucide-react';
import { institutionService, AttendanceRecord } from '../../services/institutionService';

export const InstitutionAttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState('2024-09-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await institutionService.getAttendance();
        setAttendance(data);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  const filtered = attendance.filter(
    (a) =>
      a.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.worker_shram_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.trade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Compliance Telemetry
            </span>
            <span className="text-xs text-slate-500 font-medium">Daily Muster Roll</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Daily Attendance & Punch Logs</h1>
          <p className="text-xs text-slate-500">
            Geofence verified biometric and GPS punch-ins across AIIMS campus zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <button
            onClick={() => alert('Downloading signed attendance certificate PDF...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Muster PDF</span>
          </button>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Muster Roll Strength</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">28 Staff</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across 4 shifts</div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Present & Verified</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">27 Present</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">96.4% Compliance</div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Cooperative Substitutes</div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">1 Deployed</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Automatic Union Backup</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Geofence Compliance</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">100% Valid</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Campus perimeter locked</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search attendance by personnel name, trade, or KARM ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Personnel / KARM ID</th>
                  <th className="py-2.5 px-3">Trade</th>
                  <th className="py-2.5 px-3">Punch In</th>
                  <th className="py-2.5 px-3">Punch Out</th>
                  <th className="py-2.5 px-3">GPS Geofence</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{att.worker_name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{att.worker_shram_id}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{att.trade}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">{att.punch_in_time}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{att.punch_out_time}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        Campus Geofence Verified
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {att.status === 'PRESENT' ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          PRESENT
                        </span>
                      ) : (
                        <div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                            SUBSTITUTE
                          </span>
                          {att.substitute_worker_name && (
                            <div className="text-[10px] text-slate-500 mt-0.5">{att.substitute_worker_name}</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
