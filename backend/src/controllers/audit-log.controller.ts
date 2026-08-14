import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { AuditLogService } from '../services/audit-log.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createAuditLogSchema, updateAuditLogSchema } from '../validators/audit-log.validator.js';

export class AuditLogController {
  static getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const log = await AuditLogService.getById(id);
      return ApiResponse.success(res, 'Lấy chi tiết nhật ký thành công', serializeBigInt(log));
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['action', 'entity_name']);
      const { logs, total } = await AuditLogService.getAll(prismaOptions);
      return ApiResponse.success(res, 'Lấy danh sách nhật ký thành công', {
        logs: serializeBigInt(logs),
        pagination: { total, ...pagination },
      });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createAuditLogSchema.parse(req.body);
      const log = await AuditLogService.create(validatedBody);
      return ApiResponse.created(res, 'Tạo nhật ký thành công', serializeBigInt(log));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const validatedBody = updateAuditLogSchema.parse(req.body);
      const log = await AuditLogService.update(id, validatedBody);
      return ApiResponse.success(res, 'Cập nhật nhật ký thành công', serializeBigInt(log));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await AuditLogService.delete(id);
      return ApiResponse.success(res, 'Xóa nhật ký thành công');
    } catch (error) {
      next(error);
    }
  };
}
