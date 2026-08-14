import { z } from 'zod';

export const createReviewSchema = z.object({
  booking_id: z.coerce.number({ required_error: 'Đơn đặt xe là bắt buộc' }),
  rating: z.coerce.number().int().min(1, 'Đánh giá tối thiểu là 1 sao').max(5, 'Đánh giá tối đa là 5 sao'),
  content: z.string().optional(),
});
