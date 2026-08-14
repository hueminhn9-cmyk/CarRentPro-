export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Yêu cầu không hợp lệ') {
        super(message, 400);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Không có quyền truy cập') {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Bị cấm truy cập') {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Không tìm thấy tài nguyên') {
        super(message, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'Xung đột dữ liệu') {
        super(message, 409);
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'Lỗi hệ thống nội bộ') {
        super(message, 500, false);
    }
}
