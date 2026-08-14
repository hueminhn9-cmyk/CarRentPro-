import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
export class DashboardController {
    static getStats = async (req, res, next) => {
        try {
            const stats = await DashboardService.getStats();
            return ApiResponse.success(res, 'Lấy số liệu thống kê thành công', serializeBigInt(stats));
        }
        catch (error) {
            next(error);
        }
    };
}
