import { CashStrategy } from './cashStrategy.js';
import { BankTransferStrategy } from './bankTransferStrategy.js';
import { VNPayStrategy } from './vnpayStrategy.js';
import { MoMoStrategy } from './momoStrategy.js';
import { BadRequestError } from '../../utils/errors.js';
export class PaymentContext {
    strategy;
    constructor(method) {
        this.setStrategy(method);
    }
    setStrategy(method) {
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
    async executePayment(paymentId, amount, bookingCode) {
        return this.strategy.processPayment(paymentId, amount, bookingCode);
    }
    async executeRefund(paymentId, amount, paymentRef) {
        return this.strategy.refundPayment(paymentId, amount, paymentRef);
    }
}
