import { PaymentStrategy, PaymentResponse } from './paymentStrategy.js';

export class CashStrategy implements PaymentStrategy {
  async processPayment(paymentId: bigint, amount: number, bookingCode: string): Promise<PaymentResponse> {
    // Cash payment processed in person. Needs admin confirmation but initially can be PENDING.
    return {
      success: true,
      status: 'PENDING',
      message: 'Thanh toán tiền mặt được khởi tạo thành công. Vui lòng giao dịch trực tiếp với nhân viên.',
    };
  }

  async refundPayment(paymentId: bigint, amount: number, paymentRef: string): Promise<PaymentResponse> {
    return {
      success: true,
      status: 'REFUNDED',
      message: 'Đã hoàn trả tiền mặt thành công.',
    };
  }
}
