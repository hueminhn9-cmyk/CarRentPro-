import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { AuditService } from '../services/audit.service.js';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = registerSchema.parse(req.body);
      const result = await AuthService.register({
        email: validatedBody.email,
        password_hash: validatedBody.password,
        full_name: validatedBody.fullName,
        phone: validatedBody.phone,
      });

      // Audit Log
      await AuditService.log({
        userId: result.id,
        action: 'REGISTER',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
        newValues: { email: result.email },
      });

      return ApiResponse.created(res, 'Đăng ký tài khoản thành công', serializeBigInt(result));
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedBody.email, validatedBody.password);

      // Audit Log
      await AuditService.log({
        userId: result.user.id,
        action: 'LOGIN',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
        newValues: { email: result.user.email },
      });

      return ApiResponse.success(res, 'Đăng nhập thành công', serializeBigInt(result));
    } catch (error) {
      next(error);
    }
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token là bắt buộc', 400);
      }

      let userId: bigint | undefined;
      try {
        const decoded: any = jwt.decode(refreshToken);
        if (decoded && decoded.id) {
          userId = BigInt(decoded.id);
        }
      } catch {}

      await AuthService.logout(refreshToken);

      // Audit Log
      await AuditService.log({
        userId,
        action: 'LOGOUT',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });

      return ApiResponse.success(res, 'Đăng xuất thành công');
    } catch (error) {
      next(error);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token là bắt buộc', 400);
      }

      const result = await AuthService.refreshToken(refreshToken);
      return ApiResponse.success(res, 'Làm mới token thành công', serializeBigInt(result));
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = forgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(validatedBody.email);

      return ApiResponse.success(res, result.message, serializeBigInt({ resetToken: result.resetToken }));
    } catch (error) {
      next(error);
    }
  };

  static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(validatedBody.token, validatedBody.password);

      return ApiResponse.success(res, 'Đặt lại mật khẩu thành công');
    } catch (error) {
      next(error);
    }
  };

  static getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
    try {
      // req.user is populated by authenticate middleware
      return ApiResponse.success(res, 'Lấy thông tin người dùng thành công', serializeBigInt(req.user));
    } catch (error) {
      next(error);
    }
  };

  static changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedBody = changePasswordSchema.parse(req.body);
      const userId = req.user!.id;

      await AuthService.changePassword(userId, validatedBody.oldPassword, validatedBody.newPassword);

      // Audit Log
      await AuditService.log({
        userId,
        action: 'CHANGE_PASSWORD',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });

      return ApiResponse.success(res, 'Thay đổi mật khẩu thành công');
    } catch (error) {
      next(error);
    }
  };
}
