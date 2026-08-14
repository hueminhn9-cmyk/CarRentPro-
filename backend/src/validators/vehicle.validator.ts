import { z } from 'zod';

export const createVehicleSchema = z.object({
  category_id: z.coerce.number({ required_error: 'Danh mục xe là bắt buộc' }),
  code: z.string({ required_error: 'Mã xe là bắt buộc' }).min(2, 'Mã xe phải có ít nhất 2 ký tự'),
  name: z.string({ required_error: 'Tên xe là bắt buộc' }).min(2, 'Tên xe phải có ít nhất 2 ký tự'),
  brand: z.string({ required_error: 'Hãng xe là bắt buộc' }),
  model: z.string({ required_error: 'Dòng xe là bắt buộc' }),
  manufacture_year: z.coerce.number().int().optional(),
  license_plate: z.string({ required_error: 'Biển số xe là bắt buộc' }),
  color: z.string().optional(),
  seat_count: z.coerce.number().int().positive('Số ghế phải lớn hơn 0'),
  transmission: z.enum(['AUTO', 'MANUAL'], { required_error: 'Hộp số là bắt buộc' }),
  fuel_type: z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC'], { required_error: 'Loại nhiên liệu là bắt buộc' }),
  current_mileage: z.coerce.number().int().nonnegative().optional().default(0),
  price_per_day: z.coerce.number().positive('Giá thuê theo ngày phải lớn hơn 0'),
  deposit_amount: z.coerce.number().nonnegative('Tiền đặt cọc không được âm'),
  included_km_per_day: z.coerce.number().int().nonnegative().optional().default(200),
  extra_km_fee: z.coerce.number().nonnegative().optional().default(3000.00),
  location: z.string().optional().nullable(),
  description: z.string().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE', 'INACTIVE', 'INCIDENT']).optional().default('AVAILABLE'),
});

export const updateVehicleSchema = createVehicleSchema.partial();
