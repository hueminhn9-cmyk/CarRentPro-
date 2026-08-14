import { PaymentRepository } from '../repositories/payment.repository.js';
import { BookingRepository } from '../repositories/booking.repository.js';
import { NotificationRepository } from '../repositories/notification.repository.js';
import { PaymentContext } from './payment/paymentContext.js';
import { AuditService } from './audit.service.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { logPayment } from '../utils/logger.js';
import { Prisma } from '@prisma/client';
export class PaymentService {
    static async createPayment(data) {
        // 1. Verify booking exists
        const booking = await BookingRepository.findById(data.booking_id);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        // 2. Generate unique transaction code
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randPart = Math.floor(1000 + Math.random() * 9000);
        const transactionCode = `TX-${datePart}-${randPart}`;
        // 3. Create payment record in DB (PENDING status)
        const payment = await PaymentRepository.create({
            transaction_code: transactionCode,
            booking_id: data.booking_id,
            customer_id: data.customer_id,
            transaction_type: data.transaction_type,
            amount: new Prisma.Decimal(data.amount),
            payment_method: data.payment_method,
            status: 'PENDING',
            payment_reference: data.payment_reference || null,
        });
        logPayment(payment.id.toString(), data.payment_method, data.amount, 'PENDING');
        await AuditService.log({
            userId: data.customer_id,
            action: 'CREATE_PAYMENT',
            entityName: 'payments',
            entityId: payment.id,
            newValues: {
                booking_id: data.booking_id.toString(),
                amount: data.amount,
                payment_method: data.payment_method,
            },
        });
        // 4. Instantiate payment strategy context
        const context = new PaymentContext(data.payment_method);
        const response = await context.executePayment(payment.id, data.amount, booking.booking_code);
        // If strategy gave back reference, update it
        if (response.paymentReference || response.payUrl) {
            await PaymentRepository.updateStatus(payment.id, 'PENDING', response.paymentReference || response.payUrl);
        }
        return {
            paymentId: payment.id,
            transactionCode: payment.transaction_code,
            status: response.status,
            payUrl: response.payUrl,
            message: response.message,
        };
    }
    static async getPaymentById(id) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new NotFoundError('Không tìm thấy giao dịch thanh toán');
        }
        return payment;
    }
    static async getAllPayments(options) {
        return PaymentRepository.findAll(options);
    }
    static async confirmPayment(id, reference) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new NotFoundError('Không tìm thấy giao dịch thanh toán');
        }
        if (payment.status === 'PAID') {
            return payment;
        }
        // Update payment status to PAID
        const updatedPayment = await PaymentRepository.updateStatus(id, 'PAID', reference);
        // Update booking payment status
        const booking = await BookingRepository.findById(payment.booking_id);
        if (booking) {
            // Calculate total paid for this booking
            const totalPaid = booking.payments
                .filter((p) => p.status === 'PAID' || p.id === id)
                .reduce((sum, p) => sum + Number(p.amount), 0);
            const bookingTotal = Number(booking.total_amount);
            const bookingDeposit = Number(booking.deposit_amount);
            let newPaymentStatus = 'UNPAID';
            if (totalPaid >= bookingTotal) {
                newPaymentStatus = 'PAID';
            }
            else if (totalPaid > 0) {
                newPaymentStatus = 'PARTIALLY_PAID';
            }
            await BookingRepository.update(booking.id, {
                payment_status: newPaymentStatus,
            });
            // Automatically transition booking status if first payment (deposit) matches requirements
            if (booking.status === 'PENDING' && totalPaid >= bookingDeposit) {
                await BookingRepository.update(booking.id, {
                    status: 'CONFIRMED'
                });
                await BookingRepository.addStatusHistory(booking.id, 'CONFIRMED', payment.customer_id, 'Đã xác nhận cọc qua hệ thống thanh toán');
            }
            // Notify customer
            await NotificationRepository.create({
                user_id: payment.customer_id,
                title: 'Thanh toán thành công',
                content: `Giao dịch ${payment.transaction_code} trị giá ${Number(payment.amount).toLocaleString('vi-VN')} VND cho đơn hàng ${booking.booking_code} đã được xác nhận.`,
                type: 'PAYMENT',
            });
        }
        logPayment(id.toString(), payment.payment_method, Number(payment.amount), 'PAID');
        await AuditService.log({
            userId: payment.customer_id,
            action: 'CONFIRM_PAYMENT',
            entityName: 'payments',
            entityId: id,
            oldValues: { status: 'PENDING' },
            newValues: { status: 'PAID', payment_reference: reference },
        });
        return updatedPayment;
    }
    static async refundPayment(id) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new NotFoundError('Không tìm thấy giao dịch thanh toán');
        }
        if (payment.status !== 'PAID') {
            throw new BadRequestError('Chỉ có thể hoàn tiền cho các giao dịch đã thanh toán thành công');
        }
        const context = new PaymentContext(payment.payment_method);
        await context.executeRefund(id, Number(payment.amount), payment.payment_reference || '');
        const updatedPayment = await PaymentRepository.updateStatus(id, 'REFUNDED');
        // Notify customer
        await NotificationRepository.create({
            user_id: payment.customer_id,
            title: 'Hoàn tiền giao dịch',
            content: `Giao dịch ${payment.transaction_code} trị giá ${Number(payment.amount).toLocaleString('vi-VN')} VND đã được hoàn trả thành công.`,
            type: 'PAYMENT',
        });
        // Audit Log
        await AuditService.log({
            userId: payment.customer_id,
            action: 'REFUND_PAYMENT',
            entityName: 'payments',
            entityId: id,
            oldValues: { status: 'PAID' },
            newValues: { status: 'REFUNDED' },
        });
        logPayment(id.toString(), payment.payment_method, Number(payment.amount), 'REFUNDED');
        return updatedPayment;
    }
    static async updatePayment(id, data) {
        const payment = await PaymentRepository.findById(id);
        if (!payment)
            throw new NotFoundError('Không tìm thấy giao dịch thanh toán');
        const updatedData = { ...data };
        if (data.amount)
            updatedData.amount = new Prisma.Decimal(data.amount);
        if (data.paid_at)
            updatedData.paid_at = new Date(data.paid_at);
        return PaymentRepository.update(id, updatedData);
    }
    static async deletePayment(id) {
        const payment = await PaymentRepository.findById(id);
        if (!payment)
            throw new NotFoundError('Không tìm thấy giao dịch thanh toán');
        return PaymentRepository.delete(id);
    }
}
