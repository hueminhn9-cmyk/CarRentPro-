import { z } from 'zod';
export const createSettingSchema = z.object({
    key: z.string({ required_error: 'Key cài đặt là bắt buộc' }).min(1, 'Key không được trống'),
    value: z.string({ required_error: 'Giá trị cài đặt là bắt buộc' }),
    description: z.string().optional().nullable(),
});
export const updateSettingSchema = createSettingSchema.partial();
