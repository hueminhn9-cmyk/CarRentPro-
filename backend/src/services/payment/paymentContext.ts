import { PaymentStrategy, PaymentResponse } from './paymentStrategy.js';
import { CashStrategy } from './cashStrategy.js';
import { BankTransferStrategy } from './bankTransferStrategy.js';
import { VNPayStrategy } from './vnpayStrategy.js';
import { MoMoStrategy } from './momoStrategy.js';
import { payments_payment_method } from '@prisma/client';
import { BadRequestError } from '../../utils/errors.js';

export class PaymentContext {
  private strategy!: PaymentStrategy;

  constructor(method: payments_payment_method) {
    this.setStrategy(method);
  }

  private setStrategy(method: payments_payment_method) {
    switch (method) {
      case 'CASH':
        this.strategy = new CashStrategy();
        break;
      case 'BANK_TRANSFER':
      case 'CREDIT_CARD': // Use BankTransfer for credit card simulation
        this.strategy = new BankTransferStrategy();
        break;
      case 'VNPAY':
        this.strategy = new VNPayStrategy();
        break;
      case 'MOMO':
        this.strategy = new MoMoStrategy();
        break;
      default:
        throw new BadRequestError('Phương thức thanh toán không được hỗ trợ');
    }
  }

  async executePayment(paymentId: bigint, amount: number, bookingCode: string): Promise<PaymentResponse> {
    return this.strategy.processPayment(paymentId, amount, bookingCode);
  }

  async executeRefund(paymentId: bigint, amount: number, paymentRef: string): Promise<PaymentResponse> {
    return this.strategy.refundPayment(paymentId, amount, paymentRef);
  }
}
