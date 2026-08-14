import { z } from 'zod';

export const createCustomerProfileSchema = z.object({
  user_id: z.coerce.number({ required_error: 'User ID là bắt buộc' }),
  date_of_birth: z.string().datetime().optional().nullable().or(z.string().date().optional().nullable()),
  address: z.string().optional().nullable(),
  citizen_id: z.string().min(9, 'CCCD không hợp lệ').max(12, 'CCCD không hợp lệ').optional().nullable(),
  driver_license_number: z.string().min(12, 'GPLX không hợp lệ').max(12, 'GPLX không hợp lệ').optional().nullable(),
  driver_license_expiry: z.string().datetime().optional().nullable().or(z.string().date().optional().nullable()),
  verification_status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional().default('PENDING'),
});

export const updateCustomerProfileSchema = createCustomerProfileSchema.partial();
