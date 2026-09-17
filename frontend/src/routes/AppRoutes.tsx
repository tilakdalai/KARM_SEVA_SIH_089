import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { WorkerLayout } from '@/layouts/WorkerLayout';
import { CooperativeLayout } from '@/layouts/CooperativeLayout';
import { InstitutionLayout } from '@/layouts/InstitutionLayout';

// Route Guards
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';

// Public Pages
import { HomePage } from '@/pages/public/HomePage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPickerPage } from '@/pages/auth/RegisterPickerPage';
import { RegisterCustomerPage } from '@/pages/auth/RegisterCustomerPage';
import { RegisterWorkerPage } from '@/pages/auth/RegisterWorkerPage';
import { RegisterInstitutionPage } from '@/pages/auth/RegisterInstitutionPage';

// Customer Pages
import { CustomerHomePage } from '@/pages/customer/CustomerHomePage';
import { ServicesListPage } from '@/pages/customer/ServicesListPage';
import { ServiceDetailPage } from '@/pages/customer/ServiceDetailPage';
import { WorkersListPage } from '@/pages/customer/WorkersListPage';
import { WorkerDetailPage } from '@/pages/customer/WorkerDetailPage';
import { BookingsListPage } from '@/pages/customer/BookingsListPage';
import { BookingDetailPage } from '@/pages/customer/BookingDetailPage';
import { CustomerWorkerTrackingPage } from '@/pages/customer/CustomerWorkerTrackingPage';
import { BookServiceWizard } from '@/pages/customer/BookServiceWizard';
import { RecurringSchedulesPage } from '@/pages/customer/RecurringSchedulesPage';
import { EmergencyBookingPage } from '@/pages/customer/EmergencyBookingPage';
import { FavouritesPage } from '@/pages/customer/FavouritesPage';
import { NotificationsPage } from '@/pages/customer/NotificationsPage';
import { CustomerProfilePage } from '@/pages/customer/CustomerProfilePage';
import { SavedAddressesPage } from '@/pages/customer/SavedAddressesPage';

// Worker Pages
import { WorkerDashboard } from '@/pages/worker/WorkerDashboard';
import { WorkerOnboardingWizard } from '@/pages/worker/WorkerOnboardingWizard';
import { WorkerJobsPage } from '@/pages/worker/WorkerJobsPage';
import { WorkerJobDetailPage } from '@/pages/worker/WorkerJobDetailPage';
import { WorkerScheduleCalendarPage } from '@/pages/worker/WorkerScheduleCalendarPage';
import { WorkerAvailabilityPage } from '@/pages/worker/WorkerAvailabilityPage';
import { WorkerLeaveManagementPage } from '@/pages/worker/WorkerLeaveManagementPage';
import { WorkerEarningsPage } from '@/pages/worker/WorkerEarningsPage';
import { WorkerWalletPage } from '@/pages/worker/WorkerWalletPage';
import { WorkerSettlementsPage } from '@/pages/worker/WorkerSettlementsPage';
import { WorkerRatingsPage } from '@/pages/worker/WorkerRatingsPage';
import { WorkerSkillsPage } from '@/pages/worker/WorkerSkillsPage';
import { WorkerPortfolioPage } from '@/pages/worker/WorkerPortfolioPage';
import { WorkerProfilePage } from '@/pages/worker/WorkerProfilePage';

