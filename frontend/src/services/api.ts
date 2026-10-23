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
const formatVehicle = (v: any): Vehicle & { gallery?: string[] } => {
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

  const gallery = (v.media_files || [])
    .map((m: any) => m.file_path ? (m.file_path.startsWith('http') ? m.file_path : `http://localhost:5000/${m.file_path.replace(/\\/g, '/')}`) : null)
    .filter(Boolean);

  const mainImage = v.image || (gallery.length > 0 ? gallery[0] : 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60');

  return {
    id: v.id.toString(),
    name: v.name,
    type,
    licensePlate: v.license_plate,
    pricePerDay: Number(v.price_per_day),
    status: v.status === 'AVAILABLE' ? 'Có sẵn' : (v.status === 'MAINTENANCE' ? 'Bảo dưỡng' : 'Đang thuê'),
    image: mainImage,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    transmission: v.transmission === 'AUTO' ? 'Tự động' : 'Số sàn',
    fuel: v.fuel_type === 'ELECTRIC' ? 'Điện' : (v.fuel_type === 'DIESEL' ? 'Dầu' : 'Xăng'),
    seats: v.seat_count,
    location: v.locations?.name || 'Showroom Trung Tâm (Hải Châu, Đà Nẵng)',
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

const formatBooking = (b: any): Booking & { vehicleGallery?: string[] } => {
  const vehicleGallery = (b.vehicles?.media_files || [])
    .map((m: any) => m.file_path ? (m.file_path.startsWith('http') ? m.file_path : `http://localhost:5000/${m.file_path.replace(/\\/g, '/')}`) : null)
    .filter(Boolean);

  const vehicleImage = b.vehicles?.image || (vehicleGallery.length > 0 ? vehicleGallery[0] : 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60');

  return {
    id: b.id.toString(),
    bookingCode: b.booking_code,
    customerId: b.customer_id.toString(),
    customerName: b.users?.full_name || 'N/A',
    customerPhone: b.users?.phone || 'N/A',
    customerEmail: b.users?.email || 'N/A',
    vehicleId: b.vehicle_id.toString(),
    vehicleName: b.vehicles?.name || 'N/A',
    vehicleImage: vehicleImage,
    vehicleGallery: vehicleGallery.length > 0 ? vehicleGallery : [vehicleImage],
    startDate: b.pickup_datetime ? b.pickup_datetime.split('T')[0] : '',
    endDate: b.return_datetime ? b.return_datetime.split('T')[0] : '',
    pickupLocation: b.pickup_location,
    dropoffLocation: b.return_location,
    totalDays: b.rental_days,
    pricePerDay: b.vehicles?.price_per_day ? Number(b.vehicles.price_per_day) : 0,
    subtotal: b.rental_fee ? Number(b.rental_fee) : 0,
    insuranceFee: 0,
    serviceFee: b.service_fee ? Number(b.service_fee) : 0,
    depositAmount: b.deposit_amount ? Number(b.deposit_amount) : 15000000,
    totalAmount: b.total_amount ? Number(b.total_amount) : ((b.rental_fee ? Number(b.rental_fee) : 0) + (b.service_fee ? Number(b.service_fee) : 0)),
    status: b.status,
    rawStatus: b.status,
    paymentMethod: b.payments?.[0]?.payment_method === 'VNPAY' ? 'Ví điện tử' : (b.payments?.[0]?.payment_method === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Thẻ tín dụng'),
    paymentStatus: b.payment_status === 'PAID' ? 'Đã thanh toán' : (b.payment_status === 'REFUNDED' ? 'Hoàn tiền' : 'Chờ thanh toán'),
    createdAt: b.created_at || '',
    contractSigned: b.contracts?.status === 'SIGNED' || b.contract_signed || false,
    notes: b.customer_note || '',
    adminNote: b.admin_note || '',
    vehicleLicensePlate: b.vehicles?.license_plate || 'N/A',
    vehiclePlate: b.vehicles?.license_plate || 'N/A',
    vehicle: {
      id: b.vehicle_id?.toString() || '',
      name: b.vehicles?.name || 'N/A',
      licensePlate: b.vehicles?.license_plate || 'N/A',
      image: vehicleImage
    },
    customer: {
      id: b.customer_id?.toString() || '',
      name: b.users?.full_name || 'Khách hàng',
      phone: b.users?.phone || 'N/A',
      email: b.users?.email || 'N/A'
    },
    payments: b.payments || [],
    handoverRecords: b.handover_records || [],
    contracts: b.contracts || null,
    history: b.booking_status_history || []
  };
};

const formatCustomer = (u: any): Customer & { documents?: any[]; citizenFront?: string; citizenBack?: string; licenseFront?: string; licenseBack?: string } => {
  const profile = u.customer_profiles || {};
  const docs = u.documents || [];
  
  const getDocUrl = (cat: string, fallback: string) => {
    const doc = docs.find((d: any) => d.category === cat);
    if (doc && doc.file_path) {
      if (doc.file_path.startsWith('http')) return doc.file_path;
      return `http://localhost:5000/${doc.file_path.replace(/\\/g, '/')}`;
    }
    return fallback;
  };

  const citizenFront = getDocUrl('CITIZEN_FRONT', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60');
  const citizenBack = getDocUrl('CITIZEN_BACK', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60');
  const licenseFront = getDocUrl('LICENSE_FRONT', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60');
  const licenseBack = getDocUrl('LICENSE_BACK', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60');

  return {
    id: u.id.toString(),
    name: u.full_name,
    email: u.email,
    phone: u.phone || 'N/A',
    address: profile.address || 'N/A',
    idCard: profile.citizen_id || 'N/A',
    driverLicense: profile.driver_license_number || 'N/A',
    licenseExpiry: profile.driver_license_expiry ? profile.driver_license_expiry.split('T')[0] : '',
    licenseStatus: profile.verification_status === 'VERIFIED' ? 'Đã xác minh' : (profile.verification_status === 'PENDING' ? 'Chờ duyệt' : (profile.verification_status === 'REJECTED' ? 'Từ chối' : 'Chưa cập nhật')),
    loyaltyPoints: profile.loyalty_points || 0,
    tier: profile.loyalty_tier || 'Bạc',
    bookingCount: profile.booking_count || 0,
    createdAt: u.created_at || '',
    frontImage: licenseFront,
    backImage: licenseBack,
    citizenFront,
    citizenBack,
    licenseFront,
    licenseBack,
    documents: docs,
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
        pickup_location: data.pickupLocation || 'Showroom Hải Châu - Đà Nẵng',
        return_location: data.dropoffLocation || 'Showroom Hải Châu - Đà Nẵng',
        customer_note: data.notes || '',
        services: data.services || []
      };
      
      const res = await axiosInstance.post('/bookings', payload);
      return formatBooking(res.data.data);
    },
    
    updateStatus: async (id: string, status: string, paymentStatus?: string, reason?: string): Promise<Booking> => {
      const statusMap: Record<string, string> = {
        'Chờ xác nhận': 'PENDING',
        'PENDING': 'PENDING',
        'Đang thuê': 'ACTIVE',
        'ACTIVE': 'ACTIVE',
        'CONFIRMED': 'CONFIRMED',
        'READY_FOR_PICKUP': 'READY_FOR_PICKUP',
        'WAITING_FOR_RETURN': 'WAITING_FOR_RETURN',
        'Hoàn thành': 'COMPLETED',
        'COMPLETED': 'COMPLETED',
        'Đã hủy': 'CANCELLED',
        'CANCELLED': 'CANCELLED',
        'REJECTED': 'REJECTED'
      };
      
      const backendStatus = statusMap[status] || status;
      
      const payload: any = {
        status: backendStatus,
        reason: reason || `Cập nhật trạng thái thành ${status}`
      };
      if (paymentStatus) {
        payload.payment_status = paymentStatus;
      }
      
      const res = await axiosInstance.put(`/bookings/${id}/status`, payload);
      
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

  // Locations API
  locations: {
    getAll: async () => {
      try {
        const res = await axiosInstance.get('/locations');
        return res.data.data;
      } catch (err) {
        return [
          { id: 1, name: 'Showroom Sân Bay Đà Nẵng', address: 'Cổng Ga Đến Quốc Tế, Q. Hải Châu, Đà Nẵng' },
          { id: 2, name: 'Showroom Chi Nhánh Trung Tâm - Hải Châu', address: '150 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng' },
          { id: 3, name: 'Showroom Chi Nhánh Sơn Trà - Biển Mỹ Khê', address: '88 Võ Nguyên Giáp, Q. Sơn Trà, Đà Nẵng' },
          { id: 4, name: 'Showroom Chi Nhánh Thanh Khê', address: '45 Nguyễn Tất Thành, Q. Thanh Khê, Đà Nẵng' },
          { id: 5, name: 'Showroom Chi Nhánh Ngũ Hành Sơn', address: '12 Lê Văn Hiến, Q. Ngũ Hành Sơn, Đà Nẵng' }
        ];
      }
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

    uploadDocument: async (category: string, file: File, details?: any): Promise<Customer> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (details?.citizen_id) formData.append('citizen_id', details.citizen_id);
      if (details?.driver_license_number) formData.append('driver_license_number', details.driver_license_number);
      if (details?.driver_license_expiry) formData.append('driver_license_expiry', details.driver_license_expiry);

      const res = await axiosInstance.post('/users/profile/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return formatCustomer(res.data.data);
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
    getAll: async (params?: { limit?: number; page?: number; all?: boolean }) => {
      const limit = params?.limit || 50;
      const page = params?.page || 1;
      const allParam = params?.all !== false ? '&all=true' : '';
      const res = await axiosInstance.get(`/notifications?limit=${limit}&page=${page}${allParam}`);
      const list = res.data.data.notifications || res.data.data || [];
      return list.map((n: any) => ({
        id: String(n.id),
        user_id: n.user_id ? String(n.user_id) : undefined,
        title: n.title,
        content: n.content,
        desc: n.content,
        time: n.created_at || new Date().toISOString(),
        created_at: n.created_at || new Date().toISOString(),
        type: n.type || 'INFO',
        read: Boolean(n.is_read),
        is_read: Boolean(n.is_read),
        users: n.users
      }));
    },
    getUnreadCount: async () => {
      const res = await axiosInstance.get('/notifications/unread-count');
      return res.data.data.count || 0;
    },
    markAsRead: async (id: string | number) => {
      const res = await axiosInstance.put(`/notifications/${id}/read`);
      return res.data.data;
    },
    markAllAsRead: async () => {
      const res = await axiosInstance.put('/notifications/mark-all-read');
      return res.data;
    },
    delete: async (id: string | number) => {
      const res = await axiosInstance.delete(`/notifications/${id}`);
      return res.data;
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
    },
    getByBookingId: async (bookingId: string) => {
      const res = await axiosInstance.get(`/contracts/booking/${bookingId}`);
      return res.data.data;
    },
    getContractHTML: async (contractId: string) => {
      const res = await axiosInstance.get(`/contracts/${contractId}/preview`, { responseType: 'text' });
      return res.data;
    },
    downloadContract: async (contractId: string, contractCode?: string) => {
      const res = await axiosInstance.get(`/contracts/${contractId}/download`, { responseType: 'text' });
      const blob = new Blob([res.data], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HopDong-${contractCode || contractId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    signContract: async (data: { contractId?: string; bookingCode?: string; signatureData: string }) => {
      const res = await axiosInstance.post('/contracts/sign', data);
      return res.data.data;
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
  },

  // Handover Records API
  handover: {
    create: async (data: {
      booking_id: string | number;
      record_type?: 'PICKUP' | 'RETURN';
      type?: 'PICKUP' | 'RETURN';
      odometer?: number;
      mileage?: number;
      fuel_level?: number | string;
      vehicle_condition?: 'EXCELLENT' | 'GOOD' | 'NORMAL' | 'DAMAGED';
      damage_description?: string;
      checklist?: any;
      photos?: string[];
      late_fee?: number;
      extra_km_fee?: number;
      fuel_fee?: number;
      cleaning_fee?: number;
      damage_fee?: number;
      refundable_deposit?: number;
      note?: string;
    }) => {
      const record_type = data.record_type || data.type || 'PICKUP';
      const mileage = data.mileage !== undefined ? Number(data.mileage) : (data.odometer !== undefined ? Number(data.odometer) : 0);
      let fuelLevelNum = 100;
      if (typeof data.fuel_level === 'number') {
        fuelLevelNum = data.fuel_level;
      } else if (typeof data.fuel_level === 'string') {
        const parsed = parseInt(data.fuel_level.replace(/[^0-9]/g, ''));
        fuelLevelNum = isNaN(parsed) ? 100 : Math.min(100, Math.max(0, parsed));
      }

      const noteParts: string[] = [];
      if (data.note) noteParts.push(data.note);
      if (data.checklist) noteParts.push(`Checklist: ${JSON.stringify(data.checklist)}`);
      if (data.photos && data.photos.length > 0) noteParts.push(`Photos: ${data.photos.join(', ')}`);

      const payload = {
        booking_id: Number(data.booking_id),
        record_type,
        mileage,
        fuel_level: fuelLevelNum,
        vehicle_condition: data.vehicle_condition || 'GOOD',
        damage_description: data.damage_description || null,
        late_fee: Number(data.late_fee || 0),
        extra_km_fee: Number(data.extra_km_fee || 0),
        fuel_fee: Number(data.fuel_fee || 0),
        cleaning_fee: Number(data.cleaning_fee || 0),
        damage_fee: Number(data.damage_fee || 0),
        refundable_deposit: Number(data.refundable_deposit || 0),
        note: noteParts.length > 0 ? noteParts.join(' | ') : null
      };

      const res = await axiosInstance.post('/handover-records', payload);
      return res.data.data;
    },

    getByBookingId: async (bookingId: string | number) => {
      const res = await axiosInstance.get(`/handover-records?booking_id=${bookingId}`);
      return res.data.data.handovers || [];
    },

    getAll: async (params?: { limit?: number }) => {
      const res = await axiosInstance.get(`/handover-records?limit=${params?.limit || 100}`);
      return res.data.data.handovers || [];
    },

    getById: async (id: string | number) => {
      const res = await axiosInstance.get(`/handover-records/${id}`);
      return res.data.data;
    }
  },

  // Payments API
  payments: {
    getAll: async (params?: { limit?: number }) => {
      const res = await axiosInstance.get(`/payments?limit=${params?.limit || 100}`);
      return res.data.data.payments || [];
    },

    getById: async (id: string | number) => {
      const res = await axiosInstance.get(`/payments/${id}`);
      return res.data.data;
    },

    create: async (data: {
      booking_id: string | number;
      transaction_type: 'DEPOSIT' | 'RENTAL' | 'SERVICE_FEE' | 'SURCHARGE' | 'REFUND';
      amount: number;
      payment_method: 'CASH' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO' | 'CREDIT_CARD';
      payment_reference?: string;
    }) => {
      const res = await axiosInstance.post('/payments', {
        ...data,
        booking_id: Number(data.booking_id)
      });
      return res.data.data;
    },

    confirm: async (id: string | number, reference?: string) => {
      const res = await axiosInstance.put(`/payments/${id}/confirm`, { reference });
      return res.data.data;
    }
  },

  // Reviews API
  reviews: {
    getAll: async (params?: { limit?: number }) => {
      const res = await axiosInstance.get(`/reviews?limit=${params?.limit || 100}`);
      return res.data.data.reviews || [];
    },
    getById: async (id: string | number) => {
      const res = await axiosInstance.get(`/reviews/${id}`);
      return res.data.data;
    },
    create: async (data: { booking_id: string | number; rating: number; content?: string; comment?: string }) => {
      const res = await axiosInstance.post('/reviews', {
        booking_id: Number(data.booking_id),
        rating: data.rating,
        content: data.content || data.comment || ''
      });
      return res.data.data;
    },
    updateStatus: async (id: string | number, status: 'APPROVED' | 'HIDDEN' | string) => {
      const res = await axiosInstance.put(`/reviews/${id}/status`, { status });
      return res.data.data;
    },
    delete: async (id: string | number) => {
      const res = await axiosInstance.delete(`/reviews/${id}`);
      return res.data;
    }
  },

  // Settings API
  settings: {
    getAll: async () => {
      const res = await axiosInstance.get('/settings');
      return res.data.data || [];
    },
    getByKey: async (key: string) => {
      const res = await axiosInstance.get(`/settings/${key}`);
      return res.data.data;
    },
    update: async (key: string, value: string, description?: string) => {
      const res = await axiosInstance.put(`/settings/${key}`, { value, description });
      return res.data.data;
    },
    saveBulk: async (settingsObj: Record<string, any>) => {
      const promises = Object.entries(settingsObj).map(([key, val]) =>
        axiosInstance.put(`/settings/${key}`, { value: String(val) })
      );
      await Promise.all(promises);
      return true;
    }
  },


  // Audit Logs API
  auditLogs: {
    getAll: async (params?: { limit?: number; page?: number; search?: string }) => {
      const limit = params?.limit || 25;
      const page = params?.page || 1;
      const searchParam = params?.search ? `&search=${encodeURIComponent(params.search)}` : '';
      const res = await axiosInstance.get(`/audit-logs?limit=${limit}&page=${page}&sortBy=id&sortOrder=desc${searchParam}`);
      return res.data.data.logs || [];
    },
    getById: async (id: string | number) => {
      const res = await axiosInstance.get(`/audit-logs/${id}`);
      return res.data.data;
    }
  }
};
