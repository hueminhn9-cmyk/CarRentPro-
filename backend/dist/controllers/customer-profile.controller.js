import { CustomerProfileService } from '../services/customer-profile.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createCustomerProfileSchema, updateCustomerProfileSchema } from '../validators/customer-profile.validator.js';
export class CustomerProfileController {
    static getById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const profile = await CustomerProfileService.getById(id);
            return ApiResponse.success(res, 'Lấy chi tiết hồ sơ khách hàng thành công', serializeBigInt(profile));
        }
        catch (error) {
            next(error);
        }
    };
    static getAll = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['address', 'citizen_id', 'driver_license_number']);
            const { profiles, total } = await CustomerProfileService.getAll(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách hồ sơ khách hàng thành công', {
                profiles: serializeBigInt(profiles),
                pagination: { total, ...pagination },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static create = async (req, res, next) => {
        try {
            const validatedBody = createCustomerProfileSchema.parse(req.body);
            const profileData = { ...validatedBody };
            if (validatedBody.date_of_birth)
                profileData.date_of_birth = new Date(validatedBody.date_of_birth);
            if (validatedBody.driver_license_expiry)
                profileData.driver_license_expiry = new Date(validatedBody.driver_license_expiry);
            const profile = await CustomerProfileService.create(profileData);
            return ApiResponse.created(res, 'Tạo hồ sơ khách hàng thành công', serializeBigInt(profile));
        }
        catch (error) {
            next(error);
        }
    };
    static update = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validatedBody = updateCustomerProfileSchema.parse(req.body);
            const profileData = { ...validatedBody };
            if (validatedBody.date_of_birth)
                profileData.date_of_birth = new Date(validatedBody.date_of_birth);
            if (validatedBody.driver_license_expiry)
                profileData.driver_license_expiry = new Date(validatedBody.driver_license_expiry);
            const profile = await CustomerProfileService.update(id, profileData);
            return ApiResponse.success(res, 'Cập nhật hồ sơ khách hàng thành công', serializeBigInt(profile));
        }
        catch (error) {
            next(error);
        }
    };
    static delete = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await CustomerProfileService.delete(id);
            return ApiResponse.success(res, 'Xóa hồ sơ khách hàng thành công');
        }
        catch (error) {
            next(error);
        }
    };
}
