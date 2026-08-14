import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class HandoverRecordRepository {
  static async findById(id: bigint) {
    return prisma.handover_records.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, full_name: true } },
        bookings: { select: { id: true, booking_code: true } },
      },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [handovers, total] = await Promise.all([
      prisma.handover_records.findMany({
        ...options,
        include: {
          users: { select: { id: true, full_name: true } },
          bookings: { select: { id: true, booking_code: true } },
        },
      }),
      prisma.handover_records.count({ where: options.where }),
    ]);
    return { handovers, total };
  }

  static async create(data: Prisma.handover_recordsUncheckedCreateInput) {
    return prisma.handover_records.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.handover_recordsUncheckedUpdateInput) {
    return prisma.handover_records.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.handover_records.delete({
      where: { id },
    });
  }
}
