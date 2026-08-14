import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
export const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message || err}`, {
        stack: err.stack,
        details: err
    });
    // 1. Zod Validation Error
    if (err instanceof ZodError) {
        const errorDetails = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return ApiResponse.error(res, 'Dữ liệu yêu cầu không hợp lệ', 400, errorDetails);
    }
    // 2. Custom Application Error
    if (err instanceof AppError) {
        return ApiResponse.error(res, err.message, err.statusCode);
    }
    // 3. Prisma Query, Constraint & Connection Errors
    if (err.name === 'PrismaClientInitializationError' || err.code === 'P1001' || err.code === 'P1002' || (err.message && err.message.includes("Can't reach database server"))) {
        return ApiResponse.error(res, 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng kiểm tra lại dịch vụ MySQL.', 503);
    }
    if (err.code) {
        // Prisma unique constraint violation
        if (err.code === 'P2002') {
            const target = err.meta?.target || 'dữ liệu';
            return ApiResponse.error(res, `Trường dữ liệu đã tồn tại: ${target}`, 409);
        }
        // Prisma record not found
        if (err.code === 'P2025') {
            return ApiResponse.error(res, 'Không tìm thấy tài nguyên yêu cầu', 404);
        }
        // Prisma foreign key constraint violation
        if (err.code === 'P2003') {
            return ApiResponse.error(res, 'Lỗi liên kết dữ liệu (Foreign key constraint failed)', 400);
        }
    }
    // 4. Default Internal Server Error
    const statusCode = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.'
        : err.message || 'Lỗi hệ thống nội bộ';
    return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'production' ? null : err.stack);
};
