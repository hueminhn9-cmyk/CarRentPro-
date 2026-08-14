import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import { NotFoundError } from '../utils/errors.js';
export class AuditLogService {
    static async getById(id) {
        const log = await AuditLogRepository.findById(id);
        if (!log)
            throw new NotFoundError('Không tìm thấy nhật ký hệ thống');
        return log;
    }
    static async getAll(options) {
        return AuditLogRepository.findAll(options);
    }
    static async create(data) {
        return AuditLogRepository.create(data);
    }
    static async update(id, data) {
        const log = await AuditLogRepository.findById(id);
        if (!log)
            throw new NotFoundError('Không tìm thấy nhật ký hệ thống');
        return AuditLogRepository.update(id, data);
    }
    static async delete(id) {
        const log = await AuditLogRepository.findById(id);
        if (!log)
            throw new NotFoundError('Không tìm thấy nhật ký hệ thống');
        return AuditLogRepository.delete(id);
    }
}
