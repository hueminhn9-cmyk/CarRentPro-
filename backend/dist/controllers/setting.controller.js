import { SettingService } from '../services/setting.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { createSettingSchema, updateSettingSchema } from '../validators/setting.validator.js';
export class SettingController {
    static getSettingByKey = async (req, res, next) => {
        try {
            const key = req.params.key;
            const setting = await SettingService.getSettingByKey(key);
            return ApiResponse.success(res, 'Lấy cấu hình thành công', serializeBigInt(setting));
        }
        catch (error) {
            next(error);
        }
    };
    static getAllSettings = async (req, res, next) => {
        try {
            const settings = await SettingService.getAllSettings();
            return ApiResponse.success(res, 'Lấy toàn bộ cấu hình thành công', serializeBigInt(settings));
        }
        catch (error) {
            next(error);
        }
    };
    static updateSetting = async (req, res, next) => {
        try {
            const key = req.params.key;
            const validated = updateSettingSchema.parse(req.body);
            const updated = await SettingService.updateSetting(key, validated.value, validated.description ?? undefined);
            return ApiResponse.success(res, 'Cập nhật cấu hình thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static createSetting = async (req, res, next) => {
        try {
            const validated = createSettingSchema.parse(req.body);
            const setting = await SettingService.createSetting(validated.key, validated.value, validated.description ?? undefined);
            return ApiResponse.created(res, 'Tạo cấu hình thành công', serializeBigInt(setting));
        }
        catch (error) {
            next(error);
        }
    };
    static deleteSetting = async (req, res, next) => {
        try {
            const key = req.params.key;
            await SettingService.deleteSetting(key);
            return ApiResponse.success(res, 'Xóa cấu hình thành công');
        }
        catch (error) {
            next(error);
        }
    };
}
