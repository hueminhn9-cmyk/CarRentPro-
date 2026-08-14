import { prisma } from '../config/prisma.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class MaintenanceService {
  static async getAll() {
    const records = await prisma.maintenance_records.findMany({
      include: {
        vehicles: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Format output to match frontend expected fields
    return records.map((record) => ({
      id: record.id.toString(),
      vehicleId: record.vehicle_id.toString(),
      vehicleName: record.vehicles?.name || 'N/A',
      licensePlate: record.vehicles?.license_plate || 'N/A',
      description: record.description || '',
      cost: record.cost ? Number(record.cost) : 0,
      startDate: record.scheduled_date ? record.scheduled_date.toISOString().split('T')[0] : '',
      endDate: record.completed_date ? record.completed_date.toISOString().split('T')[0] : (record.next_service_date ? record.next_service_date.toISOString().split('T')[0] : ''),
      status: record.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang bảo dưỡng',
    }));
  }

  static async getById(id: string) {
    const recordId = BigInt(id);
    const record = await prisma.maintenance_records.findUnique({
      where: { id: recordId },
      include: {
        vehicles: true,
      },
    });

    if (!record) {
      throw new NotFoundError('Không tìm thấy bản ghi bảo dưỡng');
    }

    return {
      id: record.id.toString(),
      vehicleId: record.vehicle_id.toString(),
      vehicleName: record.vehicles?.name || 'N/A',
      licensePlate: record.vehicles?.license_plate || 'N/A',
      description: record.description || '',
      cost: record.cost ? Number(record.cost) : 0,
      startDate: record.scheduled_date ? record.scheduled_date.toISOString().split('T')[0] : '',
      endDate: record.completed_date ? record.completed_date.toISOString().split('T')[0] : (record.next_service_date ? record.next_service_date.toISOString().split('T')[0] : ''),
      status: record.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang bảo dưỡng',
    };
  }

  static async schedule(data: {
    vehicleId: string;
    description: string;
    cost: number;
    startDate: string;
    endDate: string;
    userId: bigint;
  }) {
    const vehicleId = BigInt(data.vehicleId);

    const vehicle = await prisma.vehicles.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundError('Không tìm thấy phương tiện yêu cầu');
    }

    if (vehicle.status === 'MAINTENANCE') {
      throw new BadRequestError('Phương tiện hiện tại đang ở trạng thái bảo dưỡng');
    }

    // Start a transaction: create record and update vehicle status
    return await prisma.$transaction(async (tx) => {
      const record = await tx.maintenance_records.create({
        data: {
          vehicle_id: vehicleId,
          maintenance_type: 'Bảo dưỡng định kỳ',
          scheduled_date: new Date(data.startDate),
          next_service_date: new Date(data.endDate),
          cost: data.cost,
          description: data.description,
          status: 'IN_PROGRESS',
          created_by: data.userId,
        },
      });

      await tx.vehicles.update({
        where: { id: vehicleId },
        data: { status: 'MAINTENANCE' },
      });

      return record;
    });
  }

  static async complete(id: string) {
    const recordId = BigInt(id);

    const record = await prisma.maintenance_records.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundError('Không tìm thấy bản ghi bảo dưỡng');
    }

    if (record.status === 'COMPLETED') {
      throw new BadRequestError('Bản ghi bảo dưỡng này đã được hoàn thành trước đó');
    }

    // Start a transaction: update record and vehicle status
    return await prisma.$transaction(async (tx) => {
      const updatedRecord = await tx.maintenance_records.update({
        where: { id: recordId },
        data: {
          status: 'COMPLETED',
          completed_date: new Date(),
        },
      });

      await tx.vehicles.update({
        where: { id: record.vehicle_id },
        data: { status: 'AVAILABLE' },
      });

      return updatedRecord;
    });
  }

  static async update(id: string, data: {
    maintenance_type?: string;
    scheduled_date?: string;
    next_service_date?: string;
    cost?: number;
    description?: string;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  }) {
    const recordId = BigInt(id);
    const record = await prisma.maintenance_records.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundError('Không tìm thấy bản ghi bảo dưỡng');
    }

    const updateData: any = { ...data };
    if (data.scheduled_date) updateData.scheduled_date = new Date(data.scheduled_date);
    if (data.next_service_date) updateData.next_service_date = new Date(data.next_service_date);

    return await prisma.$transaction(async (tx) => {
      const updatedRecord = await tx.maintenance_records.update({
        where: { id: recordId },
        data: updateData,
      });

      if (data.status === 'COMPLETED') {
        await tx.vehicles.update({
          where: { id: record.vehicle_id },
          data: { status: 'AVAILABLE' },
        });
      } else if (data.status === 'IN_PROGRESS') {
        await tx.vehicles.update({
          where: { id: record.vehicle_id },
          data: { status: 'MAINTENANCE' },
        });
      }

      return updatedRecord;
    });
  }

  static async delete(id: string) {
    const recordId = BigInt(id);
    const record = await prisma.maintenance_records.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundError('Không tìm thấy bản ghi bảo dưỡng');
    }

    return await prisma.$transaction(async (tx) => {
      if (record.status === 'IN_PROGRESS') {
        await tx.vehicles.update({
          where: { id: record.vehicle_id },
          data: { status: 'AVAILABLE' },
        });
      }

      return tx.maintenance_records.delete({
        where: { id: recordId },
      });
    });
  }
}
