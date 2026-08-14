import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class MaintenanceRepository {
  static async findById(id: bigint) {
    return prisma.maintenance_records.findUnique({
      where: { id },
      include: {
        vehicles: true,
      },
    });
  }

  static async findAll() {
    return prisma.maintenance_records.findMany({
      include: {
        vehicles: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  static async create(data: Prisma.maintenance_recordsUncheckedCreateInput) {
    return prisma.maintenance_records.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.maintenance_recordsUncheckedUpdateInput) {
    return prisma.maintenance_records.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.maintenance_records.delete({
      where: { id },
    });
  }
}
