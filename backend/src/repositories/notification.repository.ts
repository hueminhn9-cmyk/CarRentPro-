import { prisma } from '../config/prisma.js';

export class NotificationRepository {
  static async create(data: { user_id: bigint; title: string; content: string; type?: string }) {
    return prisma.notifications.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        content: data.content,
        type: data.type || 'SYSTEM',
        is_read: false,
      },
    });
  }

  static async findByUser(userId: bigint, options: { skip?: number; take?: number }) {
    const [notifications, total] = await Promise.all([
      prisma.notifications.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        ...options,
      }),
      prisma.notifications.count({
        where: { user_id: userId },
      }),
    ]);

    return { notifications, total };
  }

  static async markAsRead(id: bigint) {
    return prisma.notifications.update({
      where: { id },
      data: { is_read: true },
    });
  }

  static async markAllAsRead(userId: bigint) {
    return prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  static async countUnread(userId: bigint): Promise<number> {
    return prisma.notifications.count({
      where: { user_id: userId, is_read: false },
    });
  }

  static async createMany(notificationsData: { user_id: bigint; title: string; content: string; type: string }[]) {
    return prisma.notifications.createMany({
      data: notificationsData,
    });
  }

  static async findById(id: bigint) {
    return prisma.notifications.findUnique({
      where: { id },
    });
  }

  static async update(id: bigint, data: any) {
    return prisma.notifications.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.notifications.delete({
      where: { id },
    });
  }
}
