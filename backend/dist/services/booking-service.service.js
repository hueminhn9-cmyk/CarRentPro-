import { BookingServiceRepository } from '../repositories/booking-service.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { Prisma } from '@prisma/client';
export class BookingServiceService {
    static async getById(id) {
        const service = await BookingServiceRepository.findById(id);
        if (!service)
            throw new NotFoundError('Không tìm thấy dịch vụ của đơn đặt xe');
        return service;
    }
    static async getAll(options) {
        return BookingServiceRepository.findAll(options);
    }
    static async create(data) {
        const totalPrice = data.quantity * data.unit_price;
        return BookingServiceRepository.create({
            ...data,
            total_price: new Prisma.Decimal(totalPrice),
            unit_price: new Prisma.Decimal(data.unit_price),
        });
    }
    static async update(id, data) {
        const service = await BookingServiceRepository.findById(id);
        if (!service)
            throw new NotFoundError('Không tìm thấy dịch vụ của đơn đặt xe');
        const updatedData = { ...data };
        if (data.quantity !== undefined || data.unit_price !== undefined) {
            const qty = data.quantity !== undefined ? data.quantity : service.quantity;
            const price = data.unit_price !== undefined ? Number(data.unit_price) : Number(service.unit_price);
            updatedData.total_price = new Prisma.Decimal(qty * price);
        }
        if (data.unit_price !== undefined) {
            updatedData.unit_price = new Prisma.Decimal(data.unit_price);
        }
        return BookingServiceRepository.update(id, updatedData);
    }
    static async delete(id) {
        const service = await BookingServiceRepository.findById(id);
        if (!service)
            throw new NotFoundError('Không tìm thấy dịch vụ của đơn đặt xe');
        return BookingServiceRepository.delete(id);
    }
}
