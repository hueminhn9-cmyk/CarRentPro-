export interface Vehicle {
  id: string;
  name: string;
  type: string; // 'Sedan' | 'SUV' | 'Bán tải' | 'Hatchback' | 'Xe điện'
  licensePlate: string;
  pricePerDay: number;
  status: 'Có sẵn' | 'Đang thuê' | 'Bảo dưỡng';
  image: string;
  transmission: 'Tự động' | 'Số sàn';
  fuel: 'Xăng' | 'Dầu' | 'Điện';
  seats: number;
  location: string;
  color: string;
  year: number;
  fuelConsumption: string;
  description: string;
  features: string[];
  insurance: string;
  rating: number;
  reviewsCount: number;
  maintenanceDue?: string;
  nextCheckup?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  insuranceFee: number;
  serviceFee: number;
  totalAmount: number;
  status: 'Chờ xác nhận' | 'Hoàn thành' | 'Đang thuê' | 'Đã hủy';
  paymentMethod: 'Chuyển khoản' | 'Thẻ tín dụng' | 'Ví điện tử';
  paymentStatus: 'Đã thanh toán' | 'Chờ thanh toán' | 'Hoàn tiền';
  paymentTime?: string;
  createdAt: string;
  contractSigned: boolean;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idCard: string;
  driverLicense: string;
  licenseStatus: 'Đã xác minh' | 'Chờ duyệt' | 'Chưa cập nhật';
  loyaltyPoints: number;
  tier: 'Bạc' | 'Vàng' | 'Kim cương';
  bookingCount: number;
  createdAt: string;
  frontImage?: string;
  backImage?: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  status: 'Đang hoạt động' | 'Tạm khóa';
  processedContractsCount: number;
  verifiedCustomersCount: number;
  avatar?: string;
  joinedDate: string;
}

export const INITIAL_MANAGERS: Manager[] = [
  {
    id: "MGR001",
    name: "Lê Văn Quản Lý",
    email: "manager@autorent.vn",
    phone: "0911223344",
    branch: "Chi nhánh Đà Nẵng - Hải Châu",
    status: "Đang hoạt động",
    processedContractsCount: 45,
    verifiedCustomersCount: 38,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager1",
    joinedDate: "2024-03-15"
  },
  {
    id: "MGR002",
    name: "Phạm Hoàng Sơn",
    email: "son.pham@autorent.vn",
    phone: "0933445566",
    branch: "Chi nhánh TP. HCM - Quận 3",
    status: "Đang hoạt động",
    processedContractsCount: 62,
    verifiedCustomersCount: 55,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager2",
    joinedDate: "2024-01-10"
  }
];

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  description: string;
  cost: number;
  startDate: string;
  endDate: string;
  status: 'Đang bảo dưỡng' | 'Hoàn thành';
}

