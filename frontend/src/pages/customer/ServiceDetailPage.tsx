import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MOCK_SERVICES, 
  MOCK_WORKERS, 
  ServiceDetailMock, 
  WorkerMock 
} from '@/services/customerMockData';
import { customerService } from '@/services/customerService';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowLeft, 
  Users, 
  Calendar 
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fallbackService = MOCK_SERVICES.find((s) => s.slug === id || s.id === id) || MOCK_SERVICES[0];
  const [service, setService] = useState<ServiceDetailMock>(fallbackService);
  const [matchedWorkers, setMatchedWorkers] = useState<WorkerMock[]>(MOCK_WORKERS);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      customerService.getServiceDetail(id).then((srv) => {
        if (isMounted && srv) setService(srv);
      });
      customerService.getServiceWorkers(id).then((w) => {
        if (isMounted && w?.length) setMatchedWorkers(w);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-8 pb-14">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services</span>
      </button>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-white border border-gov-border shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {service.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{service.rating} ({service.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="text-xs sm:text-sm text-gov-muted leading-relaxed">
              {service.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Clock className="w-4 h-4 text-gov-green" />
                <span>Est. Duration: {service.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-gov-green" />
                <span>30-Day Cooperative Warranty</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking Card Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gov-muted block">
                  Standard Rate Card
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-gov-navy">
                    ₹{service.standardPrice}
                  </span>
                  <span className="text-xs text-gov-muted font-medium">/ service visit</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                  Cooperative Transparent Wage Guarantee
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(`/customer/workers?trade=${service.categoryId.replace('cat-', '')}`)}
                className="w-full text-xs sm:text-sm font-extrabold shadow-md py-3"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Choose Verified Worker
              </Button>

              <p className="text-[10px] text-gov-muted leading-tight">
                No advance payment required. Escrow payment released post-shift approval.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Inclusions & Exclusions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Inclusions */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gov-green" /> What is Included</span>}>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {service.inclusions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-gov-green font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Exclusions */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> What is Excluded</span>}>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {service.exclusions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

      </div>

      {/* Matched Available Workers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-gov-green" />
              <span>Available {service.categoryName}s Nearby</span>
            </h2>
            <p className="text-xs text-gov-muted">
              Select your preferred certified craftsman for this service
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-2.5">
          {service.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-extrabold text-xs text-gov-navy">
                Q: {faq.question}
              </h4>
              <p className="text-xs text-gov-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
