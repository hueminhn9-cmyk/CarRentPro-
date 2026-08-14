import { prisma } from '../config/prisma.js';
import { NotificationService } from '../services/notification.service.js';

export function startMaintenanceScheduler() {
  // Run checks immediately on start, then every 24 hours
  checkUpcomingMaintenance();
  
  const intervalMs = 24 * 60 * 60 * 1000; // 24 hours
  setInterval(checkUpcomingMaintenance, intervalMs);
}

async function checkUpcomingMaintenance() {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcoming = await prisma.maintenance_records.findMany({
      where: {
        status: 'SCHEDULED',
        scheduled_date: {
          lte: threeDaysFromNow,
          gte: new Date(),
        },
      },
      include: {
        vehicles: true,
      },
    });

    for (const record of upcoming) {
      // Find if notification already exists to avoid duplication
      const existingNotification = await prisma.notifications.findFirst({
        where: {
          user_id: record.created_by,
          title: 'Nhắc nhở bảo dưỡng xe',
          content: {
            contains: `Biển số: ${record.vehicles?.license_plate || ''}`,
          },
        },
      });

      if (!existingNotification) {
        await NotificationService.createNotification(
          record.created_by,
          'Nhắc nhở bảo dưỡng xe',
          `Lịch bảo dưỡng định kỳ cho xe ${record.vehicles?.name || ''} (Biển số: ${record.vehicles?.license_plate || ''}) sắp diễn ra vào ngày ${record.scheduled_date.toLocaleDateString('vi-VN')}.`,
          'MAINTENANCE_ALERT'
        );
      }
    }
  } catch (error) {
    console.error('Lỗi khi chạy quét lịch bảo dưỡng phương tiện:', error);
  }
}
