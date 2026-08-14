export class MoMoStrategy {
    async processPayment(paymentId, amount, bookingCode) {
        const transactionCode = `MOMO_${Date.now()}`;
        // Simulate MoMo payment portal redirect url
        const mockPayUrl = `https://test-payment.momo.vn/v2/gateway/api/create?partnerCode=MOMO&partnerRefId=${bookingCode}&amount=${amount}&extraData=paymentId%3D${paymentId}&orderId=${transactionCode}&orderInfo=${encodeURIComponent(`AutoRent - Thanh toan booking ${bookingCode}`)}&redirectUrl=${encodeURIComponent(`http://localhost:5000/api/payments/momo-return?paymentId=${paymentId}`)}`;
        return {
            success: true,
            status: 'PENDING',
            paymentReference: transactionCode,
            payUrl: mockPayUrl,
            message: 'Đã tạo đường dẫn thanh toán MoMo thành công. Vui lòng chuyển hướng sang cổng thanh toán.',
        };
    }
    async refundPayment(paymentId, amount, paymentRef) {
        return {
            success: true,
            status: 'REFUNDED',
            message: `Đã hoàn trả giao dịch MoMo thành công. Mã tham chiếu: ${paymentRef}`,
        };
    }
}
