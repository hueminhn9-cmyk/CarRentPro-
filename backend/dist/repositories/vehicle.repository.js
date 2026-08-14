import { prisma } from '../config/prisma.js';
export class VehicleRepository {
    // Vehicle Categories
    static async findAllCategories() {
        return prisma.vehicle_categories.findMany({
            orderBy: { name: 'asc' },
        });
    }
    static async findCategoryById(id) {
        return prisma.vehicle_categories.findUnique({
            where: { id },
        });
    }
    static async createCategory(data) {
        return prisma.vehicle_categories.create({ data });
    }
    static async updateCategory(id, data) {
        return prisma.vehicle_categories.update({
            where: { id },
            data,
        });
    }
    static async deleteCategory(id) {
        return prisma.vehicle_categories.delete({
            where: { id },
        });
    }
    // Vehicles
    static async findById(id) {
        return prisma.vehicles.findUnique({
            where: { id },
            include: {
                vehicle_categories: true,
            },
        });
    }
    static async findByCode(code) {
        return prisma.vehicles.findUnique({
            where: { code },
        });
    }
    static async findAll(options) {
        const [vehicles, total] = await Promise.all([
            prisma.vehicles.findMany({
                ...options,
                include: {
                    vehicle_categories: true,
                },
            }),
            prisma.vehicles.count({ where: options.where }),
        ]);
        return { vehicles, total };
    }
    static async create(data) {
        return prisma.vehicles.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.vehicles.update({
            where: { id },
            data,
            include: {
                vehicle_categories: true,
            },
        });
    }
    static async delete(id) {
        // We soft delete vehicles by updating status to INACTIVE
        return prisma.vehicles.update({
            where: { id },
            data: { status: 'INACTIVE' },
        });
    }
}
