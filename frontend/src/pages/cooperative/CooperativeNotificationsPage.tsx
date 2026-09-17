import React, { useState } from 'react';
import {
  Send,
  Radio,
} from 'lucide-react';

export const CooperativeNotificationsPage: React.FC = () => {
  const [broadcastTarget, setBroadcastTarget] = useState('ALL_WORKERS');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const pastBroadcasts = [
    {
      id: 'BC-01',
      title: 'Monsoon Safety Advisory: Rubber Boots & Insulated Gloves Required',
      target: 'All Electricians & Plumbers',
      date: 'Yesterday, 04:00 PM',
      readRate: '94.2% (234 Workers)',
    },
    {
      id: 'BC-02',
      title: 'Skill India Solar PV Free Training Batch Starting Monday',
      target: 'Group A Electricians',
      date: '28 Aug 2024',
      readRate: '88.5% (46 Workers)',
    },
    {
      id: 'BC-03',
      title: 'Odisha State Minimum Wage Gazette 2024 Upward Revision',
      target: 'All Union Members',
      date: '24 Aug 2024',
      readRate: '98.1% (243 Workers)',
    },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTitle || !messageBody) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      alert(`Broadcast sent to ${broadcastTarget}! Multilingual SMS & App notifications triggered.`);
      setMessageTitle('');
      setMessageBody('');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Broadcast & Emergency Advisory Center
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
              Multilingual SMS / Push Gateway
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Dispatch trade advisories, weather alerts, state gazette updates, and emergency union notices directly to members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Broadcast */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Send className="w-4 h-4 text-amber-600" />
            <span>Compose Multilingual Broadcast Message</span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience *
              </label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="ALL_WORKERS">All Enrolled Workers (248 Members)</option>
                <option value="ONLINE_WORKERS">Currently Online Workers (142 Members)</option>
                <option value="ELECTRICIANS">All Electricians (Group A)</option>
                <option value="PLUMBERS">All Plumbers (Group B)</option>
                <option value="CAREGIVERS">All Caregivers (Group A & B)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Advisory Title / Heading *
              </label>
              <input
                type="text"
                required
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                placeholder="e.g. Cyclone Warning: Outdoor Electrical Maintenance Suspended"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Body (Auto-translated to Odia & Hindi) *
              </label>
              <textarea
                rows={4}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Type advisory text. Voice note fallback will automatically generate for non-literate members..."
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                {isSending ? 'Transmitting to SMS/App...' : 'Transmit Broadcast to Union'}
              </button>
            </div>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Recent Broadcast Log
          </div>
          <div className="space-y-3">
            {pastBroadcasts.map((b) => (
              <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{b.title}</div>
                <div className="text-[11px] text-slate-500">Target: <strong>{b.target}</strong></div>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>{b.date}</span>
                  <span className="font-bold text-emerald-700">✓ {b.readRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
