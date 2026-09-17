import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MOCK_WORKERS, 
  MOCK_CATEGORIES, 
  WorkerMock, 
  ServiceCategoryMock 
} from '@/services/customerMockData';
import { customerService } from '@/services/customerService';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { Button } from '@/components/common/Button';
import { Search } from 'lucide-react';

export const WorkersListPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const queryParam = searchParams.get('search') || '';
  const tradeParam = searchParams.get('trade') || 'all';
  const isEmergency = searchParams.get('emergency') === 'true';

  const [search, setSearch] = useState(queryParam);
  const [selectedTrade, setSelectedTrade] = useState(tradeParam);
  const [maxDistance, setMaxDistance] = useState(5.0);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(isEmergency);
  const [workers, setWorkers] = useState<WorkerMock[]>(MOCK_WORKERS);
  const [categories, setCategories] = useState<ServiceCategoryMock[]>(MOCK_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    customerService.getCategories().then((cats) => {
      if (isMounted && cats?.length) setCategories(cats);
    });
    customerService.getWorkers(selectedTrade, undefined, search).then((w) => {
      if (isMounted && w?.length) setWorkers(w);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedTrade, search]);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // 1. Search Query
      const matchSearch = !search.trim() || 
                          worker.name.toLowerCase().includes(search.toLowerCase()) ||
                          worker.trade.toLowerCase().includes(search.toLowerCase()) ||
                          (worker.shramId || '').toLowerCase().includes(search.toLowerCase()) ||
                          (worker.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));

      // 2. Trade Category
      const matchTrade = selectedTrade === 'all' || 
                         worker.tradeCategory === selectedTrade ||
                         worker.trade.toLowerCase().includes(selectedTrade.toLowerCase());

      // 3. Distance
      const matchDistance = (worker.distanceKm || 1.8) <= maxDistance;

      // 4. Rating
      const matchRating = (worker.rating || 4.8) >= minRating;

      // 5. Availability
      const matchAvail = !onlyAvailableNow || worker.isAvailableNow !== false;

      return matchSearch && matchTrade && matchDistance && matchRating && matchAvail;
    });
  }, [workers, search, selectedTrade, maxDistance, minRating, onlyAvailableNow]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
              Verified Cooperative Craftsmen
            </h1>
            {isEmergency && (
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                Emergency Priority Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gov-muted mt-0.5">
            Discover {filteredWorkers.length} background-verified trade workers in your local cluster
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        
        {/* Top Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by partner name, skill, trade, or KARM ID..."
            className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          
          {/* Trade Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Trade Category
            </label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green text-xs"
            >
              <option value="all">All Trade Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Max Distance: <strong className="text-gov-green">{maxDistance} km</strong>
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-green"
            />
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green text-xs"
            >
              <option value="0">Any Rating</option>
              <option value="4.5">4.5★ and above</option>
              <option value="4.8">4.8★ Top Rated</option>
            </select>
          </div>

          {/* Available Now Toggle */}
          <div className="flex items-end">
            <label className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={onlyAvailableNow}
                onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                className="rounded border-slate-300 text-gov-green focus:ring-gov-green"
              />
              <span className="text-xs font-bold text-gov-navy">Available Now Only</span>
            </label>
          </div>

        </div>
      </div>

      {/* Worker Cards Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-gov-navy text-base">
            No craftsmen matched your current filters
          </h3>
          <p className="text-xs text-gov-muted max-w-sm mx-auto">
            Try broadening your maximum distance slider or resetting category filters.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch('');
              setSelectedTrade('all');
              setMaxDistance(10);
              setMinRating(0);
              setOnlyAvailableNow(false);
            }}
            className="text-xs font-bold"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}

    </div>
  );
};
