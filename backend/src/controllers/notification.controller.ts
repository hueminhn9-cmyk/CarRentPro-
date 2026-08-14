import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { NotificationService } from '../services/notification.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createNotificationSchema, updateNotificationSchema } from '../validators/notification.validator.js';

export class NotificationController {
  static getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { notifications, total } = await NotificationService.getUserNotifications(req.user!.id, { page, limit });
      return ApiResponse.success(res, 'Lấy danh sách thông báo thành công', {
        notifications: serializeBigInt(notifications),
        pagination: {
          total,
          page,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const updated = await NotificationService.markAsRead(id);
      return ApiResponse.success(res, 'Đánh dấu đã đọc thông báo thành công', serializeBigInt(updated));
    } catch (error) {
      next(error);
    }
  };

  static markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return ApiResponse.success(res, 'Đánh dấu đã đọc toàn bộ thông báo thành công');
    } catch (error) {
      next(error);
    }
  };

  static getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const count = await NotificationService.getUnreadCount(req.user!.id);
      return ApiResponse.success(res, 'Lấy số lượng thông báo chưa đọc thành công', { count });
    } catch (error) {
      next(error);
    }
  };

  static broadcast = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { title, content, type } = req.body;
      if (!title || !content) {
        return ApiResponse.error(res, 'Tiêu đề và nội dung thông báo là bắt buộc', 400);
      }

      const count = await NotificationService.broadcastNotification(title, content, type);
      return ApiResponse.success(res, `Đã gửi thông báo quảng bá đến ${count} người dùng thành công`, { sentCount: count });
    } catch (error) {
      next(error);
    }
  };

  static createNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createNotificationSchema.parse(req.body);
      const notification = await NotificationService.createNotification(BigInt(validated.user_id), validated.title, validated.content, validated.type);
      return ApiResponse.created(res, 'Tạo thông báo thành công', serializeBigInt(notification));
    } catch (error) {
      next(error);
    }
  };

  static getNotificationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const notification = await NotificationService.getNotificationById(id);
      return ApiResponse.success(res, 'Lấy chi tiết thông báo thành công', serializeBigInt(notification));
    } catch (error) {
      next(error);
    }
  };

  static updateNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const validated = updateNotificationSchema.parse(req.body);
      const notification = await NotificationService.updateNotification(id, validated);
      return ApiResponse.success(res, 'Cập nhật thông báo thành công', serializeBigInt(notification));
    } catch (error) {
      next(error);
    }
  };

  static deleteNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await NotificationService.deleteNotification(id);
      return ApiResponse.success(res, 'Xóa thông báo thành công');
    } catch (error) {
      next(error);
    }
  };
}
