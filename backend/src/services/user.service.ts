import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { AuditService } from './audit.service.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

export class UserService {
  static async getUserProfile(id: bigint) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    return user;
  }

  static async getAllUsers(options: any) {
    return UserRepository.findAll(options);
  }

  static async updateUser(id: bigint, data: any) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const updated = await UserRepository.update(id, data);

    await AuditService.log({
      userId: id,
      action: 'UPDATE_USER',
      entityName: 'users',
      entityId: id,
      newValues: data,
    });

    return updated;
  }

  static async updateCustomerProfile(userId: bigint, data: any) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const updated = await UserRepository.updateProfile(userId, data);

    await AuditService.log({
      userId: userId,
      action: 'UPDATE_CUSTOMER_PROFILE',
      entityName: 'customer_profiles',
      entityId: userId,
      newValues: data,
    });

    return updated;
  }

  static async verifyCustomer(userId: bigint, status: 'PENDING' | 'VERIFIED' | 'REJECTED') {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const updated = await UserRepository.updateProfile(userId, {
      verification_status: status,
    });

    await AuditService.log({
      userId: userId,
      action: 'VERIFY_CUSTOMER',
      entityName: 'customer_profiles',
      entityId: userId,
      newValues: { verification_status: status },
    });

    return updated;
  }

  static async deleteUser(id: bigint) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const deleted = await UserRepository.delete(id);

    await AuditService.log({
      userId: id,
      action: 'DELETE_USER',
      entityName: 'users',
      entityId: id,
      newValues: { status: 'INACTIVE' },
    });

    return deleted;
  }

  static async createUser(data: any) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Email đã được sử dụng');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserRepository.create({
      email: data.email,
      password_hash: hashedPassword,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role || 'CUSTOMER',
      status: data.status || 'ACTIVE',
      customer_profiles: data.role !== 'ADMIN' ? {
        create: {
          verification_status: 'PENDING',
        }
      } : undefined,
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_USER',
      entityName: 'users',
      entityId: user.id,
      newValues: { email: data.email, role: data.role },
    });

    return user;
  }
}
