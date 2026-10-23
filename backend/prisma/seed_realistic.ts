import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu nạp BỘ SEED DATA SỐNG ĐỘNG (AutoRent Realistic Seeder)...');

  const passwordHashAdmin = bcrypt.hashSync('123456', 10);
  const passwordHashManager = bcrypt.hashSync('123456', 10);
  const passwordHashCustomer = bcrypt.hashSync('123456', 10);

  // 1. Locations
  console.log('📍 1. Đảm bảo Showroom Locations...');
  const locations = [
    { name: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng', city: 'Đà Nẵng', district: 'Hải Châu', address: '123 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng' },
    { name: 'Sân bay Quốc tế Đà Nẵng', city: 'Đà Nẵng', district: 'Hải Châu', address: 'Cổng Ga Đến Quốc Tế, Sân bay Đà Nẵng' },
    { name: 'Chi nhánh Hà Nội - Cầu Giấy', city: 'Hà Nội', district: 'Cầu Giấy', address: '68 Cầu Giấy, Quận Cầu Giấy, Hà Nội' },
    { name: 'Chi nhánh TP. HCM - Quận 1', city: 'TP. Hồ Chí Minh', district: 'Quận 1', address: '150 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh' },
  ];

  const dbLocations: any[] = [];
  for (const loc of locations) {
    const l = await prisma.locations.upsert({
      where: { name: loc.name },
      update: loc,
      create: loc,
    });
    dbLocations.push(l);
  }
  const defaultLoc = dbLocations[0];

  // 2. Categories
  console.log('🚙 2. Đảm bảo Danh mục xe (Vehicle Categories)...');
  const categories = [
    { name: 'Sedan', description: 'Xe 4-5 chỗ, kiểu dáng thanh lịch, phù hợp di chuyển đô thị.' },
    { name: 'SUV', description: 'Xe gầm cao 5-7 chỗ, mạnh mẽ, phù hợp đi đường dài và địa hình.' },
    { name: 'Hatchback', description: 'Xe nhỏ gọn 5 chỗ, cốp liền, dễ dàng di chuyển trong phố.' },
    { name: 'Pickup', description: 'Xe bán tải đa dụng, động cơ mạnh mẽ, khoang chở hàng rộng.' },
    { name: 'Luxury', description: 'Dòng xe hạng sang cao cấp, trang bị hiện đại và tiện nghi.' },
  ];

  const dbCats: Record<string, any> = {};
  for (const c of categories) {
    const cat = await prisma.vehicle_categories.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: c,
    });
    dbCats[c.name] = cat;
  }

  // 3. Admin & Managers
  console.log('👤 3. Đảm bảo Tài khoản Quản trị & Điều phối...');
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@autorent.vn' },
    update: { full_name: 'Quản trị viên Hệ thống', phone: '0901234567', role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email: 'admin@autorent.vn',
      full_name: 'Quản trị viên Hệ thống',
      phone: '0901234567',
      password_hash: passwordHashAdmin,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    }
  });

  const managerUser = await prisma.users.upsert({
    where: { email: 'manager@autorent.vn' },
    update: { full_name: 'Nguyễn Văn Quản Lý', phone: '0911223344', role: 'MANAGER', status: 'ACTIVE' },
    create: {
      email: 'manager@autorent.vn',
      full_name: 'Nguyễn Văn Quản Lý',
      phone: '0911223344',
      password_hash: passwordHashManager,
      role: 'MANAGER',
      status: 'ACTIVE',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    }
  });

  // 4. Customers - 5 PENDING for Verification Queue + other active customers
  console.log('🪪 4. Tạo Hồ sơ Khách hàng & 5 GPLX PENDING cho Verification Queue...');
  const pendingCustomers = [
    {
      email: 'lehoanglong.pending@gmail.com',
      full_name: 'Lê Hoàng Long',
      phone: '0905112233',
      address: '24 Trần Phú, Q. Hải Châu, Đà Nẵng',
      citizen_id: '048098001122',
      license: 'GPLX-480981122',
      dob: new Date('1998-04-12'),
      expiry: new Date('2032-04-12'),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      citizenFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      citizenBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
      licenseFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      licenseBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
    },
    {
      email: 'tranthithutrang.pending@gmail.com',
      full_name: 'Trần Thị Thu Trang',
      phone: '0905223344',
      address: '88 Nguyễn Hữu Thọ, Q. Cẩm Lệ, Đà Nẵng',
      citizen_id: '048095002233',
      license: 'GPLX-480952233',
      dob: new Date('1995-09-20'),
      expiry: new Date('2030-09-20'),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      citizenFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      citizenBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
      licenseFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      licenseBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
    },
    {
      email: 'phamquocbaovn.pending@gmail.com',
      full_name: 'Phạm Quốc Bảo',
      phone: '0905334455',
      address: '105 Võ Nguyên Giáp, Q. Sơn Trà, Đà Nẵng',
      citizen_id: '048092003344',
      license: 'GPLX-480923344',
      dob: new Date('1992-01-15'),
      expiry: new Date('2031-01-15'),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      citizenFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      citizenBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
      licenseFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      licenseBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
    },
    {
      email: 'nguyenmaidung.pending@gmail.com',
      full_name: 'Nguyễn Mai Dung',
      phone: '0905445566',
      address: '42 Điện Biên Phủ, Q. Thanh Khê, Đà Nẵng',
      citizen_id: '048097004455',
      license: 'GPLX-480974455',
      dob: new Date('1997-11-05'),
      expiry: new Date('2032-11-05'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      citizenFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      citizenBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
      licenseFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      licenseBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
    },
    {
      email: 'dangvanhung.pending@gmail.com',
      full_name: 'Đặng Văn Hùng',
      phone: '0905556677',
      address: '15 Lê Duẩn, Q. Hải Châu, Đà Nẵng',
      citizen_id: '048090005566',
      license: 'GPLX-480905566',
      dob: new Date('1990-07-28'),
      expiry: new Date('2029-07-28'),
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      citizenFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      citizenBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
      licenseFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      licenseBack: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60',
    }
  ];

  for (const pc of pendingCustomers) {
    const user = await prisma.users.upsert({
      where: { email: pc.email },
      update: { full_name: pc.full_name, phone: pc.phone, role: 'CUSTOMER', status: 'ACTIVE' },
      create: {
        email: pc.email,
        full_name: pc.full_name,
        phone: pc.phone,
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        avatar_url: pc.avatar
      }
    });

    const prof = await prisma.customer_profiles.upsert({
      where: { user_id: user.id },
      update: {
        address: pc.address,
        citizen_id: pc.citizen_id,
        driver_license_number: pc.license,
        driver_license_expiry: pc.expiry,
        date_of_birth: pc.dob,
        verification_status: 'PENDING'
      },
      create: {
        user_id: user.id,
        address: pc.address,
        citizen_id: pc.citizen_id,
        driver_license_number: pc.license,
        driver_license_expiry: pc.expiry,
        date_of_birth: pc.dob,
        verification_status: 'PENDING'
      }
    });

    // Create media files for OCR / verification queue
    await prisma.media_files.deleteMany({
      where: { entity_type: 'CUSTOMER_PROFILE', entity_id: prof.id }
    });

    await prisma.media_files.createMany({
      data: [
        {
          entity_type: 'CUSTOMER_PROFILE',
          entity_id: prof.id,
          media_type: 'IMAGE',
          category: 'CITIZEN_FRONT',
          original_name: 'cccd_front.jpg',
          stored_name: `cccd_front_${prof.id}.jpg`,
          file_path: pc.citizenFront,
          uploaded_by: user.id,
        },
        {
          entity_type: 'CUSTOMER_PROFILE',
          entity_id: prof.id,
          media_type: 'IMAGE',
          category: 'CITIZEN_BACK',
          original_name: 'cccd_back.jpg',
          stored_name: `cccd_back_${prof.id}.jpg`,
          file_path: pc.citizenBack,
          uploaded_by: user.id,
        },
        {
          entity_type: 'CUSTOMER_PROFILE',
          entity_id: prof.id,
          media_type: 'IMAGE',
          category: 'LICENSE_FRONT',
          original_name: 'gplx_front.jpg',
          stored_name: `gplx_front_${prof.id}.jpg`,
          file_path: pc.licenseFront,
          uploaded_by: user.id,
        },
        {
          entity_type: 'CUSTOMER_PROFILE',
          entity_id: prof.id,
          media_type: 'IMAGE',
          category: 'LICENSE_BACK',
          original_name: 'gplx_back.jpg',
          stored_name: `gplx_back_${prof.id}.jpg`,
          file_path: pc.licenseBack,
          uploaded_by: user.id,
        }
      ]
    });
  }

  // Active verified customers for bookings
  const verifiedCustomerEmails = [
    'nguyenhoangnam@gmail.com',
    'vuongthimyhanh@gmail.com',
    'buituananh@gmail.com',
    'dangthuha@gmail.com',
    'ngothanhvan@gmail.com',
  ];

  const allActiveCustomers: any[] = [];
  for (let i = 0; i < verifiedCustomerEmails.length; i++) {
    const email = verifiedCustomerEmails[i];
    const user = await prisma.users.upsert({
      where: { email },
      update: { role: 'CUSTOMER', status: 'ACTIVE' },
      create: {
        email,
        full_name: `Khách hàng VIP 0${i + 1}`,
        phone: `090900000${i + 1}`,
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      }
    });

    await prisma.customer_profiles.upsert({
      where: { user_id: user.id },
      update: { verification_status: 'VERIFIED' },
      create: {
        user_id: user.id,
        address: 'Đà Nẵng / Hà Nội / TP.HCM',
        citizen_id: `04809${i}001234`,
        driver_license_number: `GPLX-04809${i}123`,
        driver_license_expiry: new Date('2032-01-01'),
        date_of_birth: new Date('1993-05-10'),
        verification_status: 'VERIFIED'
      }
    });

    allActiveCustomers.push(user);
  }

  // 5. Fleet (10 Hot models requested by Master Prompt)
  console.log('🚗 5. Đảm bảo Đội xe Hot (Fleet) đầy đủ biển số & thông số...');
  const fleetSpecs = [
    {
      code: 'VF9',
      name: 'VinFast VF 9 Plus',
      brand: 'VinFast',
      model: 'VF 9 Plus',
      category: 'Luxury',
      manufacture_year: 2024,
      license_plate: '43A-999.88',
      color: 'Xanh Deep Ocean',
      seat_count: 6,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      price_per_day: new Prisma.Decimal(2500000),
      deposit_amount: new Prisma.Decimal(25000000),
      location: 'Đà Nẵng',
      description: 'VinFast VF 9 Plus - Flagship SUV điện 6 chỗ ghế cơ trưởng cao cấp, nội thất da Nappa sang trọng.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'VF8',
      name: 'VinFast VF 8 Plus',
      brand: 'VinFast',
      model: 'VF 8 Plus',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '30K-888.66',
      color: 'Đỏ Crimson Red',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      price_per_day: new Prisma.Decimal(1600000),
      deposit_amount: new Prisma.Decimal(15000000),
      location: 'Hà Nội',
      description: 'VinFast VF 8 Plus - SUV điện cỡ D, tăng tốc 0-100km/h chỉ 5.5 giây, công nghệ ADAS tự hành cấp 2.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'VF6',
      name: 'VinFast VF 6 Plus',
      brand: 'VinFast',
      model: 'VF 6 Plus',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '51K-666.22',
      color: 'Bạc Desat Silver',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      price_per_day: new Prisma.Decimal(1100000),
      deposit_amount: new Prisma.Decimal(10000000),
      location: 'TP. Hồ Chí Minh',
      description: 'VinFast VF 6 Plus - Crossover điện đô thị thời thượng do studio Torino Design chắp bút.',
      status: 'MAINTENANCE' as const, // For Maintenance test
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'VF3',
      name: 'VinFast VF 3',
      brand: 'VinFast',
      model: 'VF 3',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '30L-333.99',
      color: 'Vàng Nắng',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      price_per_day: new Prisma.Decimal(650000),
      deposit_amount: new Prisma.Decimal(6000000),
      location: 'Hà Nội',
      description: 'VinFast VF 3 - Mini SUV điện gây sốt thị trường, gầm cao 191mm, cá tính và linh hoạt phố đông.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'MB_C300',
      name: 'Mercedes-Benz C300 AMG',
      brand: 'Mercedes-Benz',
      model: 'C300 AMG',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '43A-300.99',
      color: 'Trắng Polar White',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      price_per_day: new Prisma.Decimal(2800000),
      deposit_amount: new Prisma.Decimal(30000000),
      location: 'Đà Nẵng',
      description: 'Mercedes C300 AMG trang bị gói thể thao AMG Line, đèn Digital Light và màn hình trung tâm 11.9 inch.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'MB_E300',
      name: 'Mercedes-Benz E300 AMG',
      brand: 'Mercedes-Benz',
      model: 'E300 AMG',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '51K-300.88',
      color: 'Đen Obsidian Black',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      price_per_day: new Prisma.Decimal(3800000),
      deposit_amount: new Prisma.Decimal(40000000),
      location: 'TP. Hồ Chí Minh',
      description: 'Mercedes E300 AMG - Biểu tượng doanh nhân đỉnh cao với hệ thống âm thanh Burmester 13 loa.',
      status: 'MAINTENANCE' as const, // For Maintenance test
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'BMW_320I',
      name: 'BMW 320i Sport-Line',
      brand: 'BMW',
      model: '320i',
      category: 'Sedan',
      manufacture_year: 2023,
      license_plate: '30H-320.11',
      color: 'Xanh Phytonic Blue',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      price_per_day: new Prisma.Decimal(2200000),
      deposit_amount: new Prisma.Decimal(20000000),
      location: 'Hà Nội',
      description: 'BMW 320i Sport-Line dẫn động cầu sau kinh điển, tỷ lệ phân bổ trọng lượng hoàn hảo 50:50.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'TOY_CAMRY',
      name: 'Toyota Camry 2.5Q',
      brand: 'Toyota',
      model: 'Camry 2.5Q',
      category: 'Sedan',
      manufacture_year: 2023,
      license_plate: '43A-250.77',
      color: 'Đen Ánh Kim',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      price_per_day: new Prisma.Decimal(1500000),
      deposit_amount: new Prisma.Decimal(15000000),
      location: 'Đà Nẵng',
      description: 'Toyota Camry 2.5Q - Chuẩn mực sedan doanh nhân, hàng ghế thương gia ngả điện và rèm che nắng.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'FORD_RAPTOR',
      name: 'Ford Ranger Raptor 2.0 Bi-Turbo',
      brand: 'Ford',
      model: 'Ranger Raptor',
      category: 'Pickup',
      manufacture_year: 2023,
      license_plate: '29H-999.11',
      color: 'Xám Conquer Grey',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'DIESEL' as const,
      price_per_day: new Prisma.Decimal(2000000),
      deposit_amount: new Prisma.Decimal(20000000),
      location: 'Hà Nội',
      description: 'Ford Ranger Raptor trang bị phuộc FOX 2.5 inch Live Valve đỉnh cao, chế độ lái Baja đường cát.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    },
    {
      code: 'POR_MACAN',
      name: 'Porsche Macan GTS',
      brand: 'Porsche',
      model: 'Macan GTS',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '51K-888.99',
      color: 'Đỏ Carmine Red',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      price_per_day: new Prisma.Decimal(5500000),
      deposit_amount: new Prisma.Decimal(50000000),
      location: 'TP. Hồ Chí Minh',
      description: 'Porsche Macan GTS động cơ 2.9L V6 Biturbo 434 mã lực, bô thể thao Sport Exhaust gầm rú uy lực.',
      status: 'AVAILABLE' as const,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    }
  ];

  const dbVehicles: Record<string, any> = {};
  for (const v of fleetSpecs) {
    const existing = await prisma.vehicles.findFirst({
      where: { OR: [{ code: v.code }, { license_plate: v.license_plate }] }
    });

    const categoryId = dbCats[v.category]?.id || dbCats['Sedan'].id;

    if (existing) {
      dbVehicles[v.code] = await prisma.vehicles.update({
        where: { id: existing.id },
        data: {
          category_id: categoryId,
          location_id: defaultLoc.id,
          code: v.code,
          name: v.name,
          brand: v.brand,
          model: v.model,
          manufacture_year: v.manufacture_year,
          license_plate: v.license_plate,
          color: v.color,
          seat_count: v.seat_count,
          transmission: v.transmission,
          fuel_type: v.fuel_type,
          price_per_day: v.price_per_day,
          deposit_amount: v.deposit_amount,
          current_mileage: 25000,
          included_km_per_day: 300,
          extra_km_fee: new Prisma.Decimal(5000),
          description: v.description,
          status: v.status
        }
      });
    } else {
      dbVehicles[v.code] = await prisma.vehicles.create({
        data: {
          category_id: categoryId,
          location_id: defaultLoc.id,
          code: v.code,
          name: v.name,
          brand: v.brand,
          model: v.model,
          manufacture_year: v.manufacture_year,
          license_plate: v.license_plate,
          color: v.color,
          seat_count: v.seat_count,
          transmission: v.transmission,
          fuel_type: v.fuel_type,
          price_per_day: v.price_per_day,
          deposit_amount: v.deposit_amount,
          current_mileage: 25000,
          included_km_per_day: 300,
          extra_km_fee: new Prisma.Decimal(5000),
          description: v.description,
          status: v.status
        }
      });
    }

    // Save image to media_files for vehicle
    if (v.image && dbVehicles[v.code]) {
      const vehId = dbVehicles[v.code].id;
      await prisma.media_files.deleteMany({
        where: { entity_type: 'VEHICLE', entity_id: vehId }
      });
      await prisma.media_files.create({
        data: {
          entity_type: 'VEHICLE',
          entity_id: vehId,
          media_type: 'IMAGE',
          category: 'VEHICLE_FRONT',
          original_name: `${v.code}_front.jpg`,
          stored_name: `${v.code}_front.jpg`,
          file_path: v.image,
          is_primary: true
        }
      });
    }
  }

  // 6. Maintenance records (7 items: 2 OVERDUE, 3 SCHEDULED, 2 IN_PROGRESS)
  console.log('🔧 6. Tạo 7 Lịch bảo dưỡng (2 Quá hạn, 3 Sắp đến hạn, 2 Đang trong xưởng)...');
  await prisma.maintenance_records.deleteMany({
    where: {
      vehicle_id: { in: Object.values(dbVehicles).map(v => v.id) }
    }
  });

  const now = new Date();
  const past7Days = new Date(now.getTime() - 7 * 86400000);
  const past10Days = new Date(now.getTime() - 10 * 86400000);
  const next3Days = new Date(now.getTime() + 3 * 86400000);
  const next5Days = new Date(now.getTime() + 5 * 86400000);
  const next7Days = new Date(now.getTime() + 7 * 86400000);
  const yesterday = new Date(now.getTime() - 86400000);

  const maintenanceSeeds = [
    // 2 OVERDUE
    {
      vehicleId: dbVehicles['TOY_CAMRY'].id,
      maintenance_type: 'Bảo dưỡng phanh & Thay dầu hộp số',
      scheduled_date: past7Days,
      cost: new Prisma.Decimal(3200000),
      status: 'OVERDUE' as const,
      description: 'Gara Toyota Cầu Giấy - Đã quá hạn 7 ngày chưa đưa xe vào xưởng!',
    },
    {
      vehicleId: dbVehicles['FORD_RAPTOR'].id,
      maintenance_type: 'Kiểm định an toàn kỹ thuật định kỳ',
      scheduled_date: past10Days,
      cost: new Prisma.Decimal(1500000),
      status: 'OVERDUE' as const,
      description: 'Trung tâm Đăng kiểm 29-03V - Cảnh báo đỏ: Quá hạn kiểm định an toàn!',
    },
    // 3 SCHEDULED
    {
      vehicleId: dbVehicles['VF8'].id,
      maintenance_type: 'Kiểm tra pin cao áp & Cân bằng góc đặt bánh xe',
      scheduled_date: next3Days,
      cost: new Prisma.Decimal(1200000),
      status: 'SCHEDULED' as const,
      description: 'Xưởng dịch vụ VinFast Times City - Bảo dưỡng định kỳ 20,000 km',
    },
    {
      vehicleId: dbVehicles['MB_C300'].id,
      maintenance_type: 'Bảo dưỡng định kỳ cấp B (Dầu Mobil 1 & Lọc gió)',
      scheduled_date: next5Days,
      cost: new Prisma.Decimal(4500000),
      status: 'SCHEDULED' as const,
      description: 'Mercedes-Benz Haxaco Đà Nẵng - Thay lọc gió điều hòa than hoạt tính',
    },
    {
      vehicleId: dbVehicles['BMW_320I'].id,
      maintenance_type: 'Thay má phanh trước & Kiểm tra thước lái',
      scheduled_date: next7Days,
      cost: new Prisma.Decimal(3800000),
      status: 'SCHEDULED' as const,
      description: 'BMW Euro Auto Long Biên - Kiểm tra độ mòn cảm biến má phanh',
    },
    // 2 IN_PROGRESS (Xe ở trạng thái MAINTENANCE)
    {
      vehicleId: dbVehicles['VF6'].id,
      maintenance_type: 'Sửa chữa và thay thế cảm biến hỗ trợ đỗ xe sau',
      scheduled_date: yesterday,
      cost: new Prisma.Decimal(2800000),
      status: 'IN_PROGRESS' as const,
      description: 'VinFast Service Đông Sài Gòn - Xe đang nằm cầu nâng kiểm tra hệ thống dây dẫn radar',
    },
    {
      vehicleId: dbVehicles['MB_E300'].id,
      maintenance_type: 'Hiệu chỉnh van hệ thống treo khí nén Airmatic',
      scheduled_date: yesterday,
      cost: new Prisma.Decimal(8200000),
      status: 'IN_PROGRESS' as const,
      description: 'Mercedes-Benz Vietnam Star Trường Chinh - Đang đặt van khí nén mới từ Đức',
    }
  ];

  for (const ms of maintenanceSeeds) {
    await prisma.maintenance_records.create({
      data: {
        vehicle_id: ms.vehicleId,
        maintenance_type: ms.maintenance_type,
        scheduled_date: ms.scheduled_date,
        cost: ms.cost,
        status: ms.status,
        description: ms.description,
        created_by: managerUser.id,
      }
    });
  }

  // 7. Bookings - 29 Bookings covering Today's operations and 6 Kanban columns
  console.log('📋 7. Tạo 29 Đơn thuê xe đa dạng (Hôm nay: 3 Nhận, 3 Trả; Đủ 6 cột Kanban)...');
  
  // Date definitions
  const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
  const todayAfternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
  const threeDaysAgoMorning = new Date(now.getTime() - 3 * 86400000);
  const fourDaysAgoMorning = new Date(now.getTime() - 4 * 86400000);
  const inThreeDays = new Date(now.getTime() + 3 * 86400000);
  const inTwoDays = new Date(now.getTime() + 2 * 86400000);
  const inFourDays = new Date(now.getTime() + 4 * 86400000);
  const inOneDay = new Date(now.getTime() + 1 * 86400000);

  // Helper to upsert booking and related records
  const createBookingData = async (b: {
    code: string;
    vehicleId: bigint;
    customerId: bigint;
    pickup: Date;
    returnDate: Date;
    days: number;
    fee: number;
    deposit: number;
    total: number;
    status: any;
    payStatus: any;
    note?: string;
    contractStatus?: 'PENDING_SIGN' | 'SIGNED';
    pickupOdo?: number;
    returnOdo?: number;
    review?: { rating: number; content: string; status: 'APPROVED' | 'PENDING' | 'HIDDEN' };
  }) => {
    // Upsert booking
    let booking = await prisma.bookings.findUnique({ where: { booking_code: b.code } });
    if (booking) {
      booking = await prisma.bookings.update({
        where: { id: booking.id },
        data: {
          vehicle_id: b.vehicleId,
          customer_id: b.customerId,
          pickup_datetime: b.pickup,
          return_datetime: b.returnDate,
          rental_days: b.days,
          rental_fee: new Prisma.Decimal(b.fee),
          deposit_amount: new Prisma.Decimal(b.deposit),
          total_amount: new Prisma.Decimal(b.total),
          status: b.status,
          payment_status: b.payStatus,
          customer_note: b.note || '',
        }
      });
    } else {
      booking = await prisma.bookings.create({
        data: {
          booking_code: b.code,
          vehicle_id: b.vehicleId,
          customer_id: b.customerId,
          pickup_datetime: b.pickup,
          return_datetime: b.returnDate,
          pickup_location: 'Showroom Chi Nhánh Trung Tâm - Hải Châu, Đà Nẵng',
          return_location: 'Showroom Chi Nhánh Trung Tâm - Hải Châu, Đà Nẵng',
          rental_days: b.days,
          rental_fee: new Prisma.Decimal(b.fee),
          deposit_amount: new Prisma.Decimal(b.deposit),
          total_amount: new Prisma.Decimal(b.total),
          status: b.status,
          payment_status: b.payStatus,
          customer_note: b.note || '',
        }
      });
    }

    // Status History
    await prisma.booking_status_history.deleteMany({ where: { booking_id: booking.id } });
    await prisma.booking_status_history.create({
      data: {
        booking_id: booking.id,
        status: b.status,
        changed_by: managerUser.id,
        reason: `Cập nhật trạng thái thành ${b.status} trong quy trình vận hành`,
      }
    });

    // Contract
    if (b.contractStatus) {
      await prisma.contracts.upsert({
        where: { booking_id: booking.id },
        update: {
          status: b.contractStatus,
          signed_at: b.contractStatus === 'SIGNED' ? new Date() : null,
          contract_url: 'https://autorent.vn/contracts/HD-DIENTU.pdf'
        },
        create: {
          booking_id: booking.id,
          contract_code: `HD-${b.code}`,
          status: b.contractStatus,
          signed_at: b.contractStatus === 'SIGNED' ? new Date() : null,
          contract_url: 'https://autorent.vn/contracts/HD-DIENTU.pdf'
        }
      });
    }

    // Handover records
    await prisma.handover_records.deleteMany({ where: { booking_id: booking.id } });
    if (b.pickupOdo !== undefined) {
      await prisma.handover_records.create({
        data: {
          booking_id: booking.id,
          record_type: 'PICKUP',
          recorded_by: managerUser.id,
          recorded_at: b.pickup,
          mileage: b.pickupOdo,
          fuel_level: 100,
          vehicle_condition: 'EXCELLENT',
          note: 'Xe sạch sẽ, đầy bình, thân vỏ không vết xước.'
        }
      });
    }
    if (b.returnOdo !== undefined) {
      await prisma.handover_records.create({
        data: {
          booking_id: booking.id,
          record_type: 'RETURN',
          recorded_by: managerUser.id,
          recorded_at: b.returnDate,
          mileage: b.returnOdo,
          fuel_level: 100,
          vehicle_condition: 'EXCELLENT',
          refundable_deposit: new Prisma.Decimal(b.deposit),
          note: 'Xe nguyên trạng, hoàn 100% tiền cọc cho khách.'
        }
      });
    }

    // Reviews
    if (b.review) {
      await prisma.reviews.upsert({
        where: { booking_id: booking.id },
        update: {
          rating: b.review.rating,
          content: b.review.content,
          status: b.review.status
        },
        create: {
          booking_id: booking.id,
          customer_id: b.customerId,
          vehicle_id: b.vehicleId,
          rating: b.review.rating,
          content: b.review.content,
          status: b.review.status
        }
      });
    }

    // Payment record
    if (b.payStatus === 'PAID') {
      await prisma.payments.upsert({
        where: { transaction_code: `TX-${b.code}` },
        update: { status: 'PAID', amount: new Prisma.Decimal(b.total) },
        create: {
          transaction_code: `TX-${b.code}`,
          booking_id: booking.id,
          customer_id: b.customerId,
          transaction_type: 'RENTAL',
          amount: new Prisma.Decimal(b.total),
          payment_method: 'BANK_TRANSFER',
          status: 'PAID',
          paid_at: new Date()
        }
      });
    }

    return booking;
  };

  // --- 1. TODAY'S OPERATIONS: 3 READY_FOR_PICKUP TODAY ---
  console.log('  -> Tạo 3 đơn nhận xe HÔM NAY (READY_FOR_PICKUP: VF8, BMW 320i, Mercedes C300)...');
  await createBookingData({
    code: 'AR-TODAY-PU-01',
    vehicleId: dbVehicles['VF8'].id,
    customerId: allActiveCustomers[0].id,
    pickup: todayMorning,
    returnDate: inThreeDays,
    days: 3,
    fee: 4800000,
    deposit: 15000000,
    total: 19800000,
    status: 'READY_FOR_PICKUP',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    note: 'Khách VIP nhận xe 9h sáng nay tại Showroom. Pin sạc 100%.'
  });

  await createBookingData({
    code: 'AR-TODAY-PU-02',
    vehicleId: dbVehicles['BMW_320I'].id,
    customerId: allActiveCustomers[1].id,
    pickup: todayMorning,
    returnDate: inTwoDays,
    days: 2,
    fee: 4400000,
    deposit: 20000000,
    total: 24400000,
    status: 'READY_FOR_PICKUP',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    note: 'Khách đã thanh toán cọc qua ngân hàng. Đã chuẩn bị sẵn chìa khóa xe BMW.'
  });

  await createBookingData({
    code: 'AR-TODAY-PU-03',
    vehicleId: dbVehicles['MB_C300'].id,
    customerId: allActiveCustomers[2].id,
    pickup: todayMorning,
    returnDate: inFourDays,
    days: 4,
    fee: 11200000,
    deposit: 30000000,
    total: 41200000,
    status: 'READY_FOR_PICKUP',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    note: 'Giao xe Mercedes C300 cho khách đi công tác Hội An - Bà Nà.'
  });

  // Fourth READY_FOR_PICKUP for tomorrow
  await createBookingData({
    code: 'AR-READY-04',
    vehicleId: dbVehicles['VF3'].id,
    customerId: allActiveCustomers[3].id,
    pickup: inOneDay,
    returnDate: inThreeDays,
    days: 2,
    fee: 1300000,
    deposit: 6000000,
    total: 7300000,
    status: 'READY_FOR_PICKUP',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    note: 'Khách trẻ thuê xe VF 3 đi dạo phố cuối tuần.'
  });

  // --- 2. TODAY'S OPERATIONS: 3 ACTIVE RETURNING TODAY ---
  console.log('  -> Tạo 3 đơn trả xe HÔM NAY (ACTIVE trả chiều nay: Camry, Ranger Raptor, VF9)...');
  await createBookingData({
    code: 'AR-TODAY-RT-01',
    vehicleId: dbVehicles['TOY_CAMRY'].id,
    customerId: allActiveCustomers[3].id,
    pickup: threeDaysAgoMorning,
    returnDate: todayAfternoon,
    days: 3,
    fee: 4500000,
    deposit: 15000000,
    total: 19500000,
    status: 'ACTIVE',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    pickupOdo: 28400, // Ready for Return Wizard test
    note: 'Khách hẹn trả xe lúc 17h00 hôm nay. Odo xuất phát 28,400 km.'
  });

  await createBookingData({
    code: 'AR-TODAY-RT-02',
    vehicleId: dbVehicles['FORD_RAPTOR'].id,
    customerId: allActiveCustomers[4].id,
    pickup: fourDaysAgoMorning,
    returnDate: todayAfternoon,
    days: 4,
    fee: 8000000,
    deposit: 20000000,
    total: 28000000,
    status: 'ACTIVE',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    pickupOdo: 41200, // Ready for Return Wizard test
    note: 'Xe Ranger Raptor đi phượt Tây Bắc về trả chiều nay. Odo xuất phát 41,200 km.'
  });

  await createBookingData({
    code: 'AR-TODAY-RT-03',
    vehicleId: dbVehicles['VF9'].id,
    customerId: allActiveCustomers[0].id,
    pickup: threeDaysAgoMorning,
    returnDate: todayAfternoon,
    days: 3,
    fee: 7500000,
    deposit: 25000000,
    total: 32500000,
    status: 'ACTIVE',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    pickupOdo: 12500, // Ready for Return Wizard test
    note: 'Khách đoàn VIP trả xe VF 9 tại showroom lúc 16h30. Odo xuất phát 12,500 km.'
  });

  // 2 more ACTIVE bookings mid-rental (Total 5 ACTIVE)
  await createBookingData({
    code: 'AR-ACTIVE-04',
    vehicleId: dbVehicles['POR_MACAN'].id,
    customerId: allActiveCustomers[1].id,
    pickup: yesterday,
    returnDate: inTwoDays,
    days: 3,
    fee: 16500000,
    deposit: 50000000,
    total: 66500000,
    status: 'ACTIVE',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    pickupOdo: 18200,
    note: 'Khách đang lái xe Porsche Macan tại Đà Nẵng.'
  });

  await createBookingData({
    code: 'AR-ACTIVE-05',
    vehicleId: dbVehicles['BMW_320I'].id,
    customerId: allActiveCustomers[2].id,
    pickup: yesterday,
    returnDate: inThreeDays,
    days: 4,
    fee: 8800000,
    deposit: 20000000,
    total: 28800000,
    status: 'ACTIVE',
    payStatus: 'PAID',
    contractStatus: 'SIGNED',
    pickupOdo: 31050,
    note: 'Khách đi tour Huế - Lăng Cô.'
  });

  // --- 3. KANBAN: 4 PENDING BOOKINGS ---
  console.log('  -> Tạo 4 đơn mới đặt chờ duyệt (PENDING)...');
  await createBookingData({
    code: 'AR-PENDING-01',
    vehicleId: dbVehicles['VF8'].id,
    customerId: allActiveCustomers[0].id,
    pickup: inTwoDays,
    returnDate: inFourDays,
    days: 2,
    fee: 3200000,
    deposit: 15000000,
    total: 18200000,
    status: 'PENDING',
    payStatus: 'UNPAID',
    note: 'Khách yêu cầu thêm tài xế nếu có hoặc giao xe tận nhà.'
  });

  await createBookingData({
    code: 'AR-PENDING-02',
    vehicleId: dbVehicles['MB_C300'].id,
    customerId: allActiveCustomers[1].id,
    pickup: inThreeDays,
    returnDate: new Date(now.getTime() + 6 * 86400000),
    days: 3,
    fee: 8400000,
    deposit: 30000000,
    total: 38400000,
    status: 'PENDING',
    payStatus: 'PAID',
    note: 'Khách đã cọc giữ xe 10 triệu qua chuyển khoản.'
  });

  await createBookingData({
    code: 'AR-PENDING-03',
    vehicleId: dbVehicles['TOY_CAMRY'].id,
    customerId: allActiveCustomers[2].id,
    pickup: inOneDay,
    returnDate: inThreeDays,
    days: 2,
    fee: 3000000,
    deposit: 15000000,
    total: 18000000,
    status: 'PENDING',
    payStatus: 'UNPAID',
    note: 'Khách cần xe màu đen đón đối tác Nhật Bản.'
  });

  await createBookingData({
    code: 'AR-PENDING-04',
    vehicleId: dbVehicles['VF3'].id,
    customerId: allActiveCustomers[3].id,
    pickup: inTwoDays,
    returnDate: inThreeDays,
    days: 1,
    fee: 650000,
    deposit: 6000000,
    total: 6650000,
    status: 'PENDING',
    payStatus: 'UNPAID',
    note: 'Khách thuê lái thử xe VF3 1 ngày trải nghiệm.'
  });

  // --- 4. KANBAN: 4 CONFIRMED BOOKINGS (Awaiting e-contract signature) ---
  console.log('  -> Tạo 4 đơn đã duyệt chờ ký hợp đồng (CONFIRMED)...');
  await createBookingData({
    code: 'AR-CONFIRMED-01',
    vehicleId: dbVehicles['VF9'].id,
    customerId: allActiveCustomers[4].id,
    pickup: inTwoDays,
    returnDate: inFourDays,
    days: 2,
    fee: 5000000,
    deposit: 25000000,
    total: 30000000,
    status: 'CONFIRMED',
    payStatus: 'PAID',
    contractStatus: 'PENDING_SIGN',
    note: 'Đã duyệt hồ sơ, hệ thống đã gửi link ký hợp đồng số qua SMS.'
  });

  await createBookingData({
    code: 'AR-CONFIRMED-02',
    vehicleId: dbVehicles['FORD_RAPTOR'].id,
    customerId: allActiveCustomers[0].id,
    pickup: inThreeDays,
    returnDate: new Date(now.getTime() + 6 * 86400000),
    days: 3,
    fee: 6000000,
    deposit: 20000000,
    total: 26000000,
    status: 'CONFIRMED',
    payStatus: 'PAID',
    contractStatus: 'PENDING_SIGN',
    note: 'Chờ khách hoàn tất ký hợp đồng điện tử.'
  });

  await createBookingData({
    code: 'AR-CONFIRMED-03',
    vehicleId: dbVehicles['BMW_320I'].id,
    customerId: allActiveCustomers[1].id,
    pickup: inOneDay,
    returnDate: inThreeDays,
    days: 2,
    fee: 4400000,
    deposit: 20000000,
    total: 24400000,
    status: 'CONFIRMED',
    payStatus: 'PAID',
    contractStatus: 'PENDING_SIGN',
    note: 'Khách hẹn ký số trong buổi trưa.'
  });

  await createBookingData({
    code: 'AR-CONFIRMED-04',
    vehicleId: dbVehicles['TOY_CAMRY'].id,
    customerId: allActiveCustomers[2].id,
    pickup: inTwoDays,
    returnDate: inFourDays,
    days: 2,
    fee: 3000000,
    deposit: 15000000,
    total: 18000000,
    status: 'CONFIRMED',
    payStatus: 'PAID',
    contractStatus: 'PENDING_SIGN',
    note: 'Đã xác nhận giữ xe thành công.'
  });

  // --- 5. KANBAN: 10 COMPLETED BOOKINGS WITH REVIEWS ---
  console.log('  -> Tạo 10 đơn hoàn thành (COMPLETED) kèm đầy đủ Review 1-5 sao...');
  const pastBookings = [
    {
      code: 'AR-DONE-01',
      vehicle: dbVehicles['VF8'],
      daysAgo: 20,
      days: 3,
      rating: 5,
      reviewStatus: 'APPROVED' as const,
      comment: 'VinFast VF8 lái cực kỳ đầm chắc, sạc nhanh và không có mùi xăng. Showroom bàn giao đúng giờ và rất nhiệt tình!'
    },
    {
      code: 'AR-DONE-02',
      vehicle: dbVehicles['MB_C300'],
      daysAgo: 18,
      days: 2,
      rating: 5,
      reviewStatus: 'APPROVED' as const,
      comment: 'Mercedes C300 AMG xe bóng loáng, nội thất thơm phức. Thủ tục hợp đồng điện tử ký qua điện thoại rất tiện lợi.'
    },
    {
      code: 'AR-DONE-03',
      vehicle: dbVehicles['BMW_320I'],
      daysAgo: 15,
      days: 4,
      rating: 5,
      reviewStatus: 'APPROVED' as const,
      comment: 'BMW 320i Sport cảm giác lái tuyệt vời, chân ga nhạy, âm thanh Harman Kardon nghe nhạc cực đã trên cung đèo Hải Vân.'
    },
    {
      code: 'AR-DONE-04',
      vehicle: dbVehicles['TOY_CAMRY'],
      daysAgo: 14,
      days: 3,
      rating: 5,
      reviewStatus: 'APPROVED' as const,
      comment: 'Toyota Camry 2.5Q êm ái, cách âm tuyệt hảo, gia đình đi chơi xa rất ưng ý. Nhân viên hỗ trợ tận tình.'
    },
    {
      code: 'AR-DONE-05',
      vehicle: dbVehicles['FORD_RAPTOR'],
      daysAgo: 12,
      days: 5,
      rating: 4,
      reviewStatus: 'APPROVED' as const,
      comment: 'Ford Ranger Raptor hầm hố, vượt đèo dốc cực khỏe. Trả xe nhanh chóng không bắt bẻ gì, hoàn cọc đúng hẹn.'
    },
    {
      code: 'AR-DONE-06',
      vehicle: dbVehicles['VF9'],
      daysAgo: 10,
      days: 2,
      rating: 4,
      reviewStatus: 'APPROVED' as const,
      comment: 'VinFast VF9 khoang lái rộng thênh thang, màn hình giải trí thông minh. Ghế massage hoạt động rất tốt.'
    },
    {
      code: 'AR-DONE-07',
      vehicle: dbVehicles['POR_MACAN'],
      daysAgo: 8,
      days: 2,
      rating: 3,
      reviewStatus: 'PENDING' as const,
      comment: 'Xe Porsche Macan lái rất bốc, tuy nhiên lúc nhận xe cốp sau còn hơi vương chút bụi, showroom nên hút bụi kỹ hơn.'
    },
    {
      code: 'AR-DONE-08',
      vehicle: dbVehicles['VF3'],
      daysAgo: 6,
      days: 1,
      rating: 2,
      reviewStatus: 'PENDING' as const,
      comment: 'Nhân viên bàn giao xe trễ 15 phút do bận rửa xe, cần sắp xếp lịch giao chuẩn giờ hơn cho khách.'
    },
    {
      code: 'AR-DONE-09',
      vehicle: dbVehicles['MB_C300'],
      daysAgo: 5,
      days: 3,
      rating: 1,
      reviewStatus: 'HIDDEN' as const,
      comment: 'Khách phàn nàn giá ngày cuối tuần cao hơn ngày thường. Admin đã ẩn sau khi giải thích chính sách giá công khai.'
    },
    {
      code: 'AR-DONE-10',
      vehicle: dbVehicles['VF8'],
      daysAgo: 3,
      days: 3,
      rating: 5,
      reviewStatus: 'APPROVED' as const,
      comment: 'Dịch vụ thuê xe chuyên nghiệp nhất từng dùng. Lấy xe sân bay Đà Nẵng siêu nhanh, trả xe cũng chỉ mất 3 phút.'
    }
  ];

  for (let i = 0; i < pastBookings.length; i++) {
    const pb = pastBookings[i];
    const pStart = new Date(now.getTime() - pb.daysAgo * 86400000);
    const pEnd = new Date(pStart.getTime() + pb.days * 86400000);
    const fee = Number(pb.vehicle.price_per_day) * pb.days;
    const dep = Number(pb.vehicle.deposit_amount);

    await createBookingData({
      code: pb.code,
      vehicleId: pb.vehicle.id,
      customerId: allActiveCustomers[i % allActiveCustomers.length].id,
      pickup: pStart,
      returnDate: pEnd,
      days: pb.days,
      fee,
      deposit: dep,
      total: fee + dep,
      status: 'COMPLETED',
      payStatus: 'PAID',
      contractStatus: 'SIGNED',
      pickupOdo: 20000 + i * 2500,
      returnOdo: 20000 + i * 2500 + pb.days * 120,
      review: {
        rating: pb.rating,
        content: pb.comment,
        status: pb.reviewStatus
      },
      note: 'Chuyến đi đã hoàn tất xuất sắc, đã thanh lý tiền cọc.'
    });
  }

  // --- 6. KANBAN: 2 CANCELLED BOOKINGS ---
  console.log('  -> Tạo 2 đơn hủy kèm lý do (CANCELLED)...');
  await createBookingData({
    code: 'AR-CANCEL-01',
    vehicleId: dbVehicles['POR_MACAN'].id,
    customerId: allActiveCustomers[0].id,
    pickup: yesterday,
    returnDate: inTwoDays,
    days: 3,
    fee: 16500000,
    deposit: 50000000,
    total: 66500000,
    status: 'CANCELLED',
    payStatus: 'REFUNDED',
    note: 'Khách hàng hủy chuyến bay vào Đà Nẵng do thời tiết xấu, đã hoàn cọc 100%.'
  });

  await createBookingData({
    code: 'AR-CANCEL-02',
    vehicleId: dbVehicles['MB_E300'].id,
    customerId: allActiveCustomers[1].id,
    pickup: todayMorning,
    returnDate: inTwoDays,
    days: 2,
    fee: 7600000,
    deposit: 40000000,
    total: 47600000,
    status: 'CANCELLED',
    payStatus: 'REFUNDED',
    note: 'Khách bận lịch họp đột xuất, hủy đơn theo chính sách trước 24h.'
  });

  // 8. Settings configuration in MySQL
  console.log('⚙️ 8. Cấu hình Tham số Hệ thống (Settings) vào MySQL...');
  const appSettings = [
    { key: 'companyName', value: 'Công ty Cổ phần AutoRent Việt Nam', description: 'Tên nền tảng hiển thị' },
    { key: 'hotline', value: '1900 6868', description: 'Hotline CSKH toàn quốc' },
    { key: 'email', value: 'support@autorent.vn', description: 'Email hỗ trợ kỹ thuật và phản hồi' },
    { key: 'address', value: 'Lô C15, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng', description: 'Trụ sở chính' },
    { key: 'insuranceFee', value: '120000', description: 'Phí bảo hiểm vật chất xe/ngày (VND)' },
    { key: 'serviceFee', value: '100000', description: 'Phí bàn giao và rửa xe mặc định (VND)' },
    { key: 'depositRate', value: '15000000', description: 'Tiền cọc tối thiểu mặc định (VND)' },
    { key: 'cancelPenaltyRate', value: '30', description: 'Tỷ lệ phạt hủy đơn trong 24h (%)' },
  ];

  for (const s of appSettings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // Summary counts
  console.log('\n======================================================');
  console.log('🎉 NẠP SEED DATA THÀNH CÔNG VÀO CƠ SỞ DỮ LIỆU MYSQL!');
  console.log('======================================================');
  const totalVehicles = await prisma.vehicles.count();
  const totalUsers = await prisma.users.count();
  const totalPendingProfiles = await prisma.customer_profiles.count({ where: { verification_status: 'PENDING' } });
  const totalBookings = await prisma.bookings.count();
  const totalContracts = await prisma.contracts.count();
  const totalMaintenance = await prisma.maintenance_records.count();
  const totalReviews = await prisma.reviews.count();
  const totalSettings = await prisma.settings.count();

  console.log(`- Tổng số xe (Vehicles): ${totalVehicles}`);
  console.log(`- Tổng người dùng (Users): ${totalUsers}`);
  console.log(`- Hồ sơ GPLX chờ duyệt (Verification Queue): ${totalPendingProfiles}`);
  console.log(`- Tổng đơn thuê xe (Bookings): ${totalBookings}`);
  console.log(`- Hợp đồng điện tử (Contracts): ${totalContracts}`);
  console.log(`- Bản ghi bảo dưỡng (Maintenance): ${totalMaintenance}`);
  console.log(`- Đánh giá khách hàng (Reviews): ${totalReviews}`);
  console.log(`- Cấu hình hệ thống (Settings): ${totalSettings}`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
