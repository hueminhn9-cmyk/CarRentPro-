import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 BẮT ĐẦU NẠP DỮ LIỆU ĐỒ SỘ CỰC ĐẠI (ULTIMATE ENTERPRISE DATA SEEDER)...');

  const passwordHash = bcrypt.hashSync('user123', 10);

  // 1. Danh mục xe
  const categories = await prisma.vehicle_categories.findMany();
  const catMap: Record<string, bigint> = {};
  categories.forEach(c => { catMap[c.name] = c.id; });

  // 2. Danh sách địa điểm
  const locations = await prisma.locations.findMany();
  const getLoc = (cityKeyword: string) =>
    locations.find(l => l.city.toLowerCase().includes(cityKeyword.toLowerCase())) || locations[0];

  // Tập hợp các biển số và mã xe đã tồn tại để tránh trùng
  const existingPlates = new Set(
    (await prisma.vehicles.findMany({ select: { license_plate: true } })).map(v => v.license_plate)
  );
  const existingCodes = new Set(
    (await prisma.vehicles.findMany({ select: { code: true } })).map(v => v.code)
  );

  function getSafePlate(basePrefix: string, index: number): string {
    let num = 100 + index * 11;
    let tail = 10 + (index % 89);
    let candidate = `${basePrefix}-${num}.${tail}`;
    while (existingPlates.has(candidate)) {
      num += 7;
      tail = (tail + 13) % 99;
      candidate = `${basePrefix}-${num}.${String(tail).padStart(2, '0')}`;
    }
    existingPlates.add(candidate);
    return candidate;
  }

  // 3. DANH SÁCH 25 XE CAO CẤP & ĐA DẠNG BỔ SUNG
  const ultimateVehicles = [
    {
      code: 'VF9-VIP',
      name: 'VinFast VF9 Plus 6 Chỗ Ghế Cơ Trưởng (Flagship SUV)',
      brand: 'VinFast',
      model: 'VF9 Plus',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Đỏ Crimson',
      seat_count: 6,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 4500,
      price_per_day: 2800000,
      deposit_amount: 35000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VF8-ECO',
      name: 'VinFast VF8 Eco AWD 2024',
      brand: 'VinFast',
      model: 'VF8 Eco',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Trắng Pearl',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 12000,
      price_per_day: 1500000,
      deposit_amount: 20000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VF5-02',
      name: 'VinFast VF5 Plus Urban Crossover',
      brand: 'VinFast',
      model: 'VF5 Plus',
      category: 'Hatchback',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Đỏ Nóc Trắng',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'ELECTRIC' as const,
      current_mileage: 9500,
      price_per_day: 700000,
      deposit_amount: 10000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CAM-25Q',
      name: 'Toyota Camry 2.5Q Thế Hệ Mới (Doanh Nhân)',
      brand: 'Toyota',
      model: 'Camry 2.5Q',
      category: 'Sedan',
      manufacture_year: 2024,
      platePrefix: '30K',
      color: 'Đen Ánh Kim',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 18000,
      price_per_day: 1800000,
      deposit_amount: 25000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'FTN-LEG',
      name: 'Toyota Fortuner Legender 2.8L 4x4 (Địa Hình VIP)',
      brand: 'Toyota',
      model: 'Fortuner Legender',
      category: 'SUV',
      manufacture_year: 2023,
      platePrefix: '51K',
      color: 'Trắng Ngọc Trai',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'DIESEL' as const,
      current_mileage: 32000,
      price_per_day: 1600000,
      deposit_amount: 20000000,
      city: 'TP. HCM',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CROSS-HEV',
      name: 'Toyota Corolla Cross 1.8 HEV Hybrid Tiết Kiệm Xăng',
      brand: 'Toyota',
      model: 'Corolla Cross 1.8 HEV',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Xám Titan',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'HYBRID' as const,
      current_mileage: 14000,
      price_per_day: 1200000,
      deposit_amount: 15000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'RAIZE-01',
      name: 'Toyota Raize 1.0 Turbo Compact Đô Thị',
      brand: 'Toyota',
      model: 'Raize Turbo',
      category: 'Hatchback',
      manufacture_year: 2023,
      platePrefix: '79A',
      color: 'Cam Nóc Đen',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 21000,
      price_per_day: 800000,
      deposit_amount: 10000000,
      city: 'Nha Trang',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'VELOZ-01',
      name: 'Toyota Veloz Cross Top 7 Chỗ Gia Đình',
      brand: 'Toyota',
      model: 'Veloz Cross',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '49A',
      color: 'Bạc Ánh Kim',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 11000,
      price_per_day: 1100000,
      deposit_amount: 15000000,
      city: 'Đà Lạt',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'TUC-16T',
      name: 'Hyundai Tucson 1.6T HTRAC All-Wheel Drive',
      brand: 'Hyundai',
      model: 'Tucson 1.6 Turbo',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Đen Phantom',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 13500,
      price_per_day: 1350000,
      deposit_amount: 18000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CUSTIN-20',
      name: 'Hyundai Custin 2.0T Cao Cấp (Ghế Thương Gia Captain)',
      brand: 'Hyundai',
      model: 'Custin 2.0T',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '30K',
      color: 'Trắng Polar',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 7800,
      price_per_day: 1700000,
      deposit_amount: 20000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CRETA-01',
      name: 'Hyundai Creta 1.5 Cao Cấp (Nóc Đen)',
      brand: 'Hyundai',
      model: 'Creta 1.5',
      category: 'SUV',
      manufacture_year: 2023,
      platePrefix: '65A',
      color: 'Đỏ Ruby',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 26000,
      price_per_day: 950000,
      deposit_amount: 12000000,
      city: 'Cần Thơ',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CRV-HEV',
      name: 'Honda CR-V e:HEV RS Hybrid 2024 (Thể Thao Sang Trọng)',
      brand: 'Honda',
      model: 'CR-V RS Hybrid',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Xanh Đậm Ánh Kim',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'HYBRID' as const,
      current_mileage: 8200,
      price_per_day: 1650000,
      deposit_amount: 20000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'CIVIC-RS',
      name: 'Honda Civic RS 1.5 Turbo VTEC (Cực Bốc)',
      brand: 'Honda',
      model: 'Civic RS',
      category: 'Sedan',
      manufacture_year: 2023,
      platePrefix: '15A',
      color: 'Đỏ Thể Thao',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 22000,
      price_per_day: 1300000,
      deposit_amount: 15000000,
      city: 'Hải Phòng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'EVE-BITURBO',
      name: 'Ford Everest Titanium+ 2.0L Bi-Turbo 4x4 (Full Option)',
      brand: 'Ford',
      model: 'Everest Bi-Turbo',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '51K',
      color: 'Nâu Đồng Tuyệt Đẹp',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'DIESEL' as const,
      current_mileage: 15000,
      price_per_day: 1900000,
      deposit_amount: 25000000,
      city: 'TP. HCM',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'TERRI-X',
      name: 'Ford Territory Titanium X Crossover Hiện Đại',
      brand: 'Ford',
      model: 'Territory Titanium X',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Trắng Kim Cương',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 10500,
      price_per_day: 1250000,
      deposit_amount: 15000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'RAPTOR-NEXT',
      name: 'Ford Ranger Raptor 2.0L Bi-Turbo Vua Bán Tải',
      brand: 'Ford',
      model: 'Ranger Raptor',
      category: 'Pickup',
      manufacture_year: 2024,
      platePrefix: '43C',
      color: 'Xám Xi Măng Code Orange',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'DIESEL' as const,
      current_mileage: 9800,
      price_per_day: 2200000,
      deposit_amount: 30000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'MB-E300-VIP',
      name: 'Mercedes-Benz E300 AMG 2024 Đẳng Cấp Thượng Lưu',
      brand: 'Mercedes-Benz',
      model: 'E300 AMG',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '30K',
      color: 'Đen Obsidian',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 8200,
      price_per_day: 3200000,
      deposit_amount: 45000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'MB-GLC300',
      name: 'Mercedes-Benz GLC300 4MATIC Thế Hệ Mới',
      brand: 'Mercedes-Benz',
      model: 'GLC300 4MATIC',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '51K',
      color: 'Trắng Polar',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 11000,
      price_per_day: 2900000,
      deposit_amount: 40000000,
      city: 'TP. HCM',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'MAYBACH-S680',
      name: 'Mercedes-Maybach S680 V12 Siêu Xe Sang Trọng Bậc Nhất',
      brand: 'Mercedes-Benz',
      model: 'Maybach S680',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '51K',
      color: 'Hai Tông Màu Vàng Cát - Đen',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 3500,
      price_per_day: 8500000,
      deposit_amount: 100000000,
      city: 'TP. HCM',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'BMW-330I',
      name: 'BMW 330i M Sport LCI Siêu Cảm Giác Lái',
      brand: 'BMW',
      model: '330i M Sport',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Xanh Portimao Blue',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 9100,
      price_per_day: 2500000,
      deposit_amount: 35000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'BMW-X7',
      name: 'BMW X7 xDrive40i Pure Excellence Siêu SUV 7 Chỗ',
      brand: 'BMW',
      model: 'X7 Pure Excellence',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '30K',
      color: 'Đen Carbon M',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 6500,
      price_per_day: 5500000,
      deposit_amount: 70000000,
      city: 'Hà Nội',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'AUDI-Q8',
      name: 'Audi Q8 55 TFSI Quattro Coupe SUV Thể Thao',
      brand: 'Audi',
      model: 'Q8 Quattro',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '43A',
      color: 'Cam Dragon Orange',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 7200,
      price_per_day: 3800000,
      deposit_amount: 50000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'LEX-LX600',
      name: 'Lexus LX600 VIP 4 Chỗ Độc Bản Hoàng Gia',
      brand: 'Lexus',
      model: 'LX600 VIP',
      category: 'Luxury',
      manufacture_year: 2024,
      platePrefix: '51K',
      color: 'Trắng Sonic Quartz',
      seat_count: 4,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 5100,
      price_per_day: 7500000,
      deposit_amount: 90000000,
      city: 'TP. HCM',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'KIA-K5',
      name: 'Kia K5 2.0 Premium Fastback Thể Thao',
      brand: 'Kia',
      model: 'K5 Premium',
      category: 'Sedan',
      manufacture_year: 2023,
      platePrefix: '43A',
      color: 'Xanh Biển Sâu Yacht Blue',
      seat_count: 5,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 19500,
      price_per_day: 1100000,
      deposit_amount: 15000000,
      city: 'Đà Nẵng',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: 'HYU-STAR',
      name: 'Hyundai Stargazer X 7 Chỗ Gia Đình Đa Dụng',
      brand: 'Hyundai',
      model: 'Stargazer X',
      category: 'SUV',
      manufacture_year: 2024,
      platePrefix: '49A',
      color: 'Trắng Tuyết',
      seat_count: 7,
      transmission: 'AUTO' as const,
      fuel_type: 'GASOLINE' as const,
      current_mileage: 14200,
      price_per_day: 900000,
      deposit_amount: 10000000,
      city: 'Đà Lạt',
      status: 'AVAILABLE' as const,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    }
  ];

  console.log(`Đang nạp ${ultimateVehicles.length} xe mới chất lượng cao vào hệ thống...`);
  let vIdx = 0;
  for (const v of ultimateVehicles) {
    vIdx++;
    const loc = getLoc(v.city);
    const catId = catMap[v.category] || catMap['SUV'] || catMap['Sedan'];
    const safePlate = getSafePlate(v.platePrefix, vIdx);

    const vehicle = await prisma.vehicles.upsert({
      where: { code: v.code },
      update: {
        name: v.name,
        price_per_day: v.price_per_day,
        deposit_amount: v.deposit_amount,
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
        license_plate: safePlate,
        color: v.color,
        seat_count: v.seat_count,
        transmission: v.transmission,
        fuel_type: v.fuel_type,
        current_mileage: v.current_mileage,
        price_per_day: v.price_per_day,
        deposit_amount: v.deposit_amount,
        included_km_per_day: 250,
        extra_km_fee: 4000,
        status: v.status,
      }
    });

    const existingMedia = await prisma.media_files.findFirst({
      where: { entity_type: 'VEHICLE', entity_id: vehicle.id }
    });
    if (!existingMedia) {
      await prisma.media_files.create({
        data: {
          entity_type: 'VEHICLE',
          entity_id: vehicle.id,
          media_type: 'IMAGE',
          category: 'VEHICLE_FRONT',
          original_name: `${v.code}.jpg`,
          stored_name: `${v.code}_main.jpg`,
          file_path: v.img,
          is_primary: true,
          sort_order: 1
        }
      });
    }
  }
  console.log(`✓ Đã nạp thành công 25 xe đời mới chất lượng cao!`);

  // 4. DANH SÁCH 20 KHÁCH HÀNG VIP & DOANH NGHIỆP MỚI
  const existingCids = new Set(
    (await prisma.customer_profiles.findMany({ select: { citizen_id: true } }))
      .map(p => p.citizen_id)
      .filter(Boolean)
  );
  const existingDls = new Set(
    (await prisma.customer_profiles.findMany({ select: { driver_license_number: true } }))
      .map(p => p.driver_license_number)
      .filter(Boolean)
  );
  const existingPhones = new Set(
    (await prisma.users.findMany({ select: { phone: true } }))
      .map(u => u.phone)
      .filter(Boolean)
  );

  function getSafeCid(preferred: string, idx: number): string {
    let candidate = preferred;
    let offset = idx;
    while (existingCids.has(candidate)) {
      offset += 100;
      candidate = `0480${String(80000000 + offset).slice(0, 8)}`;
    }
    existingCids.add(candidate);
    return candidate;
  }

  function getSafeDl(preferred: string, idx: number): string {
    let candidate = preferred;
    let offset = idx;
    while (existingDls.has(candidate)) {
      offset += 100;
      candidate = `4800${String(8000000 + offset).slice(0, 7)}`;
    }
    existingDls.add(candidate);
    return candidate;
  }

  function getSafePhone(preferred: string, idx: number): string {
    let candidate = preferred;
    let offset = idx;
    while (existingPhones.has(candidate)) {
      offset += 1;
      candidate = `09${String(18000000 + offset * 111).slice(0, 8)}`;
    }
    existingPhones.add(candidate);
    return candidate;
  }

  const newVipUsers = [
    { name: 'Hoàng Nam - CEO VinaGroup', email: 'ceo.hoangnam@vinagroup.vn', phone: '0903881122', dob: '1982-04-12', cid: '048082001122', dl: '48008201122' },
    { name: 'Đặng Thùy Linh - Tech Director', email: 'linh.dan@techcorp.io', phone: '0912445566', dob: '1990-08-25', cid: '048090005566', dl: '48009005566' },
    { name: 'Michael Smith - Foreign Investor', email: 'michael.smith@expats.com', phone: '0933778899', dob: '1985-11-03', cid: '048085008899', dl: '48008508899' },
    { name: 'Nguyễn Thu Hà - Luxury Travel Blogger', email: 'thu.ha.travel@gmail.com', phone: '0977112244', dob: '1995-03-18', cid: '048095002244', dl: '48009502244' },
    { name: 'Trần Đức Thành - BĐS Central Land', email: 'duc.thanh.bds@realestate.vn', phone: '0988665544', dob: '1987-12-09', cid: '048087005544', dl: '48008705544' },
    { name: 'Phạm Phương Thảo - Hot Vlogger', email: 'phuong.thao.vlog@gmail.com', phone: '0966332211', dob: '1998-06-30', cid: '048098002211', dl: '48009802211' },
    { name: 'David Nguyễn - Overseas Vietnamese', email: 'david.nguyen@california.us', phone: '0909554433', dob: '1979-02-14', cid: '048079004433', dl: '48007904433' },
    { name: 'Kim Min Jun - Giám đốc Hàn Quốc', email: 'kim.minjun@samsung-partner.kr', phone: '0938221177', dob: '1983-09-21', cid: '048083001177', dl: '48008301177' },
    { name: 'Lê Hoàng Hải Yến - Event Planner', email: 'haiyen.event@danangmedia.vn', phone: '0944882266', dob: '1993-01-17', cid: '048093002266', dl: '48009302266' },
    { name: 'Vũ Quốc Khánh - Bác Sĩ Trưởng Khoa', email: 'dr.quockhanh@vinmec.com', phone: '0918776655', dob: '1981-05-05', cid: '048081006655', dl: '48008106655' },
    { name: 'Bùi Lan Anh - Giám Đốc Tài Chính', email: 'cfo.lananh@vietfinance.com', phone: '0908119933', dob: '1988-10-15', cid: '048088009933', dl: '48008809933' },
    { name: 'Ngô Kiến Huy - Nghệ Sĩ Trình Diễn', email: 'kienhuy.artist@showbiz.vn', phone: '0981223377', dob: '1992-07-28', cid: '048092003377', dl: '48009203377' },
    { name: 'Đỗ Minh Trí - Kiến Trúc Sư Trưởng', email: 'tri.architect@archdaily.vn', phone: '0937889944', dob: '1986-04-03', cid: '048086009944', dl: '48008609944' },
    { name: 'Cao Bá Hưng - Luật Sư Tranh Tụng', email: 'lawyer.bahung@justice.vn', phone: '0979556611', dob: '1984-11-20', cid: '048084006611', dl: '48008406611' },
    { name: 'Hồ Ngọc Mai - Chủ Chuỗi Resort', email: 'ngocmai.resort@phuquocgroup.com', phone: '0968443322', dob: '1980-03-22', cid: '048080003322', dl: '48008003322' },
    { name: 'Phan Anh Tú - Chuyên Gia Golf PGA', email: 'anhtu.golf@montgomerie.vn', phone: '0919228844', dob: '1991-09-08', cid: '048091008844', dl: '48009108844' },
    { name: 'Trịnh Thảo Vy - Biên Tập Viên Thời Trang', email: 'thaovy.fashion@voguevn.com', phone: '0907336688', dob: '1996-12-11', cid: '048096006688', dl: '48009606688' },
    { name: 'Lương Thế Vinh - Doanh Nhân Startup AI', email: 'thevinh@deeptech.vn', phone: '0983115599', dob: '1994-05-19', cid: '048094005599', dl: '48009405599' },
    { name: 'Đoàn Hương Giang - Quản Lý Khách Sạn 5 Sao', email: 'huonggiang.gm@sheratondanang.com', phone: '0935771133', dob: '1989-08-14', cid: '048089001133', dl: '48008901133' },
    { name: 'Trương Gia Bảo - Đại Lý Xe Sang', email: 'giabao.luxury@autoclub.vn', phone: '0962448800', dob: '1986-07-07', cid: '048086008800', dl: '48008608800' }
  ];

  console.log(`Đang nạp 20 tài khoản khách hàng VIP mới...`);
  const createdCustomerIds: bigint[] = [];

  let uIdx = 0;
  for (const u of newVipUsers) {
    uIdx++;
    const safePhone = getSafePhone(u.phone, uIdx);
    const user = await prisma.users.upsert({
      where: { email: u.email },
      update: { full_name: u.name, phone: safePhone },
      create: {
        full_name: u.name,
        email: u.email,
        phone: safePhone,
        password_hash: passwordHash,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
      }
    });

    createdCustomerIds.push(user.id);

    const safeCid = getSafeCid(u.cid, uIdx);
    const safeDl = getSafeDl(u.dl, uIdx);

    await prisma.customer_profiles.upsert({
      where: { user_id: user.id },
      update: { verification_status: 'VERIFIED' },
      create: {
        user_id: user.id,
        date_of_birth: new Date(u.dob),
        address: 'Hải Châu, Đà Nẵng & Landmark 81, TP. HCM',
        citizen_id: safeCid,
        driver_license_number: safeDl,
        driver_license_expiry: new Date('2032-12-31'),
        verification_status: 'VERIFIED',
      }
    });
  }
  console.log(`✓ Đã nạp thành công 20 khách hàng VIP được duyệt KYC đầy đủ!`);

  // 5. LẤY TẤT CẢ XE VÀ MANAGER ĐỂ TẠO LỊCH SỬ THUÊ CỰC ĐẠI
  const allVehicles = await prisma.vehicles.findMany();
  const managerUser = await prisma.users.findFirst({ where: { role: 'MANAGER' } });
  const managerId = managerUser ? managerUser.id : createdCustomerIds[0];

  // 6. TẠO 48 ĐƠN THUÊ XE TRẢI RỘNG KHẮP 12 THÁNG 2026
  console.log('📈 Đang tạo 48 hợp đồng & đơn thuê xe lịch sử, tăng trưởng doanh thu...');

  const reviewComments = [
    'Xe chạy cực kỳ mượt mà, nội thất thơm tho sạch sẽ 100%. Giao nhận xe chuyên nghiệp!',
    'AutoRent phục vụ rất chu đáo. Xe mới cứng, tiết kiệm nhiên liệu, gia đình rất hài lòng.',
    'Dịch vụ xuất sắc nhất Đà Nẵng. Thủ tục nhanh gọn chỉ 5 phút, không rườm rà.',
    'Xe sang trọng, đẳng cấp đi gặp đối tác ai cũng khen. Lần sau chắc chắn sẽ tiếp tục ủng hộ!',
    'Hệ thống trạm sạc VinFast rất tiện lợi, xe bốc và êm ru. 5 sao không có điểm gì chê!',
    'Bàn giao xe chụp ảnh 6 góc rất minh bạch, nhân viên thân thiện và lịch thiệp.',
    'Giá cả rất hợp lý so với chất lượng xe và dịch vụ cao cấp như thế này.',
    'Đi đường dài đèo Hải Vân cực kỳ đầm chắc và an toàn. Rất ưng ý!',
  ];

  let bookingSerial = 500;

  for (let month = 0; month < 12; month++) {
    for (let orderInMonth = 0; orderInMonth < 4; orderInMonth++) {
      bookingSerial++;
      const carIndex = (month * 4 + orderInMonth) % allVehicles.length;
      const v = allVehicles[carIndex];
      const custId = createdCustomerIds[(month * 2 + orderInMonth) % createdCustomerIds.length];

      const startDay = 2 + (orderInMonth * 6);
      const rentalDays = 2 + (orderInMonth % 3); // 2 đến 4 ngày
      const startDate = new Date(2026, month, startDay, 8, 30, 0);
      const endDate = new Date(2026, month, startDay + rentalDays, 17, 30, 0);

      const dailyPrice = Number(v.price_per_day);
      const depositAmount = Number(v.deposit_amount);
      const rentalFee = dailyPrice * rentalDays;
      const serviceFee = 200000;
      const totalAmount = rentalFee + serviceFee;

      const bookingCode = `AR-26M${month + 1}-${String(bookingSerial).padStart(4, '0')}`;

      const existing = await prisma.bookings.findUnique({ where: { booking_code: bookingCode } });
      if (existing) continue;

      const locName = locations[0].name;

      const booking = await prisma.bookings.create({
        data: {
          booking_code: bookingCode,
          customer_id: custId,
          vehicle_id: v.id,
          pickup_datetime: startDate,
          return_datetime: endDate,
          pickup_location: locName,
          return_location: locName,
          rental_days: rentalDays,
          rental_fee: new Prisma.Decimal(rentalFee),
          service_fee: new Prisma.Decimal(serviceFee),
          deposit_amount: new Prisma.Decimal(depositAmount),
          total_amount: new Prisma.Decimal(totalAmount),
          status: 'COMPLETED',
          payment_status: 'PAID',
          customer_note: 'Thuê xe phục vụ công tác và hội thảo doanh nghiệp cao cấp.',
          created_at: new Date(startDate.getTime() - 86400000 * 3),
        }
      });

      // Tạo Hợp đồng điện tử
      await prisma.contracts.create({
        data: {
          contract_code: `HD-2026-EX-${booking.id}`,
          booking_id: booking.id,
          status: 'SIGNED',
          signed_at: new Date(startDate.getTime() - 86400000 * 2),
          contract_url: `https://storage.autorent.vn/contracts/HD-2026-EX-${booking.id}.pdf`
        }
      });

      // Thanh toán tiền thuê
      await prisma.payments.create({
        data: {
          transaction_code: `TX-RENT-EX-${booking.id}`,
          booking_id: booking.id,
          customer_id: custId,
          transaction_type: 'RENTAL',
          amount: new Prisma.Decimal(totalAmount),
          payment_method: orderInMonth % 2 === 0 ? 'VNPAY' : 'BANK_TRANSFER',
          status: 'PAID',
          paid_at: startDate,
        }
      });

      // Biên bản giao nhận xe (PICKUP)
      await prisma.handover_records.create({
        data: {
          booking_id: booking.id,
          record_type: 'PICKUP',
          recorded_by: managerId,
          recorded_at: startDate,
          mileage: Number(v.current_mileage || 10000) - (12 - month) * 400,
          fuel_level: 100,
          vehicle_condition: 'EXCELLENT',
          note: 'Xe sạch sẽ, đầy đủ giấy tờ, bảo hiểm, lốp dự phòng, camera hành trình.',
        }
      });

      // Biên bản thu hồi xe (RETURN)
      await prisma.handover_records.create({
        data: {
          booking_id: booking.id,
          record_type: 'RETURN',
          recorded_by: managerId,
          recorded_at: endDate,
          mileage: Number(v.current_mileage || 10000) - (12 - month) * 400 + rentalDays * 180,
          fuel_level: 95,
          vehicle_condition: 'EXCELLENT',
          refundable_deposit: new Prisma.Decimal(depositAmount),
          note: 'Khách hàng hoàn trả xe đúng hẹn, xe nguyên vẹn, đã hoàn lại 100% tiền cọc.',
        }
      });

      // Đánh giá 5 sao
      if (orderInMonth % 2 === 0) {
        await prisma.reviews.create({
          data: {
            booking_id: booking.id,
            customer_id: custId,
            vehicle_id: v.id,
            rating: 5,
            content: reviewComments[(month + orderInMonth) % reviewComments.length],
            status: 'APPROVED',
            created_at: new Date(endDate.getTime() + 3600000 * 4),
          }
        });
      }
    }
  }

  // 7. TẠO CÁC ĐƠN THUÊ HIỆN HÀNH (ĐANG THUÊ, CHỜ DUYỆT, SẴN SÀNG) CHO THÁNG 10/2026
  console.log('🚗 Tạo các đơn thuê xe thực tế hiện tại (ACTIVE, READY, PENDING, OVERDUE)...');

  // 4 xe đang chạy trên đường (ACTIVE)
  for (let i = 0; i < 4; i++) {
    const v = allVehicles[i + 5];
    const custId = createdCustomerIds[i];
    const bCode = `AR-ACT-EX-${i + 1}`;
    if (await prisma.bookings.findUnique({ where: { booking_code: bCode } })) continue;

    const start = new Date(2026, 9, 19, 9, 0, 0);
    const end = new Date(2026, 9, 23, 18, 0, 0);
    const totalDays = 4;
    const rentalFee = Number(v.price_per_day) * totalDays;
    const serviceFee = 200000;
    const totalAmount = rentalFee + serviceFee;

    const b = await prisma.bookings.create({
      data: {
        booking_code: bCode,
        customer_id: custId,
        vehicle_id: v.id,
        pickup_datetime: start,
        return_datetime: end,
        pickup_location: locations[0].name,
        return_location: locations[0].name,
        rental_days: totalDays,
        rental_fee: new Prisma.Decimal(rentalFee),
        service_fee: new Prisma.Decimal(serviceFee),
        deposit_amount: v.deposit_amount,
        total_amount: new Prisma.Decimal(totalAmount),
        status: 'ACTIVE',
        payment_status: 'PAID',
        customer_note: 'Khách hàng VIP nhận xe tại showroom và đi công tác miền Trung.',
        created_at: new Date(2026, 9, 17, 10, 0, 0),
      }
    });

    await prisma.vehicles.update({
      where: { id: v.id },
      data: { status: 'RENTED' }
    });

    await prisma.contracts.create({
      data: {
        contract_code: `HD-ACT-EX-${b.id}`,
        booking_id: b.id,
        status: 'SIGNED',
        signed_at: start,
        contract_url: `https://storage.autorent.vn/contracts/HD-ACT-EX-${b.id}.pdf`
      }
    });

    await prisma.handover_records.create({
      data: {
        booking_id: b.id,
        record_type: 'PICKUP',
        recorded_by: managerId,
        recorded_at: start,
        mileage: Number(v.current_mileage || 15000),
        fuel_level: 100,
        vehicle_condition: 'EXCELLENT',
        note: 'Khách nhận xe tại showroom, kiểm tra 6 góc đạt chuẩn.',
      }
    });
  }

  // 3 xe đang chờ bàn giao (READY_FOR_PICKUP)
  for (let i = 0; i < 3; i++) {
    const v = allVehicles[i + 15];
    const custId = createdCustomerIds[i + 4];
    const bCode = `AR-RDY-EX-${i + 1}`;
    if (await prisma.bookings.findUnique({ where: { booking_code: bCode } })) continue;

    const start = new Date(2026, 9, 22, 8, 0, 0);
    const end = new Date(2026, 9, 25, 17, 0, 0);
    const totalDays = 3;
    const rentalFee = Number(v.price_per_day) * totalDays;
    const serviceFee = 200000;
    const totalAmount = rentalFee + serviceFee;

    const b = await prisma.bookings.create({
      data: {
        booking_code: bCode,
        customer_id: custId,
        vehicle_id: v.id,
        pickup_datetime: start,
        return_datetime: end,
        pickup_location: locations[0].name,
        return_location: locations[0].name,
        rental_days: totalDays,
        rental_fee: new Prisma.Decimal(rentalFee),
        service_fee: new Prisma.Decimal(serviceFee),
        deposit_amount: v.deposit_amount,
        total_amount: new Prisma.Decimal(totalAmount),
        status: 'READY_FOR_PICKUP',
        payment_status: 'PAID',
        customer_note: 'Xe đã vệ sinh khử khuẩn, khách hẹn nhận xe sáng mai.',
        created_at: new Date(2026, 9, 20, 10, 0, 0),
      }
    });

    await prisma.vehicles.update({
      where: { id: v.id },
      data: { status: 'RESERVED' }
    });

    await prisma.contracts.create({
      data: {
        contract_code: `HD-RDY-EX-${b.id}`,
        booking_id: b.id,
        status: 'SIGNED',
        signed_at: new Date(2026, 9, 20),
        contract_url: `https://storage.autorent.vn/contracts/HD-RDY-EX-${b.id}.pdf`
      }
    });
  }

  // 3 đơn đang chờ Manager xét duyệt (PENDING)
  for (let i = 0; i < 3; i++) {
    const v = allVehicles[i + 20];
    const custId = createdCustomerIds[i + 8];
    const bCode = `AR-PND-EX-${i + 1}`;
    if (await prisma.bookings.findUnique({ where: { booking_code: bCode } })) continue;

    const start = new Date(2026, 9, 24, 9, 0, 0);
    const end = new Date(2026, 9, 27, 18, 0, 0);
    const totalDays = 3;
    const rentalFee = Number(v.price_per_day) * totalDays;
    const serviceFee = 200000;
    const totalAmount = rentalFee + serviceFee;

    await prisma.bookings.create({
      data: {
        booking_code: bCode,
        customer_id: custId,
        vehicle_id: v.id,
        pickup_datetime: start,
        return_datetime: end,
        pickup_location: locations[0].name,
        return_location: locations[0].name,
        rental_days: totalDays,
        rental_fee: new Prisma.Decimal(rentalFee),
        service_fee: new Prisma.Decimal(serviceFee),
        deposit_amount: v.deposit_amount,
        total_amount: new Prisma.Decimal(totalAmount),
        status: 'PENDING',
        payment_status: 'UNPAID',
        customer_note: 'Khách hàng gửi yêu cầu thuê tự lái cuối tuần.',
        created_at: new Date(2026, 9, 21, 11, 0, 0),
      }
    });
  }

  // 1 đơn QUÁ HẠN (OVERDUE) để Admin & Manager theo dõi Radar
  const overdueCar = allVehicles[30] || allVehicles[0];
  const overdueCust = createdCustomerIds[12];
  const overdueCode = 'AR-OVD-EX-99';
  if (!await prisma.bookings.findUnique({ where: { booking_code: overdueCode } })) {
    const overdueFee = Number(overdueCar.price_per_day) * 3;
    await prisma.bookings.create({
      data: {
        booking_code: overdueCode,
        customer_id: overdueCust,
        vehicle_id: overdueCar.id,
        pickup_datetime: new Date(2026, 9, 15, 8, 0, 0),
        return_datetime: new Date(2026, 9, 18, 17, 0, 0),
        pickup_location: locations[0].name,
        return_location: locations[0].name,
        rental_days: 3,
        rental_fee: new Prisma.Decimal(overdueFee),
        service_fee: new Prisma.Decimal(200000),
        deposit_amount: overdueCar.deposit_amount,
        total_amount: new Prisma.Decimal(overdueFee + 200000),
        status: 'OVERDUE',
        payment_status: 'PARTIALLY_PAID',
        customer_note: 'Khách liên hệ xin trả trễ do lịch trình công tác phát sinh.',
        admin_note: 'CẢNH BÁO RADAR: Khách trễ hạn bàn giao 3 ngày. Manager cần liên hệ đôn đốc.',
        created_at: new Date(2026, 9, 12),
      }
    });

    await prisma.vehicles.update({
      where: { id: overdueCar.id },
      data: { status: 'RENTED' }
    });
  }

  // 8. BỔ SUNG THÊM 30 LỊCH BẢO DƯỠNG XE (MAINTENANCE)
  console.log('🔧 Nạp thêm 30 lịch bảo dưỡng xe định kỳ & kiểm định kỹ thuật...');
  const maintenanceItems = [
    { type: 'Bảo dưỡng định kỳ 10.000km', cost: 1850000, desc: 'Thay dầu động cơ Castrol Edge, lọc gió, đảo lốp, cân bằng động.' },
    { type: 'Bảo dưỡng định kỳ 20.000km', cost: 3450000, desc: 'Thay dầu phanh, vệ sinh bướm ga, bu-gi, kiểm tra gầm và rô-tuyn.' },
    { type: 'Kiểm định pin & hệ thống điện VinFast', cost: 800000, desc: 'Cập nhật phần mềm FOTA mới nhất, kiểm tra độ suy hao Cell pin (SOH 99%).' },
    { type: 'Thay dàn lốp Michelin Pilot Sport 5', cost: 14500000, desc: 'Thay 4 lốp cao cấp cho dòng xe thể thao, cân chỉnh góc đặt bánh xe Hunter.' },
    { type: 'Phủ Ceramic & Spa nội thất cao cấp', cost: 4200000, desc: 'Đánh bóng 3 bước khử xước dăm, phủ 2 lớp Ceramic bảo vệ sơn xe, xông tinh dầu ozone.' },
    { type: 'Đăng kiểm xe cơ giới & Phí bảo trì đường bộ', cost: 2160000, desc: 'Hoàn tất đăng kiểm chu kỳ 18 tháng tại Trung tâm Đăng kiểm 43-01S.' }
  ];

  for (let i = 0; i < 30; i++) {
    const item = maintenanceItems[i % maintenanceItems.length];
    const v = allVehicles[(i * 3) % allVehicles.length];
    const schedDate = new Date(2026, i % 12, 10 + (i % 15));
    const isDone = (i % 12) <= 9;

    await prisma.maintenance_records.create({
      data: {
        vehicle_id: v.id,
        maintenance_type: item.type,
        scheduled_date: schedDate,
        completed_date: isDone ? new Date(schedDate.getTime() + 86400000) : null,
        mileage_at_service: Number(v.current_mileage || 12000) - 2000 + (i * 300),
        cost: new Prisma.Decimal(item.cost),
        status: isDone ? 'COMPLETED' : 'SCHEDULED',
        description: item.desc,
        created_by: managerId,
      }
    });
  }

  // 9. BỔ SUNG 50 THÔNG BÁO HỆ THỐNG (NOTIFICATIONS)
  console.log('🔔 Nạp 50 thông báo hệ thống...');
  const notifTemplates = [
    { title: 'Xác nhận đơn đặt xe thành công', content: 'Đơn đặt xe của Quý khách đã được xác nhận. Vui lòng kiểm tra hợp đồng điện tử.' },
    { title: 'Thanh toán tiền thuê thành công', content: 'Giao dịch qua VNPAY đã được ghi nhận. Quý khách có thể xem hóa đơn tại trang cá nhân.' },
    { title: 'Xe đã sẵn sàng bàn giao', content: 'Chiếc xe của bạn đã hoàn tất kiểm tra kỹ thuật 6 góc và khử khuẩn sạch sẽ tại Showroom.' },
    { title: 'Biên bản nhận xe đã được lưu', content: 'Biên bản bàn giao xe (Pickup) có đính kèm ảnh 6 góc và ODO đã cập nhật trên hệ thống.' },
    { title: 'Hoàn tất trả xe & Hoàn trả tiền cọc', content: 'AutoRent đã hoàn tất thủ tục trả xe và chuyển khoản hoàn trả 100% tiền cọc.' },
  ];

  for (let i = 0; i < 50; i++) {
    const tmpl = notifTemplates[i % notifTemplates.length];
    const custId = createdCustomerIds[i % createdCustomerIds.length];
    await prisma.notifications.create({
      data: {
        user_id: custId,
        title: tmpl.title,
        content: tmpl.content,
        is_read: i % 2 === 0,
        type: 'SYSTEM',
        created_at: new Date(2026, i % 10, (i % 25) + 1, 10, 30),
      }
    });
  }

  // 10. TỔNG KẾT VÀ IN BÁO CÁO CUỐI
  const vCount = await prisma.vehicles.count();
  const uCount = await prisma.users.count();
  const bCount = await prisma.bookings.count();
  const cCount = await prisma.contracts.count();
  const hCount = await prisma.handover_records.count();
  const pCount = await prisma.payments.count();
  const rCount = await prisma.reviews.count();
  const mCount = await prisma.maintenance_records.count();
  const nCount = await prisma.notifications.count();

  console.log('\n======================================================');
  console.log('🎉 ULTIMATE ENTERPRISE DATA SEEDING HOÀN TẤT!');
  console.log('======================================================');
  console.log(`- Tổng đội xe (Vehicles):             ${vCount} xe`);
  console.log(`- Tổng người dùng (Users):            ${uCount} tài khoản`);
  console.log(`- Tổng đơn đặt xe (Bookings):         ${bCount} đơn`);
  console.log(`- Tổng hợp đồng điện tử (Contracts):  ${cCount} bản`);
  console.log(`- Tổng biên bản bàn giao (Handovers): ${hCount} biên bản`);
  console.log(`- Tổng giao dịch thanh toán (Payments):${pCount} giao dịch`);
  console.log(`- Tổng phản hồi đánh giá (Reviews):   ${rCount} đánh giá`);
  console.log(`- Tổng hồ sơ bảo dưỡng (Maintenance): ${mCount} lượt`);
  console.log(`- Tổng thông báo hệ thống:            ${nCount} tin`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi nạp dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
