import { BookingStatusHistoryService } from '../services/booking-status-history.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createBookingStatusHistorySchema, updateBookingStatusHistorySchema } from '../validators/booking-status-history.validator.js';
export class BookingStatusHistoryController {
    static getById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const history = await BookingStatusHistoryService.getById(id);
            return ApiResponse.success(res, 'Lấy chi tiết lịch sử trạng thái thành công', serializeBigInt(history));
        }
        catch (error) {
            next(error);
        }
    };
    static getAll = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['reason']);
            const { histories, total } = await BookingStatusHistoryService.getAll(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách lịch sử trạng thái thành công', {
                histories: serializeBigInt(histories),
                pagination: { total, ...pagination },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static create = async (req, res, next) => {
        try {
            const validatedBody = createBookingStatusHistorySchema.parse(req.body);
            const history = await BookingStatusHistoryService.create(validatedBody, req.user.id);
            return ApiResponse.created(res, 'Tạo lịch sử trạng thái thành công', serializeBigInt(history));
        }
        catch (error) {
            next(error);
        }
    };
    static update = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validatedBody = updateBookingStatusHistorySchema.parse(req.body);
            const history = await BookingStatusHistoryService.update(id, validatedBody);
            return ApiResponse.success(res, 'Cập nhật lịch sử trạng thái thành công', serializeBigInt(history));
        }
        catch (error) {
            next(error);
        }
    };
    static delete = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await BookingStatusHistoryService.delete(id);
            return ApiResponse.success(res, 'Xóa lịch sử trạng thái thành công');
        }
        catch (error) {
            next(error);
        }
    };
}
