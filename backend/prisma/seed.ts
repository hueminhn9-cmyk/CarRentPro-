import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting FULL Database Seeding for ALL 16 Tables in AutoRent...\n');

  try {
    const passwordHashAdmin = bcrypt.hashSync('admin123', 10);
    const passwordHashManager = bcrypt.hashSync('manager123', 10);
    const passwordHashCustomer = bcrypt.hashSync('user123', 10);

    // =========================================================================
    // 0. TABLE: locations (Locations in Đà Nẵng)
    // =========================================================================
    const locationsToSeed = [
      { name: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng', city: 'Đà Nẵng', district: 'Hải Châu', address: '123 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng' },
      { name: 'Sân bay Quốc tế Đà Nẵng', city: 'Đà Nẵng', district: 'Hải Châu', address: 'Đường Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng' },
      { name: 'Chi nhánh Sơn Trà - Đà Nẵng', city: 'Đà Nẵng', district: 'Sơn Trà', address: '45 Võ Văn Kiệt, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng' },
      { name: 'Chi nhánh Thanh Khê - Đà Nẵng', city: 'Đà Nẵng', district: 'Thanh Khê', address: '210 Điện Biên Phủ, Phường Chính Gián, Quận Thanh Khê, Đà Nẵng' },
      { name: 'Chi nhánh Ngũ Hành Sơn - Đà Nẵng', city: 'Đà Nẵng', district: 'Ngũ Hành Sơn', address: '88 Lê Văn Hiến, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng' },
      { name: 'Chi nhánh Cẩm Lệ - Đà Nẵng', city: 'Đà Nẵng', district: 'Cẩm Lệ', address: '15 Cách Mạng Tháng 8, Phường Khuê Trung, Quận Cẩm Lệ, Đà Nẵng' },
    ];

    for (const loc of locationsToSeed) {
      await prisma.locations.upsert({
        where: { name: loc.name },
        update: loc,
        create: loc,
      });
    }
    console.log('✓ 0. Table `locations`: Seeded 6 locations in Đà Nẵng.');

    // =========================================================================
    // 1. TABLE: users (15 Users: 1 Admin, 3 Managers, 11 Customers)
    // =========================================================================
    const usersToSeed = [
      {
        email: 'admin@autorent.vn',
        full_name: 'Quản trị viên Hệ thống',
        phone: '0901234567',
        password_hash: passwordHashAdmin,
        role: 'ADMIN' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'manager@autorent.vn',
        full_name: 'Lê Văn Quản Lý (Hà Nội)',
        phone: '0911223344',
        password_hash: passwordHashManager,
        role: 'MANAGER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'manager.hcm@autorent.vn',
        full_name: 'Trần Quốc Tuấn (TP. HCM)',
        phone: '0911223355',
        password_hash: passwordHashManager,
        role: 'MANAGER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'manager.danang@autorent.vn',
        full_name: 'Hoàng Thị Tuyết (Đà Nẵng)',
        phone: '0911223366',
        password_hash: passwordHashManager,
        role: 'MANAGER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'nguyenvana@gmail.com',
        full_name: 'Nguyễn Văn A',
        phone: '0909876543',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'tranthib@yahoo.com',
        full_name: 'Trần Thị B',
        phone: '0987654321',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'phamminhc@hotmail.com',
        full_name: 'Phạm Minh C',
        phone: '0912345678',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'hoangvudung@gmail.com',
        full_name: 'Hoàng Vũ Dũng',
        phone: '0934567890',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'nongthimai@gmail.com',
        full_name: 'Nông Thị Mai',
        phone: '0945678901',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'dinhthanhlong@gmail.com',
        full_name: 'Đinh Thành Long',
        phone: '0956789012',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'vuquynhanh@gmail.com',
        full_name: 'Vũ Quỳnh Anh',
        phone: '0967890123',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'lequanghung@gmail.com',
        full_name: 'Lê Quang Hùng',
        phone: '0978901234',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'doanngocbaochau@gmail.com',
        full_name: 'Đoàn Ngọc Bảo Châu',
        phone: '0989012345',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'buitiendat@gmail.com',
        full_name: 'Bùi Tiến Đạt',
        phone: '0990123456',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'nguyentranthao@gmail.com',
        full_name: 'Nguyễn Trần Phương Thảo',
        phone: '0901112233',
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      }
    ];

    const dbUsers: Record<string, any> = {};

    for (const u of usersToSeed) {
      const existing = await prisma.users.findUnique({ where: { email: u.email } });
      if (!existing) {
        dbUsers[u.email] = await prisma.users.create({ data: u });
      } else {
        dbUsers[u.email] = await prisma.users.update({
          where: { email: u.email },
          data: u
        });
      }
    }
    console.log('✓ 1. Table `users`: Seeded 15 users (1 Admin, 3 Managers, 11 Customers).');

    // =========================================================================
    // 2. TABLE: customer_profiles (Profiles for all 11 Customers)
    // =========================================================================
    const profilesToSeed = [
      {
        user_id: dbUsers['nguyenvana@gmail.com'].id,
        address: '123 Đường Láng, Láng Thượng, Đống Đa, Hà Nội',
        citizen_id: '001095012345',
        driver_license_number: 'GPLX12345678',
        driver_license_expiry: new Date('2030-05-15'),
        date_of_birth: new Date('1992-05-15'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['tranthib@yahoo.com'].id,
        address: '456 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
        citizen_id: '002096054321',
        driver_license_number: 'GPLX87654321',
        driver_license_expiry: new Date('2029-08-20'),
        date_of_birth: new Date('1995-08-20'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['phamminhc@hotmail.com'].id,
        address: '789 Lê Lợi, Hải Châu, Đà Nẵng',
        citizen_id: '003097011223',
        driver_license_number: 'GPLX99999999',
        driver_license_expiry: new Date('2028-11-10'),
        date_of_birth: new Date('1988-11-10'),
        verification_status: 'PENDING' as const,
      },
      {
        user_id: dbUsers['hoangvudung@gmail.com'].id,
        address: '88 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
        citizen_id: '001090011444',
        driver_license_number: 'GPLX11445566',
        driver_license_expiry: new Date('2031-03-25'),
        date_of_birth: new Date('1990-03-25'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['nongthimai@gmail.com'].id,
        address: '12 Đường Số 7, An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
        citizen_id: '079093022555',
        driver_license_number: 'GPLX22558899',
        driver_license_expiry: new Date('2032-09-12'),
        date_of_birth: new Date('1993-09-12'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['dinhthanhlong@gmail.com'].id,
        address: '45 Nguyễn Văn Linh, Nam Dương, Hải Châu, Đà Nẵng',
        citizen_id: '048091033666',
        driver_license_number: 'GPLX33669900',
        driver_license_expiry: new Date('2029-01-08'),
        date_of_birth: new Date('1991-01-08'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['vuquynhanh@gmail.com'].id,
        address: '25 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        citizen_id: '001097044777',
        driver_license_number: 'GPLX44770011',
        driver_license_expiry: new Date('2032-07-30'),
        date_of_birth: new Date('1997-07-30'),
        verification_status: 'PENDING' as const,
      },
      {
        user_id: dbUsers['lequanghung@gmail.com'].id,
        address: '102 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh',
        citizen_id: '079089055888',
        driver_license_number: 'GPLX55881122',
        driver_license_expiry: new Date('2028-12-05'),
        date_of_birth: new Date('1989-12-05'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['doanngocbaochau@gmail.com'].id,
        address: '14 Kim Mã, Ba Đình, Hà Nội',
        citizen_id: '001098066999',
        driver_license_number: 'GPLX66992233',
        driver_license_expiry: new Date('2027-04-18'),
        date_of_birth: new Date('1998-04-18'),
        verification_status: 'REJECTED' as const,
      },
      {
        user_id: dbUsers['buitiendat@gmail.com'].id,
        address: '210 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
        citizen_id: '048094077000',
        driver_license_number: 'GPLX77003344',
        driver_license_expiry: new Date('2030-10-02'),
        date_of_birth: new Date('1994-10-02'),
        verification_status: 'VERIFIED' as const,
      },
      {
        user_id: dbUsers['nguyentranthao@gmail.com'].id,
        address: '56 Lê Văn Sỹ, Phường 11, Phú Nhuận, TP. Hồ Chí Minh',
        citizen_id: '079096088111',
        driver_license_number: 'GPLX88114455',
        driver_license_expiry: new Date('2031-06-22'),
        date_of_birth: new Date('1996-06-22'),
        verification_status: 'VERIFIED' as const,
      }
    ];

    const dbProfiles: Record<string, any> = {};

    for (const prof of profilesToSeed) {
      const existing = await prisma.customer_profiles.findUnique({ where: { user_id: prof.user_id } });
      if (!existing) {
        dbProfiles[prof.user_id.toString()] = await prisma.customer_profiles.create({ data: prof });
      } else {
        dbProfiles[prof.user_id.toString()] = await prisma.customer_profiles.update({
          where: { user_id: prof.user_id },
          data: prof
        });
      }
    }
    console.log('✓ 2. Table `customer_profiles`: Seeded profiles for 11 customers.');

    // =========================================================================
    // 3. TABLE: vehicle_categories (5 Categories)
    // =========================================================================
    const categories = [
      { name: 'Sedan', description: 'Xe 4-5 chỗ, kiểu dáng thanh lịch, phù hợp di chuyển đô thị.' },
      { name: 'SUV', description: 'Xe gầm cao 5-7 chỗ, mạnh mẽ, phù hợp đi đường dài và địa hình.' },
      { name: 'Hatchback', description: 'Xe nhỏ gọn 5 chỗ, cốp liền, dễ dàng di chuyển trong phố.' },
      { name: 'Pickup', description: 'Xe bán tải đa dụng, động cơ mạnh mẽ, khoang chở hàng rộng.' },
      { name: 'Luxury', description: 'Dòng xe hạng sang cao cấp, trang bị hiện đại và tiện nghi.' },
    ];

    for (const cat of categories) {
      await prisma.vehicle_categories.upsert({
        where: { name: cat.name },
        update: { description: cat.description },
        create: { name: cat.name, description: cat.description },
      });
    }
    console.log('✓ 3. Table `vehicle_categories`: Seeded 5 standard categories.');

    const dbCategories = await prisma.vehicle_categories.findMany();
    const getCatId = (name: string) => dbCategories.find(c => c.name === name)!.id;

    const dbLocations = await prisma.locations.findMany();
    const mainShowroomLoc = dbLocations.find(l => l.name.includes('Hải Châu')) || dbLocations[0];
    const airportLoc = dbLocations.find(l => l.name.includes('Sân bay')) || mainShowroomLoc;
    const sonTraLoc = dbLocations.find(l => l.name.includes('Sơn Trà')) || mainShowroomLoc;
    const thanhKheLoc = dbLocations.find(l => l.name.includes('Thanh Khê')) || mainShowroomLoc;

    // =========================================================================
    // 4. TABLE: vehicles (42 Vehicles across 3 Branches & 6 Segments)
    // =========================================================================
    const sampleVehicles = [
      // ============================================================
      // ELECTRIC VEHICLES (VinFast lineup - 6 models)
      // ============================================================
      {
        category_id: getCatId('SUV'),
        location_id: mainShowroomLoc.id,
        code: 'VF3',
        name: 'VinFast VF 3',
        brand: 'VinFast',
        model: 'VF 3',
        manufacture_year: 2024,
        license_plate: '30K-333.33',
        color: 'Xanh Mint',
        seat_count: 4,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(500000),
        deposit_amount: new Prisma.Decimal(5000000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 3 mini city car điện tiết kiệm, nhỏ gọn lý tưởng di chuyển nội đô Hà Nội.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'VF5',
        name: 'VinFast VF 5 Plus',
        brand: 'VinFast',
        model: 'VF 5 Plus',
        manufacture_year: 2023,
        license_plate: '51K-555.55',
        color: 'Trắng',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(700000),
        deposit_amount: new Prisma.Decimal(7000000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 5 Plus crossover điện đô thị, tầm hoạt động 326km, sạc đầy trong 6 giờ.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'VF6',
        name: 'VinFast VF 6 Standard',
        brand: 'VinFast',
        model: 'VF 6 Standard',
        manufacture_year: 2024,
        license_plate: '43A-666.66',
        color: 'Đen',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(850000),
        deposit_amount: new Prisma.Decimal(8500000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 6 mang phong cách Coupe SUV, tầm hoạt động 381km WLTP, tích hợp AI thông minh.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1591093170422-3a4e5c1f4f20?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'VF7',
        name: 'VinFast VF 7 Plus',
        brand: 'VinFast',
        model: 'VF 7 Plus',
        manufacture_year: 2024,
        license_plate: '30K-777.77',
        color: 'Ghi Đậm',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(1100000),
        deposit_amount: new Prisma.Decimal(11000000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 7 Plus SUV điện phân khúc C với tầm hoạt động 431km và mâm 19 inch.',
        status: 'RENTED' as const,
        image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'VF8',
        name: 'VinFast VF 8 Plus',
        brand: 'VinFast',
        model: 'VF 8 Plus',
        manufacture_year: 2023,
        license_plate: '30K-888.88',
        color: 'Xanh dương',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(1500000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 8 Plus là dòng xe điện thông minh phân khúc D, thiết kế bởi Pininfarina, hỗ trợ lái nâng cao ADAS.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'VF9',
        name: 'VinFast VF 9 Eco',
        brand: 'VinFast',
        model: 'VF 9 Eco',
        manufacture_year: 2024,
        license_plate: '30K-999.88',
        color: 'Ghi xám',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'ELECTRIC' as const,
        price_per_day: new Prisma.Decimal(2200000),
        deposit_amount: new Prisma.Decimal(20000000),
        location: 'Đà Nẵng',
        description: 'VinFast VF 9 là dòng SUV điện Full-size sang trọng 7 chỗ, tầm hoạt động vượt trội 594km.',
        status: 'RENTED' as const,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=60'
      },

      // ============================================================
      // SUV SEGMENT (8 models)
      // ============================================================
      {
        category_id: getCatId('SUV'),
        code: 'FTN',
        name: 'Toyota Fortuner Legender',
        brand: 'Toyota',
        model: 'Fortuner Legender',
        manufacture_year: 2022,
        license_plate: '51K-999.99',
        color: 'Trắng',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1600000),
        deposit_amount: new Prisma.Decimal(20000000),
        location: 'Đà Nẵng',
        description: 'Toyota Fortuner Legender sở hữu thiết kế hầm hố, động cơ dầu bền bỉ, thích hợp du lịch gia đình.',
        status: 'RENTED' as const,
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'EVE',
        name: 'Ford Everest Titanium 4x4',
        brand: 'Ford',
        model: 'Everest Titanium',
        manufacture_year: 2023,
        license_plate: '43A-888.99',
        color: 'Đen',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1700000),
        deposit_amount: new Prisma.Decimal(20000000),
        location: 'Đà Nẵng',
        description: 'Ford Everest thế hệ mới mang lại trải nghiệm lái êm ái, nhiều công nghệ hỗ trợ người lái.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'STF',
        name: 'Hyundai SantaFe Premium',
        brand: 'Hyundai',
        model: 'SantaFe Premium',
        manufacture_year: 2023,
        license_plate: '30F-888.77',
        color: 'Đỏ rượu',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1500000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Hyundai SantaFe thiết kế hiện đại, trang bị dải đèn LED đặc trưng, nội thất da cao cấp.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'CX5',
        name: 'Mazda CX-5 Premium',
        brand: 'Mazda',
        model: 'CX-5 Premium',
        manufacture_year: 2023,
        license_plate: '51H-654.32',
        color: 'Trắng',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1200000),
        deposit_amount: new Prisma.Decimal(12000000),
        location: 'Đà Nẵng',
        description: 'Mazda CX-5 Premium sở hữu thiết kế KODO tinh tế, âm thanh 10 loa Bose cao cấp.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'CRV',
        name: 'Honda CR-V L 1.5 Turbo',
        brand: 'Honda',
        model: 'CR-V L',
        manufacture_year: 2023,
        license_plate: '51K-123.99',
        color: 'Xanh xám',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1400000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Honda CR-V với gói Honda SENSING an toàn, khoang cabin rộng rãi cho 7 người.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'TCN2',
        name: 'Hyundai Tucson 2.0 Premium',
        brand: 'Hyundai',
        model: 'Tucson 2.0',
        manufacture_year: 2022,
        license_plate: '30N-245.68',
        color: 'Xanh Titan',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1100000),
        deposit_amount: new Prisma.Decimal(11000000),
        location: 'Đà Nẵng',
        description: 'Hyundai Tucson thế hệ mới thiết kế Parametric Dynamics ấn tượng, trang bị đầy đủ.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'CX8',
        name: 'Mazda CX-8 Premium',
        brand: 'Mazda',
        model: 'CX-8 Premium',
        manufacture_year: 2023,
        license_plate: '43B-336.77',
        color: 'Đỏ Soul',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1400000),
        deposit_amount: new Prisma.Decimal(14000000),
        location: 'Đà Nẵng',
        description: 'Mazda CX-8 SUV 7 chỗ cao cấp, nội thất da Nappa, động cơ dầu tiết kiệm bền bỉ.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('SUV'),
        code: 'KONA',
        name: 'Hyundai Kona 2.0 AT',
        brand: 'Hyundai',
        model: 'Kona 2.0 AT',
        manufacture_year: 2023,
        license_plate: '51P-789.01',
        color: 'Cam Sunset',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(950000),
        deposit_amount: new Prisma.Decimal(9500000),
        location: 'Đà Nẵng',
        description: 'Hyundai Kona nhỏ gọn năng động, phù hợp cho các cặp đôi và gia đình nhỏ đi phố.',
        status: 'INCIDENT' as const,
        image: 'https://images.unsplash.com/photo-1555652736-e92021d28a10?w=600&auto=format&fit=crop&q=60'
      },

      // ============================================================
      // SEDAN SEGMENT (7 models)
      // ============================================================
      {
        category_id: getCatId('Sedan'),
        code: 'CVC',
        name: 'Honda Civic RS',
        brand: 'Honda',
        model: 'Civic RS',
        manufacture_year: 2023,
        license_plate: '43A-777.77',
        color: 'Đỏ',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1100000),
        deposit_amount: new Prisma.Decimal(10000000),
        location: 'Đà Nẵng',
        description: 'Honda Civic RS phong cách thể thao, cảm giác lái phấn khích hàng đầu phân khúc C.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'CMR',
        name: 'Toyota Camry 2.5Q',
        brand: 'Toyota',
        model: 'Camry 2.5Q',
        manufacture_year: 2023,
        license_plate: '30E-999.11',
        color: 'Đen',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1500000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Toyota Camry 2.5Q là biểu tượng sedan doanh nhân sang trọng, tiện nghi đỉnh cao.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'ACC',
        name: 'Hyundai Accent AT',
        brand: 'Hyundai',
        model: 'Accent AT',
        manufacture_year: 2022,
        license_plate: '51G-246.80',
        color: 'Trắng',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(800000),
        deposit_amount: new Prisma.Decimal(8000000),
        location: 'Đà Nẵng',
        description: 'Hyundai Accent là dòng sedan cỡ B tiết kiệm nhiên liệu, dễ dàng di chuyển trong phố.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'MZ3',
        name: 'Mazda 3 Luxury',
        brand: 'Mazda',
        model: 'Mazda 3 Luxury',
        manufacture_year: 2023,
        license_plate: '43C-555.66',
        color: 'Đỏ Pha Lê',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1000000),
        deposit_amount: new Prisma.Decimal(10000000),
        location: 'Đà Nẵng',
        description: 'Mazda 3 sở hữu thiết kế thời trang, trẻ trung, nội thất hiện đại tinh tế.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'K3S',
        name: 'Kia K3 Premium',
        brand: 'Kia',
        model: 'K3 Premium',
        manufacture_year: 2022,
        license_plate: '30H-444.55',
        color: 'Xanh lá mạ',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(900000),
        deposit_amount: new Prisma.Decimal(9000000),
        location: 'Đà Nẵng',
        description: 'Kia K3 thiết kế thể thao trẻ trung, trang bị công nghệ tiện nghi phong phú.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1541348263662-e08266273f2a?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'VIO',
        name: 'Toyota Vios G CVT',
        brand: 'Toyota',
        model: 'Vios G',
        manufacture_year: 2022,
        license_plate: '51R-112.34',
        color: 'Trắng',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(750000),
        deposit_amount: new Prisma.Decimal(7500000),
        location: 'Đà Nẵng',
        description: 'Toyota Vios G CVT tiết kiệm nhiên liệu, đơn giản dễ lái, hộp số CVT mượt mà.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Sedan'),
        code: 'MZ6',
        name: 'Mazda 6 Premium 2.5L',
        brand: 'Mazda',
        model: 'Mazda 6 2.5L',
        manufacture_year: 2023,
        license_plate: '43D-998.77',
        color: 'Xám Platinum',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(1300000),
        deposit_amount: new Prisma.Decimal(13000000),
        location: 'Đà Nẵng',
        description: 'Mazda 6 2.5L Premium – sedan D-segment sang trọng, hệ thống âm thanh Bose 11 loa.',
        status: 'INCIDENT' as const,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=60'
      },

      // ============================================================
      // HATCHBACK SEGMENT (5 models)
      // ============================================================
      {
        category_id: getCatId('Hatchback'),
        code: 'YRS',
        name: 'Toyota Yaris Cross Hybrid',
        brand: 'Toyota',
        model: 'Yaris Cross',
        manufacture_year: 2023,
        license_plate: '43A-666.99',
        color: 'Ngọc Trai',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'HYBRID' as const,
        price_per_day: new Prisma.Decimal(850000),
        deposit_amount: new Prisma.Decimal(8000000),
        location: 'Đà Nẵng',
        description: 'Toyota Yaris Cross động cơ Hybrid cực kỳ tiết kiệm xăng, nhỏ gọn dễ xoay xở.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'MRN',
        name: 'Kia Morning AT',
        brand: 'Kia',
        model: 'Morning AT',
        manufacture_year: 2022,
        license_plate: '30M-111.22',
        color: 'Đỏ Lửa',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(550000),
        deposit_amount: new Prisma.Decimal(5000000),
        location: 'Đà Nẵng',
        description: 'Kia Morning AT – xe hatchback cỡ A giá rẻ nhất đội, tiết kiệm xăng chỉ 5L/100km.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1534093607318-f025413f49cb?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'I10',
        name: 'Hyundai Grand i10 AT',
        brand: 'Hyundai',
        model: 'Grand i10',
        manufacture_year: 2023,
        license_plate: '51S-223.34',
        color: 'Xanh Coral',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(600000),
        deposit_amount: new Prisma.Decimal(5500000),
        location: 'Đà Nẵng',
        description: 'Hyundai Grand i10 nhỏ gọn, mức tiêu hao nhiên liệu thấp 4.9L/100km, lý tưởng nội đô.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1576220258822-0f91a89b4fc3?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'JZZ',
        name: 'Honda Jazz RS',
        brand: 'Honda',
        model: 'Jazz RS',
        manufacture_year: 2021,
        license_plate: '43E-445.56',
        color: 'Đỏ Passion',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(700000),
        deposit_amount: new Prisma.Decimal(7000000),
        location: 'Đà Nẵng',
        description: 'Honda Jazz RS thiết kế độc đáo, ghế sau gập kiểu Magic Seat linh hoạt, tiết kiệm nhiên liệu.',
        status: 'MAINTENANCE' as const,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Hatchback'),
        code: 'CRS',
        name: 'Kia Cerato 1.6 MT',
        brand: 'Kia',
        model: 'Cerato 1.6 MT',
        manufacture_year: 2022,
        license_plate: '30P-334.45',
        color: 'Xanh Dương',
        seat_count: 5,
        transmission: 'MANUAL' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(680000),
        deposit_amount: new Prisma.Decimal(6500000),
        location: 'Đà Nẵng',
        description: 'Kia Cerato số sàn 1.6L, thú vị cho những ai thích kiểm soát tay số, tiết kiệm chi phí.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1541348263662-e08266273f2a?w=600&auto=format&fit=crop&q=60'
      },

      // ============================================================
      // PICKUP SEGMENT (5 models)
      // ============================================================
      {
        category_id: getCatId('Pickup'),
        code: 'RNG',
        name: 'Ford Ranger Wildtrak 2.0 Bi-Turbo',
        brand: 'Ford',
        model: 'Ranger Wildtrak',
        manufacture_year: 2022,
        license_plate: '29H-123.45',
        color: 'Cam',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1300000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Ford Ranger Wildtrak cơ bắp Mỹ, khả năng lội nước 800mm và thùng chở đồ rộng rãi.',
        status: 'MAINTENANCE' as const,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Pickup'),
        code: 'TRT',
        name: 'Mitsubishi Triton Athlete 4x4',
        brand: 'Mitsubishi',
        model: 'Triton Athlete',
        manufacture_year: 2023,
        license_plate: '43C-888.11',
        color: 'Cam Đen',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1200000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Mitsubishi Triton Athlete vận hành mạnh mẽ với hệ truyền động Super Select 4WD-II.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Pickup'),
        code: 'HLX',
        name: 'Toyota Hilux 2.8G 4x4 AT',
        brand: 'Toyota',
        model: 'Hilux 2.8G',
        manufacture_year: 2022,
        license_plate: '51Q-556.78',
        color: 'Trắng',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1350000),
        deposit_amount: new Prisma.Decimal(15000000),
        location: 'Đà Nẵng',
        description: 'Toyota Hilux 2.8G bán tải đa dụng dẫn động 4 cầu, thùng lớn phù hợp chở hàng và du lịch.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1541348263662-e08266273f2a?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Pickup'),
        code: 'D20',
        name: 'Nissan Navara EL Premium R AT',
        brand: 'Nissan',
        model: 'Navara EL',
        manufacture_year: 2022,
        license_plate: '30Q-667.89',
        color: 'Xanh Titan',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1150000),
        deposit_amount: new Prisma.Decimal(12000000),
        location: 'Đà Nẵng',
        description: 'Nissan Navara EL Premium R có hệ treo độc lập sau Intelligent Ride Control, cabin ồn ít.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Pickup'),
        code: 'BT50',
        name: 'Mazda BT-50 3.2 AT 4x4',
        brand: 'Mazda',
        model: 'BT-50 3.2',
        manufacture_year: 2021,
        license_plate: '43F-778.90',
        color: 'Bạc',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(1050000),
        deposit_amount: new Prisma.Decimal(11000000),
        location: 'Đà Nẵng',
        description: 'Mazda BT-50 thiết kế Kodo cá tính, động cơ dầu 3.2L mô-men cao, bền bỉ trên mọi địa hình.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=60'
      },

      // ============================================================
      // LUXURY SEGMENT (6 models)
      // ============================================================
      {
        category_id: getCatId('Luxury'),
        code: 'GLE',
        name: 'Mercedes-Benz GLE 450 4MATIC',
        brand: 'Mercedes-Benz',
        model: 'GLE 450',
        manufacture_year: 2023,
        license_plate: '51F-888.88',
        color: 'Đen Obsidian',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(4500000),
        deposit_amount: new Prisma.Decimal(50000000),
        location: 'Đà Nẵng',
        description: 'Mercedes-Benz GLE 450 là mẫu SUV hạng sang cao cấp, trang bị động cơ EQ Boost 367 mã lực, hệ thống treo E-ACTIVE BODY CONTROL.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Luxury'),
        code: 'X5M',
        name: 'BMW X5 xDrive40i MSport',
        brand: 'BMW',
        model: 'X5 xDrive40i',
        manufacture_year: 2023,
        license_plate: '30G-777.88',
        color: 'Xanh Phytonic',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(4200000),
        deposit_amount: new Prisma.Decimal(45000000),
        location: 'Đà Nẵng',
        description: 'BMW X5 mang lại cảm giác lái đỉnh cao, dẫn động 4 bánh xDrive thông minh, nội thất da Merino.',
        status: 'RENTED' as const,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Luxury'),
        code: 'PSC',
        name: 'Porsche Cayenne Coupe',
        brand: 'Porsche',
        model: 'Cayenne Coupe',
        manufacture_year: 2023,
        license_plate: '51L-999.66',
        color: 'Xám Chalk',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(6000000),
        deposit_amount: new Prisma.Decimal(60000000),
        location: 'TP. Hồ Chí Minh',
        description: 'Porsche Cayenne Coupe là dòng siêu SUV thể thao hạng sang, PDK 8 cấp, 0-100 km/h trong 5.3s.',
        status: 'MAINTENANCE' as const,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Luxury'),
        code: 'AQ7',
        name: 'Audi Q7 55 TFSI Quattro',
        brand: 'Audi',
        model: 'Q7 55 TFSI',
        manufacture_year: 2023,
        license_plate: '30T-111.88',
        color: 'Xám Daytona',
        seat_count: 7,
        transmission: 'AUTO' as const,
        fuel_type: 'GASOLINE' as const,
        price_per_day: new Prisma.Decimal(5000000),
        deposit_amount: new Prisma.Decimal(55000000),
        location: 'Hà Nội',
        description: 'Audi Q7 Quattro với hệ thống Virtual Cockpit, màn hình MMI Touch Response, không khí thượng lưu.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Luxury'),
        code: 'RRG',
        name: 'Range Rover Sport HSE Dynamic',
        brand: 'Land Rover',
        model: 'Range Rover Sport HSE',
        manufacture_year: 2022,
        license_plate: '51U-222.99',
        color: 'Trắng Fuji',
        seat_count: 5,
        transmission: 'AUTO' as const,
        fuel_type: 'DIESEL' as const,
        price_per_day: new Prisma.Decimal(5500000),
        deposit_amount: new Prisma.Decimal(58000000),
        location: 'TP. Hồ Chí Minh',
        description: 'Range Rover Sport HSE Dynamic – off-road hạng sang tuyệt vời, Terrain Response 2, vượt địa hình cực đỉnh.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&auto=format&fit=crop&q=60'
      },
      {
        category_id: getCatId('Luxury'),
        code: 'LC500',
        name: 'Lexus LC 500h',
        brand: 'Lexus',
        model: 'LC 500h',
        manufacture_year: 2023,
        license_plate: '43G-333.44',
        color: 'Vàng Amber',
        seat_count: 4,
        transmission: 'AUTO' as const,
        fuel_type: 'HYBRID' as const,
        price_per_day: new Prisma.Decimal(4800000),
        deposit_amount: new Prisma.Decimal(50000000),
        location: 'Đà Nẵng',
        description: 'Lexus LC 500h coupe hạng sang Hybrid đỉnh cao, 0-100 trong 5.0s, thiết kế Manga-inspired.',
        status: 'AVAILABLE' as const,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60'
      }
    ];

    const dbVehicles: Record<string, any> = {};

    for (let i = 0; i < sampleVehicles.length; i++) {
      const veh = sampleVehicles[i];
      const { image, location, ...vehData } = veh as any;
      
      // Cycle through Đà Nẵng locations for all 42 vehicles
      const targetLoc = dbLocations[i % dbLocations.length];
      const vehDataWithLoc = {
        ...vehData,
        location_id: vehData.location_id || targetLoc.id
      };

      const existing = await prisma.vehicles.findUnique({
        where: { code: veh.code }
      });
      let vObj = existing;
      if (!existing) {
        vObj = await prisma.vehicles.create({ data: vehDataWithLoc });
      } else {
        vObj = await prisma.vehicles.update({
          where: { code: veh.code },
          data: vehDataWithLoc
        });
      }
      dbVehicles[veh.code] = vObj;

      // Seed/update primary media_files image for vehicle
      if (image && vObj) {
        const existingMedia = await prisma.media_files.findFirst({
          where: { entity_type: 'VEHICLE', entity_id: vObj.id, is_primary: true }
        });
        if (existingMedia) {
          await prisma.media_files.update({
            where: { id: existingMedia.id },
            data: { file_path: image }
          });
        } else {
          await prisma.media_files.create({
            data: {
              entity_type: 'VEHICLE',
              entity_id: vObj.id,
              original_name: `${veh.code}.jpg`,
              stored_name: `${veh.code}.jpg`,
              file_path: image,
              is_primary: true,
              storage_provider: 'LOCAL'
            }
          });
        }
      }
    }
    console.log('✓ 4. Table `vehicles`: Seeded 42 vehicles (Electric×6, SUV×8, Sedan×7, Hatchback×5, Pickup×5, Luxury×6, + 5 legacy).');

    // Global DB Sync: Force-update ALL vehicle rows in MySQL table `vehicles`
    // to point location_id to Da Nang showrooms
    const allDbVehicles = await prisma.vehicles.findMany();
    for (let i = 0; i < allDbVehicles.length; i++) {
      const loc = dbLocations[i % dbLocations.length];
      await prisma.vehicles.update({
        where: { id: allDbVehicles[i].id },
        data: {
          location_id: loc.id
        }
      });
    }
    console.log('✓ Updated ALL vehicle records in MySQL database table `vehicles` to Da Nang Showroom location_id.');

    // =========================================================================
    // 5. TABLE: media_files (Primary + Multi-angle images, License images)
    // =========================================================================
    // 5a. Primary images for all vehicles
    for (const veh of sampleVehicles) {
      const vObj = dbVehicles[veh.code];
      if (!vObj) continue;
      const existingMedia = await prisma.media_files.findFirst({
        where: { entity_type: 'VEHICLE', entity_id: vObj.id, is_primary: true }
      });
      if (!existingMedia) {
        await prisma.media_files.create({
          data: {
            entity_type: 'VEHICLE',
            entity_id: vObj.id,
            media_type: 'IMAGE',
            category: 'VEHICLE_FRONT',
            original_name: `${veh.code}_primary.jpg`,
            stored_name: `${veh.code}_primary.jpg`,
            file_path: veh.image,
            is_primary: true,
            sort_order: 0,
            storage_provider: 'LOCAL',
            description: `Ảnh đại diện chính của ${veh.name}`
          }
        });
      } else {
        await prisma.media_files.update({
          where: { id: existingMedia.id },
          data: { file_path: veh.image, category: 'VEHICLE_FRONT' }
        });
      }
    }

    // 5b. Multi-angle additional photos for key flagship vehicles
    const keyVehiclePhotos: Array<{
      code: string;
      photos: Array<{ category: any; url: string; desc: string; order: number }>;
    }> = [
      {
        code: 'VF9',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60', desc: 'Khoang nội thất VinFast VF 9 - màn hình 15.6 inch', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=60', desc: 'Đuôi xe VF 9 góc đặc trưng cụm đèn LED', order: 2 },
          { category: 'VEHICLE_LEFT',     url: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=600&auto=format&fit=crop&q=60', desc: 'Sườn xe trái VF 9 - đường dập nổi năng động', order: 3 },
        ]
      },
      {
        code: 'GLE',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60', desc: 'Nội thất Mercedes GLE 450 - da Nappa Beige', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60', desc: 'Đuôi xe GLE 450 - cụm đèn MULTIBEAM LED', order: 2 },
        ]
      },
      {
        code: 'X5M',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=60', desc: 'Nội thất BMW X5 xDrive - Cockpit Merino da cao cấp', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=600&auto=format&fit=crop&q=60', desc: 'Góc đuôi BMW X5 - đèn L-shape đặc trưng BMW', order: 2 },
        ]
      },
      {
        code: 'PSC',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=60', desc: 'Buồng lái Porsche Cayenne - Sport Design Package', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60', desc: 'Góc đuôi Cayenne Coupe - ống xả thể thao 4 ống', order: 2 },
        ]
      },
      {
        code: 'AQ7',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=60', desc: 'Khoang cabin Audi Q7 - màn hình MMI 10.1 inch', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60', desc: 'Đuôi Audi Q7 - đèn LED ma trận S-line', order: 2 },
        ]
      },
      {
        code: 'VF8',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=60', desc: 'Nội thất VinFast VF 8 - da cao cấp 2 màu', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60', desc: 'Đuôi xe VF 8 - cụm đèn LED dải ngang đặc trưng', order: 2 },
        ]
      },
      {
        code: 'CMR',
        photos: [
          { category: 'VEHICLE_INTERIOR', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=60', desc: 'Khoang nội thất Camry 2.5Q - da Nappa 8 hướng', order: 1 },
          { category: 'VEHICLE_BACK',     url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60', desc: 'Đuôi Toyota Camry 2.5Q phong cách doanh nhân', order: 2 },
        ]
      },
    ];

    for (const kvp of keyVehiclePhotos) {
      const vObj = dbVehicles[kvp.code];
      if (!vObj) continue;
      for (const photo of kvp.photos) {
        const exists = await prisma.media_files.findFirst({
          where: { entity_type: 'VEHICLE', entity_id: vObj.id, category: photo.category, is_primary: false }
        });
        if (!exists) {
          await prisma.media_files.create({
            data: {
              entity_type: 'VEHICLE',
              entity_id: vObj.id,
              media_type: 'IMAGE',
              category: photo.category,
              original_name: `${kvp.code}_${photo.category.toLowerCase()}.jpg`,
              stored_name: `${kvp.code}_${photo.category.toLowerCase()}.jpg`,
              file_path: photo.url,
              is_primary: false,
              sort_order: photo.order,
              storage_provider: 'LOCAL',
              description: photo.desc
            }
          });
        }
      }
    }

    // 5c. Customer License Media Files
    const pendingCustomers = [
      dbUsers['phamminhc@hotmail.com'],
      dbUsers['vuquynhanh@gmail.com']
    ];
    for (const cust of pendingCustomers) {
      const existingLicense = await prisma.media_files.findFirst({
        where: { entity_type: 'CUSTOMER_PROFILE', entity_id: cust.id }
      });
      if (!existingLicense) {
        await prisma.media_files.create({
          data: {
            entity_type: 'CUSTOMER_PROFILE',
            entity_id: cust.id,
            media_type: 'IMAGE',
            category: 'LICENSE_FRONT',
            original_name: `gplx_front_${cust.id}.jpg`,
            stored_name: `gplx_front_${cust.id}.jpg`,
            file_path: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
            storage_provider: 'LOCAL',
            uploaded_by: cust.id,
            description: 'Ảnh Giấy phép lái xe mặt trước của khách hàng'
          }
        });
      }
    }

    console.log('✓ 5. Table `media_files`: Seeded primary images (42 xe) + multi-angle photos (7 flagship models) + license uploads.');

    // =========================================================================
    // 5.5. TABLE: maintenance_records (15+ Maintenance History Records)
    // =========================================================================
    const adminUser = dbUsers['admin@autorent.vn'];
    const managerHN = dbUsers['manager@autorent.vn'];
    const managerHCM = dbUsers['manager.hcm@autorent.vn'];
    const managerDN = dbUsers['manager.danang@autorent.vn'];

    const maintenanceData = [
      // COMPLETED records (historical)
      {
        vehicleCode: 'RNG', createdBy: managerHN.id,
        maintenance_type: 'Thay dầu máy & lọc dầu',
        scheduled_date: new Date('2026-01-10'),
        completed_date: new Date('2026-01-10'),
        mileage_at_service: 25000,
        next_service_date: new Date('2026-07-10'),
        cost: new Prisma.Decimal(850000),
        status: 'COMPLETED' as const,
        description: 'Thay dầu động cơ 5W-30 API SP, lọc dầu Bosch. Kiểm tra hệ thống phanh và lốp xe.'
      },
      {
        vehicleCode: 'PSC', createdBy: managerHCM.id,
        maintenance_type: 'Bảo dưỡng định kỳ 20.000 km',
        scheduled_date: new Date('2026-01-20'),
        completed_date: new Date('2026-01-20'),
        mileage_at_service: 20000,
        next_service_date: new Date('2026-07-20'),
        cost: new Prisma.Decimal(5500000),
        status: 'COMPLETED' as const,
        description: 'Bảo dưỡng định kỳ tại đại lý Porsche Việt Nam. Thay dầu, lọc dầu, kiểm tra hệ thống PDCC và hộp số PDK.'
      },
      {
        vehicleCode: 'X5M', createdBy: managerHN.id,
        maintenance_type: 'Thay lốp xe Michelin Pilot Sport 5',
        scheduled_date: new Date('2026-02-05'),
        completed_date: new Date('2026-02-05'),
        mileage_at_service: 38000,
        next_service_date: new Date('2027-02-05'),
        cost: new Prisma.Decimal(9200000),
        status: 'COMPLETED' as const,
        description: 'Thay 4 lốp Michelin Pilot Sport 5 275/40R22 cho BMW X5. Cân bằng và chỉnh căn lốp 4 bánh.'
      },
      {
        vehicleCode: 'FTN', createdBy: managerHCM.id,
        maintenance_type: 'Thay lọc gió điều hòa & lọc cabin',
        scheduled_date: new Date('2026-02-15'),
        completed_date: new Date('2026-02-15'),
        mileage_at_service: 30000,
        next_service_date: new Date('2026-08-15'),
        cost: new Prisma.Decimal(650000),
        status: 'COMPLETED' as const,
        description: 'Thay lọc không khí điều hòa và lọc cabin Fortuner. Vệ sinh dàn lạnh, kiểm tra gas điều hòa.'
      },
      {
        vehicleCode: 'VF9', createdBy: managerHCM.id,
        maintenance_type: 'Kiểm tra & cập nhật phần mềm OTA',
        scheduled_date: new Date('2026-03-01'),
        completed_date: new Date('2026-03-01'),
        mileage_at_service: 15000,
        next_service_date: new Date('2026-09-01'),
        cost: new Prisma.Decimal(0),
        status: 'COMPLETED' as const,
        description: 'Cập nhật firmware ADAS v3.2, cập nhật bản đồ VinFast Navigation. Kiểm tra pin điện áp tổng thể và hệ thống sạc.'
      },
      {
        vehicleCode: 'GLE', createdBy: managerHCM.id,
        maintenance_type: 'Bảo dưỡng định kỳ 10.000 km tại đại lý',
        scheduled_date: new Date('2026-03-10'),
        completed_date: new Date('2026-03-10'),
        mileage_at_service: 10000,
        next_service_date: new Date('2026-09-10'),
        cost: new Prisma.Decimal(4200000),
        status: 'COMPLETED' as const,
        description: 'Bảo dưỡng GLE 450 tại Mercedes-Benz Trường Chinh. Thay dầu EQ, kiểm tra hệ thống treo khí E-ABC, phanh.'
      },
      {
        vehicleCode: 'CMR', createdBy: managerHN.id,
        maintenance_type: 'Thay má phanh & đĩa phanh trước',
        scheduled_date: new Date('2026-03-20'),
        completed_date: new Date('2026-03-20'),
        mileage_at_service: 45000,
        next_service_date: new Date('2027-03-20'),
        cost: new Prisma.Decimal(2800000),
        status: 'COMPLETED' as const,
        description: 'Thay bộ má phanh trước Brembo và đĩa phanh Toyota Camry. Kiểm tra hệ thống phanh ABS, EBD.'
      },
      {
        vehicleCode: 'EVE', createdBy: managerDN.id,
        maintenance_type: 'Thay dầu hộp số và dầu cầu',
        scheduled_date: new Date('2026-04-05'),
        completed_date: new Date('2026-04-05'),
        mileage_at_service: 40000,
        next_service_date: new Date('2027-04-05'),
        cost: new Prisma.Decimal(1800000),
        status: 'COMPLETED' as const,
        description: 'Thay dầu hộp số tự động 10AT Ford và dầu cầu sau Everest 4WD. Kiểm tra hệ thống dẫn động 4 bánh.'
      },
      {
        vehicleCode: 'TRT', createdBy: managerDN.id,
        maintenance_type: 'Kiểm tra định kỳ & thay bugi',
        scheduled_date: new Date('2026-04-18'),
        completed_date: new Date('2026-04-18'),
        mileage_at_service: 32000,
        next_service_date: new Date('2027-04-18'),
        cost: new Prisma.Decimal(1200000),
        status: 'COMPLETED' as const,
        description: 'Thay 4 bugi Bosch Iridium Triton. Làm sạch hệ thống nhiên liệu, kiểm tra turbocharger.'
      },
      {
        vehicleCode: 'CVC', createdBy: managerDN.id,
        maintenance_type: 'Thay dầu phanh DOT 4 & xả khí phanh',
        scheduled_date: new Date('2026-05-10'),
        completed_date: new Date('2026-05-10'),
        mileage_at_service: 28000,
        next_service_date: new Date('2028-05-10'),
        cost: new Prisma.Decimal(450000),
        status: 'COMPLETED' as const,
        description: 'Thay dầu phanh Honda Ultra DOT 4 cho Civic RS. Xả khí toàn bộ hệ thống phanh, kiểm tra hành trình bàn đạp phanh.'
      },
      {
        vehicleCode: 'VF8', createdBy: managerHN.id,
        maintenance_type: 'Kiểm tra và cân bằng lốp định kỳ',
        scheduled_date: new Date('2026-05-20'),
        completed_date: new Date('2026-05-20'),
        mileage_at_service: 18000,
        next_service_date: new Date('2026-11-20'),
        cost: new Prisma.Decimal(300000),
        status: 'COMPLETED' as const,
        description: 'Cân bằng lốp động 4 bánh VF 8. Đảo lốp trước - sau. Kiểm tra áp suất lốp và mòn hoa lốp đều.'
      },
      {
        vehicleCode: 'STF', createdBy: managerHN.id,
        maintenance_type: 'Thay dầu máy + bảo dưỡng điều hòa',
        scheduled_date: new Date('2026-06-08'),
        completed_date: new Date('2026-06-08'),
        mileage_at_service: 35000,
        next_service_date: new Date('2026-12-08'),
        cost: new Prisma.Decimal(1100000),
        status: 'COMPLETED' as const,
        description: 'Thay dầu Hyundai Genuine 5W-30 SantaFe. Nạp gas điều hòa R-134a, vệ sinh dàn nóng dàn lạnh.'
      },
      // IN_PROGRESS records (currently undergoing maintenance)
      {
        vehicleCode: 'RNG', createdBy: adminUser.id,
        maintenance_type: 'Sửa chữa hệ thống điện & đèn tín hiệu',
        scheduled_date: new Date('2026-08-10'),
        completed_date: null,
        mileage_at_service: 52000,
        next_service_date: null,
        cost: new Prisma.Decimal(2500000),
        status: 'IN_PROGRESS' as const,
        description: 'Chẩn đoán và sửa lỗi P0562 hệ thống điện Ford Ranger. Thay cầu chì hộp điện ngoài khoang máy, kiểm tra dây điện hở.'
      },
      {
        vehicleCode: 'PSC', createdBy: managerHCM.id,
        maintenance_type: 'Thay thanh nhún trước (Shock Absorber)',
        scheduled_date: new Date('2026-08-08'),
        completed_date: null,
        mileage_at_service: 28000,
        next_service_date: null,
        cost: new Prisma.Decimal(12000000),
        status: 'IN_PROGRESS' as const,
        description: 'Thay cặp giảm xóc trước Porsche Genuine Cayenne Coupe. Đang chờ phụ tùng từ đại lý Porsche chính hãng.'
      },
      {
        vehicleCode: 'JZZ', createdBy: managerDN.id,
        maintenance_type: 'Sửa chữa hộp số CVT Honda Jazz',
        scheduled_date: new Date('2026-08-05'),
        completed_date: null,
        mileage_at_service: 65000,
        next_service_date: null,
        cost: new Prisma.Decimal(8500000),
        status: 'IN_PROGRESS' as const,
        description: 'Khắc phục hiện tượng trượt số CVT Honda Jazz ở tốc độ cao. Đang thay cụm hộp số và kiểm tra ECU.'
      },
      // SCHEDULED records (upcoming)
      {
        vehicleCode: 'AQ7', createdBy: managerHN.id,
        maintenance_type: 'Bảo dưỡng định kỳ 15.000 km Audi Q7',
        scheduled_date: new Date('2026-09-15'),
        completed_date: null,
        mileage_at_service: null,
        next_service_date: new Date('2027-03-15'),
        cost: new Prisma.Decimal(4800000),
        status: 'SCHEDULED' as const,
        description: 'Lên lịch bảo dưỡng định kỳ tại Audi Đống Đa. Thay dầu Mobil 1 0W-40, lọc dầu, lọc gió, kiểm tra hệ thống Quattro.'
      },
      {
        vehicleCode: 'VF7', createdBy: managerHN.id,
        maintenance_type: 'Cập nhật phần mềm ADAS & kiểm tra pin',
        scheduled_date: new Date('2026-09-20'),
        completed_date: null,
        mileage_at_service: null,
        next_service_date: null,
        cost: new Prisma.Decimal(0),
        status: 'SCHEDULED' as const,
        description: 'Lên lịch kiểm tra sức khỏe pin định kỳ VinFast VF 7. Cập nhật OTA ADAS v4.0 tính năng lái tự động cấp 2.'
      },
    ];

    for (const maint of maintenanceData) {
      const vObj = dbVehicles[maint.vehicleCode];
      if (!vObj) { console.warn(`  [SKIP] Vehicle ${maint.vehicleCode} not found for maintenance record`); continue; }
      const { vehicleCode, createdBy, ...maintData } = maint;
      await prisma.maintenance_records.create({
        data: {
          vehicle_id: vObj.id,
          maintenance_type: maintData.maintenance_type,
          scheduled_date: maintData.scheduled_date,
          completed_date: maintData.completed_date ?? undefined,
          mileage_at_service: maintData.mileage_at_service ?? undefined,
          next_service_date: maintData.next_service_date ?? undefined,
          cost: maintData.cost,
          status: maintData.status,
          description: maintData.description,
          created_by: createdBy,
        }
      });
    }
    console.log(`✓ 5.5. Table \`maintenance_records\`: Seeded ${maintenanceData.length} records (12 COMPLETED, 3 IN_PROGRESS, 2 SCHEDULED).`);

    // =========================================================================
    // 6. TABLE: settings (System Configuration)
    // =========================================================================
    const settings = [
      {
        key: 'system_name',
        value: 'AutoRent',
        description: 'Tên hệ thống quản lý thuê xe',
      },
      {
        key: 'contact_email',
        value: 'support@autorent.vn',
        description: 'Email liên hệ hỗ trợ',
      },
      {
        key: 'contact_phone',
        value: '19001234',
        description: 'Hotline chăm sóc khách hàng',
      },
      {
        key: 'rental_policy',
        value: '1. Khách hàng phải có GPLX hợp lệ.\n2. Đặt cọc tiền mặt hoặc chuyển khoản theo giá trị xe.\n3. Trả xe đúng giờ quy định trong hợp đồng.',
        description: 'Chính sách thuê xe chung',
      },
      {
        key: 'sample_services',
        value: JSON.stringify([
          { id: 'srv-gps', name: 'Thiết bị định vị GPS', price: 50000, description: 'Thiết bị dẫn đường và định vị toàn cầu' },
          { id: 'srv-seat', name: 'Ghế ngồi trẻ em', price: 50000, description: 'Ghế an toàn cho trẻ em dưới 5 tuổi' },
          { id: 'srv-insurance', name: 'Bảo hiểm tai nạn tự nguyện', price: 100000, description: 'Bảo hiểm giảm thiểu trách nhiệm dân sự khi xảy ra sự cố' },
          { id: 'srv-wifi', name: 'Bộ phát Wifi 4G', price: 30000, description: 'Thiết bị phát wifi di động không giới hạn dung lượng' },
        ]),
        description: 'Danh sách các dịch vụ phụ trợ đi kèm',
      },
    ];

    for (const set of settings) {
      await prisma.settings.upsert({
        where: { key: set.key },
        update: { value: set.value, description: set.description },
        create: { key: set.key, value: set.value, description: set.description },
      });
    }
    console.log('✓ 6. Table `settings`: Seeded 5 system settings.');

    // =========================================================================
    // 7. TABLE: bookings (28 Bookings Jan - Aug 2026)
    // =========================================================================
    const customersList = [
      dbUsers['nguyenvana@gmail.com'],
      dbUsers['tranthib@yahoo.com'],
      dbUsers['phamminhc@hotmail.com'],
      dbUsers['hoangvudung@gmail.com'],
      dbUsers['nongthimai@gmail.com'],
      dbUsers['dinhthanhlong@gmail.com'],
      dbUsers['vuquynhanh@gmail.com'],
      dbUsers['lequanghung@gmail.com'],
      dbUsers['doanngocbaochau@gmail.com'],
      dbUsers['buitiendat@gmail.com'],
      dbUsers['nguyentranthao@gmail.com'],
    ];

    const managerUsers = [
      dbUsers['manager@autorent.vn'],
      dbUsers['manager.hcm@autorent.vn'],
      dbUsers['manager.danang@autorent.vn']
    ];

    const bookingsSeedData = [
      // --- JAN 2026 ---
      {
        code: 'AR-20260105-001',
        cust: customersList[0],
        veh: dbVehicles['VF8'],
        pickup: new Date('2026-01-05T08:00:00Z'),
        returnDate: new Date('2026-01-08T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Thiết bị định vị GPS', price: 50000, qty: 3 }],
        rating: 5,
        comment: 'Xe VinFast VF8 lái rất mượt, dịch vụ giao nhận đúng hẹn tại Hà Nội.'
      },
      {
        code: 'AR-20260112-002',
        cust: customersList[1],
        veh: dbVehicles['FTN'],
        pickup: new Date('2026-01-12T09:00:00Z'),
        returnDate: new Date('2026-01-16T17:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [{ name: 'Bảo hiểm tai nạn tự nguyện', price: 100000, qty: 4 }],
        rating: 5,
        comment: 'Fortuner chạy đường dài rất đằm xe, tiêu hao dầu hợp lý.'
      },
      {
        code: 'AR-20260120-003',
        cust: customersList[2],
        veh: dbVehicles['CVC'],
        pickup: new Date('2026-01-20T08:30:00Z'),
        returnDate: new Date('2026-01-23T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'MOMO' as const,
        services: [],
        rating: 4,
        comment: 'Civic RS chạy phố Đà Nẵng tuyệt vời. Xe sạch sẽ.'
      },

      // --- FEB 2026 ---
      {
        code: 'AR-20260202-004',
        cust: customersList[3],
        veh: dbVehicles['CMR'],
        pickup: new Date('2026-02-02T08:00:00Z'),
        returnDate: new Date('2026-02-05T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bộ phát Wifi 4G', price: 30000, qty: 3 }],
        rating: 5,
        comment: 'Camry 2.5Q nội thất sang trọng, đón đối tác rất lịch sự.'
      },
      {
        code: 'AR-20260210-005',
        cust: customersList[4],
        veh: dbVehicles['ACC'],
        pickup: new Date('2026-02-10T09:00:00Z'),
        returnDate: new Date('2026-02-14T17:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'CASH' as const,
        services: [],
        rating: 4,
        comment: 'Xe Accent chạy tiết kiệm xăng, giá thuê hợp lý.'
      },
      {
        code: 'AR-20260218-006',
        cust: customersList[5],
        veh: dbVehicles['EVE'],
        pickup: new Date('2026-02-18T08:00:00Z'),
        returnDate: new Date('2026-02-22T18:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [{ name: 'Ghế ngồi trẻ em', price: 50000, qty: 4 }],
        rating: 5,
        comment: 'Ford Everest đi tour miền Trung rất sướng. Nhân viên tư vấn tận tình.'
      },

      // --- MAR 2026 ---
      {
        code: 'AR-20260303-007',
        cust: customersList[6],
        veh: dbVehicles['STF'],
        pickup: new Date('2026-03-03T08:00:00Z'),
        returnDate: new Date('2026-03-07T18:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bảo hiểm tai nạn tự nguyện', price: 100000, qty: 4 }],
        rating: 5,
        comment: 'SantaFe máy dầu chạy khỏe, đi gia đình 7 người thoải mái.'
      },
      {
        code: 'AR-20260312-008',
        cust: customersList[7],
        veh: dbVehicles['CX5'],
        pickup: new Date('2026-03-12T09:00:00Z'),
        returnDate: new Date('2026-03-15T17:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'MOMO' as const,
        services: [],
        rating: 5,
        comment: 'CX-5 loa Bose nghe cực hay. Thủ tục ký hợp đồng online nhanh chóng.'
      },
      {
        code: 'AR-20260320-009',
        cust: customersList[8],
        veh: dbVehicles['GLE'],
        pickup: new Date('2026-03-20T08:00:00Z'),
        returnDate: new Date('2026-03-22T18:00:00Z'),
        days: 2,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bộ phát Wifi 4G', price: 30000, qty: 2 }],
        rating: 5,
        comment: 'Xe Mer GLE 450 đẳng cấp. CSKH phục vụ chu đáo.'
      },

      // --- APR 2026 ---
      {
        code: 'AR-20260405-010',
        cust: customersList[9],
        veh: dbVehicles['MZ3'],
        pickup: new Date('2026-04-05T08:30:00Z'),
        returnDate: new Date('2026-04-08T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [],
        rating: 4,
        comment: 'Mazda 3 thiết kế đẹp, xe thơm tho sạch sẽ.'
      },
      {
        code: 'AR-20260415-011',
        cust: customersList[10],
        veh: dbVehicles['CRV'],
        pickup: new Date('2026-04-15T09:00:00Z'),
        returnDate: new Date('2026-04-19T17:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Ghế ngồi trẻ em', price: 50000, qty: 4 }],
        rating: 5,
        comment: 'Honda CR-V đi lại tiện lợi, khoang hành lý rộng rãi.'
      },
      {
        code: 'AR-20260425-012',
        cust: customersList[1],
        veh: dbVehicles['TRT'],
        pickup: new Date('2026-04-25T08:00:00Z'),
        returnDate: new Date('2026-04-28T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'CASH' as const,
        services: [],
        rating: 4,
        comment: 'Xe bán tải Triton chở đồ tiện lợi cho chuyến dã ngoại.'
      },

      // --- MAY 2026 ---
      {
        code: 'AR-20260501-013',
        cust: customersList[2],
        veh: dbVehicles['VF8'],
        pickup: new Date('2026-05-01T08:00:00Z'),
        returnDate: new Date('2026-05-04T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [{ name: 'Thiết bị định vị GPS', price: 50000, qty: 3 }],
        rating: 5,
        comment: 'Trải nghiệm xe điện dịp lễ 30/4 rất tuyệt vời!'
      },
      {
        code: 'AR-20260510-014',
        cust: customersList[3],
        veh: dbVehicles['K3S'],
        pickup: new Date('2026-05-10T09:00:00Z'),
        returnDate: new Date('2026-05-13T17:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'MOMO' as const,
        services: [],
        rating: 4,
        comment: 'Kia K3 chạy mượt, điều hòa mát rượi.'
      },
      {
        code: 'AR-20260520-015',
        cust: customersList[4],
        veh: dbVehicles['FTN'],
        pickup: new Date('2026-05-20T08:00:00Z'),
        returnDate: new Date('2026-05-24T18:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [],
        rating: 5,
        comment: 'Fortuner 7 chỗ rộng rãi, giao xe tận nơi nhanh chóng.'
      },

      // --- JUN 2026 ---
      {
        code: 'AR-20260601-016',
        cust: customersList[5],
        veh: dbVehicles['CMR'],
        pickup: new Date('2026-06-01T08:00:00Z'),
        returnDate: new Date('2026-06-04T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bảo hiểm tai nạn tự nguyện', price: 100000, qty: 3 }],
        rating: 5,
        comment: 'Chuyến công tác thành công nhờ sự đồng hành của Camry 2.5Q!'
      },
      {
        code: 'AR-20260612-017',
        cust: customersList[6],
        veh: dbVehicles['EVE'],
        pickup: new Date('2026-06-12T09:00:00Z'),
        returnDate: new Date('2026-06-16T17:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [],
        rating: 5,
        comment: 'Everest chạy đường đèo rất an toàn và bốc.'
      },
      {
        code: 'AR-20260622-018',
        cust: customersList[7],
        veh: dbVehicles['X5M'],
        pickup: new Date('2026-06-22T08:00:00Z'),
        returnDate: new Date('2026-06-25T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bộ phát Wifi 4G', price: 30000, qty: 3 }],
        rating: 5,
        comment: 'BMW X5 lái quá sướng. Sẽ tiếp tục ủng hộ AutoRent!'
      },

      // --- JUL 2026 ---
      {
        code: 'AR-20260702-019',
        cust: customersList[8],
        veh: dbVehicles['CVC'],
        pickup: new Date('2026-07-02T08:30:00Z'),
        returnDate: new Date('2026-07-05T18:00:00Z'),
        days: 3,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'MOMO' as const,
        services: [],
        rating: 4,
        comment: 'Honda Civic chạy rất bốc, màu đỏ nổi bật.'
      },
      {
        code: 'AR-20260710-020',
        cust: customersList[0],
        veh: dbVehicles['FTN'],
        pickup: new Date('2026-07-10T08:00:00Z'),
        returnDate: new Date('2026-07-15T18:00:00Z'),
        days: 5,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Ghế ngồi trẻ em', price: 50000, qty: 5 }],
        rating: 5,
        comment: 'Bàn giao xe đúng giờ, hợp đồng điện tử tiện lợi.'
      },
      {
        code: 'AR-20260718-021',
        cust: customersList[1],
        veh: dbVehicles['STF'],
        pickup: new Date('2026-07-18T09:00:00Z'),
        returnDate: new Date('2026-07-22T17:00:00Z'),
        days: 4,
        status: 'COMPLETED' as const,
        payStatus: 'PAID' as const,
        method: 'VNPAY' as const,
        services: [],
        rating: 5,
        comment: 'Xe SantaFe đi gia đình vừa xinh, máy êm.'
      },

      // --- AUG 2026 (ACTIVE, PENDING, CONFIRMED, CANCELLED) ---
      {
        code: 'AR-20260801-022',
        cust: customersList[2],
        veh: dbVehicles['VF9'],
        pickup: new Date('2026-08-01T08:00:00Z'),
        returnDate: new Date('2026-08-15T18:00:00Z'),
        days: 14,
        status: 'ACTIVE' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bảo hiểm tai nạn tự nguyện', price: 100000, qty: 14 }],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260805-023',
        cust: customersList[3],
        veh: dbVehicles['FTN'],
        pickup: new Date('2026-08-05T08:00:00Z'),
        returnDate: new Date('2026-08-14T18:00:00Z'),
        days: 9,
        status: 'ACTIVE' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260808-024',
        cust: customersList[4],
        veh: dbVehicles['X5M'],
        pickup: new Date('2026-08-08T09:00:00Z'),
        returnDate: new Date('2026-08-16T17:00:00Z'),
        days: 8,
        status: 'ACTIVE' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [{ name: 'Bộ phát Wifi 4G', price: 30000, qty: 8 }],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260812-025',
        cust: customersList[5],
        veh: dbVehicles['VF8'],
        pickup: new Date('2026-08-14T09:00:00Z'),
        returnDate: new Date('2026-08-17T17:00:00Z'),
        days: 3,
        status: 'PENDING' as const,
        payStatus: 'UNPAID' as const,
        method: 'VNPAY' as const,
        services: [],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260812-026',
        cust: customersList[6],
        veh: dbVehicles['GLE'],
        pickup: new Date('2026-08-15T08:00:00Z'),
        returnDate: new Date('2026-08-18T18:00:00Z'),
        days: 3,
        status: 'CONFIRMED' as const,
        payStatus: 'PAID' as const,
        method: 'BANK_TRANSFER' as const,
        services: [],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260812-027',
        cust: customersList[7],
        veh: dbVehicles['CMR'],
        pickup: new Date('2026-08-16T08:00:00Z'),
        returnDate: new Date('2026-08-19T18:00:00Z'),
        days: 3,
        status: 'PENDING' as const,
        payStatus: 'UNPAID' as const,
        method: 'MOMO' as const,
        services: [],
        rating: null,
        comment: null
      },
      {
        code: 'AR-20260812-028',
        cust: customersList[8],
        veh: dbVehicles['ACC'],
        pickup: new Date('2026-08-10T08:00:00Z'),
        returnDate: new Date('2026-08-12T18:00:00Z'),
        days: 2,
        status: 'CANCELLED' as const,
        payStatus: 'UNPAID' as const,
        method: 'CASH' as const,
        services: [],
        rating: null,
        comment: null
      }
    ];

    const dbBookings: Record<string, any> = {};

    for (const item of bookingsSeedData) {
      const pricePerDay = Number(item.veh.price_per_day);
      const rentalFee = pricePerDay * item.days;
      
      let serviceFee = 0;
      for (const s of item.services) {
        serviceFee += s.price * s.qty;
      }
      
      const totalAmount = rentalFee + serviceFee;
      const depositAmount = Number(item.veh.deposit_amount);

      const existingBk = await prisma.bookings.findUnique({ where: { booking_code: item.code } });
      let bkObj = existingBk;

      if (!existingBk) {
        bkObj = await prisma.bookings.create({
          data: {
            booking_code: item.code,
            customer_id: item.cust.id,
            vehicle_id: item.veh.id,
            pickup_datetime: item.pickup,
            return_datetime: item.returnDate,
            pickup_location: item.veh.location || 'Hà Nội',
            return_location: item.veh.location || 'Hà Nội',
            rental_days: item.days,
            rental_fee: new Prisma.Decimal(rentalFee),
            service_fee: new Prisma.Decimal(serviceFee),
            deposit_amount: new Prisma.Decimal(depositAmount),
            total_amount: new Prisma.Decimal(totalAmount),
            status: item.status,
            payment_status: item.payStatus,
            customer_note: `Đơn đặt xe ${item.veh.name} chuyến đi công tác / du lịch.`,
            created_at: new Date(item.pickup.getTime() - 2 * 24 * 3600 * 1000)
          }
        });
      } else {
        bkObj = await prisma.bookings.update({
          where: { booking_code: item.code },
          data: {
            status: item.status,
            payment_status: item.payStatus
          }
        });
      }

      dbBookings[item.code] = bkObj;

      // =======================================================================
      // 8. TABLE: booking_services (Ancillary Services)
      // =======================================================================
      for (const s of item.services) {
        const existingSrv = await prisma.booking_services.findFirst({
          where: { booking_id: bkObj.id, service_name: s.name }
        });
        if (!existingSrv) {
          await prisma.booking_services.create({
            data: {
              booking_id: bkObj.id,
              service_name: s.name,
              quantity: s.qty,
              unit_price: new Prisma.Decimal(s.price),
              total_price: new Prisma.Decimal(s.price * s.qty),
              created_at: new Date(item.pickup.getTime() - 2 * 24 * 3600 * 1000)
            }
          });
        }
      }

      // =======================================================================
      // 9. TABLE: booking_status_history (Status Transition Logs)
      // =======================================================================
      const managerId = managerUsers[0].id;
      const historyList: { status: any; reason: string; date: Date }[] = [
        {
          status: 'PENDING' as const,
          reason: 'Khách hàng tạo đơn thuê thành công trên hệ thống',
          date: new Date(item.pickup.getTime() - 2 * 24 * 3600 * 1000)
        }
      ];

      if (item.status === 'CONFIRMED' || item.status === 'ACTIVE' || item.status === 'COMPLETED') {
        historyList.push({
          status: 'CONFIRMED' as const,
          reason: 'Quản lý duyệt đơn và xác nhận khoản tiền cọc',
          date: new Date(item.pickup.getTime() - 1 * 24 * 3600 * 1000)
        });
      }

      if (item.status === 'ACTIVE' || item.status === 'COMPLETED') {
        historyList.push({
          status: 'ACTIVE' as const,
          reason: 'Hoàn tất thủ tục lập biên bản PICKUP và bàn giao chìa khóa xe',
          date: item.pickup
        });
      }

      if (item.status === 'COMPLETED') {
        historyList.push({
          status: 'COMPLETED' as const,
          reason: 'Khách hàng trả xe, lập biên bản RETURN và hoàn tất thanh toán',
          date: item.returnDate
        });
      }

      if (item.status === 'CANCELLED') {
        historyList.push({
          status: 'CANCELLED' as const,
          reason: 'Khách hàng hủy đơn do thay đổi kế hoạch chuyến đi',
          date: new Date(item.pickup.getTime() - 12 * 3600 * 1000)
        });
      }

      for (const h of historyList) {
        const existingH = await prisma.booking_status_history.findFirst({
          where: { booking_id: bkObj.id, status: h.status }
        });
        if (!existingH) {
          await prisma.booking_status_history.create({
            data: {
              booking_id: bkObj.id,
              status: h.status,
              changed_by: managerId,
              reason: h.reason,
              created_at: h.date
            }
          });
        }
      }

      // =======================================================================
      // 10. TABLE: contracts (Electronic Contracts)
      // =======================================================================
      const contractStatus = (item.status === 'COMPLETED' || item.status === 'ACTIVE' || item.status === 'CONFIRMED')
        ? 'SIGNED' as const
        : (item.status === 'CANCELLED' ? 'CANCELLED' as const : 'PENDING_SIGN' as const);

      await prisma.contracts.upsert({
        where: { booking_id: bkObj.id },
        update: { status: contractStatus },
        create: {
          booking_id: bkObj.id,
          contract_code: `HD-${item.code}`,
          contract_url: 'https://autorent.vn/contracts/signed_template.pdf',
          status: contractStatus,
          signed_at: contractStatus === 'SIGNED' ? item.pickup : null,
          created_at: new Date(item.pickup.getTime() - 2 * 24 * 3600 * 1000)
        }
      });

      // =======================================================================
      // 11. TABLE: payments (Transaction Records)
      // =======================================================================
      if (item.payStatus === 'PAID') {
        const existingPay = await prisma.payments.findFirst({ where: { booking_id: bkObj.id } });
        if (!existingPay) {
          const payObj = await prisma.payments.create({
            data: {
              transaction_code: `TXN-${item.code}`,
              booking_id: bkObj.id,
              customer_id: item.cust.id,
              transaction_type: 'RENTAL',
              amount: new Prisma.Decimal(totalAmount),
              payment_method: item.method,
              status: 'PAID',
              paid_at: new Date(item.pickup.getTime() - 24 * 3600 * 1000),
              created_at: new Date(item.pickup.getTime() - 24 * 3600 * 1000)
            }
          });

          // Also seed media file for payment receipt
          await prisma.media_files.create({
            data: {
              entity_type: 'PAYMENT',
              entity_id: payObj.id,
              media_type: 'IMAGE',
              category: 'PAYMENT_RECEIPT',
              original_name: `receipt_${payObj.id}.jpg`,
              stored_name: `receipt_${payObj.id}.jpg`,
              file_path: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
              storage_provider: 'LOCAL',
              uploaded_by: item.cust.id,
              description: 'Ủy nhiệm chi thanh toán chuyển khoản ngân hàng'
            }
          });
        }
      }

      // =======================================================================
      // 12. TABLE: handover_records (Handover Pickup & Return Records)
      // =======================================================================
      if (item.status === 'ACTIVE' || item.status === 'COMPLETED') {
        const existingPickup = await prisma.handover_records.findFirst({
          where: { booking_id: bkObj.id, record_type: 'PICKUP' }
        });
        if (!existingPickup) {
          await prisma.handover_records.create({
            data: {
              booking_id: bkObj.id,
              record_type: 'PICKUP',
              recorded_by: managerUsers[0].id,
              recorded_at: item.pickup,
              mileage: 15000 + Math.floor(Math.random() * 5000),
              fuel_level: 100,
              vehicle_condition: 'EXCELLENT',
              note: 'Bàn giao xe đúng giờ, ngoại thất sạch sẽ không trầy xước.'
            }
          });
        }

        if (item.status === 'COMPLETED') {
          const existingReturn = await prisma.handover_records.findFirst({
            where: { booking_id: bkObj.id, record_type: 'RETURN' }
          });
          if (!existingReturn) {
            await prisma.handover_records.create({
              data: {
                booking_id: bkObj.id,
                record_type: 'RETURN',
                recorded_by: managerUsers[0].id,
                recorded_at: item.returnDate,
                mileage: 15000 + item.days * 180,
                fuel_level: 100,
                vehicle_condition: 'GOOD',
                cleaning_fee: new Prisma.Decimal(100000),
                total_surcharge: new Prisma.Decimal(100000),
                refundable_deposit: new Prisma.Decimal(depositAmount - 100000),
                note: 'Nhận lại xe đúng hạn, phụ phí vệ sinh rửa xe 100.000đ.'
              }
            });
          }
        }
      }

      // =======================================================================
      // 13. TABLE: reviews (Customer Feedback for Completed Trips)
      // =======================================================================
      if (item.status === 'COMPLETED' && item.rating && item.comment) {
        await prisma.reviews.upsert({
          where: { booking_id: bkObj.id },
          update: { rating: item.rating, content: item.comment },
          create: {
            booking_id: bkObj.id,
            customer_id: item.cust.id,
            vehicle_id: item.veh.id,
            rating: item.rating,
            content: item.comment,
            created_at: item.returnDate
          }
        });
      }
    }

    console.log('✓ 7. Table `bookings`: Seeded 28 bookings.');
    console.log('✓ 8. Table `booking_services`: Seeded ancillary services for bookings.');
    console.log('✓ 9. Table `booking_status_history`: Seeded status transition history logs.');
    console.log('✓ 10. Table `contracts`: Seeded electronic contracts for bookings.');
    console.log('✓ 11. Table `payments`: Seeded payments & receipt media files.');
    console.log('✓ 12. Table `handover_records`: Seeded PICKUP and RETURN handover records.');
    console.log('✓ 13. Table `reviews`: Seeded customer reviews and ratings.');

    // =========================================================================
    // 14. TABLE: maintenance_records (8 Maintenance History Records)
    // =========================================================================
    const additionalMaintenanceData = [
      {
        veh: dbVehicles['RNG'],
        type: 'Bảo dưỡng định kỳ 30.000 km',
        schedDate: new Date('2026-08-01'),
        cost: 3500000,
        status: 'IN_PROGRESS' as const,
        desc: 'Thay dầu động cơ Bi-Turbo, lọc nhớt, vệ sinh hệ thống phanh, đảo lốp định kỳ.',
        creator: dbUsers['admin@autorent.vn'].id
      },
      {
        veh: dbVehicles['PSC'],
        type: 'Bảo dưỡng định kỳ 20.000 km Hãng Porsche',
        schedDate: new Date('2026-08-05'),
        cost: 12000000,
        status: 'IN_PROGRESS' as const,
        desc: 'Bảo dưỡng cao cấp chính hãng Porsche, kiểm tra toàn bộ hệ thống treo khí nén.',
        creator: dbUsers['admin@autorent.vn'].id
      },
      {
        veh: dbVehicles['FTN'],
        type: 'Bảo dưỡng định kỳ 40.000 km',
        schedDate: new Date('2026-04-10'),
        compDate: new Date('2026-04-12'),
        cost: 4800000,
        status: 'COMPLETED' as const,
        desc: 'Thay dầu số tự động, thay dung dịch làm mát, cân bằng động 4 bánh.',
        creator: dbUsers['manager@autorent.vn'].id
      },
      {
        veh: dbVehicles['GLE'],
        type: 'Kiểm tra hệ thống điều hòa & Đèn LED',
        schedDate: new Date('2026-05-15'),
        compDate: new Date('2026-05-16'),
        cost: 2500000,
        status: 'COMPLETED' as const,
        desc: 'Vệ sinh giàn lạnh, nạp gas máy lạnh R134a, cập nhật phần mềm MBUX.',
        creator: dbUsers['manager.hcm@autorent.vn'].id
      },
      {
        veh: dbVehicles['VF8'],
        type: 'Cập nhật phần mềm FSD & Bảo dưỡng phanh',
        schedDate: new Date('2026-06-20'),
        compDate: new Date('2026-06-20'),
        cost: 1500000,
        status: 'COMPLETED' as const,
        desc: 'Cập nhật phần mềm xe điện VinFast bản 9.0, tra mỡ chốt phanh.',
        creator: dbUsers['manager@autorent.vn'].id
      },
      {
        veh: dbVehicles['STF'],
        type: 'Thay bộ lốp Michelin mới',
        schedDate: new Date('2026-07-01'),
        compDate: new Date('2026-07-02'),
        cost: 9200000,
        status: 'COMPLETED' as const,
        desc: 'Thay 4 quả lốp Michelin Primacy SUV 235/55R19, cân chỉnh thước lái 3D.',
        creator: dbUsers['manager@autorent.vn'].id
      },
      {
        veh: dbVehicles['EVE'],
        type: 'Bảo dưỡng định kỳ 15.000 km',
        schedDate: new Date('2026-08-25'),
        cost: 2800000,
        status: 'SCHEDULED' as const,
        desc: 'Lịch hẹn bảo dưỡng định kỳ tiếp theo tại Ford Đà Nẵng.',
        creator: dbUsers['manager.danang@autorent.vn'].id
      },
      {
        veh: dbVehicles['CMR'],
        type: 'Sơn cản trước & Phủ Ceramic',
        schedDate: new Date('2026-03-01'),
        compDate: new Date('2026-03-03'),
        cost: 5500000,
        status: 'COMPLETED' as const,
        desc: 'Sơn dặm vế xước nhẹ cản trước và phủ bóng Ceramic bảo vệ sơn xe.',
        creator: dbUsers['manager@autorent.vn'].id
      }
    ];

    for (const m of additionalMaintenanceData) {
      const existing = await prisma.maintenance_records.findFirst({
        where: { vehicle_id: m.veh.id, maintenance_type: m.type }
      });
      if (!existing) {
        await prisma.maintenance_records.create({
          data: {
            vehicle_id: m.veh.id,
            maintenance_type: m.type,
            scheduled_date: m.schedDate,
            completed_date: m.compDate || null,
            cost: new Prisma.Decimal(m.cost),
            status: m.status,
            description: m.desc,
            created_by: m.creator
          }
        });
      }
    }
    console.log('✓ 14. Table `maintenance_records`: Seeded 8 maintenance records.');

    // =========================================================================
    // 15. TABLE: notifications (35 System Notifications to Customers)
    // =========================================================================
    const sampleNotifications = [
      {
        user: dbUsers['nguyenvana@gmail.com'],
        title: 'Xác nhận cọc thành công',
        content: 'Khoản thanh toán cọc đơn hàng AR-20260710-020 đã được xác nhận. Xe Toyota Fortuner của bạn đã sẵn sàng bàn giao.',
        type: 'SUCCESS',
        is_read: true
      },
      {
        user: dbUsers['nguyenvana@gmail.com'],
        title: 'GPLX đã được xác minh',
        content: 'Giấy phép lái xe hạng B2 của bạn đã được kiểm duyệt thành công trên hệ thống AutoRent.',
        type: 'SYSTEM',
        is_read: true
      },
      {
        user: dbUsers['tranthib@yahoo.com'],
        title: 'Nhắc nhở ký hợp đồng điện tử',
        content: 'Đơn đặt xe VinFast VF 8 chưa được ký hợp đồng. Vui lòng ký điện tử trước thời gian bàn giao xe 12 tiếng.',
        type: 'WARNING',
        is_read: false
      },
      {
        user: dbUsers['phamminhc@hotmail.com'],
        title: 'Hồ sơ GPLX đang chờ duyệt',
        content: 'Ảnh GPLX của bạn đang được nhân viên tư vấn AutoRent kiểm tra đối chiếu. Kết quả sẽ có trong 30 phút.',
        type: 'INFO',
        is_read: false
      },
      {
        user: dbUsers['hoangvudung@gmail.com'],
        title: 'Thanh toán thành công đơn hàng',
        content: 'Giao dịch TXN-AR-20260202-004 trị giá 4.800.000đ đã hoàn tất qua chuyển khoản ngân hàng.',
        type: 'SUCCESS',
        is_read: true
      },
      {
        user: dbUsers['nongthimai@gmail.com'],
        title: 'Khuyến mãi thành viên mới',
        content: 'Chào mừng bạn đến với AutoRent! Tặng ngay voucher giảm 10% cho chuyến thuê xe SUV tiếp theo.',
        type: 'PROMO',
        is_read: true
      },
      {
        user: dbUsers['dinhthanhlong@gmail.com'],
        title: 'Bàn giao xe thành công',
        content: 'Biên bản PICKUP xe Ford Everest (AR-20260218-006) đã hoàn tất. Chúc bạn có chuyến đi an toàn!',
        type: 'SUCCESS',
        is_read: true
      },
      {
        user: dbUsers['vuquynhanh@gmail.com'],
        title: 'Yêu cầu bổ sung ảnh GPLX mặt sau',
        content: 'Ảnh Giấy phép lái xe mặt trước đã được lưu. Vui lòng tải lên thêm ảnh mặt sau để hoàn tất xác minh.',
        type: 'WARNING',
        is_read: false
      },
      {
        user: dbUsers['lequanghung@gmail.com'],
        title: 'Xác nhận cọc đơn hàng Mercedes GLE',
        content: 'Đơn đặt xe AR-20260812-026 đã được Quản lý xác nhận. Xe Mercedes GLE 450 sẵn sàng bàn giao ngày 15/08.',
        type: 'SUCCESS',
        is_read: false
      },
      {
        user: dbUsers['doanngocbaochau@gmail.com'],
        title: 'Từ chối xác thực GPLX',
        content: 'Giấy phép lái xe bị mờ thông tin. Vui lòng tải lại ảnh chụp GPLX rõ nét hơn.',
        type: 'ERROR',
        is_read: true
      }
    ];

    // Create 35 notifications by expanding/repeating for customers
    for (let i = 0; i < 35; i++) {
      const template = sampleNotifications[i % sampleNotifications.length];
      const targetUser = customersList[i % customersList.length];
      await prisma.notifications.create({
        data: {
          user_id: targetUser.id,
          title: `${template.title} #${i + 1}`,
          content: template.content,
          type: template.type,
          is_read: i % 2 === 0,
          created_at: new Date(Date.now() - (35 - i) * 3600 * 24 * 1000)
        }
      });
    }
    console.log('✓ 15. Table `notifications`: Seeded 35 system notifications.');

    // =========================================================================
    // 16. TABLE: audit_logs (Activity Audit History Logs)
    // =========================================================================
    const auditLogsToSeed = [
      {
        user_id: dbUsers['admin@autorent.vn'].id,
        action: 'ADMIN_LOGIN',
        entity_name: 'users',
        entity_id: dbUsers['admin@autorent.vn'].id,
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0'
      },
      {
        user_id: dbUsers['admin@autorent.vn'].id,
        action: 'CREATE_VEHICLE',
        entity_name: 'vehicles',
        entity_id: dbVehicles['VF8'].id,
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0'
      },
      {
        user_id: dbUsers['manager@autorent.vn'].id,
        action: 'VERIFY_CUSTOMER_PROFILE',
        entity_name: 'customer_profiles',
        entity_id: dbProfiles[dbUsers['nguyenvana@gmail.com'].id.toString()]?.id || BigInt(1),
        ip_address: '14.232.110.45',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      {
        user_id: dbUsers['manager.hcm@autorent.vn'].id,
        action: 'APPROVE_BOOKING',
        entity_name: 'bookings',
        entity_id: dbBookings['AR-20260812-026']?.id || BigInt(1),
        ip_address: '113.161.40.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/127.0.0.0'
      },
      {
        user_id: dbUsers['admin@autorent.vn'].id,
        action: 'UPDATE_SYSTEM_SETTINGS',
        entity_name: 'settings',
        entity_id: BigInt(1),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0'
      }
    ];

    // Seed 25 audit logs spanning actions
    for (let i = 0; i < 25; i++) {
      const template = auditLogsToSeed[i % auditLogsToSeed.length];
      await prisma.audit_logs.create({
        data: {
          user_id: template.user_id,
          action: `${template.action}_${i + 1}`,
          entity_name: template.entity_name,
          entity_id: template.entity_id,
          ip_address: template.ip_address,
          user_agent: template.user_agent,
          old_values: { status: 'PENDING' },
          new_values: { status: 'VERIFIED' },
          created_at: new Date(Date.now() - (25 - i) * 3600 * 12 * 1000)
        }
      });
    }
    console.log('✓ 16. Table `audit_logs`: Seeded 25 audit log history records.');

    console.log('\n🎉 ALL 16 TABLES IN AUTORENT DATABASE SEEDED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Error during seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Fatal Seed Script Failure:', e);
    process.exit(1);
  });
