import { BookingService } from '../services/booking.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createBookingSchema, updateBookingStatusSchema, createHandoverRecordSchema, } from '../validators/booking.validator.js';
export class BookingController {
    static createBooking = async (req, res, next) => {
        try {
            const validatedBody = createBookingSchema.parse(req.body);
            const customerId = req.user.role === 'ADMIN' && validatedBody.customer_id
                ? BigInt(validatedBody.customer_id)
                : req.user.id;
            const booking = await BookingService.createBooking({
                vehicle_id: BigInt(validatedBody.vehicle_id),
                customer_id: customerId,
                pickup_datetime: new Date(validatedBody.pickup_datetime),
                return_datetime: new Date(validatedBody.return_datetime),
                pickup_location: validatedBody.pickup_location,
                return_location: validatedBody.return_location,
                customer_note: validatedBody.customer_note,
                services: validatedBody.services,
            });
            return ApiResponse.created(res, 'Tạo đơn đặt xe thành công', serializeBigInt(booking));
        }
        catch (error) {
            next(error);
        }
    };
    static getBookingById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const booking = await BookingService.getBookingById(id);
            // Customers can only access their own bookings
            if (req.user.role === 'CUSTOMER' && booking.customer_id !== req.user.id) {
                return ApiResponse.error(res, 'Bạn không có quyền truy cập đơn đặt xe này', 403);
            }
            return ApiResponse.success(res, 'Lấy thông tin đơn đặt xe thành công', serializeBigInt(booking));
        }
        catch (error) {
            next(error);
        }
    };
    static getAllBookings = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['booking_code', 'pickup_location', 'return_location']);
            // If user is customer, filter by their own customer_id
            if (req.user.role === 'CUSTOMER') {
                prismaOptions.where = {
                    ...prismaOptions.where,
                    customer_id: req.user.id,
                };
            }
            const { bookings, total } = await BookingService.getAllBookings(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách đơn đặt xe thành công', {
                bookings: serializeBigInt(bookings),
                pagination: {
                    total,
                    ...pagination,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static updateStatus = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validatedBody = updateBookingStatusSchema.parse(req.body);
            const booking = await BookingService.updateBookingStatus(id, validatedBody.status, req.user.id, validatedBody.reason);
            return ApiResponse.success(res, 'Cập nhật trạng thái đơn đặt xe thành công', serializeBigInt(booking));
        }
        catch (error) {
            next(error);
        }
    };
    static createHandover = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validatedBody = createHandoverRecordSchema.parse(req.body);
            const handover = await BookingService.createHandover(id, req.user.id, {
                record_type: validatedBody.record_type,
                mileage: validatedBody.mileage,
                fuel_level: validatedBody.fuel_level,
                vehicle_condition: validatedBody.vehicle_condition,
                damage_description: validatedBody.damage_description,
                late_fee: validatedBody.late_fee,
                extra_km_fee: validatedBody.extra_km_fee,
                fuel_fee: validatedBody.fuel_fee,
                cleaning_fee: validatedBody.cleaning_fee,
                damage_fee: validatedBody.damage_fee,
                refundable_deposit: validatedBody.refundable_deposit,
                note: validatedBody.note,
            });
            return ApiResponse.created(res, 'Tạo biên bản bàn giao thành công', serializeBigInt(handover));
        }
        catch (error) {
            next(error);
        }
    };
    static updateBooking = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const booking = await BookingService.updateBooking(id, req.body, req.user.id);
            return ApiResponse.success(res, 'Cập nhật đơn đặt xe thành công', serializeBigInt(booking));
        }
        catch (error) {
            next(error);
        }
    };
    static deleteBooking = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await BookingService.deleteBooking(id, req.user.id);
            return ApiResponse.success(res, 'Xóa đơn đặt xe thành công');
        }
        catch (error) {
            next(error);
        }
    };
}
