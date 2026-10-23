import { ContractRepository } from '../repositories/contract.repository.js';
import { generateContractHTML } from '../helpers/contract.helper.js';
import { NotFoundError } from '../utils/errors.js';
export class ContractService {
    static async getContractById(id) {
        const contract = await ContractRepository.findById(id);
        if (!contract) {
            throw new NotFoundError('Không tìm thấy hợp đồng');
        }
        return contract;
    }
    static async getContractByBookingId(bookingId) {
        let contract = await ContractRepository.findByBookingId(bookingId);
        if (!contract) {
            const booking = await ContractRepository.findById(bookingId); // or check if booking exists
            contract = await ContractRepository.create({
                booking_id: bookingId,
                contract_code: `HD-${Date.now().toString().slice(-6)}`,
                status: 'PENDING_SIGN',
            });
        }
        return ContractRepository.findById(contract.id);
    }
    static async getAllContracts(options) {
        return ContractRepository.findAll(options);
    }
    static async signContract(bookingCode, contractUrl) {
        const contract = await ContractRepository.sign(bookingCode, contractUrl);
        if (!contract) {
            throw new NotFoundError('Không tìm thấy hợp đồng để ký');
        }
        return contract;
    }
    static async updateContract(id, data) {
        const contract = await ContractRepository.findById(id);
        if (!contract) {
            throw new NotFoundError('Không tìm thấy hợp đồng');
        }
        return ContractRepository.update(id, data);
    }
    static async getContractHTML(id) {
        const contract = await ContractRepository.findById(id);
        if (!contract) {
            throw new NotFoundError('Không tìm thấy hợp đồng');
        }
        return generateContractHTML(contract);
    }
    static async createContract(data) {
        const existing = await ContractRepository.findByBookingId(BigInt(data.booking_id));
        if (existing) {
            throw new Error('Đơn đặt xe này đã có hợp đồng');
        }
        return ContractRepository.create({
            booking_id: BigInt(data.booking_id),
            contract_code: data.contract_code,
            status: data.status || 'PENDING_SIGN',
            contract_url: data.contract_url || null,
        });
    }
    static async deleteContract(id) {
        const contract = await ContractRepository.findById(id);
        if (!contract) {
            throw new NotFoundError('Không tìm thấy hợp đồng');
        }
        return ContractRepository.delete(id);
    }
}
