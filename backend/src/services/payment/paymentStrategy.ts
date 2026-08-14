export interface PaymentResponse {
  success: boolean;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentReference?: string;
  payUrl?: string; // Redirect URL for dynamic Gateways like VNPay, MoMo
  message: string;
}

export interface PaymentStrategy {
  processPayment(paymentId: bigint, amount: number, bookingCode: string): Promise<PaymentResponse>;
  refundPayment(paymentId: bigint, amount: number, paymentRef: string): Promise<PaymentResponse>;
}
