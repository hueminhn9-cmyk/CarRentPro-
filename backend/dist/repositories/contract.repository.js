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
    static async sign(bookingCode, contractUrl) {
        const contract = await prisma.contracts.findFirst({
            where: { bookings: { booking_code: bookingCode } }
        });
        if (!contract)
            return null;
        return prisma.contracts.update({
            where: { id: contract.id },
            data: {
                status: 'SIGNED',
                signed_at: new Date(),
                contract_url: contractUrl || contract.contract_url,
            }
        });
    }
    static async delete(id) {
        return prisma.contracts.delete({
            where: { id },
        });
    }
}
