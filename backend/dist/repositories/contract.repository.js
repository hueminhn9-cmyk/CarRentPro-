import { prisma } from '../config/prisma.js';
export class ContractRepository {
    static async findById(id) {
        return prisma.contracts.findUnique({
            where: { id },
            include: {
                bookings: {
                    include: {
                        users: { select: { id: true, full_name: true, email: true, phone: true } },
                        vehicles: true,
                    }
                }
            }
        });
    }
    static async findByBookingId(bookingId) {
        return prisma.contracts.findUnique({
            where: { booking_id: bookingId },
        });
    }
    static async findByCode(contract_code) {
        return prisma.contracts.findUnique({
            where: { contract_code },
        });
    }
    static async findAll(options) {
        const [contracts, total] = await Promise.all([
            prisma.contracts.findMany({
                ...options,
                include: {
                    bookings: {
                        select: {
                            booking_code: true,
                            pickup_datetime: true,
                            return_datetime: true,
                            total_amount: true,
                            users: { select: { full_name: true } },
                            vehicles: { select: { name: true, license_plate: true } }
                        }
                    }
                }
            }),
            prisma.contracts.count({ where: options.where }),
        ]);
        return { contracts, total };
    }
    static async create(data) {
        return prisma.contracts.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma.contracts.update({
            where: { id },
            data,
        });
    }
    static async sign(identifier, contractUrl) {
        let contract = null;
        if (!isNaN(Number(identifier))) {
            contract = await prisma.contracts.findUnique({
                where: { id: BigInt(identifier) }
            });
        }
        if (!contract) {
            contract = await prisma.contracts.findFirst({
                where: { bookings: { booking_code: identifier } }
            });
        }
        if (!contract && !isNaN(Number(identifier))) {
            const booking = await prisma.bookings.findUnique({
                where: { id: BigInt(identifier) }
            });
            if (booking) {
                contract = await prisma.contracts.create({
                    data: {
                        booking_id: booking.id,
                        contract_code: `HD-${booking.booking_code}`,
                        status: 'PENDING_SIGN',
                    }
                });
            }
        }
        if (!contract)
            return null;
        return await prisma.$transaction(async (tx) => {
            const updatedContract = await tx.contracts.update({
                where: { id: contract.id },
                data: {
                    status: 'SIGNED',
                    signed_at: new Date(),
                    contract_url: contractUrl || contract.contract_url,
                },
                include: {
                    bookings: {
                        include: {
                            users: { select: { id: true, full_name: true, email: true, phone: true } },
                            vehicles: true,
                        }
                    }
                }
            });
            const currentBooking = await tx.bookings.findUnique({
                where: { id: contract.booking_id }
            });
            if (currentBooking && (currentBooking.status === 'CONFIRMED' || currentBooking.status === 'PENDING')) {
                await tx.bookings.update({
                    where: { id: contract.booking_id },
                    data: { status: 'READY_FOR_PICKUP' }
                });
                await tx.booking_status_history.create({
                    data: {
                        booking_id: contract.booking_id,
                        status: 'READY_FOR_PICKUP',
                        changed_by: currentBooking.customer_id,
                        reason: 'Khách hàng ký hợp đồng điện tử thành công - Chuyển sang Chờ nhận xe (READY_FOR_PICKUP)',
                    }
                });
            }
            return updatedContract;
        });
    }
    static async delete(id) {
        return prisma.contracts.delete({
            where: { id },
        });
    }
}
