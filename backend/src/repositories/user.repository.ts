import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export class UserRepository {
  static async findById(id: bigint) {
    return prisma.users.findUnique({
      where: { id },
      include: {
        customer_profiles: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  static async findAll(options: { skip?: number; take?: number; orderBy?: any; where?: any }) {
    const [users, total] = await Promise.all([
      prisma.users.findMany({
        ...options,
        include: {
          customer_profiles: true,
        },
      }),
      prisma.users.count({ where: options.where }),
    ]);

    return { users, total };
  }

  static async create(data: Prisma.usersCreateInput) {
    return prisma.users.create({
      data,
    });
  }

  static async update(id: bigint, data: Prisma.usersUpdateInput) {
    return prisma.users.update({
      where: { id },
      data,
      include: {
        customer_profiles: true,
      },
    });
  }

  static async updateProfile(userId: bigint, data: Prisma.customer_profilesUpdateInput) {
    return prisma.customer_profiles.update({
      where: { user_id: userId },
      data,
    });
  }

  static async delete(id: bigint) {
    // We can do a soft delete by changing user status to INACTIVE/BLOCKED
    return prisma.users.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}
