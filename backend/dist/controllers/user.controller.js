import { UserService } from '../services/user.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { updateUserSchema, updateCustomerProfileSchema } from '../validators/user.validator.js';
export class UserController {
    static getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await UserService.getUserProfile(userId);
            return ApiResponse.success(res, 'Lấy hồ sơ cá nhân thành công', serializeBigInt(profile));
        }
        catch (error) {
            next(error);
        }
    };
    static getUserById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const user = await UserService.getUserProfile(id);
            return ApiResponse.success(res, 'Lấy thông tin người dùng thành công', serializeBigInt(user));
        }
        catch (error) {
            next(error);
        }
    };
    static getAllUsers = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['full_name', 'email', 'phone']);
            const { users, total } = await UserService.getAllUsers(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách người dùng thành công', {
                users: serializeBigInt(users),
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
    static updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const validatedBody = updateUserSchema.parse(req.body);
            const updated = await UserService.updateUser(userId, validatedBody);
            return ApiResponse.success(res, 'Cập nhật hồ sơ cá nhân thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static updateUserAdmin = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validatedBody = updateUserSchema.parse(req.body);
            const updated = await UserService.updateUser(id, validatedBody);
            return ApiResponse.success(res, 'Cập nhật tài khoản người dùng thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static updateCustomerDetails = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const validatedBody = updateCustomerProfileSchema.parse(req.body);
            // Map ISO strings back to dates if present
            const customerData = { ...validatedBody };
            if (validatedBody.date_of_birth) {
                customerData.date_of_birth = new Date(validatedBody.date_of_birth);
            }
            if (validatedBody.driver_license_expiry) {
                customerData.driver_license_expiry = new Date(validatedBody.driver_license_expiry);
            }
            const updated = await UserService.updateCustomerProfile(userId, customerData);
            return ApiResponse.success(res, 'Cập nhật thông tin khách hàng thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static verifyCustomer = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const { status } = req.body;
            if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
                return ApiResponse.error(res, 'Trạng thái xác thực không hợp lệ', 400);
            }
            const updated = await UserService.verifyCustomer(id, status);
            return ApiResponse.success(res, 'Cập nhật trạng thái xác thực thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static deleteUser = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await UserService.deleteUser(id);
            return ApiResponse.success(res, 'Xóa tài khoản người dùng thành công (Soft Delete)');
        }
        catch (error) {
            next(error);
        }
    };
    static uploadAvatar = async (req, res, next) => {
        try {
            if (!req.file) {
                return ApiResponse.error(res, 'Không tìm thấy tệp tin được tải lên', 400);
            }
            const userId = req.user.id;
            const relativePath = `uploads/${req.file.filename}`;
            const updatedUser = await UserService.updateUser(userId, {
                avatar_url: relativePath,
            });
            return ApiResponse.success(res, 'Tải lên ảnh đại diện thành công', serializeBigInt(updatedUser));
        }
        catch (error) {
            next(error);
        }
    };
    static createUser = async (req, res, next) => {
        try {
            const { email, password, full_name, phone, role, status } = req.body;
            if (!email || !password || !full_name) {
                return ApiResponse.error(res, 'Email, mật khẩu và tên đầy đủ là bắt buộc', 400);
            }
            const user = await UserService.createUser({ email, password, full_name, phone, role, status });
            return ApiResponse.created(res, 'Tạo người dùng thành công', serializeBigInt(user));
        }
        catch (error) {
            next(error);
        }
    };
}
