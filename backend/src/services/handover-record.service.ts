import { HandoverRecordRepository } from '../repositories/handover-record.repository.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { BookingRepository } from '../repositories/booking.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { Prisma } from '@prisma/client';

export class HandoverRecordService {
  static async getById(id: bigint) {
    const record = await HandoverRecordRepository.findById(id);
    if (!record) throw new NotFoundError('Không tìm thấy biên bản bàn giao');
    return record;
  }

  static async getAll(options: any) {
    return HandoverRecordRepository.findAll(options);
  }

  static async create(data: any, recordedBy: bigint) {
    const bookingId = BigInt(data.booking_id);
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Không tìm thấy đơn đặt xe');
    }

    const lateFee = Number(data.late_fee || 0);
    const extraKmFee = Number(data.extra_km_fee || 0);
    const fuelFee = Number(data.fuel_fee || 0);
    const cleaning_fee = Number(data.cleaning_fee || 0);
    const damageFee = Number(data.damage_fee || 0);
    const totalSurcharge = lateFee + extraKmFee + fuelFee + cleaning_fee + damageFee;

    const recordInput: Prisma.handover_recordsUncheckedCreateInput = {
      ...data,
      booking_id: bookingId,
      recorded_by: data.recorded_by ? BigInt(data.recorded_by) : recordedBy,
      late_fee: new Prisma.Decimal(lateFee),
      extra_km_fee: new Prisma.Decimal(extraKmFee),
      fuel_fee: new Prisma.Decimal(fuelFee),
      cleaning_fee: new Prisma.Decimal(cleaning_fee),
      damage_fee: new Prisma.Decimal(damageFee),
      total_surcharge: new Prisma.Decimal(totalSurcharge),
      refundable_deposit: new Prisma.Decimal(data.refundable_deposit || 0),
    };

    const record = await HandoverRecordRepository.create(recordInput);

    // Update vehicle mileage
    await VehicleRepository.update(booking.vehicle_id, { current_mileage: data.mileage });

    // Automatically transition booking status based on handover type
    if (data.record_type === 'PICKUP') {
      await BookingRepository.update(bookingId, { status: 'ACTIVE' });
      await BookingRepository.addStatusHistory(bookingId, 'ACTIVE', recordedBy, 'Giao xe (PICKUP) hoàn tất');
    } else {
      const newSurcharge = Number(booking.surcharge_amount || 0) + totalSurcharge;
      const newTotal = Number(booking.total_amount) + totalSurcharge;

      await BookingRepository.update(bookingId, {
        surcharge_amount: new Prisma.Decimal(newSurcharge),
        total_amount: new Prisma.Decimal(newTotal),
        status: 'COMPLETED',
      });
      await BookingRepository.addStatusHistory(bookingId, 'COMPLETED', recordedBy, 'Nhận xe (RETURN) hoàn tất');
    }

    return record;
  }

  static async update(id: bigint, data: any) {
    const record = await HandoverRecordRepository.findById(id);
    if (!record) throw new NotFoundError('Không tìm thấy biên bản bàn giao');

    const updatedData: any = { ...data };
    if (data.recorded_by) updatedData.recorded_by = BigInt(data.recorded_by);
    if (data.booking_id) updatedData.booking_id = BigInt(data.booking_id);

    const lateFee = data.late_fee !== undefined ? Number(data.late_fee) : Number(record.late_fee);
    const extraKmFee = data.extra_km_fee !== undefined ? Number(data.extra_km_fee) : Number(record.extra_km_fee);
    const fuelFee = data.fuel_fee !== undefined ? Number(data.fuel_fee) : Number(record.fuel_fee);
    const cleaning_fee = data.cleaning_fee !== undefined ? Number(data.cleaning_fee) : Number(record.cleaning_fee);
    const damageFee = data.damage_fee !== undefined ? Number(data.damage_fee) : Number(record.damage_fee);
    const totalSurcharge = lateFee + extraKmFee + fuelFee + cleaning_fee + damageFee;

    updatedData.late_fee = new Prisma.Decimal(lateFee);
    updatedData.extra_km_fee = new Prisma.Decimal(extraKmFee);
    updatedData.fuel_fee = new Prisma.Decimal(fuelFee);
    updatedData.cleaning_fee = new Prisma.Decimal(cleaning_fee);
    updatedData.damage_fee = new Prisma.Decimal(damageFee);
    updatedData.total_surcharge = new Prisma.Decimal(totalSurcharge);

    if (data.refundable_deposit !== undefined) {
      updatedData.refundable_deposit = new Prisma.Decimal(data.refundable_deposit);
    }

    return HandoverRecordRepository.update(id, updatedData);
  }

  static async delete(id: bigint) {
    const record = await HandoverRecordRepository.findById(id);
    if (!record) throw new NotFoundError('Không tìm thấy biên bản bàn giao');
    return HandoverRecordRepository.delete(id);
  }
}
