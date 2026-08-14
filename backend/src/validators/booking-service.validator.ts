import { z } from 'zod';

export const createBookingServiceSchema = z.object({
  booking_id: z.coerce.number({ required_error: 'Booking ID là bắt buộc' }),
  service_name: z.string({ required_error: 'Tên dịch vụ là bắt buộc' }),
  quantity: z.coerce.number().int().positive('Số lượng phải lớn hơn 0').default(1),
  unit_price: z.coerce.number().positive('Đơn giá phải lớn hơn 0'),
});

export const updateBookingServiceSchema = createBookingServiceSchema.partial();
