import React, { useState, useEffect } from 'react';
import { reviewService, WorkerRatingSummaryRecord } from '@/services/reviewService';
import { BadgePill } from '@/components/common/BadgePill';
import { Card } from '@/components/common/Card';
import {
  Star,
  Award,
  ShieldCheck,
  Clock,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export const WorkerRatingsPage: React.FC = () => {
  const [summary, setSummary] = useState<WorkerRatingSummaryRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getWorkerRatingSummary('w-01');
      setSummary(data);
    } catch (err) {
      console.error('Failed to load rating summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading ratings, badges and citizen reviews...
      </div>
    );
  }

  const verificationBadges = summary.badges.filter((b) => b.badge_category === 'VERIFICATION');
  const performanceBadges = summary.badges.filter((b) => b.badge_category === 'PERFORMANCE');

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span>Ratings, Badges & Citizen Feedback</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Public trust standing, verified credentials, and multi-dimensional citizen service reviews.
          </p>
        </div>

        <button
          onClick={fetchSummary}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
        </button>
      </div>

      {/* Ratings Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Star Rating Card */}
        <Card className="p-5 bg-gradient-to-br from-amber-50/60 to-white border-amber-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Rating</span>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="text-4xl font-black text-amber-900">{summary.avg_overall_rating.toFixed(2)}</span>
            <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
          </div>
          <span className="text-[11px] text-slate-600 font-medium block">
            Based on {summary.total_reviews} verified citizen ratings
          </span>
        </Card>

        {/* Completion Rate */}
        <Card className="p-5 bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Rate</span>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="text-4xl font-black text-emerald-800">{summary.completion_rate_pct}%</span>
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-600 font-medium block">
            {summary.total_completed_jobs} completed verified service shifts
          </span>
        </Card>

        {/* Punctuality Rating */}
        <Card className="p-5 bg-gradient-to-br from-blue-50/60 to-white border-blue-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Punctuality Score</span>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="text-4xl font-black text-blue-900">{summary.avg_punctuality.toFixed(1)}/5</span>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-[11px] text-slate-600 font-medium block">
            Arrived within scheduled window
          </span>
        </Card>
      </div>

      {/* 5-Dimensional Rating Scorecard */}
      <Card
        header={
          <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" /> Multi-Dimensional Performance Breakdown
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Workmanship & Craft Quality</span>
              <span className="text-amber-700 font-black">{summary.avg_service_quality.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(summary.avg_service_quality / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Professionalism & Cleanliness</span>
              <span className="text-amber-700 font-black">{summary.avg_professionalism.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(summary.avg_professionalism / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Arrival Timing & Punctuality</span>
              <span className="text-emerald-700 font-black">{summary.avg_punctuality.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${(summary.avg_punctuality / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Communication & Behavior</span>
              <span className="text-blue-700 font-black">{summary.avg_communication.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${(summary.avg_communication / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Segregated Badging Section */}
      <div className="space-y-4">
        {/* Performance Badges */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
                Earned Performance Badges
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click badge for criteria proof</span>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2.5">
            {performanceBadges.map((b) => (
              <BadgePill key={b.id} badge={b} size="md" />
            ))}
          </div>
        </Card>

        {/* Statutory Verification Indicators */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Statutory Verification Indicators
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Clearance & Credentials</span>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2.5">
            {verificationBadges.map((b) => (
              <BadgePill key={b.id} badge={b} size="md" />
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Reviews Feed */}
      <Card
        header={
          <span className="font-extrabold text-sm text-slate-900">
            Recent Citizen Reviews ({summary.recent_reviews.length})
          </span>
        }
      >
        <div className="space-y-4 text-xs">
          {summary.recent_reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-sm">{rev.reviewer_name}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(rev.created_at).toLocaleDateString()} • Verified Citizen Booking
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg font-black text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{rev.overall_rating}.0</span>
                </div>
              </div>

              {rev.comment && (
                <p className="text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>
              )}

              {/* Sub-Dimension Badges */}
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-200/70">
                  Quality: {rev.service_quality || rev.overall_rating}★
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200/70">
                  Prof: {rev.professionalism || rev.overall_rating}★
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200/70">
                  Punctuality: {rev.punctuality || rev.overall_rating}★
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200/70">
                  Communication: {rev.communication || rev.overall_rating}★
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
