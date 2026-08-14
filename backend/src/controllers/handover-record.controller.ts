import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { HandoverRecordService } from '../services/handover-record.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createHandoverRecordSchema, updateHandoverRecordSchema } from '../validators/handover-record.validator.js';

export class HandoverRecordController {
  static getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const record = await HandoverRecordService.getById(id);
      return ApiResponse.success(res, 'Lấy chi tiết biên bản bàn giao thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['damage_description', 'note']);
      const { handovers, total } = await HandoverRecordService.getAll(prismaOptions);
      return ApiResponse.success(res, 'Lấy danh sách biên bản bàn giao thành công', {
        handovers: serializeBigInt(handovers),
        pagination: { total, ...pagination },
      });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createHandoverRecordSchema.parse(req.body);
      const record = await HandoverRecordService.create(validatedBody, req.user!.id);
      return ApiResponse.created(res, 'Tạo biên bản bàn giao thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const validatedBody = updateHandoverRecordSchema.parse(req.body);
      const record = await HandoverRecordService.update(id, validatedBody);
      return ApiResponse.success(res, 'Cập nhật biên bản bàn giao thành công', serializeBigInt(record));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await HandoverRecordService.delete(id);
      return ApiResponse.success(res, 'Xóa biên bản bàn giao thành công');
    } catch (error) {
      next(error);
    }
  };
}