// Cooperative Pages
import { CooperativeDashboard } from '@/pages/cooperative/CooperativeDashboard';
import { CooperativeWorkersPage } from '@/pages/cooperative/CooperativeWorkersPage';
import { CooperativeVerificationPage } from '@/pages/cooperative/CooperativeVerificationPage';
import { WorkerVerificationReviewPage } from '@/pages/cooperative/WorkerVerificationReviewPage';
import { CooperativeBookingsPage } from '@/pages/cooperative/CooperativeBookingsPage';
import { EmergencyAllocationMapPage } from '@/pages/cooperative/EmergencyAllocationMapPage';
import { CooperativeLeaveReplacementDesk } from '@/pages/cooperative/CooperativeLeaveReplacementDesk';
import { CooperativeServicesPage } from '@/pages/cooperative/CooperativeServicesPage';
import { CooperativeRevenuePage } from '@/pages/cooperative/CooperativeRevenuePage';
import { CooperativeSettlementsPage } from '@/pages/cooperative/CooperativeSettlementsPage';
import { CooperativeRatingsPage } from '@/pages/cooperative/CooperativeRatingsPage';
import { CooperativeComplaintsPage } from '@/pages/cooperative/CooperativeComplaintsPage';
import { CooperativeTrainingPage } from '@/pages/cooperative/CooperativeTrainingPage';
import { CooperativeWelfarePage } from '@/pages/cooperative/CooperativeWelfarePage';
import { CooperativeAnalyticsPage } from '@/pages/cooperative/CooperativeAnalyticsPage';
import { CooperativeNotificationsPage } from '@/pages/cooperative/CooperativeNotificationsPage';
import { CooperativeSettingsPage } from '@/pages/cooperative/CooperativeSettingsPage';
import { CooperativeAuditLogsPage } from '@/pages/cooperative/CooperativeAuditLogsPage';

// Institution Pages
import { InstitutionDashboard } from '@/pages/institution/InstitutionDashboard';
import { RequestWorkforcePage } from '@/pages/institution/RequestWorkforcePage';
import { InstitutionRequestsListPage } from '@/pages/institution/InstitutionRequestsListPage';
import { InstitutionWorkforcePage } from '@/pages/institution/InstitutionWorkforcePage';
import { InstitutionSchedulesPage } from '@/pages/institution/InstitutionSchedulesPage';
import { InstitutionAttendancePage } from '@/pages/institution/InstitutionAttendancePage';
import { InstitutionInvoicesPage } from '@/pages/institution/InstitutionInvoicesPage';
import { InstitutionContractsPage } from '@/pages/institution/InstitutionContractsPage';
import { InstitutionProfilePage } from '@/pages/institution/InstitutionProfilePage';

