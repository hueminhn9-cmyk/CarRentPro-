import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class VehicleRepository {
  // Vehicle Categories
  static async findAllCategories() {
    return prisma.vehicle_categories.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async findCategoryById(id: bigint) {
    return prisma.vehicle_categories.findUnique({
      where: { id },
    });
  }

  static async createCategory(data: Prisma.vehicle_categoriesCreateInput) {
    return prisma.vehicle_categories.create({ data });
  }

  static async updateCategory(id: bigint, data: Prisma.vehicle_categoriesUpdateInput) {
    return prisma.vehicle_categories.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: bigint) {
    return prisma.vehicle_categories.delete({
      where: { id },
    });
  }

  // Vehicles
  static async findById(id: bigint) {
    return prisma.vehicles.findUnique({
      where: { id },
      include: {
        vehicle_categories: true,
        locations: true,
      },
    });
  }

  static async findByCode(code: string) {
    return prisma.vehicles.findUnique({
      where: { code },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [vehicles, total] = await Promise.all([
      prisma.vehicles.findMany({
        ...options,
        include: {
          vehicle_categories: true,
          locations: true,
        },
      }),
      prisma.vehicles.count({ where: options.where }),
    ]);

    return { vehicles, total };
  }

  static async create(data: Prisma.vehiclesUncheckedCreateInput) {
    return prisma.vehicles.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.vehiclesUncheckedUpdateInput) {
    return prisma.vehicles.update({
      where: { id },
      data,
      include: {
        vehicle_categories: true,
        locations: true,
      },
    });
  }

  static async delete(id: bigint) {
    // We soft delete vehicles by updating status to INACTIVE
    return prisma.vehicles.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}
