import { z } from 'zod';
export const updateMediaSchema = z.object({
    entity_type: z.enum(['VEHICLE', 'CUSTOMER_PROFILE', 'BOOKING', 'HANDOVER_RECORD', 'REVIEW', 'PAYMENT']).optional(),
    entity_id: z.coerce.number().optional(),
    media_type: z.enum(['IMAGE', 'VIDEO', 'PDF', 'DOCUMENT']).optional(),
    category: z.enum([
        'VEHICLE_FRONT', 'VEHICLE_BACK', 'VEHICLE_LEFT', 'VEHICLE_RIGHT',
        'VEHICLE_INTERIOR', 'VEHICLE_ENGINE', 'CITIZEN_FRONT', 'CITIZEN_BACK',
        'LICENSE_FRONT', 'LICENSE_BACK', 'PASSPORT', 'HANDOVER_FRONT',
        'HANDOVER_BACK', 'PAYMENT_RECEIPT', 'OTHER'
    ]).optional(),
    description: z.string().optional().nullable(),
    sort_order: z.coerce.number().int().optional(),
});
