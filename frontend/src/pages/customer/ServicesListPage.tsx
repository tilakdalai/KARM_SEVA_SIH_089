import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MOCK_CATEGORIES, 
  MOCK_SERVICES, 
  ServiceCategoryMock, 
  ServiceDetailMock 
} from '@/services/customerMockData';
import { customerService } from '@/services/customerService';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { Card } from '@/components/common/Card';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Star 
} from 'lucide-react';

export const ServicesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategorySlug = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ServiceCategoryMock[]>(MOCK_CATEGORIES);
  const [services, setServices] = useState<ServiceDetailMock[]>(MOCK_SERVICES);

  useEffect(() => {
    let isMounted = true;
    customerService.getCategories().then((cats) => {
      if (isMounted && cats?.length) setCategories(cats);
    });
    customerService.getServices(activeCategorySlug, searchQuery).then((srvs) => {
      if (isMounted && srvs?.length) setServices(srvs);
    });
    return () => {
      isMounted = false;
    };
  }, [activeCategorySlug, searchQuery]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cat.hindiTitle?.includes(searchQuery);
      return matchSearch;
    });
  }, [categories, searchQuery]);

  // Filter detailed services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchCategory = activeCategorySlug === 'all' || 
                            categories.find(c => c.id === srv.categoryId)?.slug === activeCategorySlug ||
                            (srv as any).categorySlug === activeCategorySlug;
      const matchSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.overview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [categories, services, activeCategorySlug, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
          All Cooperative Service Categories
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Transparent standard rate cards backed by cooperative craftsmanship and 30-day warranty
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific repair, maintenance or caregiver need..."
            className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-gov-green shadow-xs"
          />
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setSearchParams({})}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeCategorySlug === 'all'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories (12)
        </button>

        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSearchParams({ category: cat.slug })}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeCategorySlug === cat.slug
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.title} ({cat.availableWorkers})
          </button>
        ))}
      </div>

      {/* Detailed Specific Packages Section (if match) */}
      {filteredServices.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gov-green" />
            <span>Popular Standard Packages</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((srv) => (
              <Card
                key={srv.id}
                onClick={() => navigate(`/customer/services/${srv.slug}`)}
                className="p-4 sm:p-5 border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer bg-white group overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={srv.bannerImage}
                    alt={srv.title}
                    className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0 border border-slate-100 group-hover:scale-102 transition-transform"
                  />

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.2 rounded">
                        {srv.categoryName}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{srv.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-black text-sm text-gov-navy group-hover:text-gov-green transition-colors leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gov-muted line-clamp-2 leading-relaxed">
                      {srv.tagline}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{srv.estimatedDuration}</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] text-gov-muted">Fixed:</span>
                        <span className="font-black text-base text-gov-navy">₹{srv.standardPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base font-extrabold text-gov-navy">
          Trade Categories Directory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <ServiceCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

    </div>
  );
};
