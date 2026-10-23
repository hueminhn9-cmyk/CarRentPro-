import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { ReviewService } from '../services/review.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createReviewSchema } from '../validators/review.validator.js';

import { BadRequestError } from '../utils/errors.js';

export class ReviewController {
  static createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = createReviewSchema.parse(req.body);
      const content = validatedBody.content || validatedBody.comment || (req.body as any).comment || '';
      const review = await ReviewService.createReview({
        booking_id: BigInt(validatedBody.booking_id),
        customer_id: req.user!.id,
        rating: validatedBody.rating,
        content,
      });

      return ApiResponse.created(res, 'Gửi đánh giá xe thành công', serializeBigInt(review));
    } catch (error) {
      next(error);
    }
  };

  static updateReviewStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const { status } = req.body;
      if (!status || !['APPROVED', 'HIDDEN', 'PENDING'].includes(status)) {
        throw new BadRequestError('Trạng thái không hợp lệ. Cho phép: APPROVED, HIDDEN, PENDING');
      }
      const updated = await ReviewService.updateReviewStatus(id, status);
      return ApiResponse.success(res, 'Cập nhật trạng thái đánh giá thành công', serializeBigInt(updated));
    } catch (error) {
      next(error);
    }
  };

  static getReviewById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const review = await ReviewService.getReviewById(id);
      return ApiResponse.success(res, 'Lấy thông tin đánh giá thành công', serializeBigInt(review));
    } catch (error) {
      next(error);
    }
  };

  static getAllReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['content']);
      const { reviews, total } = await ReviewService.getAllReviews(prismaOptions);

      return ApiResponse.success(res, 'Lấy danh sách đánh giá thành công', {
        reviews: serializeBigInt(reviews),
        pagination: {
          total,
          ...pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      await ReviewService.deleteReview(id);
      return ApiResponse.success(res, 'Xóa đánh giá thành công');
    } catch (error) {
      next(error);
    }
  };

  static updateReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(req.params.id as string);
      const { rating, content } = req.body;
      const customerId = req.user!.id;

      const updated = await ReviewService.updateReview(id, customerId, {
        rating: rating ? Number(rating) : undefined,
        content,
      });

      return ApiResponse.success(res, 'Cập nhật đánh giá thành công', serializeBigInt(updated));
    } catch (error) {
      next(error);
    }
  };

  static getVehicleStats = async (req: any, res: Response, next: NextFunction) => {
    try {
      const vehicleId = BigInt(req.params.vehicleId as string);
      const stats = await ReviewService.getVehicleReviewStats(vehicleId);
      return ApiResponse.success(res, 'Lấy số liệu đánh giá xe thành công', serializeBigInt(stats));
    } catch (error) {
      next(error);
    }
  };
}
