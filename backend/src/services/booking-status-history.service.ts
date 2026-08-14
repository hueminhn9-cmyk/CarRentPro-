import { BookingStatusHistoryRepository } from '../repositories/booking-status-history.repository.js';
import { NotFoundError } from '../utils/errors.js';

export class BookingStatusHistoryService {
  static async getById(id: bigint) {
    const history = await BookingStatusHistoryRepository.findById(id);
    if (!history) throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');
    return history;
  }

  static async getAll(options: any) {
    return BookingStatusHistoryRepository.findAll(options);
  }

  static async create(data: any, changedBy: bigint) {
    return BookingStatusHistoryRepository.create({
      ...data,
      changed_by: data.changed_by ? BigInt(data.changed_by) : changedBy,
    });
  }

  static async update(id: bigint, data: any) {
    const history = await BookingStatusHistoryRepository.findById(id);
    if (!history) throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');

    const updatedData = { ...data };
    if (data.changed_by) updatedData.changed_by = BigInt(data.changed_by);
    if (data.booking_id) updatedData.booking_id = BigInt(data.booking_id);

    return BookingStatusHistoryRepository.update(id, updatedData);
  }

  static async delete(id: bigint) {
    const history = await BookingStatusHistoryRepository.findById(id);
    if (!history) throw new NotFoundError('Không tìm thấy lịch sử thay đổi trạng thái');
    return BookingStatusHistoryRepository.delete(id);
  }
}
