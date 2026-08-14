import { CustomerProfileRepository } from '../repositories/customer-profile.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

export class CustomerProfileService {
  static async getById(id: bigint) {
    const profile = await CustomerProfileRepository.findById(id);
    if (!profile) throw new NotFoundError('Không tìm thấy hồ sơ khách hàng');
    return profile;
  }

  static async getAll(options: any) {
    return CustomerProfileRepository.findAll(options);
  }

  static async create(data: any) {
    const existing = await CustomerProfileRepository.findByUserId(BigInt(data.user_id));
    if (existing) {
      throw new ConflictError('Người dùng này đã có hồ sơ khách hàng');
    }
    return CustomerProfileRepository.create(data);
  }

  static async update(id: bigint, data: any) {
    const profile = await CustomerProfileRepository.findById(id);
    if (!profile) throw new NotFoundError('Không tìm thấy hồ sơ khách hàng');
    return CustomerProfileRepository.update(id, data);
  }

  static async delete(id: bigint) {
    const profile = await CustomerProfileRepository.findById(id);
    if (!profile) throw new NotFoundError('Không tìm thấy hồ sơ khách hàng');
    return CustomerProfileRepository.delete(id);
  }
}
