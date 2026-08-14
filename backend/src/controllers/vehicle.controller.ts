import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator.js';

export class VehicleController {
  // Categories
  static getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await VehicleService.getAllCategories();
      return ApiResponse.success(res, 'Lấy danh sách danh mục xe thành công', serializeBigInt(categories));
    } catch (error) {
      next(error);
    }
  };

  static getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const category = await VehicleService.getCategoryById(id);
      return ApiResponse.success(res, 'Lấy chi tiết danh mục xe thành công', serializeBigInt(category));
    } catch (error) {
      next(error);
    }
  };

  static createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return ApiResponse.error(res, 'Tên danh mục là bắt buộc', 400);
      }
      const category = await VehicleService.createCategory({ name, description });
      return ApiResponse.created(res, 'Tạo danh mục xe thành công', serializeBigInt(category));
    } catch (error) {
      next(error);
    }
  };

  static updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const { name, description } = req.body;
      const category = await VehicleService.updateCategory(id, { name, description });
      return ApiResponse.success(res, 'Cập nhật danh mục xe thành công', serializeBigInt(category));
    } catch (error) {
      next(error);
    }
  };

  static deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await VehicleService.deleteCategory(id);
      return ApiResponse.success(res, 'Xóa danh mục xe thành công');
    } catch (error) {
      next(error);
    }
  };

  // Vehicles
  static getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['name', 'brand', 'model', 'license_plate']);
      const { vehicles, total } = await VehicleService.getAllVehicles(prismaOptions);

      return ApiResponse.success(res, 'Lấy danh sách xe thành công', {
        vehicles: serializeBigInt(vehicles),
        pagination: {
          total,
          ...pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const vehicle = await VehicleService.getVehicleById(id);
      return ApiResponse.success(res, 'Lấy thông tin xe thành công', serializeBigInt(vehicle));
    } catch (error) {
      next(error);
    }
  };

  static createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createVehicleSchema.parse(req.body);
      const vehicle = await VehicleService.createVehicle(validatedBody);
      return ApiResponse.created(res, 'Thêm xe mới thành công', serializeBigInt(vehicle));
    } catch (error) {
      next(error);
    }
  };

  static updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const validatedBody = updateVehicleSchema.parse(req.body);
      const vehicle = await VehicleService.updateVehicle(id, validatedBody);
      return ApiResponse.success(res, 'Cập nhật thông tin xe thành công', serializeBigInt(vehicle));
    } catch (error) {
      next(error);
    }
  };

  static deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await VehicleService.deleteVehicle(id);
      return ApiResponse.success(res, 'Xóa thông tin xe thành công (Soft Delete)');
    } catch (error) {
      next(error);
    }
  };
}
