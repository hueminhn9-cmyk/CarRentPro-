import { prisma } from '../config/prisma.js';
export class BookingServiceRepository {
    static async findById(id) {
        return prisma.booking_services.findUnique({
            where: { id },
        });
    }
    static async findAll(options) {
        const [services, total] = await Promise.all([
            prisma.booking_services.findMany(options),
            prisma.booking_services.count({ where: options.where }),
        ]);
        return { services, total };
    }
    static async create(data) {
        return prisma.booking_services.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.booking_services.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.booking_services.delete({
            where: { id },
        });
    }
}
