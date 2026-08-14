import { Response } from 'express';
import { serializeBigInt } from './bigintSerializer.js';

export class ApiResponse {
  static success<T>(res: Response, message: string = 'Thành công', data?: T, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data !== undefined ? serializeBigInt(data) : data,
    });
  }

  static created<T>(res: Response, message: string = 'Tạo mới thành công', data?: T) {
    return this.success(res, message, data, 201);
  }

  static error(res: Response, message: string = 'Đã xảy ra lỗi', statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors !== undefined ? serializeBigInt(errors) : errors,
    });
  }
}
