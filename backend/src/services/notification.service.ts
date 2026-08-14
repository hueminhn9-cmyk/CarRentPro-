import { NotificationRepository } from '../repositories/notification.repository.js';
import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';

export class NotificationService {
  static async createNotification(userId: bigint, title: string, content: string, type?: string) {
    return NotificationRepository.create({
      user_id: userId,
      title,
      content,
      type,
    });
  }

  static async getUserNotifications(userId: bigint, options: { page?: number; limit?: number }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    return NotificationRepository.findByUser(userId, { skip, take: limit });
  }

  static async markAsRead(id: bigint) {
    return NotificationRepository.markAsRead(id);
  }

  static async markAllAsRead(userId: bigint) {
    return NotificationRepository.markAllAsRead(userId);
  }

  static async getUnreadCount(userId: bigint): Promise<number> {
    return NotificationRepository.countUnread(userId);
  }

  static async broadcastNotification(title: string, content: string, type: string = 'SYSTEM'): Promise<number> {
    const users = await prisma.users.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    if (users.length === 0) return 0;

    const notificationsData = users.map((u) => ({
      user_id: u.id,
      title,
      content,
      type,
    }));

    const result = await NotificationRepository.createMany(notificationsData);
    return result.count;
  }

  static async getNotificationById(id: bigint) {
    const notification = await NotificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Không tìm thấy thông báo');
    return notification;
  }

  static async updateNotification(id: bigint, data: any) {
    const notification = await NotificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Không tìm thấy thông báo');
    
    const updatedData = { ...data };
    if (data.user_id) updatedData.user_id = BigInt(data.user_id);

    return NotificationRepository.update(id, updatedData);
  }

  static async deleteNotification(id: bigint) {
    const notification = await NotificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Không tìm thấy thông báo');
    return NotificationRepository.delete(id);
  }
}
