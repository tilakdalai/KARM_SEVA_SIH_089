import { apiClient } from './api';
import {
  MOCK_CATEGORIES,
  MOCK_SERVICES,
  MOCK_WORKERS,
  ServiceCategoryMock,
  ServiceDetailMock,
  WorkerMock,
} from './customerMockData';

function normalizeCategory(raw: any): ServiceCategoryMock {
  const fallback = MOCK_CATEGORIES.find((c) => c.id === raw.id || c.slug === raw.slug) || MOCK_CATEGORIES[0];
  return {
    id: raw.id || fallback.id,
    slug: raw.slug || fallback.slug,
    title: raw.title || fallback.title,
    hindiTitle: raw.hindiTitle || raw.hindi_title || fallback.hindiTitle,
    odiaTitle: raw.odiaTitle || raw.odia_title || fallback.odiaTitle,
    iconName: raw.iconName || raw.icon || fallback.iconName,
    startingPrice: raw.startingPrice || raw.starting_price || fallback.startingPrice,
    availableWorkers: raw.availableWorkers || raw.active_workers || fallback.availableWorkers,
    popular: raw.popular ?? fallback.popular ?? false,
    shortDesc: raw.shortDesc || raw.short_desc || fallback.shortDesc,
    color: raw.color || fallback.color || 'blue',
  };
}

function normalizeService(raw: any): ServiceDetailMock {
  const fallback = MOCK_SERVICES.find((s) => s.id === raw.id || s.slug === raw.slug) || MOCK_SERVICES[0];
  return {
    id: raw.id || fallback.id,
    slug: raw.slug || fallback.slug,
    categoryId: raw.categoryId || raw.category_id || fallback.categoryId,
    categoryName: raw.categoryName || raw.category_name || fallback.categoryName,
    title: raw.title || fallback.title,
    tagline: raw.tagline || raw.overview || fallback.tagline,
    bannerImage: raw.bannerImage || raw.banner_image || fallback.bannerImage,
    standardPrice: raw.standardPrice || raw.base_price || fallback.standardPrice,
    estimatedDuration: raw.estimatedDuration || (raw.estimated_duration_mins ? `${raw.estimated_duration_mins} mins` : fallback.estimatedDuration),
    rating: typeof raw.rating === 'number' ? raw.rating : (fallback.rating || 4.8),
    reviewsCount: raw.reviewsCount || raw.total_reviews || fallback.reviewsCount || 48,
    overview: raw.overview || fallback.overview,
    inclusions: Array.isArray(raw.inclusions) && raw.inclusions.length > 0 ? raw.inclusions : fallback.inclusions,
    exclusions: Array.isArray(raw.exclusions) && raw.exclusions.length > 0 ? raw.exclusions : fallback.exclusions,
    safetyGuarantees: Array.isArray(raw.safetyGuarantees) && raw.safetyGuarantees.length > 0 ? raw.safetyGuarantees : fallback.safetyGuarantees,
    faqs: Array.isArray(raw.faqs) && raw.faqs.length > 0 ? raw.faqs : fallback.faqs,
    matchedWorkerIds: Array.isArray(raw.matchedWorkerIds) && raw.matchedWorkerIds.length > 0 ? raw.matchedWorkerIds : fallback.matchedWorkerIds,
  };
}

