import { z } from 'zod';
export const createHandoverRecordSchema = z.object({
    booking_id: z.coerce.number({ required_error: 'Booking ID là bắt buộc' }),
    record_type: z.enum(['PICKUP', 'RETURN'], { required_error: 'Loại bàn giao là bắt buộc' }),
    recorded_by: z.coerce.number().optional(),
    mileage: z.coerce.number().int().nonnegative('Số km hiển thị không được âm'),
    fuel_level: z.coerce.number().int().min(0).max(100),
    vehicle_condition: z.enum(['EXCELLENT', 'GOOD', 'NORMAL', 'DAMAGED']).optional().default('GOOD'),
    damage_description: z.string().optional().nullable(),
    late_fee: z.coerce.number().nonnegative().optional().default(0),
    extra_km_fee: z.coerce.number().nonnegative().optional().default(0),
    fuel_fee: z.coerce.number().nonnegative().optional().default(0),
    cleaning_fee: z.coerce.number().nonnegative().optional().default(0),
    damage_fee: z.coerce.number().nonnegative().optional().default(0),
    refundable_deposit: z.coerce.number().nonnegative().optional().default(0),
    note: z.string().optional().nullable(),
});
export const updateHandoverRecordSchema = createHandoverRecordSchema.partial();