// System Admin Layout & Governance Pages
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminCooperativesPage } from '@/pages/admin/AdminCooperativesPage';
import { AdminWorkersPage } from '@/pages/admin/AdminWorkersPage';
import { AdminInstitutionsPage } from '@/pages/admin/AdminInstitutionsPage';
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage';
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';
import { AdminComplaintsPage } from '@/pages/admin/AdminComplaintsPage';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* 2. Authentication & Registration Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPickerPage />} />
        <Route path="/register/customer" element={<RegisterCustomerPage />} />
        <Route path="/register/worker" element={<RegisterWorkerPage />} />
        <Route path="/register/institution" element={<RegisterInstitutionPage />} />
      </Route>

      {/* 3. Customer / Citizen Mobile-First Application Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['CUSTOMER']}>
              <CustomerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerHomePage />} />
        <Route path="dashboard" element={<Navigate to="/customer" replace />} />
        <Route path="services" element={<ServicesListPage />} />
        <Route path="services/:id" element={<ServiceDetailPage />} />
        <Route path="workers" element={<WorkersListPage />} />
        <Route path="workers/:id" element={<WorkerDetailPage />} />
        <Route path="bookings" element={<BookingsListPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
        <Route path="bookings/:id/track" element={<CustomerWorkerTrackingPage />} />
        <Route path="book" element={<BookServiceWizard />} />
        <Route path="recurring" element={<RecurringSchedulesPage />} />
        <Route path="emergency" element={<EmergencyBookingPage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="addresses" element={<SavedAddressesPage />} />
      </Route>

      {/* 4. Worker Onboarding Wizard (Full Viewport) */}
      <Route
        path="/worker/onboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['WORKER']}>
              <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gov-text">
                <WorkerOnboardingWizard />
              </div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/worker/onboarding" element={<Navigate to="/worker/onboard" replace />} />

      {/* 5. Worker Mobile-First Operational Application Routes */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['WORKER']}>
              <WorkerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="dashboard" element={<Navigate to="/worker" replace />} />
        <Route path="jobs" element={<WorkerJobsPage />} />
        <Route path="jobs/:id" element={<WorkerJobDetailPage />} />
        <Route path="schedule" element={<WorkerScheduleCalendarPage />} />
        <Route path="availability" element={<WorkerAvailabilityPage />} />
        <Route path="leave" element={<WorkerLeaveManagementPage />} />
        <Route path="earnings" element={<WorkerEarningsPage />} />
        <Route path="wallet" element={<WorkerWalletPage />} />
        <Route path="settlements" element={<WorkerSettlementsPage />} />
        <Route path="ratings" element={<WorkerRatingsPage />} />
        <Route path="skills" element={<WorkerSkillsPage />} />
        <Route path="portfolio" element={<WorkerPortfolioPage />} />
        <Route path="profile" element={<WorkerProfilePage />} />
      </Route>

      {/* 6. Cooperative Operations Workforce Management Desk Routes */}
      <Route
        path="/cooperative"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['COOPERATIVE_ADMIN']}>
              <CooperativeLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<CooperativeDashboard />} />
        <Route path="dashboard" element={<Navigate to="/cooperative" replace />} />
        <Route path="workers" element={<CooperativeWorkersPage />} />
        <Route path="verification" element={<CooperativeVerificationPage />} />
        <Route path="verification/:id" element={<WorkerVerificationReviewPage />} />
        <Route path="bookings" element={<CooperativeBookingsPage />} />
        <Route path="live-operations" element={<EmergencyAllocationMapPage />} />
        <Route path="emergency-radar" element={<EmergencyAllocationMapPage />} />
        <Route path="leaves" element={<CooperativeLeaveReplacementDesk />} />
        <Route path="replacement" element={<CooperativeLeaveReplacementDesk />} />
        <Route path="services" element={<CooperativeServicesPage />} />
        <Route path="revenue" element={<CooperativeRevenuePage />} />
        <Route path="settlements" element={<CooperativeSettlementsPage />} />
        <Route path="ratings" element={<CooperativeRatingsPage />} />
        <Route path="complaints" element={<CooperativeComplaintsPage />} />
        <Route path="training" element={<CooperativeTrainingPage />} />
        <Route path="welfare" element={<CooperativeWelfarePage />} />
        <Route path="analytics" element={<CooperativeAnalyticsPage />} />
        <Route path="notifications" element={<CooperativeNotificationsPage />} />
        <Route path="settings" element={<CooperativeSettingsPage />} />
        <Route path="audit-logs" element={<CooperativeAuditLogsPage />} />
      </Route>

      {/* 7. Institution / Enterprise B2B Application Routes */}
      <Route
        path="/institution"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['INSTITUTION']}>
              <InstitutionLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<InstitutionDashboard />} />
        <Route path="dashboard" element={<Navigate to="/institution" replace />} />
        <Route path="request" element={<RequestWorkforcePage />} />
        <Route path="requests" element={<InstitutionRequestsListPage />} />
        <Route path="workforce" element={<InstitutionWorkforcePage />} />
        <Route path="schedules" element={<InstitutionSchedulesPage />} />
        <Route path="attendance" element={<InstitutionAttendancePage />} />
        <Route path="invoices" element={<InstitutionInvoicesPage />} />
        <Route path="contracts" element={<InstitutionContractsPage />} />
        <Route path="profile" element={<InstitutionProfilePage />} />
      </Route>

      {/* 8. System Administration & DPI Governance Command Center */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="cooperatives" element={<AdminCooperativesPage />} />
        <Route path="workers" element={<AdminWorkersPage />} />
        <Route path="institutions" element={<AdminInstitutionsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
        <Route path="verification" element={<AdminVerificationPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 8. Fallback 404 Route */}
      <Route element={<PublicLayout />}>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};
