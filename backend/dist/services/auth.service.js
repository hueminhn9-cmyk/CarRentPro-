import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
import { logAuth } from '../utils/logger.js';
export class AuthService {
    static getJwtSettings() {
        return {
            accessSecret: process.env.JWT_SECRET || 'autorent_jwt_access_secret_key_2026_super_secure',
            refreshSecret: process.env.JWT_REFRESH_SECRET || 'autorent_jwt_refresh_secret_key_2026_super_secure_refresh',
            accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        };
    }
    static async register(data) {
        const existingUser = await prisma.users.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new ConflictError('Email đã được đăng ký sử dụng');
        }
        if (data.phone) {
            const existingPhone = await prisma.users.findUnique({
                where: { phone: data.phone },
            });
            if (existingPhone) {
                throw new ConflictError('Số điện thoại đã được đăng ký sử dụng');
            }
        }
        const passwordHash = await bcrypt.hash(data.password_hash, 10);
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.users.create({
                data: {
                    email: data.email,
                    full_name: data.full_name,
                    phone: data.phone || null,
                    password_hash: passwordHash,
                    role: 'CUSTOMER',
                    status: 'ACTIVE',
                },
            });
            await tx.customer_profiles.create({
                data: {
                    user_id: newUser.id,
                    verification_status: 'PENDING',
                },
            });
            return newUser;
        });
        logAuth(`User registered successfully: ${user.email}`);
        return {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
        };
    }
    static async login(email, password_hash) {
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt.compare(password_hash, user.password_hash))) {
            throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
        }
        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedError('Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động');
        }
        const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } = this.getJwtSettings();
        // Sign Access Token
        const accessToken = jwt.sign({ id: user.id.toString(), email: user.email, role: user.role }, accessSecret, { expiresIn: accessExpiresIn });
        // Sign Refresh Token
        const refreshToken = jwt.sign({ id: user.id.toString() }, refreshSecret, { expiresIn: refreshExpiresIn });
        // Decode refresh token to get exact expires_at
        const decodedRefresh = jwt.decode(refreshToken);
        const expiresAt = new Date(decodedRefresh.exp * 1000);
        // Save refresh token in database
        await prisma.refresh_tokens.create({
            data: {
                user_id: user.id,
                token: refreshToken,
                expires_at: expiresAt,
            },
        });
        logAuth(`User logged in: ${user.email}`);
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                avatarUrl: user.avatar_url,
            },
            accessToken,
            refreshToken,
        };
    }
    static async logout(token) {
        await prisma.refresh_tokens.updateMany({
            where: { token },
            data: { is_revoked: true },
        });
        logAuth(`Token logged out / revoked`);
        return true;
    }
    static async refreshToken(oldRefreshToken) {
        const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } = this.getJwtSettings();
        let decoded;
        try {
            decoded = jwt.verify(oldRefreshToken, refreshSecret);
        }
        catch (err) {
            throw new UnauthorizedError('Refresh token không hợp lệ hoặc đã hết hạn');
        }
        const tokenRecord = await prisma.refresh_tokens.findUnique({
            where: { token: oldRefreshToken },
            include: { users: true }
        });
        if (!tokenRecord) {
            throw new UnauthorizedError('Refresh token không tồn tại trên hệ thống');
        }
        // Replay attack protection: if token is already revoked, invalidate all user tokens
        if (tokenRecord.is_revoked) {
            await prisma.refresh_tokens.updateMany({
                where: { user_id: tokenRecord.user_id },
                data: { is_revoked: true },
            });
            logAuth(`Potential refresh token reuse detected for user ID: ${tokenRecord.user_id}. All tokens revoked.`);
            throw new UnauthorizedError('Refresh token này đã được sử dụng. Tất cả các phiên làm việc đã bị đăng xuất vì lý do bảo mật.');
        }
        if (new Date() > tokenRecord.expires_at) {
            throw new UnauthorizedError('Refresh token đã hết hạn');
        }
        const user = tokenRecord.users;
        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedError('Tài khoản đã bị khóa hoặc ngừng hoạt động');
        }
        // 1. Revoke the old refresh token
        await prisma.refresh_tokens.update({
            where: { id: tokenRecord.id },
            data: { is_revoked: true }
        });
        // 2. Generate a new Access Token
        const accessToken = jwt.sign({ id: user.id.toString(), email: user.email, role: user.role }, accessSecret, { expiresIn: accessExpiresIn });
        // 3. Generate a new Refresh Token (Rotation)
        const newRefreshToken = jwt.sign({ id: user.id.toString() }, refreshSecret, { expiresIn: refreshExpiresIn });
        // Decode and save the new refresh token
        const decodedNewRefresh = jwt.decode(newRefreshToken);
        const newExpiresAt = new Date(decodedNewRefresh.exp * 1000);
        await prisma.refresh_tokens.create({
            data: {
                user_id: user.id,
                token: newRefreshToken,
                expires_at: newExpiresAt,
            },
        });
        logAuth(`Token refreshed and rotated for user: ${user.email}`);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    static async forgotPassword(email) {
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            throw new NotFoundError('Không tìm thấy tài khoản với email này');
        }
        // In a real production system, send a password reset email here
        logAuth(`Password reset requested for: ${email}`);
        // We prepare a reset token (fake token / simulation for future setup)
        const resetToken = jwt.sign({ id: user.id.toString(), purpose: 'RESET_PASSWORD' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return {
            message: 'Yêu cầu khôi phục mật khẩu đã được xử lý. Mã token khôi phục được đính kèm (cho thử nghiệm/tích hợp).',
            resetToken,
        };
    }
    static async resetPassword(token, newPasswordHash) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        }
        catch (err) {
            throw new BadRequestError('Token khôi phục mật khẩu không hợp lệ hoặc đã hết hạn');
        }
        if (decoded.purpose !== 'RESET_PASSWORD') {
            throw new BadRequestError('Token không đúng mục đích khôi phục mật khẩu');
        }
        const passwordHash = await bcrypt.hash(newPasswordHash, 10);
        await prisma.users.update({
            where: { id: BigInt(decoded.id) },
            data: { password_hash: passwordHash },
        });
        logAuth(`Password reset successfully for user ID: ${decoded.id}`);
        return true;
    }
    static async changePassword(userId, oldPasswordCheck, newPasswordPlain) {
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundError('Không tìm thấy người dùng');
        }
        const isMatch = await bcrypt.compare(oldPasswordCheck, user.password_hash);
        if (!isMatch) {
            throw new BadRequestError('Mật khẩu cũ không chính xác');
        }
        const newPasswordHash = await bcrypt.hash(newPasswordPlain, 10);
        await prisma.users.update({
            where: { id: userId },
            data: { password_hash: newPasswordHash },
        });
        logAuth(`Password changed successfully for user ID: ${userId}`);
        return true;
    }
}
