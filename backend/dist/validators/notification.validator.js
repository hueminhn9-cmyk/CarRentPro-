import { z } from 'zod';
export const createNotificationSchema = z.object({
    user_id: z.coerce.number({ required_error: 'User ID là bắt buộc' }),
    title: z.string({ required_error: 'Tiêu đề là bắt buộc' }).min(1, 'Tiêu đề không được trống'),
    content: z.string({ required_error: 'Nội dung là bắt buộc' }).min(1, 'Nội dung không được trống'),
    type: z.string().optional().default('SYSTEM'),
});
export const updateNotificationSchema = createNotificationSchema.partial();
