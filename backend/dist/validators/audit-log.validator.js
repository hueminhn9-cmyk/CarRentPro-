import { z } from 'zod';
export const createAuditLogSchema = z.object({
    user_id: z.coerce.number().optional().nullable(),
    action: z.string({ required_error: 'Hành động là bắt buộc' }),
    entity_name: z.string().optional().nullable(),
    entity_id: z.coerce.number().optional().nullable(),
    old_values: z.record(z.any()).optional().nullable(),
    new_values: z.record(z.any()).optional().nullable(),
    ip_address: z.string().optional().nullable(),
    user_agent: z.string().optional().nullable(),
});
export const updateAuditLogSchema = createAuditLogSchema.partial();
