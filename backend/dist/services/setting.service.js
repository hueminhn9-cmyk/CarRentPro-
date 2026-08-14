import { SettingRepository } from '../repositories/setting.repository.js';
import { NotFoundError } from '../utils/errors.js';
export class SettingService {
    static async getSettingByKey(key) {
        const setting = await SettingRepository.findByKey(key);
        if (!setting) {
            throw new NotFoundError(`Không tìm thấy cấu hình với mã: ${key}`);
        }
        return setting;
    }
    static async getAllSettings() {
        return SettingRepository.findAll();
    }
    static async updateSetting(key, value, description) {
        return SettingRepository.update(key, value, description);
    }
    static async createSetting(key, value, description) {
        const existing = await SettingRepository.findByKey(key);
        if (existing) {
            throw new Error(`Cấu hình với mã: ${key} đã tồn tại`);
        }
        return SettingRepository.update(key, value, description);
    }
    static async deleteSetting(key) {
        const existing = await SettingRepository.findByKey(key);
        if (!existing) {
            throw new NotFoundError(`Không tìm thấy cấu hình với mã: ${key}`);
        }
        return SettingRepository.delete(key);
    }
}
