import { ContractService } from '../services/contract.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createContractSchema, updateContractSchema } from '../validators/contract.validator.js';
export class ContractController {
    static getContractById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const contract = await ContractService.getContractById(id);
            // Customer check
            if (req.user.role === 'CUSTOMER' && contract.bookings.customer_id !== req.user.id) {
                return ApiResponse.error(res, 'Bạn không có quyền truy cập hợp đồng này', 403);
            }
            return ApiResponse.success(res, 'Lấy chi tiết hợp đồng thành công', serializeBigInt(contract));
        }
        catch (error) {
            next(error);
        }
    };
    static getContractByBookingId = async (req, res, next) => {
        try {
            const bookingId = BigInt(req.params.bookingId);
            const contract = await ContractService.getContractByBookingId(bookingId);
            return ApiResponse.success(res, 'Lấy chi tiết hợp đồng thành công', serializeBigInt(contract));
        }
        catch (error) {
            next(error);
        }
    };
    static getAllContracts = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['contract_code']);
            if (req.user.role === 'CUSTOMER') {
                prismaOptions.where = {
                    ...prismaOptions.where,
                    bookings: {
                        customer_id: req.user.id,
                    },
                };
            }
            const { contracts, total } = await ContractService.getAllContracts(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách hợp đồng thành công', {
                contracts: serializeBigInt(contracts),
                pagination: {
                    total,
                    ...pagination,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static signContract = async (req, res, next) => {
        try {
            const { bookingCode, contractUrl } = req.body;
            if (!bookingCode) {
                return ApiResponse.error(res, 'Mã đơn đặt xe (bookingCode) là bắt buộc', 400);
            }
            const contract = await ContractService.signContract(bookingCode, contractUrl);
            return ApiResponse.success(res, 'Ký hợp đồng thành công', serializeBigInt(contract));
        }
        catch (error) {
            next(error);
        }
    };
    static updateContract = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validated = updateContractSchema.parse(req.body);
            const updated = await ContractService.updateContract(id, validated);
            return ApiResponse.success(res, 'Cập nhật hợp đồng thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static previewContract = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const contract = await ContractService.getContractById(id);
            // Customer check
            if (req.user.role === 'CUSTOMER' && contract.bookings.customer_id !== req.user.id) {
                return ApiResponse.error(res, 'Bạn không có quyền truy cập hợp đồng này', 403);
            }
            const html = await ContractService.getContractHTML(id);
            res.setHeader('Content-Type', 'text/html');
            return res.send(html);
        }
        catch (error) {
            next(error);
        }
    };
    static downloadContract = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const contract = await ContractService.getContractById(id);
            // Customer check
            if (req.user.role === 'CUSTOMER' && contract.bookings.customer_id !== req.user.id) {
                return ApiResponse.error(res, 'Bạn không có quyền truy cập hợp đồng này', 403);
            }
            const html = await ContractService.getContractHTML(id);
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', `attachment; filename="HopDong-${contract.contract_code}.html"`);
            return res.send(html);
        }
        catch (error) {
            next(error);
        }
    };
    static createContract = async (req, res, next) => {
        try {
            const validated = createContractSchema.parse(req.body);
            const contract = await ContractService.createContract(validated);
            return ApiResponse.created(res, 'Tạo hợp đồng thành công', serializeBigInt(contract));
        }
        catch (error) {
            next(error);
        }
    };
    static deleteContract = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await ContractService.deleteContract(id);
            return ApiResponse.success(res, 'Xóa hợp đồng thành công');
        }
        catch (error) {
            next(error);
        }
    };
}
