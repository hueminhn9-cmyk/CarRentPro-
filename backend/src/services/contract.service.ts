import { ContractRepository } from '../repositories/contract.repository.js';
import { generateContractHTML } from '../helpers/contract.helper.js';
import { NotFoundError } from '../utils/errors.js';

export class ContractService {
  static async getContractById(id: bigint) {
    const contract = await ContractRepository.findById(id);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }
    return contract;
  }

  static async getContractByBookingId(bookingId: bigint) {
    const contract = await ContractRepository.findByBookingId(bookingId);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng của đơn đặt xe này');
    }
    return contract;
  }

  static async getAllContracts(options: any) {
    return ContractRepository.findAll(options);
  }

  static async signContract(bookingCode: string, contractUrl?: string) {
    const contract = await ContractRepository.sign(bookingCode, contractUrl);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng để ký');
    }
    return contract;
  }

  static async updateContract(id: bigint, data: any) {
    const contract = await ContractRepository.findById(id);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }
    return ContractRepository.update(id, data);
  }

  static async getContractHTML(id: bigint): Promise<string> {
    const contract = await ContractRepository.findById(id);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }
    return generateContractHTML(contract);
  }

  static async createContract(data: any) {
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

  static async deleteContract(id: bigint) {
    const contract = await ContractRepository.findById(id);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }
    return ContractRepository.delete(id);
  }
}
