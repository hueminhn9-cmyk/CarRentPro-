import { prisma } from '../config/prisma.js';
export class UserRepository {
    static async findById(id) {
        return prisma.users.findUnique({
            where: { id },
            include: {
                customer_profiles: true,
            },
        });
    }
    static async findByEmail(email) {
        return prisma.users.findUnique({
            where: { email },
        });
    }
    static async findAll(options) {
        const [users, total] = await Promise.all([
            prisma.users.findMany({
                ...options,
                include: {
                    customer_profiles: true,
                },
            }),
            prisma.users.count({ where: options.where }),
        ]);
        return { users, total };
    }
    static async create(data) {
        return prisma.users.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.users.update({
            where: { id },
            data,
            include: {
                customer_profiles: true,
            },
        });
    }
    static async updateProfile(userId, data) {
        return prisma.customer_profiles.update({
            where: { user_id: userId },
            data,
        });
    }
    static async delete(id) {
        // We can do a soft delete by changing user status to INACTIVE/BLOCKED
        return prisma.users.update({
            where: { id },
            data: { status: 'INACTIVE' },
        });
    }
}
