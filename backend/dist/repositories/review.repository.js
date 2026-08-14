import { prisma } from '../config/prisma.js';
export class ReviewRepository {
    static async findById(id) {
        return prisma.reviews.findUnique({
            where: { id },
            include: {
                users: { select: { id: true, full_name: true, avatar_url: true } },
                vehicles: true,
            },
        });
    }
    static async findByBookingId(bookingId) {
        return prisma.reviews.findUnique({
            where: { booking_id: bookingId },
        });
    }
    static async findAll(options) {
        const [reviews, total] = await Promise.all([
            prisma.reviews.findMany({
                ...options,
                include: {
                    users: { select: { id: true, full_name: true, avatar_url: true } },
                    vehicles: { select: { id: true, name: true, brand: true, license_plate: true } }
                },
            }),
            prisma.reviews.count({ where: options.where }),
        ]);
        return { reviews, total };
    }
    static async create(data) {
        return prisma.reviews.create({
            data,
        });
    }
    static async delete(id) {
        return prisma.reviews.delete({
            where: { id },
        });
    }
    static async update(id, data) {
        return prisma.reviews.update({
            where: { id },
            data,
        });
    }
    static async getStatsByVehicleId(vehicleId) {
        const stats = await prisma.reviews.aggregate({
            where: { vehicle_id: vehicleId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        const distribution = await prisma.reviews.groupBy({
            by: ['rating'],
            where: { vehicle_id: vehicleId },
            _count: { rating: true },
        });
        return {
            averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
            totalCount: stats._count.rating || 0,
            distribution: Array.from({ length: 5 }, (_, i) => {
                const rating = i + 1;
                const dist = distribution.find((d) => d.rating === rating);
                return {
                    rating,
                    count: dist ? dist._count.rating : 0,
                };
            }),
        };
    }
}
