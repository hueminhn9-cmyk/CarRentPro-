import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu nạp BỘ DỮ LIỆU KHỦNG (MEGA FLEET & HISTORICAL REVENUE SEEDER)...');

  const passwordHashCustomer = bcrypt.hashSync('123456', 10);
  const passwordHashManager = bcrypt.hashSync('123456', 10);

  // 1. More Locations
  const locations = [
    { name: 'Showroom Nha Trang - Trần Phú', city: 'Nha Trang', district: 'Vĩnh Nguyên', address: '88 Trần Phú, Vĩnh Nguyên, Nha Trang' },
    { name: 'Showroom Đà Lạt - Hồ Xuân Hương', city: 'Đà Lạt', district: 'Phường 1', address: '12 Trần Quốc Toản, Phường 1, Đà Lạt' },
    { name: 'Chi nhánh Hải Phòng - Lê Hồng Phong', city: 'Hải Phòng', district: 'Ngô Quyền', address: '25 Lê Hồng Phong, Đông Khê, Ngô Quyền, Hải Phòng' },
    { name: 'Chi nhánh Cần Thơ - Ninh Kiều', city: 'Cần Thơ', district: 'Ninh Kiều', address: '10 Đại lộ Hòa Bình, Tân An, Ninh Kiều, Cần Thơ' },
  ];

  for (const loc of locations) {
    await prisma.locations.upsert({
      where: { name: loc.name },
      update: loc,
      create: loc,
    });
  }

  const allLocations = await prisma.locations.findMany();
  const getLoc = (city: string) => allLocations.find(l => l.city.includes(city)) || allLocations[0];

  // 2. Fetch categories
  const categories = await prisma.vehicle_categories.findMany();
  const catMap: Record<string, bigint> = {};
  categories.forEach(c => { catMap[c.name] = c.id; });

  // 3. Add 15 Luxury & Trending Vehicles
  const newVehicles = [
    {
      code: 'VF3-01',
      name: 'VinFast VF3 Plus 2024 (Vàng Nóc Trắng)',
      brand: 'VinFast',
      model: 'VF3',
      category: 'Hatchback',
      manufacture_year: 2024,
      license_plate: '43A-991.12',
      color: 'Vàng Nắng',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 3200,
      price_per_day: 650000,
      deposit_amount: 10000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VF6-01',
      name: 'VinFast VF6 Plus (Xanh Dương)',
      brand: 'VinFast',
      model: 'VF6 Plus',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '43A-882.34',
      color: 'Xanh VinFast',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 8500,
      price_per_day: 1200000,
      deposit_amount: 15000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VF7-01',
      name: 'VinFast VF7 Plus AWD (Xám Bạc Đẳng Cấp)',
      brand: 'VinFast',
      model: 'VF7 AWD',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '43A-776.88',
      color: 'Xám Titan',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 6200,
      price_per_day: 1600000,
      deposit_amount: 20000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'POR-01',
      name: 'Porsche Taycan 4S Electric Sportscar',
      brand: 'Porsche',
      model: 'Taycan 4S',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '51K-999.99',
      color: 'Trắng Carrara',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 14200,
      price_per_day: 5500000,
      deposit_amount: 60000000,
      city: 'TP. Hồ Chí Minh',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'MER-S450',
      name: 'Mercedes-Benz S450 Luxury (Khoang Maybach)',
      brand: 'Mercedes-Benz',
      model: 'S450 Luxury',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '30H-888.88',
      color: 'Đen Obsidian',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 18500,
      price_per_day: 4800000,
      deposit_amount: 50000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'BMW-X5',
      name: 'BMW X5 xDrive40i M-Sport',
      brand: 'BMW',
      model: 'X5 M-Sport',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '43A-666.99',
      color: 'Xanh Phytonic',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 21000,
      price_per_day: 3500000,
      deposit_amount: 40000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'LEX-RX350',
      name: 'Lexus RX350 Premium Luxury',
      brand: 'Lexus',
      model: 'RX350',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '51L-777.66',
      color: 'Trắng Ngọc Trai',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 15400,
      price_per_day: 3800000,
      deposit_amount: 40000000,
      city: 'TP. Hồ Chí Minh',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'KIA-CAR',
      name: 'Kia Carnival Signature 3.5G (Chuyên Cơ Mặt Đất)',
      brand: 'Kia',
      model: 'Carnival Signature',
      category: 'SUV',
      manufacture_year: 2023,
      license_plate: '43A-555.22',
      color: 'Trắng Tuyết',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 28900,
      price_per_day: 2200000,
      deposit_amount: 25000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'HYU-SAN',
      name: 'Hyundai SantaFe Calligraphy H-Trac',
      brand: 'Hyundai',
      model: 'SantaFe 2024',
      category: 'SUV',
      manufacture_year: 2024,
      license_plate: '30K-444.33',
      color: 'Đồng Terracotta',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'DIESEL' as const,
      current_mileage: 9500,
      price_per_day: 1800000,
      deposit_amount: 20000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VOL-XC90',
      name: 'Volvo XC90 Recharge Ultimate Hybrid',
      brand: 'Volvo',
      model: 'XC90 Recharge',
      category: 'Luxury',
      manufacture_year: 2023,
      license_plate: '43A-333.11',
      color: 'Bạc Crystal',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'HYBRID' as const,
      current_mileage: 16700,
      price_per_day: 4200000,
      deposit_amount: 45000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80'
    }
  ];

  for (const v of newVehicles) {
    const loc = getLoc(v.city);
    const catId = catMap[v.category] || catMap['SUV'] || BigInt(1);

    const createdVeh = await prisma.vehicles.upsert({
      where: { license_plate: v.license_plate },
      update: {
        code: v.code,
        name: v.name,
        price_per_day: new Prisma.Decimal(v.price_per_day),
        deposit_amount: new Prisma.Decimal(v.deposit_amount),
        current_mileage: v.current_mileage,
        location_id: loc.id,
      },
      create: {
        code: v.code,
        name: v.name,
        brand: v.brand,
        model: v.model,
        category_id: catId,
        location_id: loc.id,
        manufacture_year: v.manufacture_year,
        license_plate: v.license_plate,
        color: v.color,
        seat_count: v.seat_count,
        transmission: v.transmission,
        fuel_type: v.fuel_type,
        current_mileage: v.current_mileage,
        price_per_day: new Prisma.Decimal(v.price_per_day),
        deposit_amount: new Prisma.Decimal(v.deposit_amount),
        included_km_per_day: 250,
        extra_km_fee: new Prisma.Decimal(5000),
        status: v.status,
      }
    });

    // Add primary image
    const existingMedia = await prisma.media_files.findFirst({
      where: { entity_type: 'VEHICLE', entity_id: createdVeh.id, is_primary: true }
    });
    if (!existingMedia) {
      await prisma.media_files.create({
        data: {
          entity_type: 'VEHICLE',
          entity_id: createdVeh.id,
          category: 'VEHICLE_FRONT',
          original_name: `${v.code}.jpg`,
          stored_name: `${v.code}.jpg`,
          mime_type: 'image/jpeg',
          file_size: 204800,
          file_path: v.img,
          is_primary: true,
        }
      });
    }
  }
  console.log(`✓ Đã bổ sung 10 mẫu xe sang và hot trend vào đội xe.`);

  // 4. Create 10 More Customers from various provinces
  const newCustomers = [
    { email: 'hoang.minh@vietnamnet.vn', name: 'Hoàng Minh Tuấn', phone: '0918776655', cccd: '048098001122', gplx: 'B2-480991223' },
    { email: 'dang.thuy@vinamilk.com.vn', name: 'Đặng Thúy Hằng', phone: '0905123888', cccd: '048197003344', gplx: 'B2-481973344' },
    { email: 'bui.ducanh@fpt.com', name: 'Bùi Đức Anh', phone: '0978999111', cccd: '001099005566', gplx: 'B2-010995566' },
    { email: 'doan.ngoc@techcombank.com.vn', name: 'Đoàn Ngọc Trâm', phone: '0933221100', cccd: '079196007788', gplx: 'B2-791967788' },
    { email: 'phan.quoc@vng.com.vn', name: 'Phan Quốc Bảo', phone: '0988665544', cccd: '048094009900', gplx: 'C-480949900' },
    { email: 'vu.hoang@shopee.vn', name: 'Vũ Hoàng Nam', phone: '0912445566', cccd: '031093002233', gplx: 'B2-310932233' },
    { email: 'nguyen.kim@vingroup.net', name: 'Nguyễn Thị Kim Oanh', phone: '0903889900', cccd: '048192004455', gplx: 'B2-481924455' },
    { email: 'tran.khang@momo.vn', name: 'Trần Gia Khang', phone: '0938771122', cccd: '079095006677', gplx: 'B2-790956677' },
  ];

  const dbCusts: any[] = [];
  for (const c of newCustomers) {
    const u = await prisma.users.upsert({
      where: { email: c.email },
      update: { full_name: c.name, phone: c.phone, role: 'CUSTOMER', status: 'ACTIVE' },
      create: {
        email: c.email,
        full_name: c.name,
        phone: c.phone,
        password_hash: passwordHashCustomer,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`
      }
    });

    const uniqueCccd = `048${Math.floor(100000000 + Math.random() * 900000000)}`;
    const uniqueGplx = `B2-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const existingProfile = await prisma.customer_profiles.findUnique({ where: { user_id: u.id } });
    if (!existingProfile) {
      await prisma.customer_profiles.create({
        data: {
          user_id: u.id,
          citizen_id: uniqueCccd,
          driver_license_number: uniqueGplx,
          verification_status: 'VERIFIED',
        }
      });
    }

    dbCusts.push(u);
  }
  console.log(`✓ Đã nạp thêm 8 khách hàng doanh nghiệp & VIP.`);

  // 5. Generate 24 Historical Bookings across all 12 Months of 2026 (For Admin Monthly Charts)
  console.log('📈 Nạp dữ liệu doanh thu lũy kế 12 tháng (P&L Chart Data)...');
  const allVehs = await prisma.vehicles.findMany();
  const adminUser = await prisma.users.findFirst({ where: { role: 'ADMIN' } });
  const managerUser = await prisma.users.findFirst({ where: { role: 'MANAGER' } });

  const currentYear = 2026;
  for (let m = 0; m < 12; m++) {
    // 2 bookings per month
    for (let k = 1; k <= 2; k++) {
      const bCode = `AR-${currentYear}${String(m + 1).padStart(2, '0')}${String(k * 10).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
      const randomCust = dbCusts[k % dbCusts.length];
      const randomVeh = allVehs[(m * 2 + k) % allVehs.length];

      const rentDays = 3 + (k % 4);
      const pricePerDay = Number(randomVeh.price_per_day);
      const rentalFee = pricePerDay * rentDays;
      const serviceFee = 250000;
      const totalAmount = rentalFee + serviceFee;
      const depositAmount = Number(randomVeh.deposit_amount);

      const startDate = new Date(currentYear, m, 5 + k * 8, 8, 30);
      const endDate = new Date(currentYear, m, 5 + k * 8 + rentDays, 17, 30);

      const existingBooking = await prisma.bookings.findUnique({ where: { booking_code: bCode } });
      if (!existingBooking) {
        const b = await prisma.bookings.create({
          data: {
            booking_code: bCode,
            customer_id: randomCust.id,
            vehicle_id: randomVeh.id,
            pickup_datetime: startDate,
            return_datetime: endDate,
            pickup_location: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng',
            return_location: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng',
            rental_days: rentDays,
            rental_fee: new Prisma.Decimal(rentalFee),
            service_fee: new Prisma.Decimal(serviceFee),
            deposit_amount: new Prisma.Decimal(depositAmount),
            total_amount: new Prisma.Decimal(totalAmount),
            status: 'COMPLETED',
            payment_status: 'PAID',
            customer_note: 'Thuê xe phục vụ công tác và hội thảo doanh nghiệp.',
            created_at: startDate,
            updated_at: endDate,
          }
        });

        // Add payment record for this month
        await prisma.payments.create({
          data: {
            transaction_code: `TXN-REV-${m + 1}-${k}-${b.id}`,
            booking_id: b.id,
            customer_id: randomCust.id,
            transaction_type: 'RENTAL',
            amount: new Prisma.Decimal(totalAmount),
            payment_method: k % 2 === 0 ? 'VNPAY' : 'BANK_TRANSFER',
            status: 'PAID',
            payment_reference: `VNPAY-TRANS-${m + 1}-${k}`,
            paid_at: startDate,
            created_at: startDate,
          }
        });

        // Add contract
        await prisma.contracts.create({
          data: {
            booking_id: b.id,
            contract_code: `HD-${bCode}`,
            status: 'TERMINATED',
            signed_at: startDate,
            created_at: startDate,
          }
        });

        // Add Review
        if (k === 1) {
          await prisma.reviews.create({
            data: {
              booking_id: b.id,
              customer_id: randomCust.id,
              vehicle_id: randomVeh.id,
              rating: 5,
              content: `Dịch vụ tại AutoRent quá tuyệt vời! Xe ${randomVeh.name} mới tinh, êm ái, pin/xăng đầy 100% lúc nhận. Nhân viên bàn giao rất nhiệt tình!`,
              status: 'APPROVED',
              created_at: endDate
            }
          });
        }
      }
    }
  }
  console.log(`✓ Đã nạp thành công 24 đơn thuê hoàn thành với thanh toán phủ khắp 12 tháng năm 2026!`);

  // 6. Summary count
  const countVehicles = await prisma.vehicles.count();
  const countUsers = await prisma.users.count();
  const countBookings = await prisma.bookings.count();
  const countContracts = await prisma.contracts.count();
  const countPayments = await prisma.payments.count();
  const countReviews = await prisma.reviews.count();

  console.log('\n======================================================');
  console.log('🎉 MEGA SEED HOÀN TẤT VỚI DỮ LIỆU ĐỒ SỘ!');
  console.log('======================================================');
  console.log(`- Tổng đội xe (Vehicles): ${countVehicles} chiếc`);
  console.log(`- Tổng người dùng (Users): ${countUsers} người`);
  console.log(`- Tổng đơn đặt xe (Bookings): ${countBookings} đơn`);
  console.log(`- Tổng hợp đồng (Contracts): ${countContracts} bản`);
  console.log(`- Tổng giao dịch thanh toán (Payments): ${countPayments} lượt`);
  console.log(`- Tổng đánh giá phản hồi (Reviews): ${countReviews} lượt`);
  console.log('======================================================');
}

main()
  .catch((e) => {
    console.error('Lỗi khi chạy Mega Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
