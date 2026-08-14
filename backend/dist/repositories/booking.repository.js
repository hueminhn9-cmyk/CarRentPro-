import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';
export class BookingRepository {
    static async findById(id) {
        return prisma.bookings.findUnique({
            where: { id },
            include: {
                users: {
                    select: { id: true, full_name: true, email: true, phone: true }
                },
                vehicles: {
                    include: { vehicle_categories: true }
                },
                booking_services: true,
                booking_status_history: {
                    orderBy: { created_at: 'desc' },
                    include: {
                        users: { select: { id: true, full_name: true, role: true } }
                    }
                },
                handover_records: true,
                contracts: true,
                payments: true,
                reviews: true,
            },
        });
    }
    static async findByCode(booking_code) {
        return prisma.bookings.findUnique({
            where: { booking_code },
            include: {
                booking_services: true,
                contracts: true,
            }
        });
    }
    static async findAll(options) {
        const [bookings, total] = await Promise.all([
            prisma.bookings.findMany({
                ...options,
                include: {
                    users: {
                        select: { id: true, full_name: true, email: true, phone: true }
                    },
                    vehicles: true,
                    payments: true,
                },
            }),
            prisma.bookings.count({ where: options.where }),
        ]);
        return { bookings, total };
    }
    static async create(bookingData, services) {
        return prisma.$transaction(async (tx) => {
            // 1. Create booking
            const booking = await tx.bookings.create({
                data: bookingData,
            });
            // 2. Create services if any
            if (services && services.length > 0) {
                const servicesData = services.map((srv) => ({
                    booking_id: booking.id,
                    service_name: srv.service_name,
                    quantity: srv.quantity,
                    unit_price: new Prisma.Decimal(srv.unit_price),
                    total_price: new Prisma.Decimal(srv.quantity * srv.unit_price),
                }));
                await tx.booking_services.createMany({
                    data: servicesData,
                });
            }
            // 3. Create initial status history entry
            await tx.booking_status_history.create({
                data: {
                    booking_id: booking.id,
                    status: booking.status || 'PENDING',
                    changed_by: booking.customer_id,
                    reason: 'Khởi tạo đơn đặt xe',
                },
            });
            return booking;
        });
    }
    static async update(id, bookingData) {
        return prisma.bookings.update({
            where: { id },
            data: bookingData,
        });
    }
    static async delete(id) {
        return prisma.bookings.delete({
            where: { id },
        });
    }
    static async addStatusHistory(bookingId, status, changedBy, reason) {
        return prisma.booking_status_history.create({
            data: {
                booking_id: bookingId,
                status,
                changed_by: changedBy,
                reason,
            },
        });
    }
    static async createHandoverRecord(bookingId, recordData) {
        return prisma.handover_records.create({
            data: recordData,
        });
    }
    static async findHandoverByBookingId(bookingId) {
        return prisma.handover_records.findMany({
            where: { booking_id: bookingId },
            include: {
                users: { select: { id: true, full_name: true } }
            }
        });
    }
    static async isVehicleAvailable(vehicleId, pickup, returnDate) {
        const overlappingBooking = await prisma.bookings.findFirst({
            where: {
                vehicle_id: vehicleId,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'READY_FOR_PICKUP', 'ACTIVE', 'WAITING_FOR_RETURN', 'OVERDUE'],
                },
                pickup_datetime: {
                    lt: returnDate,
                },
                return_datetime: {
                    gt: pickup,
                },
            },
        });
        return !overlappingBooking;
    }
}
