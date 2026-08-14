import { prisma } from '../config/prisma.js';

export class SettingRepository {
  static async findByKey(key: string) {
    return prisma.settings.findUnique({
      where: { key },
    });
  }

  static async findAll() {
    return prisma.settings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  static async update(key: string, value: string, description?: string) {
    return prisma.settings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  static async delete(key: string) {
    return prisma.settings.delete({
      where: { key },
    });
  }
}
