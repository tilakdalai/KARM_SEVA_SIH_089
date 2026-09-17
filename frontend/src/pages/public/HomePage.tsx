import React, { useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatIsKarmSeva } from '@/components/landing/WhatIsKarmSeva';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PopularCategories } from '@/components/landing/PopularCategories';
import { TrustedPartnersSection } from '@/components/landing/TrustedPartnersSection';
import { ForCitizensSection } from '@/components/landing/ForCitizensSection';
import { ForWorkersSection } from '@/components/landing/ForWorkersSection';
import { ForCooperativesSection } from '@/components/landing/ForCooperativesSection';
import { ForInstitutionsSection } from '@/components/landing/ForInstitutionsSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { TransparentRevenueSection } from '@/components/landing/TransparentRevenueSection';
import { CommunityImpactSection } from '@/components/landing/CommunityImpactSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ServiceSearchModal } from '@/components/landing/ServiceSearchModal';

export const HomePage: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Bhubaneswar, Odisha');
  const [timingQuery, setTimingQuery] = useState('today');

  const handleHeroSearch = (trade: string, location: string, timing: string) => {
    setSearchQuery(trade);
    setLocationQuery(location);
    setTimingQuery(timing);
    setIsSearchModalOpen(true);
  };

  const handleCategorySelect = (_categoryKey: string, categoryTitle: string) => {
    setSearchQuery(categoryTitle);
    setIsSearchModalOpen(true);
  };

  return (
    <div className="space-y-0 pb-0">
      {/* 1. Hero Section with Search UI */}
      <HeroSection onSearch={handleHeroSearch} />

      {/* 2. What is KARM SEVA? */}
      <WhatIsKarmSeva />

      {/* 3. 6-Step How KARM SEVA Works */}
      <HowItWorks />

      {/* 4. 12 Popular Service Categories */}
      <PopularCategories onSelectCategory={handleCategorySelect} />

      {/* 5. Trusted Seva Partners Showcase */}
      <TrustedPartnersSection />

      {/* 6. For Citizens */}
      <ForCitizensSection />

      {/* 7. For Workers (Seva Partners) */}
      <ForWorkersSection />

      {/* 8. For Cooperatives (Seva Cooperatives) */}
      <ForCooperativesSection />

      {/* 9. For Institutions */}
      <ForInstitutionsSection />

      {/* 10. Trust Architecture & Digital KARM ID Preview */}
      <TrustSection />

      {/* 11. Secure Payments & Transparent Revenue (85/10/5 Statutory Split) */}
      <TransparentRevenueSection />

      {/* 12. Community Impact */}
      <CommunityImpactSection />

      {/* 13. Frequently Asked Questions */}
      <FAQSection />

      {/* Search & Match Result Modal */}
      <ServiceSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        location={locationQuery}
        timing={timingQuery}
      />
    </div>
  );
};

