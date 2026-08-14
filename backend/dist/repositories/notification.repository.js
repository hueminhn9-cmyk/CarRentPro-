import { prisma } from '../config/prisma.js';
export class NotificationRepository {
    static async create(data) {
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
    static async findByUser(userId, options) {
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
    static async markAsRead(id) {
        return prisma.notifications.update({
            where: { id },
            data: { is_read: true },
        });
    }
    static async markAllAsRead(userId) {
        return prisma.notifications.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true },
        });
    }
    static async countUnread(userId) {
        return prisma.notifications.count({
            where: { user_id: userId, is_read: false },
        });
    }
    static async createMany(notificationsData) {
        return prisma.notifications.createMany({
            data: notificationsData,
        });
    }
    static async findById(id) {
        return prisma.notifications.findUnique({
            where: { id },
        });
    }
    static async update(id, data) {
        return prisma.notifications.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.notifications.delete({
            where: { id },
        });
    }
}
