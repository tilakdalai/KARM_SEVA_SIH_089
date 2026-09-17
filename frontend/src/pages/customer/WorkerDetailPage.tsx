import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS, WorkerMock } from '@/services/customerMockData';
import { customerService } from '@/services/customerService';
import { reviewService, BadgeRecord } from '@/services/reviewService';
import { BadgePill } from '@/components/common/BadgePill';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  FileCheck2, 
  Image as ImageIcon, 
  Calendar, 
  Lock, 
  MessageSquare 
} from 'lucide-react';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fallbackWorker: WorkerMock = MOCK_WORKERS.find((w) => w.id === id) || MOCK_WORKERS[0];
  const [worker, setWorker] = useState<WorkerMock>(fallbackWorker);
  const [isSavedFavourite, setIsSavedFavourite] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Today, 2:30 PM');
  const [badges, setBadges] = useState<BadgeRecord[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      customerService.getWorkerDetail(id).then((w) => {
        if (isMounted && w) setWorker(w);
      });
      reviewService.getWorkerBadges(id).then((b) => {
        if (isMounted && b) setBadges(b);
      }).catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const totalReviewsCount = Object.values(worker.ratingsBreakdown || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Craftsmen List</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSavedFavourite(!isSavedFavourite)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            isSavedFavourite
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSavedFavourite ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isSavedFavourite ? 'Saved in Favourites' : 'Save to Favourites'}</span>
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-white border border-gov-border shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Avatar & Basic Info */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-md">
                <img 
                  src={worker.photo} 
                  alt={worker.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {worker.isVerified && (
                <div 
                  className="absolute -bottom-2 -right-2 bg-gov-green text-white p-1.5 rounded-full border-4 border-white shadow-sm"
                  title="Police & Cooperative Verified"
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
                    {worker.name}
                  </h1>
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {worker.shramId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gov-muted mt-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{worker.trade}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-600 font-medium">{worker.cooperativeName}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {worker.bio}
              </p>

              {/* Metrics Pill Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-sm">{worker.rating.toFixed(1)}</span>
                  <span className="text-slate-500 font-normal">({worker.totalReviews} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-gov-green" />
                  <span>{worker.totalJobs} Jobs Completed</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>{worker.experienceYears}+ Years Trade Experience</span>
                </div>
              </div>

              {/* Verification & Performance Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {badges.length > 0 ? (
                  badges.map((b) => (
                    <BadgePill key={b.id} badge={b} size="sm" />
                  ))
                ) : (
                  <>
                    {worker.verificationBadges.map((badge, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-gov-green" />
                        <span>{badge}</span>
                      </span>
                    ))}
                    {worker.reviewBadges.map((badge, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200"
                      >
                        <span>★ {badge}</span>
                      </span>
                    ))}
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Right: Booking Action Box */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gov-muted block">
                  Cooperative Standard Rate
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-gov-navy">
                    ₹{worker.startingRate}
                  </span>
                  <span className="text-xs text-gov-muted">
                    {worker.rateUnit ? `/ ${worker.rateUnit}` : ''}
                  </span>
                </div>
                <span className="text-[10px] text-gov-green font-bold block mt-1">
                  ✓ 100% direct payout to craftsman post-shift
                </span>
              </div>

              {/* Availability Status */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700">Service Proximity</span>
                  <span className="text-gov-green">{worker.distanceKm} km away</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Next Earliest Slot:</span>
                  <span className="font-bold text-gov-navy">{worker.nextSlot || 'Available Today'}</span>
                </div>
              </div>

              {/* Main Booking Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsBookModalOpen(true)}
                className="w-full text-xs sm:text-sm font-black shadow-md py-3"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Book This Craftsman
              </Button>

              {/* Trust Safeguards */}
              <div className="space-y-1.5 text-[10px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-green shrink-0" />
                  <span>Cooperative Replacement Guard Enabled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Identity Documents Masked & Police Verified</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Skills, Certifications & Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Skills & Certifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Trade Skills */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Briefcase className="w-4 h-4 text-gov-green" /> Verified Trade Competencies</span>}>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Government / Skill India Certifications */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><FileCheck2 className="w-4 h-4 text-blue-600" /> Accreditation & Certifications</span>}>
            <div className="space-y-3">
              {worker.certificates.map((cert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-gov-navy">
                      {cert.name}
                    </h4>
                    <p className="text-[11px] text-gov-muted">
                      Issuer: <strong>{cert.issuer}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                    Year: {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio Photos */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><ImageIcon className="w-4 h-4 text-purple-600" /> Recent Work Portfolio</span>}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {worker.portfolio.map((item, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 space-y-1.5 pb-2">
                  <div className="h-28 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="px-2">
                    <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 uppercase">
                      {item.tag}
                    </span>
                    <p className="font-bold text-[11px] text-gov-navy mt-1 truncate">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Column: Service Radius & Ratings Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Service Radius Visual */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><MapPin className="w-4 h-4 text-gov-green" /> Service Cluster Radius</span>}>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Operates within:</span>
                <span className="font-black text-emerald-800 text-sm">{worker.serviceRadiusKm} km local radius</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Designated Local Localities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {worker.serviceAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Ratings Breakdown */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Customer Ratings Breakdown</span>}>
            <div className="space-y-2 text-xs">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = worker.ratingsBreakdown[stars as keyof typeof worker.ratingsBreakdown] || 0;
                const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-6 font-bold text-slate-700 text-right">{stars}★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <span className="w-8 text-[11px] text-slate-400 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-600" /> Verified Citizen Reviews</span>}>
            <div className="space-y-3">
              {worker.recentReviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-gov-navy">{rev.userName}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span className="font-medium text-slate-500">{rev.tradeTag}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

      {/* Booking Confirmation / Schedule Modal Preview */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gov-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <img src={worker.photo} alt={worker.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                <div>
                  <h3 className="font-extrabold text-sm text-gov-navy">Book {worker.name}</h3>
                  <p className="text-xs text-gov-muted">{worker.trade} · #{worker.shramId}</p>
                </div>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Today, 2:30 PM', 'Today, 4:30 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg text-left text-xs font-bold border transition-all ${
                        selectedSlot === slot
                          ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      📅 {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gov-muted">Standard Visit Charge:</span>
                  <span className="font-bold text-gov-navy">₹{worker.startingRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted">Cooperative Guarantee & Insurance:</span>
                  <span className="font-bold text-emerald-700">₹25</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-sm">
                  <span>Total Payable Post-Shift:</span>
                  <span className="text-gov-navy">₹{worker.startingRate + 25}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1 py-2.5 text-xs font-bold"
                onClick={() => {
                  setIsBookModalOpen(false);
                  navigate('/customer/bookings');
                }}
              >
                Confirm & Request Job
              </Button>
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => setIsBookModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
