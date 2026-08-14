import { z } from 'zod';
export const createPaymentSchema = z.object({
    booking_id: z.coerce.number({ required_error: 'ID đơn đặt xe là bắt buộc' }),
    transaction_type: z.enum(['DEPOSIT', 'RENTAL', 'SERVICE_FEE', 'SURCHARGE', 'REFUND'], {
        required_error: 'Loại giao dịch là bắt buộc',
    }),
    amount: z.coerce.number().positive('Số tiền thanh toán phải lớn hơn 0'),
    payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'VNPAY', 'MOMO', 'CREDIT_CARD', 'OTHER'], {
        required_error: 'Phương thức thanh toán là bắt buộc',
    }),
    payment_reference: z.string().optional(),
});
export const updatePaymentStatusSchema = z.object({
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'], {
        required_error: 'Trạng thái thanh toán là bắt buộc',
    }),
    payment_reference: z.string().optional(),
});
