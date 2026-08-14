export class VNPayStrategy {
    async processPayment(paymentId, amount, bookingCode) {
        const transactionCode = `VNP_${Date.now()}`;
        // Simulate VNPay Sandbox payment gateway redirect URL
        const mockPayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${amount * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent(`Thanh toan don hang ${bookingCode}`)}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent(`http://localhost:5000/api/payments/vnpay-return?paymentId=${paymentId}`)}&vnp_TxnRef=${transactionCode}`;
        return {
            success: true,
            status: 'PENDING',
            paymentReference: transactionCode,
            payUrl: mockPayUrl,
            message: 'Đã tạo đường dẫn thanh toán VNPay thành công. Vui lòng chuyển hướng sang cổng thanh toán.',
        };
    }
    async refundPayment(paymentId, amount, paymentRef) {
        return {
            success: true,
            status: 'REFUNDED',
            message: `Đã hoàn trả giao dịch VNPay thành công. Mã tham chiếu: ${paymentRef}`,
        };
    }
}
