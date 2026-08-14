import { prisma } from '../config/prisma.js';
import { Prisma, media_files_entity_type } from '@prisma/client';

export class MediaRepository {
  static async findById(id: bigint) {
    return prisma.media_files.findUnique({
      where: { id },
    });
  }

  static async findByEntity(entity_type: media_files_entity_type, entity_id: bigint) {
    return prisma.media_files.findMany({
      where: { entity_type, entity_id },
      orderBy: { sort_order: 'asc' },
    });
  }

  static async create(data: Prisma.media_filesUncheckedCreateInput) {
    return prisma.media_files.create({
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.media_files.delete({
      where: { id },
    });
  }

  static async setPrimary(id: bigint, entity_type: media_files_entity_type, entity_id: bigint) {
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

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [media, total] = await Promise.all([
      prisma.media_files.findMany(options),
      prisma.media_files.count({ where: options.where }),
    ]);
    return { media, total };
  }

  static async update(id: bigint, data: Prisma.media_filesUncheckedUpdateInput) {
    return prisma.media_files.update({
      where: { id },
      data,
    });
  }
}
