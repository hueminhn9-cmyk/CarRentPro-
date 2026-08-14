import { prisma } from '../config/prisma.js';
export class MediaRepository {
    static async findById(id) {
        return prisma.media_files.findUnique({
            where: { id },
        });
    }
    static async findByEntity(entity_type, entity_id) {
        return prisma.media_files.findMany({
            where: { entity_type, entity_id },
            orderBy: { sort_order: 'asc' },
        });
    }
    static async create(data) {
        return prisma.media_files.create({
            data,
        });
    }
    static async delete(id) {
        return prisma.media_files.delete({
            where: { id },
        });
    }
    static async setPrimary(id, entity_type, entity_id) {
        return prisma.$transaction(async (tx) => {
            // 1. Reset current primary image for the entity
            await tx.media_files.updateMany({
                where: { entity_type, entity_id, is_primary: true },
                data: { is_primary: false },
            });
            // 2. Set new primary image
            return tx.media_files.update({
                where: { id },
                data: { is_primary: true },
            });
        });
    }
    static async findAll(options) {
        const [media, total] = await Promise.all([
            prisma.media_files.findMany(options),
            prisma.media_files.count({ where: options.where }),
        ]);
        return { media, total };
    }
    static async update(id, data) {
        return prisma.media_files.update({
            where: { id },
            data,
        });
    }
}
