import { z } from 'zod';

export const createContractSchema = z.object({
  booking_id: z.coerce.number({ required_error: 'Booking ID là bắt buộc' }),
  contract_code: z.string({ required_error: 'Mã hợp đồng là bắt buộc' }),
  status: z.enum(['PENDING_SIGN', 'SIGNED', 'TERMINATED', 'CANCELLED']).optional().default('PENDING_SIGN'),
  contract_url: z.string().optional().nullable(),
});

export const updateContractSchema = createContractSchema.partial();
