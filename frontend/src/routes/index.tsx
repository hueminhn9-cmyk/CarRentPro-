import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { ManagerLayout } from '@/layouts/ManagerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Public/Auth Pages
import { LandingPage } from '@/pages/Landing/LandingPage';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';

// Customer Pages
import { CustomerDashboard } from '@/pages/Customer/Dashboard';
import { VehicleListing } from '@/pages/Customer/VehicleListing';
import { VehicleDetails } from '@/pages/Customer/VehicleDetails';
import { BookingStep1 } from '@/pages/Customer/BookingStep1';
import { BookingCheckout } from '@/pages/Customer/BookingCheckout';
import { BookingReceipt } from '@/pages/Customer/BookingReceipt';
import { MyRentals } from '@/pages/Customer/MyRentals';
import { RentalDetails } from '@/pages/Customer/RentalDetails';
import { SubmitReview } from '@/pages/Customer/SubmitReview';
import { CustomerProfile } from '@/pages/Customer/Profile';
import { CustomerDocuments } from '@/pages/Customer/Documents';
import { CustomerPayments } from '@/pages/Customer/Payments';
import { CustomerNotifications } from '@/pages/Customer/Notifications';
import { CustomerSupport } from '@/pages/Customer/Support';

// Manager Pages (AutoRent 2.0 Ops Center)
import { ManagerDashboard } from '@/pages/Manager/ManagerDashboard';
import { BookingQueue } from '@/pages/Manager/BookingQueue';
import { TodayOperations } from '@/pages/Manager/TodayOperations';
import { PickupWizard } from '@/pages/Manager/PickupWizard';
import { ReturnWizard } from '@/pages/Manager/ReturnWizard';
import { VerificationQueue } from '@/pages/Manager/VerificationQueue';
import { MaintenanceBoard } from '@/pages/Manager/MaintenanceBoard';
import { FleetView } from '@/pages/Manager/FleetView';

// Admin Pages (AutoRent 2.0 Business Center)
import { AdminDashboard } from '@/pages/Admin/Dashboard';
import { ManagerManagement } from '@/pages/Admin/ManagerManagement';
import { VehiclesManagement } from '@/pages/Admin/VehiclesManagement';
import { VehicleForm } from '@/pages/Admin/VehicleForm';
import { BookingsManagement } from '@/pages/Admin/BookingsManagement';
import { BookingDetail } from '@/pages/Admin/BookingDetail';
import { CustomersManagement } from '@/pages/Admin/CustomersManagement';
import { RevenueReports } from '@/pages/Admin/RevenueReports';
import { MaintenanceManagement } from '@/pages/Admin/MaintenanceManagement';
import { ContractsManagement } from '@/pages/Admin/ContractsManagement';
import { VehicleHandover } from '@/pages/Admin/VehicleHandover';
import { AdminSettings } from '@/pages/Admin/Settings';
import { Reviews } from '@/pages/Admin/Reviews';
import { NotificationCenter } from '@/pages/Admin/NotificationCenter';
import { AuditLogs } from '@/pages/Admin/AuditLogs';

// 404 Page Component
import { Result, Button } from 'antd';

const NotFoundPage: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển."
      extra={
        <Button type="primary" onClick={() => window.location.href = '/'}>
          Về Trang chủ
        </Button>
      }
    />
  );
};

export const router = createBrowserRouter([
  // Standalone Auth Routes (Clean Fullscreen Layout)
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/register', element: <RegisterPage /> },

  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'vehicles', element: <VehicleListing /> },
      { path: 'vehicles/:id', element: <VehicleDetails /> },
      { path: '404', element: <NotFoundPage /> }
    ]
  },
  
  // Customer Protected Routes
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Navigate to="/customer/dashboard" replace /> },
      { path: 'dashboard', element: <CustomerDashboard /> },
      { path: 'vehicles', element: <Navigate to="/vehicles" replace /> },
      { path: 'vehicles/:id', element: <Navigate to="/vehicles" replace /> },
      { path: 'checkout', element: <BookingCheckout /> },
      { path: 'booking/step1', element: <BookingStep1 /> },
      { path: 'booking/checkout', element: <BookingCheckout /> },
      { path: 'booking/receipt/:id', element: <BookingReceipt /> },
      { path: 'my-rentals', element: <MyRentals /> },
      { path: 'rentals', element: <MyRentals /> },
      { path: 'rentals/:id', element: <RentalDetails /> },
      { path: 'rentals/:id/review', element: <SubmitReview /> },
      { path: 'profile', element: <CustomerProfile /> },
      { path: 'documents', element: <CustomerDocuments /> },
      { path: 'payments', element: <CustomerPayments /> },
      { path: 'notifications', element: <CustomerNotifications /> },
      { path: 'support', element: <CustomerSupport /> }
    ]
  },

  // Manager Protected Routes (Operations Workspace)
  {
    path: '/manager',
    element: <ManagerLayout />,
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: 'dashboard', element: <ManagerDashboard /> },
      { path: 'bookings', element: <BookingQueue /> },
      { path: 'operations/today', element: <TodayOperations /> },
      { path: 'pickup/:bookingId', element: <PickupWizard /> },
      { path: 'return/:bookingId', element: <ReturnWizard /> },
      { path: 'verification', element: <VerificationQueue /> },
      { path: 'maintenance', element: <MaintenanceBoard /> },
      { path: 'fleet', element: <FleetView /> },
      { path: 'contracts', element: <ContractsManagement /> },
      { path: 'handover/:id', element: <VehicleHandover /> },
      { path: 'customers', element: <CustomersManagement /> }
    ]
  },

  // Admin Protected Routes (Business Workspace)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'managers', element: <ManagerManagement /> },
      { path: 'vehicles', element: <VehiclesManagement /> },
      { path: 'vehicles/new', element: <VehicleForm /> },
      { path: 'vehicles/edit/:id', element: <VehicleForm /> },
      { path: 'vehicles/:id/edit', element: <VehicleForm /> },
      { path: 'bookings', element: <BookingsManagement /> },
      { path: 'bookings/:id', element: <BookingDetail /> },
      { path: 'customers', element: <CustomersManagement /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'revenue', element: <RevenueReports /> },
      { path: 'maintenance', element: <MaintenanceManagement /> },
      { path: 'contracts', element: <ContractsManagement /> },
      { path: 'handover/:id', element: <VehicleHandover /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'audit-logs', element: <AuditLogs /> },
      { path: 'settings', element: <AdminSettings /> }
    ]
  },

  // Wildcard Route
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
]);
