import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class CustomerProfileRepository {
  static async findById(id: bigint) {
    return prisma.customer_profiles.findUnique({
      where: { id },
      include: { users: { select: { id: true, full_name: true, email: true } } },
    });
  }

  static async findByUserId(userId: bigint) {
    return prisma.customer_profiles.findUnique({
      where: { user_id: userId },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [profiles, total] = await Promise.all([
      prisma.customer_profiles.findMany({
        ...options,
        include: { users: { select: { id: true, full_name: true, email: true } } },
      }),
      prisma.customer_profiles.count({ where: options.where }),
    ]);
    return { profiles, total };
  }

  static async create(data: Prisma.customer_profilesUncheckedCreateInput) {
    return prisma.customer_profiles.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.customer_profilesUncheckedUpdateInput) {
    return prisma.customer_profiles.update({
      where: { id },
      data,
    });
  }

  static async delete(id: bigint) {
    return prisma.customer_profiles.delete({
      where: { id },
    });
  }
}
