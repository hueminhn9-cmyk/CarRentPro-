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

// Manager Pages
import { ManagerDashboard } from '@/pages/Manager/ManagerDashboard';

// Admin Pages
import { AdminDashboard } from '@/pages/Admin/Dashboard';
import { ManagerManagement } from '@/pages/Admin/ManagerManagement';
import { VehiclesManagement } from '@/pages/Admin/VehiclesManagement';
import { VehicleForm } from '@/pages/Admin/VehicleForm';
import { BookingsManagement } from '@/pages/Admin/BookingsManagement';
import { AdminBookingDetails } from '@/pages/Admin/BookingDetails';
import { CustomersManagement } from '@/pages/Admin/CustomersManagement';
import { RevenueReports } from '@/pages/Admin/RevenueReports';
import { MaintenanceManagement } from '@/pages/Admin/MaintenanceManagement';
import { ContractsManagement } from '@/pages/Admin/ContractsManagement';
import { VehicleHandover } from '@/pages/Admin/VehicleHandover';
import { AdminSettings } from '@/pages/Admin/Settings';

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
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'vehicles', element: <VehicleListing /> },
      { path: 'vehicles/:id', element: <VehicleDetails /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
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
      { path: 'booking/step1', element: <BookingStep1 /> },
      { path: 'booking/checkout', element: <BookingCheckout /> },
      { path: 'booking/receipt/:id', element: <BookingReceipt /> },
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

  // Manager Protected Routes
  {
    path: '/manager',
    element: <ManagerLayout />,
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: 'dashboard', element: <ManagerDashboard /> },
      { path: 'bookings', element: <BookingsManagement /> },
      { path: 'bookings/:id', element: <AdminBookingDetails /> },
      { path: 'contracts', element: <ContractsManagement /> },
      { path: 'handover/:id', element: <VehicleHandover /> },
      { path: 'customers', element: <CustomersManagement /> },
      { path: 'maintenance', element: <MaintenanceManagement /> }
    ]
  },

  // Admin Protected Routes
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
      { path: 'bookings', element: <BookingsManagement /> },
      { path: 'bookings/:id', element: <AdminBookingDetails /> },
      { path: 'customers', element: <CustomersManagement /> },
      { path: 'revenue', element: <RevenueReports /> },
      { path: 'maintenance', element: <MaintenanceManagement /> },
      { path: 'contracts', element: <ContractsManagement /> },
      { path: 'handover/:id', element: <VehicleHandover /> },
      { path: 'settings', element: <AdminSettings /> }
    ]
  },

  // Wildcard Route
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
]);
