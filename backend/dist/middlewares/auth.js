import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { prisma } from '../config/prisma.js';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Vui lòng cung cấp token xác thực');
        }
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'autorent_jwt_access_secret_key_2026_super_secure';
        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret);
        }
        catch (err) {
            throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn');
        }
        // Verify user exists and is active in database
        const user = await prisma.users.findUnique({
            where: { id: BigInt(decoded.id) },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
            }
        });
        if (!user) {
            throw new UnauthorizedError('Người dùng không còn tồn tại trên hệ thống');
        }
        if (user.status !== 'ACTIVE') {
            throw new ForbiddenError('Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động');
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError('Người dùng chưa xác thực'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('Bạn không có quyền thực hiện hành động này'));
        }
        next();
    };
};
