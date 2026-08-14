import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { PaymentService } from '../services/payment.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createPaymentSchema } from '../validators/payment.validator.js';

export class PaymentController {
  static createPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createPaymentSchema.parse(req.body);
      const result = await PaymentService.createPayment({
        booking_id: BigInt(validatedBody.booking_id),
        customer_id: req.user!.id,
        transaction_type: validatedBody.transaction_type,
        amount: validatedBody.amount,
        payment_method: validatedBody.payment_method,
        payment_reference: validatedBody.payment_reference,
      });

      return ApiResponse.created(res, 'Khởi tạo thanh toán thành công', serializeBigInt(result));
    } catch (error) {
      next(error);
    }
  };

  static getPaymentById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const payment = await PaymentService.getPaymentById(id);

      if (req.user!.role === 'CUSTOMER' && payment.customer_id !== req.user!.id) {
        return ApiResponse.error(res, 'Bạn không có quyền truy cập giao dịch này', 403);
      }

      return ApiResponse.success(res, 'Lấy chi tiết thanh toán thành công', serializeBigInt(payment));
    } catch (error) {
      next(error);
    }
  };

  static getAllPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['transaction_code', 'payment_reference']);

      if (req.user!.role === 'CUSTOMER') {
        prismaOptions.where = {
          ...prismaOptions.where,
          customer_id: req.user!.id,
        };
      }

      const { payments, total } = await PaymentService.getAllPayments(prismaOptions);

      return ApiResponse.success(res, 'Lấy danh sách giao dịch thành công', {
        payments: serializeBigInt(payments),
        pagination: {
          total,
          ...pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static confirmPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const { reference } = req.body;
      const payment = await PaymentService.confirmPayment(id, reference);

      return ApiResponse.success(res, 'Xác nhận thanh toán thành công', serializeBigInt(payment));
    } catch (error) {
      next(error);
    }
  };

  static callbackVNPay = async (req: any, res: Response, next: NextFunction) => {
    try {
      const paymentId = BigInt(req.query.paymentId as string);
      const responseCode = req.query.vnp_ResponseCode;
      const transactionNo = req.query.vnp_TransactionNo;

      if (responseCode === '00') {
        await PaymentService.confirmPayment(paymentId, `VNP_${transactionNo}`);
      }

      // Redirect to frontend (dashboard or booking list)
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/profile?payment=success`);
    } catch (error) {
      next(error);
    }
  };

  static callbackMoMo = async (req: any, res: Response, next: NextFunction) => {
    try {
      const paymentId = BigInt(req.query.paymentId as string);
      const resultCode = req.query.resultCode;
      const transId = req.query.transId;

      if (resultCode === '0') {
        await PaymentService.confirmPayment(paymentId, `MOMO_${transId}`);
      }

      // Redirect to frontend
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/profile?payment=success`);
    } catch (error) {
      next(error);
    }
  };

  static refundPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const payment = await PaymentService.refundPayment(id);
      return ApiResponse.success(res, 'Hoàn tiền giao dịch thành công', serializeBigInt(payment));
    } catch (error) {
      next(error);
    }
  };

  static updatePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const payment = await PaymentService.updatePayment(id, req.body);
      return ApiResponse.success(res, 'Cập nhật giao dịch thành công', serializeBigInt(payment));
    } catch (error) {
      next(error);
    }
  };

  static deletePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await PaymentService.deletePayment(id);
      return ApiResponse.success(res, 'Xóa giao dịch thành công');
    } catch (error) {
      next(error);
    }
  };
}
