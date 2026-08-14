import { serializeBigInt } from './bigintSerializer.js';
export class ApiResponse {
    static success(res, message = 'Thành công', data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data: data !== undefined ? serializeBigInt(data) : data,
        });
    }
    static created(res, message = 'Tạo mới thành công', data) {
        return this.success(res, message, data, 201);
    }
    static error(res, message = 'Đã xảy ra lỗi', statusCode = 500, errors) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: errors !== undefined ? serializeBigInt(errors) : errors,
        });
    }
}
