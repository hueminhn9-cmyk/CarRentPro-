import { prisma } from '../config/prisma.js';
export class MaintenanceRepository {
    static async findById(id) {
        return prisma.maintenance_records.findUnique({
            where: { id },
            include: {
                vehicles: true,
            },
        });
    }
    static async findAll() {
        return prisma.maintenance_records.findMany({
            include: {
                vehicles: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    static async create(data) {
        return prisma.maintenance_records.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.maintenance_records.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.maintenance_records.delete({
            where: { id },
        });
    }
}
