import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS, NotificationMock } from '@/services/customerMockData';
import { Card } from '@/components/common/Card';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const getNotificationIcon = (type: NotificationMock['type']) => {
    switch (type) {
      case 'ETA': return <Clock className="w-5 h-5 text-emerald-600" />;
      case 'BOOKING': return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'PAYMENT': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'COOPERATIVE': return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'SYSTEM': default: return <ShieldCheck className="w-5 h-5 text-slate-700" />;
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 pb-14 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-gov-green" />
            <span>Messages & Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Live dispatch alerts, arrival ETAs, wage transparency receipts & system notices
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="text-xs font-bold text-gov-greenDark hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            filter === 'UNREAD'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Unread Only ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            onClick={() => {
              if (item.actionUrl) navigate(item.actionUrl);
            }}
            className={`p-4 border transition-all ${
              item.actionUrl ? 'cursor-pointer hover:border-gov-green hover:shadow-xs' : ''
            } ${
              !item.read ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-sm text-gov-navy">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gov-muted leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block pt-1">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {item.actionUrl && (
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
              )}
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
