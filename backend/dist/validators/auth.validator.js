import { z } from 'zod';
export const registerSchema = z.object({
    email: z.string({ required_error: 'Email là bắt buộc' }).email('Email không đúng định dạng'),
    password: z.string({ required_error: 'Mật khẩu là bắt buộc' }).min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    fullName: z.string({ required_error: 'Họ và tên là bắt buộc' }).min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    phone: z.string().optional().or(z.literal('')),
});
export const loginSchema = z.object({
    email: z.string({ required_error: 'Email là bắt buộc' }).email('Email không đúng định dạng'),
    password: z.string({ required_error: 'Mật khẩu là bắt buộc' }),
});
export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: 'Email là bắt buộc' }).email('Email không đúng định dạng'),
});
export const resetPasswordSchema = z.object({
    token: z.string({ required_error: 'Token là bắt buộc' }),
    password: z.string({ required_error: 'Mật khẩu mới là bắt buộc' }).min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});
export const changePasswordSchema = z.object({
    oldPassword: z.string({ required_error: 'Mật khẩu cũ là bắt buộc' }),
    newPassword: z.string({ required_error: 'Mật khẩu mới là bắt buộc' }).min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});