function normalizeWorker(raw: any): WorkerMock {
  const fallback = MOCK_WORKERS.find(
    (w) => w.id === raw.id || w.shramId === (raw.shram_id || raw.shramId) || w.trade.toLowerCase() === (raw.trade || '').toLowerCase()
  ) || MOCK_WORKERS[0];

  return {
    id: raw.id || fallback.id,
    name: raw.name || fallback.name,
    photo: raw.photo || raw.profile_photo || fallback.photo,
    shramId: raw.shram_id || raw.shramId || fallback.shramId,
    trade: raw.trade || fallback.trade,
    tradeCategory: raw.trade_category || raw.tradeCategory || fallback.tradeCategory || 'Technical & Maintenance',
    cooperativeName: raw.cooperative_name || raw.cooperativeName || fallback.cooperativeName,
    rating: typeof raw.rating === 'number' ? raw.rating : (fallback.rating || 4.8),
    totalReviews: raw.total_reviews || raw.totalReviews || fallback.totalReviews || 45,
    totalJobs: raw.total_jobs || raw.totalJobs || fallback.totalJobs || 52,
    experienceYears: raw.experience_years || raw.experienceYears || fallback.experienceYears || 5,
    distanceKm: typeof raw.distance_km === 'number' ? raw.distance_km : (typeof raw.distanceKm === 'number' ? raw.distanceKm : (fallback.distanceKm || 2.4)),
    startingRate: raw.hourly_rate || raw.startingRate || raw.base_price || fallback.startingRate || 250,
    rateUnit: raw.rate_unit || raw.rateUnit || fallback.rateUnit || 'hr',
    isVerified: raw.is_cooperative_verified ?? raw.isVerified ?? fallback.isVerified ?? true,
    verificationBadges: Array.isArray(raw.verification_badges) ? raw.verification_badges : (Array.isArray(raw.verificationBadges) ? raw.verificationBadges : (fallback.verificationBadges || ['Cooperative Verified', 'Police Cleared'])),
    reviewBadges: Array.isArray(raw.review_badges) ? raw.review_badges : (Array.isArray(raw.reviewBadges) ? raw.reviewBadges : (fallback.reviewBadges || ['Top Rated', 'Punctual'])),
    isAvailableNow: raw.is_online ?? raw.isAvailableNow ?? fallback.isAvailableNow ?? true,
    nextSlot: raw.next_slot || raw.nextSlot || fallback.nextSlot || 'Today, within 2h',
    bio: raw.bio || fallback.bio || 'Verified trade craftsman backed by district labour cooperative.',
    skills: Array.isArray(raw.skills) && raw.skills.length > 0 ? raw.skills : (fallback.skills || ['General Trade Maintenance']),
    certificates: Array.isArray(raw.certifications) 
      ? raw.certifications.map((c: any) => ({ name: c.name || c.certificate_name, issuer: c.authority || c.issuing_authority || 'State Board', year: String(c.year || c.issue_year || '2022') }))
      : (Array.isArray(raw.certificates) ? raw.certificates : fallback.certificates),
    portfolio: Array.isArray(raw.portfolio) && raw.portfolio.length > 0 ? raw.portfolio : fallback.portfolio,
    ratingsBreakdown: raw.ratings_breakdown || raw.ratingsBreakdown || fallback.ratingsBreakdown || { 5: 35, 4: 8, 3: 2, 2: 0, 1: 0 },
    recentReviews: Array.isArray(raw.recent_reviews) ? raw.recent_reviews : (Array.isArray(raw.recentReviews) ? raw.recentReviews : fallback.recentReviews),
    serviceRadiusKm: raw.service_radius_km || raw.serviceRadiusKm || raw.work_radius_km || fallback.serviceRadiusKm || 4.0,
    serviceAreas: Array.isArray(raw.service_areas) ? raw.service_areas : (Array.isArray(raw.serviceAreas) ? raw.serviceAreas : fallback.serviceAreas || ['Bhubaneswar City', 'Patia', 'Nayapalli']),
  };
}

export const customerService = {
  async getCategories(): Promise<ServiceCategoryMock[]> {
    try {
      const response = await apiClient.get('/services/categories');
      if (response.data?.data?.categories?.length) {
        return response.data.data.categories.map(normalizeCategory);
      }
    } catch {
      // Fallback to rich mock categories
    }
    return MOCK_CATEGORIES.map(normalizeCategory);
  },

  async getServices(categorySlug?: string, search?: string): Promise<ServiceDetailMock[]> {
    try {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== 'all') params.append('category', categorySlug);
      if (search) params.append('search', search);

      const response = await apiClient.get(`/services?${params.toString()}`);
      if (response.data?.data?.services?.length) {
        return response.data.data.services.map(normalizeService);
      }
    } catch {
      // Fallback
    }

    let filtered = MOCK_SERVICES;
    if (categorySlug && categorySlug !== 'all') {
      const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
      if (category) {
        filtered = filtered.filter((s) => s.categoryId === category.id);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) => s.title.toLowerCase().includes(q) || s.overview.toLowerCase().includes(q)
      );
    }
    return filtered.map(normalizeService);
  },

  async getServiceDetail(serviceId: string): Promise<ServiceDetailMock> {
    try {
      const response = await apiClient.get(`/services/${serviceId}`);
      if (response.data?.data?.service) {
        return normalizeService(response.data.data.service);
      }
    } catch {
      // Fallback
    }
    const found = MOCK_SERVICES.find((s) => s.id === serviceId);
    return normalizeService(found || MOCK_SERVICES[0]);
  },

  async getServiceWorkers(serviceId: string): Promise<WorkerMock[]> {
    try {
      const response = await apiClient.get(`/services/${serviceId}/workers`);
      if (response.data?.data?.workers?.length) {
        return response.data.data.workers.map(normalizeWorker);
      }
    } catch {
      // Fallback
    }
    return MOCK_WORKERS.map(normalizeWorker);
  },

  async getWorkers(trade?: string, district?: string, search?: string): Promise<WorkerMock[]> {
    try {
      const params = new URLSearchParams();
      if (trade && trade !== 'all') params.append('trade', trade);
      if (district && district !== 'all') params.append('district', district);
      if (search) params.append('search', search);

      const response = await apiClient.get(`/workers?${params.toString()}`);
      if (response.data?.data?.workers?.length) {
        return response.data.data.workers.map(normalizeWorker);
      }
    } catch {
      // Fallback
    }
    return MOCK_WORKERS.map(normalizeWorker);
  },

  async getWorkerDetail(workerId: string): Promise<WorkerMock> {
    try {
      const response = await apiClient.get(`/workers/${workerId}`);
      if (response.data?.data?.worker) {
        return normalizeWorker(response.data.data.worker);
      }
    } catch {
      // Fallback
    }
    const found = MOCK_WORKERS.find((w) => w.id === workerId);
    return normalizeWorker(found || MOCK_WORKERS[0]);
  },
};
