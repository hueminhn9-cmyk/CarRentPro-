export class BankTransferStrategy {
    async processPayment(paymentId, amount, bookingCode) {
        const bankAccount = '1234567890';
        const bankName = 'Vietcombank';
        const accountName = 'CONG TY AUTORENT VIETNAM';
        // We generate payment reference matching the booking code
        const transferContent = `AUTORENT ${bookingCode}`;
        const qrUrl = `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;
        return {
            success: true,
            status: 'PENDING',
            paymentReference: transferContent,
            payUrl: qrUrl, // We can return the QR code URL so the client can scan it immediately
            message: `Vui lòng chuyển khoản ngân hàng số tiền ${amount.toLocaleString('vi-VN')} VND.`,
        };
    }
    async refundPayment(paymentId, amount, paymentRef) {
        return {
            success: true,
            status: 'REFUNDED',
            message: `Đã thực hiện yêu cầu hoàn tiền chuyển khoản ngân hàng cho giao dịch: ${paymentRef}`,
        };
    }
}
