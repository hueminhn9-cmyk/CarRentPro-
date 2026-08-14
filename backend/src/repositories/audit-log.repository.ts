import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class AuditLogRepository {
  static async findById(id: bigint) {
    return prisma.audit_logs.findUnique({
      where: { id },
      include: { users: { select: { id: true, full_name: true, email: true } } },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        ...options,
        include: { users: { select: { id: true, full_name: true, email: true } } },
      }),
      prisma.audit_logs.count({ where: options.where }),
    ]);
    return { logs, total };
  }

  static async create(data: Prisma.audit_logsUncheckedCreateInput) {
    return prisma.audit_logs.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.audit_logsUncheckedUpdateInput) {
    return prisma.audit_logs.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.audit_logs.delete({
      where: { id },
    });
  }
}
