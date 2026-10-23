import { prisma } from '../config/prisma.js';

const DEFAULT_DANANG_LOCATIONS = [
  {
    name: 'Showroom Sân Bay Đà Nẵng',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    address: 'Cổng Ga Đến Quốc Tế, Sân bay Quốc tế Đà Nẵng, Q. Hải Châu, Đà Nẵng',
    is_active: true,
  },
  {
    name: 'Showroom Chi Nhánh Trung Tâm - Hải Châu',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    address: '150 Nguyễn Văn Linh, P. Vĩnh Trung, Q. Hải Châu, Đà Nẵng',
    is_active: true,
  },
  {
    name: 'Showroom Chi Nhánh Sơn Trà - Biển Mỹ Khê',
    city: 'Đà Nẵng',
    district: 'Sơn Trà',
    address: '88 Võ Nguyên Giáp, P. Phước Mỹ, Q. Sơn Trà, Đà Nẵng',
    is_active: true,
  },
  {
    name: 'Showroom Chi Nhánh Thanh Khê',
    city: 'Đà Nẵng',
    district: 'Thanh Khê',
    address: '45 Nguyễn Tất Thành, P. Thanh Bình, Q. Thanh Khê, Đà Nẵng',
    is_active: true,
  },
  {
    name: 'Showroom Chi Nhánh Ngũ Hành Sơn',
    city: 'Đà Nẵng',
    district: 'Ngũ Hành Sơn',
    address: '12 Lê Văn Hiến, P. Khuê Mỹ, Q. Ngũ Hành Sơn, Đà Nẵng',
    is_active: true,
  },
];

export class LocationService {
  static async getAllLocations() {
    let locations = await prisma.locations.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });

    if (locations.length === 0) {
      for (const loc of DEFAULT_DANANG_LOCATIONS) {
        await prisma.locations.create({ data: loc });
      }
      locations = await prisma.locations.findMany({
        where: { is_active: true },
        orderBy: { id: 'asc' },
      });
    }

    return locations;
  }

  static async getLocationById(id: bigint) {
    return prisma.locations.findUnique({
      where: { id },
    });
  }

  static async createLocation(data: { name: string; city?: string; district?: string; address?: string }) {
    return prisma.locations.create({
      data: {
        name: data.name,
        city: data.city || 'Đà Nẵng',
        district: data.district || '',
        address: data.address || '',
        is_active: true,
      },
    });
  }
}