export interface Contract {
  id: string;
  bookingCode: string;
  customerName: string;
  vehicleName: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  status: 'Đã ký' | 'Chờ ký' | 'Quá hạn';
  fileUrl: string;
}

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "V001",
    name: "VinFast VF 8 Plus",
    type: "Xe điện",
    licensePlate: "30K-888.88",
    pricePerDay: 1500000,
    status: "Có sẵn",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Điện",
    seats: 5,
    location: "Đà Nẵng",
    color: "Xanh dương",
    year: 2023,
    fuelConsumption: "0 l/100km (Pin 82 kWh)",
    description: "VinFast VF 8 Plus là dòng xe điện thông minh phân khúc D, sở hữu thiết kế sang trọng bởi Pininfarina, trang bị hệ thống hỗ trợ lái nâng cao ADAS cùng nhiều tính năng giải trí cao cấp.",
    features: ["Bản đồ GPS", "Hỗ trợ giữ làn", "Camera 360", "Ghế da nappa", "Cửa sổ trời toàn cảnh", "Apple CarPlay/Android Auto"],
    insurance: "Bảo hiểm vật chất 2 chiều (Mức khấu trừ 2,000,000đ/vụ)",
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: "V002",
    name: "Toyota Fortuner Legender",
    type: "SUV",
    licensePlate: "51K-999.99",
    pricePerDay: 1600000,
    status: "Đang thuê",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Dầu",
    seats: 7,
    location: "Đà Nẵng",
    color: "Trắng",
    year: 2022,
    fuelConsumption: "7.9 l/100km",
    description: "Toyota Fortuner Legender sở hữu thiết kế hầm hố, mạnh mẽ cùng động cơ dầu bền bỉ. Thích hợp cho những chuyến đi dài ngày hay du lịch gia đình trên mọi địa hình.",
    features: ["Hệ thống an toàn TSS", "Cốp điện", "Màn hình 9 inch", "Cảm biến đỗ xe trước sau", "Cruise Control"],
    insurance: "Bảo hiểm vật chất 2 chiều tiêu chuẩn",
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: "V003",
    name: "Honda Civic RS",
    type: "Sedan",
    licensePlate: "43A-777.77",
    pricePerDay: 1100000,
    status: "Có sẵn",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Xăng",
    seats: 5,
    location: "Đà Nẵng",
    color: "Đỏ",
    year: 2023,
    fuelConsumption: "6.5 l/100km",
    description: "Honda Civic RS mang phong cách thể thao, cảm giác lái phấn khích hàng đầu phân khúc C. Xe trang bị gói an toàn chủ động Honda SENSING bảo vệ tối ưu hành trình.",
    features: ["Honda SENSING", "Đề nổ từ xa", "Ghế da thể thao", "Loa Bose", "Chế độ lái Sport"],
    insurance: "Bảo hiểm vật chất 2 chiều tiêu chuẩn",
    rating: 4.7,
    reviewsCount: 18
  },
  {
    id: "V004",
    name: "Ford Ranger Wildtrak 2.0 Bi-Turbo",
    type: "Bán tải",
    licensePlate: "29H-123.45",
    pricePerDay: 1300000,
    status: "Bảo dưỡng",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Dầu",
    seats: 5,
    location: "Đà Nẵng",
    color: "Cam",
    year: 2022,
    fuelConsumption: "8.0 l/100km",
    description: "Ford Ranger Wildtrak dẫn đầu phân khúc bán tải nhờ thiết kế cơ bắp đậm chất Mỹ, khả năng lội nước vượt trội 800mm cùng công nghệ an toàn ngập tràn.",
    features: ["Dẫn động 2 cầu (4x4)", "Hỗ trợ đổ đèo", "Màn hình dọc 12 inch", "Hệ thống Ford SYNC 4", "Nắp thùng cuộn điện"],
    insurance: "Bảo hiểm vật chất 2 chiều cao cấp",
    rating: 4.6,
    reviewsCount: 35,
    maintenanceDue: "2026-07-15",
    nextCheckup: "Thay dầu động cơ & lọc nhớt định kỳ"
  },
  {
    id: "V005",
    name: "Mazda CX-5 Premium",
    type: "SUV",
    licensePlate: "30F-654.32",
    pricePerDay: 1200000,
    status: "Có sẵn",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Xăng",
    seats: 5,
    location: "Đà Nẵng",
    color: "Trắng",
    year: 2023,
    fuelConsumption: "7.2 l/100km",
    description: "Mazda CX-5 Premium sở hữu ngôn ngữ thiết kế KODO tinh tế, không gian nội thất yên tĩnh, cao cấp và hệ thống âm thanh 10 loa Bose mang đến trải nghiệm tuyệt vời.",
    features: ["Cảnh báo điểm mù", "HUD (Hiển thị kính lái)", "10 Loa Bose", "Cốp điện thông minh", "Ghế điện có nhớ vị trí"],
    insurance: "Bảo hiểm vật chất 2 chiều tiêu chuẩn",
    rating: 4.8,
    reviewsCount: 50
  },
  {
    id: "V006",
    name: "Hyundai Accent Athle",
    type: "Sedan",
    licensePlate: "51G-246.80",
    pricePerDay: 800000,
    status: "Có sẵn",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format&fit=crop&q=60",
    transmission: "Tự động",
    fuel: "Xăng",
    seats: 5,
    location: "Đà Nẵng",
    color: "Đen",
    year: 2022,
    fuelConsumption: "6.0 l/100km",
    description: "Hyundai Accent là dòng sedan cỡ B cực kỳ kinh tế, dễ vận hành trong phố thị, nội thất tiện nghi đầy đủ và mức tiêu hao nhiên liệu vô cùng tiết kiệm.",
    features: ["Bản đồ tích hợp", "Cửa sổ trời", "Đề nổ nút bấm", "Điều hòa tự động", "Cảm biến lùi"],
    insurance: "Bảo hiểm vật chất 2 chiều tiêu chuẩn",
    rating: 4.5,
    reviewsCount: 65
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "C001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    address: "123 Đường Láng, Láng Thượng, Đống Đa, Hà Nội",
    idCard: "001095012345",
    driverLicense: "GPLX12345678",
    licenseStatus: "Đã xác minh",
    loyaltyPoints: 1250,
    tier: "Vàng",
    bookingCount: 12,
    createdAt: "2025-01-10T08:30:00Z"
  },
  {
    id: "C002",
    name: "Trần Thị B",
    email: "tranthib@yahoo.com",
    phone: "0987654321",
    address: "456 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
    idCard: "002096054321",
    driverLicense: "GPLX87654321",
    licenseStatus: "Chờ duyệt",
    loyaltyPoints: 300,
    tier: "Bạc",
    bookingCount: 3,
    createdAt: "2025-04-12T14:20:00Z"
  },
  {
    id: "C003",
    name: "Phạm Minh C",
    email: "phamminhc@hotmail.com",
    phone: "0912345678",
    address: "789 Lê Lợi, Hải Châu, Đà Nẵng",
    idCard: "003097011223",
    driverLicense: "GPLX99999999",
    licenseStatus: "Chưa cập nhật",
    loyaltyPoints: 0,
    tier: "Bạc",
    bookingCount: 0,
    createdAt: "2026-07-01T10:00:00Z"
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "B001",
    bookingCode: "AR-20260712-001",
    customerId: "C001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyenvana@gmail.com",
    vehicleId: "V002",
    vehicleName: "Toyota Fortuner Legender",
    vehicleImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    pickupLocation: "Quận 3, TP. Hồ Chí Minh",
    dropoffLocation: "Quận 3, TP. Hồ Chí Minh",
    totalDays: 5,
    pricePerDay: 1600000,
    subtotal: 8000000,
    insuranceFee: 500000,
    serviceFee: 100000,
    totalAmount: 8600000,
    status: "Đang thuê",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Đã thanh toán",
    paymentTime: "2026-07-09T15:30:00Z",
    createdAt: "2026-07-09T15:20:00Z",
    contractSigned: true,
    notes: "Khách hàng yêu cầu giao xe tại địa chỉ nhà riêng trước 8h sáng."
  },
  {
    id: "B002",
    bookingCode: "AR-20260712-002",
    customerId: "C002",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    customerEmail: "tranthib@yahoo.com",
    vehicleId: "V001",
    vehicleName: "VinFast VF 8 Plus",
    vehicleImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60",
    startDate: "2026-07-14",
    endDate: "2026-07-17",
    pickupLocation: "Quận Cầu Giấy, Hà Nội",
    dropoffLocation: "Quận Cầu Giấy, Hà Nội",
    totalDays: 3,
    pricePerDay: 1500000,
    subtotal: 4500000,
    insuranceFee: 300000,
    serviceFee: 100000,
    totalAmount: 4900000,
    status: "Chờ xác nhận",
    paymentMethod: "Thẻ tín dụng",
    paymentStatus: "Chờ thanh toán",
    createdAt: "2026-07-12T10:15:00Z",
    contractSigned: false
  },
  {
    id: "B003",
    bookingCode: "AR-20260712-003",
    customerId: "C001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyenvana@gmail.com",
    vehicleId: "V005",
    vehicleName: "Mazda CX-5 Premium",
    vehicleImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60",
    startDate: "2026-06-01",
    endDate: "2026-06-04",
    pickupLocation: "Quận Đống Đa, Hà Nội",
    dropoffLocation: "Quận Đống Đa, Hà Nội",
    totalDays: 3,
    pricePerDay: 1200000,
    subtotal: 3600000,
    insuranceFee: 300000,
    serviceFee: 100000,
    totalAmount: 4000000,
    status: "Hoàn thành",
    paymentMethod: "Ví điện tử",
    paymentStatus: "Đã thanh toán",
    paymentTime: "2026-05-31T20:00:00Z",
    createdAt: "2026-05-31T19:45:00Z",
    contractSigned: true
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: "M001",
    vehicleId: "V004",
    vehicleName: "Ford Ranger Wildtrak 2.0 Bi-Turbo",
    licensePlate: "29H-123.45",
    description: "Thay dầu động cơ, thay lọc nhớt, vệ sinh hệ thống phanh, đảo lốp định kỳ 20,000km.",
    cost: 2500000,
    startDate: "2026-07-11",
    endDate: "2026-07-13",
    status: "Đang bảo dưỡng"
  },
  {
    id: "M002",
    vehicleId: "V003",
    vehicleName: "Honda Civic RS",
    licensePlate: "43A-777.77",
    description: "Sơn dặm xước cản trước và bảo dưỡng hệ thống điều hòa.",
    cost: 4200000,
    startDate: "2026-06-15",
    endDate: "2026-06-17",
    status: "Hoàn thành"
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "CON001",
    bookingCode: "AR-20260712-001",
    customerName: "Nguyễn Văn A",
    vehicleName: "Toyota Fortuner Legender",
    licensePlate: "51K-999.99",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    status: "Đã ký",
    fileUrl: "#"
  },
  {
    id: "CON002",
    bookingCode: "AR-20260712-002",
    customerName: "Trần Thị B",
    vehicleName: "VinFast VF 8 Plus",
    licensePlate: "30K-888.88",
    startDate: "2026-07-14",
    endDate: "2026-07-17",
    status: "Chờ ký",
    fileUrl: "#"
  }
];

export const REVENUE_MONTHLY = [
  { month: "T1", revenue: 45000000, bookings: 12 },
  { month: "T2", revenue: 52000000, bookings: 15 },
  { month: "T3", revenue: 78000000, bookings: 22 },
  { month: "T4", revenue: 95000000, bookings: 28 },
  { month: "T5", revenue: 120000000, bookings: 35 },
  { month: "T6", revenue: 145000000, bookings: 42 },
  { month: "T7", revenue: 180000000, bookings: 54 }
];

export const FLEET_STATUS = [
  { name: "Có sẵn", value: 4, color: "#52c41a" },
  { name: "Đang thuê", value: 1, color: "#1677ff" },
  { name: "Bảo dưỡng", value: 1, color: "#faad14" }
];

export const VEHICLE_TYPES_STAT = [
  { type: "SUV", value: 25, revenue: 120000000 },
  { type: "Sedan", value: 40, revenue: 160000000 },
  { type: "Bán tải", value: 15, revenue: 70000000 },
  { type: "Xe điện", value: 20, revenue: 95000000 }
];
