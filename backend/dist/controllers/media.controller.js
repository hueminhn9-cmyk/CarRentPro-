import { MediaService } from '../services/media.service.js';
import { QueryHelper } from '../helpers/query.helper.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { serializeBigInt } from '../utils/bigintSerializer.js';
import { media_files_entity_type, media_files_category } from '@prisma/client';
import { BadRequestError } from '../utils/errors.js';
import { updateMediaSchema } from '../validators/media.validator.js';
import path from 'path';
export class MediaController {
    static uploadFile = async (req, res, next) => {
        try {
            if (!req.file) {
                throw new BadRequestError('Không tìm thấy tệp tin được tải lên');
            }
            const { entityType, entityId, category, description } = req.body;
            if (!entityType || !entityId) {
                throw new BadRequestError('entityType và entityId là bắt buộc');
            }
            // Validate entityType is valid enum value
            const allowedEntityTypes = Object.keys(media_files_entity_type);
            if (!allowedEntityTypes.includes(entityType)) {
                throw new BadRequestError(`entityType không hợp lệ. Phải là một trong: ${allowedEntityTypes.join(', ')}`);
            }
            // Check category if present
            if (category) {
                const allowedCategories = Object.keys(media_files_category);
                if (!allowedCategories.includes(category)) {
                    throw new BadRequestError(`category không hợp lệ. Phải là một trong: ${allowedCategories.join(', ')}`);
                }
            }
            const fileExtension = path.extname(req.file.originalname).toLowerCase();
            // Store relative path for frontend compatibility (or full serving path)
            const relativePath = path.posix.join('uploads', req.file.filename);
            const media = await MediaService.uploadFile({
                entity_type: entityType,
                entity_id: BigInt(entityId),
                category: category,
                original_name: req.file.originalname,
                stored_name: req.file.filename,
                file_extension: fileExtension,
                mime_type: req.file.mimetype,
                file_size: req.file.size,
                file_path: relativePath,
                uploaded_by: req.user?.id,
                description: description,
            });
            return ApiResponse.created(res, 'Tải lên tệp tin thành công', serializeBigInt(media));
        }
        catch (error) {
            next(error);
        }
    };
    static getEntityFiles = async (req, res, next) => {
        try {
            const entityType = req.params.entityType;
            const entityId = BigInt(req.params.entityId);
            const allowedEntityTypes = Object.keys(media_files_entity_type);
            if (!allowedEntityTypes.includes(entityType)) {
                throw new BadRequestError(`entityType không hợp lệ.`);
            }
            const files = await MediaService.getEntityFiles(entityType, entityId);
            return ApiResponse.success(res, 'Lấy danh sách tệp tin thành công', serializeBigInt(files));
        }
        catch (error) {
            next(error);
        }
    };
    static setPrimaryImage = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const updated = await MediaService.setPrimaryImage(id);
            return ApiResponse.success(res, 'Thiết lập ảnh chính thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
    static deleteFile = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            await MediaService.deleteFile(id);
            return ApiResponse.success(res, 'Xóa tệp tin thành công');
        }
        catch (error) {
            next(error);
        }
    };
    static getAllFiles = async (req, res, next) => {
        try {
            const { prismaOptions, pagination } = QueryHelper.parse(req.query, ['original_name', 'stored_name', 'description']);
            const { media, total } = await MediaService.getAllFiles(prismaOptions);
            return ApiResponse.success(res, 'Lấy danh sách tệp tin thành công', {
                media: serializeBigInt(media),
                pagination: { total, ...pagination },
            });
        }
        catch (error) {
            next(error);
        }
    };
    static getFileById = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const file = await MediaService.getFileById(id);
            return ApiResponse.success(res, 'Lấy chi tiết tệp tin thành công', serializeBigInt(file));
        }
        catch (error) {
            next(error);
        }
    };
    static updateFile = async (req, res, next) => {
        try {
            const id = BigInt(req.params.id);
            const validated = updateMediaSchema.parse(req.body);
            const updated = await MediaService.updateFile(id, validated);
            return ApiResponse.success(res, 'Cập nhật thông tin tệp tin thành công', serializeBigInt(updated));
        }
        catch (error) {
            next(error);
        }
    };
}
