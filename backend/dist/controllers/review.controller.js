import { ReviewService } from '../services/review.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createReviewSchema } from '../validators/review.validator.js';
import { BadRequestError } from '../utils/errors.js';
export class ReviewController {
    static createReview = async (req, res, next) => {
        try {
            const validatedBody = createReviewSchema.parse(req.body);
            const content = validatedBody.content || validatedBody.comment || req.body.comment || '';
            const review = await ReviewService.createReview({
                booking_id: BigInt(validatedBody.booking_id),
                customer_id: req.user.id,
                rating: validatedBody.rating,
                content,
            });
            return ApiResponse.created(res, 'Gửi đánh giá xe thành công', serializeBigInt(review));
        }
        catch (error) {
            next(error);
        }
    };
    static updateReviewStatus = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const { status } = req.body;
            if (!status || !['APPROVED', 'HIDDEN', 'PENDING'].includes(status)) {
                throw new BadRequestError('Trạng thái không hợp lệ. Cho phép: APPROVED, HIDDEN, PENDING');
            }
            const updated = await ReviewService.updateReviewStatus(id, status);
            return ApiResponse.success(res, 'Cập nhật trạng thái đánh giá thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static getReviewById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const review = await ReviewService.getReviewById(id);
            return ApiResponse.success(res, 'Lấy thông tin đánh giá thành công', serializeBigInt(review));
        }
        catch (error) {
            next(error);
        }
    };
    static getAllReviews = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    static deleteReview = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await ReviewService.deleteReview(id);
            return ApiResponse.success(res, 'Xóa đánh giá thành công');
        }
        catch (error) {
            next(error);
        }
    };
    static updateReview = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const { rating, content } = req.body;
            const customerId = req.user.id;
            const updated = await ReviewService.updateReview(id, customerId, {
                rating: rating ? Number(rating) : undefined,
                content,
            });
            return ApiResponse.success(res, 'Cập nhật đánh giá thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static getVehicleStats = async (req, res, next) => {
        try {
            const vehicleId = BigInt(req.params.vehicleId);
            const stats = await ReviewService.getVehicleReviewStats(vehicleId);
            return ApiResponse.success(res, 'Lấy số liệu đánh giá xe thành công', serializeBigInt(stats));
        }
        catch (error) {
            next(error);
        }
    };
}
