import { prisma } from '../config/prisma.js';
export class CustomerProfileRepository {
    static async findById(id) {
        return prisma.customer_profiles.findUnique({
            where: { id },
            include: { users: { select: { id: true, full_name: true, email: true } } },
        });
    }
    static async findByUserId(userId) {
        return prisma.customer_profiles.findUnique({
            where: { user_id: userId },
        });
    }
    static async findAll(options) {
        const [profiles, total] = await Promise.all([
            prisma.customer_profiles.findMany({
                ...options,
                include: { users: { select: { id: true, full_name: true, email: true } } },
            }),
            prisma.customer_profiles.count({ where: options.where }),
        ]);
        return { profiles, total };
    }
    static async create(data) {
        return prisma.customer_profiles.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.customer_profiles.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.customer_profiles.delete({
            where: { id },
        });
    }
}
