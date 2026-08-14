import { prisma } from '../config/prisma.js';
export class AuditLogRepository {
    static async findById(id) {
        return prisma.audit_logs.findUnique({
            where: { id },
            include: { users: { select: { id: true, full_name: true, email: true } } },
        });
    }
    static async findAll(options) {
        const [logs, total] = await Promise.all([
            prisma.audit_logs.findMany({
                ...options,
                include: { users: { select: { id: true, full_name: true, email: true } } },
            }),
            prisma.audit_logs.count({ where: options.where }),
        ]);
        return { logs, total };
    }
    static async create(data) {
        return prisma.audit_logs.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.audit_logs.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return prisma.audit_logs.delete({
            where: { id },
        });
    }
}
