import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class BookingServiceRepository {
  static async findById(id: bigint) {
    return prisma.booking_services.findUnique({
      where: { id },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [services, total] = await Promise.all([
      prisma.booking_services.findMany(options),
      prisma.booking_services.count({ where: options.where }),
    ]);
    return { services, total };
  }

  static async create(data: Prisma.booking_servicesUncheckedCreateInput) {
    return prisma.booking_services.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.booking_servicesUncheckedUpdateInput) {
    return prisma.booking_services.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.booking_services.delete({
      where: { id },
    });
  }
}
