import { z } from 'zod';

export const scheduleMaintenanceSchema = z.object({
  vehicleId: z.string({ required_error: 'Vehicle ID là bắt buộc' }),
  description: z.string().optional().nullable(),
  startDate: z.string({ required_error: 'Ngày bắt đầu là bắt buộc' }).datetime().or(z.string().date()),
  endDate: z.string({ required_error: 'Ngày kết thúc là bắt buộc' }).datetime().or(z.string().date()),
  cost: z.coerce.number().nonnegative('Chi phí không được âm').optional().default(0),
  maintenance_type: z.string().optional().default('Định kỳ'),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional().default('SCHEDULED'),
});

export const updateMaintenanceSchema = scheduleMaintenanceSchema.partial();
