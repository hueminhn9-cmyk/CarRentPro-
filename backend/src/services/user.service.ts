import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { AuditService } from './audit.service.js';
import { NotificationService } from './notification.service.js';
import { prisma } from '../config/prisma.js';
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

  static async verifyCustomer(userId: bigint, status: 'PENDING' | 'VERIFIED' | 'REJECTED', reason?: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }
    const updated = await UserRepository.updateProfile(userId, {
      verification_status: status,
    });

    const title = status === 'VERIFIED' ? 'Xác thực GPLX & Danh tính thành công' : 'Yêu cầu cập nhật lại hồ sơ GPLX';
    const content = status === 'VERIFIED'
      ? 'Hồ sơ bằng lái xe và danh tính của bạn đã được phê duyệt thành công. Bạn đã đủ điều kiện nhận bàn giao xe.'
      : `Hồ sơ bằng lái xe của bạn chưa được thông qua. Lý do: ${reason || 'Thông tin chưa rõ nét hoặc không hợp lệ'}. Vui lòng tải lại ảnh mới.`;

    try {
      await NotificationService.createNotification(userId, title, content, 'SYSTEM');
    } catch (e) {
      console.error('Failed to send verification notification', e);
    }

    await AuditService.log({
      userId: userId,
      action: 'VERIFY_CUSTOMER',
      entityName: 'customer_profiles',
      entityId: userId,
      newValues: { verification_status: status, reason },
    });

    return updated;
  }

  static async uploadDocument(
    userId: bigint,
    file: Express.Multer.File,
    category: any,
    details?: { citizen_id?: string; driver_license_number?: string; driver_license_expiry?: string }
  ) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError('Không tìm thấy người dùng');

    let profile = user.customer_profiles;
    if (!profile) {
      profile = await prisma.customer_profiles.create({
        data: {
          user_id: userId,
          verification_status: 'PENDING',
        },
      });
    }

    const profileId = profile.id;
    const relativePath = `uploads/${file.filename}`;

    const existingMedia = await prisma.media_files.findFirst({
      where: {
        entity_type: 'CUSTOMER_PROFILE',
        entity_id: profileId,
        category: category,
      },
    });

    if (existingMedia) {
      await prisma.media_files.update({
        where: { id: existingMedia.id },
        data: {
          original_name: file.originalname,
          stored_name: file.filename,
          mime_type: file.mimetype,
          file_size: file.size,
          file_path: relativePath,
        },
      });
    } else {
      await prisma.media_files.create({
        data: {
          entity_type: 'CUSTOMER_PROFILE',
          entity_id: profileId,
          category: category,
          original_name: file.originalname,
          stored_name: file.filename,
          mime_type: file.mimetype,
          file_size: file.size,
          file_path: relativePath,
          uploaded_by: userId,
        },
      });
    }

    const profileUpdate: any = { verification_status: 'PENDING' };
    if (details?.citizen_id) profileUpdate.citizen_id = details.citizen_id;
    if (details?.driver_license_number) profileUpdate.driver_license_number = details.driver_license_number;
    if (details?.driver_license_expiry) profileUpdate.driver_license_expiry = new Date(details.driver_license_expiry);

    await prisma.customer_profiles.update({
      where: { id: profileId },
      data: profileUpdate,
    });

    return UserRepository.findById(userId);
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
