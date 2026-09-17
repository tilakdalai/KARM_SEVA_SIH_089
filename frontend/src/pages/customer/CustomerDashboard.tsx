import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Search, MapPin, Sparkles, Clock, HeartHandshake } from 'lucide-react';
import { analyticsService, CustomerAnalyticsResponse } from '@/services/analyticsService';

export const CustomerDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<CustomerAnalyticsResponse | null>(null);

  useEffect(() => {
    const loadCustomerAnalytics = async () => {
      try {
        const res = await analyticsService.getCustomerAnalytics({ time_range: '30d' });
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load customer analytics', err);
      }
    };
    loadCustomerAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-gov-navy to-slate-900 text-white rounded-gov-lg p-6 shadow-gov-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location: Nayapalli, Bhubaneswar · 751012</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">Citizen Service Workspace</h1>
            <p className="text-xs text-slate-300 mt-1">
              Discover verified cooperative workers with explainable multi-factor matching.
            </p>
          </div>
          <Badge variant="saffron" size="md">
            Role: Citizen / Customer
          </Badge>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search service e.g. 'Emergency Electrician', 'Deep Cleaner', 'Plumber'..."
              className="w-full bg-white/10 text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-lg border border-white/20 text-xs focus:outline-none focus:bg-white/20"
            />
          </div>
          <Button leftIcon={<Sparkles className="w-4 h-4" />}>
            Find Matched Workers
          </Button>
        </div>
      </div>

      {/* Metrics Row (Minimal Citizen Analytics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Nearby Verified Workers</span>
          <p className="text-2xl font-black text-gov-navy mt-1">18</p>
          <span className="text-[10px] text-emerald-600 font-bold">Within 4.0 km radius</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Active Bookings</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{analytics?.active_bookings ?? 1}</p>
          <span className="text-[10px] text-blue-700 font-bold">Worker En Route</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Completed Services</span>
          <p className="text-2xl font-black text-gov-green mt-1">{analytics?.completed_bookings ?? 12}</p>
          <span className="text-[10px] text-slate-500">All verified invoices</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-gov-muted">Total Spent (30 Days)</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{analytics?.total_spent ?? 4850}</p>
          <span className="text-[10px] text-emerald-700 font-bold">0% Middleman Fees</span>
        </Card>
      </div>

      {/* Frequent Services & Fair Wage Guarantee Card */}
      {analytics?.favorite_services && analytics.favorite_services.length > 0 && (
        <Card
          header={
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-gov-navy flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Your Frequent Services & Fair Price Transparency</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Direct to Cooperative
              </span>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">Top Requested:</span>
              {analytics.favorite_services.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {item.name} ({item.value} bookings)
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              100% of your service payments are held in verified escrow and released directly to the artisan upon work OTP verification.
            </p>
          </div>
        </Card>
      )}

      {/* Active Service Status Card */}
      <Card
        header={
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-gov-green" />
              <span>Current Booking Lifecycle (Demo Instance)</span>
            </span>
            <Badge variant="success" size="sm">ON THE WAY (2.1 km)</Badge>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-gov-navy text-sm">Gopal Nayak · Electrical Maintenance</p>
              <p className="text-gov-muted mt-0.5">Bhubaneswar Multi-Purpose Labour Cooperative</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="info" size="sm">Cooperative Verified</Badge>
                <Badge variant="neutral" size="sm">Rating: 4.8★ (92 Jobs)</Badge>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 text-right">
              <span className="text-[11px] text-gov-muted">Estimated Fare:</span>
              <p className="font-black text-base text-gov-navy">₹350</p>
              <span className="text-[10px] text-gov-green font-bold">Post-Shift Razorpay Protected</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
