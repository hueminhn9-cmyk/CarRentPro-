import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';

export class DashboardController {
  static getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await DashboardService.getStats();
      return ApiResponse.success(res, 'Lấy số liệu thống kê thành công', serializeBigInt(stats));
    } catch (error) {
      next(error);
    }
  };
}
