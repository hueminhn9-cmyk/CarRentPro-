import { prisma } from '../config/prisma.js';
export class SettingRepository {
    static async findByKey(key) {
        return prisma.settings.findUnique({
            where: { key },
        });
    }
    static async findAll() {
        return prisma.settings.findMany({
            orderBy: { key: 'asc' },
        });
    }
    static async update(key, value, description) {
        return prisma.settings.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description },
        });
    }
    static async delete(key) {
        return prisma.settings.delete({
            where: { key },
        });
    }
}
