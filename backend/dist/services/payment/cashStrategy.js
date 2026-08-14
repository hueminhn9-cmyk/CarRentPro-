export class CashStrategy {
    async processPayment(paymentId, amount, bookingCode) {
        // Cash payment processed in person. Needs admin confirmation but initially can be PENDING.
        return {
            success: true,
            status: 'PENDING',
            message: 'Thanh toán tiền mặt được khởi tạo thành công. Vui lòng giao dịch trực tiếp với nhân viên.',
        };
    }
    async refundPayment(paymentId, amount, paymentRef) {
        return {
            success: true,
            status: 'REFUNDED',
            message: 'Đã hoàn trả tiền mặt thành công.',
        };
    }
}
