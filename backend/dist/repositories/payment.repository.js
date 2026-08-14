import { prisma } from '../config/prisma.js';
export class PaymentRepository {
    static async findById(id) {
        return prisma.payments.findUnique({
            where: { id },
            include: {
                bookings: true,
                users: { select: { id: true, full_name: true, email: true } },
            },
        });
    }
    static async findByTransactionCode(transaction_code) {
        return prisma.payments.findUnique({
            where: { transaction_code },
        });
    }
    static async findAll(options) {
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
    static async create(data) {
        return prisma.payments.create({
            data,
        });
    }
    static async updateStatus(id, status, payment_reference) {
        return prisma.payments.update({
            where: { id },
            data: {
                status,
                payment_reference,
                paid_at: status === 'PAID' ? new Date() : undefined,
            },
        });
    }
    static async update(id, data) {
        return prisma.payments.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.payments.delete({
            where: { id },
        });
    }
}
