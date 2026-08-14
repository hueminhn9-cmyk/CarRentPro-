import { ReviewRepository } from '../repositories/review.repository.js';
import { BookingRepository } from '../repositories/booking.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
export class ReviewService {
    static async createReview(data) {
        // 1. Verify booking
        const booking = await BookingRepository.findById(data.booking_id);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        // 2. Validate customer owns booking
        if (booking.customer_id !== data.customer_id) {
            throw new BadRequestError('Bạn không thể đánh giá đơn đặt xe của người khác');
        }
        // 3. Validate booking is COMPLETED
        if (booking.status !== 'COMPLETED') {
            throw new BadRequestError('Bạn chỉ có thể đánh giá xe sau khi hoàn thành chuyến đi');
        }
        // 4. Check if already reviewed
        const existingReview = await ReviewRepository.findByBookingId(data.booking_id);
        if (existingReview) {
            throw new BadRequestError('Đơn đặt xe này đã được đánh giá trước đó');
        }
        return ReviewRepository.create({
            booking_id: data.booking_id,
            customer_id: data.customer_id,
            vehicle_id: booking.vehicle_id,
            rating: data.rating,
            content: data.content || null,
        });
    }
    static async getReviewById(id) {
        const review = await ReviewRepository.findById(id);
        if (!review) {
            throw new NotFoundError('Không tìm thấy đánh giá');
        }
        return review;
    }
    static async getAllReviews(options) {
        return ReviewRepository.findAll(options);
    }
    static async deleteReview(id) {
        const review = await ReviewRepository.findById(id);
        if (!review) {
            throw new NotFoundError('Không tìm thấy đánh giá');
        }
        return ReviewRepository.delete(id);
    }
    static async updateReview(id, customerId, data) {
        const review = await ReviewRepository.findById(id);
        if (!review) {
            throw new NotFoundError('Không tìm thấy đánh giá');
        }
        if (review.customer_id !== customerId) {
            throw new BadRequestError('Bạn không thể chỉnh sửa đánh giá của người khác');
        }
        return ReviewRepository.update(id, data);
    }
    static async getVehicleReviewStats(vehicleId) {
        return ReviewRepository.getStatsByVehicleId(vehicleId);
    }
}
