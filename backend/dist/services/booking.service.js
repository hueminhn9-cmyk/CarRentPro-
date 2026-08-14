import { BookingRepository } from '../repositories/booking.repository.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { NotificationRepository } from '../repositories/notification.repository.js';
import { ContractRepository } from '../repositories/contract.repository.js';
import { AuditService } from './audit.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { logBooking } from '../utils/logger.js';
import { Prisma } from '@prisma/client';
export class BookingService {
    static async createBooking(data) {
        // 1. Fetch vehicle
        const vehicle = await VehicleRepository.findById(data.vehicle_id);
        if (!vehicle) {
            throw new NotFoundError('Không tìm thấy xe');
        }
        if (['INACTIVE', 'MAINTENANCE', 'INCIDENT'].includes(vehicle.status || '')) {
            throw new BadRequestError(`Xe hiện tại ở trạng thái ${vehicle.status} và không thể cho thuê.`);
        }
        // Check overlapping bookings for requested dates
        const isAvailable = await BookingRepository.isVehicleAvailable(data.vehicle_id, data.pickup_datetime, data.return_datetime);
        if (!isAvailable) {
            throw new BadRequestError('Xe đã được đặt lịch bởi khách hàng khác trong khoảng thời gian này.');
        }
        // 2. Calculate rental days
        const diffTime = Math.abs(data.return_datetime.getTime() - data.pickup_datetime.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const rentalDays = diffDays <= 0 ? 1 : diffDays;
        // 3. Calculate fees
        const pricePerDay = Number(vehicle.price_per_day);
        const depositAmount = Number(vehicle.deposit_amount);
        const rentalFee = pricePerDay * rentalDays;
        let serviceFee = 0;
        const services = data.services || [];
        services.forEach((srv) => {
            serviceFee += srv.quantity * srv.unit_price;
        });
        const totalAmount = rentalFee + serviceFee;
        // 4. Generate unique booking code
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randPart = Math.floor(100 + Math.random() * 900); // 3 random digits
        const bookingCode = `AR-${datePart}-${randPart}`;
        // 5. Create in database using repository
        const bookingInput = {
            booking_code: bookingCode,
            customer_id: data.customer_id,
            vehicle_id: data.vehicle_id,
            pickup_datetime: data.pickup_datetime,
            return_datetime: data.return_datetime,
            pickup_location: data.pickup_location,
            return_location: data.return_location,
            rental_days: rentalDays,
            rental_fee: new Prisma.Decimal(rentalFee),
            service_fee: new Prisma.Decimal(serviceFee),
            deposit_amount: new Prisma.Decimal(depositAmount),
            total_amount: new Prisma.Decimal(totalAmount),
            status: 'PENDING',
            payment_status: 'UNPAID',
            customer_note: data.customer_note || null,
        };
        const newBooking = await BookingRepository.create(bookingInput, services);
        // 6. Create default contract (draft)
        const contractCode = `HD-${bookingCode}`;
        await ContractRepository.create({
            booking_id: newBooking.id,
            contract_code: contractCode,
            status: 'PENDING_SIGN',
        });
        // 7. Dispatch notification
        await NotificationRepository.create({
            user_id: data.customer_id,
            title: 'Đặt xe thành công',
            content: `Yêu cầu đặt xe ${vehicle.name} (${bookingCode}) đang chờ duyệt.`,
            type: 'BOOKING',
        });
        // Audit Log
        await AuditService.log({
            userId: data.customer_id,
            action: 'CREATE_BOOKING',
            entityName: 'bookings',
            entityId: newBooking.id,
            newValues: {
                booking_code: bookingCode,
                vehicle_id: data.vehicle_id.toString(),
                total_amount: totalAmount,
            },
        });
        logBooking(newBooking.id.toString(), 'PENDING', `Khởi tạo đơn đặt xe bởi khách hàng ID ${data.customer_id}`);
        return BookingRepository.findById(newBooking.id);
    }
    static async getBookingById(id) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        return booking;
    }
    static async getBookingByCode(bookingCode) {
        const booking = await BookingRepository.findByCode(bookingCode);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        return booking;
    }
    static async getAllBookings(options) {
        return BookingRepository.findAll(options);
    }
    static async updateBookingStatus(id, newStatus, changedBy, reason) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        const oldStatus = booking.status;
        if (oldStatus === newStatus) {
            return booking;
        }
        // Update booking status
        const updated = await BookingRepository.update(id, { status: newStatus });
        // Insert history
        await BookingRepository.addStatusHistory(id, newStatus, changedBy, reason);
        // Adjust vehicle status depending on status transition
        if (newStatus === 'ACTIVE') {
            await VehicleRepository.update(booking.vehicle_id, { status: 'RENTED' });
        }
        else if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(newStatus)) {
            await VehicleRepository.update(booking.vehicle_id, { status: 'AVAILABLE' });
        }
        else if (newStatus === 'CONFIRMED') {
            await VehicleRepository.update(booking.vehicle_id, { status: 'RESERVED' });
        }
        // Send notification
        await NotificationRepository.create({
            user_id: booking.customer_id,
            title: 'Cập nhật đơn đặt xe',
            content: `Đơn đặt xe của bạn (${booking.booking_code}) đã chuyển sang trạng thái: ${newStatus}.`,
            type: 'BOOKING',
        });
        // Audit Log
        await AuditService.log({
            userId: changedBy,
            action: 'BOOKING_STATUS_CHANGE',
            entityName: 'bookings',
            entityId: id,
            oldValues: { status: oldStatus },
            newValues: { status: newStatus, reason: reason || null },
        });
        logBooking(id.toString(), newStatus, `Thay đổi trạng thái từ ${oldStatus}. Lý do: ${reason || 'N/A'}`);
        return BookingRepository.findById(id);
    }
    static async createHandover(bookingId, recordedBy, data) {
        const booking = await BookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        }
        // Calculate total surcharge
        const lateFee = data.late_fee || 0;
        const extraKmFee = data.extra_km_fee || 0;
        const fuelFee = data.fuel_fee || 0;
        const cleaningFee = data.cleaning_fee || 0;
        const damageFee = data.damage_fee || 0;
        const totalSurcharge = lateFee + extraKmFee + fuelFee + cleaningFee + damageFee;
        // Create handover record
        const handover = await BookingRepository.createHandoverRecord(bookingId, {
            booking_id: bookingId,
            record_type: data.record_type,
            recorded_by: recordedBy,
            mileage: data.mileage,
            fuel_level: data.fuel_level,
            vehicle_condition: data.vehicle_condition || 'GOOD',
            damage_description: data.damage_description || null,
            late_fee: new Prisma.Decimal(lateFee),
            extra_km_fee: new Prisma.Decimal(extraKmFee),
            fuel_fee: new Prisma.Decimal(fuelFee),
            cleaning_fee: new Prisma.Decimal(cleaningFee),
            damage_fee: new Prisma.Decimal(damageFee),
            total_surcharge: new Prisma.Decimal(totalSurcharge),
            refundable_deposit: new Prisma.Decimal(data.refundable_deposit || 0),
            note: data.note || null,
        });
        // Update vehicle mileage
        await VehicleRepository.update(booking.vehicle_id, { current_mileage: data.mileage });
        // Transition booking state automatically
        if (data.record_type === 'PICKUP') {
            await this.updateBookingStatus(bookingId, 'ACTIVE', recordedBy, 'Đã ký biên bản giao xe (PICKUP)');
        }
        else {
            // For return, update surcharges on booking
            const newSurcharge = Number(booking.surcharge_amount || 0) + totalSurcharge;
            const newTotal = Number(booking.total_amount) + totalSurcharge;
            await BookingRepository.update(bookingId, {
                surcharge_amount: new Prisma.Decimal(newSurcharge),
                total_amount: new Prisma.Decimal(newTotal),
            });
            await this.updateBookingStatus(bookingId, 'COMPLETED', recordedBy, 'Đã ký biên bản nhận lại xe (RETURN)');
        }
        return handover;
    }
    static async updateBooking(id, data, userId) {
        const booking = await BookingRepository.findById(id);
        if (!booking)
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        const updatedData = { ...data };
        if (data.pickup_datetime)
            updatedData.pickup_datetime = new Date(data.pickup_datetime);
        if (data.return_datetime)
            updatedData.return_datetime = new Date(data.return_datetime);
        if (data.rental_fee)
            updatedData.rental_fee = new Prisma.Decimal(data.rental_fee);
        if (data.service_fee)
            updatedData.service_fee = new Prisma.Decimal(data.service_fee);
        if (data.deposit_amount)
            updatedData.deposit_amount = new Prisma.Decimal(data.deposit_amount);
        if (data.total_amount)
            updatedData.total_amount = new Prisma.Decimal(data.total_amount);
        const updated = await BookingRepository.update(id, updatedData);
        await AuditService.log({
            userId,
            action: 'UPDATE_BOOKING',
            entityName: 'bookings',
            entityId: id,
            newValues: data,
        });
        return updated;
    }
    static async deleteBooking(id, userId) {
        const booking = await BookingRepository.findById(id);
        if (!booking)
            throw new NotFoundError('Không tìm thấy đơn đặt xe');
        await BookingRepository.delete(id);
        await AuditService.log({
            userId,
            action: 'DELETE_BOOKING',
            entityName: 'bookings',
            entityId: id,
            newValues: { deleted: true },
        });
    }
}
