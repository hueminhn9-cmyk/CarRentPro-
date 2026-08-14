import { MediaRepository } from '../repositories/media.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { media_files_entity_type, media_files_category } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export class MediaService {
  static async uploadFile(data: {
    entity_type: media_files_entity_type;
    entity_id: bigint;
    category?: media_files_category;
    original_name: string;
    stored_name: string;
    file_extension?: string;
    mime_type?: string;
    file_size?: number;
    file_path: string;
    uploaded_by?: bigint;
    description?: string;
  }) {
    // If it's the first image for this entity, default to primary
    const existing = await MediaRepository.findByEntity(data.entity_type, data.entity_id);
    const isPrimary = existing.length === 0;

    return MediaRepository.create({
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      media_type: this.resolveMediaType(data.mime_type),
      category: data.category || 'OTHER',
      original_name: data.original_name,
      stored_name: data.stored_name,
      file_extension: data.file_extension || null,
      mime_type: data.mime_type || null,
      file_size: data.file_size ? BigInt(data.file_size) : 0n,
      file_path: data.file_path,
      is_primary: isPrimary,
      uploaded_by: data.uploaded_by || null,
      description: data.description || null,
    });
  }

  static async getEntityFiles(entityType: media_files_entity_type, entityId: bigint) {
    return MediaRepository.findByEntity(entityType, entityId);
  }

  static async setPrimaryImage(id: bigint) {
    const media = await MediaRepository.findById(id);
    if (!media) {
      throw new NotFoundError('Không tìm thấy tệp tin');
    }
    return MediaRepository.setPrimary(id, media.entity_type, media.entity_id);
  }

  static async deleteFile(id: bigint) {
    const media = await MediaRepository.findById(id);
    if (!media) {
      throw new NotFoundError('Không tìm thấy tệp tin');
    }

    // Delete record from DB
    await MediaRepository.delete(id);

    // Attempt to delete physical file from disk
    try {
      const absolutePath = path.resolve(media.file_path);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      // Log error but don't crash, DB record is already deleted
      console.error(`Lỗi khi xóa file vật lý: ${err}`);
    }

    return true;
  }

  static async getAllFiles(options: any) {
    return MediaRepository.findAll(options);
  }

  static async getFileById(id: bigint) {
    const file = await MediaRepository.findById(id);
    if (!file) throw new NotFoundError('Không tìm thấy tệp tin');
    return file;
  }

  static async updateFile(id: bigint, data: any) {
    const file = await MediaRepository.findById(id);
    if (!file) throw new NotFoundError('Không tìm thấy tệp tin');
    
    const updatedData = { ...data };
    if (data.entity_id) updatedData.entity_id = BigInt(data.entity_id);
    if (data.file_size) updatedData.file_size = BigInt(data.file_size);
    if (data.uploaded_by) updatedData.uploaded_by = BigInt(data.uploaded_by);

    return MediaRepository.update(id, updatedData);
  }

  private static resolveMediaType(mimeType?: string): 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' {
    if (!mimeType) return 'IMAGE';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType === 'application/pdf') return 'PDF';
    return 'DOCUMENT';
  }
}
