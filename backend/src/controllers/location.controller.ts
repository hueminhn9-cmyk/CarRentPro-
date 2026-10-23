import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/location.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';

export class LocationController {
  static getAllLocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await LocationService.getAllLocations();
      return ApiResponse.success(res, 'Lấy danh sách chi nhánh showroom thành công', serializeBigInt(locations));
    } catch (error) {
      next(error);
    }
  };

  static getLocationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const location = await LocationService.getLocationById(id);
      return ApiResponse.success(res, 'Lấy thông tin chi nhánh thành công', serializeBigInt(location));
    } catch (error) {
      next(error);
    }
  };

  static createLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, city, district, address } = req.body;
      if (!name) {
        return ApiResponse.error(res, 'Tên chi nhánh showroom là bắt buộc', 400);
      }
      const location = await LocationService.createLocation({ name, city, district, address });
      return ApiResponse.created(res, 'Tạo chi nhánh showroom thành công', serializeBigInt(location));
    } catch (error) {
      next(error);
    }
  };
}
