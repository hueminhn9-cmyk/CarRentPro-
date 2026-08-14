import { BookingStatusHistoryRepository } from '../repositories/booking-status-history.repository.js';
import { NotFoundError } from '../utils/errors.js';
export class BookingStatusHistoryService {
    static async getById(id) {
        const history = await BookingStatusHistoryRepository.findById(id);
        if (!history)
            throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');
        return history;
    }
    static async getAll(options) {
        return BookingStatusHistoryRepository.findAll(options);
    }
    static async create(data, changedBy) {
        return BookingStatusHistoryRepository.create({
            ...data,
            changed_by: data.changed_by ? BigInt(data.changed_by) : changedBy,
        });
    }
    static async update(id, data) {
        const history = await BookingStatusHistoryRepository.findById(id);
        if (!history)
            throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');
        const updatedData = { ...data };
        if (data.changed_by)
            updatedData.changed_by = BigInt(data.changed_by);
        if (data.booking_id)
            updatedData.booking_id = BigInt(data.booking_id);
        return BookingStatusHistoryRepository.update(id, updatedData);
    }
    static async delete(id) {
        const history = await BookingStatusHistoryRepository.findById(id);
        if (!history)
            throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');
        return BookingStatusHistoryRepository.delete(id);
    }
}
