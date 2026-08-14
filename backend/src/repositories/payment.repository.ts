import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class PaymentRepository {
  static async findById(id: bigint) {
    return prisma.payments.findUnique({
      where: { id },
      include: {
        bookings: true,
        users: { select: { id: true, full_name: true, email: true } },
      },
    });
  }

  static async findByTransactionCode(transaction_code: string) {
    return prisma.payments.findUnique({
      where: { transaction_code },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        ...options,
        include: {
          users: { select: { id: true, full_name: true, email: true } },
        },
      }),
      prisma.payments.count({ where: options.where }),
    ]);

    return { payments, total };
  }

  static async create(data: Prisma.paymentsUncheckedCreateInput) {
    return prisma.payments.create({
      data,
    });
  }

  static async updateStatus(id: bigint, status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED', payment_reference?: string) {
    return prisma.payments.update({
      where: { id },
      data: {
        status,
        payment_reference,
        paid_at: status === 'PAID' ? new Date() : undefined,
      },
    });
  }

  static async update(id: bigint, data: Prisma.paymentsUncheckedUpdateInput) {
    return prisma.payments.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.payments.delete({
      where: { id },
    });
  }
}
