import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { BookingServiceService } from '../services/booking-service.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createBookingServiceSchema, updateBookingServiceSchema } from '../validators/booking-service.validator.js';

export class BookingServiceController {
  static getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const service = await BookingServiceService.getById(id);
      return ApiResponse.success(res, 'Lấy chi tiết dịch vụ đặt xe thành công', serializeBigInt(service));
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['service_name']);
      const { services, total } = await BookingServiceService.getAll(prismaOptions);
      return ApiResponse.success(res, 'Lấy danh sách dịch vụ đặt xe thành công', {
        services: serializeBigInt(services),
        pagination: { total, ...pagination },
      });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createBookingServiceSchema.parse(req.body);
      const service = await BookingServiceService.create(validatedBody);
      return ApiResponse.created(res, 'Thêm dịch vụ đặt xe thành công', serializeBigInt(service));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const validatedBody = updateBookingServiceSchema.parse(req.body);
      const service = await BookingServiceService.update(id, validatedBody);
      return ApiResponse.success(res, 'Cập nhật dịch vụ đặt xe thành công', serializeBigInt(service));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await BookingServiceService.delete(id);
      return ApiResponse.success(res, 'Xóa dịch vụ đặt xe thành công');
    } catch (error) {
      next(error);
    }
  };
}
