import axios from 'axios';
import {
  Vehicle,
  Booking,
  Customer,
  MaintenanceRecord,
  Contract
} from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request Interceptor: Attach bearer token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('autorent_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically refresh expired token on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('autorent_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          
          localStorage.setItem('autorent_token', accessToken);
          localStorage.setItem('autorent_refresh_token', newRefreshToken);
          
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          processQueue(null, accessToken);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('autorent_token');
          localStorage.removeItem('autorent_refresh_token');
          localStorage.removeItem('autorent_user');
          if (window.location.pathname !== '/auth/login' && !window.location.pathname.startsWith('/vehicles') && window.location.pathname !== '/') {
            window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('autorent_token');
        localStorage.removeItem('autorent_user');
        if (window.location.pathname !== '/auth/login' && !window.location.pathname.startsWith('/vehicles') && window.location.pathname !== '/') {
          window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Formatter Helpers to map Backend DB models to Frontend components expected models
const formatVehicle = (v: any): Vehicle => {
  const catName = v.vehicle_categories?.name || 'Sedan';
  let type = catName;
  if (catName === 'Pickup') type = 'Bán tải';
  if (catName === 'Luxury') type = 'Xe sang';
  if (v.fuel_type === 'ELECTRIC' && catName === 'SUV') type = 'Xe điện';

  let fuelConsumption = '7.5 l/100km';
  if (v.fuel_type === 'ELECTRIC') {
    fuelConsumption = '0 kWh/100km';
  } else if (v.fuel_type === 'DIESEL') {
    fuelConsumption = v.seat_count > 5 ? '8.5 l/100km' : '6.5 l/100km';
  } else {
    fuelConsumption = v.seat_count > 5 ? '9.5 l/100km' : '7.0 l/100km';
  }

  let features = ["Bản đồ GPS", "Camera 360", "Ghế da nappa", "Apple CarPlay/Android Auto"];
  if (v.fuel_type === 'ELECTRIC') {
    features = ["Bản đồ GPS", "Camera 360", "Trợ lý ảo thông minh", "Sạc nhanh CCS2", "Apple CarPlay/Android Auto"];
  } else if (type === 'Bán tải' || type === 'SUV') {
    features = ["Bản đồ GPS", "Camera 360", "Dẫn động 4 bánh (4WD)", "Cảnh báo điểm mù", "Cảm biến đỗ xe"];
  } else if (type === 'Sedan' || type === 'Hatchback') {
    features = ["Bản đồ GPS", "Camera lùi", "Ghế bọc da", "Bluetooth/USB", "Kiểm soát hành trình Cruise Control"];
  }

  return {
    id: v.id.toString(),
    name: v.name,
    type,
    licensePlate: v.license_plate,
    pricePerDay: Number(v.price_per_day),
    status: v.status === 'AVAILABLE' ? 'Có sẵn' : (v.status === 'MAINTENANCE' ? 'Bảo dưỡng' : 'Đang thuê'),
    image: v.image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60',
    transmission: v.transmission === 'AUTO' ? 'Tự động' : 'Số sàn',
    fuel: v.fuel_type === 'ELECTRIC' ? 'Điện' : (v.fuel_type === 'DIESEL' ? 'Dầu' : 'Xăng'),
    seats: v.seat_count,
    location: v.location,
    color: v.color || 'Trắng',
    year: v.manufacture_year || 2023,
    fuelConsumption,
    description: v.description || '',
    features,
    insurance: "Bảo hiểm vật chất 2 chiều tiêu chuẩn (khấu trừ 1.000.000đ/vụ)",
    rating: 5.0,
    reviewsCount: 0
  };
};

const formatBooking = (b: any): Booking => ({
  id: b.id.toString(),
  bookingCode: b.booking_code,
  customerId: b.customer_id.toString(),
  customerName: b.users?.full_name || 'N/A',
  customerPhone: b.users?.phone || 'N/A',
  customerEmail: b.users?.email || 'N/A',
  vehicleId: b.vehicle_id.toString(),
  vehicleName: b.vehicles?.name || 'N/A',
  vehicleImage: b.vehicles?.image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60',
  startDate: b.pickup_datetime ? b.pickup_datetime.split('T')[0] : '',
  endDate: b.return_datetime ? b.return_datetime.split('T')[0] : '',
  pickupLocation: b.pickup_location,
  dropoffLocation: b.return_location,
  totalDays: b.rental_days,
  pricePerDay: b.vehicles?.price_per_day ? Number(b.vehicles.price_per_day) : 0,
  subtotal: b.rental_fee ? Number(b.rental_fee) : 0,
  insuranceFee: 0,
  serviceFee: b.service_fee ? Number(b.service_fee) : 0,
  totalAmount: b.total_amount ? Number(b.total_amount) : 0,
  status: b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'READY_FOR_PICKUP' ? 'Chờ xác nhận' : (b.status === 'COMPLETED' ? 'Hoàn thành' : (b.status === 'CANCELLED' || b.status === 'REJECTED' ? 'Đã hủy' : 'Đang thuê')),
  paymentMethod: b.payments?.[0]?.payment_method === 'VNPAY' ? 'Ví điện tử' : (b.payments?.[0]?.payment_method === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Thẻ tín dụng'),
  paymentStatus: b.payment_status === 'PAID' ? 'Đã thanh toán' : (b.payment_status === 'REFUNDED' ? 'Hoàn tiền' : 'Chờ thanh toán'),
  createdAt: b.created_at || '',
  contractSigned: b.contracts?.status === 'SIGNED' || b.contract_signed || false,
  notes: b.customer_note || ''
});

const formatCustomer = (u: any): Customer => {
  const profile = u.customer_profiles || {};
  return {
    id: u.id.toString(),
    name: u.full_name,
    email: u.email,
    phone: u.phone || 'N/A',
    address: profile.address || 'N/A',
    idCard: profile.citizen_id || 'N/A',
    driverLicense: profile.driver_license_number || 'N/A',
    licenseStatus: profile.verification_status === 'VERIFIED' ? 'Đã xác minh' : (profile.verification_status === 'PENDING' ? 'Chờ duyệt' : 'Chưa cập nhật'),
    loyaltyPoints: 0,
    tier: 'Bạc',
    bookingCount: 0,
    createdAt: u.created_at || ''
  };
};

const formatContract = (c: any): Contract => ({
  id: c.id.toString(),
  bookingCode: c.bookings?.booking_code || c.booking_code,
  customerName: c.bookings?.users?.full_name || 'N/A',
  vehicleName: c.bookings?.vehicles?.name || 'N/A',
  licensePlate: c.bookings?.vehicles?.license_plate || 'N/A',
  startDate: c.bookings?.pickup_datetime ? c.bookings.pickup_datetime.split('T')[0] : '',
  endDate: c.bookings?.return_datetime ? c.bookings.return_datetime.split('T')[0] : '',
  status: c.status === 'SIGNED' ? 'Đã ký' : 'Chờ ký',
  fileUrl: c.contract_url || '#'
});

export const api = {
  // Auth API
  auth: {
    login: async (email: string, password: string) => {
      try {
        const res = await axiosInstance.post('/auth/login', { email, password });
        const { user, accessToken, refreshToken } = res.data.data;
        
        localStorage.setItem('autorent_token', accessToken);
        localStorage.setItem('autorent_refresh_token', refreshToken);
        
        const formattedUser = {
          id: user.id.toString(),
          name: user.fullName || user.full_name,
          email: user.email,
          role: user.role.toLowerCase()
        };
        
        localStorage.setItem('autorent_user', JSON.stringify(formattedUser));
        return formattedUser;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email & mật khẩu.';
        throw new Error(errorMessage);
      }
    },

    register: async (fullName: string, email: string, phone: string, password: string) => {
      try {
        const res = await axiosInstance.post('/auth/register', { fullName, email, phone, password });
        return res.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.';
        throw new Error(errorMessage);
      }
    },
    
    getCurrentUser: () => {
      const data = localStorage.getItem('autorent_user');
      return data ? JSON.parse(data) : null;
    },
    
    logout: async () => {
      try {
        const refreshToken = localStorage.getItem('autorent_refresh_token');
        if (refreshToken) {
          await axiosInstance.post('/auth/logout', { refreshToken });
        }
      } catch (e) {
        console.error('Logout error', e);
      } finally {
        localStorage.removeItem('autorent_token');
        localStorage.removeItem('autorent_refresh_token');
        localStorage.removeItem('autorent_user');
      }
    }
  },

  // Dashboard API
  dashboard: {
    getKpis: async () => {
      const res = await axiosInstance.get('/dashboard/stats');
      return res.data.data;
    }
  },

  // Vehicles API
  vehicles: {
    getAll: async (params?: { limit?: number; status?: string }): Promise<Vehicle[]> => {
      const limit = params?.limit || 100;
      const res = await axiosInstance.get(`/vehicles?limit=${limit}`);
      const list = res.data.data.vehicles || [];
      return list.map(formatVehicle);
    },
    
    getById: async (id: string): Promise<Vehicle | undefined> => {
      const res = await axiosInstance.get(`/vehicles/${id}`);
      return formatVehicle(res.data.data);
    },
    
    create: async (data: Omit<Vehicle, 'id' | 'rating' | 'reviewsCount'>): Promise<Vehicle> => {
      const catsRes = await axiosInstance.get('/vehicles/categories');
      const cats = catsRes.data.data;
      const typeMap: Record<string, string> = {
        'Sedan': 'Sedan',
        'SUV': 'SUV',
        'Hatchback': 'Hatchback',
        'Bán tải': 'Pickup',
        'Xe điện': 'SUV'
      };
      const catName = typeMap[data.type] || 'Sedan';
      const cat = cats.find((c: any) => c.name === catName) || cats[0];
      const categoryId = cat ? cat.id : 1;

      const brand = data.name.split(' ')[0] || 'Unknown';
      const model = data.name.split(' ').slice(1).join(' ') || data.name;

      const payload = {
        category_id: Number(categoryId),
        code: 'VEH-' + data.licensePlate.replace(/[^a-zA-Z0-9]/g, '') + '-' + Math.floor(Math.random() * 1000),
        name: data.name,
        brand,
        model,
        manufacture_year: data.year,
        license_plate: data.licensePlate,
        color: data.color,
        seat_count: data.seats,
        transmission: data.transmission === 'Tự động' ? 'AUTO' : 'MANUAL',
        fuel_type: data.fuel === 'Điện' ? 'ELECTRIC' : (data.fuel === 'Dầu' ? 'DIESEL' : 'GASOLINE'),
        price_per_day: data.pricePerDay,
        deposit_amount: data.pricePerDay * 10,
        description: data.description,
        status: data.status === 'Có sẵn' ? 'AVAILABLE' : (data.status === 'Bảo dưỡng' ? 'MAINTENANCE' : 'RENTED'),
        image: data.image
      };

      const res = await axiosInstance.post('/vehicles', payload);
      return formatVehicle(res.data.data);
    },
    
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
      const payload: any = {};
      if (data.name) {
        payload.name = data.name;
        payload.brand = data.name.split(' ')[0] || 'Unknown';
        payload.model = data.name.split(' ').slice(1).join(' ') || data.name;
      }
      if (data.licensePlate) payload.license_plate = data.licensePlate;
      if (data.pricePerDay) payload.price_per_day = data.pricePerDay;
      if (data.status) {
        payload.status = data.status === 'Có sẵn' ? 'AVAILABLE' : (data.status === 'Bảo dưỡng' ? 'MAINTENANCE' : 'RENTED');
      }
      if (data.transmission) payload.transmission = data.transmission === 'Tự động' ? 'AUTO' : 'MANUAL';
      if (data.fuel) payload.fuel_type = data.fuel === 'Điện' ? 'ELECTRIC' : (data.fuel === 'Dầu' ? 'DIESEL' : 'GASOLINE');
      if (data.seats) payload.seat_count = data.seats;
      if (data.color) payload.color = data.color;
      if (data.year) payload.manufacture_year = data.year;
      if (data.description) payload.description = data.description;
      if (data.image) payload.image = data.image;

      const res = await axiosInstance.put(`/vehicles/${id}`, payload);
      return formatVehicle(res.data.data);
    },
    
    delete: async (id: string): Promise<boolean> => {
      await axiosInstance.delete(`/vehicles/${id}`);
      return true;
    }
  },

  // Bookings API
  bookings: {
    getAll: async (params?: { limit?: number; status?: string }): Promise<Booking[]> => {
      const limit = params?.limit || 100;
      const res = await axiosInstance.get(`/bookings?limit=${limit}`);
      const list = res.data.data.bookings || [];
      return list.map(formatBooking);
    },
    
    getById: async (id: string): Promise<Booking | undefined> => {
      const res = await axiosInstance.get(`/bookings/${id}`);
      return formatBooking(res.data.data);
    },
    
    getByCustomer: async (customerId: string): Promise<Booking[]> => {
      const res = await axiosInstance.get('/bookings?limit=100');
      const list = res.data.data.bookings || [];
      return list.map(formatBooking);
    },
    
    create: async (data: any): Promise<Booking> => {
      const payload = {
        vehicle_id: Number(data.vehicleId),
        pickup_datetime: new Date(data.startDate).toISOString(),
        return_datetime: new Date(data.endDate).toISOString(),
        pickup_location: data.pickupLocation || 'Showroom Đống Đa - Hà Nội',
        return_location: data.dropoffLocation || 'Showroom Đống Đa - Hà Nội',
        customer_note: data.notes || '',
        services: data.services || []
      };
      
      const res = await axiosInstance.post('/bookings', payload);
      return formatBooking(res.data.data);
    },
    
    updateStatus: async (id: string, status: string, paymentStatus?: string): Promise<Booking> => {
      const statusMap: Record<string, string> = {
        'Chờ xác nhận': 'PENDING',
        'PENDING': 'PENDING',
        'Đang thuê': 'ACTIVE',
        'ACTIVE': 'ACTIVE',
        'CONFIRMED': 'CONFIRMED',
        'READY_FOR_PICKUP': 'READY_FOR_PICKUP',
        'Hoàn thành': 'COMPLETED',
        'COMPLETED': 'COMPLETED',
        'Đã hủy': 'CANCELLED',
        'CANCELLED': 'CANCELLED',
        'REJECTED': 'REJECTED'
      };
      
      const backendStatus = statusMap[status] || status;
      
      const res = await axiosInstance.put(`/bookings/${id}/status`, {
        status: backendStatus,
        reason: `Cập nhật trạng thái thành ${status}`
      });
      
      return formatBooking(res.data.data);
    },
    
    signContract: async (bookingCode: string): Promise<boolean> => {
      await axiosInstance.post('/contracts/sign', {
        bookingCode,
        contractUrl: 'https://autorent.vn/contracts/signed_template.pdf'
      });
      return true;
    }
  },

  // Customers API
  customers: {
    getAll: async (params?: { limit?: number }): Promise<Customer[]> => {
      const limit = params?.limit || 100;
      const res = await axiosInstance.get(`/users?role=CUSTOMER&limit=${limit}`);
      const list = res.data.data.users || [];
      return list.map(formatCustomer);
    },
    
    getById: async (id: string): Promise<Customer | undefined> => {
      try {
        const profileRes = await axiosInstance.get('/users/profile');
        const profileUser = profileRes.data.data;
        if (profileUser && profileUser.id?.toString() === id.toString()) {
          return formatCustomer(profileUser);
        }
        const res = await axiosInstance.get(`/users/${id}`);
        return formatCustomer(res.data.data);
      } catch (err: any) {
        try {
          const profileRes = await axiosInstance.get('/users/profile');
          return formatCustomer(profileRes.data.data);
        } catch {
          return undefined;
        }
      }
    },

    verifyLicense: async (id: string, data: { status: string; reason?: string }): Promise<any> => {
      const res = await axiosInstance.put(`/users/${id}/verify`, {
        status: data.status,
        reason: data.reason
      });
      return res.data;
    },

    updateLicense: async (id: string, status: Customer['licenseStatus'], fileUrl?: string): Promise<Customer> => {
      const statusMap: Record<string, string> = {
        'Đã xác minh': 'VERIFIED',
        'Chờ duyệt': 'PENDING',
        'Chưa cập nhật': 'REJECTED'
      };
      const backendStatus = statusMap[status] || 'PENDING';
      
      const res = await axiosInstance.put(`/users/${id}/verify`, {
        status: backendStatus
      });
      
      return formatCustomer(res.data.data);
    },

    updateRole: async (id: string, role: string): Promise<boolean> => {
      await axiosInstance.put(`/users/${id}`, { role: role.toUpperCase() });
      return true;
    },

    updateProfile: async (data: any): Promise<boolean> => {
      const userPayload: any = {};
      if (data.name || data.full_name) userPayload.full_name = data.name || data.full_name;
      if (data.phone) userPayload.phone = data.phone;

      if (Object.keys(userPayload).length > 0) {
        await axiosInstance.put('/users/profile', userPayload);
      }

      const customerPayload: any = {};
      if (data.address) customerPayload.address = data.address;
      if (data.idCard || data.citizen_id) customerPayload.citizen_id = data.idCard || data.citizen_id;
      if (data.driverLicense || data.driver_license_number) customerPayload.driver_license_number = data.driverLicense || data.driver_license_number;

      if (Object.keys(customerPayload).length > 0) {
        await axiosInstance.put('/users/profile/customer', customerPayload);
      }
      return true;
    }
  },

  // Notifications API
  notifications: {
    getAll: async () => {
      const res = await axiosInstance.get('/notifications');
      const list = res.data.data.notifications || res.data.data || [];
      return list.map((n: any) => ({
        id: n.id.toString(),
        title: n.title,
        desc: n.content,
        time: n.created_at || new Date().toISOString(),
        type: n.type?.toLowerCase() === 'system' ? 'info' : (n.type?.toLowerCase() || 'info'),
        read: Boolean(n.is_read)
      }));
    },
    markAllAsRead: async () => {
      await axiosInstance.put('/notifications/mark-all-read');
      return true;
    },
    delete: async (id: string) => {
      await axiosInstance.delete(`/notifications/${id}`);
      return true;
    }
  },

  // Maintenance API
  maintenance: {
    getAll: async (params?: { limit?: number }): Promise<MaintenanceRecord[]> => {
      const res = await axiosInstance.get('/maintenance');
      return res.data.data || [];
    },
    
    schedule: async (vehicleId: string, description: string, cost: number, startDate: string, endDate: string): Promise<MaintenanceRecord> => {
      const res = await axiosInstance.post('/maintenance/schedule', {
        vehicleId,
        description,
        cost,
        startDate,
        endDate
      });
      return res.data.data;
    },
    
    complete: async (id: string): Promise<MaintenanceRecord> => {
      const res = await axiosInstance.put(`/maintenance/${id}/complete`);
      return res.data.data;
    }
  },

  // Contracts API
  contracts: {
    getAll: async (params?: { limit?: number }): Promise<Contract[]> => {
      const res = await axiosInstance.get('/contracts?limit=100');
      const list = res.data.data.contracts || res.data.data || [];
      return list.map(formatContract);
    }
  },

  // Stats Dashboard API
  stats: {
    getAdminStats: async () => {
      const res = await axiosInstance.get('/dashboard/stats');
      return res.data.data;
    }
  },

  // Managers API
  managers: {
    getAll: async () => {
      const res = await axiosInstance.get('/users?role=MANAGER&limit=100');
      return res.data.data.users || [];
    },
    create: async (data: any) => {
      const res = await axiosInstance.post('/users', {
        email: data.email,
        password: data.password || 'manager123',
        full_name: data.name,
        phone: data.phone,
        role: 'MANAGER',
        status: 'ACTIVE'
      });
      return res.data.data;
    },
    update: async (id: string, data: any) => {
      const res = await axiosInstance.put(`/users/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string) => {
      const res = await axiosInstance.delete(`/users/${id}`);
      return res.data;
    }
  }
};
