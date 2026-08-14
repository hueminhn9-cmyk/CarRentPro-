import { prisma } from '../config/prisma.js';
export class BookingStatusHistoryRepository {
    static async findById(id) {
        return prisma.booking_status_history.findUnique({
            where: { id },
            include: {
                users: { select: { id: true, full_name: true } },
                bookings: { select: { id: true, booking_code: true } },
            },
        });
    }
    static async findAll(options) {
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
    static async create(data) {
        return prisma.booking_status_history.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.booking_status_history.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.booking_status_history.delete({
            where: { id },
        });
    }
}
