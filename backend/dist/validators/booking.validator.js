import { z } from 'zod';
export const createBookingServiceSchema = z.object({
    service_name: z.string({ required_error: 'Tên dịch vụ là bắt buộc' }),
    quantity: z.coerce.number().int().positive('Số lượng phải lớn hơn 0').default(1),
    unit_price: z.coerce.number().positive('Đơn giá phải lớn hơn 0'),
});
export const createBookingSchema = z.object({
    vehicle_id: z.coerce.number({ required_error: 'Xe là bắt buộc' }),
    customer_id: z.coerce.number().optional(), // For admin booking, customer_id can be specified, else it uses the authenticated user's ID
    pickup_datetime: z.string({ required_error: 'Thời gian nhận xe là bắt buộc' }).datetime({ message: 'Thời gian nhận xe không đúng định dạng ISO' }),
    return_datetime: z.string({ required_error: 'Thời gian trả xe là bắt buộc' }).datetime({ message: 'Thời gian trả xe không đúng định dạng ISO' }),
    pickup_location: z.string({ required_error: 'Địa điểm nhận xe là bắt buộc' }),
    return_location: z.string({ required_error: 'Địa điểm trả xe là bắt buộc' }),
    customer_note: z.string().optional(),
    services: z.array(createBookingServiceSchema).optional().default([]),
});
export const updateBookingSchema = createBookingSchema.partial();
export const updateBookingStatusSchema = z.object({
    status: z.enum([
        'PENDING',
        'CONFIRMED',
        'READY_FOR_PICKUP',
        'ACTIVE',
        'WAITING_FOR_RETURN',
        'COMPLETED',
        'CANCELLED',
        'REJECTED',
        'OVERDUE'
    ], { required_error: 'Trạng thái mới là bắt buộc' }),
    reason: z.string().optional(),
});
export const createHandoverRecordSchema = z.object({
    record_type: z.enum(['PICKUP', 'RETURN'], { required_error: 'Loại biên bản là bắt buộc' }),
    mileage: z.coerce.number().int().nonnegative('Số km hiển thị không được âm'),
    fuel_level: z.coerce.number().int().min(0, 'Mức xăng từ 0-100%').max(100, 'Mức xăng từ 0-100%'),
    vehicle_condition: z.enum(['EXCELLENT', 'GOOD', 'NORMAL', 'DAMAGED']).optional().default('GOOD'),
    damage_description: z.string().optional(),
    late_fee: z.coerce.number().nonnegative().optional().default(0),
    extra_km_fee: z.coerce.number().nonnegative().optional().default(0),
    fuel_fee: z.coerce.number().nonnegative().optional().default(0),
    cleaning_fee: z.coerce.number().nonnegative().optional().default(0),
    damage_fee: z.coerce.number().nonnegative().optional().default(0),
    refundable_deposit: z.coerce.number().nonnegative().optional().default(0),
    note: z.string().optional(),
});
