import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Briefcase,
  CheckCircle2,
  Navigation,
  UserCheck,
  Sparkles,
  CreditCard,
  RefreshCw,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Landmark,
  GraduationCap,
  Info,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  notificationService,
  NotificationItem,
  NotificationType,
} from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll unread count every 30 seconds if authenticated
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (isMounted) setUnreadCount(count);
      } catch {
        // Silently skip on network error
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  // Load notifications when dropdown opens or filter changes
  useEffect(() => {
    if (!isOpen || !user) return;

    let isMounted = true;
    const loadList = async () => {
      setIsLoading(true);
      try {
        const res = await notificationService.getNotifications(filterUnreadOnly, 30, 0);
        if (isMounted) {
          setNotifications(res.notifications);
          setUnreadCount(res.unread_count);
        }
      } catch {
        // Handled
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadList();
    return () => {
      isMounted = false;
    };
  }, [isOpen, filterUnreadOnly, user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (linkUrl) {
        setIsOpen(false);
        navigate(linkUrl);
      }
    } catch {
      // Handled
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Handled
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'JOB_REQUEST':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'JOB_ACCEPTED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'WORKER_ON_THE_WAY':
        return <Navigation className="w-4 h-4 text-amber-500" />;
      case 'WORKER_ARRIVED':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'JOB_COMPLETED':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'REPLACEMENT':
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'LEAVE':
        return <Calendar className="w-4 h-4 text-slate-600" />;
      case 'COMPLAINT':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'VERIFICATION':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'SETTLEMENT':
        return <Landmark className="w-4 h-4 text-indigo-600" />;
      case 'TRAINING':
        return <GraduationCap className="w-4 h-4 text-teal-600" />;
      case 'SYSTEM':
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Notifications Center"
        aria-expanded={isOpen}
        className="relative p-2 rounded-xl text-slate-600 hover:text-gov-navy hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-green"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gov-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-gov-navy uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px]">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-gov-greenDark hover:underline px-2 py-1 rounded hover:bg-emerald-50"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-3.5 py-1.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex space-x-1">
              <button
                onClick={() => setFilterUnreadOnly(false)}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  !filterUnreadOnly
                    ? 'bg-slate-100 text-gov-navy'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterUnreadOnly(true)}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  filterUnreadOnly
                    ? 'bg-slate-100 text-gov-navy'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-time alerts</span>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">
                  {filterUnreadOnly ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Updates on service dispatches, verified earnings, and leaves will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item.id, item.link_url)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                    item.is_read
                      ? 'bg-white hover:bg-slate-50 opacity-80'
                      : 'bg-emerald-50/40 hover:bg-emerald-50/80 font-medium'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs leading-tight truncate ${
                          item.is_read ? 'text-slate-700 font-semibold' : 'text-slate-900 font-bold'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    {item.link_url && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gov-greenDark font-bold mt-1">
                        <span>View Details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
