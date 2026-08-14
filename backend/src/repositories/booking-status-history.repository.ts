import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class BookingStatusHistoryRepository {
  static async findById(id: bigint) {
    return prisma.booking_status_history.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, full_name: true } },
        bookings: { select: { id: true, booking_code: true } },
      },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [histories, total] = await Promise.all([
      prisma.booking_status_history.findMany({
        ...options,
        include: {
          users: { select: { id: true, full_name: true } },
          bookings: { select: { id: true, booking_code: true } },
        },
      }),
      prisma.booking_status_history.count({ where: options.where }),
    ]);
    return { histories, total };
  }

  static async create(data: Prisma.booking_status_historyUncheckedCreateInput) {
    return prisma.booking_status_history.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.booking_status_historyUncheckedUpdateInput) {
    return prisma.booking_status_history.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.booking_status_history.delete({
      where: { id },
    });
  }
}
