import { z } from 'zod';

export const updateUserSchema = z.object({
  full_name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').optional(),
  phone: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER']).optional(),
  avatar_url: z.string().url('Đường dẫn ảnh đại diện không hợp lệ').optional().nullable(),
});

export const updateCustomerProfileSchema = z.object({
  date_of_birth: z.string().datetime().optional().nullable().or(z.string().date().optional().nullable()),
  address: z.string().optional().nullable(),
  citizen_id: z.string().min(9, 'Số CCCD/CMND không hợp lệ').max(12, 'Số CCCD/CMND không hợp lệ').optional().nullable(),
  driver_license_number: z.string().min(12, 'Số GPLX không hợp lệ').max(12, 'Số GPLX không hợp lệ').optional().nullable(),
  driver_license_expiry: z.string().datetime().optional().nullable().or(z.string().date().optional().nullable()),
  verification_status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
});
