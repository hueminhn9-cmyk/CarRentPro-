import { z } from 'zod';
export const createBookingStatusHistorySchema = z.object({
    booking_id: z.coerce.number({ required_error: 'Booking ID là bắt buộc' }),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'READY_FOR_PICKUP', 'ACTIVE', 'WAITING_RETURN', 'COMPLETED', 'OVERDUE'], { required_error: 'Trạng thái là bắt buộc' }),
    changed_by: z.coerce.number().optional(),
    reason: z.string().optional().nullable(),
});
export const updateBookingStatusHistorySchema = createBookingStatusHistorySchema.partial();
