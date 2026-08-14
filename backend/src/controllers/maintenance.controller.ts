import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { MaintenanceService } from '../services/maintenance.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { scheduleMaintenanceSchema, updateMaintenanceSchema } from '../validators/maintenance.validator.js';

export class MaintenanceController {
  static getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const records = await MaintenanceService.getAll();
      return ApiResponse.success(res, 'Lấy danh sách bảo dưỡng xe thành công', serializeBigInt(records));
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const record = await MaintenanceService.getById(id as string);
      return ApiResponse.success(res, 'Lấy chi tiết bảo dưỡng xe thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static schedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = scheduleMaintenanceSchema.parse(req.body);

      const record = await MaintenanceService.schedule({
        vehicleId: validated.vehicleId,
        description: validated.description || '',
        cost: validated.cost,
        startDate: validated.startDate,
        endDate: validated.endDate,
        userId: req.user!.id,
      });

      return ApiResponse.created(res, 'Lên lịch bảo dưỡng phương tiện thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static complete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const record = await MaintenanceService.complete(id as string);
      return ApiResponse.success(res, 'Hoàn thành bảo dưỡng xe thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validated = updateMaintenanceSchema.parse(req.body);
      
      const updateData: any = {};
      if (validated.maintenance_type !== undefined) updateData.maintenance_type = validated.maintenance_type;
      if (validated.startDate !== undefined) updateData.scheduled_date = validated.startDate;
      if (validated.endDate !== undefined) updateData.next_service_date = validated.endDate;
      if (validated.cost !== undefined) updateData.cost = validated.cost;
      if (validated.description !== undefined) {
        updateData.description = validated.description ?? undefined;
      }
      if (validated.status !== undefined) updateData.status = validated.status;

      const record = await MaintenanceService.update(id as string, updateData);
      return ApiResponse.success(res, 'Cập nhật lịch bảo dưỡng thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await MaintenanceService.delete(id as string);
      return ApiResponse.success(res, 'Xóa bản ghi bảo dưỡng thành công');
    } catch (error) {
      next(error);
    }
  };
}
