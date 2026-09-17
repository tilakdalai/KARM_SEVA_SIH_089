import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Citizens' | 'Seva Partners' | 'Cooperatives' | 'Institutions';
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      category: 'Citizens',
      question: 'How are Seva Partners verified on KARM SEVA?',
      answer: 'Every Seva Partner undergoes multi-tier physical and digital verification through their local registered Labour Cooperative, including Aadhaar KYC, trade certificate/ITI checks, and local police verification records.'
    },
    {
      category: 'Citizens',
      question: 'How does payment work? Are there hidden platform fees?',
      answer: 'No hidden fees. Citizens pay transparent, cooperative-standardized rates via UPI or Razorpay only after the shift is completed satisfactorily. 100% of the core service fee goes directly to the Seva Partner.'
    },
    {
      category: 'Seva Partners',
      question: 'What is a KARM ID and how does it help me?',
      answer: 'A KARM ID (e.g., KS-OD-2024-XXXX) is your verified digital skill passport. It records your verified trade qualifications, on-time completion record, customer ratings, and training certificates, allowing you to carry your professional credibility anywhere.'
    },
    {
      category: 'Seva Partners',
      question: 'Can I choose my preferred working radius and working hours?',
      answer: 'Yes! Unlike private gig apps that force workers into long travel routes with algorithmic penalties, KARM SEVA lets you define your preferred operating radius (e.g. within 3 km or 5 km) and mark your availability freely.'
    },
    {
      category: 'Cooperatives',
      question: 'How do Seva Cooperatives benefit from joining KARM SEVA?',
      answer: 'Registered Cooperatives gain access to a state-of-the-art digital control room for workforce mobilization, automated dispute resolution, transparent revenue tracking, and training academy enrollment without expensive software development.'
    },
    {
      category: 'Institutions',
      question: 'Can institutions book bulk workforce teams for multi-day contracts?',
      answer: 'Yes. Universities, hospitals, municipal bodies, and corporate campuses can dispatch recurring multi-trade workforce teams with automated shift rosters, supervisor check-ins, and consolidated monthly GST invoices.'
    },
    {
      category: 'Citizens',
      question: 'What happens if a Seva Partner falls sick or has an emergency?',
      answer: 'KARM SEVA features an automated Leave & Replacement Protocol. If a Seva Partner requests emergency leave, the local cooperative automatically dispatches an equivalent verified partner so your household or institution faces zero disruption.'
    }
  ];

  const categories = ['All', 'Citizens', 'Seva Partners', 'Cooperatives', 'Institutions'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-16 bg-white border-b border-gov-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <Badge variant="saffron" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Help & Transparency
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted max-w-xl mx-auto">
            Everything you need to know about the KARM SEVA cooperative workforce platform.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HelpCircle className="w-4 h-4 text-gov-green shrink-0" />
                    <span className="font-extrabold text-sm text-gov-navy">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-gov-navy' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gov-muted leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Prompt */}
        <div className="text-center pt-4">
          <p className="text-xs text-gov-muted">
            Have additional questions? Call our National Toll-Free Helpline at{' '}
            <strong className="text-gov-navy">1800-KARM-00</strong> or email{' '}
            <strong className="text-gov-navy">grievance@karmseva.gov.in</strong>
          </p>
        </div>
      </div>
    </section>
  );
};
